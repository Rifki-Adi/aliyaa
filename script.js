/*=====================================================
    LOVE STORY - 30 UNIQUE TEXTS & POLAROID CAPTIONS
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

const mainText = document.getElementById("mainText");
const subText = document.getElementById("subText");
const progressBar = document.getElementById("progressBar");
const audio = document.getElementById("bgMusic");
const heartCanvas = document.getElementById("heartCanvas");
const ctx = heartCanvas.getContext("2d");

// Mengambil ke-3 kartu polaroid dari HTML
const cards = [
    { el: document.getElementById("card1"), img: document.getElementById("photo1"), cap: document.getElementById("cap1") },
    { el: document.getElementById("card2"), img: document.getElementById("photo2"), cap: document.getElementById("cap2") },
    { el: document.getElementById("card3"), img: document.getElementById("photo3"), cap: document.getElementById("cap3") }
];

/*=====================================================
    CONFIG
======================================================*/
const CONFIG = {
    photoFolder : "img/",
    totalPhoto : 30, // Pastikan ada 30 foto (1.jpg sampai 30.jpg) di dalam folder img
    photoDuration : 6,
    preload : true
};

const photos = [];
for(let i=1;i<=CONFIG.totalPhoto;i++){
    photos.push(CONFIG.photoFolder+i+".jpg");
}

/*=====================================================
    30 VARIASI KALIMAT (TIDAK MONOTON)
======================================================*/
const storyData = [
    { cap: "Day 1 vibes ✨", title: "My Favorite Person ❤️", sub: "Awal dari semua memori indah kita." },
    { cap: "That smile!", title: "Sweetest Smile", sub: "Senyum yang selalu bikin hari-hariku jauh lebih baik." },
    { cap: "So cute 🥺", title: "Perfect Moments", sub: "Setiap detik sama kamu itu berharga banget." },
    { cap: "My happiness", title: "Alasan Bahagiaku", sub: "Ketemu kamu adalah hal terbaik yang pernah terjadi." },
    { cap: "Just us", title: "Dunia Milik Berdua", sub: "Kalau lagi sama kamu, kerasa dunia cuma punya kita." },
    { cap: "Beautiful soul", title: "Inside & Out", sub: "Bukan cuma wajahnya, hatinya juga paling cantik." },
    { cap: "Safe place", title: "My Comfort Zone", sub: "Nggak ada tempat senyaman di dekatmu." },
    { cap: "Laughs", title: "Canda Tawa", sub: "Ketawa bareng kamu adalah terapi paling ampuh." },
    { cap: "Little things", title: "Hal Kecil Berarti", sub: "Momen biasa jadi spesial karena ada kamu di sana." },
    { cap: "Support system", title: "Selalu Ada", sub: "Makasih ya udah selalu nemenin dan dengerin aku." },
    { cap: "Unforgettable", title: "Hari Tak Terlupakan", sub: "Bakal selalu aku simpan rapi di ingatan." },
    { cap: "Lucky me", title: "Paling Beruntung", sub: "Kadang mikir, kok bisa ya aku dapetin kamu?" },
    { cap: "Precious", title: "Harta Karun", sub: "Kamu itu orang paling berharga buat aku." },
    { cap: "Sunshine", title: "Penerang Hariku", sub: "Selalu bawa energi positif setiap saat." },
    { cap: "Aesthetic", title: "Selalu Cantik", sub: "Lagi candid aja tetep cantik, apalagi kalau senyum." },
    { cap: "Good times", title: "Waktu Berlalu Cepat", sub: "Nggak pernah kerasa kalau lagi ngabisin waktu bareng kamu." },
    { cap: "Everything", title: "Segalanya", sub: "Kamu lebih dari sekadar kata-kata manis." },
    { cap: "Fav chapter", title: "Bagian Terbaik", sub: "Kamu adalah chapter favorit di buku hidupku." },
    { cap: "Soulmate", title: "Satu Frekuensi", sub: "Rasanya kayak udah kenal kamu dari dulu banget." },
    { cap: "Butterflies", title: "Selalu Deg-degan", sub: "Jantung ini masih sering berdebar kalau liat mata kamu." },
    { cap: "Magic", title: "Seperti Keajaiban", sub: "Hadirmu ngasih warna baru di hidupku." },
    { cap: "Only You", title: "Cuma Kamu", sub: "Satu-satunya orang yang aku butuhin cuma kamu." },
    { cap: "Hold hands", title: "Genggam Terus", sub: "Jangan pernah ngelepasin genggaman ini ya." },
    { cap: "Sweet escape", title: "Pelarian Terindah", sub: "Tempat istirahat terbaik dari capeknya dunia." },
    { cap: "Priceless", title: "Tak Ternilai", sub: "Momen kayak gini nggak bisa dibeli pakai apapun." },
    { cap: "My home", title: "Rumahku", sub: "Rumah itu bukan tempat, tapi kamu." },
    { cap: "Love language", title: "Bahasa Cintaku", sub: "Biar foto-foto ini yang menjelaskan perasaanku." },
    { cap: "Grow together", title: "Tumbuh Bersama", sub: "Mari kita melangkah dan bahagia sama-sama." },
    { cap: "I love you", title: "Aku Sayang Kamu", sub: "Tiga kata yang nggak akan pernah bosan aku bilang." },
    { cap: "Forever ❤️", title: "Selamanya", sub: "Terima kasih untuk segalanya, cerita terbaik kita baru dimulai." }
];

