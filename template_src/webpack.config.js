var webpackCommonConfig = require("./webpack.common.js");

// NOTE: if you need to override any configurations, please see webpack.common.js
// and then override here!
var webpackConfig = webpackCommonConfig.config(
    {
        allowTypeScript: false,
        allowScss: true,
        transpiler: "babel-loader",
        dirs: webpackCommonConfig.defaults.dirs,
        extensions: webpackCommonConfig.defaults.extensions,
        assetsToCopyIfExternal: webpackCommonConfig.defaults.assetsToCopyIfExternal,
        assetsToCopyIfInternal: webpackCommonConfig.defaults.assetsToCopyIfInternal,
        vendor: webpackCommonConfig.defaults.vendor
    }
);

module.exports = webpackConfig;