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

<style scoped>
.auth {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding: 40px 30px;
    width: 75%;
    max-width: 500px;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(77, 16, 74, 0.3);
}
 
.auth h1 {
    color: rgb(77, 16, 74);
    font-size: 2rem;
    font-family: 'Integral CF', sans-serif;
    text-align: center;
    margin: 0 0 24px 0;
}
 
.auth form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
}
 
.auth input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid rgba(77, 16, 74, 0.5);
    border-radius: 8px;
    background-color: rgba(239, 222, 249, 0.6);
    color: rgb(77, 16, 74);
    font-size: 1rem;
    font-family: sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}
 
.auth input::placeholder {
    color: rgba(77, 16, 74, 0.5);
}
 
.auth input:focus {
    border-color: rgb(77, 16, 74);
    box-shadow: 0 0 0 3px rgba(77, 16, 74, 0.15);
}
 
.auth .error {
    color: rgb(180, 30, 30);
    font-size: 0.875rem;
    font-family: sans-serif;
    margin: 0;
    text-align: center;
}
 
.auth button[type="submit"] {
    padding: 10px 24px;
    background-color: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-family: sans-serif;
    margin-top: 6px;
    transition: background-color 0.2s, transform 0.2s;
}
 
.auth button[type="submit"]:hover {
    background-color: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.05);
}
 
@media (max-width: 768px) {
    .auth {
        width: 92%;
        padding: 24px 16px;
    }
 
    .auth h1 {
        font-size: 1.5rem;
        margin-bottom: 16px;
    }
 
    .auth button[type="submit"] {
        width: 100%;
        font-size: 0.95rem;
    }
}
 
@media (max-width: 480px) {
    .auth h1 {
        font-size: 1.3rem;
    }
 
    .auth input {
        font-size: 0.9rem;
        padding: 9px 12px;
    }
}
</style>
