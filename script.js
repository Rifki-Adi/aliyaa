/*=====================================================
    LOVE STORY - TIKTOK AESTHETIC FALLING SCROLL
======================================================*/
"use strict";

const loading = document.getElementById("loading");
const loadingFill = document.getElementById("loadingFill");
const intro = document.getElementById("intro");
const story = document.getElementById("story");
const ending = document.getElementById("ending");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");
const musicBtn = document.getElementById("musicBtn");
const backgroundBlur = document.getElementById("backgroundBlur");
const fallingContainer = document.getElementById("fallingContainer");

const mainText = document.getElementById("mainText");
const subText = document.getElementById("subText");
const progressBar = document.getElementById("progressBar");
const audio = document.getElementById("bgMusic");
const heartCanvas = document.getElementById("heartCanvas");
const ctx = heartCanvas.getContext("2d");

const CONFIG = {
    photoFolder : "img/",
    totalPhoto : 30, 
    preload : true
};

const photos = [];
for(let i=1;i<=CONFIG.totalPhoto;i++){
    photos.push(CONFIG.photoFolder+i+".jpg");
}

/* KATA-KATA REDUP BACKGROUND ALA TIKTOK */
const backgroundPhrases = [
    "stay with me", "i miss you", "always with you", "forever", 
    "you mean everything", "only you", "you are enough", 
    "my heart is yours", "thinking of u", "love u more", 
    "always on my mind", "my favorite"
];

/* 30 CERITA UTAMA (DI TENGAH LAYAR) */
const storyData = [
    { title: "My Favorite Person ❤️", sub: "Awal dari semua memori indah kita." },
    { title: "Sweetest Smile", sub: "Senyum yang selalu bikin hari-hariku jauh lebih baik." },
    { title: "Perfect Moments", sub: "Setiap detik sama kamu itu berharga banget." },
    { title: "Alasan Bahagiaku", sub: "Ketemu kamu adalah hal terbaik yang pernah terjadi." },
    { title: "Dunia Milik Berdua", sub: "Kalau lagi sama kamu, kerasa dunia cuma punya kita." },
    { title: "Inside & Out", sub: "Bukan cuma wajahnya, hatinya juga paling cantik." },
    { title: "My Comfort Zone", sub: "Nggak ada tempat senyaman di dekatmu." },
    { title: "Canda Tawa", sub: "Ketawa bareng kamu adalah terapi paling ampuh." },
    { title: "Hal Kecil Berarti", sub: "Momen biasa jadi spesial karena ada kamu di sana." },
    { title: "Selalu Ada", sub: "Makasih ya udah selalu nemenin dan dengerin aku." },
    { title: "Hari Tak Terlupakan", sub: "Bakal selalu aku simpan rapi di ingatan." },
    { title: "Paling Beruntung", sub: "Kadang mikir, kok bisa ya aku dapetin kamu?" },
    { title: "Harta Karun", sub: "Kamu itu orang paling berharga buat aku." },
    { title: "Penerang Hariku", sub: "Selalu bawa energi positif setiap saat." },
    { title: "Selalu Cantik", sub: "Lagi candid aja tetep cantik, apalagi kalau senyum." },
    { title: "Waktu Berlalu Cepat", sub: "Nggak pernah kerasa kalau lagi ngabisin waktu bareng kamu." },
    { title: "Segalanya", sub: "Kamu lebih dari sekadar kata-kata manis." },
    { title: "Bagian Terbaik", sub: "Kamu adalah chapter favorit di buku hidupku." },
    { title: "Satu Frekuensi", sub: "Rasanya kayak udah kenal kamu dari dulu banget." },
    { title: "Selalu Deg-degan", sub: "Jantung ini masih sering berdebar kalau liat mata kamu." },
    { title: "Seperti Keajaiban", sub: "Hadirmu ngasih warna baru di hidupku." },
    { title: "Cuma Kamu", sub: "Satu-satunya orang yang aku butuhin cuma kamu." },
    { title: "Genggam Terus", sub: "Jangan pernah ngelepasin genggaman ini ya." },
    { title: "Pelarian Terindah", sub: "Tempat istirahat terbaik dari capeknya dunia." },
    { title: "Tak Ternilai", sub: "Momen kayak gini nggak bisa dibeli pakai apapun." },
    { title: "Rumahku", sub: "Rumah itu bukan tempat, tapi kamu." },
    { title: "Bahasa Cintaku", sub: "Biar foto-foto ini yang menjelaskan perasaanku." },
    { title: "Tumbuh Bersama", sub: "Mari kita melangkah dan bahagia sama-sama." },
    { title: "Aku Sayang Kamu", sub: "Tiga kata yang nggak akan pernah bosan aku bilang." },
    { title: "Selamanya", sub: "Terima kasih untuk segalanya, cerita terbaik kita baru dimulai." }
];

