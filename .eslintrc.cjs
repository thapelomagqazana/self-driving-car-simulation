module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:import/recommended",
      "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ["react", "react-hooks", "@typescript-eslint", "jsx-a11y", "import", "prettier"],
    rules: {
      "prettier/prettier": ["error"],
      "react/react-in-jsx-scope": "off", // Not needed for Next.js / Vite
      "@typescript-eslint/no-unused-vars": "warn",
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal"],
          "alphabetize": { "order": "asc", "caseInsensitive": true }
        }
      ]
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  