<template>
    <div class="cart">
        <h1>KINOSCOPE</h1>

        <div v-if="cart.length === 0" class="empty-cart">
            <p>Тут пока ничего нет :(</p>
        </div>

        <div v-else class="cart-items">
            <div class="cart-item" v-for="movie in cart" :key="movie.id" :movie="movie" @click="goToMovieDetails(movie)">
                <img :src="movie.image" alt="Movie Poster" />
                <h3>{{ movie.title }}</h3>
                <p>Жанр: {{ movie.genre }}</p>
                <p>Рейтинг: {{ movie.rating }}</p>

                <button class="clear-btn" @click.stop="removeFromCart(movie.id)">Удалить</button>
            </div>
        </div>
    </div>
    <div class="clearall-btn">
        <button @click="clearCart">Очистить</button>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import MovieDetails from '@/views/MovieDetails.vue'

const store = useStore()
const router = useRouter()
const cart = computed(() => store.state.cart)

const props = defineProps({
    movie: Object
})

const removeFromCart = (id) => {
    store.commit('removeFromCart', id)
}

const clearCart = () => {
    store.commit('clearCart')
}

const goToMovieDetails = (movie) => {
    if (movie && movie.id) {
        router.push(`/movie/${movie.id}`)
    }
}
</script>

<style scoped>
.cart {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    width: 75%;
    height: auto;
    min-height: 500px;
    background-color: rgba(239, 222, 249, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 15px;
}
.empty-cart {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0 auto;
    padding: 20px;
}
.cart h1 {
    color: rgb(77, 16, 74);
    font-size: 2.5em;
    text-align: center;
    font-family: 'Integral CF', sans-serif;
    font-size: 2.5rem;
}
.cart p {
    color: rgb(77, 16, 74);
    font-size: 1.2em;
    font-family: sans-serif;
}
.cart-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 0;
    padding: 10px;
    width: 100%;
    height: auto;
    border: none;
    border-radius: 10px;
}
.cart-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: auto;
    padding: 8px;
    border: 1px solid rgb(77, 16, 74);
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    cursor: pointer;
    transition: transform 0.2s;
}
.cart-item:hover {
    transform: scale(1.05);
}
.cart-item img {
    width: 150px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 10px;
}
.cart-item h3 {
    color: rgb(77, 16, 74);
    font-size: 1.5em;
    margin-bottom: 5px;
    text-align: center;
    word-break: break-word;
}
.cart-item p {
    color: rgb(77, 16, 74);
    margin: 2px 0;
    text-align: center;
}
.cart-item .clear-btn {
    padding: 8px 16px;
    background-color: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.2s;
}
.cart-item .clear-btn:hover {
    background-color: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}
.cart > .clear-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    padding: 0;
}
.cart > .clear-btn button {
    padding: 8px 16px;
    background-color: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.cart > .clear-btn button:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}
.clearall-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}
.clearall-btn button {
    background-color: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
}
.clearall-btn button:hover {
    background-color: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.1);
}
@media (max-width: 768px) {
    .cart {
        width: 95%;
        min-height: auto;
        padding: 12px;
        border-radius: 10px;
    }
 
    .cart h1 {
        font-size: 1.6rem;
    }
 
    .cart p {
        font-size: 1rem;
    }
 
    .cart-items {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 8px;
    }
 
    .cart-item img {
        width: 100%;
        height: auto;
    }
 
    .cart-item h3 {
        font-size: 1rem;
    }
 
    .cart-item p {
        font-size: 0.85rem;
    }
}
 
@media (max-width: 480px) {
    .cart-items {
        grid-template-columns: 1fr;
    }
 
    .cart-item h3 {
        font-size: 0.95rem;
    }
}
</style>