const path = require("path");

module.exports = ({ config }) => {

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loaders: ['awesome-typescript-loader', 'react-docgen-typescript-loader'],
    include: path.resolve(__dirname, '../'),
    exclude: path.resolve(__dirname, '../node_modules')
  });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};