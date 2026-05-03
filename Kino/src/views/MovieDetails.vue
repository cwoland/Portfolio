<template>
  <div class="movie-details">
    <div v-if="loading" class="skeleton-details">
    <div class="skeleton-header">
        <div class="skeleton-block back-skeleton"></div>
        <div class="skeleton-block title-skeleton"></div>
    </div>
    <div class="skeleton-content">
        <div class="skeleton-block poster-skeleton"></div>
        <div class="skeleton-info">
            <div class="skeleton-block line-skeleton"></div>
            <div class="skeleton-block line-skeleton short"></div>
            <div class="skeleton-block line-skeleton"></div>
            <div class="skeleton-block line-skeleton short"></div>
            <div class="skeleton-block desc-skeleton"></div>
            <div class="skeleton-block btn-skeleton"></div>
        </div>
    </div>
</div>
    <div v-else-if="movie">
      <div class="movie-header">
        <button @click="goBack" class="back-btn">←</button>
        <h1>{{ movie.title }}</h1>
      </div>

      <div class="movie-content">
        <div class="movie-poster">
          <img v-if="movie.image" :src="movie.image" :alt="movie.title" />
          <div v-else class="no-image">Нет изображения</div>
        </div>

        <div class="movie-info">
          <p><strong>Год:</strong> {{ movie.year }}</p>
          <p><strong>Жанры:</strong> {{ movie.genres }}</p>
          <p><strong>Рейтинг:</strong> {{ movie.rating }}</p>
          <p v-if="movie.description"><strong>Описание:</strong> {{ movie.description }}</p>

          <button @click="addToCart" class="add-to-cart-btn">Добавить в корзину</button>
        </div>
      </div>
    </div>
    <div v-else class="error">Фильм не найден</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { fetchMovieById } from '@/services/api.js'
import { useToast } from '@/services/useToast.js'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { show } = useToast()

const movie = ref(null)
const loading = ref(true)

const fetchMovie = async () => {
  const movieId = route.params.id
  if (movieId) {
    movie.value = await fetchMovieById(movieId)
  }
  loading.value = false
}

const goBack = () => {
  router.go(-1)
}

const addToCart = () => {
  if (movie.value) {
    store.commit('addToCart', movie.value)
    show('Фильм добавлен!', 'success')
  }
}

onMounted(() => {
  fetchMovie()
})
</script>

<style scoped>
.movie-details {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 30px;
    width: 75%;
    max-width: 1200px;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(77, 16, 74, 0.3);
}

.loading,
.error {
    text-align: center;
    font-size: 1.2rem;
    font-family: sans-serif;
    margin: 50px 0;
    color: rgb(77, 16, 74);
}

.error {
    font-style: italic;
    opacity: 0.7;
}

.movie-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.movie-header h1 {
    color: rgb(77, 16, 74);
    font-family: sans-serif;
    font-size: 1.8rem;
    margin: 0;
}

.back-btn {
    padding: 10px 16px;
    background-color: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    flex-shrink: 0;
    transition: background-color 0.2s, transform 0.2s;
}

.back-btn:hover {
    background-color: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.05);
}

.movie-content {
    display: flex;
    gap: 30px;
    margin: 0 auto;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 15px;
}

.movie-poster img {
    max-width: 300px;
    height: auto;
    border-radius: 10px;
    border: 1px solid rgba(77, 16, 74, 0.3);
    display: block;
}

.no-image {
    width: 300px;
    height: 450px;
    background-color: rgba(77, 16, 74, 0.1);
    border: 1px solid rgba(77, 16, 74, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: rgba(77, 16, 74, 0.6);
    font-family: sans-serif;
    font-style: italic;
}

.movie-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.movie-info p {
    color: rgb(77, 16, 74);
    font-family: sans-serif;
    font-size: 1rem;
    margin: 12px 0;
    line-height: 1.6;
}

.movie-info strong {
    font-weight: bold;
}

.add-to-cart-btn {
    margin-top: auto;
    padding: 12px 20px;
    background-color: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-family: sans-serif;
    transition: background-color 0.2s, transform 0.2s;
    align-self: flex-start;
}

.add-to-cart-btn:hover {
    background-color: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.05);
}

.skeleton-block {
    background: linear-gradient(
        90deg,
        rgba(77, 16, 74, 0.2) 25%,
        rgba(239, 222, 249, 0.15) 50%,
        rgba(77, 16, 74, 0.2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
}

@keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.skeleton-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.skeleton-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
}

.back-skeleton {
    width: 48px;
    height: 40px;
    flex-shrink: 0;
}

.title-skeleton {
    height: 36px;
    width: 60%;
}

.skeleton-content {
    display: flex;
    gap: 30px;
}

.poster-skeleton {
    width: 300px;
    min-width: 300px;
    height: 450px;
    border-radius: 10px;
}

.skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.line-skeleton {
    height: 20px;
    width: 100%;
}

.line-skeleton.short {
    width: 55%;
}

.desc-skeleton {
    height: 120px;
    width: 100%;
    border-radius: 8px;
}

.btn-skeleton {
    height: 44px;
    width: 180px;
    margin-top: auto;
    border-radius: 8px;
}

@media (max-width: 768px) {
    .movie-details {
        width: 92%;
        padding: 16px;
        border-radius: 10px;
    }

    .movie-header {
        flex-direction: row;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }

    .movie-header h1 {
        font-size: 1.2rem;
    }

    .movie-content {
        flex-direction: column;
        gap: 16px;
    }

    .movie-poster img,
    .no-image {
        max-width: 100%;
        width: 100%;
    }

    .no-image {
        height: 220px;
    }

    .movie-info p {
        font-size: 0.95rem;
        margin: 8px 0;
    }

    .add-to-cart-btn {
        width: 100%;
        align-self: stretch;
        font-size: 0.95rem;
    }
    .skeleton-content {
        flex-direction: column;
    }

    .poster-skeleton {
        width: 100%;
        min-width: unset;
        height: 300px;
    }

    .title-skeleton {
        width: 80%;
    }
}

@media (max-width: 480px) {
    .movie-header h1 {
        font-size: 1rem;
    }

    .back-btn {
        padding: 8px 12px;
        font-size: 0.9rem;
    }
}
</style>