import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
let time;
let score = 0;


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
        setTimeout(() => {
            nextLevel()
        }, 40)

    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            let modalDelay = 0;
            setTimeout(() => {
                document.getElementById('lose-modal').style.visibility = 'visible'
            }, modalDelay)
            document.getElementById('score-modal').innerHTML = score
            document.getElementById('actualWord').innerHTML =  rightGuessString.toUpperCase()

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
    startTimer(value);
    document.querySelector('.title').style.visibility = 'visible';
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
    setInterval(countdownTimer, 1000)
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
        endGame()
    }

}

function endGame() {
    if (time === 0) {
      let modalDelay = 1001;
            setTimeout(() => {
                document.getElementById('lose-modal').style.visibility = 'visible'
            }, modalDelay)
        document.getElementById('score-modal').innerHTML = score
        document.getElementById('actualWord').innerHTML =  rightGuessString.toUpperCase()
    }
}