// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var startBtn = document.getElementById("start-btn");
var pauseBtn = document.getElementById("pause-btn");
var restartBtn = document.getElementById("restart-btn");
var aiBtn1 = document.getElementById("ai-btn1");
var aiBtn2 = document.getElementById("ai-btn2");
var animationId;
var gameRunning = false;
var aiCheck = false;
var aiLevel1 = false;
var aiLevel2 = false;
var ballHitNum = 0;

startBtn.addEventListener("click", function() {
  if (!gameRunning) { // only start the game if gameRunning is false
    gameRunning = true; // set gameRunning to true when the game starts
    minLeftScore = 0
    minRightScore = 0
    loop();
  }
});

pauseBtn.addEventListener("click", function() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", function() {
    aiCheck = false;
    minLeftScore = 0
    minRightScore = 0
  document.location.reload();
});

aiBtn1.addEventListener("click", function() {
    if (!gameRunning) { 
        gameRunning = true; 
        aiCheck = true;
        aiLevel1 = true;
        minLeftScore = 0
        minRightScore = 0
        loop();
      }
  });

aiBtn2.addEventListener("click", function() {
if (!gameRunning) { 
    gameRunning = true; 
    aiCheck = true;
    aiLevel2 = true;
    minLeftScore = 0
    minRightScore = 0
    loop();
      }
  });  

addEventListener("load", (event) => {
  draw();
});


// Define ball properties
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 2;
var ballSpeedY = 2;

// Define paddle properties
var paddleHeight = 80;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 5;

// Define score properties
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 20;

// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key press
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "w") {
    wPressed = true;
  } else if (e.key === "s") {
    sPressed = true;
  }
}

// Handle key release
function keyUpHandler(e) {
  if (e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "w") {
    wPressed = false;
  } else if (e.key === "s") {
    sPressed = false;
  }
}

// Update game state
function update() {
  // Move paddles
  if (upPressed && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
    rightPaddleY += paddleSpeed;
  }

  // Move right paddle based on "w" and "s" keys
  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  // Move right paddle automatically based on ball position
  if (aiCheck === true && aiLevel2 === true) {
    if (ballHitNum<6){
        if (ballY > rightPaddleY + paddleHeight / 2) {
            rightPaddleY += paddleSpeed;
            } 
        else if (ballY < rightPaddleY + paddleHeight / 2) {
            rightPaddleY -= paddleSpeed;
            }
        }
    else {
        if (ballY > rightPaddleY + paddleHeight / 2) {
            rightPaddleY -= paddleSpeed;
            } 
        else if (ballY < rightPaddleY + paddleHeight / 2) {
            rightPaddleY += paddleSpeed;
            }
        }
    }

  else if (aiCheck === true && aiLevel1 === true) {
    if (ballHitNum<3){
        if (ballY > rightPaddleY + paddleHeight / 2) {
            rightPaddleY += paddleSpeed;
            } 
        else if (ballY < rightPaddleY + paddleHeight / 2) {
            rightPaddleY -= paddleSpeed;
            }
        }
    else {
        if (ballY > rightPaddleY + paddleHeight / 2) {
            rightPaddleY -= paddleSpeed;
            } 
        else if (ballY < rightPaddleY + paddleHeight / 2) {
            rightPaddleY += paddleSpeed;
            }
        }
    }

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Check if ball collides with top or bottom of canvas
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
    ballHitNum++;
  }

  // Check if ball collides with left paddle
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Check if ball collides with right paddle
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Check if ball goes out of bounds on left or right side of canvas
  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }


  // Check if a player has won
  if (leftPlayerScore == maxScore) {
    playerWin("Left player");
    minLeftScore = 0;
    minRightScore = 0;
  } else if (rightPlayerScore == maxScore && aiCheck == true) {
    playerWin("Bot player");
    minLeftScore = 0;
    minRightScore = 0;
  } else if (rightPlayerScore == maxScore) {
    playerWin("Right player");
    minLeftScore = 0;
    minRightScore = 0;
  }

  // Check if a player has scored
    if (leftPlayerScore > minLeftScore) {
        document.getElementById("p2").innerHTML = "";
        minLeftScore++;
        ballHitNum = 0;
        playerScore("Left player");
    } else if (rightPlayerScore > minRightScore && aiCheck === true) {
        document.getElementById("p1").innerHTML = "";
        minRightScore++;
        playerScore("Bot player");
    } else if (rightPlayerScore > minRightScore) {
        document.getElementById("p1").innerHTML = "";
        minRightScore++;
        playerScore("Right player");
    }


  
}

function playerWin(player) {
  var message = "Congratulations! " + player + " win!";
  $('#message').text(message); // Set the message text
  $('#message-modal').modal('show'); // Display the message modal
  reset();
}

function playerScore(player) {
  if (player === "Left player"){
    document.getElementById("p1").innerHTML = "Left player Score!";
  }
  else if (player === "Bot player"){
    document.getElementById("p2").innerHTML = "Bot Score!";
  }
  else if (player === "Right player"){
    document.getElementById("p2").innerHTML = "Right Player Score!";
  }
  }

// Reset ball to center of screen
function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.random() * 10 - 5;
}

// Draw objects on canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF";
  ctx.font = "15px Arial";

  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF"; // Set line color to white
  ctx.stroke();
  ctx.closePath();

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Draw left paddle
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  // Draw right paddle
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  // Draw scores
  ctx.fillText("Score: " + leftPlayerScore, 10, 20);
  ctx.fillText("Score: " + rightPlayerScore, canvas.width - 70, 20);
}

// Game loop
function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

$('#message-modal-close').on('click', function() {
  document.location.reload();
});