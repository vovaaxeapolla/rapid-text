const canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.style = "position:absolute; width: 100%; height: 100%;top:0; left:0; z-index:0;";
document.querySelector('.keyboard__container').append(canvas);
let color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
color = hexToRgb(color.slice(2,color.length));

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return r + "," + g + "," + b;
}



const AnimationProperties = {
    amountParticles: 60,
    particles: [],
    distance: 150,
    width: canvas.width = canvas.clientWidth,
    height: canvas.height = canvas.clientHeight,
    backgroundColor: document.querySelector('main').style.background,
    particleColor: "#111"
};

class Particle{
    constructor(width, height){
        this.x = Math.random()*width;
        this.y = Math.random()*height;
        this.xSpeed = Math.random()*5;
        this.ySpeed = Math.random()*5;
        this.radius = 0;
    }
    move(width, height){
        if(this.x + this.xSpeed > width || this.x + this.xSpeed < 0)this.xSpeed *= -1;
        if(this.y + this.ySpeed > height || this.y + this.ySpeed < 0)this.ySpeed *= -1;
        this.x += this.xSpeed;
        this.y += this.ySpeed
    }
};

window.addEventListener('resize', () =>{
    AnimationProperties.width = canvas.width = canvas.clientWidth;
    AnimationProperties.height = canvas.height = canvas.clientHeight;
});

function update(){
    for(let i = 0; i < AnimationProperties.amountParticles; i++)
        AnimationProperties.particles[i].move(AnimationProperties.width, AnimationProperties.height);
};

//Стираем предыдущий кадр
function clean(){
    ctx.fillStyle = AnimationProperties.backgroundColor;
    ctx.fillRect(0,0,AnimationProperties.width,AnimationProperties.height);
}

function drawParticles(){
    ctx.fillStyle = AnimationProperties.particleColor;
    for(let i = 0; i < AnimationProperties.amountParticles; i++){
        ctx.beginPath();
        ctx.arc(AnimationProperties.particles[i].x, AnimationProperties.particles[i].y, AnimationProperties.particles[i].radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawLines(){
    for(let i = 0; i < AnimationProperties.amountParticles-1; i++)
        for(let j = i+1; j < AnimationProperties.amountParticles; j++){
            let length = Math.sqrt(
                (AnimationProperties.particles[j].x-AnimationProperties.particles[i].x)*
                (AnimationProperties.particles[j].x-AnimationProperties.particles[i].x)+
                (AnimationProperties.particles[j].y-AnimationProperties.particles[i].y)*
                (AnimationProperties.particles[j].y-AnimationProperties.particles[i].y));
            if( length < AnimationProperties.distance){
                ctx.lineWidth = 2;
                ctx.strokeStyle = `rgba(${color}, ${1-length/AnimationProperties.distance})`;
                ctx.beginPath();       
                ctx.moveTo(AnimationProperties.particles[i].x, AnimationProperties.particles[i].y);  
                ctx.lineTo(AnimationProperties.particles[j].x, AnimationProperties.particles[j].y);
                ctx.stroke();
            }
    }
}

function render(){
    clean();
    drawParticles();
    drawLines();
};

function animation(){
    
    update();
    render();
    requestAnimationFrame(animation);
}

function init(){
    for(let i = 0; i < AnimationProperties.amountParticles; i++)
        AnimationProperties.particles.push(new Particle(AnimationProperties.width, AnimationProperties.height));
    animation();
};

init();