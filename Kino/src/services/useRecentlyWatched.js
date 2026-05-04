const MAX_ITEMS = 10

export const useRecentlyWatched = () => {
    const getRecent = () => {
        return JSON.parse(localStorage.getItem('recentlyWatched') || '[]')
    }

    const addRecent = (movie) => {
        let recent = getRecent()

        recent = recent.filter(m => m.id !== movie.id)
        recent.unshift({
            id: movie.id,
            title: movie.title || movie.name,
            image: movie.image || movie.poster?.url,
            rating: movie.rating,
            year: movie.year
        })
        recent = recent.slice(0, MAX_ITEMS)
        localStorage.setItem('recentlyWatched', JSON.stringify(recent))
    }

    const clearRecent = () => {
        localStorage.removeItem('recentlyWatched')
    }

    return {
        getRecent,
        addRecent,
        clearRecent
    }
}