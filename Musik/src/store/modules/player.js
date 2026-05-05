import playerService from '@/services/playerService'

function shuffleArray(arr) {
    const a = [...arr]
    for (let i = a.length -1; i> 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i]], [a[j]] = [a[j]], [a[i]]
    }
    return a
}

const state = () => ({
    status: 'idle',
    currentTrack: null,
    preview: false,
    position: 0,
    duration: 0,
    queue: [],
    queueIndex: -1,
    history: [],

    volume: 0.8,
    muted: false,
    shuffle: false,
    repeatMode: 'off',
    shuffledQueue: [],
    error: null,
})

const getters = {
    currentTrack: (s) => s.currentTrack,
    isPlaying: (s) => s.status === 'playing',
    isLoading: (s) => s.status === 'loading',
    isPaused: (s) => s.status === 'paused',
    isIdle: (s) => s.status === 'idle',

    progressPercent: (s) => 
        s.duration > 0 ? (s.position / s.duration) * 100 : 0,
        effectiveVolume: (s) => (s.muted ? 0 : s.volume),
        activeQueue: (s) => (s.shuffle ? s.shuffledQueue : s.queue),
        hasPrev: (s) => s.history.length > 0 || s.queueIndex > 0,

        hasNext(s, g) {
            const q = g.activeQueue
            if (s.repeatMode !== 'off') return true
            return s.queueIndex < q.length - 1
        },
}
const mutations = {
       SET_STATUS(state, status)         { state.status       = status },
       SET_TRACK(state, track)           { state.currentTrack = track  },
       SET_PREVIEW(state, val)           { state.preview      = val    },
       SET_POSITION(state, pos)          { state.position     = pos    },
       SET_DURATION(state, dur)          { state.duration     = dur    },
       SET_VOLUME(state, vol)            { state.volume       = vol    },
       SET_MUTED(state, val)             { state.muted        = val    },
       SET_SHUFFLE(state, val)           { state.shuffle      = val    },
       SET_REPEAT(state, mode)           { state.repeatMode   = mode   },
       SET_ERROR(state, msg)             { state.error        = msg    },
       SET_QUEUE_INDEX(state, i)         { state.queueIndex   = i      },
 
      SET_QUEUE(state, tracks) {
         state.queue = tracks
         state.shuffledQueue = shuffleArray(tracks)
        },
 
      PUSH_HISTORY(state, track) {
         state.history = [...state.history.slice(-49), track]  // keep last 50
        },
 
      POP_HISTORY(state) {
         state.history = state.history.slice(0, -1)
        },
 
      ADD_TO_QUEUE(state, track) {
         state.queue = [...state.queue, track]
         if (state.shuffle) state.shuffledQueue = shuffleArray(state.queue)
        },
 
      REMOVE_FROM_QUEUE(state, index) {
         const q = [...state.queue]
         q.splice(index, 1)
         state.queue = q
         if (state.shuffle) state.shuffledQueue = shuffleArray(q)
        },
 
      REBUILD_SHUFFLED(state) {
         state.shuffledQueue = shuffleArray(state.queue)
        },
}
const actions = {
    async play({ commit, state, dispatch }, { track, queue = [] }) {
        if (!track) return

        if (state.currentTrack && state.currentTrack.id === track.id) {
            commit('PUSH_HISTORY', state.currentTrack)
    }
    if (queue.length) {
        commit('SET_QUEUE', queue)
        const idx = queue.findIndex(t => t.id === track.id)
        commit('SET_QUEUE_INDEX', idx >= 0 ? idx : 0)
    }
    commit('SET_TRACK', track)
    commit('SET_STATUS', 'loading')
    commit('SET_ERROR', null)
    commit('SET_POSITION', 0)

    const previewUrl = track.preview_url

    if (!previewUrl) {
        commit('SET_STATUS', 'error')
        commit('SET_ERROR', `Превью недоступно для "${track.name}"`)
        setTimeout(() => dispatch('next'), 2000)
        return
    }
    commit('SET_PREVIEW', true)

    try {
        await playerService.load(previewUrl, {
            volume: state.muted ? 0 : state.volume,
            onplay: () => commit('SET_STATUS', 'playing'),
            onpause: () => commit('SET_STATUS', 'paused'),
            onstop: () => commit('SET_STATUS', 'idle'),
            onend: () => dispatch('onTrackEnd'),
            onerror: (err) => {
                commit('SET_STATUS', 'error')
                commit('SET_ERROR', `Ошибка воспроизведения: ${err}`)
            },
            ontick: ({ position, duration }) => {
                commit('SET_POSITION', position)
                commit('SET_DURATION', duration)
            },
        })
        playerService.play()
    } catch (err) {
        commit('SET_STATUS', 'error')
        commit('SET_ERROR', err.message)
    }
    },
    pause() {
        playerService.pause()
    },
    resume({ state }) {
        if (state.status === 'paused') playerService.resume()
    },
    togglePlay({ state, dispatch }) {
        if (state.status === 'playing') dispatch('pause')
        else if (state.status === 'paused') dispatch ('resume')
    },

    seek({ commit }, seconds) {
        playerService.seek(seconds)
        commit('SET_POSITION', seconds)
    },
    seekPercent({ state, dispatch }, percent) {
        const seconds = (percent / 100) * state.duration
        dispatch('seek', seconds)
    },
    setVolume({ commit, state }, vol) {
        const clamped = Math.min(1, Math.max(0, vol))
        commit('SET_VOLUME', clamped)
        if (!state.muted) playerService.setVolume(clamped)
    },

    toggleMute({ commit, state }) {
        const next = !state.muted
        commit('SET_MUTED', next)
        playerService.setVolume(next ? 0 : state.volume)
    },
    async next({ commit, state, getters, dispatch }) {
        const q = getters.activeQueue
        if (!q.length) return

        if (state.repeatMode === 'one') {
            dispatch('seek', 0)
            playerService.play()
            return
        }
        let nextIndex = state.queueIndex + 1

        if (nextIndex >= q.length) {
            if (state.repeatMode === 'all') {
                nextIndex = 0
                if (state.shuffle) commit('REBUILD_SHUFFLED')
            } else {
                playerService.stop()
                commit('SET_STATUS', 'idle')
                commit('SET_TRACK', null)
                commit('SET_QUEUE_INDEX', -1)
                return
            }
        }
        commit('SET_QUEUE_INDEX', nextIndex)
        dispatch('play', { track: q[nextIndex] })
    },
    async prev({ commit, state, getters, dispatch }) {
        if (state.position > 5) {
            dispatch('seek', 0)
            return
        }
        if (state.history.length > 0) {
            const prev = state.history[state.history.length - 1]
            commit('POP_HISTORY')
            dispatch('play', { track: prev })
            return
        }
        const q = getters.activeQueue
        const prevIdx = state.queueIndex - 1
        if (prevIdx >= 0) {
            commit('SET_QUEUE_INDEX', prevIdx)
            dispatch('play', { track: q[prevIdx] })
        }
    },
    onTrackEnd({ state, dispatch }) {
        if (state.repeatMode === 'one') {
            dispatch('seek', 0)
            playerService.play()
        } else {
            dispatch('next')
        }
    },
    addToQueue({ commit }, track) {
    commit('ADD_TO_QUEUE', track)
  },
 
  removeFromQueue({ commit }, index) {
    commit('REMOVE_FROM_QUEUE', index)
  },
 
  playFromQueue({ commit, getters, dispatch }, index) {
    const track = getters.activeQueue[index]
    if (track) {
      commit('SET_QUEUE_INDEX', index)
      dispatch('play', { track })
    }
  },
  toggleShuffle({ commit, state }) {
    const next = !state.shuffle
    commit('SET_SHUFFLE', next)
    if (next) commit('REBUILD_SHUFFLED')
  },
 
  cycleRepeat({ commit, state }) {
    const modes = ['off', 'all', 'one']
    const next  = modes[(modes.indexOf(state.repeatMode) + 1) % modes.length]
    commit('SET_REPEAT', next)
  },
  destroy() {
    playerService.destroy()
  },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations, 
    actions,
}