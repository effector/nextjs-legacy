const BuiltinModule = require("module");

module.exports = function withEffectoReactAliases() {
  // Guard against poorly mocked module constructors
  const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;

  const target = "effector-react";
  const alias = "effector-react/ssr";

  const originalResolveFilename = Module._resolveFilename;

  Module._resolveFilename = function (request, parentModule, isMain, options) {
    if (request === target) {
      return originalResolveFilename.call(this, alias, parentModule, isMain, options);
    }

    return originalResolveFilename.call(this, request, parentModule, isMain, options);
  };

  return (nextConfig = {}) => {
    if (typeof nextConfig === "function") return nextConfig;

    // prevent https://github.com/zeit/next.js/blob/master/errors/empty-configuration.md
    return Object.assign({}, nextConfig, {
      webpack: (config, options) => {
        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    });
  };
};
