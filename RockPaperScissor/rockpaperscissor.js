let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msgPara = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#computer-score");

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * 3);
    return options[randomIndex];
};

const showWinnner = (userWin, userChoice, compChoice) => {
    if (userWin) {
        userScore++;
        userScorePara.innerText = userScore;
        console.log("you win!");
        msgPara.innerText = `you win! your ${userChoice} beats ${compChoice}`;
        msgPara.style.backgroundColor = "#B0DB43";
        msgPara.style.color = "black";
    } else {
        compScore++;
        compScorePara.innerText = compScore;
        console.log("you lost!");
        msgPara.innerText = `you lost, ${compChoice} beats your ${userChoice}`;
        msgPara.style.backgroundColor = "#DB2763";
        msgPara.style.color = "black";
    }
};

const drawGame = () => {
    console.log("game was draw.");
    msgPara.innerText = `match was draw`;
    msgPara.style.backgroundColor = "#12EAEA";
    msgPara.style.color = "black";
};

const playGame = (userChoice) => {
    console.log(`user chose ${userChoice}`);
    const compChoice = genCompChoice();
    console.log(`computer chose ${compChoice}`);

    if ( userChoice === compChoice) {
        drawGame();
    } else {
        userWin = true;
        if (userChoice === "rock") {
            userWin = compChoice === "paper" ? false : true ;
        } else if (userChoice === "paper") {
            userWin = compChoice === "scissors" ?  false : true ;
        } else {
            userWin = compChoice === "rock" ? false : true ;
        }
        showWinnner(userWin, userChoice, compChoice);
    }
};

choices.forEach ((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        // console.log(`${userChoice} was clicked`);
        playGame(userChoice);
    })
});