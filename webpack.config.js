// const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: [
        './assets/js/src/app.js',
        './assets/css/src/main.css'
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'assets/js/dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                }),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('../../css/dist/bundle.css'),
        new Uglify()
    ]
};
