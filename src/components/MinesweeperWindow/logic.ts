import { MinesweeperState, MinesweeperCell } from '../../lib/game/types';

export const BEGINNER_CONFIG = {
    rows: 9,
    cols: 9,
    mines: 10
};

export const createGrid = (rows: number, cols: number): MinesweeperCell[][] => {
    const grid: MinesweeperCell[][] = [];
    for (let r = 0; r < rows; r++) {
        const row: MinesweeperCell[] = [];
        for (let c = 0; c < cols; c++) {
            row.push({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0,
                id: `${r}-${c}`
            });
        }
        grid.push(row);
    }
    return grid;
};

export const placeMines = (grid: MinesweeperCell[][], mineCount: number, firstClickRow: number, firstClickCol: number) => {
    const rows = grid.length;
    const cols = grid[0].length;
    let minesPlaced = 0;

    while (minesPlaced < mineCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        // Don't place mine on first click or its neighbors (safe start)
        if (Math.abs(r - firstClickRow) <= 1 && Math.abs(c - firstClickCol) <= 1) continue;

        if (!grid[r][c].isMine) {
            grid[r][c].isMine = true;
            minesPlaced++;
        }
    }
};

export const calculateNeighbors = (grid: MinesweeperCell[][]) => {
    const rows = grid.length;
    const cols = grid[0].length;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c].isMine) continue;

            let count = 0;
            directions.forEach(([dr, dc]) => {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
                    count++;
                }
            });
            grid[r][c].neighborMines = count;
        }
    }
};

export const initializeGame = (difficulty: 'beginner' = 'beginner'): MinesweeperState => {
    const config = BEGINNER_CONFIG; // Support more later if needed
    const grid = createGrid(config.rows, config.cols);

    return {
        grid,
        isWon: false,
        isLost: false,
        startTime: null,
        flagsPlaced: 0,
        totalMines: config.mines,
        difficulty
    };
};

export const revealCell = (currentState: MinesweeperState, row: number, col: number): MinesweeperState => {
    if (currentState.isWon || currentState.isLost || currentState.grid[row][col].isRevealed || currentState.grid[row][col].isFlagged) {
        return currentState;
    }

    const newState = JSON.parse(JSON.stringify(currentState)); // Deep copy
    const grid = newState.grid;
    const cell = grid[row][col];

    // First click?
    if (!newState.startTime) {
        newState.startTime = Date.now();
        placeMines(grid, newState.totalMines, row, col);
        calculateNeighbors(grid);
    }

    if (grid[row][col].isMine) {
        grid[row][col].isRevealed = true;
        newState.isLost = true;
        // Reveal all mines
        grid.forEach((r: MinesweeperCell[]) => r.forEach((c: MinesweeperCell) => {
            if (c.isMine) c.isRevealed = true;
        }));
        return newState;
    }

    // Flood fill
    const stack = [[row, col]];
    while (stack.length > 0) {
        const [currR, currC] = stack.pop()!;
        if (grid[currR][currC].isRevealed) continue;

        grid[currR][currC].isRevealed = true;

        if (grid[currR][currC].neighborMines === 0) {
            // Add neighbors
            const directions = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            directions.forEach(([dr, dc]) => {
                const nr = currR + dr;
                const nc = currC + dc;
                if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && !grid[nr][nc].isRevealed && !grid[nr][nc].isFlagged) {
                    stack.push([nr, nc]);
                }
            });
        }
    }

    checkWin(newState);
    return newState;
};

export const toggleFlag = (currentState: MinesweeperState, row: number, col: number): MinesweeperState => {
    if (currentState.isWon || currentState.isLost || currentState.grid[row][col].isRevealed) {
        return currentState;
    }

    const newState = { ...currentState, grid: [...currentState.grid] };
    newState.grid[row] = [...newState.grid[row]];
    newState.grid[row][col] = { ...newState.grid[row][col] };

    const cell = newState.grid[row][col];

    if (!cell.isFlagged) {
        if (newState.flagsPlaced < newState.totalMines) {
            cell.isFlagged = true;
            newState.flagsPlaced++;
        }
    } else {
        cell.isFlagged = false;
        newState.flagsPlaced--;
    }

    return newState;
};

const checkWin = (state: MinesweeperState) => {
    const rows = state.grid.length;
    const cols = state.grid[0].length;
    let revealedCount = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (state.grid[r][c].isRevealed) {
                revealedCount++;
            }
        }
    }

    const totalCells = rows * cols;
    if (totalCells - revealedCount === state.totalMines) {
        state.isWon = true;
        // Flag all mines visually
        state.grid.forEach(r => r.forEach(c => {
            if (c.isMine) c.isFlagged = true;
        }));
        state.flagsPlaced = state.totalMines;
    }
};
