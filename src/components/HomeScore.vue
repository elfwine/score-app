<template>
  <div v-shortkey="keyMap"
       @shortkey="keyAction">
    <h3 contenteditable="true" spellcheck="false">
      HOME
    </h3>
    <Score :value="this.$store.state.score.home"
           @increment="increment"
           @decrement="decrement" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Score from './Score.vue';

@Component({
  components: { Score },
})
export default class HomeScore extends Vue {
  increment () {
    this.$store.commit('incrementHome')
  }
  decrement () {
    this.$store.commit('decrementHome')
  }

  keyMap = { increment: ['q'], decrement: ['a'] }
  keyAction (event: { srcKey: string }) {
    switch (event.srcKey) {
      case 'increment':
        return this.increment()
      case 'decrement':
        return this.decrement()
    }
  }
}
</script>
