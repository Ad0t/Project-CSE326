let gameOver = false;
let started = false;
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino settings
let dinoWidth = 76;
let dinoHeight = 86;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let velocityY = 0;
let gravity = 0.6;
let jumpPower = -13;
let dinoImg, dinoRun1Img, dinoRun2Img, dinoDuck1Img, dinoDuck2Img, dinoDeadImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight,
    isDucking: false
};
let currentDinoImg = dinoImg;
let dinoRunIndex = 0;
let dinoRunCounter = 0;

// Ground settings
let trackX = 0;
let trackSpeed = 5;  // Reduced initial speed
let ground = boardHeight;

// Cactus settings
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let bigCactus1Width = 34;
let bigCactus2Width = 69;
let bigCactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;
let cactus1Img, cactus2Img, cactus3Img, bigCactus1Img, bigCactus2Img, bigCactus3Img;

// Bird settings
let birdArray = [];
let bird1Img, bird2Img;
let birdYPositions = [100, 150];
let birdHeight = 50;
let birdWidth = 69;
let birdAnimationCounter = 0;

// Cloud settings
let cloudArray = [];
let cloudImg;
let cloudSpeed = 1;
let cloudHeight = 50;

// Score and speed increase
let score = 0;
let speedIncreaseRate = 0.001;  // Reduced speed increase rate

// Game over and reset images
let gameOverImg, resetImg;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    dinoImg = new Image();
    dinoImg.src = "assets/dino.png";

    dinoRun1Img = new Image();
    dinoRun1Img.src = "assets/dino-run1.png";

    dinoRun2Img = new Image();
    dinoRun2Img.src = "assets/dino-run2.png";

    dinoDuck1Img = new Image();
    dinoDuck1Img.src = "assets/dino-duck1.png";

    dinoDuck2Img = new Image();
    dinoDuck2Img.src = "assets/dino-duck2.png";

    dinoDeadImg = new Image();
    dinoDeadImg.src = "assets/dino-dead.png";

    cactus1Img = new Image();
    cactus1Img.src = "assets/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "assets/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "assets/cactus3.png";

    bigCactus1Img = new Image();
    bigCactus1Img.src = "assets/big-cactus1.png";

    bigCactus2Img = new Image();
    bigCactus2Img.src = "assets/big-cactus2.png";

    bigCactus3Img = new Image();
    bigCactus3Img.src = "assets/big-cactus3.png";

    bird1Img = new Image();
    bird1Img.src = "assets/bird1.png";

    bird2Img = new Image();
    bird2Img.src = "assets/bird2.png";

    cloudImg = new Image();
    cloudImg.src = "assets/cloud.png";

    trackImg = new Image();
    trackImg.src = "assets/track.png";

    gameOverImg = new Image();
    gameOverImg.src = "assets/game-over.png";

    resetImg = new Image();
    resetImg.src = "assets/reset.png";

    requestAnimationFrame(update);
    setInterval(placeCactusOrBird, 1000); // Cactus or bird spawning every second
    setInterval(placeCloud, 3000); // Cloud spawning every 3 seconds
    document.addEventListener("keydown", handleInput);
    document.addEventListener("keyup", stopDuck);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        displayGameOver();
        return;
    }

    // Increase game speed over time
    trackSpeed += speedIncreaseRate;

    // Clear canvas
    context.clearRect(0, 0, board.width, board.height);

    // Update track
    trackX -= trackSpeed;
    if (trackX < -boardWidth) {
        trackX = 0;
    }
    context.drawImage(trackImg, trackX, board.height - 50);
    context.drawImage(trackImg, trackX + boardWidth, board.height - 50);

    // Draw clouds
    for (let i = 0; i < cloudArray.length; i++) {
        let cloud = cloudArray[i];
        cloud.x -= cloudSpeed;
        context.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);
    }
    cloudArray = cloudArray.filter(cloud => cloud.x + cloud.width > 0);

    // Dino run or duck animation
    dinoRunCounter++;
    if (dinoRunCounter >= 10) {
        dinoRunIndex = (dinoRunIndex + 1) % 2;
        if (dino.isDucking) {
            currentDinoImg = (dinoRunIndex == 0) ? dinoDuck1Img : dinoDuck2Img;
        } else {
            currentDinoImg = (dinoRunIndex == 0) ? dinoRun1Img : dinoRun2Img;
        }
        dinoRunCounter = 0;
    }

    // Apply gravity
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // Prevent dino from falling below the ground
    context.drawImage(currentDinoImg, dino.x, dino.y, dino.width, dino.height);

    // Update cacti and birds
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x -= trackSpeed;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        // Check for collision
        if (detectCollision(dino, cactus)) {
            gameOver = true;
            currentDinoImg = dinoDeadImg;
        }
    }
    cactusArray = cactusArray.filter(cactus => cactus.x + cactus.width > 0);

    // Update birds
    birdAnimationCounter++;
    let birdImg = (birdAnimationCounter % 20 < 10) ? bird1Img : bird2Img;
    for (let i = 0; i < birdArray.length; i++) {
        let bird = birdArray[i];
        bird.x -= trackSpeed;
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        // Check for collision
        if (detectCollision(dino, bird)) {
            gameOver = true;
            currentDinoImg = dinoDeadImg;
        }
    }
    birdArray = birdArray.filter(bird => bird.x + bird.width > 0);

    // Display score
    context.fillStyle = "black";
    context.font = "20px Courier";
    score += 0.05;
    context.fillText("Score: " + Math.floor(score), 20, 20);
}

