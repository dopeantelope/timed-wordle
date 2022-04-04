import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
let time;
let score = 0;
let gameTime;
let scoresForMinutes1 = [];
let scoresForMinutes2 = [];
let scoresForMinutes5 = [];
let scoresForMinutes10 = [];
let myChart;
let numberOfGuesses1= [];
let numberOfGuesses2 = [];
let numberOfGuesses5 = [];
let numberOfGuesses10 = [];
let gotInNumberOfGuesses;

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }
        board.appendChild(row)
    }
    document.getElementById('score').innerHTML = `Level: ${score}`

}

initBoard()


document.addEventListener("keyup", (e) => {
    console.log(rightGuessString)

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }
    if (pressedKey === "Enter") {
        checkGuess()
        return
    }
    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})


function insertLetter(pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function nextLevel() {
    guessesRemaining = 6;
    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
    currentGuess = [];
    nextLetter = 0;
    resetBoard()
    console.log(rightGuessString)
    score = score + 1
    document.getElementById('score').innerHTML = `Level: ${score}`

}
function resetBoard() {
    //clear grid
    console.log("reset");
    document.getElementById("game-board").innerHTML = ("");
    initBoard();
    //reset colour of keyboard
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = "white"
    }
}

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }


    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = '#666'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade #71C562 
                letterColor = '#71C562'

            } else {
                // shade box #FFD700
                letterColor = '#FFD700'
            }

            rightGuess[letterPosition] = "#"
        }


        setTimeout(() => {
            //flip box
            animateCSS(box)
            //shade box
            box.style.backgroundColor = letterColor
            box.style.border = "none"
            box.style.padding = "2px"
            shadeKeyBoard(letter, letterColor)
        })
    }

    if (guessString === rightGuessString) {
        if (guessesRemaining == 6) {
            gotInNumberOfGuesses=1
            addNumberOfGueesesToArray(gotInNumberOfGuesses)
        }
        if (guessesRemaining == 5) {
            gotInNumberOfGuesses=2
            addNumberOfGueesesToArray(gotInNumberOfGuesses)
        }
        if (guessesRemaining == 4) {
            gotInNumberOfGuesses=3
            addNumberOfGueesesToArray(gotInNumberOfGuesses)
        }
        if (guessesRemaining == 3) {
            gotInNumberOfGuesses=4
            addNumberOfGueesesToArray(gotInNumberOfGuesses)
        }
        if (guessesRemaining == 2) {
            gotInNumberOfGuesses=5
            addNumberOfGueesesToArray(gotInNumberOfGuesses)
        }
        if (guessesRemaining == 1) {
            gotInNumberOfGuesses=6
            addNumberOfGueesesToArray(gotInNumberOfGuesses)
        }

        setTimeout(() => {
            nextLevel()
        }, 40)

    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            endGame();

        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'rgb(113, 197, 98)') {
                return
            }
            if (oldColor === 'rgb(255, 215, 0)' && color !== '#71C562') {
                return
            }
            elem.style.backgroundColor = color
            break
        }
    }
}

document.addEventListener('dblclick', function (event) {
    event.preventDefault();
}, { passive: false })

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent
    if (key === "Del") {
        key = "Backspace"
    }
    document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
})


const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element
        node.style.setProperty('--animate-duration', '0.3s');

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });

    });


function timeSelected(value) {
    document.getElementById("home").style.display = "none"
    document.querySelector('.title').style.visibility = 'visible';
    gameTime = value;
    startTimer(gameTime);
}
let startingTime;
for (const button of document.getElementsByClassName("time-selected")) {
    button.addEventListener('click', function () {
        timeSelected(button.value)
    });
}


function startTimer(value) {
    startingTime = value;
    time = startingTime * 60;
    let countdownEl = document.getElementById('timer')
    const interval = setInterval(countdownTimer, 1000)
    function countdownTimer() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        let formattedSeconds = seconds.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        countdownEl.innerHTML = `${minutes}:${formattedSeconds}`;
        time--;
        time = time = time < 0 ? 0 : time
        if (time <= 0) {
            clearInterval(interval)
            endGame()
        }
    }


}
function endGame() {
    //makes lose-modal visible, updates the score in the modal, shows current highscore,
    // celebratory message if new highscore, reset the board
    let modalDelay = 100;
    setTimeout(() => {
        document.getElementById('lose-modal').style.visibility = 'visible'
    }, modalDelay)
    resetBoard();
    document.getElementById('score-lose-modal').innerHTML = score
    document.getElementById('actualWord').innerHTML = rightGuessString.toUpperCase()
    checkIfHighScore(gameTime, score)
    addScoreToArray(gameTime)
    document.getElementById('highscore').innerHTML = localStorage.getItem('highScore' + gameTime, score)
    if (score > localStorage.getItem('highScore' + gameTime, score)) {
        document.getElementById("new-highscore").style.visibility = "visible"
    }
    //get one minute scores storage        
    time = 0;
    score = 0;
}