const state={ started:false, playing:false, currentSet:-1, loaded:0, finished:false };

function resizeCanvas(){ heartCanvas.width=window.innerWidth; heartCanvas.height=window.innerHeight; }
resizeCanvas(); window.addEventListener("resize",resizeCanvas);

function preloadImages(){
    if(!CONFIG.preload){ loading.style.display="none"; return; }
    photos.forEach(src=>{
        const img=new Image();
        img.onload=function(){
            state.loaded++;
            loadingFill.style.width=Math.floor((state.loaded/photos.length)*100)+"%";
            if(state.loaded===photos.length){
                setTimeout(()=>{ loading.style.opacity="0"; setTimeout(()=>{ loading.style.display="none"; },800); },400);
            }
        };
        img.src=src;
    });
}
preloadImages();

function startStory(){
    if(state.started) return;
    state.started=true; 
    intro.style.display="none"; 
    story.style.display="block";
    audio.play().catch(()=>{}); 
    state.playing=true;
}
startBtn.addEventListener("click", startStory);

musicBtn.addEventListener("click", ()=>{
    if(audio.paused){ audio.play(); musicBtn.innerHTML="🔊"; state.playing=true; } 
    else { audio.pause(); musicBtn.innerHTML="🔇"; state.playing=false; }
    musicBtn.animate([{ transform:"rotate(0deg)" }, { transform:"rotate(180deg)" }, { transform:"rotate(360deg)" }], { duration:500 });
});

function random(min,max){ return Math.random()*(max-min)+min; }
function randomInt(min,max){ return Math.floor(random(min,max)); }

function typing(element, text, speed) {
    clearTimeout(element.typingTimer); element.innerHTML = ""; let i = 0;
    function write() {
        if (i >= text.length) return;
        element.innerHTML += text.charAt(i); i++;
        element.typingTimer = setTimeout(write, speed);
    }
    write();
}

/* ====================================================
   FUNGSI SPAWN GAMBAR & TEKS JATUH ALA TIKTOK
==================================================== */
let lastSpawnTime = 0;
function spawnFallingItems(now) {
    if (!state.playing) return;
    
    // Memunculkan gambar/teks baru setiap 1.5 detik
    if (now - lastSpawnTime > 1500) {
        spawnImage();
        spawnText();
        lastSpawnTime = now;
    }
}

function spawnImage() {
    const img = document.createElement("img");
    img.src = photos[randomInt(0, photos.length)];
    img.className = "fall-item fall-img";

    // Ukuran bervariasi (Kecil - Sedang)
    const size = randomInt(90, 180);
    img.style.width = size + "px";
    img.style.height = size + "px";
    
    // Posisi horizontal acak (0% sampai 85%)
    img.style.left = randomInt(0, 85) + "%";
    
    // Durasi jatuh (lebih lama = lebih pelan)
    const duration = randomInt(18, 28);
    img.style.animationDuration = duration + "s";
    
    fallingContainer.appendChild(img);

    // Hapus elemen saat sudah selesai jatuh (menghemat memori)
    setTimeout(() => { img.remove(); }, duration * 1000);
}

