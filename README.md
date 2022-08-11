# Timed Wordle
Timed Wordle is a variation of the popular Wordle game where players are racing against time to get the highest score. Players can choose from four different game modes and can view their stats and highscore for each.

**Link to project:** https://timedwordle.netlify.app

<a href="https://timedwordle.netlify.app" target="_blank"><img src="images/Screenshot 2022-07-13 at 19.32.02.png" alt="screenshot of timed wordle"/></a>

## How It's Made:

**Tech used:** HTML, CSS & JavaScript

The board is made in-situ using JavaScript and words are selected randomly from an external words.js array. Wordle uses keyup event listeners to allow keyboard input and logic to determine letters that match the randomly selected word. A countdown timer was implemented depending on which time selected and will countdown. Progression to the next level occurs when the right answer is obtained. Wordle matches each word input to the words.js array and if the word is not present then a modal pops up saying that the word is not in the list. This modal was created using a CSS library called Toastr. Using ChartJS and local storage stats of Wordle are retained and shown in the form of a bar chart. This shows highschores for each mode alongside how many guesses it took for each level. 

## Optimizations

Other additions I would like to make is an arcade version where if you get a word correct it would add time to your time remaining. Depending on how quick you got it, more time is added. Fully implement a dark mode, at the moment the button is there for it but it is not functional. 

## Lessons Learned:

- [x] How to use ChartJS
- [x] Implementing a countdown 
- [x] Using local storage to store scores


