'use strict'
const BOMB = '💣'
const COVER = '🧧';
const EMPTY = ' ';
const FLAG = '⛳';
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);
var gCount = 0;
var gShowTimeInterval;
var gStartTime;
var gTimeElasped;
var gTimer = 0;
var gLives = 0;
var gBoard = [];
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function initGame() {
    if (gLevel.MINES === 2) gLives = 1;
    else gLives = 3
    clearInterval(gShowTimeInterval);
    gShowTimeInterval = null;
    gBoard = buildBoard()
    renderBoard(gBoard)
    addBomb()
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gCount = 0;
    var label = document.querySelector(".label");
    label.innerText = `you have ${gLives} more lives`
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function renderBoard(board) {
    // Render the board as a <table> to the page
    var strHTML = '   <table class="table" border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {

            var shownInCell = COVER
            var className = 'cell covered cell' + i + '-' + j;
            strHTML += '<td  oncontextmenu="cellMarked(this,' + i + ',' + j + ')" class="' + className + '" onclick=cellClicked(this,' + i + ',' + j + ') > ' + shownInCell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function beginner() {
    reset()
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gLives = 1
    initGame()
}
function medium() {
    reset()
    gLevel.SIZE = 8
    gLevel.MINES = 4
    gLives = 3
    initGame()
}
function expert() {
    reset()
    gLevel.SIZE = 12
    gLevel.MINES = 6
    gLives = 3
    initGame()
}
function tooMuch() {
    reset()
    gLevel.SIZE = 16
    gLevel.MINES = 8
    gLives = 3
    initGame()
}

function setMinesNegsCount(board, pos) {
    var count = 0;
    if (board[pos.i][pos.j].isMine) return BOMB;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                count++;
            }
        }
    }
    if (!count) {
        return EMPTY;
    }
    currCell.minesAroundCount = count;
    return currCell.minesAroundCount;
}

function cellClicked(elCell, i, j) {
    // checkGameOver();
    elCell.classList.remove('covered')
    var pos = { i: i, j: j }
    elCell.innerText = setMinesNegsCount(gBoard, pos)
    if (gTimer === 0) {
        startClock()
        var label = document.querySelector(".label");
        label.innerText = `you have ${gLives} more lives`
        gTimer++
    }
    if (gBoard[i][j].isMarked === true) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
    }
    if (gBoard[i][j].isMine === true) {
        if (gBoard[i][j].isShown === false) {
            gBoard[i][j].isShown = true;
            gLives--;
            gGame.shownCount++
            gCount++
            var label = document.querySelector(".label");
            label.innerText = `you have ${gLives} more lives`
        }
    }
    if (gLives === 0) {
        loseGame()
    }
    // console.log('gBoard[i][j].isShown:', gBoard[i][j].isShown)
    if (gBoard[i][j].isShown) return
    if (parseInt(elCell.innerText)) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++
        gCount++
        checkGameOver();
        return
    }
    gGame.shownCount++
    gCount++
    expandShown(gBoard, elCell, i, j)
    checkGameOver();
}

function cellMarked(elCell, i, j) {
    // console.log('elCell:', elCell)
    // Called on right click to mark a cell (suspected to be a mine)
    if (gTimer === 0) {
        startClock()
        gTimer++
    }
    checkGameOver()
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    elCell.innerHTML = FLAG;
    checkGameOver()
    // if (gGame.markedCount === gLevel.MINES) {
    //     winGame()
    // }
}
function loseGame() {
    stopClock();
    gGame.isOn = false;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine == true) {
                var elBomb = document.querySelector('.cell' + i + '-' + j);
                elBomb.innerText = BOMB;
            }

        }
    }
    var elTable = document.querySelector('.board-container');
    elTable.classList.add('disable')
    var restart = document.querySelector(".reset");
    restart.innerText = `😫`
    var label = document.querySelector(".label");
    label.innerText = `you lost...\n to new game press the sad emoji`
}

function winGame() {
    var restart = document.querySelector(".reset");
    restart.innerText = `😎`
    stopClock()
    var label = document.querySelector(".label");
    label.innerText = `you win!!\n your total time is: ${gGame.secsPassed}`
}

