import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import path from "path";

import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];
const babelConfig = path.resolve(__dirname, "babel.config.js");

export default {
  input: "src/index.ts",
  output: [
    {
      format: "es",
      sourcemap: true,
      exports: "named",
      file: pkg.module,
    },
    {
      format: "cjs",
      sourcemap: true,
      exports: "named",
      file: pkg.main,
      externalLiveBindings: false,
    },
  ],
  plugins: [
    babel({
      extensions,
      babelrc: false,
      babelHelpers: "bundled",
      configFile: babelConfig,
      exclude: "node_modules/**",
    }),
    resolve({ extensions }),
    commonjs({ extensions }),
  ],
  external: [
    "next/app",
    "effector-react/ssr",
    ...Object.keys(Object.assign({}, pkg.dependencies, pkg.peerDependencies)),
  ],
};
