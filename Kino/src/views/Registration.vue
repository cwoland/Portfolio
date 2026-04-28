<template>
    <div class="auth">
        <h1>Регистрация</h1>

        <form @submit.prevent="handleSubmit">
            <input v-model="name" type="text" placeholder="Введите имя" required>
            <input v-model="email" type="email" placeholder="Введите E-mail" required>
            <input v-model="password" type="password" placeholder="Введите пароль" required>

            <p v-if="error" class="error">{{ error }}</p>
            <button type="submit">Зарегистрироваться</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();
const store = useStore();

const validate = () => {
    if (!email.value || !password.value || !name.value) {
        error.value = 'Пожалуйста, заполните все поля';
        return false;
    }

    if (!email.value.includes('@')) {
        error.value = 'Некорректный E-mail';
        return false;
    }

    if (password.value.length < 8) {
        error.value = 'Пароль должен быть не менее 8 символов';
        return false;  
    }

    return true;
}

const handleSubmit = () => {
    error.value = '';

    const validationError = validate()
    if (validationError) {
        error.value = validationError;
        return;
    }

    const user = {
        name: name.value,
        email: email.value,
        password: password.value
    }

    localStorage.setItem('user', JSON.stringify(user));
    store.commit('setUser', user);
    router.push('/User')
}
</script>
