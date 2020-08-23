<template>
  <div id="app">
    <Board />
    <transition :enter-active-class="transitionIn" :leave-active-class="transitionOut">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Board from './components/Board.vue'

export default {
  name: 'App',
  components: {
    Board
  },
  data() {
    return {
      transitionIn: null,
      transitionOut: null
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.path === '/' && to.path === '/ai') {
        this.transitionIn = 'animated fadeIn'
        this.transitionOut = 'animated fadeOut'
      }
      else if (to.path === '/online') {
        this.transitionIn = 'animated fadeIn'
      }
    }
  }
}
</script>

<style>
* {
  font-family: "Lucida Console", Monaco, monospace;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html { 
  background: whitesmoke;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

body {
  overflow-x: scroll;
}

#app {
  height: 1000px;
}

.fadeIn {
  -webkit-animation: fadeIn 0.3s; /* Safari 4+ */
  -moz-animation:    fadeIn 0.3s; /* Fx 5+ */
  -o-animation:      fadeIn 0.3s; /* Opera 12+ */
  animation:         fadeIn 0.3s; /* IE 10+, Fx 29+ */
}

.fadeOut {
  -webkit-animation: fadeOut 0.2s; /* Safari 4+ */
  -moz-animation:    fadeOut 0.2s; /* Fx 5+ */
  -o-animation:      fadeOut 0.2s; /* Opera 12+ */
  animation:         fadeOut 0.2s; /* IE 10+, Fx 29+ */
}

</style>
