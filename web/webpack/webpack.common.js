const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const config = require("./config");

module.exports = ({ NODE_ENV, NODE_DEV_SERVER }) => {
    const isDevServer = NODE_DEV_SERVER != null;

    return {
        mode: 'development',

        entry: {
          app: config.app,
        },
        
        output: {
          filename: '[name].js',
          path: config.appOutputPath,
          publicPath: config.appRoot,
        },
      
        module: {
          rules: [{
            test: /\.(js|tsx|ts)$/,
            // Add every directory that needs to be compiled by Babel during the build.
            include: [
              path.resolve(config.appDirectory, 'index.web.js'),
              path.resolve(config.appDirectory, 'src'),
              path.resolve(config.appDirectory, 'node_modules/react-native-uncompiled'),
              path.resolve(config.appDirectory, 'node_modules/react-native-gesture-handler'),
            ],
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
                presets: [
                  'module:metro-react-native-babel-preset',
                  '@babel/preset-typescript',
                ],
                // Re-write paths to import only the modules needed by the app
                plugins: [
                  'react-native-web',
                  [
                    'module-resolver',
                    {
                      alias: {
                        '^react-native$': 'react-native-web',
                      },
                    },
                  ],
                  isDevServer && require.resolve("react-refresh/babel")
                ].filter(Boolean),
              },
            },
          }, {
            test: /\.(gif|jpe?g|png|svg)$/,
            use: {
              loader: 'url-loader',
              options: {
                name: '[name].[ext]',
              },
            },
          }],
        },

        plugins: [
            new HtmlWebpackPlugin({
                inject: false,
                minify: false,
                devServer: isDevServer ? config.devServer : false,
                template: path.join(config.templateSrcPath, "_Layout_Template.cshtml"),
                filename: path.join(config.templateDistPath, "_Layout.cshtml"),
            }),
            isDevServer ? new ReactRefreshWebpackPlugin() : false,
        ].filter(Boolean),
      
        resolve: {
          alias: {
            'react-native$': 'react-native-web',
          },
          extensions: ['.web.js', '.web.tsx', '.web.ts', '.js', '.tsx', '.ts'],
        },
    };
}
