import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SettingsState {
  deepseekApiKey: string
  minimaxApiKey: string
  defaultDuration: [number, number]
  theme: 'dark' | 'light'
}

const initialState: SettingsState = {
  deepseekApiKey: '',
  minimaxApiKey: '',
  defaultDuration: [180, 300],
  theme: 'dark',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDeepseekApiKey: (state, action: PayloadAction<string>) => {
      state.deepseekApiKey = action.payload
    },
    setMinimaxApiKey: (state, action: PayloadAction<string>) => {
      state.minimaxApiKey = action.payload
    },
    setDefaultDuration: (state, action: PayloadAction<[number, number]>) => {
      state.defaultDuration = action.payload
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload
    },
  },
})

export const {
  setDeepseekApiKey,
  setMinimaxApiKey,
  setDefaultDuration,
  setTheme,
} = settingsSlice.actions

export default settingsSlice.reducer
