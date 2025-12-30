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
  ]),
  {
    rules: {
      // Relax overly strict TypeScript rules for practical development
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type when needed
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_", // Allow unused vars prefixed with _
        "varsIgnorePattern": "^_"
      }],
      "react-hooks/exhaustive-deps": "warn", // Warn instead of error for missing deps
      "@typescript-eslint/no-require-imports": "off", // Allow require() when needed
    }
  }
]);

export default eslintConfig;
