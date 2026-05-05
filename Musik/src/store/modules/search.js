import api from '@/services/spotifyApi'

function nextOffset(paging) {
    if (!paging?.next) return null
    const url = new URL(paging.next)
    const offset = url.searchParams.get('offset')
    return offset !== null ? parseInt(offset, 10) : null
}

function appendItems(existing, incoming) {
    return [...existing, ...incoming(incoming?.items ?? [])]
}

const state = () => ({
    query: '',
    filters: {
        type: 'all',
        genre: null,
        year: null,
    },
    results: {
        tracks: {items: [], total: 0, nextOffset: null},
        artists: {items: [], total: 0, nextOffset: null},
        albums: {items: [], total: 0, nextOffset: null},
        playlists: {items: [], total: 0, nextOffset: null},
    },
    loading: false,
    loadingMore: false,
    error: null,

    hasSearched: false,
})

const getters = {
    tracks: (s) => s.results.tracks.items,
    artists: (s) => s.results.artists.items,
    albums: (s) => s.results.albums.items,
    playlists: (s) => s.results.playlists.items,

    totalTracks: (s) => s.results.tracks.total,
    totalArtists: (s) => s.results.artists.total,
    totalAlbums: (s) => s.results.albums.total,
    totalPlaylists: (s) => s.results.playlists.total,

    hasMore(s) {
        const type = s.filters.type === 'all' ? 'tracks' : `${s.filters.type}s`
        return s.results[type]?.nextOffset !== null
    },
    activeTypes(s) {
        if (s.filters.type === 'all') return ['tracks', 'artists', 'albums', 'playlists']
        return [s.filters.type]
    },
    isEmpty(s) {
        const {tracks, artists, albums, playlists} = s.results
        return (
            s.hasSearched &&
            !s.loading &&
            tracks.items.length === 0 &&
            artists.items.length === 0 &&
            albums.items.length === 0 &&
            playlists.items.length === 0
        )
    },
}

const mutations = {
    SET_QUERY(state, query) {
        state.query = query
    },
    SET_FILTER(state, { key, value }) {
        state.filters[key] = value
    },
    RESET_RESULTS(state) {
        state.results = {
            tracks: {items: [], total: 0, nextOffset: null },
            artists: {items: [], total: 0, nextOffset: null },
            albums: {items: [], total: 0, nextOffset: null },
            playlists: {items: [], total: 0, nextOffset: null },
        }
        state.hasSearched = false
        state.error = null
    },
    SET_LOADING(state, val) {
        state.loading = val
    },
    SET_LOADING_MORE(state, val) {
        state.loadingMore = val
    },
    SET_ERROR(state, message) {
        state.error = message
        state.loading = false
    },
    SET_RESULTS(state, { tracks, artists, albums, playlists }) {
        if (tracks) {
            state.results.tracks = {
                items: tracks.items ?? [],
                total: tracks.total ?? 0,
                nextOffset: nextOffset(tracks)
            }
        }
        if (artists) {
            state.results.artists = {
                items: artists.items ?? [],
                total: artists.total ?? 0,
                nextOffset: nextOffset(artists)
            }
        }
        if (albums) {
            state.results.albums = {
                items: albums.items ?? [],
                total: albums.total ?? 0,
                nextOffset: nextOffset(albums)
            }
        }
        if (playlists) {
            state.results.playlists = {
                items: playlists.items ?? [],
                total: playlists.total ?? 0,
                nextOffset: nextOffset(playlists),
            }
        }
        state.hasSearched = true
    },
    APPEND_RESULTS(state, { tracks, artists, albums, playlists }) {
        if (tracks) {
            state.results.tracks.items = appendItems(state.results.tracks.items, tracks)
            state.results.tracks.nextOffset = nextOffset(tracks)
        }
        if (artists) {
            state.results.artists.items = appendItems(state.results.artists.items, artists)
            state.results.artists.nextOffset = nextOffset(artists)
        }
        if (albums) {
            state.results.albums.items = appendItems(state.results.albums.items, albums)
            state.results.albums.nextOffset = nextOffset(albums)
        }
        if (playlists) {
            state.results.playlists.items = appendItems(state.results.playlists.items, playlists)
            state.results.playlists.nextOffset = nextOffset(playlists)
        }
    },
}

const actions = {
    async query({ commit, state, getters }, { q, reset = true } = {}) {
        const query = q ?? state.query
        if (!query.trim()) return

        if (reset) commit('RESET_RESULTS')
            commit('SET_QUERY', query)
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const data = await api.search(query, getters.activeTypes, {
                    limit: 20,
                    offset: 0,
                    genre: state.filters.genre,
                    year: state.filters.year,
                })

                commit('SET_RESULTS', {
                    tracks: data.tracks,
                    artists: data.artists,
                    albums: data.albums,
                    playlists: data.playlists,
                })
            } catch (err) {
                commit('SET_ERROR', err.message)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async loadMore({ commit, state, getters }) {
    if (!state.query.trim() || state.loadingMore) return
 
    const type        = state.filters.type === 'all' ? 'tracks' : `${state.filters.type}s`
    const offset      = state.results[type]?.nextOffset
    if (offset === null || offset === undefined) return
 
    commit('SET_LOADING_MORE', true)
 
    try {
      const data = await api.search(state.query, getters.activeTypes, {
        limit:  20,
        offset,
        genre:  state.filters.genre,
        year:   state.filters.year,
      })
 
      commit('APPEND_RESULTS', {
        tracks:    data.tracks,
        artists:   data.artists,
        albums:    data.albums,
        playlists: data.playlists,
      })
    } catch (err) {
      commit('SET_ERROR', err.message)
    } finally {
      commit('SET_LOADING_MORE', false)
    }
     },

     async setFilter({ commit, dispatch, state }, { key, value }) {
    commit('SET_FILTER', { key, value })
    if (state.query.trim()) {
      await dispatch('query', { q: state.query, reset: true })
    }
  },

  async clearFilters({ commit, dispatch, state }) {
    commit('SET_FILTER', { key: 'type',  value: 'all' })
    commit('SET_FILTER', { key: 'genre', value: null  })
    commit('SET_FILTER', { key: 'year',  value: null  })
    if (state.query.trim()) {
      await dispatch('query', { q: state.query, reset: true })
    }
  },

  clear({ commit }) {
    commit('SET_QUERY', '')
    commit('SET_FILTER', { key: 'type',  value: 'all' })
    commit('SET_FILTER', { key: 'genre', value: null  })
    commit('SET_FILTER', { key: 'year',  value: null  })
    commit('RESET_RESULTS')
  },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}