'use strict'
const BOMB = '💣'
const COVER = '🧧';
const EMPTY = ' ';
const FLAG = '⛳';
var gLives = 2;
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
    gBoard = buildBoard()
    renderBoard(gBoard)
    addBomb()
    addBomb()
    var elButton=document.querySelector('.restart')
    elButton.classList.add('restart')
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
                isMarked: true
            }
        }
    }
    return board
}

function renderBoard(board) {
    // Render the board as a <table> to the page
    var strHTML = '   <div>you have ' + gLives + ' more lives</div> <table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            // var cell = board[i][j];
            // console.log('cell.isMine:', cell.isMine)
            // if (cell.isMine) var shownInCell = BOMB
            // else shownInCell = COVER
            var shownInCell = COVER
            var className = 'cell cell' + i + '-' + j;
            strHTML += '<td class="' + className + '" onclick=cellClicked(this,' + i + ',' + j + ') > ' + shownInCell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function setMinesNegsCount(board, pos) {
    var count = 0;
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
        // console.log('currCell.isMine:', currCell.isMine)
    }
    // if (currCell.isMine) {
    //     return BOMB;
    // } else 
    if (!count) {
        return EMPTY;
    }
    currCell.minesAroundCount = count;
    return currCell.minesAroundCount;
}

function cellClicked(elCell, i, j) {
    var pos = { i: i, j: j }
    elCell.innerText = setMinesNegsCount(gBoard, pos)
    if (gBoard[i][j].isShown === true) {
        gLives--;
    }
    if(gLives===0){
        checkGameOver();
    }
    // console.log('elCell.innerText:', elCell.innerText)
    // expandShown(gBoard, elCell, i, j)
}

function cellMarked(elCell) {
    // Called on right click to mark a cell (suspected to be a mine)
    //Search the web (and implement) how to hide the
    //context menu on right click


}
function keepPlaying() {
    // if ()
}


function checkGameOver() {
    // Game ends when all mines are marked, and all the other cells
    // are shown
    var elButton=document.querySelector('.restart')
    elButton.classList.remove('restart')

    // if ()

}

// function expandShown(board, elCell, i, j) {
//     var pos = { i: i, j: j }
//     if (setMinesNegsCount(board, pos)===EMPTY) {
//         for (var i = pos.i - 1; i <= pos.i + 1; i++) {
//             if (i < 0 || i > board.length - 1) continue
//             for (var j = pos.j - 1; j <= pos.j + 1; j++) {
//                 if (j < 0 || j > board[0].length - 1) continue


//         console.log('true')
//     } else console.log('false')
//     // console.log('setMinesNegsCount(board, pos):', setMinesNegsCount(board, pos))
// }

function addBomb() {
    var emptyCells = getEmptyCells(gBoard);
    var randIdx = getRandomInt(0, emptyCells.length)
    var emptyCell = emptyCells.splice(randIdx, 1)[0]
    var pos = { i: emptyCell.i, j: emptyCell.j }
    // console.log('setMinesNegsCount(gBoard, pos):', setMinesNegsCount(gBoard, pos))
    gBoard[emptyCell.i][emptyCell.j].isMine = true;
    renderCell(emptyCell, BOMB);
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

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    console.log('elCell:', elCell)
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    console.log('elCell:', elCell)
    elCell.innerHTML = value;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}