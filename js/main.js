import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let gameCount = 0;
let rightGuessString = WORDS[gameCount]
let wordsArray = [];


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
}

initBoard()

document.addEventListener("keyup", (e) => {

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
    animateCSS(box, "pulse")
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
    gameCount = gameCount + 1
    console.log("inside next level" + gameCount);
    guessesRemaining = 6;
    rightGuessString = WORDS[gameCount];
    console.log("next word" + rightGuessString);
    currentGuess = [];
    nextLetter = 0;
    resetBoard();
    document.getElementById('win-modal').style.visibility = 'hidden'
    document.getElementById('lose-modal').style.visibility = 'hidden'

}
function resetBoard() {
    //clear grid
    document.getElementById("game-board").innerHTML = ("");
    initBoard();
    //reset colour of keyboard
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = "rgb(243, 243, 243)"
    }
}

function showStatsView() {
    // Text on stats page
    document.querySelector("h1").innerText = "YOU ARE"
    let modalDelay = 3600
    setTimeout(() => {
        document.querySelector("h2").innerText = "HAPPY MOTHERS DAY"
    }, modalDelay)

    // modal
    document.querySelector("#keyboard-cont").style.display = 'none'
    document.getElementById('win-modal').style.visibility = 'hidden'
    document.getElementById('lose-modal').style.visibility = 'hidden'
    document.getElementById("game-board").innerHTML = ("");

    //create board
    resetBoard();
    let boxes = document.getElementsByClassName("letter-box")

    //make wordArray
    let adjectives = ['funny', 'loyal', 'great', 'super', 'elite', 'loved'];
    for (let i = 0; i < adjectives.length; i++) {
        for (let j = 0; j < 5; j++) {
            wordsArray.push(adjectives[i][j])
        }
    }
    //populateColumns
    getColumns(0, boxes, 600);
    getColumns(1, boxes, 1200);
    getColumns(2, boxes, 1800);
    getColumns(3, boxes, 2400);
    getColumns(4, boxes, 3000);
}

function getColumns(startPosition, boxes, delay) {
    let column = [];
    //get letters
    for (let i = startPosition; i < boxes.length; i += 5) {
        setTimeout(() => {
            boxes[i].innerHTML = wordsArray[i]
        })
        //get colour and flip animation
        column.push(boxes[i]);
        adjectiveAnimation(column, delay)
    }
}

function adjectiveAnimation(column, delay) {
    for (let i = 0; i < column.length; i++) {
        setTimeout(() => {
            //flip box
            animateCSS(column[i], 'flipInY')
            //shade box
            column[i].style.backgroundColor = "#71C562"
            column[i].style.border = "none"
            column[i].style.padding = "2px"
            //add letter
        }, delay)
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

        let delay = 600 * i
        setTimeout(() => {
            //flip box
            animateCSS(box, 'flipInY')
            //shade box
            box.style.backgroundColor = letterColor
            box.style.border = "none"
            box.style.padding = "2px"
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        let modalDelay = 3000
        setTimeout(() => {
            document.getElementById('win-modal').style.visibility = 'visible'
        }, modalDelay)
        if (gameCount < 5) {
            document.getElementById("next-level-button").innerText = "Next Level"
            document.getElementById("next-level-button").addEventListener("click", nextLevel)
        }
        else {
            document.getElementById("next-level-button").innerText = "View Stats"
            document.getElementById("next-level-button").addEventListener("click", showStatsView)

        }
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            let modalDelay = 3000
            setTimeout(() => {
                document.getElementById('lose-modal').style.visibility = 'visible'
            }, modalDelay)
            if (gameCount < 5) {
                document.getElementById('actualWord').innerHTML = `The correct word was: ${rightGuessString.toUpperCase()}`
                document.getElementById("next-level-lose-button").innerText = "Next Level"
                document.getElementById("next-level-lose-button").addEventListener("click", nextLevel)
            }
            else {
                document.getElementById('actualWord').innerHTML = `The right word was: ${rightGuessString.toUpperCase()}`
                document.getElementById("next-level-lose-button").innerText = "View Stats"
                document.getElementById("next-level-lose-button").addEventListener("click", showStatsView)
            }
        }
    }
}

function shadeKeyBoard(letter, color) {
    console.log("hereee" +color)
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            console.log("oldcolor" +oldColor)
            console.log("color" + color)
            if (oldColor === 'rgb(113, 197, 98)') {
                return
            }
            if (oldColor === 'rgb(255, 215, 0)' && color !== '#71C562') {
                console.log("hi")
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