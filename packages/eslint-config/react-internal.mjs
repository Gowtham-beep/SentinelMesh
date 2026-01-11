import base from "./eslint.config.mjs";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  ...base,
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
];
