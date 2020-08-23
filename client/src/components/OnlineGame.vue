<template>
  <div id="field" ref="field"
        v-on="playing && count > 0 ? {
            mousemove: updatePos,
            click: dropDisc
        } : {}"
  >
    <h3 v-if="waiting">{{ msg }}</h3><br>
    <a v-if="showLeave" href="/">Leave</a>
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
      <OnlineMenu ref="onlinemenu" :p1name="hostName" :p2name="guestName" />
    </transition>
    <transition name="fade">
      <div @mouseenter="showClose" @mouseleave="hideClose" v-if="isHost && popUpOpen" id="banner">
        <h4>Tell your friend to 'Join Game' and enter this roomID: </h4>
        <br>
        <h2>{{ roomName.substr(-8) }}</h2>
        <button v-if="showX" id="close" @click="closePopUp">X</button>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="gameOver" class="winningScreen" > 
          <button
            class="btn"
            id="replay"
            @click="replay"
          >
          Play Again
          </button>
          <h2 id="winner">{{ winner }} won!</h2>
          <button
            class="btn"
            id="leave"
            @click="leaveGame"
          >
          Leave Game
          </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { bus } from '../main'
import io from 'socket.io-client'
import OnlineMenu from './menus/OnlineMenu.vue'

const ENDPOINT = 'https://connect-four-rg.herokuapp.com/'

const ROWS = 6
const COLS = 7
const accel = 0.05
const boardWidth = 630
const offset = 208

