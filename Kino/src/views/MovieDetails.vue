<template>
  <div class="movie-details">
    <div v-if="loading" class="loading">Загрузка...</div>
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

const route = useRoute()
const router = useRouter()
const store = useStore()

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
    alert('Фильм добавлен в корзину!')
  }
}

onMounted(() => {
  fetchMovie()
})
</script>

<style scoped>
.movie-details {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin: 50px 0;
}

.error {
  text-align: center;
  font-size: 1.2rem;
  color: red;
  margin: 50px 0;
}

.movie-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  padding: 10px 15px;
  color: hsl(0, 0%, 23%);
  background-color: hsl(208, 50%, 76%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.back-btn:hover {
  background: #0056b3;
}

.movie-content {
  display: flex;
  gap: 30px;
}

.movie-poster img {
  max-width: 300px;
  height: auto;
  border-radius: 10px;
}

.no-image {
  width: 300px;
  height: 450px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #666;
}

.movie-info {
  flex: 1;
}

.movie-info p {
  margin: 15px 0;
  line-height: 1.6;
}

.add-to-cart-btn {
  padding: 12px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
}

.add-to-cart-btn:hover {
  background: #218838;
}

@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
  }

  .movie-poster img,
  .no-image {
    max-width: 100%;
    width: 100%;
  }
}
@media (max-width: 768px) {
    .movie-details {
        padding: 12px;
    }
 
    .movie-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 16px;
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
        margin: 10px 0;
    }
 
    .add-to-cart-btn {
        width: 100%;
        font-size: 0.95rem;
    }
}
</style>