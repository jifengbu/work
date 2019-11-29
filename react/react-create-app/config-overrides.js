const path = require('path');
const _ = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { injectBabelPlugin, paths } = require('react-app-rewired');

function getHtmlWebpackPlugin(name, title) {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
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

module.exports = function override(config, env) {
    const modules = {
        home: { file: './src/home.js', title: '首页'},
        about: { file: './src/about.js', title: '关于页'},
    };
    config.entry =  _.mapValues(modules, o=>o.file);
    config.plugins = config.plugins.filter(o=>!(
        o instanceof HtmlWebpackPlugin
        || o instanceof ManifestPlugin
        || o instanceof WorkboxWebpackPlugin.GenerateSW
    ));
    _.forEach(modules, (obj, module) => {
        const plugin = getHtmlWebpackPlugin(module, obj.title);
        config.plugins.unshift(plugin);
    });
    delete config.optimization.runtimeChunk;
    return config;
}
