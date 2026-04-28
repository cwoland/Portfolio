<template>
    <div v-if="props.movie" class="movie-card" @click="goToMovieDetails">
        <div v-if="props.movie.image" class="movie-poster-container">
            <img :src="props.movie.image" alt="Poster" class="movie-poster" @error="imageError" />
        </div>
        <div v-else class="movie-poster" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; min-height: 200px;">{{ props.movie.title }}</div>
        <h2>{{ props.movie.title }}</h2>
        <p>Year: {{ props.movie.year }} | Rating: {{ props.movie.rating }}</p>
        <button @click.stop="addToCart" class="add-to-cart-btn" :disabled="isAdded">{{ buttonLabel }}</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const props = defineProps({
    movie: Object
})

const buttonLabel = ref('Добавить')
const isAdded = ref(false)

const addToCart = () => {
    if (!props.movie || isAdded.value) {
        return
    }

    store.commit('addToCart', props.movie)
    isAdded.value = true
    buttonLabel.value = 'Добавлено'
    console.log('Added to cart:', props.movie.title)
}

const goToMovieDetails = () => {
    if (props.movie && props.movie.id) {
        router.push(`/movie/${props.movie.id}`)
    }
}

const imageError = () => {
    console.warn('Failed to load image for:', props.movie.title)
}
</script>

<style scoped>
.movie-card {
    background-color: rgb(239, 222, 249, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
    cursor: pointer;
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.movie-poster-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    margin-bottom: 8px;
    overflow: hidden;
    border-radius: 8px;
}

.movie-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.movie-card h2 {
    font-size: 1.2rem;
    font-family: sans-serif;
    font-weight: lighter;
    margin: 4px 0 2px 0;
    color: rgb(77, 16, 74);
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.1;
}

.movie-card p {
    font-size: 0.75rem;
    color: rgb(77, 16, 74);
    margin: 2px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}

.add-to-cart-btn {
    color: rgb(239, 222, 249);
    background-color: rgb(77, 16, 74);
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    margin-top: auto;
    width: 100%;
    font-weight: lighter;
    transition: background 0.3s ease, transform 0.3s ease;
}

.add-to-cart-btn:hover {
    background-color: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}
.add-to-cart-btn:disabled {
    background: #999;
    cursor: default;
    transform: none;
    opacity: 0.7;
}
.add-to-cart-btn.clicked {
    background: hsl(175, 21%, 50%);
    transform: scale(0.95);
}
</style>