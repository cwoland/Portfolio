<template>
    <div class="store">
        <header class="store-header">
            <h1>KINOSCOPE</h1>
            <div class="search-container">
                <input v-model="search" @keyup.enter="handleSearch" placeholder="Поиск" />
                <button @click="handleSearch" class="search-btn">🔍</button>
                <button v-if="search" @click="clearSearch" class="clear-btn">Очистить</button>
            </div>
        </header>

        <div class="filters-row">
            <select @change="setGenre" class="genre-select">
                <option value="">Все жанры</option>
                <option value="боевик">Боевик</option>
                <option value="комедия">Комедия</option>
                <option value="драма">Драма</option>
                <option value="ужасы">Ужасы</option>
                <option value="фантастика">Научная фантастика</option>
                <option value="триллер">Триллер</option>
                <option value="мелодрама">Мелодрама</option>
                <option value="криминал">Криминал</option>
                <option value="детектив">Детектив</option>
                <option value="приключения">Приключения</option>
                <option value="фэнтези">Фэнтези</option>
                <option value="биография">Биография</option>
                <option value="история">История</option>
                <option value="военный">Военный</option>
                <option value="семейный">Семейный</option>
                <option value="аниме">Аниме</option>
                <option value="мультфильм">Мультфильм</option>
            </select>

            <div class="year-filter">
                <label>{{ yearFrom }} — {{ yearTo }}</label>
                <div class="year-sliders">
                    <input 
                        type="range" 
                        v-model="yearFrom" 
                        :min="1900" 
                        :max="yearTo" 
                        @change="applyFilters"
                        class="year-slider"
                    />
                </div>
            </div>
        </div>
        <div class="type-tabs">
            <button
                v-for="tab in types"
                :key="tab.value"
                :class="['type-tab', { active: selectedType === tab.value }]"
                @click="setType(tab.value)"
            >
                {{ tab.label }}
            </button>
        </div>

        <div class="movies">
            <div v-if="loading" class="movies-grid">
                <SkeletonCard v-for="n in 10" :key="n" />
            </div>
            <div v-else class="movies-grid">
                <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
            </div>
        </div>
        <button v-if="!loading && movies.length > 0" @click="loadMore" class="load-more-btn">
            Загрузить еще
        </button>
    </div>
</template>

<style scoped>
.store {
    padding: 16px;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
}

.movies {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}

.movies-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    padding: 16px;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    border: 1px solid rgba(77, 16, 74, 0.4);
    width: 100%;
    box-sizing: border-box;
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
    background: linear-gradient(135deg, rgb(77, 16, 74), rgb(239, 222, 249), rgb(77, 16, 74));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 15px rgba(239, 222, 249, 0.3));
    font-size: 2.5em;
    text-align: center;
    font-family: 'Integral CF', sans-serif;
    font-size: 2.5rem;
}
.filters-row {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 4px;
    margin-bottom: 8px;
}

.year-filter {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
}

.year-filter label {
    color: rgb(239, 222, 249);
    font-size: 0.85rem;
    text-align: center;
    background: rgba(77, 16, 74, 0.3);
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
}

.year-sliders {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
}

.year-slider {
    width: 100%;
    accent-color: rgb(77, 16, 74);
    cursor: pointer;
}

.type-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;
}

.type-tab {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(77, 16, 74, 0.4);
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
}

.type-tab:hover {
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
}

.type-tab.active {
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border-color: rgb(77, 16, 74);
    font-weight: bold;
}

@media (max-width: 768px) {
    .store {
        padding: 10px;
        padding-bottom: 100px;
    }

    .filters-row {
        flex-direction: column;
        gap: 10px;
    }

    .year-filter {
        width: 100%;
    }

    .movies-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 10px;
    }

    .type-tabs {
        justify-content: center;
        flex-wrap: wrap;
    }
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
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import SkeletonCard from '@/components/UI/SkeletonCard.vue'

const store = useStore()
const router = useRouter()
const search = ref('')
const selectedGenre = ref('')
const selectedType = ref('')
const yearFrom = ref(1900)
const yearTo = ref(2025)

const types = [
    { label: '🎬 Все', value: '' },
    { label: '🎥 Фильмы', value: 'movie' },
    { label: '📺 Сериалы', value: 'tv-series' },
    { label: '🎠 Мультфильмы', value: 'cartoon' },
    { label: '⛩ Аниме', value: 'anime' },
]

const movies = computed(() => store.state.movies)
const loading = computed(() => store.state.loading)

onMounted(async () => {
    if (store.state.movies.length === 0) {
    await store.dispatch('loadMovies')
    }
})

const buildQuery = () => {
    const parts = []
    if (selectedGenre.value) {
        parts.push(`genres.name=${encodeURIComponent(selectedGenre.value)}`)
    }
    if (selectedType.value) {
        parts.push(`type=${selectedType.value}`)
    }
    parts.push(`year=${yearFrom.value}-${yearTo.value}`)
    return parts.join('&')
}

const applyFilters = () => {
    const query = buildQuery()
    store.dispatch('loadMovies', query)
}

const setGenre = (e) => {
    selectedGenre.value = e.target.value
    applyFilters()
}

const setType = (type) => {
    selectedType.value = type
    applyFilters()
}

const handleSearch = () => {
    if (search.value.trim()) {
        const query = `name=${encodeURIComponent(search.value)}`
        store.dispatch('loadMovies', query)
    } else {
        applyFilters()
    }
}

const loadMore = () => {
    store.dispatch('loadMoreMovies')
}

const clearSearch = () => {
    search.value = ''
    applyFilters()
}
</script>