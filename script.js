/*=====================================================
    LOVE STORY (FLOATING AESTHETIC EDITION)
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
    totalPhoto: 30, // Jumlah foto
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
    FLOATING ELEMENTS (IMAGES & TEXTS)
======================================================*/
let floatElements = [];

class Floater {
    constructor(el, type) {
        this.el = el;
        this.type = type; // 'img' atau 'text'
        this.reset(true);
    }

    reset(isInitial = false) {
        // Posisi X diacak sepanjang lebar layar
        this.x = random(10, window.innerWidth - 180);
        
        // Jika baru dimulai, sebar secara acak di seluruh layar. 
        // Jika reset (karena keluar layar), mulai dari bawah layar.
        if (isInitial) {
            this.y = random(0, window.innerHeight * 2); // Tersebar jauh ke bawah
        } else {
            this.y = window.innerHeight + 150; // Muncul dari bawah
        }

        // Kecepatan melayang (sangat lambat seperti hati)
        this.speed = random(0.3, 0.8);
        this.swing = random(-0.5, 0.5); // Goyangan ke kiri/kanan
        this.swingOffset = random(0, Math.PI * 2);
        
        // Gambar punya kemiringan rotasi, teks lurus
        this.angle = this.type === 'img' ? random(-15, 15) : 0;
    }

    update() {
        if (!state.playing) return;
        
        // Bergerak ke atas seperti emot hati
        this.y -= this.speed; 
        // Gerakan mengayun (kiri - kanan)
        this.x += Math.sin(this.y * 0.01 + this.swingOffset) * this.swing;

        // Jika sudah melewati batas atas layar, reset ke bawah lagi
        if (this.y < -250) {
            this.reset(false);
        }
    }

    render() {
        this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg)`;
    }
}

function generateFloatingElements() {
    scrollTrack.innerHTML = "";
    floatElements = [];

    // Pastikan wadah memenuhi layar
    scrollTrack.style.width = "100vw";
    scrollTrack.style.height = "100vh";
    scrollTrack.style.position = "absolute";
    scrollTrack.style.overflow = "hidden";

    // 1. BUAT GAMBAR YANG MELAYANG
    photos.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "scatter-img";
        // Styling inline agar aman dari CSS
        img.style.position = "absolute";
        img.style.top = "0px";
        img.style.left = "0px";
        img.style.willChange = "transform";
        
        scrollTrack.appendChild(img);
        floatElements.push(new Floater(img, 'img'));
    });

    // 2. BUAT TEKS YANG MELAYANG (Muncul!)
    const totalTexts = 25; 
    for (let i = 0; i < totalTexts; i++) {
        const span = document.createElement("span");
        span.className = "scatter-text";
        span.innerText = phrases[randomInt(0, phrases.length)];
        
        // Styling inline untuk menjamin teks terlihat (Warna terang)
        span.style.position = "absolute";
        span.style.top = "0px";
        span.style.left = "0px";
        span.style.color = Math.random() > 0.7 ? "rgba(255, 180, 200, 0.9)" : "rgba(255, 255, 255, 0.7)";
        span.style.fontSize = Math.random() > 0.5 ? "1.2rem" : "1.6rem";
        span.style.fontWeight = "300";
        span.style.letterSpacing = "1px";
        span.style.willChange = "transform";
        span.style.whiteSpace = "nowrap";

        scrollTrack.appendChild(span);
        floatElements.push(new Floater(span, 'text'));
    }
}

audio.addEventListener("loadedmetadata", () => {
    if (floatElements.length === 0) generateFloatingElements();
});

/*=====================================================
    PROGRESS BAR SYNC
======================================================*/
function storyLoop() {
    if (state.playing && audio.duration) {
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
    
    if (floatElements.length === 0) {
        generateFloatingElements();
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
    
    generateFloatingElements(); 
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

// ALL ANIMATIONS (Hearts, Stars, Texts, and Images) RUN HERE!
let last = 0;
function cinematicLoop(now) {
    const delta = now - last;
    if (delta > 16) { // Batas ~60 FPS
        ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
        
        // Update & Render Hati
        hearts.forEach(h => { h.update(); h.draw(); });
        
        // Update Bintang
        updateStars();
        
        // Update & Render Gambar dan Teks secara berkesinambungan
        floatElements.forEach(f => {
            f.update();
            f.render();
        });

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
