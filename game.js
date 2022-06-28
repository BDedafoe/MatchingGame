//Defining the game's variables using DOM elements
let cardArray =  ['⚽️', '🏀', '🏈', '🥎', '🎱', '🎾', '🏐', '⛳️', '🏆', '🎳']
let selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

//Default state of each start
let state = {                 
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
}

let shuffle = cardArray => {

    for (let index = cardArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = cardArray[index]

        cardArray[index] = cardArray[randomIndex]
        cardArray[randomIndex] = original
    }

    return cardArray
}

let pickRandom = (cardArray, items) => {
 
    let randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * cardArray.length)
        
        randomPicks.push(cardArray[randomIndex])
        cardArray.splice(randomIndex, 1)
    }

    return randomPicks
}

let generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')           //dimensions of the game board provided on index.html
    const emojis = cardArray                                                    //emojis representing the pictures from the cardArray
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2)            //picks the emojis by random and divides by 2 as there are 2 per match
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

let startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')  //The font color of the "start" button will change once the game begins

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`       //counting of number of flips to win
        selectors.timer.innerText = `time: ${state.totalTime} sec`   //counting the time it takes to win. 1 Second increments
    }, 1000)

    
}

let flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

let flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

   
    if (!document.querySelectorAll('.card:not(.flipped)').length) {     //Function to start when all cards have been matched; winning the game
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')           //You won card with text. Displays only when the game is finsihed
            selectors.win.innerHTML = `<span class="win-text">                                 
                    You won!<br/>
                    with <span class="highlight">${state.totalFlips}</span> moves <br/>  
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>`
            clearInterval(state.loop)
        }, 1000)
    }
}

let attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()                  //Calling the function generateGame 
attachEventListeners()          //Calling the use of eventListeners
