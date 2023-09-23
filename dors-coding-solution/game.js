// Module => ends with (); IIFE
const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector('#message').innerHTML = message;
    }
    // Expose to outside world
    return {
        renderMessage,
    }
})();

// Module => ends with (); IIFE
const Gameboard = (() => {
    let gameboard = ['', '', '', '', '', '', '', '', '']; // Is this the best way or just one ''?

    // Display gameboard
    const render = () => {
        let boardHTML = '';
        gameboard.forEach((square, index) => {
            boardHTML += `<div class='square' id='square-${index}'>${square}</div>`;
            // Use textContent instead of innerHTML...dont put html in js:
            // boardHTML += ???
        })
        document.querySelector('#gameboard').innerHTML = boardHTML;
        // Use textContent instead of innerHTML
        // document.querySelector('#gameboard').textContent = boardHTML;

        const squares = document.querySelectorAll('.square');
        squares.forEach((square) => {
            square.addEventListener('click', Game.handleClick);
        })
    }

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    // Access(accessory??) but not modify gameboard
    const getGameboard = () => gameboard;  // Reutrns the gameboard indirectly

    // For functions to have acces to module:
    // Expose to outside world
    return {
        render,
        update,
        getGameboard
    }
})();

// Player factory...multiple of same type, use a factory
const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

// Game module...to start game
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector('#player1').value, 'X'),
            createPlayer(document.querySelector('#player2').value, 'O')
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();

        const squares = document.querySelectorAll('.square');
        squares.forEach((square) => {
            square.addEventListener('click', handleClick);
        })
    }

    const handleClick = (event) => {
        if (gameOver) {
            return;
        }

        let index = parseInt(event.target.id.split('-')[1]);

        // Does not allow to change if 'mark' is already there
        if (Gameboard.getGameboard()[index] !== '')
            return;

        Gameboard.update(index, players[currentPlayerIndex].mark);
        
        // Logic to know if game has finished
        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            // alert(`${players[currentPlayerIndex].name} won!`);
            displayController.renderMessage(`${players[currentPlayerIndex].name} won!`);
        } else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            // alert("It's a tie!");
            displayController.renderMessage("It's a tie!");
        }

        // Allows 'O' for clicks or it will only show 'X'
        // Ternary operator to switch the player/mark
        // If it's 0 it becomes 1, if it's 1 it becomes 0
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, '');
        }
        Gameboard.render();
        gameOver = false;
        document.querySelector('#message').innerHTML = '';
    }

    return {
        start,
        restart,
        handleClick
    }
})();

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    // Check to see if this works:
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== '');
}

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener('click', () => {
    Game.restart();
})

const startButton = document.querySelector('#start-button');
startButton.addEventListener('click', () => {
    Game.start();
})