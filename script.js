//because js doesn't have enums :)
const PLAYER_TYPE_HUMAN = 'human'
const PLAYER_TYPE_COMPUTER = 'computer'

//game statuses
const GAME_STATUS_ENDED = 'ended';
const GAME_STAUTS_RUNNING = 'running';
const GAME_STATUS_DRAW = 'draw';

//edit cell response types
const EDIT_CELL_FAILED = -1;




let createBoard = function () {
    const _board = [[0, 1, 2], [3, 4, 5], [6, 7, 8],]

    let gameStatus = GAME_STAUTS_RUNNING;
    let numberOfFilledOutCells = 0
    let winningCells = [];
    let winnerPlayer = -1
    //TODO replace the loops with smarter method
    //since the board is small it won't be a performance issue initially
    let evaluateTheGameStatus = function () {
        // showBoardToConsol()
        for (let i = 0; i < 3; i++) {
            console.log(_board[i][0], _board[i][1]);

            // Check rows
            if (_board[i][0] === _board[i][1] && _board[i][1] === _board[i][2]) {
                gameStatus = GAME_STATUS_ENDED;
                winningCells = [[i, 0], [i, 1], [i, 2]];
                console.log("WINNING CELLS!", winningCells);
                return gameStatus;
            }

            // Check columns
            if (_board[0][i] === _board[1][i] && _board[1][i] === _board[2][i]) {
                gameStatus = GAME_STATUS_ENDED;
                winningCells = [[0, i], [1, i], [2, i]];
                console.log("WINNING CELLS!", winningCells);
                return gameStatus;
            }
        }

        // Check diagonals
        if (_board[0][0] === _board[1][1] && _board[1][1] === _board[2][2]) {
            gameStatus = GAME_STATUS_ENDED;
            winningCells = [[0, 0], [1, 1], [2, 2]];
            console.log("WINNING CELLS!", winningCells);
            return gameStatus;
        }

        if (_board[1][1] === _board[0][2] && _board[2][0] === _board[1][1]) {
            gameStatus = GAME_STATUS_ENDED;
            winningCells = [[1, 1], [0, 2], [2, 0]];
            console.log("WINNING CELLS!", winningCells);
            return gameStatus;
        }
        if (numberOfFilledOutCells == 9 && gameStatus != GAME_STATUS_ENDED) {
            gameStatus = GAME_STATUS_DRAW;
        }
        console.log(gameStatus, numberOfFilledOutCells, _board)
        return gameStatus
    }
    let editThisCell = function (i, j, player) {
        console.log(typeof (_board[i][j]))
        if (typeof (_board[i][j]) == "number") {
            _board[i][j] = player.logo
            numberOfFilledOutCells++;
            let result = evaluateTheGameStatus();
            if (result == GAME_STATUS_ENDED)
                winnerPlayer = player.id;
            return evaluateTheGameStatus();
        }
        else return EDIT_CELL_FAILED;
    }
    let showBoardToConsol = function () {
        console.log("-------------board---------------------")
        for (let i = 0; i < 3; i++) {
            console.log(_board[i][0], _board[i][1], _board[i][2])
        }

        console.log("--------------------------------------")
    }
    let getBoard = function () {
        return _board;
    }
    let giveMethisCell = function (i, j) {
        return _board[i][j]
    }
    let giveMeEmptyCell = function () {

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (typeof (_board[i][j]) == 'number') {
                    return { i, j }
                }
            }
        }
        return "none"
    }
    let giveMeGameStatus = function () {
        return gameStatus;
    }
    let isThisCellFilledOut = function (i, j) {
        return typeof (_board[i][j]) != "number";
    }
    let giveMeWinningCells = function () {
        return winningCells;
    }
    let giveMeTheWinner = function () {
        return winnerPlayer
    }
    return { winnerPlayer, giveMeTheWinner, showBoardToConsol, editThisCell, evaluateTheGameStatus, giveMeGameStatus, giveMeEmptyCell, isThisCellFilledOut, giveMethisCell, _board, winningCells, giveMeWinningCells }

}

