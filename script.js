/* =========================
   TAB SYSTEM
========================= */

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        tabs.forEach(btn =>
            btn.classList.remove("active")
        );

        panels.forEach(panel =>
            panel.classList.remove("activePanel")
        );

        tab.classList.add("active");

        const target =
        document.getElementById(
        tab.dataset.tab
        );

        target.classList.add(
        "activePanel"
        );

        playSound(700, 0.05);
    });
});

/* =========================
   SOUND ENGINE
========================= */

let soundEnabled = true;

function playSound(freq = 700, volume = 0.05){

    if(!soundEnabled) return;

    const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

    const ctx =
    new AudioContext();

    const osc =
    ctx.createOscillator();

    const gain =
    ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    gain.gain.value = volume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    setTimeout(()=>{
        osc.stop();
        ctx.close();
    },60);
}

/* =========================
   SWITCHES
========================= */

const switches =
document.querySelectorAll(
".switch input"
);

switches.forEach(sw => {

    sw.addEventListener(
    "change",
    ()=>{

        playSound(900,0.05);

        addLog(
        "Switch "
        +(sw.checked
        ? "Enabled"
        : "Disabled")
        );

    });

});

/* =========================
   SLIDERS
========================= */

const sliders =
document.querySelectorAll(
'input[type="range"]'
);

sliders.forEach(sl=>{

    sl.addEventListener(
    "input",
    ()=>{

        playSound(
        500 +
        Number(sl.value)*3,
        0.03
        );

    });

});

/* =========================
   SYSTEM STATS
========================= */

const cpuUsage =
document.getElementById(
"cpuUsage"
);

const ramUsage =
document.getElementById(
"ramUsage"
);

const netUsage =
document.getElementById(
"netUsage"
);

function updateStats(){

    if(cpuUsage)
    cpuUsage.textContent =
    Math.floor(
    Math.random()*100
    )+"%";

    if(ramUsage)
    ramUsage.textContent =
    Math.floor(
    Math.random()*100
    )+"%";

    if(netUsage)
    netUsage.textContent =
    (
    Math.floor(
    Math.random()*900
    )+100
    )+" KB/s";
}

setInterval(
updateStats,
1500
);

updateStats();

/* =========================
   LIVE MONITOR
========================= */

const ramUsed =
document.getElementById(
"ramUsed"
);

const ramFree =
document.getElementById(
"ramFree"
);

const cpuLive =
document.getElementById(
"cpuLive"
);

const fpsLive =
document.getElementById(
"fpsLive"
);

function updateLiveStats(){

    const used =
    Math.floor(
    Math.random()*2500
    )+1200;

    const free =
    4096 - used;

    const cpu =
    Math.floor(
    Math.random()*100
    );

    const fps =
    Math.floor(
    Math.random()*15
    )+55;

    if(ramUsed)
    ramUsed.textContent =
    used+" MB";

    if(ramFree)
    ramFree.textContent =
    free+" MB";

    if(cpuLive)
    cpuLive.textContent =
    cpu+"%";

    if(fpsLive)
    fpsLive.textContent =
    fps;
}

setInterval(
updateLiveStats,
1000
);

updateLiveStats();

/* =========================
   CONSOLE
========================= */

const consoleBox =
document.getElementById(
"consoleBox"
);

function addLog(text){

    if(!consoleBox) return;

    const div =
    document.createElement(
    "div"
    );

    const time =
    new Date()
    .toLocaleTimeString();

    div.textContent =
    "["+time+"] "
    + text;

    consoleBox.appendChild(div);

    consoleBox.scrollTop =
    consoleBox.scrollHeight;
}

setInterval(()=>{

    addLog(
    "System monitoring..."
    );

},3000);

/* =========================
   RAM CLEAN
========================= */

const cleanRam =
document.getElementById(
"cleanRam"
);

if(cleanRam){

    cleanRam.onclick = ()=>{

        playSound(
        1100,
        0.08
        );

        addLog(
        "Cleaning RAM..."
        );

        setTimeout(()=>{

            addLog(
            "RAM optimization completed"
            );

        },1500);

    };

}

/* =========================
   CROSSHAIR UI
========================= */

const crosshair =
document.getElementById(
"virtualCrosshair"
);

