<template>
    <div class="search-view">
        <header class="search-header">
            <div class="search-bar-wrap">
                <SearchBar
                :value="query"
                @update="onQueryUpdate"
                @submit="onSearch"
                @clear="onClear"
                placeholder="Что хочешь найти?"
                autofocus />
            </div>
            <FilterBar
            v-if="hasSearched || query"
            :active-type="filters.type"
            :active-genre="filters.genre"
            :active-year="filters.year"
            :genres="availableGenres"
            @type-change="onTypeChange"
            @genre-change="onGenreChange"
            @year-change="onYearChange"
            @clear="onClearFilters"
            class="search-filters" />
        </header>

        <main class="search-body" ref="bodyRef">
            <template v-if="!hasSearched && !query && !loading">
                <section class="browse-section">
                    <h2 class="section-title">Категории</h2>
                    <div class="category-grid">
                        <MediaCard
                        v-for="cat in categories"
                        :key="cat.id"
                        :item="cat"
                        type="category"
                        @click="onCategoryClick(cat)" />
                        <template v-if="!categories.length">
                            <SkeletonLoader
                            v-for="n in 12" :key="n"
                            variant="card" class="category-skeleton" />
                        </template>
                    </div>
                </section>
            </template>

            <template v-else-if="loading && !loadingMore">
                <div class="results-grid">
                    <SkeletonLoader
                    v-for="n in 10" :key="n"
                    :variant="activeSkeletonVariant" />
                </div>
            </template>

            <template v-else-if="isEmpty">
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" class="empty-icon">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
                      <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M8 11h6M11 8v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                <p class="empty-title">По запросу <em>"{{ query }}"</em> ничего не найдено :(</p>
                <p class="empty-sub">Попробуй другие ключевые слова или фильтры</p>
                <button class="btn-ghost" @click="onClearFilters">Очистить</button>
                </div>
            </template>

            <template v-else-if="hasSearched">
                <template v-if="filters.type === 'all'">
                    <section v-if="tracks.length" class="result-section">
                      <div class="section-header">
                          <h2 class="section-title">Songs</h2>
                          <button class="see-all" @click="onTypeChange('track')">Больше {{ totalTracks.toLocaleString() }}</button>
                     </div>
                     <div class="track-list">
                          <TrackRow
                           v-for="(track, i) in tracks.slice(0, 5)"
                           :key="track.id"
                           :track="track"
                           :index="i + 1"
                           @play="onPlayTrack(track, tracks)" />
                     </div>
                    </section>
 
                    <section v-if="artists.length" class="result-section">
                        <div class="section-header">
                           <h2 class="section-title">Artists</h2>
                           <button class="see-all" @click="onTypeChange('artist')">Больше {{ totalArtists.toLocaleString() }}</button>
                       </div>
                       <HorizScroller>
                           <MediaCard
                             v-for="artist in artists.slice(0, 8)"
                             :key="artist.id"
                             :item="artist"
                             type="artist"
                             @click="goToArtist(artist.id)" />
                       </HorizScroller>
                    </section>
 
                     <section v-if="albums.length" class="result-section">
                        <div class="section-header">
                          <h2 class="section-title">Albums</h2>
                          <button class="see-all" @click="onTypeChange('album')">Больше {{ totalAlbums.toLocaleString() }}</button>
                        </div>
                        <HorizScroller>
                          <MediaCard
                            v-for="album in albums.slice(0, 8)"
                            :key="album.id"
                            :item="album"
                            type="album"
                            @click="goToAlbum(album.id)" />
                        </HorizScroller>
                    </section>
 
                    <section v-if="playlists.length" class="result-section">
                        <div class="section-header">
                           <h2 class="section-title">Playlists</h2>
                           <button class="see-all" @click="onTypeChange('playlist')">Больше {{ totalPlaylists.toLocaleString() }}</button>
                        </div>
                        <HorizScroller>
                           <MediaCard
                            v-for="pl in playlists.slice(0, 8)"
                            :key="pl.id"
                            :item="pl"
                            type="playlist"
                            @click="goToPlaylist(pl.id)" />
                        </HorizScroller>
                    </section>
                </template>

                <template v-else-if="filters.type === 'track'">
                  <section class="result-section">
                    <p class="result-count">{{ totalTracks.toLocaleString() }} ТРЕКИ</p>
                    <div class="track-list">
                      <TrackRow
                       v-for="(track, i) in tracks"
                       :key="track.id"
                       :track="track"
                       :index="i + 1"
                       @play="onPlayTrack(track, tracks)" />
                    </div>
                  </section>
                </template>

                <template v-else-if="filters.type === 'artist'">
                  <section class="result-section">
                   <p class="result-count">{{ totalArtists.toLocaleString() }} ИСПОЛНИТЕЛИ</p>
                   <div class="media-grid">
                     <MediaCard
                      v-for="artist in artists"
                      :key="artist.id"
                      :item="artist"
                      type="artist"
                      @click="goToArtist(artist.id)" />
                    </div>
                  </section>
                </template>

                <template v-else-if="filters.type === 'album'">
                  <section class="result-section">
                  <p class="result-count">{{ totalAlbums.toLocaleString() }} АЛЬБОМЫ</p>
                  <div class="media-grid">
                      <MediaCard
                       v-for="album in albums"
                      :key="album.id"
                      :item="album"
                       type="album"
                       @click="goToAlbum(album.id)" />
                  </div>
                  </section>
                </template>

                <template v-else-if="filters.type === 'playlist'">
                 <section class="result-section">
                 <p class="result-count">{{ totalPlaylists.toLocaleString() }} ПЛЕЙЛИСТЫ</p>
                 <div class="media-grid">
                     <MediaCard
                      v-for="pl in playlists"
                      :key="pl.id"
                      :item="pl"
                      type="playlist"
                      @click="goToPlaylist(pl.id)" />
                 </div>
                 </section>
                </template>
                <div ref="sentinelRef" class="scroll-sentinel" aria-hidden="true" />

                <div v-if="loadingMore" class="loading-more">
                   <span class="spinner" />
                </div>
            </template>
        </main>

        <Transition name="toast">
            <div v-if="error" class="error-toast" role="alert">
                <span>{{  error }}</span>
                <button @click="dismissError" aria-label="Dismiss">✕</button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { mapGetters, mapState, mapActions } from 'vuex'
import { debounce } from 'lodash-es'
import SearchBar from '@/components/search/SearchBar.vue'
import FilterBar from '@/components/search/FilterBar.vue'
import TrackRow from '@/components/shared/TrackRow.vue'
import MediaCard from '@/components/shared/MediaCard.vue'
import HorizScroller from '@/components/shared/HorizScroller.vue'
import SkeletonLoader from '@/components/shared/SkeletonLoader.vue'

export default {
    name: 'Search',

    components: {
        SearchBar, 
        FilterBar,
        TrackRow,
        MediaCard,
        HorizScroller,
        SkeletonLoader,
    },
    data() {
        return {
            availableGenres: [],
            categories: [],
            observer: null,
        }
    },
    computed: {
        ...mapState('search', ['query', 'filters', 'results', 'loading', 'loadingMore', 'error', 'hasSearched']),
        ...mapGetters('search', ['tracks', 'artists', 'albums', 'playlists', 'totalTracks', 'totalArtists', 'totalAlbums', 'totalPlaylists', 'hasMore', 'isEmpty',]),
        activeSkeletonVariant() {
            const map = { track: 'row', artist: 'circle-card', album: 'card', playlist: 'card' }
            return map[this.filters.type] ?? 'row'
        },
    },
    created() {
        this.debouncedSearch = debounce ((q) => {
            if (q.trim()) this.searchQuery({ q, reset: true })
        }, 400)
    },
    async mounted() {
        this.loadGenresAndCategories()
        this.$nextTick(() => this.initObserver())
    },
    beforeUnmount() {
        this.observer?.disconnect()
        this.debouncedSearch.cancel()
    },
    methods: {
        ...mapActions('search', {
            searchQuery: 'query',
            loadMore: 'loadMore',
            setFilter: 'setFilter',
            clearFilters: 'clearFilters',
            clearSearch: 'clear',
        }),
        ...mapActions('player', {
            playTrack: 'play',
        }),
        onQueryUpdate(q) {
            this.$store.commit('search/SET_QUERY', val)
            this.debouncedSearch(val)
        },
        onSearch() {
            this.debouncedSearch.cancel()
            if (this.query.trim()) this.searchQuery({ q: this.query, reset: true })
        },
        onClear() {
            this.debouncedSearch.cancel()
            this.clearSearch()
        },
        onTypeChange(type)  { this.setFilter({ key: 'type',  value: type  }) },
        onGenreChange(genre){ this.setFilter({ key: 'genre', value: genre }) },
        onYearChange(year)  { this.setFilter({ key: 'year',  value: year  }) },
        onClearFilters()    { this.clearFilters() },
        onPlayTrack(track, queue) {
            this.playTrack({ track, queue })
        },
        goToArtist(id)   { this.$router.push({ name: 'artist',   params: { id } }) },
        goToAlbum(id)    { this.$router.push({ name: 'album',    params: { id } }) },
        goToPlaylist(id) { this.$router.push({ name: 'playlist', params: { id } }) },
 
        onCategoryClick(cat) {
            this.$router.push({ name: 'genre', params: { id: cat.id } })
        },
        initObserver() {
            if (!this.$refs.sentinelRef) return
            this.observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && this.hasMore && !this.loadingMore) {
                        this.loadMore()
                    }
                },
                { threshold: 0.1 }
            )
            this.observer.observe(this.$refs.sentinelRef)
        },
        async loadGenresAndCategories() {
            try {
                const [genreData, catData] = await Promise.all([
                    this.$store.dispatch('catalog/fetchGenres'),
                    this.$store.dispatch('catalog/fetchCategories'),
                ])
                this.availableGenres = genreData ?? []
                this.categories = catData ?? []
            } catch {

            }
        },
        dismissError() {
            this.$store.commit('search/SET_ERROR', null)
        },
    },
}
</script>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--color-bg);
  color: var(--color-text);
}
 
