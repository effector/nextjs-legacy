const BuiltinModule = require("module");

module.exports = function withEffectoReactAliases() {
  // Guard against poorly mocked module constructors
  const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;

  const target = "effector-react";
  const alias = "effector-react/ssr";

  const originalResolveFilename = Module._resolveFilename;

  Module._resolveFilename = function(request, parentModule, isMain, options) {
    if (request === target) {
      return originalResolveFilename.call(this, alias, parentModule, isMain, options);
    }

    return originalResolveFilename.call(this, request, parentModule, isMain, options);
  };

  return (config) => config;
};
