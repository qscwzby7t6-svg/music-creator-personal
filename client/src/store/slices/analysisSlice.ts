import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StyleAnalysis {
  genre: string
  mood: string
  vocalType: string
  bpm: number
  instruments: string[]
  harmony: string
  mixingStyle: string
  confidence: number
}

export interface MelodyFeatures {
  pitchRange: { min: number; max: number }
  avgDuration: number
  intervals: number[]
  dynamics: number[]
  rhythmPattern: string
}

interface AnalysisState {
  stylePrompt: string
  styleAnalysis: StyleAnalysis | null
  melodyPrompt: string
  melodyFeatures: MelodyFeatures | null
  analysisProgress: number
  isAnalyzing: boolean
  error: string | null
}

const initialState: AnalysisState = {
  stylePrompt: '',
  styleAnalysis: null,
  melodyPrompt: '',
  melodyFeatures: null,
  analysisProgress: 0,
  isAnalyzing: false,
  error: null,
}

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setStylePrompt: (state, action: PayloadAction<string>) => {
      state.stylePrompt = action.payload
    },
    setStyleAnalysis: (state, action: PayloadAction<StyleAnalysis | null>) => {
      state.styleAnalysis = action.payload
    },
    setMelodyPrompt: (state, action: PayloadAction<string>) => {
      state.melodyPrompt = action.payload
    },
    setMelodyFeatures: (state, action: PayloadAction<MelodyFeatures | null>) => {
      state.melodyFeatures = action.payload
    },
    setAnalysisProgress: (state, action: PayloadAction<number>) => {
      state.analysisProgress = action.payload
    },
    setIsAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload
    },
    setAnalysisError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetAnalysis: (state) => {
      return { ...initialState }
    },
  },
})

export const {
  setStylePrompt,
  setStyleAnalysis,
  setMelodyPrompt,
  setMelodyFeatures,
  setAnalysisProgress,
  setIsAnalyzing,
  setAnalysisError,
  resetAnalysis,
} = analysisSlice.actions

export default analysisSlice.reducer
