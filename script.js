/*=====================================================
    LOVE STORY
    script.js
    PART 1 - CORE
======================================================*/

"use strict";

/*=====================================================
    ELEMENT
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

const photo = document.getElementById("photo");

const mainText = document.getElementById("mainText");
const subText = document.getElementById("subText");

const progressBar = document.getElementById("progressBar");

const audio = document.getElementById("bgMusic");

const heartCanvas = document.getElementById("heartCanvas");
const ctx = heartCanvas.getContext("2d");

/*=====================================================
    CONFIG
======================================================*/

const CONFIG = {

    photoFolder : "img/",

    totalPhoto : 30,

    photoDuration : 6,

    transition : 800,

    typingSpeed : 40,

    preload : true

};

/*=====================================================
    PHOTO ARRAY
======================================================*/

const photos = [];

for(let i=1;i<=CONFIG.totalPhoto;i++){
    photos.push(CONFIG.photoFolder+i+".jpg");
}

/*=====================================================
    ROMANTIC MESSAGE
======================================================*/

const messages=[
    { time:0, title:"My Favorite Person ❤️", text:"Every moment with you feels magical." },
    { time:6, title:"My Happiness", text:"Thank you for making my days brighter." },
    { time:12, title:"Beautiful Memories", text:"Every picture reminds me of you." },
    { time:18, title:"My Safe Place", text:"Home is wherever you are." },
    { time:24, title:"Forever", text:"Let's create more memories together." },
    { time:30, title:"You & Me", text:"The best story has just begun." },
    { time:36, title:"Always", text:"You are my favorite chapter." },
    { time:42, title:"Thank You", text:"Thank you for everything." },
    { time:48, title:"Love", text:"You are my favorite hello." },
    { time:54, title:"Forever Starts With You ❤️", text:"I love you." }
];

/*=====================================================
    APP STATE
======================================================*/

const state={
    started:false,
    playing:false,
    currentPhoto:-1,
    currentMessage:-1,
    loaded:0,
    finished:false
};

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
    if(!CONFIG.preload){
        loading.style.display="none";
        return;
    }

    photos.forEach(src=>{
        const img=new Image();
        img.onload=function(){
            state.loaded++;
            const percent=Math.floor((state.loaded/photos.length)*100);
            loadingFill.style.width=percent+"%";

            if(state.loaded===photos.length){
                setTimeout(()=>{
                    loading.style.opacity="0";
                    setTimeout(()=>{
                        loading.style.display="none";
                    },800);
                },400);
            }
        };
        img.src=src;
    });
}

preloadImages();

/*=====================================================
    START STORY
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

/*=====================================================
    MUSIC BUTTON
======================================================*/

musicBtn.addEventListener("click", ()=>{
    if(audio.paused){
        audio.play();
        musicBtn.innerHTML="🔊";
        state.playing=true;
    }else{
        audio.pause();
        musicBtn.innerHTML="🔇";
        state.playing=false;
    }
});

/*=====================================================
    RANDOM
======================================================*/

function random(min,max){
    return Math.random()*(max-min)+min;
}

function randomInt(min,max){
    return Math.floor(random(min,max));
}

/*=====================================================
    TYPEWRITER (Bug Fixed)
======================================================*/

function typing(element, text, speed) {
    clearTimeout(element.typingTimer);
    element.innerHTML = "";
    let i = 0;

    function write() {
        if (i >= text.length) {
            return;
        }
        element.innerHTML += text.charAt(i);
        i++;
        element.typingTimer = setTimeout(write, speed);
    }
    write();
}

/*=====================================================
    END PART 1
======================================================*/

/*=====================================================
    LOVE STORY
    PART 2 (REVISED)
======================================================*/

let photoDuration = CONFIG.photoDuration;

/*=====================================================
    INIT DURATION
======================================================*/

audio.addEventListener("loadedmetadata",()=>{
    photoDuration = audio.duration / photos.length;
});

/*=====================================================
    KEN BURNS
======================================================*/

const burns=[
    "scale(1.10) translate(0px,0px)",
    "scale(1.15) translate(-25px,0px)",
    "scale(1.15) translate(25px,0px)",
    "scale(1.12) translate(0px,-20px)",
    "scale(1.12) translate(0px,20px)",
    "scale(1.18) translate(-20px,-20px)",
    "scale(1.18) translate(20px,20px)",
    "scale(1.16) translate(-15px,25px)",
    "scale(1.16) translate(15px,-25px)"
];

function applyKenBurns(){
    photo.style.transition="opacity .8s ease, filter .8s ease, transform 8s linear";
    photo.style.transform=burns[randomInt(0,burns.length)];
}

/*=====================================================
    CHANGE PHOTO
======================================================*/

function changePhoto(index){
    if(index===state.currentPhoto) return;
    state.currentPhoto=index;

    photo.style.opacity=0;
    photo.style.filter="blur(12px)";

    setTimeout(()=>{
        photo.src=photos[index];
        backgroundBlur.style.backgroundImage=`url('${photos[index]}')`;
        applyKenBurns();
        
        photo.onload=()=>{
            photo.style.opacity=1;
            photo.style.filter="blur(0px)";
        };
    },250);
}

