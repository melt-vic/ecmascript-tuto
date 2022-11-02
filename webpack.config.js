const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
                use: [
                    styleLoader, // Se ejecuta de abajo arriba: css-loader!style-loader
                    cssLoader
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    styleLoader,        // style-loader inyecta (vía js) en el DOM los css. Mirar los exports.push en build/layout.js
                    cssLoader,          // Convierte el css en un objeto js.
                    resolveUrlLoader,   // Reemplaza los paths relativos dentro de url() (por ejemplo de imágenes) por el path completo
                    sassLoader          // Convierte scss en css. Debe hacerse porque los navegadores sólo interpretan css, no scss.
                ]
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
        })
    ],
    devtool: 'inline-source-map'
}