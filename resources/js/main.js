var numSquares = 6;
var colours = [];
var pickedColour;
var squares = document.querySelectorAll(".square");
var colourDisplay = document.getElementById("colourDisplay");
var messageDisplay = document.querySelector("#message");
var heading = document.querySelector("#heading");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");
var saveGame = {
    easy: 0,
    hard: 0,
    date: new Date(),
    hardClicks: 0
};
var savedDateDisplay = document.querySelector("#savedDate");
var scoreEasyDisplay = document.querySelector("#easy");
var scoreHardDisplay = document.querySelector("#hard");
var gameOver = false;
var clickCounter = 0;

window.addEventListener("load", function () {
    init();

    function init() {
        setupModeButtons();
        setupSquares();
        reset();
        checkStorage();
    }

    function setupModeButtons() {
        // mode button event listeners
        for (var i = 0; i < modeButtons.length; i++) {
            modeButtons[i].addEventListener("click", function () {
                modeButtons[0].classList.remove("selected");
                modeButtons[1].classList.remove("selected");
                this.classList.add("selected");
                this.textContent === "Easy" ? numSquares = 3 : numSquares = 6;
                reset();
            });
        }
    }

    function setupSquares() {
        for (var i = 0; i < squares.length; i++) {
            // add click listeners to squares
            squares[i].addEventListener("click", function () {
                //grab colour of clicked square
                var clickedColour = this.style.background;
                // compare colour to pickedColour
                if (!gameOver) {
                    if (clickedColour === pickedColour) {
                        clickCounter++;
                        messageDisplay.textContent = "Correct!";
                        saveScore();
                        resetButton.textContent = "Play Again?";
                        changeColours(clickedColour);
                        heading.style.background = clickedColour;
                        gameOver = true;
                    } else {
                        this.style.background = "#232323";
                        messageDisplay.textContent = "Try Again";
                        clickCounter++;
                        console.log(clickCounter);
                    }
                }
            });
        }
    }

    function reset() {
        clickCounter = 0;
        gameOver = false;
        // generate all new colours
        colours = generateRandomColours(numSquares);
        // pick a new random colour from array
        pickedColour = pickColour();
        // change colourDisplay to match pickedColour
        colourDisplay.textContent = pickedColour;
        resetButton.textContent = "New Colours";
        messageDisplay.textContent = "";
        // change colours of squares
        for (var i = 0; i < squares.length; i++) {
            if (colours[i]) {
                squares[i].style.background = colours[i];
                squares[i].style.display = "block";
            } else {
                squares[i].style.display = "none";
            }
        }
        heading.style.background = "forestgreen";
    }

    resetButton.addEventListener("click", function () {
        reset();
    });

    function changeColours(colour) {
        // loop through all squares
        for (var i = 0; i < squares.length; i++) {
            // change each colour to match given colour
            squares[i].style.background = colour;
        }
    }

    resetButton.addEventListener("click", function () {
        reset();
    });

    function pickColour() {
        var random = Math.floor(Math.random() * colours.length);
        return colours[random];
    }

    function generateRandomColours(num) {
        // make an array
        var arr = [];
        // repeat num times
        for (var i = 0; i < num; i++) {
            // get random colour and push into array
            arr.push(randomColour());
        }
        // return array
        return arr;
    }

    function randomColour() {
        // pick a "red" from 0-255
        var r = Math.floor(Math.random() * 256);
        // pick a "green" from 0-255
        var g = Math.floor(Math.random() * 256);
        // pick a "blue" from 0-255
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    function checkStorage() {
        if (localStorage.saveGame !== undefined) {
            saveGame = JSON.parse(localStorage.saveGame);
            if (saveGame.date == undefined || saveGame.date == null) {
                saveGame.date = new Date();
            }
            if (saveGame.easy == undefined || saveGame.easy == null) {
                saveGame.easy == 0;
            }
            if (saveGame.hard == undefined || saveGame.hard == null) {
                saveGame.hard == 0;
            }
            if (saveGame.hardClicks == undefined || saveGame.hardClicks == null) {
                saveGame.hardClicks == 0;
            }
            saveGame.date = new Date(saveGame.date);
            updateScoreDisplay();
        }
    }

    function saveScore() {
        if (numSquares === 3) {
            saveGame.easy++;
        } else if (numSquares === 6) {
            var temp = saveGame.hard * saveGame.hardClicks;
            saveGame.hard++;
            saveGame.hardClicks += clickCounter;
        }
        console.log(clickCounter);
        saveGame.date = new Date();
        localStorage.saveGame = JSON.stringify(saveGame);
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        scoreEasyDisplay.textContent = "Easy " + saveGame.easy;
        var c = saveGame.hardClicks  / saveGame.hard;
        scoreHardDisplay.textContent = "Hard " + saveGame.hard + " (avg clicks: " + c.toFixed(2) + ")";
        var s = saveGame.date.toDateString() + " " + saveGame.date.toLocaleTimeString();
        savedDateDisplay.textContent = "Last Saved " + s;
    }
});