/* Variasi warna kertas polaroid (Agak kekuningan/putih kertas) */
const paperColors = ["#ffffff", "#fdfbfb", "#fafafa", "#fcfcfc", "#fcf8f5"];

/*=====================================================
    APP STATE
======================================================*/
const state={ started:false, playing:false, currentPhoto:-1, loaded:0, finished:false };
let activeCardIndex = 0; 
let photoDuration = CONFIG.photoDuration;

/*=====================================================
    CANVAS
======================================================*/
function resizeCanvas(){ 
    heartCanvas.width=window.innerWidth; 
    heartCanvas.height=window.innerHeight; 
}
resizeCanvas(); 
window.addEventListener("resize",resizeCanvas);

/*=====================================================
    PRELOAD IMAGE
======================================================*/
function preloadImages(){
    if(!CONFIG.preload){ loading.style.display="none"; return; }
    photos.forEach(src=>{
        const img=new Image();
        img.onload=function(){
            state.loaded++;
            loadingFill.style.width=Math.floor((state.loaded/photos.length)*100)+"%";
            if(state.loaded===photos.length){
                setTimeout(()=>{ 
                    loading.style.opacity="0"; 
                    setTimeout(()=>{ loading.style.display="none"; },800); 
                },400);
            }
        };
        img.src=src;
    });
}
preloadImages();

/*=====================================================
    START STORY & MUSIC CONTROLS
======================================================*/
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
    if(audio.paused){ 
        audio.play(); 
        musicBtn.innerHTML="🔊"; 
        state.playing=true; 
    } else { 
        audio.pause(); 
        musicBtn.innerHTML="🔇"; 
        state.playing=false; 
    }
    musicBtn.animate([{ transform:"rotate(0deg)" }, { transform:"rotate(180deg)" }, { transform:"rotate(360deg)" }], { duration:500 });
});

/*=====================================================
    HELPER FUNCTIONS
======================================================*/
function random(min,max){ return Math.random()*(max-min)+min; }
function randomInt(min,max){ return Math.floor(random(min,max)); }

function typing(element, text, speed) {
    clearTimeout(element.typingTimer); 
    element.innerHTML = ""; 
    let i = 0;
    function write() {
        if (i >= text.length) return;
        element.innerHTML += text.charAt(i); 
        i++;
        element.typingTimer = setTimeout(write, speed);
    }
    write();
}

/*=====================================================
    PHOTO CHANGER (POLAROID STACK LOGIC)
======================================================*/
audio.addEventListener("loadedmetadata",()=>{ photoDuration = audio.duration / photos.length; });

function changePhoto(index){
    if(index===state.currentPhoto) return;
    state.currentPhoto=index;

    // Giliran kartu (0, 1, 2)
    activeCardIndex = (activeCardIndex + 1) % 3;
    const currentCard = cards[activeCardIndex];

    // Mencegah error jika jumlah foto melebihi jumlah data cerita
    const dataIndex = index % storyData.length; 
    const currentData = storyData[dataIndex];

    currentCard.el.style.opacity = 0;
    currentCard.el.style.zIndex = index; 
    currentCard.el.style.backgroundColor = paperColors[randomInt(0, paperColors.length)];

    const rot = randomInt(-12, 12);
    const tx = randomInt(-35, 35);
    const ty = randomInt(-20, 20);

    // Ganti teks utama dan subteks
    typing(mainText, currentData.title, 45);
    setTimeout(()=>{ typing(subText, currentData.sub, 20); },350);

    setTimeout(()=>{
        currentCard.img.src = photos[index];
        currentCard.cap.innerText = currentData.cap; // Tulisan di bawah polaroid
        backgroundBlur.style.backgroundImage = `url('${photos[index]}')`;
        
        currentCard.img.onload = ()=>{
            currentCard.el.style.opacity = 1;
            currentCard.el.style.transform = `translate(${tx}px, ${ty}px) scale(1) rotate(${rot}deg)`;
        };
    }, 250);
}

