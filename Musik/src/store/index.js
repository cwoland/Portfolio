import { createStore } from 'vuex'
import search from './modules/search'
import player from './modules/player'
import library from './modules/library'
import catalog from './modules/catalog'

export default createStore({
    modules: {
        search,
        player,
        library,
        catalog
    },
})