export default {
  name: 'OnlineGame',
  components: {
    OnlineMenu
  },
  data() {
    return {
      socket: {},
      discs: [
      ],
      count: 0,
      player: {
        id: 0,
        x: 270,
        y: 100,
        color: 'red',
        dropped: false
      },
      isHost: false,
      roomName: '',
      hostName: '',
      guestName: '',
      column: 0,
      baseStyle: 'discClass',
      playerTurn: false,
      board: [],
      gameOver: false,
      winner: '',
      waiting: false,
      playing: false,
      falling: false,
      gameState: {
        player: this.player,
        discs: this.discs
      },
      otherPlayerWaiting: false,
      msg: 'Waiting for other player to join...',
      popUpOpen: false,
      showX: false,
      showLeave: false
    }
  },
  created() {
    bus.$once('hostName', (name) => this.hostName = name)
    this.socket = io(ENDPOINT)
    this.socket.emit('joinGame', window.location.pathname)
    bus.$once('guestName', (name) => {
      if (name === '')
        this.guestName = 'Player 2'
      else
        this.guestName = name
      this.socket.emit('sendGuestName', this.roomName, this.guestName)
    })
  },
  mounted() {
    this.socket.on('initHost', room => {
      this.roomName = room
      this.playerTurn = true
      this.isHost = true
      this.popUpOpen = true
    })
    this.socket.on('startGame', roomName => {
      this.roomName = roomName
      this.waiting = false
      this.playing = true
      if(this.isHost && this.popUpOpen)
        this.popUpOpen = false
      this.initBoard()
      this.createDisc()
    })
    this.socket.on('receiveGuestName', name => {
      this.guestName = name
      this.socket.emit('sendHostName', this.roomName, this.hostName)
    })
    this.socket.on('receiveHostName', name => {
      if (this.hostName === '')
        this.hostName = name
    })
    this.socket.on('updateView', state => {
      this.gameState = state
      if (!this.playerTurn) {
        this.discs[this.count - 1].x = this.gameState.discs[this.count - 1].x
        this.discs[this.count - 1].y = this.gameState.discs[this.count - 1].y
      }
    })
    this.socket.on('switchPlayer', () => {
      if (!this.playerTurn)
        this.playerTurn = true
    })
    this.socket.on('nextTurn', () => {
      (this.player.color === 'red') ? this.player.color = 'yellow' : this.player.color = 'red'
      this.createDisc()
    })
    this.socket.on('updateBoard', board => {
      this.board = board
    })
    this.socket.on('gameOver', (color) => {
      this.winningScreen(color)
    })
    this.socket.on('restart', () => {
      this.reset()
    })
    this.socket.on('waiting', () => {
      this.otherPlayerWaiting = true
    })
    this.socket.on('playerLeft', (name) => {
      this.gameOver = false
      this.msg = `${name} has left the game.`
      this.showLeave = true
      this.waiting = true
    })
  },
  methods: {
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
    getBottomRowInCol: function(col) {
      let bottom = -1
      for(let r = 0; r < ROWS; r++)
        if(!this.board[r][col])
          bottom = r
      return bottom
    },
    columnFull: function(c) {
      if (this.getBottomRowInCol(c) === -1)
        return true
      return false
    },
    isWinner: function (currentPlayer) {
      // horizontal win
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS - 3; c++) {
          if (this.board[r][c] && this.board[r][c+1] && this.board[r][c+2] && this.board[r][c+3])
            if (this.board[r][c].color === currentPlayer &&
              this.board[r][c+1].color === currentPlayer &&
              this.board[r][c+2].color === currentPlayer &&
              this.board[r][c+3].color === currentPlayer) {
                return true
              }
        }
      // vertical win
      for (let r = 0; r < ROWS - 3; r++)
        for (let c = 0; c < COLS; c++) {
          if (this.board[r][c] && this.board[r+1][c] && this.board[r+2][c] && this.board[r+3][c])
            if (this.board[r][c].color === currentPlayer &&
              this.board[r+1][c].color === currentPlayer &&
              this.board[r+2][c].color === currentPlayer &&
              this.board[r+3][c].color === currentPlayer) {
                return true
              }
        }
      // up-right diagonal win
      for (let r = 0; r < ROWS - 3; r++)
        for (let c = 0; c < COLS - 3; c++) {
          if (this.board[r][c] && this.board[r+1][c+1] && this.board[r+2][c+2] && this.board[r+3][c+3])
            if (this.board[r][c].color === currentPlayer &&
              this.board[r+1][c+1].color === currentPlayer &&
              this.board[r+2][c+2].color === currentPlayer &&
              this.board[r+3][c+3].color === currentPlayer) {
                return true;
              }
        }
      // down-right diagonal win
      for (let r = 3; r < ROWS; r++)
        for (let c = 0; c < COLS - 3; c++) {
          if (this.board[r][c] && this.board[r-1][c+1] && this.board[r-2][c+2] && this.board[r-3][c+3])
            if (this.board[r][c].color === currentPlayer &&
              this.board[r-1][c+1].color === currentPlayer &&
              this.board[r-2][c+2].color === currentPlayer &&
              this.board[r-3][c+3].color === currentPlayer) {
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
    winningScreen: function(color) {
      this.toggleRestart()
      if (this.isTie())
        this.winner = 'Tie. Nobody '
      else {
        this.updateWins(color)
        if (color === 'red')
          this.winner = this.hostName
        else
          this.winner = this.guestName
      }
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
        if (this.playerTurn && !this.discs[this.count - 1].dropped) {
            this.discs[this.count - 1].x = this.player.x
            this.gameState = {player: this.player, discs: this.discs}
            this.socket.emit('updateGameState', this.roomName, this.gameState)
        }
    },
    createDisc: function() {
      this.count++
      this.player.id = this.count
      let newDisc = { ...this.player }
      this.discs.push(newDisc)
    },
    dropDisc: function() {
      if(this.playerTurn && !this.falling) {
        this.column = Math.floor((this.player.x+45)/90)
        if (!this.columnFull(this.column)) {
            this.toggleMouseEvents()
            let currDisc = this.discs[this.count - 1]
            currDisc.dropped = true
            let bottom = 90 * this.getBottomRowInCol(this.column)
            this.board[bottom/90][this.column] = currDisc
            this.socket.emit('updateBoard', this.roomName, this.board)
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
                if (this.isWinner(currDisc.color) || this.isTie()) {
                    this.socket.emit('gameOver', this.roomName, currDisc.color)
                }
                else {
                    this.gameState = {player: this.player, discs: this.discs}
                    this.socket.emit('updateGameState', this.roomName, this.gameState)
                    this.toggleMouseEvents()
                    // switch player turn off and socket emit other player's turn
                    this.playerTurn = false
                    this.socket.emit('switchPlayerTurn', this.roomName)
                    this.socket.emit('nextTurn', this.roomName)
                }
              } else {
                currDisc.y = this.player.y
                this.player.y += vel
              }
              this.gameState = {player: this.player, discs: this.discs}
              this.socket.emit('updateGameState', this.roomName, this.gameState)
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
    updateWins: function(color) {
      bus.$emit('updateOnlineWins', color)
    },
    replay: function() {
      if (this.otherPlayerWaiting) {
        this.socket.emit('restart', this.roomName)
      } else {
        this.socket.emit('waiting', this.roomName)
        this.gameOver = false
        let name = this.getOtherPlayerName()
        this.msg = `Waiting on ${name} to restart...`
        this.waiting = true
      }
    },
    getOtherPlayerName: function() {
      if (this.isHost)
        return this.guestName
      else
        return this.hostName
    },
    leaveGame: function() {
      let name = this.guestName
      if (this.isHost)
        name = this.hostName
      this.socket.emit('playerLeft', this.roomName, name)
      this.$router.push('/')
    },
    reset: function() {
      for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
              this.board[r][c] = null
      this.discs = []
      this.count = 0
      this.player = {
        id: 0,
        x: 270,
        y: 100,
        color: 'red',
        dropped: false
      }
      if (this.waiting)
        this.waiting = false
      this.toggleRestart()
      if (this.isHost)
        this.playerTurn = true
      else
        this.playerTurn = false
      this.playing = true
      if (this.gameOver)
        this.gameOver = false
      this.falling = false
      this.otherPlayerWaiting = false
      this.createDisc()
    },
    closePopUp: function() {
      this.popUpOpen = false
      this.waiting = true
    },
    showClose: function() {
      this.showX = true
    },
    hideClose: function() {
      this.showX = false
    }
  }
}
</script>

<style scoped>
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

h3 {
  position: absolute;
  top: 20%;
  width: 100%;
  text-align: center;
}

a {
  position: absolute;
  top: 24%;
  width: 100%;
  text-align: center;
}

.discClass {
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    z-index: 0.5;
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

#replay {
    right: 29.5%;
}

#leave {
    left: 29.5%;
}

#banner {
  position: absolute;
  width: 630px;
  height: 108px;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: whitesmoke;
  text-align: center;
  color: #17193b;
}

#close {
  width: 15px;
  position: absolute;
  left: 30px;
  top: 0px;
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