function spawnText() {
    const txt = document.createElement("div");
    txt.innerText = backgroundPhrases[randomInt(0, backgroundPhrases.length)];
    txt.className = "fall-item fall-text";

    // Ukuran font dan transparansi acak
    txt.style.fontSize = randomInt(14, 26) + "px";
    txt.style.opacity = random(0.2, 0.6);
    txt.style.left = randomInt(0, 80) + "%";
    
    const duration = randomInt(15, 25);
    txt.style.animationDuration = duration + "s";
    
    fallingContainer.appendChild(txt);
    setTimeout(() => { txt.remove(); }, duration * 1000);
}

/* ====================================================
   UPDATE TEKS UTAMA (SINKRON DENGAN LAGU)
==================================================== */
function updateMainStory(){
    if(!audio.duration) return;
    const photoDuration = audio.duration / storyData.length;
    let setIndex = Math.floor(audio.currentTime / photoDuration);
    if(setIndex >= storyData.length) setIndex = storyData.length - 1;

    if(setIndex !== state.currentSet){
        state.currentSet = setIndex;
        let currentData = storyData[setIndex];
        
        typing(mainText, currentData.title, 45);
        setTimeout(()=>{ typing(subText, currentData.sub, 20); }, 350);

        // Ubah background blur tipis
        backgroundBlur.style.backgroundImage = `url('${photos[setIndex % photos.length]}')`;
    }
}

function updateProgress(){
    if(!audio.duration) return;
    progressBar.style.width=((audio.currentTime/audio.duration)*100)+"%";
}

function storyLoop(now){
    if(state.playing){ 
        spawnFallingItems(now); // Panggil efek jatuh
        updateMainStory();      // Update teks utama
        updateProgress(); 
    }
    requestAnimationFrame(storyLoop);
}
requestAnimationFrame(storyLoop);

audio.addEventListener("ended", ()=>{
    state.finished=true; 
    state.playing=false;
    story.style.display="none"; 
    ending.style.display="flex";
    fallingContainer.innerHTML = ""; // Bersihkan layar
});

replayBtn.addEventListener("click", ()=>{
    audio.currentTime=0; 
    state.finished=false; 
    state.playing=true; 
    state.currentSet=-1;
    progressBar.style.width="0%"; 
    ending.style.display="none"; 
    story.style.display="block";
    audio.play();
});

/* EFEK PARTIKEL HATI KECIL */
const hearts=[];
class Heart{
    constructor(){ this.reset(); }
    reset(){ 
        this.x=random(0,heartCanvas.width); 
        this.y=heartCanvas.height+50; 
        this.size=random(8,20); 
        this.speed=random(.2,.8); 
        this.alpha=random(.1,.5); 
        this.swing=random(-1,1); 
    }
    update(){ 
        this.y-=this.speed; 
        this.x+=Math.sin(this.y*.02)*this.swing; 
        if(this.y<-50) this.reset(); 
    }
    draw(){ 
        ctx.save(); 
        ctx.globalAlpha=this.alpha; 
        ctx.font=this.size+"px serif"; 
        ctx.fillStyle="#ff6b9d"; 
        ctx.fillText("❤",this.x,this.y); 
        ctx.restore(); 
    }
}
for(let i=0;i<20;i++) hearts.push(new Heart());

let lastCinematic=0;
function cinematicLoop(now){
    if(now - lastCinematic > 16){ 
        ctx.clearRect(0,0,heartCanvas.width,heartCanvas.height); 
        hearts.forEach(h=>{ h.update(); h.draw(); }); 
        lastCinematic=now; 
    }
    requestAnimationFrame(cinematicLoop);
}
requestAnimationFrame(cinematicLoop);
