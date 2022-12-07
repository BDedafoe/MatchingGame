"use strict";
let __spreadArray = (this && window.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
//Defining the game's variables using DOM elements
let cardArray = ['⚽️', '🏀', '🏈', '🥎', '🎱', '🎾', '🏐', '⛳️', '🏆', '🎳', '🥊', '🏒', '🚴‍♀️', '🏄‍♂️', '🥍', '🥌', '🎮', '🪂'];
let selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
};
//Default gameboard before each game starts
let gameBoard = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
};
let shuffle = function (cardArray) {
    for (let index = cardArray.length - 1; index > 0; index--) {
        let randomIndex = Math.floor(Math.random() * (index + 1));
        let original = cardArray[index];
        cardArray[index] = cardArray[randomIndex];
        cardArray[randomIndex] = original;
    }
    return cardArray;
};
let pickRandom = function (cardArray, items) {
    let randomPicks = [];
    for (let index = 0; index < items; index++) {
        let randomIndex = Math.floor(Math.random() * cardArray.length);
        randomPicks.push(cardArray[randomIndex]);
        cardArray.splice(randomIndex, 1);
    }
    return randomPicks;
};
let generateGame = function () {
    let dimensions = selectors.board.getAttribute('data-dimension'); //dimensions of the game board provided on index.html
    let emojis = cardArray; //emojis representing the pictures from the cardArray
    let picks = pickRandom(emojis, (dimensions * dimensions) / 2); //picks the emojis by random and divides by 2 as there are 2 per match
    let items = shuffle(__spreadArray(__spreadArray([], picks, true), picks, true));
    let cards = "\n        <div class=\"board\" style=\"grid-template-columns: repeat(".concat(dimensions, ", auto)\">\n            ").concat(items.map(function (item) { return "\n                <div class=\"card\">\n                    <div class=\"card-front\"></div>\n                    <div class=\"card-back\">".concat(item, "</div>\n                </div>\n            "); }).join(''), "\n       </div>\n    ");
    let parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.replaceWith(parser.querySelector('.board'));
};
let startGame = function () {
    gameBoard.gameStarted = true;
    selectors.start.classList.add('disabled'); //The font color of the "start" button will change once the game begins
    gameBoard.loop = setInterval(function () {
        gameBoard.totalTime++;
        selectors.moves.innerText = "".concat(gameBoard.totalFlips, " Moves"); //counting of number of flips to win
        selectors.timer.innerText = "Time: ".concat(gameBoard.totalTime, " Seconds"); //counting the time it takes to win. 1 Second increments
    }, 1000);
};
let flipBackCards = function () {
    document.querySelectorAll('.card:not(.matched)').forEach(function (card) {
        card.classList.remove('flipped');
    });
    gameBoard.flippedCards = 0;
};
let flipCard = function (card) {
    gameBoard.flippedCards++;
    gameBoard.totalFlips++;
    if (!gameBoard.gameStarted) {
        startGame();
    }
    if (gameBoard.flippedCards <= 2) {
        card.classList.add('flipped');
    }
    if (gameBoard.flippedCards === 2) {
        let flippedCards = document.querySelectorAll('.flipped:not(.matched)');
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }
        setTimeout(function () {
            flipBackCards();
        }, 1000);
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) { //Function to start when all cards have been matched; winning the game
        setTimeout(function () {
            selectors.boardContainer.classList.add('flipped'); //You won card with text. Displays only when the game is finsihed
            selectors.win.innerHTML = "<span class=\"win-text\">                                 \n                    You won!<br/>\n                    with <span class=\"highlight\">".concat(gameBoard.totalFlips, "</span> moves <br/>  \n                    under <span class=\"highlight\">").concat(gameBoard.totalTime, "</span> seconds\n                </span>");
            clearInterval(gameBoard.loop);
        }, 1000);
    }
};
let attachEventListeners = function () {
    document.addEventListener('click', function (event) {
        let eventTarget = event.target;
        let eventParent = eventTarget.parentElement;
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        }
        else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
};
generateGame(); //Calling the function generateGame 
attachEventListeners(); //Calling the use of eventListeners
