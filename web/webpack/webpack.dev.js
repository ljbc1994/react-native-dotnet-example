const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const config = require("./config");

module.exports = async ({ NODE_DEV_SERVER }) => {
    const isDevServer = NODE_DEV_SERVER == 'true';

    const publicPath = isDevServer
        ? config.devServer.contentPath
        : `${config.appRoot}${config.relativePaths.app}`;

    return {
        mode: 'development',

        output: {
            filename: "[name].js",
            publicPath: publicPath,
            path: config.appOutputPath,
        },

        devServer: {
            contentBase: config.devServer.contentBase,
            port: config.devServer.port,
            publicPath: config.devServer.publicPath,
            hot: true,
            https: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
            },
        },

        
        plugins: [
            !isDevServer
                ? new CleanWebpackPlugin({
                      dry: true,
                      cleanOnceBeforeBuildPatterns: config.cleanOptions,
                      verbose: true,
                  })
                : undefined,
        ].filter(Boolean),
    };
}