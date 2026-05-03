<template>
    <div class="store">
        <header class="store-header">
        <h1>KinoScope</h1>
        <div class="search-container">
            <input v-model="search" @keyup.enter="handleSearch" placeholder="Поиск по названию" />
            <button @click="handleSearch" class="search-btn">🔍</button>
            <button v-if="search" @click="clearSearch" class="clear-btn">Очистить</button>
        </div>
        </header>

        <select @change="setGenre" class="genre-select">
            <option class="genre-option" value="">Все жанры</option>
            <option class="genre-option" value="боевик">Боевик</option>
            <option class="genre-option" value="комедия">Комедия</option>
            <option class="genre-option" value="драма">Драма</option>
            <option class="genre-option" value="ужасы">Ужасы</option>
            <option class="genre-option" value="фантастика">Научная фантастика</option>
            <option class="genre-option" value="триллер">Триллер</option>
            <option class="genre-option" value="мелодрама">Мелодрама</option>
            <option class="genre-option" value="криминал">Криминал</option>
            <option class="genre-option" value="детектив">Детектив</option>
            <option class="genre-option" value="приключения">Приключения</option>
            <option class="genre-option" value="фэнтези">Фэнтези</option>
            <option class="genre-option" value="биография">Биография</option>
            <option class="genre-option" value="история">История</option>
            <option class="genre-option" value="военный">Военный</option>
            <option class="genre-option" value="семейный">Семейный</option>
            <option class="genre-option" value="аниме">Аниме</option>
            <option class="genre-option" value="мультфильм">Мультфильм</option>
        </select>
        
        <div class="movies">
            <div v-if="loading" class="loading">Загрузка...</div>
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" class="movie" />
        </div>
            <button v-if="!loading && movies.length > 0" @click="loadMore" class="load-more-btn">Загрузить еще</button>
    </div>
</template>

<style scoped>
.movies {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 25px;
    margin-top: 20px;
    padding: 20px;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    border: 1px solid rgba(77, 16, 74, 0.4);
}

.movie {
    width: 100%;
}

.movie img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
}

@media (max-width: 1920px) {
    .movies {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (max-width: 1440px) {
    .movies {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1024px) {
    .movies {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .movies {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .movies {
        grid-template-columns: 1fr;
    }
}

.load-more-btn {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    color: rgb(239, 222, 249);
    background-color: rgb(77, 16, 74);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
}

.load-more-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}

.load-more-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
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
.genre-select {
    padding: 8px 12px;
    color: rgb(239, 222, 249);
    background: rgb(77, 16, 74);
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    margin-top: 20px;
}
.genre-select:hover {
    border-color: rgb(77, 16, 74);
}
.genre-select:focus {
    outline: none;
    border-color: rgb(77, 16, 74);
}
.genre-option {
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    padding: 8px 12px;
}
.genre-option:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
}
.store-header h1 {
    color: rgb(77, 16, 74);
    font-size: 2.5em;
    text-align: center;
    font-family: 'Integral CF', sans-serif;
    font-size: 2.5rem;
}
@media (max-width: 768px) {
    .store-header h1 {
        font-size: 1.6rem;
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
 
    .genre-select {
        width: 100%;
        font-size: 14px;
        margin-top: 10px;
    }
 
    .load-more-btn {
        width: 90%;
        font-size: 14px;
        padding: 10px;
    }
}
 
@media (max-width: 480px) {
    .search-btn,
    .clear-btn {
        width: auto;
    }
}
</style>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'

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