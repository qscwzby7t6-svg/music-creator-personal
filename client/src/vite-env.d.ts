interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_MINIMAX_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
