<template>
    <footer class="player-bar" :class="{ 'player-bar--active': currentTrack }">
        <div v-if="currentTrack"
        class="player-bar__ambient"
        :style="ambientStyle"
        aria-hidden="true" />

        <div class="player-bar__track">
            <Transition name="art-swap" mode="out-in">
                <div v-if="currentTrack" :key="currentTrack.id" class="track-art-wrap" @click="goToAlbum">
                    <img :src="artUrl" :alt="currentTrack.album?.name"
                    class="track-art" @error="onArtError" />
                    <div class="track-art__hover">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
                        </svg>
                    </div>
                </div>
                <div v-else class="track-art-wrap track-art-wrap--empty" key="empty">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="18" cy="15" r="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12 18V7l9-3v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
            </Transition>

            <Transition name="info-slide" mode="out-in">
              <div v-if="currentTrack" :key="currentTrack.id" class="track-meta">
                 <span class="track-name" :title="currentTrack.name">{{ currentTrack.name }}</span>
                 <span class="track-artist" :title="artistNames">
                 <router-link
                  v-for="(artist, i) in currentTrack.artists"
                  :key="artist.id"
                  :to="{ name: 'artist', params: { id: artist.id } }"
                  class="artist-link">{{ artist.name }}<span v-if="i < currentTrack.artists.length - 1">, </span>
                 </router-link>
                 </span>
                 <span v-if="isPreview" class="preview-badge">30s preview</span>
              </div>
              <div v-else class="track-meta track-meta--empty" key="empty-meta">
                 <span class="track-name--placeholder">No track playing</span>
              </div>
           </Transition>
           <button
            v-if="currentTrack"
            class="like-btn"
           :class="{ 'like-btn--active': isLiked }"
           @click="toggleLike"
           :aria-label="isLiked ? 'Remove from library' : 'Save to library'"
           :title="isLiked ? 'Remove from library' : 'Save to library'">
            <svg width="16" height="16" viewBox="0 0 24 24" :fill="isLiked ? 'currentColor' : 'none'">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="player-bar__centre">
          <PlayerControls />
          <ProgressBar />
        </div>
        <div class="player-bar__right">
          <button
           class="util-btn"
          :class="{ 'util-btn--active': queueOpen }"
          @click="toggleQueue"
          aria-label="Queue"
          title="Queue">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
           <path d="M3 6h18M3 12h18M3 18h12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
           <circle cx="19" cy="18" r="3" stroke="currentColor" stroke-width="1.75"/>
           </svg>
          </button>
 
          <VolumeControl />
          <button
           v-if="currentTrack"
           class="util-btn util-btn--expand"
           @click="goToNowPlaying"
           aria-label="Full player"
           title="Full player">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
           <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
          </button>
        </div>
        <Teleport to="body">
        <QueueDrawer :open="queueOpen" @close="queueOpen = false" />
        </Teleport>
    </footer>
</template>

<script setup>
import { mapGetters, mapState, mapActions } from 'vuex'
import PlayerControls from '@/components/player/PlayerControls.vue'
import ProgressBar    from '@/components/player/ProgressBar.vue'
import VolumeControl  from '@/components/player/VolumeControl.vue'
import QueueDrawer    from '@/components/QueueDrawer.vue'

const FALLBACK_ART = '/img/placeholder-art.png'

