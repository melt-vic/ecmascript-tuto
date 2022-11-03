const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const styleLoader = {
    loader: 'style-loader',
    options: {}
}
const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: true
    }
}
const sassLoader = {
    loader: 'sass-loader',
    options: {
        sourceMap: true
    }
}
const resolveUrlLoader = {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: true
    }
}

const useDevServer = false;

module.exports = {
    entry: {
        rep_log: './assets/js/rep_log.js',
        login: './assets/js/login.js',
        layout: './assets/js/layout.js'
    },
    output: {
        path: path.resolve(__dirname, 'web', 'build'),
        filename: "[name].js",
        publicPath: "/build/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        cssLoader
                    ],
                    // use this if CSS isn't extracted
                    fallback: styleLoader
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        cssLoader,
                        resolveUrlLoader,
                        sassLoader
                    ],
                    fallback: styleLoader
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:6].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:6].[ext]'
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new CopyWebpackPlugin([
            {from: './assets/static', to: 'static'}    // Copia a {output}/static
        ]),
        new webpack.optimize.CommonsChunkPlugin({      // Allows us to move common shared code into a separate chunk. En Webpack 4 se emplea SplitChunksPlugin. Webpack Encore supports this feature out of the box.
            name: [
                'layout',                              // layout is an entry file. Anything included in layout is not included in other output files
                'manifest'                             /* Webpack gives each module a number id, and the manifest contains those ids. Sometimes, those ids change.
                                                          Normally, we don't care! These are all internal Webpack details! But... if the module ids change... then the manifest changes... and that means that the contents of layout.js change.
                                                         Let me say it a different way: because of the module ids in the manifest, if I make a change to, say, login.js, it may cause the built layout.js file to change. Why is that a problem? Caching.
                                                       */
            ],
            minChunks: Infinity,
        }),
        new ExtractTextPlugin('[name].css')
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './web'
    }
}