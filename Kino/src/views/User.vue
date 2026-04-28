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