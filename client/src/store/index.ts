import { configureStore } from '@reduxjs/toolkit'
import songReducer from './slices/songSlice'
import analysisReducer from './slices/analysisSlice'
import generationReducer from './slices/generationSlice'
import settingsReducer from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    song: songReducer,
    analysis: analysisReducer,
    generation: generationReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['song/setUploadProgress'],
        ignoredPaths: ['song.audioFile'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
