const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
const config = require("./config");
const DefinePlugin = webpack.DefinePlugin;

module.exports = async () => {
    return {
        mode: "production",

        output: {
          filename: '[name].[fullhash:8].js',
          path: config.appOutputPath,
          publicPath: `${config.appRoot}${config.relativePaths.app}`
        },

        plugins: [
            new DefinePlugin({
                PRODUCTION: JSON.stringify(true),
                "process.env.NODE_ENV": JSON.stringify("production"),
            }),

            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: config.cleanOptions,
                verbose: true,
            }),
        ]
    }
}