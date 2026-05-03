import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Registration from '@/views/Registration.vue'
import Store from '@/views/Store.vue'
import Cart from '@/views/Cart.vue'
import User from '@/views/User.vue'
import MovieDetails from '@/views/MovieDetails.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/Registration', name: 'Registration', component: Registration },
    { path: '/Store', name: 'Store', component: Store },
    { path: '/Cart', name: 'Cart', component: Cart },
    { path: '/User', name: 'User', component: User },
    { path: '/movie/:id', name: 'MovieDetails', component: MovieDetails }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
const publicPages = ['/Registration']
const authRequired = !publicPages.includes(to.path)
const loggedIn = localStorage.getItem('user')

if (authRequired && !loggedIn) {
    return next('/Registration')
}
next()
})

export default router