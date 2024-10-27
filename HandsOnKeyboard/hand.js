document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    let timeLeft = 60;
    let timerInterval;

    function updateTimer() {
        const timerDisplay = document.getElementById("timer");
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            clearInterval(timerInterval);
            alert(`Time's up! Final Score: ${score}`);
        }
    }
    const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    let selectedKey = null;

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomKey() {
        return keys[getRandomNumber(0, keys.length - 1)];
    }

    function targetRandomKey() {
        if (selectedKey) selectedKey.classList.remove("selected");
        const randomKeyId = getRandomKey();
        const randomKey = document.getElementById(randomKeyId);

        if (randomKey) {
            randomKey.classList.add("selected");
            selectedKey = randomKey;
        } else {
            console.error(`Key with id ${randomKeyId} not found`);
        }
    }

    // document.addEventListener("keydown", (event) => {
    //     const keyPressed = String.fromCharCode(event.keyCode);
    //     const highlightedKey = document.querySelector(".selected");

    //     if (highlightedKey && keyPressed === highlightedKey.innerHTML) {
    //         highlightedKey.classList.add("hit");
    //         highlightedKey.addEventListener("animationend", () => {
    //             highlightedKey.classList.remove("hit");
    //             targetRandomKey();
    //         });
    //     }
    // });
    document.addEventListener("keyup", (event) => {
        if (!timerInterval) timerInterval = setInterval(updateTimer, 1000);
    
        const keyPressed = String.fromCharCode(event.keyCode);
        const highlightedKey = document.querySelector(".selected");
        const currentKey = document.getElementById(keyPressed);
    
        if (currentKey) {
            if (highlightedKey && keyPressed === highlightedKey.innerHTML) {
                score++;
                document.getElementById("score").textContent = `Score: ${score}`;
                currentKey.classList.add("hit");
                currentKey.addEventListener("animationend", () => {
                    currentKey.classList.remove("hit");
                    targetRandomKey();
                });
            } else {
                currentKey.classList.add("wrong-press");
                currentKey.addEventListener("animationend", () => {
                    currentKey.classList.remove("wrong-press");
                });
            }
        }
    });


    targetRandomKey();
});