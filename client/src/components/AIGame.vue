<template>
    <div id="field" ref="field"
        v-on="playing && count > 0 ? {
            mousemove: updatePos,
            click: dropDisc
        } : {}"
    >
        <div
            v-for="disc in discs" 
            :key="disc.id" 
            :class="[disc.color, baseStyle]" 
            :style="{ 
                left: `${(count > 0) ? disc.x : 270 }px`,
                top: `${(count > 0) ? disc.y : 100 }px`,
            }"
        >
        </div>
        <transition name="appear">
            <AIMenu ref="aimenu" />
        </transition>
        <transition name="fade">
            <div v-if="gameOver" class="winningScreen"> 
                <button
                    class="btn"
                    id="again"
                    @click="restart"
                >
                Play Again
                </button>
                <h2 id="winner">{{ winner }}</h2>
                <button
                    class="btn"
                    id="friend"
                    @click="changeMode"
                >
                Play a Friend
                </button>
            </div>
        </transition>
    </div>
</template>

<script>
import { bus } from '../main'
import AIMenu from './menus/AIMenu.vue'

const DEPTH = 6
const ROWS = 6
const COLS = 7
const accel = 0.05
const playerColor = 'red'
const cpuColor = 'yellow'
const boardWidth = 630
const offset = 208
const WINDOW_LENGTH = 4