const toggleCrosshair =
document.getElementById(
"toggleCrosshair"
);

if(toggleCrosshair){

    toggleCrosshair.onclick = ()=>{

        playSound(
        800,
        0.06
        );

        if(
        crosshair.style.display
        === "block"
        ){

            crosshair.style.display =
            "none";

            addLog(
            "Overlay hidden"
            );

        }else{

            crosshair.style.display =
            "block";

            addLog(
            "Overlay visible"
            );

        }

    };

}

/* =========================
   THEME SWITCH
========================= */

const themeBtn =
document.getElementById(
"themeBtn"
);

let purpleMode = true;

if(themeBtn){

    themeBtn.onclick = ()=>{

        playSound(
        1200,
        0.06
        );

        if(purpleMode){

            document.documentElement
            .style.setProperty(
            "--purple",
            "#00d9ff"
            );

            document.documentElement
            .style.setProperty(
            "--purple2",
            "#00aaff"
            );

            addLog(
            "Theme: Cyan"
            );

        }else{

            document.documentElement
            .style.setProperty(
            "--purple",
            "#b43cff"
            );

            document.documentElement
            .style.setProperty(
            "--purple2",
            "#7b2fff"
            );

            addLog(
            "Theme: Purple"
            );

        }

        purpleMode =
        !purpleMode;

    };

}

/* =========================
   RESET SETTINGS
========================= */

const resetBtn =
document.getElementById(
"resetBtn"
);

if(resetBtn){

    resetBtn.onclick = ()=>{

        playSound(
        600,
        0.07
        );

        switches.forEach(sw=>{
            sw.checked = false;
        });

        sliders.forEach(sl=>{
            sl.value = 0;
        });

        if(crosshair){
            crosshair.style.display =
            "none";
        }

        document.documentElement
        .style.setProperty(
        "--purple",
        "#b43cff"
        );

        document.documentElement
        .style.setProperty(
        "--purple2",
        "#7b2fff"
        );

        addLog(
        "Settings reset"
        );

    };

}

/* =========================
   RAM CHART
========================= */

const canvas =
document.getElementById(
"ramChart"
);

if(canvas){

    const ctx =
    canvas.getContext("2d");

    function resizeCanvas(){

        canvas.width =
        canvas.offsetWidth;

        canvas.height =
        260;
    }

    resizeCanvas();

    window.addEventListener(
    "resize",
    resizeCanvas
    );

    let points = [];

    function drawChart(){

        const value =
        Math.floor(
        Math.random()*40
        )+40;

        points.push(value);

        if(points.length > 70){
            points.shift();
        }

        ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
        );

        ctx.beginPath();

        points.forEach(
        (p,i)=>{

            const x =
            (i/69)
            * canvas.width;

            const y =
            canvas.height -
            (
            p/100
            )*canvas.height;

            if(i===0)
            ctx.moveTo(x,y);
            else
            ctx.lineTo(x,y);
        });

        ctx.strokeStyle =
        "#b43cff";

        ctx.lineWidth = 4;

        ctx.shadowBlur = 20;

        ctx.shadowColor =
        "#b43cff";

        ctx.stroke();

        ctx.lineTo(
        canvas.width,
        canvas.height
        );

        ctx.lineTo(
        0,
        canvas.height
        );

        ctx.closePath();

        const gradient =
        ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
        );

        gradient.addColorStop(
        0,
        "rgba(180,60,255,.35)"
        );

        gradient.addColorStop(
        1,
        "rgba(180,60,255,0)"
        );

        ctx.fillStyle =
        gradient;

        ctx.fill();
    }

    setInterval(
    drawChart,
    500
    );
}

/* =========================
   STARTUP
========================= */

addLog(
"Dashboard started"
);

addLog(
"Live monitor active"
);

addLog(
"Neon UI loaded"
);
/* DEVICE INFO */

document.getElementById(
"cpuCore"
).textContent =
navigator.hardwareConcurrency || 4;

document.getElementById(
"browserName"
).textContent =
navigator.userAgent.includes("Chrome")
? "Chrome"
: "Browser";

document.getElementById(
"platformName"
).textContent =
navigator.platform;

document.getElementById(
"screenSize"
).textContent =
window.innerWidth +
"x" +
window.innerHeight;