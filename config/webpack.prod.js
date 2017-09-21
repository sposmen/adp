const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const helpers = require('./helpers');
const commonConfig = require('./webpack.common');

const ENV = process.env.ENV = process.env.NODE_ENV = 'prod';


module.exports = function (options) {
  return webpackMerge(commonConfig({ env: ENV }), {

    devtool: 'source-map',

    plugins: [
      new webpack.DefinePlugin({
        'ENV': JSON.stringify(ENV),
        'process.env': {
          'ENV': JSON.stringify(ENV),
          'NODE_ENV': JSON.stringify(ENV)
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: false,
        options: {
          tslint: {
            emitErrors: true,
            failOnHint: true,
            resourcePath: 'src'
          }
        }
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    ]
  });
};

