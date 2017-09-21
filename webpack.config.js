const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = function (ENV) {

    ENV = ENV || 'dev';

    const isProd = ENV === 'prod';

    const config = {

        devtool: 'source-map',

        resolve: {
            extensions: ['.ts', '.js', '.scss', '.html'],
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
                    loader: 'awesome-typescript-loader'
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            { loader: 'css-loader', options: { importLoaders: 1 } },
                            'postcss-loader'
                        ]
                    })
                },
                {
                    test: /\.(gif|jpe?g|png|svg|tiff|webp)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                useRelativePath: true,
                                publicPath: ''
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: 'html-loader'
                    }
                }

            ]
        },

        plugins: [
            new webpack.DefinePlugin({
                'ENV': ENV,
                'process.env': {
                    'ENV': ENV,
                    'NODE_ENV': ENV
                }
            }),
            new webpack.LoaderOptionsPlugin({
                minimize: isProd,
                debug: !isProd,
                options: {
                    tslint: {
                        emitErrors: isProd,
                        failOnHint: isProd,
                        resourcePath: 'src'
                    }
                }
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.CommonsChunkPlugin(['app', 'vendor']),
            new CheckerPlugin(),
            new StyleLintPlugin(),
            new ExtractTextPlugin({
                filename: 'app.css'
            }),
            new CopyWebpackPlugin([
                { from: 'src/*.*', flatten: true },
                { from: 'src/assets', to: 'assets' },
            ])
        ]
    }

    if (isProd) {
        config.plugins.push(
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true
            })
        );
    }

    return config;
};