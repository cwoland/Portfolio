<template>
    <div class="cart-page">
        <div class="cart">
            <h1>KINOSCOPE</h1>

            <div v-if="cart.length === 0" class="empty-cart">
                <p>🎬 Тут пока ничего нет</p>
                <router-link to="/Store" class="browse-btn">Перейти в библиотеку</router-link>
            </div>

            <div v-else>
                <div class="cart-items">
                    <div
                        class="cart-item"
                        v-for="movie in cart"
                        :key="movie.id"
                        @click="goToMovieDetails(movie)"
                    >
                        <img :src="movie.image" alt="Movie Poster" />
                        <div class="cart-item-info">
                            <h3>{{ movie.title }}</h3>
                            <p>⭐ {{ movie.rating }}</p>
                            <p>🎭 {{ movie.genres }}</p>
                        </div>
                        <button class="remove-btn" @click.stop="removeFromCart(movie.id)">✕</button>
                    </div>
                </div>
                <button @click="clearCart" class="clearall-btn">🗑 Очистить всё</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const cart = computed(() => store.state.cart)

const removeFromCart = (id) => {
    store.commit('removeFromCart', id)
}

const clearCart = () => {
    store.commit('clearCart')
}

const goToMovieDetails = (movie) => {
    if (movie?.id) {
        router.push(`/movie/${movie.id}`)
    }
}
</script>

<style scoped>
.cart-page {
    display: flex;
    justify-content: center;
    padding: 30px 20px 100px;
    min-height: 100vh;
}

.cart {
    width: 100%;
    max-width: 1000px;
    background: rgba(49, 47, 47, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(77, 16, 74, 0.4);
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.cart h1 {
    color: rgb(239, 222, 249);
    font-size: 2rem;
    font-family: 'Integral CF', sans-serif;
    margin: 0;
}

/* Empty state */
.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 20px;
}

.empty-cart p {
    color: rgb(200, 180, 220);
    font-size: 1.2rem;
}

.browse-btn {
    padding: 10px 24px;
    background: rgb(77, 16, 74);
    color: rgb(239, 222, 249);
    border-radius: 20px;
    text-decoration: none;
    font-size: 0.95rem;
    transition: all 0.2s;
}

.browse-btn:hover {
    background: rgb(239, 222, 249);
    color: rgb(77, 16, 74);
    transform: scale(1.05);
}

/* Cart items grid */
.cart-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 100%;
}

.cart-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(77, 16, 74, 0.15);
    border: 1px solid rgba(77, 16, 74, 0.4);
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
    position: relative;
}

.cart-item:hover {
    transform: scale(1.03);
    border-color: rgb(77, 16, 74);
}

.cart-item img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
}

.cart-item-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.cart-item-info h3 {
    color: rgb(239, 222, 249);
    font-size: 0.95rem;
    text-align: center;
    word-break: break-word;
    margin: 0;
}

.cart-item-info p {
    color: rgb(200, 180, 220);
    font-size: 0.8rem;
    text-align: center;
    margin: 0;
}

.remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(150, 20, 20, 0.7);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    cursor: pointer;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.remove-btn:hover {
    background: rgb(200, 30, 30);
    transform: scale(1.1);
}

.clearall-btn {
    padding: 10px 24px;
    background: rgba(150, 20, 20, 0.6);
    color: rgb(239, 222, 249);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s;
    margin-top: 8px;
}

.clearall-btn:hover {
    background: rgb(200, 30, 30);
    transform: scale(1.02);
}

@media (max-width: 768px) {
    .cart-page {
        padding: 16px 12px 100px;
    }

    .cart {
        padding: 16px;
    }

    .cart h1 {
        font-size: 1.5rem;
    }

    .cart-items {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
}

@media (max-width: 480px) {
    .cart-items {
        grid-template-columns: 1fr;
    }
}
</style>