module.exports = {
  root: true,
  extends: ["@wowvendor/eslint-config-base", "@wowvendor/eslint-config-react", "@wowvendor/eslint-config-typescript"],
  rules: {
    "react/destructuring-assignment": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