function createPlayer(id, name, type, logo) {
    let wins = 0;
    let increaseScore = function () {
        console.log('Before increment: ', wins);
        wins++;
        console.log('After increment: ', wins);

    }
    let giveMeScore = function () {
        return wins;
    }
    return {
        id, name, logo, wins, type, increaseScore, giveMeScore
    }
}

function createGame(player1, player2, startWith) {
    let theGameBoard = createBoard();
    let poolOfPlayers = [player1, player2]
    let currTurn = startWith;
    let playThisRound = function ({ i: cell_i, j: cell_j }) {
        //console.log("playing " + "player " + currTurn + "||" + cell_i + " : " + cell_j)
        let moveResult = theGameBoard.editThisCell(cell_i, cell_j, poolOfPlayers[currTurn])
        //console.log('movementresult, before turn ' + currTurn, moveResult)
        if (moveResult != EDIT_CELL_FAILED)
            currTurn = currTurn == 0 ? 1 : 0
        //console.log('after result', currTurn)

        return moveResult
    }
    let giveMeCurrTurn = () => currTurn;
    let currSign = () => {
        return poolOfPlayers[currTurn].logo;
    }
    let giveMePoolOfPlayers = function () { return poolOfPlayers }

    let increaseScoreForPlayer = function (playerId) {
        // poolOfPlayers[playerId].wins++
        console.log(poolOfPlayers[playerId])

        poolOfPlayers[playerId].increaseScore()
        console.log(poolOfPlayers[playerId])

    }

    return { playThisRound, increaseScoreForPlayer, giveMePoolOfPlayers, theGameBoard, poolOfPlayers, currTurn, currSign, giveMeCurrTurn, player1, player2 };
}


