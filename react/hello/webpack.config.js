const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getHtmlWebpackPlugin(name, title) {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        filename: `${name}.html`,
        title,
        chunks: [ name, 'common', 'vendor' ],
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
        filename: '[name].bundle.js',  // 打包后文件
        chunkFilename: "[name].chunk.js",
    },
    optimization: {
        minimize: true,
        splitChunks: {
            cacheGroups: {
                // 注意: priority属性，优先级越大的越先提取
                // 其次: 打包业务中公共代码
                common: {
                    name: "common",
                    chunks: "all",
                    minSize: 1,
                    priority: 0
                },
                // 首先: 打包node_modules中的文件
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10
                },
            }
        },
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
