<template>
    <header class="nav">
        <router-link to="/">Главная</router-link>
        <router-link to="/Store">Магазин</router-link>
        <router-link to="/Cart">Корзина</router-link>
        <router-link v-if="!user" to="/Registration">Регистрация</router-link>
        <router-link v-else to="/User">👤 {{ user.name }}</router-link>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const user = computed(() => store.state.user)
import Store from "@/views/Store.vue"
import Cart from "@/views/Cart.vue"
import Registration from "@/views/Registration.vue"
import User from "@/views/User.vue"
</script>