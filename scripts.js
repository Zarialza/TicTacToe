const board = document.querySelector(".board");
const statusDisplay = document.querySelector(".status");
const cells = document.querySelectorAll(".cell");
let gameState = Array(9).fill(null);
let currentPlayer = "O";
let pieces = { O: [], X: [] };
let isPlayerVsAi = false;
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function setMode(mode) {
  isPlayerVsAi = mode === "player-vs-ai";
  resetGame();
}

function handleCellClick(event) {
  const cellIndex = parseInt(event.target.getAttribute("data-index"));
  if (gameState[cellIndex] !== null || checkWin()) return;

  makeMove(cellIndex, currentPlayer);
  if (checkWin() || gameState.every((cell) => cell !== null)) return;

  if (isPlayerVsAi && currentPlayer === "X") {
    makeAiMove();
  }
}

function makeMove(cellIndex, player) {
  if (pieces[player].length < 3) {
    gameState[cellIndex] = player;
    pieces[player].push(cellIndex);
  } else {
    const removedIndex = pieces[player].shift();
    gameState[removedIndex] = null;
    document.querySelector(`.cell[data-index='${removedIndex}']`).textContent =
      "";
    document
      .querySelector(`.cell[data-index='${removedIndex}']`)
      .classList.remove("grayed");
    gameState[cellIndex] = player;
    pieces[player].push(cellIndex);
  }

  document.querySelector(`.cell[data-index='${cellIndex}']`).textContent =
    player;
  if (pieces[player].length === 3) {
    document
      .querySelector(`.cell[data-index='${pieces[player][0]}']`)
      .classList.add("grayed");
  }

  if (checkWin()) {
    statusDisplay.textContent = `${player} wins!`;
    cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
  } else if (gameState.every((cell) => cell !== null)) {
    statusDisplay.textContent = `Draw!`;
  } else {
    currentPlayer = player === "O" ? "X" : "O";
    statusDisplay.textContent = `${currentPlayer}'s turn`;
  }
}

function makeAiMove() {
  let bestScore = -Infinity;
  let bestMove;

  gameState.forEach((cell, index) => {
    if (cell === null) {
      gameState[index] = "X"; // Assume AI makes a move
      let score = minimax(gameState, 0, false);
      gameState[index] = null; // Undo move

      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  });

  makeMove(bestMove, "X");
}

function minimax(gameState, depth, isMaximizing) {
  let result = checkWin();
  if (result !== null) {
    return result === "X" ? 1 : result === "O" ? -1 : 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    gameState.forEach((cell, index) => {
      if (cell === null) {
        gameState[index] = "X"; // Assume AI makes a move
        let score = minimax(gameState, depth + 1, false);
        gameState[index] = null; // Undo move
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    gameState.forEach((cell, index) => {
      if (cell === null) {
        gameState[index] = "O"; // Assume opponent makes a move
        let score = minimax(gameState, depth + 1, true);
        gameState[index] = null; // Undo move
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function checkWin() {
  return winningConditions.some((condition) => {
    return condition.every((index) => gameState[index] === currentPlayer);
  });
}

function resetGame() {
  gameState.fill(null);
  currentPlayer = "O";
  pieces = { O: [], X: [] };
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("grayed");
  });
  statusDisplay.textContent = `${currentPlayer}'s turn`;
  cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
}

resetGame();
