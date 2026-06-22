import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**"],
  },
  ...nextCoreWebVitals,
  {
    // Next 16 / react-hooks v7 promoted these React Compiler-aware checks to
    // errors. They flag pre-existing (working) effect-based patterns, so we keep
    // them visible as warnings rather than blocking lint. Refactor incrementally.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;
