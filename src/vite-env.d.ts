/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_URL_CLIENTES: string;
  readonly VITE_URL_CONTAS: string;
  readonly VITE_URL_AGENCIAS: string;
 
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
