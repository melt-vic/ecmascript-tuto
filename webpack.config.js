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
        ])
    ],
    devtool: 'inline-source-map'
}