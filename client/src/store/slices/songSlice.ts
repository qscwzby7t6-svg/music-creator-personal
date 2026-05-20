import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Song {
  id: string
  title: string
  artist: string
  duration: number
  coverUrl: string
  audioUrl: string
  playCount?: number
  category?: string
}

interface SongState {
  sourceSong: Song | null
  hotSongs: Song[]
  selectedCategory: string
  uploadProgress: number
  isUploading: boolean
  searchResults: Song[]
}

const initialState: SongState = {
  sourceSong: null,
  hotSongs: [],
  selectedCategory: 'all',
  uploadProgress: 0,
  isUploading: false,
  searchResults: [],
}

const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    setSourceSong: (state, action: PayloadAction<Song | null>) => {
      state.sourceSong = action.payload
    },
    setHotSongs: (state, action: PayloadAction<Song[]>) => {
      state.hotSongs = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload
    },
    setSearchResults: (state, action: PayloadAction<Song[]>) => {
      state.searchResults = action.payload
    },
  },
})

export const {
  setSourceSong,
  setHotSongs,
  setSelectedCategory,
  setUploadProgress,
  setIsUploading,
  setSearchResults,
} = songSlice.actions

export default songSlice.reducer