function checkGameOver() {
    // Game ends when all mines are marked, and all the other cells
    // are shown
    console.log('gLives:', gLives)
    var bombsExploaded = 3 - gLives;
    var remainingBombs = (gLevel.MINES - bombsExploaded)
    // console.log('gGame.shownCount:', gGame.shownCount)
    // console.log('gLevel.SIZE*gLevel.SIZE:', gLevel.SIZE*gLevel.SIZE)
    // console.log('remainingBombs:', remainingBombs)
    if (gLevel.SIZE === 4) {
        remainingBombs = 2;
    }
    // if ((remainingBombs === gGame.markedCount) && (((gLevel.SIZE*gLevel.SIZE) - gGame.shownCount) === remainingBombs)) {
    console.log('gGame.markedCount:', gGame.markedCount)
    console.log('remainingBombs:', remainingBombs)
    console.log('gLevel.MINES:', gLevel.MINES)
    console.log('gGame.shownCount:', gGame.shownCount)
    if (((remainingBombs + gGame.markedCount === gLevel.MINES) && (((gLevel.SIZE * gLevel.SIZE) - gGame.shownCount) === gGame.markedCount)) || (((remainingBombs === gGame.markedCount) && (((gLevel.SIZE * gLevel.SIZE) - gGame.shownCount) === remainingBombs)))) {
        winGame()
    }
    if (gLives === 0) {
        loseGame()
    }
}

function expandShown(board, elCell, i, j) {
    if (elCell.innerText === BOMB) return
    if (elCell.innerText === FLAG) return
    if (elCell.innerText === EMPTY) return
    var pos = { i: i, j: j }
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) board[i][j].isShown++
            else {
                var currNeighbor = { i: i, j: j }
                if (board[currNeighbor.i][currNeighbor.j].isMine === false) {

                    var elmashu = document.querySelector('.cell' + i + '-' + j);
                    elmashu.innerText = setMinesNegsCount(board, currNeighbor)
                    elmashu.classList.remove('covered')
                    // console.log('elCell:', elCell)
                    if (!board[currNeighbor.i][currNeighbor.j].isShown) {
                        board[currNeighbor.i][currNeighbor.j].isShown++
                        gGame.shownCount++
                        gCount++
                        // checkGameOver()
                    }
                    // board[currneighbor.i][currneighbor.j].innerText = setMinesNegsCount(board, pos)
                    // cellClicked(elCell, i, j)
                }
            }
        }

    }
}

function addBomb() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var emptyCells = getEmptyCells(gBoard);
        var randIdx = getRandomInt(0, emptyCells.length)
        var emptyCell = emptyCells.splice(randIdx, 1)[0]
        var pos = { i: emptyCell.i, j: emptyCell.j }
        gBoard[emptyCell.i][emptyCell.j].isMine = true;
        renderCell(emptyCell, COVER);
    }
}

function getEmptyCells(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (!currCell.isMine) {
                var pos = { i: i, j: j }
                emptyCells.push(pos);
            }
        }
    }
    return emptyCells;
}

function startClock() {
    gStartTime = new Date();
    var timer = document.querySelector(".timer");
    gShowTimeInterval = setInterval(function () {
        gTimeElasped = (new Date() - gStartTime);
        var timeElaspedMilSeconds = parseInt(gTimeElasped % 1000) / 100;
        var timeDisplay = (parseInt(gTimeElasped / 1000)) + '.' + timeElaspedMilSeconds.toFixed();
        timer.innerText = `⏰ ${timeDisplay} sec ⏰`
        gGame.secsPassed = timeDisplay;
    }, 2);
}

function stopClock() {
    var resetBtn = document.querySelector(".reset");
    resetBtn.classList.toggle("hidden");

    clearInterval(gShowTimeInterval);
    gShowTimeInterval = null;

}

function reset() {
    var elTable = document.querySelector('.board-container');
    elTable.classList.remove('disable')
    var restart = document.querySelector(".reset");
    restart.innerText = `😁`
    var timer = document.querySelector(".timer");
    timer.innerHTML = '';
    gTimer = 0;
    gStartTime = null;
    gTimeElasped = null;
    initGame()
}


// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
