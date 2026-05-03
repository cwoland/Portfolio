<template>
    <div class="user-page">
        <div class="profile-card">
            <div class="avatar">
                {{ userInitials }}
            </div>

            <h1>{{ user?.name}}</h1>
            <p class="email">{{ user?.email }}</p>

            <div class="stats">
                <div class="stat">
                <span class="stat-number">{{ cartCount }}</span>
                <span class="stat-label">В библиотеке</span>
            </div>
            <div class="stat">
                <span class="stat-number">{{ memberDays }}</span>
                <span class="stat-label">Дней с нами</span> 
            </div>
            </div>
        <div class="edit-section">
                <h2>Редактировать профиль</h2>
                <input v-model="editName" type="text" placeholder="Имя" />
                <input v-model="editEmail" type="email" placeholder="Email" />
                <p v-if="editSuccess" class="success">Сохранено! ✓</p>
                <button @click="saveProfile" class="save-btn">Сохранить</button>
            </div>

            <div class="actions">
                <button @click="clearCart" class="danger-btn">🗑 Очистить корзину</button>
                <button @click="logout" class="logout-btn">Выйти</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.state.user)
const cartCount = computed(() => store.state.cart.length)

const editName = ref(user.value?.name || '')
const editEmail = ref(user.value?.email || '')
const editSuccess = ref(false)

const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

// Days since registration
const memberDays = computed(() => {
    const joined = localStorage.getItem('joinedDate')
    if (!joined) return 1
    const diff = Date.now() - new Date(joined).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
})

const saveProfile = () => {
    const updated = {
        ...user.value,
        name: editName.value,
        email: editEmail.value
    }
    store.commit('setUser', updated)
    editSuccess.value = true
    setTimeout(() => editSuccess.value = false, 2000)
}

const clearCart = () => {
    store.commit('clearCart')
}

const logout = () => {
    store.commit('setUser', null)
    router.push('/Registration')
}
</script>

<style scoped>
.user-page {
    display: flex;
    justify-content: center;
    padding: 40px 20px;
}

.profile-card {
    background: rgba(49, 47, 47, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(77, 16, 74, 0.4);
    padding: 40px;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    font-size: 2.5rem;
    font-family: 'Integral CF', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgb(239, 222, 249);
}

h1 {
    color: rgb(239, 222, 249);
    font-family: 'Integral CF', sans-serif;
    font-size: 1.8rem;
    margin: 0;
}

.email {
    color: rgb(200, 180, 220);
    font-size: 0.95rem;
    margin: 0;
}

.stats {
    display: flex;
    gap: 40px;
    background: rgba(77, 16, 74, 0.2);
    border-radius: 12px;
    padding: 16px 30px;
    width: 100%;
    justify-content: center;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.stat-number {
    color: rgb(239, 222, 249);
    font-size: 1.8rem;
    font-weight: bold;
    font-family: 'Integral CF', sans-serif;
}

.stat-label {
    color: rgb(200, 180, 220);
    font-size: 0.8rem;
}

.edit-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.edit-section h2 {
    color: rgb(239, 222, 249);
    font-size: 1rem;
    margin: 0;
}

.edit-section input {
    padding: 10px 14px;
    border: 1px solid rgb(77, 16, 74);
    border-radius: 8px;
    background: rgba(49, 47, 47, 0.4);
    color: rgb(239, 222, 249);
    font-size: 15px;
    width: 100%;
    box-sizing: border-box;
}

.success {
    color: #7fff7f;
    font-size: 0.9rem;
    margin: 0;
}

.actions {
    display: flex;
    gap: 10px;
    width: 100%;
}

.save-btn {
    width: 100%;
    padding: 10px;
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
}

.save-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.02);
}

.danger-btn {
    flex: 1;
    padding: 10px;
    background: rgba(150, 20, 20, 0.6);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
}

.danger-btn:hover {
    background: rgb(200, 30, 30);
    transform: scale(1.02);
}

.logout-btn {
    flex: 1;
    padding: 10px;
    background: rgba(77, 16, 74, 0.4);
    color: rgb(239, 222, 249);
    border: 1px solid rgb(77, 16, 74);
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
}

.logout-btn:hover {
    background: rgb(77, 16, 74);
    transform: scale(1.02);
}

@media (max-width: 480px) {
    .profile-card {
        padding: 24px 16px;
    }

    .actions {
        flex-direction: column;
    }
}
</style>