export default {
    name: 'PlayerBar',

    components: {
        PlayerControls,
        ProgressBar,
        VolumeControl,
        QueueDrawer
    },
    data() {
        return {
            queueOpen: false,
            artFailed: false,
        }
    },
    computed: {
        ...mapState('player', ['status', 'preview']),
        ...mapGetters('player', ['currentTrack', 'isPlaying']),
        ...mapGetters('library', ['isTrackSaved']),

        artUrl() {
            if (this.artFailed) return FALLBACK_ART
            return (
                this.currentTrack?.album?.images?.[1]?.url
                ?? this.currentTrack?.album?.images?.[0]?.url
                ?? FALLBACK_ART
            )
        },
        artistNames() {
            return this.currentTrack?.artists?.map((a) => a.name).join(', ') ?? ''
        },
        isLiked() {
            return this.currentTrack ? this.isTrackSaved(this.currentTrack.id) : false
        },
        isPreview() {
            return this.preview === true
        },
        ambientStyle() {
            const id = this.currentTrack?.album?.id ?? ''
            const hue = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
            return {
                background: `radial-gradient(ellipse at 50% 100%,
          hsla(${hue}, 60%, 40%, 0.35) 0%,
          transparent 70%)`,
            }
        },
    },
    watch: {
        currentTrack() {
            this.artFailed = false
        },
    },
    methods: {
        ...mapActions('library', ['toggleSaveTrack']),

        toggleLike() {
            if (this.currentTrack) this.toggleSaveTrack(this.currentTrack)
        },
    toggleQueue() {
        this.queueOpen = !this.queueOpen
    },
    goToAlbum() {
        const albumId = this.currentTrack?.album?.id
        if (albumId) this.$router.push( {name: 'album', params: { id: albumId } })
    },
    goToNowPlaying() {
        this.$router.push({ name: 'now-playing' })
    },
    onArtError() {
        this.artFailed = true
    },
    },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Syne:wght@500;700&display=swap');

.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: var(--player-height, 88px);
 
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
 
  background: var(--color-player-bg, #0a0a0a);
  border-top: 1px solid var(--color-border, rgba(255,255,255,0.07));
  overflow: visible;
 
  font-family: 'Syne', sans-serif;
}
 
.player-bar--active {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.player-bar__ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: background 1.2s ease;
  z-index: 0;
}

.player-bar__track,
.player-bar__centre,
.player-bar__right {
  position: relative;
  z-index: 1;
}

.player-bar__track {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
}

.track-art-wrap {
  position: relative;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,0,0,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.track-art-wrap:hover { transform: scale(1.04); box-shadow: 0 4px 20px rgba(0,0,0,0.7) }
 
.track-art-wrap--empty {
  background: var(--color-surface, #1a1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted, #666);
  cursor: default;
}
.track-art-wrap--empty:hover { transform: none; box-shadow: 0 2px 12px rgba(0,0,0,0.5) }
 
.track-art {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
 
.track-art__hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}
.track-art-wrap:hover .track-art__hover { opacity: 1 }

.track-meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}
 
.track-name {
  font-family: 'Syne', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text, #fff);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
}
 
.track-name--placeholder {
  font-family: 'DM Mono', monospace;
  font-size: 0.75rem;
  color: var(--color-text-muted, #555);
  font-style: italic;
}
 
.track-artist {
  font-family: 'DM Mono', monospace;
  font-size: 0.7rem;
  color: var(--color-text-muted, #888);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
 
.artist-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.15s;
}
.artist-link:hover { color: var(--color-text, #fff); text-decoration: underline }
 
.preview-badge {
  font-family: 'DM Mono', monospace;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-accent, #1db954);
  background: rgba(29, 185, 84, 0.12);
  border: 1px solid rgba(29, 185, 84, 0.25);
  border-radius: 3px;
  padding: 1px 5px;
  width: fit-content;
}

.like-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted, #666);
  padding: 0.375rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, transform 0.15s;
}
.like-btn:hover           { color: var(--color-text, #fff) }
.like-btn--active         { color: var(--color-accent, #1db954) }
.like-btn--active:hover   { color: var(--color-accent, #1db954); transform: scale(1.15) }

.player-bar__centre {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.player-bar__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}
 
.util-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted, #666);
  padding: 0.4rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}
.util-btn:hover       { color: var(--color-text, #fff); background: var(--color-surface, rgba(255,255,255,0.05)) }
.util-btn--active     { color: var(--color-accent, #1db954) }
.util-btn--active:hover { color: var(--color-accent, #1db954) }
.util-btn--expand     { opacity: 0.5 }
.util-btn--expand:hover { opacity: 1 }

.art-swap-enter-active  { transition: opacity 0.3s ease, transform 0.3s ease }
.art-swap-leave-active  { transition: opacity 0.2s ease, transform 0.2s ease }
.art-swap-enter-from    { opacity: 0; transform: scale(0.9) rotate(-4deg) }
.art-swap-leave-to      { opacity: 0; transform: scale(1.05) rotate(2deg) }
 
.info-slide-enter-active { transition: all 0.3s ease }
.info-slide-leave-active { transition: all 0.2s ease }
.info-slide-enter-from   { opacity: 0; transform: translateY(6px) }
.info-slide-leave-to     { opacity: 0; transform: translateY(-4px) }
</style>