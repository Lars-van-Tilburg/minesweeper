document.addEventListener("DOMContentLoaded", () => {
    const game = document.getElementById("game");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart");

    const gridRows = 10;
    const gridCols = 10;
    const totalBombs = 20;

    let board = [];
    let revealedCount = 0;

    function createBoard() {
        board = [];
        revealedCount = 0;
        game.innerHTML = '';
        message.textContent = '';
        restartButton.style.display = 'none';

        for (let row = 0; row < gridRows; row++) {
            const rowArray = [];
            for (let col = 0; col < gridCols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', handleCellClick);
                game.appendChild(cell);
                rowArray.push({ element: cell, bomb: false, revealed: false, adjacentBombs: 0 });
            }
            board.push(rowArray);
        }

        placeBombs();
        calculateAdjacentBombs();
    }

    function placeBombs() {
        let bombsPlaced = 0;
        while (bombsPlaced < totalBombs) {
            const row = Math.floor(Math.random() * gridRows);
            const col = Math.floor(Math.random() * gridCols);
            if (!board[row][col].bomb) {
                board[row][col].bomb = true;
                bombsPlaced++;
            }
        }
    }

    function calculateAdjacentBombs() {
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                if (!board[row][col].bomb) {
                    let adjacentBombs = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const newRow = row + i;
                            const newCol = col + j;
                            if (newRow >= 0 && newRow < gridRows && newCol >= 0 && newCol < gridCols) {
                                if (board[newRow][newCol].bomb) {
                                    adjacentBombs++;
                                }
                            }
                        }
                    }
                    board[row][col].adjacentBombs = adjacentBombs;
                }
            }
        }
    }

    function handleCellClick() {
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        if (board[row][col].revealed) return;

        if (board[row][col].bomb) {
            revealBoard();
            message.textContent = 'Game Over! You hit a bomb!';
            restartButton.style.display = 'block';
        } else {
            revealCell(row, col);
            if (revealedCount === gridRows * gridCols - totalBombs) {
                message.textContent = 'Congratulations! You won!';
                restartButton.style.display = 'block';
            }
        }
    }

    function revealCell(row, col) {
        if (row < 0 || row >= gridRows || col < 0 || col >= gridCols || board[row][col].revealed) {
            return;
        }

        board[row][col].revealed = true;
        revealedCount++;
        board[row][col].element.classList.add('revealed');
        board[row][col].element.textContent = board[row][col].adjacentBombs ? board[row][col].adjacentBombs : '';

        if (board[row][col].adjacentBombs === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    revealCell(row + i, col + j);
                }
            }
        }
    }

    function revealBoard() {
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                if (board[row][col].bomb) {
                    board[row][col].element.classList.add('bomb');
                }
                board[row][col].element.classList.add('revealed');
                board[row][col].element.textContent = board[row][col].bomb ? '💣' : (board[row][col].adjacentBombs ? board[row][col].adjacentBombs : '');
            }
        }
    }

    function restartGame() {
        createBoard();
    }

    restartButton.addEventListener('click', restartGame);

    createBoard();
});
