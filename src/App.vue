<template>
  <div id="app">
    <Board />
  </div>
</template>

<script>
import Board from './components/Board/Board.vue'

export default {
  name: 'app',
  components: {
    Board
  }
}
</script>


<style lang="scss">
  @import "./sass/app.scss";
</style>