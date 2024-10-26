let Xscore = 0;
let Oscore = 0;

const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const XscorePara = document.querySelector("#Xscore");
const OscorePara = document.querySelector("#Oscore");
const resetS = document.querySelector("#resetBtn");

const winConditons = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["","","","","","","","",""];
let currentPlayer = "X";
let running = false;


const initializeGame = () => {
    cells.forEach((cell) => {
        cell.addEventListener("click", cellClicked);
    });
    restartBtn.addEventListener("click", restartGame);
    resetS.addEventListener("click", resetAll);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
};

const resetScore = () => {
    Xscore = 0;
    Oscore = 0;
    XscorePara.innerText = Xscore;
    OscorePara.innerText = Oscore;
};

const resetAll = () => {
    resetScore();
    restartGame();
};

const cellClicked = (event) => {
    console.log("cell was clicked!");
    const cellIndex = Array.from(cells).indexOf(event.target);

    if (options[cellIndex] != "" || !running) {
        return;
    }
    
    updateCell(event.target, cellIndex);
    checkWinner();
};

const updateCell = (cell, index) => {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
};

const changePlayer = () => {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
};

const checkWinner = () => {
    let roundWon = false;

    for (let i = 0; i < winConditons.length; i++) {
        const condition = winConditons[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins`;
        if (currentPlayer === "X") {
            Xscore++;
            XscorePara.innerText = Xscore;
        } else {
            Oscore++;
            OscorePara.innerText = Oscore;
        }
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
};

const restartGame = () => {
    currentPlayer = "X";
    for (let cell of cells) {
        cell.innerText = "";
    }
    for (let i = 0; i < options.length; i++) {
        options[i] = "";
    }
    // options.fill("");
    // cells.forEach((cell) => cell.textContent = "");
    
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
};

initializeGame();


    