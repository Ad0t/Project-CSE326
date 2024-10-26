//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoRun1Img = new Image();
let dinoRun2Img = new Image();
let dinoImg;

let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}

//cactus
let cactusArray = [];
let bigCactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let bigCactus1Width = 34; // Set appropriate width for big cactus 1
let bigCactus2Width = 69; // Set appropriate width for big cactus 2
let bigCactus3Width = 102; 

// let cactusHeight = 70;
let minCactusHeight = 50; 
let maxCactusHeight = 100;
let cactusX = 700;
// let cactusY = boardHeight - cactusHeight;

let cactus1Img = new Image();
let cactus2Img = new Image();
let cactus3Img = new Image();

// Load big cactus images
let bigCactus1Img = new Image();
let bigCactus2Img = new Image();
let bigCactus3Img = new Image();

let cloudImg = new Image();
let cloudWidth = 100; // Set the width of the cloud
let cloudHeight = 60; // Set the height of the cloud
let cloudX = boardWidth; // Start the cloud off the right side of the screen
let cloudY = Math.random() * (boardHeight / 2); // Random height for the cloud
let cloudSpeed = -2; // Speed at which the cloud moves

//physics
let velocityX = -8; //cactus moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    // dinoImg = new Image();
    // dinoImg.src = "assets/dino.png";
    // dinoImg.onload = function() {
    //     context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    // }
    // Load dinosaur images
    dinoRun1Img.src = "assets/dino-run1.png";
    dinoRun2Img.src = "assets/dino-run2.png";

    // Load cactus images
    cactus1Img.src = "assets/cactus1.png";
    cactus2Img.src = "assets/cactus2.png";
    cactus3Img.src = "assets/cactus3.png";
    
    bigCactus1Img.src = "assets/big-cactus1.png";
    bigCactus2Img.src = "assets/big-cactus2.png";
    bigCactus3Img.src = "assets/big-cactus3.png";
    

    cloudImg.src = "assets/cloud.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
}
let dinoAnimationFrame = 0;

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    if (dino.y == dinoY) { // Only animate when the dino is on the ground
        dinoAnimationFrame++;
        if (dinoAnimationFrame >= 20) { // Change frame every 20 frames
            dinoAnimationFrame = 0; // Reset frame
        }
    }

    // Draw the dino based on the current animation frame
    if (dinoAnimationFrame < 10) {
        context.drawImage(dinoRun1Img, dino.x, dino.y, dino.width, dino.height);
    } else {
        context.drawImage(dinoRun2Img, dino.x, dino.y, dino.width, dino.height);
    }
    // Move and draw the cloud
    cloudX += cloudSpeed; // Move the cloud to the left
    if (cloudX < -cloudWidth) { // If the cloud goes off-screen
        cloudX = boardWidth; // Reset to the right side of the screen
        cloudY = Math.random() * (boardHeight / 2); // Random height for the new cloud
    }
    context.drawImage(cloudImg, cloudX, cloudY, cloudWidth, cloudHeight); // Draw the cloud

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
    // context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "assets/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    // Randomly decide whether to place a normal or big cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: 0, // Placeholder for y, will be set later
        width: null,
        height: null // Set height later based on the image
    };

    let placeCactusChance = Math.random(); // 0 - 0.9999...

    // Set random height for the cactus
    let cactusHeight = Math.random() * (maxCactusHeight - minCactusHeight + 1) + minCactusHeight;

    if (placeCactusChance > 0.90) { // 10% chance for big cactus 3
        cactus.img = bigCactus3Img;
        cactus.width = 68; // Set appropriate width for big cactus 3
        cactus.height = cactusHeight; // Use random height
    } else if (placeCactusChance > 0.80) { // 10% chance for big cactus 2
        cactus.img = bigCactus2Img;
        cactus.width = 102; // Set appropriate width for big cactus 2
        cactus.height = cactusHeight; // Use random height
    } else if (placeCactusChance > 0.70) { // 10% chance for big cactus 1
        cactus.img = bigCactus1Img;
        cactus.width = 136; // Set appropriate width for big cactus 1
        cactus.height = cactusHeight; // Use random height
    } else if (placeCactusChance > 0.50) { // 20% chance for cactus 1
        cactus.img = cactus1Img;
        cactus.width = 50; // Set appropriate width for cactus 1
        cactus.height = cactusHeight; // Use random height
    } else if (placeCactusChance > 0.30) { // 20% chance for cactus 2
        cactus.img = cactus2Img;
        cactus.width = 60; // Set appropriate width for cactus 2
        cactus.height = cactusHeight; // Use random height
    } else { // 30% chance for cactus 3
        cactus.img = cactus3Img;
        cactus.width = 70; // Set appropriate width for cactus 3
        cactus.height = cactusHeight; // Use random height
    }

    cactus.y = boardHeight - cactus.height; // Set y position to keep it on the ground
    cactusArray.push(cactus);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}