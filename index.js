var canvas =document.querySelector('canvas');
canvas.width =innerWidth;
canvas.height=innerHeight;

var c=canvas.getContext('2d');
let scoreEl =document.getElementById('score');
let cotainer = document.getElementById('container');
let startBtn = document.getElementById('start_Button');
let bigScore = document.getElementsByClassName('bigScore')
console.log(bigScore)


// ************* ARRAYS*****************
let bullets = [];
let enemies = [];
let Particles = [];

// ************ GET THE ANGLE************
function getAngle(x,y,x1,y1)
{
    let xd = x - x1;
    let yd = y - y1;
    return Math.atan2(yd,xd)
}


// ******GET DISTANCE *******
function getDistance(x,y,x1,y1)
{
    let xd = x - x1;
    let yd = y - y1;
    return Math.sqrt((xd * xd) + (yd * yd));
}
 
// ******  EXACT INT VALUES *******
function getExactIntValue(num){

    return Math.floor(Math.random() * num)
}


class Player
{
    constructor(x,y,radius,color)
    {
        this.x = x;
        this.y=y;
        this.radius = radius;
        this.color = color;

    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    }

    update()
    {
        this.draw();
    }
}

var x = canvas.width/2;
var y=canvas.height/2;
var player = new Player(x,y,15,'white');


class Bullet
{
    constructor(x,y,radius,color,velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    }

    update()
    {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}


class Enemy{

    constructor(x,y,radius,color,velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    }

    update()
    {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Particle
{
    constructor(x,y,radius,color,velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    }

    update()
    {
        this.draw();
        this.alpha -=0.01;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}


// ******** CREATE ENEMIES ***********
let enemyId
function createEnemy(){

   enemyId = setInterval(()=>{
    
       let radius = Math.random() * (30 - 4) + 5;
       let x;
       let y;
       if(Math.random() < 0.5)
       {
          x = Math.random() < 0.5 ? 0 - radius: canvas.width + radius;
          y = Math.random() * canvas.height;
       }
       else{
          x = Math.random() * canvas.width;
          y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
       }
      
       let angle = getAngle(canvas.width/2,canvas.height/2,x,y);
       let velocity = {
         x : Math.cos(angle),
         y : Math.sin(angle)
       }
       enemies.push(new Enemy(x,y,radius,`hsl(${getExactIntValue(360)},${50}%,${50}%)`,velocity))
   },1000);
}
createEnemy();



// ********* CREATE BULLTES ************
addEventListener('click',(event)=>{
    let angle = getAngle(event.clientX,event.clientY,canvas.width/2,canvas.height/2)
    var velocity ={
        x : Math.cos(angle) * 6,
        y : Math.sin(angle) * 6
    }
   bullets.push(new Bullet(canvas.width/2,canvas.height/2,8,'white',velocity))
   
})


let animationId
let score = 0;
function animate()
{
   animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(70,70,70,0.2)';
    c.fillRect(0,0,innerWidth,innerHeight);
    player.update();


    //******************** BULLETS********************
    bullets.forEach((bullet)=>{
        bullet.update();
    })

    
    // ********ENEMIES***********
    enemies.forEach((enemy,eIndex)=>{
        enemy.update();


    //    ****** COLLAPSE BULLET AND ENEMY *******
        bullets.forEach((bullet,index)=>{
     
            let distance = getDistance(enemy.x,enemy.y,bullet.x,bullet.y);
            let sumOfRadius = enemy.radius + bullet.radius;
            if(sumOfRadius  > distance )
            {

                // ******  INCREMENT SCORE ********
                score += 100;
                scoreEl.innerHTML = score;
                // ***** CREATE EXPLOSION *********
               for(var i=0;i<=enemy.radius * 2;i++)
               {
                  Particles.push(new Particle(enemy.x,enemy.y,Math.random() * 2,enemy.color,
                  {x : (Math.random() - 0.5) * (Math.random() * 6),
                   y : (Math.random() - 0.5) * (Math.random() * 6) }));
               }

               if(enemy.radius > 15)
               {
                  enemy.radius -= 10;
               }
               else{
               enemies.splice(eIndex,1);
               bullets.splice(index,1);
               }
            }
        })

        
        let distance = getDistance(enemy.x,enemy.y,player.x,player.y);
        if(distance < (enemy.radius + player.radius))
        {
          
       
           cancelAnimationFrame(animationId);
           bigScore[0].innerHTML = score;
           bigScore[1].innerHTML = score;
           bigScore[2].innerHTML = score;
           bigScore[3].innerHTML = score;
           bigScore[4].innerHTML = score;
           bigScore[5].innerHTML = score;
           cotainer.style.display='flex';

        }
    });


    Particles.forEach((particle,index)=>{
          
        if(particle.alpha <= 0)
        {
            Particles.splice(index,1)
        }
        else{
            particle.update();
        }
    })  
    
}
animate();

function init()
{
     bullets = [];
     enemies = [];
     Particles = [];
     player = new Player(x,y,15,'white');
}

startBtn.addEventListener('click',()=>{

    cotainer.style.display='none';
    console.log('hello')
    animate();
    createEnemy();
    init();
    score = 0;
    bigScore[0].innerHTML = score;
    bigScore[1].innerHTML = score;
    bigScore[2].innerHTML = score;
    bigScore[3].innerHTML = score;
    bigScore[4].innerHTML = score;
    bigScore[5].innerHTML = score;
    scoreEl.innerHTML = score;
    clearInterval(enemyId);
    

    
})