.search-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--color-bg);
  padding: 1.5rem 2rem 0;
  backdrop-filter: blur(12px);
}
 
.search-bar-wrap {
  max-width: 680px;
}
 
.search-filters {
  margin-top: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}
 
.search-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.result-section {
  margin-bottom: 2.5rem;
}
 
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1rem;
}
 
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
}
 
.result-count {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}
 
.see-all {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}
.see-all:hover { color: var(--color-text) }

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
 
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
 
.track-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.browse-section { padding-top: 0.5rem }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 6rem 2rem;
  text-align: center;
  color: var(--color-text-muted);
}
 
.empty-icon   { opacity: 0.35; margin-bottom: 0.5rem }
.empty-title  { font-size: 1.125rem; font-weight: 600; color: var(--color-text) }
.empty-sub    { font-size: 0.875rem }
 
.btn-ghost {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-ghost:hover { background: var(--color-surface); border-color: var(--color-text-muted) }

.scroll-sentinel { height: 1px }
 
.loading-more {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}
 
.spinner {
  display: block;
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
 
@keyframes spin { to { transform: rotate(360deg) } }

.error-toast {
  position: fixed;
  bottom: calc(var(--player-height, 90px) + 1.5rem);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-error, #e5534b);
  color: #fff;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35);
  z-index: 100;
}
 
.error-toast button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  opacity: 0.75;
  transition: opacity 0.15s;
}
.error-toast button:hover { opacity: 1 }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease }
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

.category-skeleton { border-radius: 0.5rem; aspect-ratio: 1 }

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>