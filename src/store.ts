import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

export enum Possessions {
  None,
  Home = 'home',
  Away = 'away',
}

export type State = {
  score: {
    home: number;
    away: number;
  },
  fouls: {
    home: number;
    away: number;
  },
  period: number;
  possession: Possessions;
  clock: {
    time: number;
    running: boolean;
  },
  shotclock: {
    time: number;
    running: boolean;
  },
  editable: boolean;
}

// TODO ablity to configure time & max fouls
const defaultState: State = {
  score: {
    home: 0,
    away: 0
  },
  fouls: {
    home: 0,
    away: 0
  },
  period: 1,
  possession: Possessions.None,
  clock: {
    time: 10*60,
    running: false
  },
  shotclock: {
    time: 24,
    running: false
  },
  editable: false
}

let intervalID: any;

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
})

// load audio so it's ready when needed
const audio = new Audio('/buzzer.mp3');

export default new Vuex.Store<State>({
  plugins: [vuexLocal.plugin],
  state: defaultState,
  getters: {
    minutes: state => Math.floor(state.clock.time / 60),
    seconds: state => state.clock.time % 60,
    shotclock: state => state.shotclock.time
  },
  mutations: {
    incrementHome: (state) => state.score.home++,
    decrementHome: (state) => state.score.home && state.score.home--,
    incrementAway: (state) => state.score.away++,
    decrementAway: (state) => state.score.away && state.score.away--,
    incrementHomeFouls: (state) => state.fouls.home++,
    decrementHomeFouls: (state) => state.fouls.home && state.fouls.home--,
    incrementAwayFouls: (state) => state.fouls.away++,
    decrementAwayFouls: (state) => state.fouls.away && state.fouls.away--,
    incrementPeriod: (state) => state.period++,
    decrementPeriod: (state) => state.period && state.period--,
    setClock: (state, running: boolean) => state.clock.running = running,
    setTime: (state, time: number) => state.clock.time = time,
    setShotClock: (state, running: boolean) => state.shotclock.running = running,
    setShotClockTime: (state, time: number) => state.shotclock.time = time,    
    setPossession: (state, value: Possessions) => state.possession = value,
    toggleEditable: (state) => state.editable = !state.editable
  },
  actions: {
    startClock ({ commit, dispatch }) {
      commit('setClock', true)
      commit('setShotClock', true)

      intervalID = setInterval(() => { dispatch('updateClock', -1); dispatch('updateShotClock', -1) }, 1000)
    },
    stopClock ({ commit }) {
      commit('setClock', false)
      commit('setShotClock', false)

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
        dispatch('playBuzzer')
        return dispatch('stopClock')
      }

      commit('setTime', time)
    },
    incrementClock({ getters, commit }) {
      const time = getters.minutes + 1;
      commit('setTime', time * 60)
    },
    decrementClock({ getters, commit }) {
      const time = getters.minutes - 1;
      commit('setTime', time * 60)
    },
    playBuzzer() {
      // Using cloneNode to overcome issue on iOS only playing the sound once
      (audio.cloneNode() as HTMLAudioElement).play();
    },
    updateShotClock ({ state, commit, dispatch }, amount: number) {
      const time = state.shotclock.time + amount;

      if (time < 0) {
        commit('setShotClocTime', 0)
        dispatch('playBuzzer')
        dispatch('stopClock')
        return dispatch('stopShotClock')
      }
      commit('setShotClockTime', time)
    },
    incrementShotClock({ state, commit }) {
      var time = state.shotclock.time + 1;
      if(time > 24) { time = 24 }
      commit('setShotClockTime', time)
    },
    decrementShotClock({ state, commit }) {
      var time = state.shotclock.time - 1;
      if(time < 0) { time = 0 }
      commit('setShotClockTime', time)
    },
    resetShotClock1({ commit }) {
      commit('setShotClockTime', 24)
    },
    resetShotClock2({ commit }) {
      commit('setShotClockTime', 14)
    }
  }
})
