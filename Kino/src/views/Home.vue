<template>
        <div class="search-container">
            <input v-model="search" @keyup.enter="handleSearch" placeholder="Поиск по названию" />
            <button @click="handleSearch" class="search-btn">🔍</button>
            <button v-if="search" @click="clearSearch" class="clear-btn">Очистить</button>
        </div>
    <div class="home">
        <h1>KinoScope</h1>
    </div>
</template>

<script setup>

<style scoped>
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding: 20px;
    width: 500px;
    height: 500px;
    background-color: rgba(49, 47, 47, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 15px;
}
.home h1 {
    color: hsl(205, 28%, 87%);
    font-size: 2.5em;
    text-align: center;
    font-family: 'Integral CF', sans-serif;
    font-size: 2.5rem;
}
@media (max-width: 768px) {
    .home {
        width: 90vw;
        height: auto;
        min-height: 200px;
        padding: 30px 16px;
    }
 
    .home h1 {
        font-size: 1.8rem;
    }
}
 
@media (max-width: 480px) {
    .home h1 {
        font-size: 1.4rem;
    }
}
</style>