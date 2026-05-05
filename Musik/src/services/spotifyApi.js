import axios from 'axios'
import authService from './authService'

const BASE_URL = import.meta.env.VITE_SPOTIFY_API_BASE_URL ?? 'https://api.spotify.com/v1'
const DEFAULT_MARKET = 'US'

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

client.interceptors.request.use((config) => {
    config.headers = {
        ...config.headers,
        ...authService.getHeaders(),
    }
    return config
})

client.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true
            await authService.fetchToken()
            original.headers = {
                ...original.headers,
                ...authService.getHeaders(),
            }
            return client(original)
            }
            return Promise.reject(_normalise(err))
    }
)

function _normalise(err) {
  const status  = err.response?.status
  const message = err.response?.data?.error?.message ?? err.message ?? 'Unknown error'
  const error   = new Error(`[spotifyApi] ${status ? `(${status}) ` : ''}${message}`)
  error.status  = status
  error.raw     = err
  return error
}

const get = (url, params = {}) =>
  client.get(url, { params }).then((r) => r.data)

function search(query, types = ['track', 'artist', 'album', 'playlist'], opts = {}) {
  const { limit = 20, offset = 0, market = DEFAULT_MARKET, year, genre } = opts

  let q = query.trim()
  if (year)  q += ` year:${year}`
  if (genre) q += ` genre:"${genre}"`
 
  return get('/search', {
    q,
    type:   types.join(','),
    limit,
    offset,
    market,
  })
}

function getFeaturedPlaylists(opts = {}) {
  const { limit = 12, offset = 0, market = DEFAULT_MARKET } = opts
  return get('/browse/featured-playlists', { limit, offset, market })
}

function getNewReleases(opts = {}) {
  const { limit = 20, offset = 0, market = DEFAULT_MARKET } = opts
  return get('/browse/new-releases', { limit, offset, market })
}

function getGenres() {
  return get('/recommendations/available-genre-seeds')
}

function getCategories(opts = {}) {
  const { limit = 50, offset = 0, market = DEFAULT_MARKET } = opts
  return get('/browse/categories', { limit, offset, market })
}

function getCategoryPlaylists(categoryId, opts = {}) {
  const { limit = 20, offset = 0 } = opts
  return get(`/browse/categories/${categoryId}/playlists`, { limit, offset })
}

function getRecommendations(seeds = {}, opts = {}) {
  const {
    seedGenres  = [],
    seedArtists = [],
    seedTracks  = [],
  } = seeds
  const { limit = 20, market = DEFAULT_MARKET, ...audioFeatures } = opts
 
  return get('/recommendations', {
    seed_genres:  seedGenres.slice(0, 5).join(','),
    seed_artists: seedArtists.slice(0, 5).join(','),
    seed_tracks:  seedTracks.slice(0, 5).join(','),
    limit,
    market,
    ...audioFeatures,
  })
}

function getTrack(trackId, market = DEFAULT_MARKET) {
  return get(`/tracks/${trackId}`, { market })
}

function getTracks(trackIds, market = DEFAULT_MARKET) {
  return get('/tracks', { ids: trackIds.slice(0, 50).join(','), market })
}

function getAudioFeatures(trackId) {
  return get(`/audio-features/${trackId}`)
}

function getArtist(artistId) {
  return get(`/artists/${artistId}`)
}

function getArtists(artistIds) {
  return get('/artists', { ids: artistIds.slice(0, 50).join(',') })
}

function getArtistTopTracks(artistId, market = DEFAULT_MARKET) {
  return get(`/artists/${artistId}/top-tracks`, { market })
}

function getRelatedArtists(artistId) {
  return get(`/artists/${artistId}/related-artists`)
}

function getArtistAlbums(artistId, opts = {}) {
  const {
    limit              = 20,
    offset             = 0,
    market             = DEFAULT_MARKET,
    include_groups     = 'album,single',
  } = opts
  return get(`/artists/${artistId}/albums`, { limit, offset, market, include_groups })
}

function getAlbum(albumId, market = DEFAULT_MARKET) {
  return get(`/albums/${albumId}`, { market })
}

function getAlbumTracks(albumId, opts = {}) {
  const { limit = 50, offset = 0, market = DEFAULT_MARKET } = opts
  return get(`/albums/${albumId}/tracks`, { limit, offset, market })
}

function getPlaylist(playlistId, market = DEFAULT_MARKET) {
  return get(`/playlists/${playlistId}`, { market })
}

function getPlaylistTracks(playlistId, opts = {}) {
  const { limit = 50, offset = 0, market = DEFAULT_MARKET } = opts
  return get(`/playlists/${playlistId}/tracks`, { limit, offset, market })
}

export default {
    search,

    getFeaturedPlaylists,
    getNewReleases,
    getGenres,
    getCategories,
    getCategoryPlaylists,
    getRecommendations,

    getTrack,
    getTracks,
    getAudioFeatures,

    getArtist,
    getArtists,
    getArtistTopTracks,
    getRelatedArtists,
    getArtistAlbums,

    getAlbum,
    getAlbumTracks,

    getPlaylist,
    getPlaylistTracks,
}