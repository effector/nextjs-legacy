module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    [
      "@babel/preset-env",
      {
        loose: true,
        modules: false,
        shippedProposals: true,
        targets: {
          node: "12",
          browsers: [
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Safari versions",
            "last 2 Edge versions",
          ],
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ];

  const plugins = [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining",
  ];

  return {
    presets,
    plugins,
  };
};
