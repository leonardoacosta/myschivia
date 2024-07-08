import baseConfig, { restrictEnvAccess } from "@tribal-cities/eslint-config/base";
import nextjsConfig from "@tribal-cities/eslint-config/nextjs";
import reactConfig from "@tribal-cities/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
