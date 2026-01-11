import base from "./eslint.config.mjs";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...base,
  ...nextCoreWebVitals,
];