/*=====================================================
    NEXT IMAGE PRELOAD
======================================================*/

function preloadNext(index){
    if(index+1>=photos.length) return;
    const img=new Image();
    img.src=photos[index+1];
}

/*=====================================================
    UPDATE PHOTO
======================================================*/

function updatePhoto(){
    if(!audio.duration) return;

    let index=Math.floor(audio.currentTime / photoDuration);

    if(index>=photos.length){
        index=photos.length-1;
    }

    if(index!==state.currentPhoto){
        changePhoto(index);
        preloadNext(index);
    }
}

/*=====================================================
    UPDATE MESSAGE
======================================================*/

function updateMessage(){
    const current=audio.currentTime;

    for(let i=messages.length-1;i>=0;i--){
        if(current>=messages[i].time){
            if(state.currentMessage!==i){
                state.currentMessage=i;

                typing(mainText, messages[i].title, 45);

                setTimeout(()=>{
                    typing(subText, messages[i].text, 20);
                },350);
            }
            break;
        }
    }
}

/*=====================================================
    PROGRESS
======================================================*/

function updateProgress(){
    if(!audio.duration) return;
    progressBar.style.width=((audio.currentTime/audio.duration)*100)+"%";
}

/*=====================================================
    ENGINE
======================================================*/

function storyLoop(){
    if(state.playing){
        updatePhoto();
        updateMessage();
        updateProgress();
    }
    requestAnimationFrame(storyLoop);
}

requestAnimationFrame(storyLoop);

/*=====================================================
    ENDING
======================================================*/

audio.addEventListener("ended", ()=>{
    state.finished=true;
    state.playing=false;
    story.style.display="none";
    ending.style.display="flex";
});

/*=====================================================
    REPLAY
======================================================*/

replayBtn.addEventListener("click", ()=>{
    audio.currentTime=0;
    state.finished=false;
    state.playing=true;
    state.currentPhoto=-1;
    state.currentMessage=-1;
    progressBar.style.width="0%";
    photo.style.transform="scale(1)";
    ending.style.display="none";
    story.style.display="block";
    audio.play();
});

/*=====================================================
    LOVE STORY
    PART 3
    CINEMATIC EFFECT
======================================================*/

/*=====================================================
    HEART PARTICLE
======================================================*/

const hearts=[];

class Heart{
    constructor(){
        this.reset();
    }

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
        if(this.y<-50){
            this.reset();
        }
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

for(let i=0;i<35;i++){
    hearts.push(new Heart());
}

/*=====================================================
    HEART ENGINE
======================================================*/

function updateHeart(){
    ctx.clearRect(0,0,heartCanvas.width,heartCanvas.height);
    hearts.forEach(h=>{
        h.update();
        h.draw();
    });
}

/*=====================================================
    STAR TWINKLE
======================================================*/

const stars=document.getElementById("stars");
let starOpacity=.12;
let starDirection=1;

function updateStars(){
    starOpacity+=0.0008*starDirection;
    if(starOpacity>.22){
        starDirection=-1;
    }
    if(starOpacity<.08){
        starDirection=1;
    }
    stars.style.opacity=starOpacity;
}

/*=====================================================
    PHOTO PULSE
======================================================*/

function beatPulse(){
    if(audio.paused) return;
    photo.animate(
        [
            { transform: photo.style.transform },
            { transform: photo.style.transform + " scale(1.02)" },
            { transform: photo.style.transform }
        ],
        { duration:420, easing:"ease-out" }
    );
}

setInterval(beatPulse,2100);

/*=====================================================
    FLASH TRANSITION
======================================================*/

const overlay=document.querySelector(".overlay");

function flash(){
    if(!overlay) return;
    overlay.animate(
        [
            { opacity:.55 },
            { opacity:.15 },
            { opacity:.55 }
        ],
        { duration:450 }
    );
}

/*=====================================================
    PHOTO OBSERVER
======================================================*/

let lastPhoto=-1;

function cinematicObserver(){
    if(state.currentPhoto!==lastPhoto){
        lastPhoto=state.currentPhoto;
        flash();
    }
}

/*=====================================================
    LOW FPS FIX
======================================================*/

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
    MUSIC BUTTON ROTATE (Bug Fixed)
======================================================*/

musicBtn.addEventListener("click", ()=>{
    musicBtn.animate(
        [
            { transform:"rotate(0deg)" },
            { transform:"rotate(180deg)" },
            { transform:"rotate(360deg)" }
        ],
        { duration:500 }
    );
});

/*=====================================================
    PARALLAX
======================================================*/

document.addEventListener("mousemove", e=>{
    let x=(window.innerWidth/2-e.clientX)/45;
    let y=(window.innerHeight/2-e.clientY)/45;
    backgroundBlur.style.transform=`translate(${x}px,${y}px) scale(1.2)`;
});

/*=====================================================
    MOBILE PARALLAX
======================================================*/

document.addEventListener("touchmove", e=>{
    const t=e.touches[0];
    let x=(window.innerWidth/2-t.clientX)/70;
    let y=(window.innerHeight/2-t.clientY)/70;
    backgroundBlur.style.transform=`translate(${x}px,${y}px) scale(1.2)`;
});

/*=====================================================
    END PART 3
======================================================*/
