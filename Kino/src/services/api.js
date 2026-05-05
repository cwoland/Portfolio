const api_url = 'https://api.poiskkino.dev/v1.4'
const api_token = 'ZVK2BNT-XP04A53-KV0E5QH-9CAN0QE'

export const fetchMovies = async (query = '', page = 1) => {
    if (typeof query !== 'string') query = ''
    if (typeof page !== 'number') page = 1

    try {
        let url;

        if (query.includes('genres.name=')) {
            const genre = query.split('genres.name=')[1].split('&')[0]
            url = `${api_url}/movie?limit=10&page=${page}&year=1900-2025&sortField=rating.kp&sortType=-1&rating.kp.gte=0&rating.kp.lte=9.9&genres.name=${genre}`
        } else if (query.includes('name=') || query.includes('keyword=') || query.includes('search=')) {
            const searchParam = query.replace('name=', '').replace('keyword=', '').replace('search=', '').split('&')[0]
            url = `${api_url}/movie/search?query=${searchParam}&page=${page}&limit=10&sortField=rating.kp&sortType=-1&rating.kp.gte=0&rating.kp.lte=9.9`
        } else {
            const yearMatch = query.match(/year=([^&]+)/)
            const year = yearMatch ? yearMatch[1] : '1900-2025'
            const typeMatch = query.match(/type=([^&]+)/)
            const type = typeMatch ? `&type=${typeMatch[1]}` : ''
            const genreMatch = query.match(/genres\.name=([^&]+)/)
            const genre = genreMatch ? `&genres.name=${genreMatch[1]}` : ''

    url = `${api_url}/movie?limit=10&page=${page}&year=${year}&sortField=rating.kp&sortType=-1&rating.kp.gte=0&rating.kp.lte=9.9${type}${genre}`
        }

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

export const fetchRandomMovie = async () => {
    const randomPage = Math.floor(Math.random() * 100) + 1
    const response = await fetch(
        `${api_url}/movie?limit=1&page=${randomPage}&sortField=rating.kp&sortType=-1&rating.kp.gte=6`,
        {
            headers: { 'X-API-KEY': api_token }
        }
    )
    const data = await response.json()
    return data.docs?.[0] || null
}

export const fetchFeaturedMovies = async () => {
    const response = await fetch(
        `${api_url}/movie?limit=10&sortField=rating.kp&sortType=-1&rating.kp.gte=7`,
        { headers: { 'X-API-KEY': api_token } }
    )
    const data = await response.json()
    return data.docs || []
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