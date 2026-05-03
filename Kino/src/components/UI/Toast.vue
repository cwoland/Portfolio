<template>
    <Teleport to="body">
        <TransitionGroup name="toast" tag="div" class="toast-container">
            <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
                <span class="toast-icon">{{ icons[toast.type] }}</span>
                <span class="toast-message">{{ toast.message }}</span>
                </div>
        </TransitionGroup>
    </Teleport>
</template>

<script setup>
import { useToast } from '@/services/useToast.js'
const { toasts } = useToast()

const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
}
</script>
<style scoped>
.toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
}

.toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    font-size: 0.95rem;
    min-width: 220px;
    max-width: 320px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.toast.success {
    background: rgba(77, 16, 74, 0.85);
    color: rgb(239, 222, 249);
    border: 1px solid rgba(239, 222, 249, 0.2);
}

.toast.error {
    background: rgba(150, 20, 20, 0.85);
    color: rgb(239, 222, 249);
    border: 1px solid rgba(255, 100, 100, 0.2);
}

.toast.info {
    background: rgba(30, 60, 100, 0.85);
    color: rgb(239, 222, 249);
    border: 1px solid rgba(100, 160, 255, 0.2);
}

.toast-icon {
    font-size: 1.1rem;
    font-weight: bold;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(60px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(60px);
}
</style>