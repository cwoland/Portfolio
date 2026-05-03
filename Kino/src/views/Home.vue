<template>
        <div class="search-container">
            <input v-model="search" @keyup.enter="handleSearch" placeholder="Поиск по названию" />
            <button @click="handleSearch" class="search-btn">🔍</button>
            <button v-if="search" @click="clearSearch" class="clear-btn">Очистить</button>
        </div>
    <div class="home">
        <h1>KinoScope</h1>
        <div v-if="loading" class="loading">Загрузка...</div>
        <div class="movies-grid">
            <MovieCard 
                v-for="movie in movies" 
                :key="movie.id" 
                :movie="movie" 
            />
        </div>
        <div v-if="dailyMovie" class="daily-movie">
            <h2>Фильм дня</h2>
            <div class="daily-movie-card">
                <img :src="dailyMovie.poster?.url" :alt="dailyMovie.name" class="daily-movie-poster" />
                <div class="daily-movie-info">
                    <h3>{{ dailyMovie.name }}</h3>
                    <p>Год: {{ dailyMovie.year }}</p>
                    <p>Рейтинг: {{ dailyMovie.rating?.kp?.toFixed(1) }}</p>
                    <p>{{ dailyMovie.description?.slice(0, 200) }}...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import MovieCard from '@/components/MovieCard.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import { fetchRandomMovie } from '@/services/api'

const store = useStore()
const search = ref('')
const dailyMovie = ref(null)

const movies = computed(() => store.state.movies)

const loading = computed(() => store.state.loading)

onMounted(async ()=> {
    const today = new Date().toDateString()
    const saved = localStorage.getItem('dailyMovie')
    const savedDate = localStorage.getItem('dailyMovieDate')

    if (saved && savedDate === today) {
        dailyMovie.value = JSON.parse(saved)
    } else {
        const movie = await fetchRandomMovie()
        dailyMovie.value = movie
        localStorage.setItem('dailyMovie', JSON.stringify(movie))
        localStorage.setItem('dailyMovieDate', today)
    }
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
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.2rem;
    color: #888;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}
.daily-movie {
    margin: 20px auto;
    max-width: 800px;
    background: rgba(49, 47, 47, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 20px;
    border: 1px solid rgba(77, 16, 74, 0.4);
}

.daily-movie h2 {
    color: rgb(239, 222, 249);
    font-family: 'Integral CF', sans-serif;
    margin-bottom: 15px;
    text-align: center;
}

.daily-movie-card {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.daily-movie-card img {
    width: 150px;
    border-radius: 10px;
    object-fit: cover;
}

.daily-movie-info h3 {
    color: rgb(239, 222, 249);
    font-size: 1.4rem;
    margin-bottom: 8px;
}

.daily-movie-info p {
    color: rgb(200, 180, 220);
    margin: 4px 0;
    font-size: 0.95rem;
}

.description {
    margin-top: 10px !important;
    line-height: 1.5;
    opacity: 0.85;
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
        .daily-movie-card {
        flex-direction: column;
        align-items: center;
    }

    .daily-movie-card img {
        width: 100%;
        max-width: 250px;
    }
}
 
@media (max-width: 480px) {
    .home h1 {
        font-size: 1.4rem;
    }
}
</style>