const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, 'index.js'), //指定入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出的路径
        filename: 'bundle.js'  // 打包后文件
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
　　 　　new HtmlWebpackPlugin({
　　　　 　　template: path.resolve(__dirname, 'index.html'),
　　　　　　 inject: true
　　　　 })
　　 ]
}
