import { createStore } from 'vuex'
import { fetchMovies } from '@/services/api'

export default createStore({
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,  // ← fix this line
        cart: JSON.parse(localStorage.getItem('cart')) || [],    // ← and this
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
        incrementPage(state) {
            state.currentPage++
        }    },
    actions: {
        async loadMovies({ commit }, query = '') {
            commit('setLoading', true)
            commit('setCurrentQuery', query)
            const movies = await fetchMovies(query)
            commit('setMovies', movies)
            commit('setLoading', false)
        },
        async loadMoreMovies({ commit, state }) {
            commit('setLoading', true)
            const nextPage = state.currentPage + 1
            // Kinopoisk API might use offset instead of page
            const pageParam = `page=${nextPage}`
            const query = state.currentQuery ? `${state.currentQuery}&${pageParam}` : pageParam
            console.log('Load more query:', query)
            const movies = await fetchMovies(query)
            commit('addMovies', movies)
            commit('incrementPage')
            commit('setLoading', false)
        }
    }
})