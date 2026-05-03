<template>
    <header class="nav" :class="{ 'dark': isDark }">
        <div class="nav-links">
            <router-link to="/" :class="{ active: route.path === '/' }">
                🏠 Главная
            </router-link>
            <router-link to="/Store" :class="{ active: route.path === '/Store' }">
                🎬 Библиотека
            </router-link>
            <router-link to="/Cart" :class="{ active: route.path === '/Cart' }">
                ⭐ Избранное
            </router-link>
            <router-link 
                v-if="!user" 
                to="/Registration" 
                :class="{ active: route.path === '/Registration' }"
            >
                Регистрация
            </router-link>
            <router-link 
                v-else 
                to="/User" 
                :class="{ active: route.path === '/User' }"
            >
                👤 {{ user.name }}
            </router-link>
        </div>

        <button class="theme-toggle" @click="toggleTheme">
            {{ isDark ? '☀️' : '🌙' }}
        </button>
    </header>

    <nav class="mobile-nav" :class="{ 'dark': isDark }">
        <router-link to="/" :class="{ active: route.path === '/' }">
            <span class="mobile-nav-icon">🏠</span>
            <span class="mobile-nav-label">Главная</span>
        </router-link>
        <router-link to="/Store" :class="{ active: route.path === '/Store' }">
            <span class="mobile-nav-icon">🎬</span>
            <span class="mobile-nav-label">Библиотека</span>
        </router-link>
        <router-link to="/Cart" :class="{ active: route.path === '/Cart' }">
            <span class="mobile-nav-icon">⭐</span>
            <span class="mobile-nav-label">Избранное</span>
        </router-link>
        <router-link 
            v-if="!user" 
            to="/Registration" 
            :class="{ active: route.path === '/Registration' }"
        >
            <span class="mobile-nav-icon">📝</span>
            <span class="mobile-nav-label">Регистрация</span>
        </router-link>
        <router-link 
            v-else 
            to="/User" 
            :class="{ active: route.path === '/User' }"
        >
            <span class="mobile-nav-icon">👤</span>
            <span class="mobile-nav-label">{{ user.name }}</span>
        </router-link>
        <button class="mobile-theme-toggle" @click="toggleTheme">
            <span class="mobile-nav-icon">{{ isDark ? '☀️' : '🌙' }}</span>
            <span class="mobile-nav-label">{{ isDark ? 'Светлая' : 'Тёмная' }}</span>
        </button>
    </nav>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()
const user = computed(() => store.state.user)

const isDark = ref(localStorage.getItem('theme') === 'dark')

const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    document.body.classList.toggle('dark', isDark.value)
}

onMounted(() => {
    document.body.classList.toggle('dark', isDark.value)
})
</script>

<style scoped>
.nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 32px;
    background: rgba(49, 47, 47, 0.2);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(77, 16, 74, 0.3);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-links {
    display: flex;
    gap: 24px;
    align-items: center;
}

.nav a {
    color: rgb(200, 180, 220);
    text-decoration: none;
    font-size: 0.95rem;
    padding: 6px 14px;
    border-radius: 20px;
    transition: all 0.2s;
    position: relative;
}

.nav a:hover {
    color: rgb(239, 222, 249);
    background: rgba(77, 16, 74, 0.3);
}

.nav a.active {
    color: rgb(239, 222, 249);
    background: rgb(77, 16, 74);
    font-weight: bold;
}

.theme-toggle {
    background: rgba(77, 16, 74, 0.3);
    border: 1px solid rgba(77, 16, 74, 0.5);
    border-radius: 20px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.2s;
}

.theme-toggle:hover {
    background: rgba(77, 16, 74, 0.6);
    transform: scale(1.1);
}

.mobile-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(30, 28, 28, 0.95);
    backdrop-filter: blur(15px);
    border-top: 1px solid rgba(77, 16, 74, 0.4);
    padding: 8px 0 16px;
    z-index: 200;
    justify-content: space-around;
    align-items: center;
}

.mobile-nav a,
.mobile-theme-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: rgb(180, 160, 200);
    text-decoration: none;
    font-size: 0.7rem;
    padding: 6px 10px;
    border-radius: 10px;
    transition: all 0.2s;
    background: none;
    border: none;
    cursor: pointer;
}

.mobile-nav a.active {
    color: rgb(239, 222, 249);
    background: rgba(77, 16, 74, 0.4);
}

.mobile-nav a:hover,
.mobile-theme-toggle:hover {
    color: rgb(239, 222, 249);
}

.mobile-nav-icon {
    font-size: 1.3rem;
}

.mobile-nav-label {
    font-size: 0.65rem;
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.nav.dark {
    background: rgba(15, 14, 14, 0.6);
    border-bottom-color: rgba(77, 16, 74, 0.5);
}

.mobile-nav.dark {
    background: rgba(10, 10, 10, 0.97);
}

@media (max-width: 768px) {
    .nav {
        display: none;
    }

    .mobile-nav {
        display: flex;
    }
}
</style>