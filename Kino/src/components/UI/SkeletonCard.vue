<template>
    <div class="skeleton-card">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line long"></div>
    </div>
</template>

<style scoped>
.skeleton-card {
    border-radius: 10px;
    overflow: hidden;
    background: rgba(49, 47, 47, 0.3);
    border: 1px solid rgba(77, 16, 74, 0.2);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton-poster {
    width: 100%;
    aspect-ratio: 2/3;
    border-radius: 8px;
    background: linear-gradient(90deg,
    rgba(77, 16, 74, 0.2) 25%,
    rgba(239, 222, 249, 0.1) 50%,
    rgba(77, 16, 74, 0.2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
.skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg,
    rgba(77, 16, 74, 0.2) 25%,
    rgba(239, 222, 249, 0.1) 50%,
    rgba(77, 16, 74, 0.2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
.skeleton-line.short {width: 50%;}
.skeleton-line.long {width: 80%;}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>