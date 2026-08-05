/*=====================================================
    LOVE STORY (STATIC COLLAGE EDITION)
    script.js
======================================================*/

"use strict";

/*=====================================================
    ELEMENTS
======================================================*/
const loading = document.getElementById("loading");
const loadingFill = document.getElementById("loadingFill");

const intro = document.getElementById("intro");
const story = document.getElementById("story");
const ending = document.getElementById("ending");

const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");
const musicBtn = document.getElementById("musicBtn");

const backgroundBlur = document.getElementById("backgroundBlur");
const scrollTrack = document.getElementById("scrollTrack");
const progressBar = document.getElementById("progressBar");
const audio = document.getElementById("bgMusic");

const heartCanvas = document.getElementById("heartCanvas");
const ctx = heartCanvas.getContext("2d");

/*=====================================================
    CONFIG & STATE
======================================================*/
const CONFIG = {
    photoFolder: "img/",
    totalPhoto: 30, // Pastikan jumlah foto sesuai dengan foldermu
    preload: true
};

const state = {
    started: false,
    playing: false,
    loaded: 0,
    finished: false
};

/*=====================================================
    DATA (PHOTOS & AESTHETIC PHRASES)
======================================================*/
const photos = [];
for (let i = 1; i <= CONFIG.totalPhoto; i++) {
    photos.push(CONFIG.photoFolder + i + ".jpg");
}

const phrases = [
    "stay with me", "I love you", "always with you", "forever",
    "I miss you", "you mean everything", "only you", "you are enough",
    "my heart is yours", "the best of us", "always on my mind",
    "mean so much", "my favorite person", "beautiful memories",
    "you & me", "my safe place", "always", "thank you"
];

/*=====================================================
    CANVAS SETUP
======================================================*/
function resizeCanvas() {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/*=====================================================
    PRELOAD IMAGE
======================================================*/
function preloadImages() {
    if (!CONFIG.preload) {
        loading.style.display = "none";
        return;
    }

    photos.forEach(src => {
        const img = new Image();
        img.onload = function () {
            state.loaded++;
            const percent = Math.floor((state.loaded / photos.length) * 100);
            loadingFill.style.width = percent + "%";

            if (state.loaded === photos.length) {
                setTimeout(() => {
                    loading.style.opacity = "0";
                    setTimeout(() => {
                        loading.style.display = "none";
                    }, 800);
                }, 400);
            }
        };
        img.src = src;
    });
}
preloadImages();

/*=====================================================
    HELPERS
======================================================*/
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(random(min, max));
}

/*=====================================================
    GENERATE STATIC SCATTERED LAYOUT
======================================================*/
function generateScatteredElements() {
    scrollTrack.innerHTML = "";
    
    // Set wadah agar seukuran persis dengan 1 layar (viewport)
    scrollTrack.style.width = "100vw";
    scrollTrack.style.height = "100vh";

    // 1. SEBARKAN SEMUA FOTO DALAM 1 LAYAR
    photos.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "scatter-img";
        
        // Posisi acak persentase agar merata di layar (0% s/d 75% agar tidak terpotong habis di kanan/bawah)
        const xPos = random(2, 75); 
        const yPos = random(5, 75);

        // Tambahkan rotasi acak sedikit agar terlihat seperti kolase foto yang dilempar
        const rotation = random(-15, 15);

        img.style.left = xPos + "%";
        img.style.top = yPos + "%";
        img.style.transform = `rotate(${rotation}deg)`;
        
        scrollTrack.appendChild(img);
    });

    // 2. SEBARKAN TEKS (Jumlah dibatasi 25 agar tidak terlalu menutupi 30 foto)
    const totalTexts = 25; 
    for (let i = 0; i < totalTexts; i++) {
        const span = document.createElement("span");
        span.className = "scatter-text";
        
        if (Math.random() > 0.70) {
            span.classList.add("highlight");
        }

        span.innerText = phrases[randomInt(0, phrases.length)];

        // Teks disebar ke seluruh area layar
        const xPos = random(2, 80);
        const yPos = random(5, 90);

        span.style.left = xPos + "%";
        span.style.top = yPos + "%";
        
        scrollTrack.appendChild(span);
    }
}

