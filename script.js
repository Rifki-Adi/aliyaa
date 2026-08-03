// =========================
// LOADING
// =========================

window.addEventListener("load", () => {

    setTimeout(() => {

        document.getElementById("loading").style.display = "none";

    }, 2500);

});

// =========================
// ELEMENT
// =========================

const intro = document.getElementById("intro");
const main = document.getElementById("mainContent");
const startBtn = document.getElementById("startBtn");
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");


// =========================
// START WEBSITE
// =========================

startBtn.onclick = () => {

    intro.style.display = "none";

    main.style.display = "block";

    music.play().catch(() => {});

};

// =========================
// MUSIC BUTTON
// =========================

musicBtn.onclick = () => {

    if (music.paused) {

        music.play();

        musicBtn.innerHTML = "🔊";

    } else {

        music.pause();

        musicBtn.innerHTML = "🔇";

    }

};

// =========================
// SLIDESHOW
// =========================

const slides = document.querySelectorAll(".slide");

let current = 0;

function showSlide(index){

    slides.forEach(slide=>{

        slide.classList.remove("active");

    });

    slides[index].classList.add("active");

}

setInterval(()=>{

    current++;

    if(current >= slides.length){

        current = 0;

    }

    showSlide(current);

},5000);

// =========================
// TYPING EFFECT
// =========================

const text = "Every Love Story is Beautiful, But Ours is My Favorite ❤️";

const typing = document.getElementById("typingText");

let i = 0;

function typeText(){

    if(i < text.length){

        typing.innerHTML += text.charAt(i);

        i++;

        setTimeout(typeText,70);

    }

}

setTimeout(typeText,3500);

// =========================
// PROGRESS BAR
// =========================

window.addEventListener("scroll",()=>{

    let scrollTop = document.documentElement.scrollTop;

    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    let percent = (scrollTop / height) * 100;

    document.getElementById("progress").style.width = percent + "%";

});

// =========================
// SCROLL BUTTON
// =========================

const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 300){

        scrollBtn.style.display="block";

    }else{

        scrollBtn.style.display="none";

    }

});

scrollBtn.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

// =========================
// HEART PARTICLE
// =========================

const canvas = document.getElementById("heartCanvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

let hearts=[];

function Heart(){

    this.x=Math.random()*canvas.width;

    this.y=canvas.height+20;

    this.size=Math.random()*20+10;

    this.speed=Math.random()*2+1;

    this.alpha=1;

}

Heart.prototype.update=function(){

    this.y-=this.speed;

    this.alpha-=0.003;

}

Heart.prototype.draw=function(){

    ctx.save();

    ctx.globalAlpha=this.alpha;

    ctx.fillStyle="#ff4d6d";

    ctx.font=this.size+"px serif";

    ctx.fillText("❤",this.x,this.y);

    ctx.restore();

}

function animateHearts(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(Math.random()<0.15){

        hearts.push(new Heart());

    }

    hearts.forEach((heart,index)=>{

        heart.update();

        heart.draw();

        if(heart.alpha<=0){

            hearts.splice(index,1);

        }

    });

    requestAnimationFrame(animateHearts);

}

animateHearts();

// =========================
// RESIZE
// =========================

window.addEventListener("resize",()=>{

    canvas.width=window.innerWidth;

    canvas.height=window.innerHeight;

});

// =========================
// IMAGE PARALLAX
// =========================

document.addEventListener("mousemove",(e)=>{

    const active=document.querySelector(".slide.active img");

    if(!active) return;

    let x=(window.innerWidth/2-e.pageX)/80;

    let y=(window.innerHeight/2-e.pageY)/80;

    active.style.transform=`scale(1.08) translate(${x}px,${y}px)`;

});

// =========================
// GALLERY EFFECT
// =========================

const gallery=document.querySelectorAll(".gallery img");

gallery.forEach(img=>{

    img.addEventListener("mouseenter",()=>{

        img.style.transform="scale(1.08) rotate(2deg)";

    });

    img.addEventListener("mouseleave",()=>{

        img.style.transform="scale(1)";

    });

});

// =========================
// ENDING FADE
// =========================

const ending=document.querySelector(".ending");

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            ending.animate([

                {

                    opacity:0,

                    transform:"translateY(60px)"

                },

                {

                    opacity:1,

                    transform:"translateY(0)"

                }

            ],{

                duration:1500,

                fill:"forwards"

            });

        }

    });

});

observer.observe(ending);
