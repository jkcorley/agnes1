declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_HUME_API_KEY: string
      NEXT_PUBLIC_HUME_VOICE_ID: string
      NEXT_PUBLIC_RAPID_API_KEY: string
    }
  }
}

export {}
