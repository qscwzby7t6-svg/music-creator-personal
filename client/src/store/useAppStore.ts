import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Song {
  id: string
  title: string
  artist: string
  duration: number
  coverUrl: string
  audioUrl: string
  playCount?: number
  category?: string
}

interface StyleAnalysis {
  genre: string
  mood: string
  vocalType: string
  bpm: number
  instruments: string[]
  harmony: string
  mixingStyle: string
  confidence: number
}

interface MelodyFeatures {
  pitchRange: { min: number; max: number }
  avgDuration: number
  intervals: number[]
  dynamics: number[]
  rhythmPattern: string
}

interface GeneratedSong {
  id: string
  title: string
  audioUrl: string
  duration: number
  format: 'mp3' | 'wav'
  createdAt: string
}

interface PlagiarismReport {
  riskLevel: 'low' | 'medium' | 'high'
  audioSimilarity: number
  melodySimilarity: number
  similarSegments: Array<{ start: number; end: number; similarity: number }>
  suggestions: string[]
}

interface AppState {
  // Song selection
  sourceSong: Song | null
  setSourceSong: (song: Song | null) => void

  hotSongs: Song[]
  setHotSongs: (songs: Song[]) => void

  selectedCategory: string
  setSelectedCategory: (category: string) => void

  // Analysis
  stylePrompt: string
  setStylePrompt: (prompt: string) => void
  styleAnalysis: StyleAnalysis | null
  setStyleAnalysis: (analysis: StyleAnalysis | null) => void

  melodyPrompt: string
  setMelodyPrompt: (prompt: string) => void
  melodyFeatures: MelodyFeatures | null
  setMelodyFeatures: (features: MelodyFeatures | null) => void

  analysisProgress: number
  setAnalysisProgress: (progress: number) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void

  // Generation
  lyrics: string
  setLyrics: (lyrics: string) => void

  generatedSong: GeneratedSong | null
  setGeneratedSong: (song: GeneratedSong | null) => void

  generationProgress: number
  setGenerationProgress: (progress: number) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void

  plagiarismReport: PlagiarismReport | null
  setPlagiarismReport: (report: PlagiarismReport | null) => void

  // Settings
  deepseekApiKey: string
  setDeepseekApiKey: (key: string) => void
  minimaxApiKey: string
  setMinimaxApiKey: (key: string) => void
  defaultDuration: [number, number]
  setDefaultDuration: (duration: [number, number]) => void

  // Current step in wizard
  currentStep: number
  setCurrentStep: (step: number) => void

  // Reset functions
  resetAnalysis: () => void
  resetGeneration: () => void
  resetAll: () => void
}

const initialState = {
  sourceSong: null,
  hotSongs: [],
  selectedCategory: 'all',
  stylePrompt: '',
  styleAnalysis: null,
  melodyPrompt: '',
  melodyFeatures: null,
  analysisProgress: 0,
  isAnalyzing: false,
  lyrics: '',
  generatedSong: null,
  generationProgress: 0,
  isGenerating: false,
  plagiarismReport: null,
  deepseekApiKey: '',
  minimaxApiKey: '',
  defaultDuration: [180, 300] as [number, number],
  currentStep: 0,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setSourceSong: (song) => set({ sourceSong: song }),
      setHotSongs: (songs) => set({ hotSongs: songs }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      setStylePrompt: (prompt) => set({ stylePrompt: prompt }),
      setStyleAnalysis: (analysis) => set({ styleAnalysis: analysis }),
      setMelodyPrompt: (prompt) => set({ melodyPrompt: prompt }),
      setMelodyFeatures: (features) => set({ melodyFeatures: features }),
      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

      setLyrics: (lyrics) => set({ lyrics }),
      setGeneratedSong: (song) => set({ generatedSong: song }),
      setGenerationProgress: (progress) => set({ generationProgress: progress }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setPlagiarismReport: (report) => set({ plagiarismReport: report }),

      setDeepseekApiKey: (key) => set({ deepseekApiKey: key }),
      setMinimaxApiKey: (key) => set({ minimaxApiKey: key }),
      setDefaultDuration: (duration) => set({ defaultDuration: duration }),

      setCurrentStep: (step) => set({ currentStep: step }),

      resetAnalysis: () => set({
        stylePrompt: '',
        styleAnalysis: null,
        melodyPrompt: '',
        melodyFeatures: null,
        analysisProgress: 0,
        isAnalyzing: false,
      }),

      resetGeneration: () => set({
        lyrics: '',
        generatedSong: null,
        generationProgress: 0,
        isGenerating: false,
        plagiarismReport: null,
      }),

      resetAll: () => set(initialState),
    }),
    {
      name: 'song-generator-storage',
    }
  )
)
