/* config-overrides.js */

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  //console.log(config.module.rules.map(data => JSON.stringify(data)));
  config.module.rules = config.module.rules.concat(
     [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ]);
  return config;
}