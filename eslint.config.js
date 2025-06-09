import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import tailwind from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.jsx", "**/*.js"],
    plugins: { react: reactPlugin, "react-hooks": reactHooks, import: importPlugin, tailwind },
    languageOptions: {
      globals: { React: "writable" },        // create-react-app 스타일
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "react/react-in-jsx-scope": "off",     // Vite + React 17+
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // import 정렬 ↔ Prettier 충돌 방지
      "import/order": ["warn", { "newlines-between": "always" }],

      // Tailwind 클래스 알파벳·기준 순서 검사
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",   // 자유롭게 커스텀 네이밍 허용
    },
  },
  prettier, // 항상 마지막!
];
