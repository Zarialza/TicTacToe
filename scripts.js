const board = document.querySelector(".board");
const statusDisplay = document.querySelector(".status");
const cells = document.querySelectorAll(".cell");
let gameState = Array(9).fill(null);
let currentPlayer = "O";
let pieces = { O: [], X: [] };
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

function handleCellClick(event) {
  const cellIndex = parseInt(event.target.getAttribute("data-index"));

  if (gameState[cellIndex] !== null) return;

  if (pieces[currentPlayer].length < 3) {
    gameState[cellIndex] = currentPlayer;
    pieces[currentPlayer].push(cellIndex);
  } else {
    const removedIndex = pieces[currentPlayer].shift();
    gameState[removedIndex] = null;
    gameState[cellIndex] = currentPlayer;
    pieces[currentPlayer].push(cellIndex);

    // Clear the text content and grayed class of the removed cell
    document.querySelector(`.cell[data-index='${removedIndex}']`).textContent =
      "";
    document
      .querySelector(`.cell[data-index='${removedIndex}']`)
      .classList.remove("grayed");
  }

  event.target.textContent = currentPlayer;

  if (pieces[currentPlayer].length === 3) {
    document
      .querySelector(`.cell[data-index='${pieces[currentPlayer][0]}']`)
      .classList.add("grayed");
  }

  if (checkWin()) {
    statusDisplay.textContent = `${currentPlayer} wins!`;
    cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
  } else if (gameState.every((cell) => cell !== null)) {
    statusDisplay.textContent = `Draw!`;
  } else {
    currentPlayer = currentPlayer === "O" ? "X" : "O";
    statusDisplay.textContent = `${currentPlayer}'s turn`;
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
