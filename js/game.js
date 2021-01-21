'use strict'
const BOMB = '💣'
const COVER = '🧧';
const EMPTY = ' ';
const FLAG = '⛳';
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
}, false);
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
gLives = gLevel.MINES;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function initGame() {
    gLives = gLevel.MINES;
    clearInterval(gShowTimeInterval);
    gShowTimeInterval = null;
    gBoard = buildBoard()
    renderBoard(gBoard)
    addBomb()
    var label = document.querySelector(".label");
    label.innerText = `you have ${gLives} more lives`
    console.log('gBoard:', gBoard)
    // var elButton=document.querySelector('.reset')
    // elButton.classList.add('restart')
}

function buildBoard() {
    var board = [];
    // for (var i = 0; i < size; i++) {
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
            var className = 'cell cell' + i + '-' + j;
            strHTML += '<td  oncontextmenu="cellMarked(this)" class="' + className + '" onclick=cellClicked(this,' + i + ',' + j + ') > ' + shownInCell + ' </td>'
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
    gLives = gLevel.MINES
    initGame()
}
function medium() {
    // gTimer === 0
    reset()
    gLevel.SIZE = 8
    gLevel.MINES = 4
    gLives = gLevel.MINES
    initGame()
}
function expert() {
    // gTimer === 0
    reset()
    gLevel.SIZE = 12
    gLevel.MINES = 6
    gLives = gLevel.MINES
    initGame()
}
function tooMuch() {
    // gTimer === 0
    reset()
    gLevel.SIZE = 16
    gLevel.MINES = 8
    gLives = gLevel.MINES
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
    checkGameOver();
    if (gTimer === 0) {
        startClock()
        var label = document.querySelector(".label");
        label.innerText = `you have ${gLives} more lives`
        gTimer++
    }
    var pos = { i: i, j: j }
    elCell.innerText = setMinesNegsCount(gBoard, pos)
    if (gBoard[i][j].isMine === true) {
        gLives--;
        var label = document.querySelector(".label");
        label.innerText = `you have ${gLives} more lives`
    }
    if (gLives === 0) {
        stopClock();
        var restart = document.querySelector(".reset");
        restart.innerText = `😫`
        var label = document.querySelector(".label");
        label.innerText = `you lost...\n to new game press the sad emoji`
    }
    // expandShown(gBoard, elCell, i, j)

}

function cellMarked(elCell) {
    // Called on right click to mark a cell (suspected to be a mine)
    if (gTimer === 0) {
        startClock()
        gTimer++
    }
    gGame.markedCount++
    elCell.innerHTML = FLAG;
    if (gGame.markedCount === gLevel.MINES) {
        winGame()
    }

}

function winGame() {
    stopClock()
    var label = document.querySelector(".label");
    label.innerText = `you win!!\n your total time is: ${gGame.secsPassed}`
}

function checkGameOver() {
    // Game ends when all mines are marked, and all the other cells
    // are shown
    if (gLives === 0) {

    }
    var elButton = document.querySelector('.reset')
    elButton.classList.remove('restart')
    // stopClock()
}

function expandShown(board, elCell, i, j) {
    if (elCell.innerText === EMPTY) return
    var pos = { i: i, j: j }
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currNeighbor={i:i,j:j}
            if (gBoard[currNeighbor.i][currNeighbor.j].isMine === false) {
            console.log('gBoard[currneighbor.i][currneighbor.j]:', gBoard[currneighbor.i][currneighbor.j])
            // var elmashu=document.querySelector('cell' + currNeighbor.i + '-' + currNeighbor.j);
                // elmashu.innerText=setMinesNegsCount(gBoard, currNeighbor)
                // debugger
                // gBoard[currneighbor.i][currneighbor.j].innerText = setMinesNegsCount(gBoard, pos)
                // cellClicked(elCell, i, j)
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
        // console.log('setMinesNegsCount(gBoard, pos):', setMinesNegsCount(gBoard, pos))
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
        timer.innerText = `🕑 ${timeDisplay} sec`
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
    var restart = document.querySelector(".reset");
    restart.innerText = `😁`
    var timer = document.querySelector(".timer");
    timer.innerHTML = '';
    gTimer = 0;
    gStartTime = null;
    gTimeElasped = null;
    initGame()
    // renderBoard(gBoard);
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