//scoring - local storage
function checkIfHighScore(gameTime, score) {
    let highScoreVersion = "highScore" + gameTime
    highScoreVersion = localStorage.getItem('highScore' + gameTime, score);
    if (highScoreVersion !== null) {
        if (score > highScoreVersion) {
            localStorage.setItem('highScore' + gameTime, score);
        }
    }
    else {
        localStorage.setItem("highScore" + gameTime, score);
    }
}

//restart button

document.getElementById("restart-button").addEventListener("click", function () {
    guessesRemaining = 6;
    rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
    currentGuess = [];
    nextLetter = 0;
    resetBoard()
    console.log(rightGuessString)
    startTimer(gameTime)
    document.getElementById("lose-modal").style.visibility = "hidden"
    document.getElementById("new-highscore").style.visibility = "hidden"


})
//statistics button
let statButtons = document.getElementsByClassName("stats-button");
for (let i = 0; i < statButtons.length; i++) {
    statButtons[i].addEventListener("click", function () {
        document.getElementById("stats-modal").style.visibility = "visible"
        document.getElementById("lose-modal").style.visibility = "hidden"
        document.getElementById("new-highscore").style.visibility = "hidden"
        document.getElementById("home").style.display = "none"
    });
}

//home button
let homeButtons = document.getElementsByClassName("home-button");
for (let i = 0; i < homeButtons.length; i++) {
    homeButtons[i].addEventListener("click", function () {
        document.getElementById("stats-modal").style.visibility = "hidden"
        document.getElementById("lose-modal").style.visibility = "hidden"
        document.getElementById("new-highscore").style.visibility = "hidden"
        document.getElementById("home").style.display = "block"
    });
}

//help button
document.getElementById("help-button").addEventListener("click", function () {
    document.getElementById("help-modal").style.visibility = "visible"
});

//close button
let closeButtons = document.getElementsByClassName("close-button");
for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener("click", function () {
        document.getElementById("help-modal").style.visibility = "hidden";
        document.getElementById("chart-modal").style.visibility = "hidden";
    })
};

//populate stats modal
document.getElementById('1-minute-high-score').innerHTML = getHighScore(1);
document.getElementById('2-minute-high-score').innerHTML = getHighScore(2);
document.getElementById('5-minute-high-score').innerHTML = getHighScore(5);
document.getElementById('10-minute-high-score').innerHTML = getHighScore(10);


function getHighScore(time) {
    if (localStorage.getItem('highScore' + time, score) === null) {
        return "Not Yet Played"
    }
    else {
        return "Highscore:&nbsp;" + localStorage.getItem('highScore' + time, score)
    }
}

