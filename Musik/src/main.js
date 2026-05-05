import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import authService from './services/authService'

async function bootstrap() {
    await authService.init()
    createApp(App).use(store).use(router).mount('#app')
}
bootstrap()