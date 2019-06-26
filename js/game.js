//Constants
const UP_VELOCITY = 30;
const GRAVITY = 0.05;	
const CANVAS = document.getElementById('board');
const ctx = CANVAS.getContext('2d');


const background = new Image();
const foreground = new Image();
const bird = new Image();

const pipeNorth = new Image();
const pipeSouth = new Image();
const gameOver = new Image();

//Variable
var birdX = 50;
var birdY = 100;
var dist = 100;
var pipeX = CANVAS.width;
var pipes = [];
var score = 0;
var highScore = 0;
var alive = true;
var dy = 0;

pipes[0] = {
	x:pipeX, 
	y:0,
}


background.src = "img/background-day1.png";
bird.src = "img/bird.gif";
foreground.src = "img/base.png";
pipeNorth.src = "img/pipe-down.png";
pipeSouth.src = "img/pipe-up.png";
gameOver.src = "img/gameover.png"


const fly = new Audio();
const point = new Audio();
const hit = new Audio();
const swooshing = new Audio();


fly.src = 'sound/flap.wav';
point.src = 'sound/point.wav';
hit.src = 'sound/hit.wav';
swooshing.src = 'sound/swooshing.wav';



// Writer Score to window
function writeScore(){
	ctx.fillStyle = '#fff';
	ctx.fillText('High Score: ' + highScore, 10, 10);
	ctx.fillText('Score: ' + score, 10, 30);
}


//Reset game window after game over

function reset(){
  birdX = 50;
  birdY = 100;
  dist = 100;
  pipeX = CANVAS.width;
  pipes = [];
  score = 0;
  
  alive = true;

  pipes[0] = {
  	x:pipeX, 
	y:0,
  }
}



function draw(){
	ctx.drawImage(background, 0, 0);
	

	if(alive){
		dy += GRAVITY; 
		birdY = birdY  + dy;
		ctx.drawImage(bird, birdX, birdY);
		
		
		for(var i = 0; i < pipes.length; i++){
			ctx.drawImage(pipeNorth, pipes[i].x, pipes[i].y);
			ctx.drawImage(pipeSouth, pipes[i].x, pipeNorth.height + dist + pipes[i].y );
			pipes[i].x--;
			
			// drawImageRot(bird1, birdX, birdY, bird.width, bird.height, 30);
			var foregroundCrash = isForegroundCrash();

			var inPipeInterval = isInPipeInterval(pipes[i].x);

			var upCrash = isUpCrash(inPipeInterval, pipes[i].y);
			var downCrash = isDownCrash(inPipeInterval, pipes[i].y);
			
			// check for bird collide wiht pipe and wall
			if(foregroundCrash|| upCrash || downCrash){
				hit.play();
				
				alive = false; 

			}

			if(pipes[i].x + pipeNorth.width+45 == birdX){
				score++;
				pipes.shift();
				if(score > highScore){
					highScore++;

				}
				point.play();
			}

		}	

	}
	else{
		ctx.drawImage(gameOver,  80, 300);

	}


	// fly up bird when up arrow is pressed
	document.onkeydown = function(event) {
	        
	    if(event.keyCode === 38){	
	        birdY = birdY - UP_VELOCITY;
	                // drawImageRot(bird1, birdX, birdY, bird.width, bird.height, 10);
			fly.play();
			dy = 0;
		}
			            
    };


	if(pipes[pipes.length -1].x == 100){
		pipes.push({
			x:pipeX,
			y:Math.floor((pipeNorth.height -10) * Math.random()) - pipeNorth.height+30,
		})
	}
	
	ctx.drawImage(foreground, 0, background.height - foreground.height);
	writeScore();
	requestAnimationFrame(draw);
}

function isForegroundCrash(){
	return  birdY + bird.height >= background.height - foreground.height;
}

function isUpCrash(inPipeInterval, pipeY){
	return inPipeInterval && birdY <= pipeY + pipeNorth.height;
}



function isDownCrash(inPipeInterval, pipeY){
	return inPipeInterval && birdY + bird.height >= pipeY + pipeNorth.height + dist;
}



function isInPipeInterval(birdXPos){
	return birdX + bird.width >= birdXPos && birdX <= birdXPos + pipeNorth.width;
}



function drawImageRot(img,x,y,width,height,deg){

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    //reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}