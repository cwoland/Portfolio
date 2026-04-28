<template>
    <div class="user-page">
        <h1>Профиль</h1>

        <div v-if="user">
            <p><strong>Имя:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>

            <button @click="logout">Выйти</button>
    </div>

    <div v-else>
        <p>Вы не авторизованы</p>
    </div>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.state.user)

const logout = () => {
    store.commit('setUser', null)
    router.push('/registration')
}
</script>

<style scoped>
.user-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding: 40px 30px;
    width: 75%;
    max-width: 600px;
    min-height: 400px;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(77, 16, 74, 0.3);
}
 
.user-page h1 {
    color: rgb(77, 16, 74);
    font-size: 2rem;
    font-family: 'Integral CF', sans-serif;
    text-align: center;
    margin: 0 0 24px 0;
}
 
.user-page p {
    color: rgb(77, 16, 74);
    font-family: sans-serif;
    font-size: 1rem;
    margin: 8px 0;
}
 
.user-page strong {
    font-weight: bold;
}
 
.user-page button {
    margin-top: 24px;
    padding: 10px 24px;
    background-color: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s, transform 0.2s;
}
 
.user-page button:hover {
    background-color: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.05);
}
 
/* not-logged-in state */
.user-page > div:last-child p {
    font-size: 1.1rem;
    color: rgba(77, 16, 74, 0.7);
    font-style: italic;
}
 
@media (max-width: 768px) {
    .user-page {
        width: 92%;
        padding: 24px 16px;
        min-height: auto;
    }
 
    .user-page h1 {
        font-size: 1.5rem;
        margin-bottom: 16px;
    }
 
    .user-page button {
        width: 100%;
        font-size: 0.95rem;
    }
}
 
@media (max-width: 480px) {
    .user-page h1 {
        font-size: 1.3rem;
    }
 
    .user-page p {
        font-size: 0.9rem;
    }
}
</style>