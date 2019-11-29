const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getHtmlWebpackPlugin(name, title) {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        filename: `${name}.html`,
        title,
        chunks: [ name ],
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: false,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        },
    });
}

module.exports = {
    mode: "development",
    entry: {
        home: './home.js',
        about: './about.js',
    }, //指定入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出的路径
        filename: '[name].bundle.js'  // 打包后文件
    },
    optimization: {
        minimize: true,
    },
    module: {
        //加载器配置
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        getHtmlWebpackPlugin('home', '主页'),
        getHtmlWebpackPlugin('about', '关于页'),
    ],
}
