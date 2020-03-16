<template>
  <div>
    <div class="fouls lcd clickable"
        v-bind:class="{ bonus: this.bonus }"
        @click="onClick($event)">
      {{ value }}
    </div>
    <button class="button"
      @click="$emit('decrement')">
      -
    </button>
  </div>
</template>

<script lang="ts">
import { VNode } from 'vue'
import { Component, Prop, Vue } from 'vue-property-decorator';
import Digits from './Digits.vue';

@Component({
  components: { Digits },
  props: { value: Number }
})
export default class Fouls extends Vue {
  value!: number;

  get bonus () {
    return this.value >= 5;
  }

  onClick (event: MouseEvent) {
    if (event.ctrlKey) {
      this.$emit('decrement')
    } else {
      if(this.value < 9) {
        this.$emit('increment')
      }
    }
  }
}
</script>

<style scoped>
.fouls {
  font-size: 0.2em;
  color: orange;
}
.fouls.bonus {
  color: red;
}
button.button {
  display: block;
  width: 2.5em;
  margin: 0.2em auto;
}
</style>
