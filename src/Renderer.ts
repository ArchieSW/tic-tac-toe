import { Score } from "./Score";

export class Renderer {
    public bindHandler(clickHandler: (row: number, col: number) => void): void {
        document.addEventListener('click', (event: Event) => {
            const clicked = <HTMLElement>event.target
            const isColumn = clicked.className === 'col'

            if (isColumn) {
                const cell = clicked
                const row = +cell.parentElement!.dataset.row!
                const col = +cell.dataset.col!

                clickHandler(row, col)
            }
        })
    }

    public printGameBoard = (boardData: Array<Array<string>>): void => {
        const game = this.getElement('#game')
        const gameBoard = this.createElement('div', 'board', undefined)

        game.append(gameBoard)

        boardData.forEach((row, i) => {
            const boardRow = this.createElement('div', 'row', ['row', i])
            gameBoard.append(boardRow)

            row.forEach((_, j) => {
                const boardCol = this.createElement('div', 'col', ['col', j])
                boardRow.append(boardCol)
            })
        })
    }

    public updateBoard = (row: number, col: number, currentPlayer: string): void => {
        const playerToken = this.createElement('span', currentPlayer, undefined)
        playerToken.textContent = currentPlayer

        const boardRow = this.getElement(`[data-row="${row}"]`)
        const cell = <HTMLElement>boardRow.querySelector(`[data-col="${col}"]`)

        cell.append(playerToken)
    }

    public clearGameBoard = (): void => {
        const cells = this.getAllElements('.col')

        cells.forEach(cell => {
            cell.textContent = ''
        })
    }

    public printScoreBoard = (scoreData: Score): void => {
        const game = this.getElement('#game')
        const scoreBoard = this.createElement('div', 'score')

        game.append(scoreBoard)

        const playerOneScore = this.createElement('div', 'x')
        playerOneScore.textContent = `Player 1: ${scoreData.x}`
        playerOneScore.id = 'score-x'

        const playerTwoScore = this.createElement('div', 'o')
        playerTwoScore.textContent = `Player 2: ${scoreData.o}`
        playerTwoScore.id = 'score-o'

        scoreBoard.append(playerOneScore, playerTwoScore)
    }

    public updateScore = (currentScore: Score, currentPlayer: string): void => {
        const currentPlayerScore = this.getElement(`#score-${currentPlayer}`)
        const player = currentPlayer === 'x' ? 'Player 1' : 'Player 2'
        const d: number = currentScore[currentPlayer]
        currentPlayerScore.textContent = `${player}: ${d}`
    }

    public printMessage = (winner: string): void => {
        const message = this.createElement('div', 'message')
        const player = winner === 'x' ? 'Player 1' : 'Player 2'

        message.textContent = winner ? `${player} wins!` : 'Nobody wins!'

        const game = this.getElement('#game')
        game.append(message)
    }

    public clearMessage = (): void => {
        const message = this.getElement('.message')
        message.remove()
    }

    public printReplayButton = (onClick: () => void) => {
        const game = this.getElement('#game')
        const replayButton = this.createElement('button', 'replay')
        replayButton.onclick = onClick
        replayButton.textContent = 'Replay'
        game.append(replayButton)
    }

    public removeReplayButton = () => {
        const replayButton = this.getElement('.replay')
        replayButton.remove()
    }


    private createElement = (tag: string, className?: string, dataset?: Array<any>): HTMLElement => {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        if (dataset) element.dataset[dataset[0]] = dataset[1]

        return element
    }

    private getElement = (selector: string): HTMLElement => <HTMLElement>document.querySelector(selector)

    private getAllElements = (selector: string): NodeList => <NodeList>document.querySelectorAll(selector)
}