const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 8; // 8x8 grid
const candyColors = ['red', 'yellow', 'green', 'blue', 'orange', 'purple'];
let squares = [];
let score = 0;

// Create the board
function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    const randomColor = Math.floor(Math.random() * candyColors.length);
    square.classList.add('tile', candyColors[randomColor]);
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    grid.appendChild(square);
    squares.push(square);
  }
}

createBoard();

// Drag functionality
let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

squares.forEach(square => square.addEventListener('dragstart', dragStart));
squares.forEach(square => square.addEventListener('dragend', dragEnd));
squares.forEach(square => square.addEventListener('dragover', dragOver));
squares.forEach(square => square.addEventListener('dragenter', dragEnter));
squares.forEach(square => square.addEventListener('dragleave', dragLeave));
squares.forEach(square => square.addEventListener('drop', dragDrop));

function dragStart() {
  colorBeingDragged = this.classList[1];
  squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  colorBeingReplaced = this.classList[1];
  squareIdBeingReplaced = parseInt(this.id);
  squares[squareIdBeingDragged].classList.replace(colorBeingDragged, colorBeingReplaced);
  squares[squareIdBeingReplaced].classList.replace(colorBeingReplaced, colorBeingDragged);
}

function dragEnd() {
  // Check for valid matches
  const validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged + 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + width
  ];

  const validMove = validMoves.includes(squareIdBeingReplaced);

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null;
  } else if (squareIdBeingReplaced && !validMove) {
    squares[squareIdBeingDragged].classList.replace(squares[squareIdBeingDragged].classList[1], colorBeingDragged);
    squares[squareIdBeingReplaced].classList.replace(squares[squareIdBeingReplaced].classList[1], colorBeingReplaced);
  } else {
    squares[squareIdBeingDragged].classList.replace(squares[squareIdBeingDragged].classList[1], colorBeingDragged);
  }

  checkMatches();
}

// Check for matches
function checkMatches() {
  // Check row matches
  for (let i = 0; i < 64; i++) {
    let rowOfThree = [i, i + 1, i + 2];
    const decidedColor = squares[i].classList[1];
    const isBlank = squares[i].classList.contains('blank');

    if (
      rowOfThree.every(index => squares[index]?.classList.contains(decidedColor)) &&
      !isBlank
    ) {
      score += 3;
      scoreDisplay.innerText = score;
      rowOfThree.forEach(index => squares[index].classList.replace(decidedColor, 'blank'));
    }
  }

  // Check column matches
  for (let i = 0; i < 47; i++) {
    let columnOfThree = [i, i + width, i + width * 2];
    const decidedColor = squares[i].classList[1];
    const isBlank = squares[i].classList.contains('blank');

    if (
      columnOfThree.every(index => squares[index]?.classList.contains(decidedColor)) &&
      !isBlank
    ) {
      score += 3;
      scoreDisplay.innerText = score;
      columnOfThree.forEach(index => squares[index].classList.replace(decidedColor, 'blank'));
    }
  }
}

// Continuously check for matches
window.setInterval(() => {
  checkMatches();
  moveDown();
}, 100);

// Drop candies
function moveDown() {
  for (let i = 0; i < 56; i++) {
    if (squares[i + width].classList.contains('blank')) {
      squares[i + width].classList.replace('blank', squares[i].classList[1]);
      squares[i].classList.replace(squares[i].classList[1], 'blank');
    }

    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    const isFirstRow = firstRow.includes(i);
    if (isFirstRow && squares[i].classList.contains('blank')) {
      const randomColor = Math.floor(Math.random() * candyColors.length);
      squares[i].classList.replace('blank', candyColors[randomColor]);
    }
  }
}