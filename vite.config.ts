import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Carrega variaveis de ambiente que começam com VITE_
  const env = loadEnv(mode, process.cwd());

  // Mapeie as variáveis VITE_* para chaves sem o prefixo.
  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith("VITE_"))
    .reduce((acc, key) => {
      // Remove o prefixo "VITE_"  e expoe a variavel
      const newKey = key.replace(/^VITE_/, "");
      acc[`process.env.${newKey}`] = JSON.stringify(env[key]);
      return acc;
    }, {} as Record<string, string>);

  return {
    plugins: [react()],
    define: processEnv,
  };
});