export default {
    name: 'AIGame',
    components: {
        AIMenu
    },
    created() {
        this.playing = true
        setTimeout(this.startGame, 200)
    },
    data() {
        return {
            discs: [
            ],
            count: 0,
            player: {
                id: 0,
                x: 270,
                y: 100,
                color: playerColor,
                dropped: false
            },
            cpu: {
                id: 0,
                x: 270,
                y: 100,
                color: cpuColor,
                dropped: false,
            },
            column: 0,
            baseStyle: 'discClass',
            playerTurn: 1,
            board: [],
            gameOver: false,
            playing: false,
            falling: false,
            winner: ''
        }
    },
    methods: {
        startGame: function() {
            this.initBoard()
            this.createDisc()
        },
        makeArray: function(d1, d2) {
            let arr = []
            for(let i = 0; i < d2; i++)
                arr.push(new Array(d1))
            for(let r = 0; r < ROWS; r++)
                for(let c = 0; c < COLS; c++)
                    arr[r][c] = null
            return arr
        },
        initBoard: function() {
            this.board = this.makeArray(ROWS, COLS)
        },
        getBottomRowInCol: function(board, col) {
            let bottom = -1
            for(let r = 0; r < ROWS; r++)
                if(!board[r][col])
                    bottom = r
            return bottom
        },
        columnFull: function(board, c) {
            if (this.getBottomRowInCol(board, c) === -1)
                return true
            return false
        },
        isWinner: function (board, currentPlayer) {
            // horizontal win
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS - 3; c++) {
                    if (board[r][c] && board[r][c+1] && board[r][c+2] && board[r][c+3])
                        if (board[r][c].color === currentPlayer &&
                            board[r][c+1].color === currentPlayer &&
                            board[r][c+2].color === currentPlayer &&
                            board[r][c+3].color === currentPlayer) {
                            return true
                        }
                }
            // vertical win
            for (let r = 0; r < ROWS - 3; r++)
                for (let c = 0; c < COLS; c++) {
                    if (board[r][c] && board[r+1][c] && board[r+2][c] && board[r+3][c])
                        if (board[r][c].color === currentPlayer &&
                            board[r+1][c].color === currentPlayer &&
                            board[r+2][c].color === currentPlayer &&
                            board[r+3][c].color === currentPlayer) {
                            return true
                        }
                }
            // up-right diagonal win
            for (let r = 0; r < ROWS - 3; r++)
                for (let c = 0; c < COLS - 3; c++) {
                    if (board[r][c] && board[r+1][c+1] && board[r+2][c+2] && board[r+3][c+3])
                        if (board[r][c].color === currentPlayer &&
                            board[r+1][c+1].color === currentPlayer &&
                            board[r+2][c+2].color === currentPlayer &&
                            board[r+3][c+3].color === currentPlayer) {
                            return true;
                        }
                }
            // down-right diagonal win
            for (let r = 3; r < ROWS; r++)
                for (let c = 0; c < COLS - 3; c++) {
                    if (board[r][c] && board[r-1][c+1] && board[r-2][c+2] && board[r-3][c+3])
                        if (board[r][c].color === currentPlayer &&
                            board[r-1][c+1].color === currentPlayer &&
                            board[r-2][c+2].color === currentPlayer &&
                            board[r-3][c+3].color === currentPlayer) {
                            return true;
                        }
                }
            return false;
        },
        isTie: function() {
            if(this.count >= ROWS * COLS) {
                this.playerTurn = 0;
                return true;
            }
            return false;
        },
        winningScreen: function() {
            this.toggleRestart()
            this.updateWins()
            if (this.playerTurn === 1) {
                this.winner = 'You won!'
                this.toggleMouseEvents()
            }
            else if (this.playerTurn === 2)
                this.winner = 'You lost!'
            else
                this.winner = 'Tie. Nobody won!'
            this.gameOver = true
        },
        updatePos: function(event) {
            let x = event.clientX
            let middle
            (innerWidth > 630) ? middle = innerWidth/2 : middle = 315
            let left = middle - 270
            let right = middle + 270
            if (x >= left && x <= right)
                this.player.x = x - left
            else if (x > middle - boardWidth/2 && x < middle - boardWidth/2 + 45)
                this.player.x = 0
            else if(x > middle + boardWidth/2 - 45 && x < middle + boardWidth/2)
                this.player.x = 540
            if (this.playerTurn === 1 && !this.discs[this.count - 1].dropped)
               this.discs[this.count - 1].x = this.player.x
        },
        createDisc: function() {
            this.count++
            if (this.playerTurn === 1) {
                this.player.id = this.count
                let newDisc = { ...this.player }
                this.discs.push(newDisc)
            }
            if (this.playerTurn === 2) {
                this.cpu.id = this.count
                let newDisc = { ...this.cpu }
                this.discs.push(newDisc)
                setTimeout(this.cpuTurn, 250)
                // this.cpuTurn()
            }
        },
        dropDisc: function() {
            if(this.playerTurn === 1 && !this.falling) {
                this.column = Math.floor((this.player.x+45)/90)
                if (!this.columnFull(this.board, this.column)) {
                    this.toggleMouseEvents()
                    let currDisc = this.discs[this.count - 1]
                    currDisc.dropped = true
                    let bottom = 90 * this.getBottomRowInCol(this.board, this.column)
                    this.board[bottom/90][this.column] = currDisc
                    let vel = 0
                    let interval = setInterval(() => {
                        vel += accel
                        if (currDisc.x != 90 * this.column && this.player.y > -90) {
                            (currDisc.x > 90 * this.column) ? currDisc.x-- : currDisc.x++
                        }
                        if (this.player.y >= bottom + offset) {
                            clearInterval(interval)
                            currDisc.y = bottom + offset
                            this.player.y = 100
                            if (this.isWinner(this.board, currDisc.color) || this.isTie()) {
                                this.winningScreen()
                            }
                            else {
                                this.toggleMouseEvents()
                                this.playerTurn = 2
                                this.createDisc()
                            }
                        } else {
                            currDisc.y = this.player.y
                            this.player.y += vel
                        }
                    }, 1)
                }
            }
        },
        toggleMouseEvents: function() {
            (!this.falling) ? this.falling = true : this.falling = false
        },
        toggleRestart: function() {
            (!this.playing) ? this.playing = true : this.playing = false
        },
        isTerminalNode: function(board) {
            return (this.isWinner(board, playerColor) || this.isWinner(board, cpuColor)) || this.getValidLocations(board).length === 0
        },
        getValidLocations: function(board) {
            let locations = []
            for (let c = 0; c < COLS; c++)
                if (!this.columnFull(board, c))
                    locations.push(c)
            return locations
        },
        copy: function(board) {
            let copy = []
            for (let i = 0; i < board.length; i++)
                copy[i] = board[i].slice();
            return copy
        },
        countPcs: function(four, piece) {
            let count = 0
            if (piece !== null) {
                for (let i = 0; i < four.length; i++)
                    if (four[i] !== null && four[i] !== undefined)
                        if (four[i].color === piece)
                            count++
            }
            else { // empty slot
                for (let i = 0; i < four.length; i++)
                    if (four[i] === null)
                        count++
            }
            return count
        },
        evaluateWindow: function(four, piece) {
            let score = 0
            let opp_piece = playerColor
            if (piece === playerColor) {
                opp_piece = cpuColor
            }
            // counting null pieces indicates empty slot
            if (this.countPcs(four, piece) === 4)
                score += 100
            else if (this.countPcs(four, piece) === 3 && this.countPcs(four, null) === 1)
                score += 5
            else if (this.countPcs(four, piece) === 2 && this.countPcs(four, null) === 2)
                score += 2
            if (this.countPcs(four, opp_piece) === 3 && this.countPcs(four, null) === 1)
                score -= 4
            
            return score
        },
        scorePosition: function (board, piece) {
            let score = 0
            let four;

            // center column score - prioritized for better performance
            let center_array = board.map(v => v[Math.floor(COLS/2)])
            let center_count = this.countPcs(center_array, piece)
            score += center_count * 3

            // horizontal score
            for (let r = 0; r < ROWS; r++) {
                let row_array = board[r]
                for (let c = 0; c < COLS - 3; c++) {
                    four = row_array.slice(c, c+WINDOW_LENGTH)
                    score += this.evaluateWindow(four, piece)
                }
            }

            // vertical score
            for (let c = 0; c < COLS; c++) {
                let col_array = board.map(v => v[c])
                for (let r = 0; r < ROWS - 3; r++) {
                    four = col_array.slice(r, r+WINDOW_LENGTH)
                    score += this.evaluateWindow(four, piece)
                }
            }

            // Up-right diagonal score
            for (let r = 0; r < ROWS - 3; r++) {
                for (let c = 0; c < COLS - 3; c++) {
                    for (let i = 0; i < WINDOW_LENGTH; i++) {
                        four[i] = board[r+i][c+i]
                    }
                    score += this.evaluateWindow(four, piece)
                }
            }

            // Down-left diagonal score
            for (let r = 0; r < ROWS - 3; r++) {
                for (let c = 0; c < COLS - 3; c++) {
                    for (let i = 0; i < WINDOW_LENGTH; i++) {
                        four[i] = board[r+3-i][c+i]
                    }
                    score += this.evaluateWindow(four, piece)
                }
            }

            return score
        },
        minimax: function(board, depth, alpha, beta, maximizingPlayer) {
            let valid_locations = this.getValidLocations(board)
            let is_terminal = this.isTerminalNode(board)
            if (depth === 0 || is_terminal) {
                if (is_terminal) {
                    if (this.isWinner(board, cpuColor))
                        return [null, 100000000000000]
                    else if (this.isWinner(board, playerColor))
                        return [null, -10000000000000]
                    else
                        return [null, 0]
                }
                else {
                    return [null, this.scorePosition(board, cpuColor)]
                }
            }

            if (maximizingPlayer) {
                let value = -Infinity
                let column = valid_locations[Math.floor(Math.random() * valid_locations.length)]
                for (let i = 0; i < valid_locations.length; i++) {
                    let col = valid_locations[i]
                    let row = this.getBottomRowInCol(board, col)
                    let board_copy = this.copy(board)
                    // board_copy[row][col] = this.discs[this.count - 1]
                    board_copy[row][col] = this.cpu
                    let new_score = this.minimax(board_copy, depth - 1, alpha, beta, false)[1]
                    if (new_score > value) {
                        value = new_score
                        column = col
                    }
                    alpha = Math.max(alpha, value)
                    if (alpha >= beta)
                        break
                }
                return [column, value]
            }
            else { // Minimizing Player
                let value = Infinity
                let column = valid_locations[Math.floor(Math.random() * valid_locations.length)]
                for (let i = 0; i < valid_locations.length; i++) {
                    let col = valid_locations[i]
                    let row = this.getBottomRowInCol(board, col)
                    let board_copy = this.copy(board)
                    // board_copy[row][col] = this.discs[this.count - 1]
                    board_copy[row][col] = this.player
                    let new_score = this.minimax(board_copy, depth - 1, alpha, beta, true)[1]
                    if (new_score < value) {
                        value = new_score
                        column = col
                    }
                    beta = Math.min(beta, value)
                    if (alpha >= beta)
                        break
                }
                return [column, value]
            }
        },
        cpuTurn: function() {
            let c = this.minimax(this.board, DEPTH, -Infinity, Infinity, true)[0]
            if (!this.columnFull(this.board, c)) {
                let bottom = 90 * this.getBottomRowInCol(this.board, c)
                let currDisc = this.discs[this.count - 1]
                currDisc.dropped = true
                this.board[bottom/90][c] = currDisc
                let pos = 100
                let vel = 0
                let column = 90 * c
                let interval = setInterval(() => {
                    if (currDisc.x != column) {
                        (currDisc.x > column) ? currDisc.x-=2 : currDisc.x+=2
                    }
                    if (currDisc.x === column)
                        vel += accel
                        if (currDisc.y >= bottom + offset) {
                            clearInterval(interval)
                            currDisc.y = bottom + offset
                            this.cpu.x = 270
                            this.cpu.y = 100
                            if (this.isWinner(this.board, currDisc.color) || this.isTie()) {
                                this.winningScreen()
                            } else {
                                this.playerTurn = 1
                                this.createDisc()
                            }
                        } else {
                            currDisc.y = pos
                            pos += vel
                        }
                }, 1)
            }
        },
        reset: function() {
            this.gameOver = false
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    this.board[r][c] = null
            this.discs = []
            this.count = 0
            this.player.x = 270
            this.playerTurn = 1
        },
        restart: function() {
            this.reset()
            this.toggleRestart()
            this.createDisc()
        },
        changeMode: function() {
            this.reset()
            this.playing = false;
            this.$router.push("/online")
        },
        updateWins: function() {
            bus.$emit('updateWins', this.playerTurn)
        }
    }
}
</script>

