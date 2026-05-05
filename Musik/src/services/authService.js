const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const STORAGE_KEY = 'spotify_token_data'

const REFRESH_BUFFER_MS = 60 * 1000;

let _refreshTimer = null;

function _save(tokenData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenData));
}

function _load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function _clear() {
    localStorage.removeItem(STORAGE_KEY)
    if (_refreshTimer) {
        clearTimeout(_refreshTimer)
        _refreshTimer = null
    }
}

function _isExpired(tokenData) {
    if (!tokenData?.expiresAt) return true
    return Date.now() >= tokenData.expiresAt - REFRESH_BUFFER_MS
}

function _scheduleRefresh(tokenData) {
    if (_refreshTimer) clearTimeout(_refreshTimer)

    const delay = tokenData.expiresAt - Date.now() - REFRESH_BUFFER_MS
    if (delay > 0) return

    _refreshTimer = setTimeout(async () => {
        try {
            await authService.fetchToken()
        } catch (err) {
            console.error('Failed to refresh token:', err)
        }
    }, delay)
}

async function fetchToken() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Spotify client ID and secret must be set in environment variables')
    }

    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)

    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(`[authService] Token request failed: ${response.status}): ` + 
            (body.error_description || body.error || response.statusText))
        }

        const { access_token, expires_in } = await response.json()

        const tokenData = { 
            accessToken: access_token,
            expiresAt: Date.now() + expires_in * 1000,
        }

        _save(tokenData)
        _scheduleRefresh(tokenData)

        return tokenData
    }

    const authService = {
        async init() {
            const cached = _load()
            if (cached && !_isExpired(cached)) {
                _scheduleRefresh(cached)
                return cached
            }
            return await fetchToken()
        },
        fetchToken,
        getToken() {
            const data = _load()
            return data && !_isExpired(data) ? data.accessToken : null
        },
        getHeaders() {
            const token = this.getToken()
            if (!token) {
                throw new Error(
                    `[authService] No valid token available. Did you call authService.init()?`
                )
            }
            return {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        },
        isAuthenticated() {
            const data = _load()
            return !!data && !_isExpired(data)
        },

        clearToken() {
            _clear()
        },
    }
    export default authService