function addNumberOfGueesesToArray(guessNumber){
    let scoreStorage = JSON.parse(localStorage.getItem("numberOfGuesses" + gameTime));
  if(gameTime ==1){
        if (scoreStorage !== null) {
            numberOfGuesses1 = JSON.parse(localStorage.getItem("numberOfGuesses1"));
            numberOfGuesses1.push(guessNumber)
            localStorage.setItem("numberOfGuesses1", JSON.stringify(numberOfGuesses1));
        }
        else {
            numberOfGuesses1.push(guessNumber)
            localStorage.setItem("numberOfGuesses1", JSON.stringify(numberOfGuesses1));
        } 
    } 
    else if(gameTime ==2){
        if (scoreStorage !== null) {
            numberOfGuesses2 = JSON.parse(localStorage.getItem("numberOfGuesses2"));
            numberOfGuesses2.push(guessNumber)
            localStorage.setItem("numberOfGuesses1", JSON.stringify(numberOfGuesses2));
        }
        else {
            numberOfGuesses1.push(guessNumber)
            localStorage.setItem("numberOfGuesses2", JSON.stringify(numberOfGuesses2));
        } 
    } 
    if(gameTime ==5){
        if (scoreStorage !== null) {
            numberOfGuesses5 = JSON.parse(localStorage.getItem("numberOfGuesses5"));
            numberOfGuesses5.push(guessNumber)
            localStorage.setItem("numberOfGuesses5", JSON.stringify(numberOfGuesses5));
        }
        else {
            numberOfGuesses5.push(guessNumber)
            localStorage.setItem("numberOfGuesses5", JSON.stringify(numberOfGuesses5));
        } 
    } 
    if(gameTime ==10){
        if (scoreStorage !== null) {
            numberOfGuesses10 = JSON.parse(localStorage.getItem("numberOfGuesses10"));
            numberOfGuesses10.push(guessNumber)
            localStorage.setItem("numberOfGuesses10", JSON.stringify(numberOfGuesses10));
        }
        else {
            numberOfGuesses10.push(guessNumber)
            localStorage.setItem("numberOfGuesses10", JSON.stringify(numberOfGuesses10));
        } 
    } 
}
/** 
function addScoreToArray(gameTime) {
    let scoreStorage = JSON.parse(localStorage.getItem("scoresForMinutes" + gameTime));
    if (gameTime == 1) {
        if (scoreStorage !== null) {
            scoresForMinutes1 = JSON.parse(localStorage.getItem("scoresForMinutes1"));
            scoresForMinutes1.push(score)
            localStorage.setItem("scoresForMinutes1", JSON.stringify(scoresForMinutes1));
        }
        else {
            scoresForMinutes1.push(score)
            localStorage.setItem("scoresForMinutes1", JSON.stringify(scoresForMinutes1));
        }
    }

    else if (gameTime == 2) {
        if (scoreStorage !== null) {
            scoresForMinutes2 = JSON.parse(localStorage.getItem("scoresForMinutes2"));
            scoresForMinutes2.push(score)
            localStorage.setItem("scoresForMinutes2", JSON.stringify(scoresForMinutes2));
        }
        else {
            scoresForMinutes2.push(score)
            localStorage.setItem("scoresForMinutes2", JSON.stringify(scoresForMinutes2));
        }
    }
    else if (gameTime == 5) {
        console.log("here in 5 ")
        if (scoreStorage !== null) {
            scoresForMinutes5 = JSON.parse(localStorage.getItem("scoresForMinutes5"));
            scoresForMinutes5.push(score)
            localStorage.setItem("scoresForMinutes2", JSON.stringify(scoresForMinutes5));
        }
        else {
            console.log("here in else")
            scoresForMinutes5.push(score)
            localStorage.setItem("scoresForMinutes5", JSON.stringify(scoresForMinutes5));
        }
    }
    else if (gameTime == 10) {
        if (scoreStorage !== null) {
            scoresForMinutes10 = JSON.parse(localStorage.getItem("scoresForMinutes10"));
            scoresForMinutes10.push(score)
            localStorage.setItem("scoresForMinutes10", JSON.stringify(scoresForMinutes10));
        }
        else {
            scoresForMinutes10.push(score)
            localStorage.setItem("scoresForMinutes10", JSON.stringify(scoresForMinutes10));
        }
    }


}
**/

//chart js

function createChart(gameTime) {
    let myArray = JSON.parse(localStorage.getItem("numberOfGuesses" + gameTime))
    const freqMap = myArray.reduce(
        (map, year) => map.set(year, (map.get(year) || 0) + 1),
        new Map
    );

    const xAxisArr = Array.from(freqMap.keys()); // array of unique numbers
    const yAxisArr = Array.from(freqMap.values()); // array of frequencies for number

    const labels = xAxisArr;
    const data = {
        labels: labels,
        datasets: [{
            backgroundColor: 'black',
            borderColor: 'black',
            data: yAxisArr
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        plugins: [ChartDataLabels],
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
                datalabels: {
                    anchor: 'end',
                    align: 'left',
                    formatter: Math.round,
                    font: {
                        weight: 'bold',
                    },
                    color: 'white'
                }
            }
        },
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}
function updateChart(number) {
    if (myChart) {
        myChart.destroy()
        createChart(number)
    }
    else {
        createChart(number)
    }
}
//functioning stats modal buttons
document.getElementById('1-minute-high-score').addEventListener("click", function () {
    document.getElementById('chart-modal').style.visibility = "visible"
    updateChart(1)
})
document.getElementById('2-minute-high-score').addEventListener("click", function () {
    document.getElementById('chart-modal').style.visibility = "visible"
    myChart.destroy();
    updateChart(2)
})
document.getElementById('5-minute-high-score').addEventListener("click", function () {
    document.getElementById('chart-modal').style.visibility = "visible"
    myChart.destroy();
    updateChart(5)
})
document.getElementById('10-minute-high-score').addEventListener("click", function () {
    document.getElementById('chart-modal').style.visibility = "visible"
    myChart.destroy();
    updateChart(10)
})