function ScreenController() {
    const board = document.querySelector("#board");
    const player1Select = document.querySelector("#player1-type-select");
    const player2Select = document.querySelector("#player2-type-select");
    const startGameBtn = document.querySelector('#start-game-btn');
    const player1NameInput = document.querySelector("#player1-name-input");
    const player2NameInput = document.querySelector("#player2-name-input");
    const player1Name = document.querySelector("#player1-name")
    const player2Name = document.querySelector("#player2-name")
    const roundH2 = document.querySelector('#round');
    let currGame;
    let gameActive = false;
    let round = 0


    let updateLayout = function () {

        for (let ii = 0; ii < 9; ii++) {
            let cell = document.createElement('div');
            cell.className = "cell";
            cell.id = `cell-${ii}`;
            cell.addEventListener('click', () => {
                if (gameActive) {
                    //console.log("normal player move", Math.floor(ii / 3), ii % 3)
                    let i = Math.floor(ii / 3)
                    let j = ii % 3
                    //console.log('before', currGame.endTheGamecurrTurn);
                    let result = currGame.playThisRound({ i, j });
                    if (result == EDIT_CELL_FAILED) { return }
                    updateTheBoard()

                    if (result != GAME_STAUTS_RUNNING) {
                        endTheGame()
                    }
                    //console.log('after', currGame.giveMeCurrTurn());
                    letRobotPlay()

                }

            });
            board.insertAdjacentElement('afterbegin', cell)
        }
    }
    let endTheGame = function () {
        let gameStateP = document.querySelector('#game-state');

        gameStateP.innerHTML = "game ended!"
        console.log(currGame.theGameBoard.giveMeWinningCells())
        console.log(currGame.theGameBoard.giveMeGameStatus())
        // console.log('winner', currGame.theGameBoard.giveMeTheWinner())
        if (currGame.theGameBoard.giveMeGameStatus() == GAME_STATUS_ENDED) {
            let theWinnderId = currGame.theGameBoard.giveMeTheWinner();
            console.log(currGame.giveMePoolOfPlayers()[theWinnderId])
            currGame.increaseScoreForPlayer(theWinnderId)
            console.log(currGame.giveMePoolOfPlayers()[theWinnderId])
            document.querySelector(`#player${theWinnderId + 1}-score`).innerHTML = currGame.giveMePoolOfPlayers()[theWinnderId].giveMeScore();
            for (let ii = 0; ii < currGame.theGameBoard.giveMeWinningCells().length; ii++) {
                let i = currGame.theGameBoard.giveMeWinningCells()[ii][0]
                let j = currGame.theGameBoard.giveMeWinningCells()[ii][1]
                let cellx = document.querySelector(`#cell-${(i) * 3 + j}`)

                cellx.style.color = ' #8e66c0'
            }
        }
        gameActive = false
        // player1Select.hidden = false
        // player2Select.hidden = false
        startGameBtn.hidden = false
    }
    let player1;

    let player2;
    let startGame = function () {
        let gameStateP = document.querySelector('#game-state');

        gameStateP.innerHTML = ""
        if (round == 0) {
            player1 = createPlayer(0, player1NameInput.value == '' ? "player1" : player1NameInput.value, player1Select.value == 'human' ? PLAYER_TYPE_HUMAN : PLAYER_TYPE_COMPUTER, 'X')
            player2 = createPlayer(1, player2NameInput.value == '' ? "player2" : player2NameInput.value, player2Select.value == 'human' ? PLAYER_TYPE_HUMAN : PLAYER_TYPE_COMPUTER, 'O')
        }
        currGame = createGame(player1, player2, 0)
        player1Name.innerHTML = player1.name;
        player2Name.innerHTML = player2.name;
        player1Name.hidden = false;
        player2Name.hidden = false;
        player1NameInput.hidden = true;
        player2NameInput.hidden = true;
        player1Select.hidden = true
        player2Select.hidden = true
        startGameBtn.hidden = true
        //if first player is robot
        gameActive = true;
        board.innerHTML = ''
        updateLayout()

        letRobotPlay()
        round++;

        roundH2.innerHTML = `Round ${round}`
        roundH2.hidden = false




    }

    let letRobotPlay = function () {
        //console.log("letrobotplay ", currGame.poolOfPlayers[currGame.currTurn].type, currGame.currTurn)
        if (currGame.poolOfPlayers[currGame.currTurn].type == PLAYER_TYPE_COMPUTER && currGame.theGameBoard.giveMeGameStatus() == GAME_STAUTS_RUNNING) {
            //console.log(currGame.poolOfPlayers[currGame.currTurn].type, currGame.theGameBoard.giveMeGameStatus())

            let result = currGame.playThisRound(currGame.theGameBoard.giveMeEmptyCell())

            updateTheBoard()
            if (result != GAME_STAUTS_RUNNING) {
                endTheGame()
            }
            letRobotPlay()
        }
    }
    let updateTheBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (currGame.theGameBoard.isThisCellFilledOut(i, j)) {
                    let cellx = document.querySelector(`#cell-${(i) * 3 + j}`)
                    //console.log(currGame.theGameBoard.showBoardToConsol())
                    cellx.innerHTML = currGame.theGameBoard.giveMethisCell(i, j)
                }
            }
        }

    }

    startGameBtn.addEventListener('click', startGame);


    updateLayout()

}
ScreenController();


// const User = function (name) {
//     name = name;
//     discordName = "@" + name;
// }
// hey, this is a constructor -
// then this can be refactored into a factory!

// function createUser(name) {
//     let discordName = "@" + name;
//     let printName = function () {
//         console.log(discordName)
//     }
//     let editName = function (newName) {
//         discordName = newName
//     }
//     return { printName, editName };
// }

// function Userr(name) {
//     name = name;
//     printName = function () {
//         console.log(name)
//     };
// }
// let user1 = createUser('name1')
// user1.discordName = 'sdf'
// // user1.editName("asd")
// user1.printName()


// let user2 = new Userr("name2")
// user2.name = 'sdf2'
// user2.printName()