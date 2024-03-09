import { Renderer } from "./Renderer";
import { Score } from "./Score";
export class Game {
    private renderer: Renderer;
    private board: string[][];
    private players = { x: 'x', o: 'o' };
    private isWaiting: boolean = false;
    private score: Score = { x: 0, o: 0 };
    private currentPlayer: string = this.players.x;

    constructor(display: Renderer) {
        this.renderer = display;
        this.board = this.createBoard();

        this.renderer.bindHandler(this.clickCell);
    }

    startGame(): void {
        this.renderer.printScoreBoard(this.score);
        this.renderer.printGameBoard(this.board);
    }

    private createBoard = (): string[][] => [['', '', ''], ['', '', ''], ['', '', '']];

    private clickCell = (row: number, col: number): void => {
        const canContinue = this.board[row][col] === '';
        if (!canContinue || this.isWaiting) {
            return;
        }
        this.board[row][col] = this.currentPlayer;
        this.renderer.updateBoard(row, col, this.currentPlayer);
        const isGameWon = this.isGameWon(row, col);
        const stalemate = this.board
            .map((row) => row.filter((col) => col === ''))
            .filter((row) => row.length > 0);

        if (this.isWaiting) {
            return;
        }
        if (isGameWon) {
            this.increaseScore();
            this.renderer.updateScore(this.score, this.currentPlayer);
            this.gameOver(this.currentPlayer);
            this.renderer.printReplayButton(() => {
                this.isWaiting = false;
                this.resetBoard();
                this.renderer.removeReplayButton();
            });
        } else if (stalemate.length < 1) {
            this.gameOver();
            this.renderer.printReplayButton(() => {
                this.isWaiting = false;
                this.resetBoard();
                this.renderer.removeReplayButton();
            });
        } else {
            this.switchPlayer();
        }
    };

    private gameOver = (winner: string = ''): void => {
        this.isWaiting = true;
        this.renderer.printMessage(winner);
    };

    private resetBoard = (): void => {
        this.renderer.clearMessage();
        this.renderer.clearGameBoard();
        this.board = this.createBoard();
    };

    private isGameWon = (row: number, col: number): boolean => {
        const currentPlayer = this.currentPlayer;
        const board = this.board;

        const horizontalWin = board[row].every((cell) => cell === currentPlayer);
        const verticalWin = board.every((row) => row[col] === currentPlayer);
        const diagonalWin =
            (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer) ||
            (board[2][0] === currentPlayer && board[1][1] === currentPlayer && board[0][2] === currentPlayer);

        return horizontalWin || verticalWin || diagonalWin;
    };

    private switchPlayer = (): void => {
        this.currentPlayer = this.currentPlayer === this.players.x ? this.players.o : this.players.x;
    };

    private increaseScore = (): void => {
        this.score[this.currentPlayer] += 1;
    };
}