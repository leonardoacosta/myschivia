import baseConfig from "@tribal-cities/eslint-config/base";
import reactConfig from "@tribal-cities/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
