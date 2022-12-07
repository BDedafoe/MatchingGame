//Defining the game's variables using DOM elements
let cardArray: string [] =  ['⚽️', '🏀', '🏈', '🥎', '🎱', '🎾', '🏐', '⛳️', '🏆', '🎳', '🥊', '🏒', '🚴‍♀️', '🏄‍♂️', '🥍', '🥌', '🎮', '🪂']
let selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}
//Default gameboard before each game starts
let gameBoard = {                 
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
}

const shuffle = (cardArray: string []| string[]) => {

    for (let index = cardArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = cardArray[index]

        cardArray[index] = cardArray[randomIndex]
        cardArray[randomIndex] = original
    }

    return cardArray
}

let pickRandom = (cardArray: string []| string[], items: number) => {
 
    let randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * cardArray.length)
        
        randomPicks.push(cardArray[randomIndex])
        cardArray.splice(randomIndex, 1)
    }

    return randomPicks
}

let generateGame = () => {
    const dimensions: any =  selectors.board as HTMLElement | any;getAttribute('data-dimension')           //dimensions of the game board provided on index.html
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

    selectors.board as HTMLElement | null;replaceWith(parser.querySelector('.board')) 
}

let startGame = () => {
    gameBoard.gameStarted = true
    selectors.start as unknown as HTMLCollectionOf<HTMLElement>;add('disabled')  //The font color of the "start" button will change once the game begins

    type loop = {
        [key: string]: string | number;
      };

    gameBoard as unknown as HTMLCollectionOf<HTMLElement>;setInterval(() => {
        gameBoard.totalTime++

        selectors.moves as unknown as HTMLCollectionOf<HTMLElement>;        
        selectors.timer as unknown as HTMLCollectionOf<HTMLElement>;    }, 1000)
}

let flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    gameBoard.flippedCards = 0
}

let flipCard = (card: { classList: { add: (arg0: string) => void } }) => {
    gameBoard.flippedCards++
    gameBoard.totalFlips++

    if (!gameBoard.gameStarted) {
        startGame()
    }

    if (gameBoard.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (gameBoard.flippedCards === 2) {
        const flippedCards: any = document.querySelectorAll('.flipped:not(.matched)')

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
            selectors.boardContainer as HTMLElement | any;add('flipped')     //You won card with text. Displays only when the game is finsihed
            selectors.win as unknown as HTMLCollectionOf<HTMLElement>;            clearInterval(gameBoard,loop)
        }, 1000)
    }
}

let attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget: any = event.target
        const eventParent = eventTarget  

        if (eventTarget.includes('card') && !eventParent.className.includes('flipped') as unknown as HTMLCollectionOf<HTMLElement>) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()                  //Calling the function generateGame 
attachEventListeners()          //Calling the use of eventListeners

function replaceWith(arg0: any) {
    throw new Error("Function not implemented.")
}

function getAttribute(arg0: string) {
    throw new Error("Function not implemented.")
}

function add(arg0: string) {
    throw new Error("Function not implemented.")
}

function includes(arg0: string) {
    throw new Error("Function not implemented.")
}

function loop(gameBoard: { gameStarted: boolean; flippedCards: number; totalFlips: number; totalTime: number }, loop: any) {
    throw new Error("Function not implemented.")
}

