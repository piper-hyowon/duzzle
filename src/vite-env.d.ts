/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REQUEST_URL: string;
  readonly VITE_RPC_TARGET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
