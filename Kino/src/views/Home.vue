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
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import MovieDetails from '@/views/MovieDetails.vue'

const store = useStore()
const router = useRouter()
const search = ref('')

const movies = computed(() => store.state.movies)

const loading = computed(() => store.state.loading)

onMounted(() => {
    store.dispatch('loadMovies')
})

const handleSearch = () => {
    console.log('handleSearch called with search value:', search.value)
    if (search.value.trim()) {
        // Try name parameter again, but with more debugging
        const query = `name=${encodeURIComponent(search.value)}`
        console.log('Search query being dispatched:', query)
        store.dispatch('loadMovies', query)
    } else {
        console.log('Empty search, loading all movies')
        store.dispatch('loadMovies')
    }
}

const setGenre = (e) => {
    const genre = e.target.value
    if (genre) {
        const query = `genres.name=${encodeURIComponent(genre)}`
        console.log('Genre query:', query)
        store.dispatch('loadMovies', query)
    } else {
        store.dispatch('loadMovies')
    }
}

const loadMore = () => {
    store.dispatch('loadMoreMovies')
}

const clearSearch = () => {
    search.value = ''
    store.dispatch('loadMovies')
}
</script>

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
.search-container {
    display: flex;
    gap: 10px;
    align-items: center;
}

.search-container input {
    padding: 8px 12px;
    border: 1px solid rgb(77, 16, 74);
    border-radius: 8px;
    font-size: 16px;
    flex: 1;
}

.search-btn {
    padding: 8px 16px;
    color: rgb(239, 222, 249);
    background-color: rgb(77, 16, 74);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
}

.search-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}

.clear-btn {
    padding: 8px 16px;
    color: rgb(239, 222, 249);
    background: rgb(77, 16, 74);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}

.clear-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
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
    .search-container {
        flex-wrap: wrap;
    }
 
    .search-container input {
        width: 100%;
        flex: unset;
        font-size: 14px;
    }
 
    .search-btn,
    .clear-btn {
        font-size: 14px;
        padding: 8px 12px;
    }
}
 
@media (max-width: 480px) {
    .home h1 {
        font-size: 1.4rem;
    }
}
</style>