<template>
  <div>
    <h3 class="sc-title" contenteditable="false" spellcheck="false">SHOT CLOCK</h3>
    <div class="sc">
      <div class="buttons">
        <button class="button" @click="increment"> + </button>
      </div>
      <div class="shotclock clickable" v-shortkey="{ reset1: ['n'], reset2: ['m'] }"
          @shortkey="keyAction" v-bind:class="{ active: this.$store.state.shotclock.running }"
          @click="onClick($event)" >
        <Digits v-bind:value="this.$store.getters.shotclock"
              @increment="increment"
              @decrement="decrement"/>
      </div>
      <div class="buttons">
        <button class="button" @click="decrement"> - </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { State } from '../store';
import Digits from './Digits.vue';

@Component({
  components: { Digits },
})
export default class ShotClock extends Vue {
  $store!: Store<State>;

  onClick (event: MouseEvent) {
    if (event.ctrlKey) {
      this.decrement()
    } else {
      this.increment()
    }
  }
  keyAction (event: { srcKey: string }) {
    switch (event.srcKey) {
      case 'reset1':
        return this.resetShotClock1()
      case 'reset2':
        return this.resetShotClock2()
    }
  }
  increment () {
    this.$store.dispatch('incrementShotClock')
  }
  decrement () {
    this.$store.dispatch('decrementShotClock')
  }
  resetShotClock1() {
    this.$store.dispatch('resetShotClock1')
  }
  resetShotClock2() {
    this.$store.dispatch('resetShotClock2')
  }
}
</script>

<style scoped>
.sc {
  display: flex;
  flex-flow: row;
  justify-content: space-evenly;
  align-content: center;
  margin: 0;
  padding: 0;
}
.shotclock {
  /*padding: .2em .1em .1em .1em;*/
  font-size: 0.22em;
  color: rgb(27, 133, 219);
}
.sc-title {
  font-size: .06em; 
  margin: .1em 0;
  color: whitesmoke;
}
/*
.shotclock.active {
  border-color: rgba(173, 255, 47, .8);
  color: greenyellow;
}
*/
.sc .buttons {
  width: 0.6em;
  height: 0.2em;
  font-size: 0.2em;
  line-height: 0.1em;

}
.sc button.button {
  margin: auto;
  width: 100%;
}
</style>
