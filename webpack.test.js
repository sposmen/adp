const path = require('path');
const ROOT = path.resolve(__dirname, '.');


module.exports = {

  devtool: 'inline-source-map',

  mode: 'development',

  resolve: {
    extensions: ['.ts', '.js', '.scss', '.html']
  },

  module: {

    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          configFileName: 'tsconfig-test.json'
        }
      },
      {
        test: /\.scss$/,
        use: 'null-loader'
      },
      {
        test: /\.(gif|jpe?g|png|svg|tiff|webp)$/,
        use: 'null-loader'
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },

      /**
       * Instruments JS files with Istanbul for subsequent code coverage reporting.
       * Instrument only testing sources.
       *
       * See: https://github.com/deepsweet/istanbul-instrumenter-loader
       */
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        include: path.join(ROOT, 'src'),
        exclude: [
          /\.(e2e|spec)\.ts$/
        ]
      }
    ]
  }

};
