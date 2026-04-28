import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const savedUser = localStorage.getItem('user')
const savedCart = localStorage.getItem('cart')

if (savedUser) {
    store.commit('setUser', JSON.parse(savedUser))
}

if (savedCart) {
    store.state.cart = JSON.parse(savedCart)
}

createApp(App)
.use(router)
.use(store)
.mount('#app')