function preloadNext(index){
    if(index+1>=photos.length) return;
    const img=new Image(); img.src=photos[index+1];
}

function updatePhoto(){
    if(!audio.duration) return;
    let index=Math.floor(audio.currentTime / photoDuration);
    if(index>=photos.length) index=photos.length-1;

    if(index!==state.currentPhoto){
        changePhoto(index); 
        preloadNext(index);
    }
}

function updateProgress(){
    if(!audio.duration) return;
    progressBar.style.width=((audio.currentTime/audio.duration)*100)+"%";
}

/*=====================================================
    MAIN ENGINE LOOP
======================================================*/
function storyLoop(){
    if(state.playing){ 
        updatePhoto(); 
        updateProgress(); 
    }
    requestAnimationFrame(storyLoop);
}
requestAnimationFrame(storyLoop);

/*=====================================================
    ENDING & REPLAY
======================================================*/
audio.addEventListener("ended", ()=>{
    state.finished=true; 
    state.playing=false;
    story.style.display="none"; 
    ending.style.display="flex";
});

replayBtn.addEventListener("click", ()=>{
    audio.currentTime=0; 
    state.finished=false; 
    state.playing=true; 
    state.currentPhoto=-1;
    progressBar.style.width="0%"; 
    ending.style.display="none"; 
    story.style.display="block";
    cards.forEach(c => { 
        c.el.style.opacity = 0; 
        c.el.style.transform = "scale(0.5) translateY(50px) rotate(0deg)"; 
    });
    audio.play();
});

/*=====================================================
    CINEMATIC EFFECTS (HEARTS, STARS, FLASH, BEAT)
======================================================*/
const hearts=[];
class Heart{
    constructor(){ this.reset(); }
    reset(){ 
        this.x=random(0,heartCanvas.width); 
        this.y=heartCanvas.height+50; 
        this.size=random(12,28); 
        this.speed=random(.4,1.2); 
        this.alpha=random(.2,.8); 
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
for(let i=0;i<35;i++) hearts.push(new Heart());
function updateHeart(){ 
    ctx.clearRect(0,0,heartCanvas.width,heartCanvas.height); 
    hearts.forEach(h=>{ h.update(); h.draw(); }); 
}

const stars=document.getElementById("stars");
let starOpacity=.12; 
let starDirection=1;
function updateStars(){
    starOpacity+=0.0008*starDirection;
    if(starOpacity>.22) starDirection=-1;
    if(starOpacity<.08) starDirection=1;
    stars.style.opacity=starOpacity;
}

function beatPulse(){
    if(audio.paused) return;
    document.getElementById("viewer").animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }], 
        { duration:420, easing:"ease-out" }
    );
}
setInterval(beatPulse,2100);

const overlay=document.querySelector(".overlay");
function flash(){ 
    if(!overlay) return; 
    overlay.animate([{ opacity:.55 }, { opacity:.15 }, { opacity:.55 }], { duration:450 }); 
}
let lastPhoto=-1;
function cinematicObserver(){ 
    if(state.currentPhoto!==lastPhoto){ 
        lastPhoto=state.currentPhoto; 
        flash(); 
    } 
}

let last=0;
function cinematicLoop(now){
    const delta=now-last;
    if(delta>16){ 
        updateHeart(); 
        updateStars(); 
        cinematicObserver(); 
        last=now; 
    }
    requestAnimationFrame(cinematicLoop);
}
requestAnimationFrame(cinematicLoop);

/*=====================================================
    PARALLAX
======================================================*/
document.addEventListener("mousemove", e=>{ 
    let x=(window.innerWidth/2-e.clientX)/45; 
    let y=(window.innerHeight/2-e.clientY)/45; 
    backgroundBlur.style.transform=`translate(${x}px,${y}px) scale(1.2)`; 
});
document.addEventListener("touchmove", e=>{ 
    const t=e.touches[0]; 
    let x=(window.innerWidth/2-t.clientX)/70; 
    let y=(window.innerHeight/2-t.clientY)/70; 
    backgroundBlur.style.transform=`translate(${x}px,${y}px) scale(1.2)`; 
});
