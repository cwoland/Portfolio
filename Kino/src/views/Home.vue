<template>
    <div class="home-page">
        <div class="title-wrapper">
        <h1 class="site-title">KINOSCOPE</h1>
        </div>

        <div class="search-container">
            <input v-model="search" @keyup.enter="handleSearch" placeholder="Поиск" />
            <button @click="handleSearch" class="search-btn">🔍</button>
            <button v-if="search" @click="clearSearch" class="clear-btn">Очистить</button>
        </div>

        <div v-if="movies.length > 0" class="movies-section">
            <div v-if="loading" class="movies-grid">
             <SkeletonCard v-for="n in 10" :key="n" />
            </div>
            <div v-else class="movies-grid">
             <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
            </div>
        </div>

        <div v-if="featuredMovies.length > 0" class="carousel-wrapper">
    <h2 class="carousel-title">🔥 Популярное</h2>
    <div class="carousel-track">
        <div class="carousel-inner">
            <div
                v-for="(movie, index) in featuredMovies"
                :key="index"
                class="carousel-card"
                @click="goToMovie(movie.id)"
            >
                <img :src="movie.poster?.url" :alt="movie.name" />
                <div class="carousel-info">
                    <p class="carousel-title-text">{{ movie.name }}</p>
                    <p class="carousel-rating">⭐ {{ movie.rating?.kp?.toFixed(1) }}</p>
                </div>
            </div>
        </div>
    </div>
</div>

        <div v-if="dailyMovie" class="daily-movie" @click="goToMovie(dailyMovie.id)">
            <h2>🎬 Фильм дня</h2>
            <div class="daily-movie-card">
                <img :src="dailyMovie.poster?.url" :alt="dailyMovie.name" />
                <div class="daily-movie-info">
                    <h3>{{ dailyMovie.name }}</h3>
                    <p v-if="dailyMovie.alternativeName" class="alt-name">{{ dailyMovie.alternativeName }}</p>
                    <p>📅 {{ dailyMovie.year }}</p>
                    <p>⭐ {{ dailyMovie.rating?.kp?.toFixed(1) }}</p>
                    <p>🎭 {{ dailyMovie.genres?.map(g => g.name).join(', ') }}</p>
                    <p class="description">{{ dailyMovie.description?.slice(0, 250) }}...</p>
                    <span class="details-hint">Нажмите для подробностей →</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import { fetchRandomMovie, fetchFeaturedMovies } from '@/services/api'
import SkeletonCard from '@/components/UI/SkeletonCard.vue'

const store = useStore()
const router = useRouter()
const search = ref('')
const dailyMovie = ref(null)
const featuredMovies = ref([])

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
    const featured = await fetchFeaturedMovies()
    featuredMovies.value = [...featured, ...featured]
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
const goToMovie = (id) => {
    router.push(`/movie/${id}`)
}
</script>

<style scoped>
body {
    margin-bottom: 100px;
}

.home-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 40px 20px;
    min-height: 100vh;
}

.title-wrapper {
    backdrop-filter: blur(10px);
    background: rgba(49, 47, 47, 0.15);
    border-radius: 15px;
    padding: 10px 30px;
    border: 1px solid rgba(239, 222, 249, 0.1);
}

.site-title {
    font-family: 'Integral CF', sans-serif;
    font-size: 3.5rem;
    margin: 0;
    text-align: center;
    letter-spacing: 2px;
    background: linear-gradient(135deg, rgb(77, 16, 74), rgb(239, 222, 249), rgb(77, 16, 74));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 15px rgba(239, 222, 249, 0.3));
}

.search-container {
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
    max-width: 600px;
}

.search-container input {
    padding: 10px 14px;
    border: 1px solid rgb(77, 16, 74);
    border-radius: 8px;
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    font-size: 16px;
    flex: 1;
}

.search-container input::placeholder {
    color: rgb(239, 222, 249);
}

