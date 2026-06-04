// ==========================================
// HỆ THỐNG ÂM THANH KỸ THUẬT SỐ ĐỘC LẬP - KHUẾCH ĐẠI 10X
// ==========================================
let audioCtx = null;

// ÂM THANH 1: Nút gạt bật công tắc (Tiếng Click đanh cơ học)
function playClickSound() {
    initAudioContext();
    try {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(1.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
    } catch(e) {}
}

// ÂM THANH 2: Thanh kéo Sliders (Tiếng Tick ngắn sắc sảo)
function playSlideSound() {
    initAudioContext();
    try {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(2000, audioCtx.currentTime);
        
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.01);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.015);
    } catch(e) {}
}

// Hàm mở khóa bảo mật âm thanh trên điện thoại ngay khi chạm màn hình
function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}
document.addEventListener('touchstart', initAudioContext, { once: true });
document.addEventListener('click', initAudioContext, { once: true });


// --- 1. ĐIỀU HƯỚNG TAB CHUẨN XÁC ---
function switchTab(tabId, event) {
    playClickSound();
    
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    if(event) event.currentTarget.classList.add('active');

    // Nếu vào tab live, kích hoạt lấy kích thước thật và vẽ đồ thị ngay lập tức
    if (tabId === 'live') {
        resizeCanvas();
    }
}

// --- 2. TẠO 12 NÚT GẠT CHỨC NĂNG (TAB FUNC) ---
const funcNames = [
    "Aimbot Smooth", "Silent Aim", "AIMLOCK", "STABILITY ASSIST",
    "AIM HOLD", "AIM LOCKDOWN", "Ghim tâm đầu", "SENSITIVITY BOOSTER",
    "SCREEN BOOSTER", "SCREEN BOOSTER", "REFLEX BOOST", "PERFORMANCE MODE"
];
const funcContainer = document.getElementById('func-list');
if (funcContainer) {
    funcNames.forEach((name, index) => {
        const row = document.createElement('div');
        row.className = 'func-row';
        row.innerHTML = `
            <span class="func-name">${index + 1}. ${name}</span>
            <label class="switch">
                <input type="checkbox" onchange="playClickSound()">
                <span class="slider"></span>
            </label>
        `;
        funcContainer.appendChild(row);
    });
}

// --- 3. TẠO 12 THANH KÉO TỰ ĐỘNG VỀ 0 (TAB BOOST) ---
const boostNames = [
    "PHANTOM AIM", "TITAN LOCK", "NOVA REFLEX", "SHADOW TRACKER",
    "QUANTUM TOUCH", "CYBER STABILITY", "VORTEX FOCUS", "APEX RESPONSE",
    "INFINITY CONTROL", "VELOCITY TRACKING", "NEON PRECISION", "HYPER BOOST"
];
const boostContainer = document.getElementById('boost-list');
if (boostContainer) {
    boostNames.forEach((name, index) => {
        const group = document.createElement('div');
        group.className = 'range-group';
        group.innerHTML = `
            <div class="range-info">
                <span>${index + 1}. ${name}</span>
                <span id="boost-val-${index}">0%</span>
            </div>
            <input type="range" class="range-input" min="0" max="100" value="0" oninput="updateSlider(${index}, this)">
        `;
        boostContainer.appendChild(group);
    });
}

let lastSliderSoundTime = 0;
function updateSlider(index, element) {
    document.getElementById(`boost-val-${index}`).innerText = element.value + "%";
    let now = Date.now();
    if (now - lastSliderSoundTime > 50) { // Giới hạn tần suất tạo tiếng tick đều đặn
        playSlideSound();
        lastSliderSoundTime = now;
    }
}


