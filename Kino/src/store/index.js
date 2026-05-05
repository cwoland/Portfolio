import { createStore } from 'vuex'
import { fetchMovies } from '@/services/api'

export default createStore({
    state: {
        user: (() => {
             try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
                 } catch (e) {
            localStorage.removeItem('user')
            return null
                             }
            })(),
        cart: (() => {
              try {
                  const stored = localStorage.getItem('cart')
                  return stored ? JSON.parse(stored) : []
                  } catch (e) {
                    localStorage.removeItem('cart')
                    return []
                              }
                    })(),
        movies: [],
        loading: false,
        currentPage: 1,
        currentQuery: ''
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        setLoading(state, value) {
            state.loading = value
        },
        addToCart(state, movie) {
            state.cart.push(movie)
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        removeFromCart(state, id) {
            state.cart = state.cart.filter(m => m.id !== id)
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        clearCart(state) {
            state.cart = []
            localStorage.removeItem('cart')
        },
        setMovies(state, movies) {
            state.movies = movies
        },
        addMovies(state, movies) {
            state.movies = [...state.movies, ...movies]
        },
        setCurrentQuery(state, query) {
            state.currentQuery = query
            state.currentPage = 1
        },
        setPage(state, page) {
            state.currentPage = page
        },
        incrementPage(state) {
            state.currentPage++
        }    },
    actions: {
        async loadMovies({ commit }, query = '') {
            commit('setLoading', true)
            commit('setCurrentQuery', query)
            commit('setPage', 1)
            const movies = await fetchMovies(query, 1)
            commit('setMovies', movies)
            commit('setLoading', false)
        },
        async loadMoreMovies({ commit, state }) {
            commit('setLoading', true)
            const nextPage = state.currentPage + 1
            const movies = await fetchMovies(state.currentQuery, nextPage)
            commit('addMovies', movies)
            commit('setPage', nextPage)
            commit('setLoading', false)
        }
    }
})