<style>
#field {
    position: relative;
    top: -854px;
    height: 744px;
    width:630px;
    background: transparent;
    margin: 0 auto;
    margin-bottom: 100px;
    z-index: 3;
}

.discClass {
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    z-index: 0;
    transition: transform .25s;
}

.discClass:hover {
    transform: scale(1.05);
}

.yellow {
    background-color: #fae119;
}

.red {
    background-color: #e11919;
}

.winningScreen {
    position: absolute;
    top: 94px;
    left: 0px;
    width: 630px;
    height: 110px;
}

#winner {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: #17193b;
}

.btn {
    position: absolute;
    top: 60%;
    width: 125px;
    height: 50px;
    transform: translateY(-50%);
    border-radius: 4px;
    box-shadow: 0 0 0px 0 rgba(0,0,0,0.3);
    transition: box-shadow 300ms;
}

.btn:not(:focus):hover {
    box-shadow: 0 10px 10px 0 rgba(0,0,0,0.5);
}

.btn:focus {
    outline: none;
}

.btn:hover::after {
    opacity: 1;
}

#friend {
    right: 29.5%;
}

#again {
    left: 29.5%;
}

.fade-enter-active {
    animation: fade-in 0.5s ease 1 forwards;
} @keyframes fade-in {
    0% { opacity: 0; }
    50% { opacity: 50; }
    100% { opacity: 100; }
}

.fade-leave-active {
    animation: fade-out 0.1s ease 1 forwards;
} @keyframes fade-out {
    0% { opacity: 100; }
    50% { opacity: 50; }
    100% { opacity: 0; }
}

</style>