/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string,
    readonly VITE_SOME_KEY: string,
    readonly VITE_IZA_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}