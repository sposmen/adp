const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const styleLintPlugin = require('stylelint-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');


module.exports = (env, argv) => {

  const mode = argv.mode || 'development';

  console.log('Webpack mode ***', mode);

  const config = {

    mode: mode,

    performance: {
      hints: false
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            test: path.resolve(__dirname, 'node_modules'),
            name: 'vendor',
            enforce: true
          }
        }
      }
    },

    devtool: 'source-map',

    resolve: {
      extensions: ['.ts', '.js', '.scss', '.html']
    },

    entry: {
      'vendor': './src/app/vendor.ts',
      'app': './src/app/app.ts'
    },

    output: {
      path: path.resolve('dist'),
      publicPath: '/',
      filename: '[name].js'
    },

    module: {
      rules: [
        /*
        * Source map loader support for *.js files
        * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
        *
        * See: https://github.com/webpack/source-map-loader
        */
        {
          test: /\.js$/,
          use: 'source-map-loader',
          enforce: 'pre'
        },
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          exclude: [
            /\.spec\.ts/
          ],
          options: {
            useCache: true
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: miniCssExtractPlugin.loader,
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [
                  postcssPresetEnv({
                    stage: 2,
                    features: {
                      'nesting-rules': true,
                      'color-mod-function': {
                        unresolved: 'warn'
                      }
                    }
                  })
                ]
              }
            }
          ],
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader'
          }
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
          loader: 'file-loader',
          options: {
            publicPath: '/dist/',
            limit: -1
          }
        }
      ]
    },

    plugins: [
      new styleLintPlugin(),
      new CheckerPlugin(),
      new miniCssExtractPlugin({
        filename: 'app.css',
      }),
      new CopyWebpackPlugin([
          { from: 'src/*.*', flatten: true },
          { from: 'src/assets', to: 'assets' },
      ])
    ],

    node: false
  };

  return config;
};
