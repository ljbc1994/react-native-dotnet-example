const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const config = require("./webpack/config");
const DefinePlugin = webpack.DefinePlugin;

// TODO: Doesnt seem to be the right platform- should be web...?!
// TODO: ENSURE SHARED CONFIG BETWEEN CLIENT + SERVER...

module.exports = {
    mode: 'production',

    entry: {
      server: config.server,
    },
    
    output: {
      filename: '[name].js',
      path: config.appOutputPath,
      libraryTarget: 'this',
      publicPath: '/app/',
    },
  
    module: {
      rules: [{
        test: /\.(js|tsx|ts)$/,
        // Add every directory that needs to be compiled by Babel during the build.
        include: [
          path.resolve(config.assetPath, 'server.tsx'),
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
              'inline-dotenv',
              [
                'module-resolver',
                {
                  alias: {
                    '^react-native$': 'react-native-web',
                  },
                },
              ],
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

    target: 'node',
    
    plugins: [
        new DefinePlugin({
            SERVER: JSON.stringify(true),
        }),

        new Dotenv(),
    ],

    resolveLoader: {
        modules: ['node_modules', './src'],
    },
    
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
      },
      extensions: ['.web.js', '.web.tsx', '.web.ts', '.js', '.tsx', '.ts'],
      fallback: {
          "fs": false
      },
    },
};