function handleInput(e) {
    if (gameOver && e.code === "Space") {
        resetGame();
    } else if (!gameOver) {
        if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
            // Jump
            velocityY = jumpPower;
        }
        if (e.code == "ArrowDown" && dino.y == dinoY) {
            // Duck
            dino.isDucking = true;
            dino.height = dinoHeight / 2; // Dino crouches lower
        }
    }
}

function stopDuck(e) {
    if (e.code == "ArrowDown") {
        dino.isDucking = false;
        dino.height = dinoHeight; // Stand up again
    }
}

function placeCactusOrBird() {
    let random = Math.random();
    if (random > 0.8) {
        placeBird();
    } else {
        placeCactus();
    }
}

function placeCactus() {
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    };

    let random = Math.random();
    if (random > 0.9) {
        cactus.img = bigCactus3Img;
        cactus.width = bigCactus3Width;
    } else if (random > 0.7) {
        cactus.img = bigCactus2Img;
        cactus.width = bigCactus2Width;
    } else if (random > 0.5) {
        cactus.img = bigCactus1Img;
        cactus.width = bigCactus1Width;
    } else if (random > 0.3) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    } else if (random > 0.1) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    }

    cactusArray.push(cactus);
}

function placeBird() {
    let bird = {
        x: boardWidth,
        y: birdYPositions[Math.floor(Math.random() * birdYPositions.length)],
        width: birdWidth,
        height: birdHeight
    };
    birdArray.push(bird);
}

function placeCloud() {
    let cloud = {
        x: boardWidth,
        y: Math.random() * (boardHeight / 2),
        width: 60,
        height: cloudHeight
    };
    cloudArray.push(cloud);
}

// Adjusted hitbox for a smaller collision area
function detectCollision(dino, obstacle) {
    // Dino hitbox
    let dinoHitboxWidth = dino.isDucking ? 40 : 50;  // Reduced hitbox width
    let dinoHitboxHeight = dino.isDucking ? 30 : 40;  // Reduced hitbox height
    let dinoHitboxX = dino.x + (dino.width - dinoHitboxWidth) / 2;
    let dinoHitboxY = dino.y + (dino.height - dinoHitboxHeight) / 2;

    // Obstacle hitbox collision
    return dinoHitboxX < obstacle.x + obstacle.width &&
           dinoHitboxX + dinoHitboxWidth > obstacle.x &&
           dinoHitboxY < obstacle.y + obstacle.height &&
           dinoHitboxY + dinoHitboxHeight > obstacle.y;
}

function displayGameOver() {
    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(gameOverImg, board.width / 2 - 100, board.height / 2 - 50);
    context.drawImage(resetImg, board.width / 2 - 40, board.height / 2 + 20);
}

function resetGame() {
    gameOver = false;
    score = 0;
    trackSpeed = 5;  // Reset to the reduced speed
    cactusArray = [];
    birdArray = [];
    dino.y = dinoY;
    dino.isDucking = false;
    velocityY = 0;
}