.search-btn {
    padding: 10px 18px;
    color: rgb(239, 222, 249);
    background-color: rgb(77, 16, 74);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
}

.search-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}

.clear-btn {
    padding: 10px 16px;
    color: rgb(239, 222, 249);
    background: rgb(77, 16, 74);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}

.movies-section {
    width: 100%;
    max-width: 1200px;
}

.movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
    margin-top: 10px;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 1.2rem;
    color: rgb(200, 180, 220);
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}

.carousel-wrapper {
    width: 100%;
    max-width: 900px;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    border: 1px solid rgba(77, 16, 74, 0.4);
}

.carousel-title {
    color: rgb(77, 16, 74);
    font-family: 'Integral CF', sans-serif;
    font-size: 1.2rem;
    margin-bottom: 12px;
    text-align: center;
}

.carousel-track {
    overflow: hidden;
    border-radius: 15px;
    border: 1px solid rgba(77, 16, 74, 0.4);
    background: rgba(49, 47, 47, 0.2);
    backdrop-filter: blur(10px);
    padding: 16px 0;
}

.carousel-inner {
    display: flex;
    gap: 16px;
    padding: 0 16px;
    animation: marquee 20s linear infinite;
    width: max-content;
}

.carousel-inner:hover {
    animation-play-state: paused;
}

.carousel-card {
    width: 140px;
    min-width: 140px;
    cursor: pointer;
    transition: transform 0.2s;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(77, 16, 74, 0.2);
    border: 1px solid rgba(77, 16, 74, 0.3);
}

.carousel-card:hover {
    transform: scale(1.05);
}

.carousel-card img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
}

.carousel-info {
    padding: 8px;
}

.carousel-title-text {
    color: rgb(239, 222, 249);
    font-size: 0.75rem;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.carousel-rating {
    color: rgb(200, 180, 220);
    font-size: 0.75rem;
    margin: 4px 0 0;
}

@keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

.daily-movie {
    width: 100%;
    max-width: 800px;
    background: rgba(49, 47, 47, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 24px;
    border: 1px solid rgba(77, 16, 74, 0.4);
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
}

.daily-movie:hover {
    transform: scale(1.01);
    border-color: rgb(77, 16, 74);
}

.daily-movie h2 {
    color: rgb(239, 222, 249);
    font-family: sans-serif;
    margin-bottom: 16px;
    text-align: center;
    font-size: 1.4rem;
}

.daily-movie-card {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.daily-movie-card img {
    width: 150px;
    min-width: 150px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 4px 15px rgba(77, 16, 74, 0.4);
}

.daily-movie-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.daily-movie-info h3 {
    color: rgb(239, 222, 249);
    font-size: 1.4rem;
    margin: 0;
    font-family: sans-serif;
}

.alt-name {
    color: rgb(180, 160, 200);
    font-size: 0.9rem;
    font-style: italic;
}

.daily-movie-info p {
    color: rgb(200, 180, 220);
    margin: 0;
    font-size: 0.95rem;
}

.description {
    line-height: 1.6;
    opacity: 0.85;
    margin-top: 6px !important;
}

.details-hint {
    margin-top: 10px;
    color: rgb(77, 16, 74);
    font-size: 0.9rem;
    font-weight: bold;
    background: rgb(239, 222, 249);
    padding: 6px 14px;
    border-radius: 20px;
    display: inline-block;
    transition: all 0.2s;
}

.daily-movie:hover .details-hint {
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
}

@media (max-width: 768px) {
    .site-title {
        font-size: 2.5rem;
    }

    .daily-movie-card {
        flex-direction: column;
        align-items: center;
    }

    .daily-movie-card img {
        width: 100%;
        max-width: 250px;
        min-width: unset;
    }

    .daily-movie-info h3 {
        font-size: 1.2rem;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .site-title {
        font-size: 1.8rem;
    }
}
</style>