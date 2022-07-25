const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/")
    },
    configure: (webpackConfig, { env, paths }) => {
      // console.log('webpackConfig',webpackConfig);
      if (env === 'development') return webpackConfig;
      webpackConfig['output']['path']=path.resolve(__dirname, '../admin/');
      console.log('webpackConfig',webpackConfig);

      return webpackConfig;
    }
  }
};