audio.addEventListener("loadedmetadata", () => {
    generateScatteredElements();
});

/*=====================================================
    ENGINE (PROGRESS BAR ONLY, NO SCROLL)
======================================================*/
function storyLoop() {
    if (state.playing && audio.duration) {
        // Hanya update progress bar, tidak ada pergerakan posisi gambar/teks
        const progress = audio.currentTime / audio.duration;
        progressBar.style.width = (progress * 100) + "%";
    }
    requestAnimationFrame(storyLoop);
}
requestAnimationFrame(storyLoop);

/*=====================================================
    CONTROLS & EVENTS
======================================================*/
function startStory() {
    if (state.started) return;
    state.started = true;
    intro.style.display = "none";
    story.style.display = "block";
    
    if (scrollTrack.innerHTML === "") {
        generateScatteredElements();
    }

    audio.play().catch(() => {});
    state.playing = true;
}

startBtn.addEventListener("click", startStory);

musicBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        musicBtn.innerHTML = "🔊";
        state.playing = true;
    } else {
        audio.pause();
        musicBtn.innerHTML = "🔇";
        state.playing = false;
    }
    
    musicBtn.animate(
        [ { transform: "rotate(0deg)" }, { transform: "rotate(360deg)" } ],
        { duration: 500 }
    );
});

audio.addEventListener("ended", () => {
    state.finished = true;
    state.playing = false;
    story.style.display = "none";
    ending.style.display = "flex";
});

replayBtn.addEventListener("click", () => {
    audio.currentTime = 0;
    state.finished = false;
    state.playing = true;
    progressBar.style.width = "0%";
    ending.style.display = "none";
    story.style.display = "block";
    
    generateScatteredElements(); // Acak ulang posisinya setiap replay
    audio.play();
});

/*=====================================================
    CINEMATIC EFFECTS (HEARTS & STARS)
======================================================*/
const hearts = [];
class Heart {
    constructor() { this.reset(); }
    reset() {
        this.x = random(0, heartCanvas.width);
        this.y = heartCanvas.height + 50;
        this.size = random(10, 22);
        this.speed = random(0.3, 0.8);
        this.alpha = random(0.1, 0.4);
        this.swing = random(-0.5, 0.5);
    }
    update() {
        if (!state.playing) return;
        this.y -= this.speed;
        this.x += Math.sin(this.y * 0.02) * this.swing;
        if (this.y < -50) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.font = this.size + "px serif";
        ctx.fillStyle = "#ff6b9d";
        ctx.fillText("❤", this.x, this.y);
        ctx.restore();
    }
}
for (let i = 0; i < 25; i++) hearts.push(new Heart());

const stars = document.getElementById("stars");
let starOpacity = 0.10;
let starDirection = 1;
function updateStars() {
    if (!state.playing) return;
    starOpacity += 0.0005 * starDirection;
    if (starOpacity > 0.18) starDirection = -1;
    if (starOpacity < 0.05) starDirection = 1;
    stars.style.opacity = starOpacity;
}

let last = 0;
function cinematicLoop(now) {
    const delta = now - last;
    if (delta > 16) {
        ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
        hearts.forEach(h => { h.update(); h.draw(); });
        updateStars();
        last = now;
    }
    requestAnimationFrame(cinematicLoop);
}
requestAnimationFrame(cinematicLoop);

/*=====================================================
    PARALLAX BACKGROUND
======================================================*/
document.addEventListener("mousemove", e => {
    let x = (window.innerWidth / 2 - e.clientX) / 60;
    let y = (window.innerHeight / 2 - e.clientY) / 60;
    backgroundBlur.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
});

document.addEventListener("touchmove", e => {
    const t = e.touches[0];
    let x = (window.innerWidth / 2 - t.clientX) / 80;
    let y = (window.innerHeight / 2 - t.clientY) / 80;
    backgroundBlur.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
});