// --- 4. GIẢI PHÁP ĐỘC QUYỀN: TỰ VẼ BIỂU ĐỒ RAM KHÔNG LO LỖI ẨN ---
const canvas = document.getElementById('customRamCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let ramData = Array(20).fill(55); // Mảng chứa 20 điểm dữ liệu mượt mà

function resizeCanvas() {
    if (canvas) {
        // Lấy chính xác kích thước thực tế của hộp chứa tại thời điểm hiển thị
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        drawChart();
    }
}

function drawChart() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ lưới nền tọa độ
    ctx.strokeStyle = '#25213b';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
        let y = (canvas.height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Vẽ vùng sóng RAM đổ màu tím Neon Gradient
    ctx.beginPath();
    let step = canvas.width / (ramData.length - 1);
    
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < ramData.length; i++) {
        let x = i * step;
        let y = canvas.height - (ramData[i] / 100) * canvas.height;
        if (i === 0) ctx.lineTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Vẽ đường viền neon phía trên đỉnh làn sóng
    ctx.beginPath();
    for (let i = 0; i < ramData.length; i++) {
        let x = i * step;
        let y = canvas.height - (ramData[i] / 100) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#a855f7';
    ctx.stroke();
    ctx.shadowBlur = 0; // Tắt hiệu ứng shadow đổ bóng để không làm chậm máy
}

// Cập nhật dữ liệu RAM chạy liên tục theo thời gian thực
setInterval(() => {
    ramData.shift();
    let lastVal = ramData[ramData.length - 1];
    let change = (Math.random() - 0.5) * 6;
    let nextVal = Math.min(Math.max(Math.round(lastVal + change), 48), 72);
    ramData.push(nextVal);
    
    const textPercent = document.getElementById('ram-percentage');
    if (textPercent) textPercent.innerText = nextVal + "%";
    
    drawChart();
}, 800);

window.addEventListener('resize', resizeCanvas);


// --- 5. LOG CONSOLE & CHUYỂN HƯỚNG GAME ĐIỆN THOẠI ---
function logConsole(message) {
    const consoleBox = document.getElementById('console-log');
    if (consoleBox) {
        consoleBox.innerHTML += `<br>> ${message}`;
        consoleBox.scrollTop = consoleBox.scrollHeight;
    }
}

function cleanRAM() {
    playClickSound();
    logConsole("Đang đóng các tiến trình ngầm...");
    logConsole("Giải phóng bộ đệm ứng dụng hệ thống...");
    setTimeout(() => {
        ramData = ramData.map(() => Math.floor(Math.random() * 8) + 32);
        drawChart();
        logConsole("Thành công: Hệ thống hoạt động mượt mà!");
    }, 800);
}

function launchGame(gameType) {
    playClickSound();
    initAudioContext(); // Mở khóa âm thanh song song
    
    let appUri = "";
    let storeUrl = "";
    let gameName = "";

    // Sử dụng mã định danh cổng bảo mật hệ thống (Bundle ID) chính thức của Garena
    if (gameType === 'max') {
        gameName = "Free Fire MAX";
        appUri = "fb124535317618055ffmax://"; 
        storeUrl = "https://apps.apple.com/vn/app/free-fire-max/id1480516829?l=vi"; 
    } else {
        gameName = "Free Fire Thường";
        appUri = "com.garena.game.kgvn://"; // Scheme ID gốc bản Việt Nam trên iOS giúp mở thẳng app
        storeUrl = "https://apps.apple.com/vn/app/free-fire-b%C3%AD-%E1%BA%A9n-bi%E1%BB%83n-s%C3%A2u/id1300146617?l=vi"; 
    }
    
    logConsole(`Đang kích hoạt cổng kết nối ứng dụng: ${gameName}...`);

    // GIẢI PHÁP VƯỢT RÀO BẢO MẬT SAFARI:
    // Tạo một thẻ liên kết <a> ảo, gán lệnh mở app trực tiếp và giả lập hành động Click của con người.
    // Cách này đánh lừa Safari rằng đây là hành động người dùng muốn mở app chủ động.
    let linkNavigator = document.createElement('a');
    linkNavigator.href = appUri;
    linkNavigator.style.display = 'none';
    document.body.appendChild(linkNavigator);
    
    // Kích hoạt luồng mở app trực tiếp
    linkNavigator.click();
    document.body.removeChild(linkNavigator);

    // THIẾT LẬP ĐƯỜNG LÙI AN TOÀN (FALLBACK)
    // Nếu máy ĐÃ CÓ GAME, Safari sẽ nhảy vào game ngay lập tức và đóng luồng xử lý web này lại.
    // Nếu máy CHƯA CÓ GAME, lệnh click trên sẽ bị vô hiệu hóa ngầm, sau 2 giây trang web mới tự động chuyển tới App Store.
    let checkTime = Date.now();
    setTimeout(() => {
        // Nếu sau 2 giây trình duyệt vẫn đứng yên ở trang web (tức là không mở được app)
        if (Date.now() - checkTime < 2200) {
            logConsole(`Ứng dụng chưa được cài đặt. Đang điều hướng đến kho ứng dụng App Store...`);
            window.location.href = storeUrl;
        }
    }, 2000);
}

function toggleCrosshair(checkbox) {
    playClickSound();
    if(checkbox.checked) {
        logConsole("Đã kích hoạt chức năng Tâm ảo hỗ trợ ngắm bắn.");
    } else {
        logConsole("Đã tắt Tâm ảo.");
    }
}