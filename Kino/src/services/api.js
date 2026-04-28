const api_url = '/api/v1.4'
const api_token = 'ZVK2BNT-XP04A53-KV0E5QH-9CAN0QE'

export const fetchMovies = async (query = '') => {
    try {
        let url;
        
        // Check if this is a search query
        if (query.includes('name=') || query.includes('keyword=') || query.includes('search=')) {
            // Use search endpoint for search queries with sorting
            const searchParam = query.replace('name=', '').replace('keyword=', '').replace('search=', '').split('&')[0];
            url = `${api_url}/movie/search?query=${searchParam}&limit=10&sortField=rating.kp&sortType=-1&rating.kp.gte=0&rating.kp.lte=9.9`;
        } else {
            // Use regular movie endpoint for other queries with sorting by rating
            url = `${api_url}/movie?limit=10&year=1900-2025&sortField=rating.kp&sortType=-1&rating.kp.gte=0&rating.kp.lte=9.9`;
            if (query) {
                url += `&${query}`;
            }
        }

        console.log('=== API CALL DEBUG ===')
        console.log('Full URL:', url)
        console.log('Original query:', query)
        console.log('Is search query:', query.includes('name=') || query.includes('keyword=') || query.includes('search='))
        console.log('Sorting applied: rating.kp descending')
        console.log('Rating filter: 0-9.9 (using gte/lte parameters)')

        const response = await fetch(url, {
            headers: {
                'X-API-KEY': api_token
            }
        })

        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText)
            return []
        }

        const data = await response.json()
        
        console.log('Response status:', response.status)
        console.log('API Response docs count:', data.docs?.length)
        console.log('First few movie titles:', data.docs?.slice(0, 3).map(m => m.alternativeName || m.name))
        console.log('======================')

        return data.docs?.map(movie => ({
            id: movie.id,
            title: movie.alternativeName || movie.name || (movie.names?.[0]?.name) || 'No title',
            year: movie.year,
            image: movie.poster?.url || '',
            type: movie.type,
            rating: movie.rating?.imdb || movie.rating?.kp || 0,
            genres: movie.genres?.map(g => g.name).join(', ') || ''
        })) || []
    } catch (error) {
        console.error('Error fetching movies:', error)
        return []
    }
}

export const fetchMovieById = async (id) => {
    try {
        const response = await fetch(`${api_url}/movie/${id}`, {
            headers: {
                'X-API-KEY': api_token
            }
        })
        const movie = await response.json()
        return {
            id: movie.id,
            title: movie.name,
            description: movie.description,
            year: movie.year,
            image: movie.poster?.url,
            genres: movie.genres.map(g => g.name).join(', ')
        }
    } catch (error) {
        console.error('Error fetching movie:', error)
        return null
    }
}