import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PlagiarismReport {
  riskLevel: 'low' | 'medium' | 'high'
  audioSimilarity: number
  melodySimilarity: number
  similarSegments: Array<{ start: number; end: number; similarity: number }>
  suggestions: string[]
}

export interface GeneratedSong {
  id: string
  title: string
  audioUrl: string
  duration: number
  format: 'mp3' | 'wav'
  createdAt: string
}

interface GenerationState {
  lyrics: string
  generatedSong: GeneratedSong | null
  generationProgress: number
  isGenerating: boolean
  plagiarismReport: PlagiarismReport | null
  error: string | null
}

const initialState: GenerationState = {
  lyrics: '',
  generatedSong: null,
  generationProgress: 0,
  isGenerating: false,
  plagiarismReport: null,
  error: null,
}

const generationSlice = createSlice({
  name: 'generation',
  initialState,
  reducers: {
    setLyrics: (state, action: PayloadAction<string>) => {
      state.lyrics = action.payload
    },
    setGeneratedSong: (state, action: PayloadAction<GeneratedSong | null>) => {
      state.generatedSong = action.payload
    },
    setGenerationProgress: (state, action: PayloadAction<number>) => {
      state.generationProgress = action.payload
    },
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },
    setPlagiarismReport: (state, action: PayloadAction<PlagiarismReport | null>) => {
      state.plagiarismReport = action.payload
    },
    setGenerationError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetGeneration: (state) => {
      return { ...initialState }
    },
  },
})

export const {
  setLyrics,
  setGeneratedSong,
  setGenerationProgress,
  setIsGenerating,
  setPlagiarismReport,
  setGenerationError,
  resetGeneration,
} = generationSlice.actions

export default generationSlice.reducer
