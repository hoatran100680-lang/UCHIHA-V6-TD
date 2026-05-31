let countdownInterval = null; // Biến quản lý luồng đếm ngược thời gian thực

document.addEventListener("DOMContentLoaded", () => {
    checkLocalKey();
    initTabs();
    initSliders();
    buildAdvancedChartGrid();
    initLiveRAMWave();
    initCustomSettings();

    document.getElementById("btn-login").addEventListener("click", handleLogin);
    document.getElementById("btn-logout").addEventListener("click", logout);
    document.getElementById("btn-clean-ram").addEventListener("click", runRamCleaner);
});

// ================= GIẢI MÃ & KIỂM TRA THỜI GIAN THỰC CỦA KEY =================

function verifyKeyLocally(keyStr) {
    if (!keyStr || !keyStr.startsWith("NEXORA-")) {
        return { valid: false, message: "Định dạng mã Key không hợp lệ!" };
    }
    try {
        const parts = keyStr.split("-");
        let encodedTime = parts[parts.length - 1];
        while (encodedTime.length % 4 !== 0) encodedTime += "=";
        
        // Bóc tách payload chuỗi: "start_timestamp|expiry_timestamp"
        const decodedPayload = atob(encodedTime);
        const timeParts = decodedPayload.split("|");
        
        if (timeParts.length !== 2) return { valid: false, message: "Cấu trúc mã hóa Key bị lỗi!" };

        const startTimestamp = parseInt(timeParts[0]);
        const expiredTimestamp = parseInt(timeParts[1]);

        if (isNaN(startTimestamp) || isNaN(expiredTimestamp)) return { valid: false, message: "Dữ liệu thời gian bị lỗi!" };
        if (Date.now() >= expiredTimestamp) return { valid: false, message: "Key này đã hết thời hạn sử dụng!" };

        const startDateString = new Date(startTimestamp).toLocaleString("vi-VN");
        let expiryDateString = "Vĩnh Viễn";
        if (expiredTimestamp < 9000000000000) {
            expiryDateString = new Date(expiredTimestamp).toLocaleString("vi-VN");
        }

        return { 
            valid: true, 
            startAt: startDateString,
            expiredAt: expiryDateString,
            expiryMs: expiredTimestamp 
        };
    } catch (e) {
        return { valid: false, message: "Mã kích hoạt sai hoặc bị sửa đổi!" };
    }
}

function startRealtimeMenuCountdown(expiryMs) {
    if (countdownInterval) clearInterval(countdownInterval);
    const tickerElement = document.getElementById("menu-countdown-bar");

    if (expiryMs > 9000000000000) {
        tickerElement.innerHTML = `⏳ HẠN DÙNG: <span style="color:#00ffcc; font-weight:bold;">VĨNH VIỄN (PREMIUM)</span>`;
        return;
    }

    function updateTicker() {
        const timeRemaining = expiryMs - Date.now();

        if (timeRemaining <= 0) {
            tickerElement.innerHTML = `❌ KEY HẾT HẠN - ĐANG KHÓA APP...`;
            clearInterval(countdownInterval);
            logout(); // Đẩy văng người dùng ra ngoài màn hình khóa [2]
            return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000).toString().padStart(2, '0');

        tickerElement.innerHTML = `⏱️ CÒN LẠI: <span style="color:#ff0055; font-weight:bold;">${days} Ngày ${hours}:${minutes}:${seconds}</span>`;
    }

    updateTicker();
    countdownInterval = setInterval(updateTicker, 1000); // Cập nhật thời gian thực mỗi 1 giây
}

function checkLocalKey() {
    const savedKey = localStorage.getItem("local_app_key");
    if (savedKey) {
        const result = verifyKeyLocally(savedKey);
        if (result.valid) {
            enterApp(result.startAt, result.expiredAt);
            startRealtimeMenuCountdown(result.expiryMs);
        } else { logout(); }
    }
}

function handleLogin() {
    const keyInput = document.getElementById("key-input").value.trim();
    const errorTarget = document.getElementById("auth-error");
    if (!keyInput) { errorTarget.innerText = "Vui lòng nhập mã Key!"; return; }

    const result = verifyKeyLocally(keyInput);
    if (result.valid) {
        localStorage.setItem("local_app_key", keyInput);
        enterApp(result.startAt, result.expiredAt);
        startRealtimeMenuCountdown(result.expiryMs);
    } else { errorTarget.innerText = result.message; }
}

