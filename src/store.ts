import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export enum Direction {
  Left,
  Right,
  None
}

export type State = {
  score: {
    home: number;
    away: number;
  },
  period: number;
  direction: Direction;
  clock: {
    time: number;
    running: boolean;
  }
}

const defaultState = {
  score: {
    home: 0,
    away: 0
  },
  period: 1,
  direction: Direction.None,
  clock: {
    time: 10*60,
    running: false
  }
}

let intervalID: any;

export default new Vuex.Store<State>({
  state: defaultState,
  getters: {
    minutes: state => Math.floor(state.clock.time / 60),
    seconds: state => state.clock.time % 60
  },
  mutations: {
    incrementHome: (state) => state.score.home++,
    incrementAway: (state) => state.score.away++,
    incrementPeriod: (state) => state.period++,
    setClock: (state, running: boolean) => state.clock.running = running,
    setTime: (state, time: number) => state.clock.time = time,
  },
  actions: {
    startClock ({ commit, dispatch }) {
      commit('setClock', true)

      intervalID = setInterval(() => dispatch('updateClock', -1), 1000)
    },
    stopClock ({ commit }) {
      commit('setClock', false)

      clearInterval(intervalID)
    },
    toggleClock ({ state, dispatch }) {
      if (state.clock.running) {
        dispatch('stopClock')
      } else {
        dispatch('startClock')
      }
    },
    updateClock ({ state, commit, dispatch }, amount: number) {
      const time = state.clock.time + amount;

      if (time < 0) {
        commit('setTime', 0)
        return dispatch('stopClock')
      }

      commit('setTime', time)
    }
  }
})