module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
        [
            "module-resolver",
            {
            alias: {
                "@": ".",
                "@src": "./src",
                "@app": "./app",
                "@": ".",
                "@src": "./src",
                "@constants": "./src/constants",
                "@screens": "./src/screens",
                "@storage": "./src/storage",
                "@store": "./src/store",
                "@app": "./app",
                "@(tabs)": "./app/(tabs)"
            }
            }
        ]
    ]
  };
};