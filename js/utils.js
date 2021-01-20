function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      // console.log('mat[i][j]:', mat[i][j])
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  // console.log('strHTML:', strHTML)
  var elContainer = document.querySelector(selector);
  // console.log('elContainer 15:', elContainer)
  elContainer.innerHTML = strHTML;
  // console.log('elContainer 17:', elContainer)
}

function countNeighbors(mat, pos) {
  var count = 0
  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === pos.i && j === pos.j) continue
      var currCell = mat[i][j]
      if (currCell === '$') count++
    }
  }
  return count
}

function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
          var currCell = board[i][j];
          if (currCell === EMPTY) {
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
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
