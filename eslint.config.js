import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import tailwindcss from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.jsx", "**/*.js"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      import: importPlugin,
      tailwindcss,
    },
    settings: {
      react: { version: "detect" },
    },
    languageOptions: {
<<<<<<< HEAD
      parserOptions: { 
        ecmaFeatures: { jsx: true },
        "sourceType": "module"
=======
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
>>>>>>> temp-rebased
      },
      globals: {
        React: "writable",
        document: "readonly",
        window: "readonly",
      },
    },
    rules: {
      /* React */
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* Import 정렬 */
      "import/order": ["warn", { "newlines-between": "always" }],

      /* Tailwind 클래스 검사 */
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
<<<<<<< HEAD
    // 테스트 파일(.test.js, .spec.js) 전용 설정
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    env: { 
      vitest: true
     },        // test / expect / vi 전역 허용
  },
  prettier, // 항상 마지막
=======
    files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}"],
    env: {
      vitest: true,
    },
  },
  prettier,
>>>>>>> temp-rebased
];