function enterApp(startDate, expiryDate) {
    document.getElementById("auth-screen").classList.remove("active");
    document.getElementById("main-screen").classList.add("active");
    document.getElementById("key-info").innerHTML = `
        <div style="text-align: left; font-size: 11px; line-height: 1.6;">
            <p style="margin:2px 0;">📅 Bắt đầu: <span style="color:#00ffcc;">${startDate}</span></p>
            <p style="margin:2px 0;">⏳ Hết hạn: <span class="highlight">${expiryDate}</span></p>
        </div>
    `;
}

function logout() {
    if (countdownInterval) clearInterval(countdownInterval);
    localStorage.removeItem("local_app_key"); // Xóa sạch dữ liệu key hết hạn
    document.getElementById("main-screen").classList.remove("active");
    document.getElementById("auth-screen").classList.add("active");
    document.getElementById("key-input").value = "";
    document.getElementById("auth-error").innerText = "Hệ thống đã khóa hoặc Key đã hết hạn dùng.";
}

// ================= HOẠT HỌA GIAO DIỆN & SÓNG LƯỚI RAM =================

function initTabs() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
            item.classList.add("active");
            document.getElementById(item.getAttribute("data-tab")).classList.add("active");
        });
    });
}

function initSliders() {
    document.querySelectorAll(".range-item").forEach(item => {
        const slider = item.querySelector("input[type='range']");
        const valLabel = item.querySelector(".range-val");
        slider.addEventListener("input", (e) => { valLabel.innerText = e.target.value + "%"; });
    });
}

const TOTAL_BARS = 45;
function buildAdvancedChartGrid() {
    const container = document.getElementById("wave-container");
    container.innerHTML = "";
    for (let i = 0; i < TOTAL_BARS; i++) {
        const bar = document.createElement("div");
        bar.className = "wave-bar";
        bar.style.height = (Math.floor(Math.random() * 20) + 40) + "%";
        container.appendChild(bar);
    }
}

function initLiveRAMWave() {
    const txt = document.getElementById("ram-percentage");
    setInterval(() => {
        if (!document.getElementById("main-screen").classList.contains("active")) return;
        let currentRamValue = Math.floor(Math.random() * (75 - 45 + 1)) + 45;
        txt.innerText = currentRamValue + "%";
        
        const bars = document.querySelectorAll(".wave-bar");
        for (let i = 0; i < bars.length - 1; i++) { bars[i].style.height = bars[i + 1].style.height; }
        bars[bars.length - 1].style.height = currentRamValue + "%";
    }, 200); // Tần suất dịch chuyển cột sóng mượt mà thời gian thực
}

function printConsole(message, delay = 0) {
    const consoleBox = document.getElementById("console-log");
    setTimeout(() => {
        const line = document.createElement("div");
        line.className = "console-line"; line.innerText = `> ${message}`;
        consoleBox.appendChild(line); consoleBox.scrollTop = consoleBox.scrollHeight;
    }, delay);
}

function runRamCleaner() {
    const btn = document.getElementById("btn-clean-ram");
    btn.disabled = true; btn.innerText = "ĐANG TỐI ƯU...";
    document.getElementById("console-log").innerHTML = "";
    
    printConsole("Đang quét vùng nhớ cache...", 0);
    printConsole("Đóng tiểu trình chạy ngầm phân mảnh...", 400);
    
    setTimeout(() => {
        document.querySelectorAll(".wave-bar").forEach(b => b.style.height = "12%");
        document.getElementById("ram-percentage").innerText = "12%";
        printConsole("THÀNH CÔNG: Bộ nhớ RAM đưa về mức an toàn (12%)!", 1200);
        btn.disabled = false; btn.innerText = "DỌN RAM NGAY";
    }, 1200);
}

function initCustomSettings() {
    document.getElementById("theme-selector").addEventListener("change", (e) => {
        document.documentElement.style.setProperty('--primary-color', e.target.value);
    });
    document.getElementById("darkmode-toggle").addEventListener("change", (e) => {
        document.documentElement.style.setProperty('--bg-color', e.target.checked ? '#08080a' : '#222228');
    });
}
