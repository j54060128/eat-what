/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GitHub repo 網址（例如 https://github.com/xxx/yyy），由部署 workflow 帶入 */
  readonly VITE_REPO_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
