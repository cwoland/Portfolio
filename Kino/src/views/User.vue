<template>
    <div class="user-page">
        <div class="profile-card">

            <div class="avatar-wrapper">
                <div class="avatar" @click="triggerUpload">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="avatar-img" />
                    <span v-else>{{ userInitials }}</span>
                    <div class="avatar-overlay">📷</div>
                </div>
                <input ref="fileInput" type="file" accept="image/*" @change="handleAvatarUpload" hidden />
            </div>

            <h1>{{ user?.name }}</h1>
            <p class="nickname" v-if="user?.nickname">@{{ user?.nickname }}</p>
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

            <button @click="showEdit = !showEdit" class="toggle-edit-btn">
                {{ showEdit ? '✕ Скрыть' : '✏️ Редактировать профиль' }}
            </button>

            <div v-if="showEdit" class="edit-section">
                <input v-model="editName" type="text" placeholder="Имя" />
                <input v-model="editSurname" type="text" placeholder="Фамилия" />
                <input v-model="editNickname" type="text" placeholder="Никнейм" />
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

const showEdit = ref(false)
const editSuccess = ref(false)
const fileInput = ref(null)

const editName = ref(user.value?.name || '')
const editSurname = ref(user.value?.surname || '')
const editNickname = ref(user.value?.nickname || '')
const editEmail = ref(user.value?.email || '')

const avatarUrl = ref(localStorage.getItem('avatarUrl') || '')

const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
})

const memberDays = computed(() => {
    const joined = localStorage.getItem('joinedDate')
    if (!joined) return 1
    const diff = Date.now() - new Date(joined).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
})

const triggerUpload = () => {
    fileInput.value.click()
}

const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
        avatarUrl.value = reader.result
        localStorage.setItem('avatarUrl', reader.result)
    }
    reader.readAsDataURL(file)
}

const saveProfile = () => {
    const updated = {
        ...user.value,
        name: editName.value,
        surname: editSurname.value,
        nickname: editNickname.value,
        email: editEmail.value
    }
    store.commit('setUser', updated)
    editSuccess.value = true
    showEdit.value = false
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
    gap: 16px;
}

.avatar-wrapper {
    position: relative;
}

.avatar {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    font-size: 2.5rem;
    font-family: 'Integral CF', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid rgb(239, 222, 249);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
}

.avatar:hover {
    border-color: rgb(77, 16, 74);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.avatar-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(77, 16, 74, 0.7);
    text-align: center;
    padding: 4px;
    font-size: 1rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.avatar:hover .avatar-overlay {
    opacity: 1;
}

h1 {
    color: rgb(239, 222, 249);
    font-family: 'Integral CF', sans-serif;
    font-size: 1.8rem;
    margin: 0;
    text-align: center;
}

.nickname {
    color: rgb(77, 16, 74);
    background: rgb(239, 222, 249);
    padding: 2px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin: 0;
    font-weight: bold;
}

.email {
    color: rgb(200, 180, 220);
    font-size: 0.85rem;
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
    box-sizing: border-box;
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

.toggle-edit-btn {
    width: 100%;
    padding: 10px;
    background: rgba(77, 16, 74, 0.3);
    color: rgb(239, 222, 249);
    border: 1px solid rgba(77, 16, 74, 0.6);
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s;
}

.toggle-edit-btn:hover {
    background: rgba(77, 16, 74, 0.6);
    transform: scale(1.02);
}

.edit-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
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

.edit-section input::placeholder {
    color: rgb(180, 160, 200);
}

.success {
    color: #7fff7f;
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
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
    transition: all 0.2s;
}

.save-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.02);
}

.actions {
    display: flex;
    gap: 10px;
    width: 100%;
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
    transition: all 0.2s;
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
    transition: all 0.2s;
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

    h1 {
        font-size: 1.4rem;
    }
}
</style>