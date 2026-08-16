import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // No son código de la app desplegada: plantillas-codigo/ es el kit de
    // referencia del que se copiaron components/landing/ (no se importa en
    // tiempo de ejecución), scripts/ son herramientas de desarrollo (Node
    // plano, no TypeScript de la app).
    "plantillas-codigo/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
