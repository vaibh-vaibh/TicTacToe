const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const difficultySelect = document.getElementById("difficulty");
const toggleThemeBtn = document.getElementById("toggle-theme");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameOver = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Sound play helper
const playSound = (sound) => {
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
};

// Dark mode toggle
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Reset game
resetBtn.addEventListener("click", () => {
  boardState.fill("");
  cells.forEach(cell => cell.textContent = "");
  isGameOver = false;
  currentPlayer = "X";
  statusText.textContent = "Your turn (X)";
});

// Handle player move
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (boardState[index] !== "" || isGameOver || currentPlayer !== "X") return;

    makeMove(index, "X");
    playSound(clickSound);

    if (!isGameOver) {
      setTimeout(() => computerMove(), 500); // Delay for realism
    }
  });
});

// Player/computer move logic
function makeMove(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;

  if (checkWinner(player)) {
    statusText.textContent = `${player === "X" ? "You" : "Computer"} win!`;
    playSound(winSound);
    isGameOver = true;
  } else if (boardState.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    playSound(drawSound);
    isGameOver = true;
  } else {
    currentPlayer = player === "X" ? "O" : "X";
    if (currentPlayer === "X") statusText.textContent = "Your turn (X)";
    else statusText.textContent = "Computer thinking...";
  }
}

// Check for win
function checkWinner(player) {
  return winningCombinations.some(combo =>
    combo.every(index => boardState[index] === player)
  );
}

// Computer logic
function computerMove() {
  let index;

  const difficulty = difficultySelect.value;

  if (difficulty === "easy") {
    index = getRandomMove();
  } else if (difficulty === "medium") {
    index = Math.random() < 0.5 ? getRandomMove() : getBestMove();
  } else {
    index = getBestMove();
  }

  if (index !== undefined) {
    makeMove(index, "O");
    playSound(clickSound);
  }
}

// Random move for Easy
function getRandomMove() {
  const empty = boardState.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// Minimax for Hard
function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === "") {
      boardState[i] = "O";
      let score = minimax(boardState, 0, false);
      boardState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  if (checkWinner("O")) return 10 - depth;
  if (checkWinner("X")) return depth - 10;
  if (board.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;

  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
