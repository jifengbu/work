const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { injectBabelPlugin, paths } = require('react-app-rewired');

function getHtmlWebpackPlugin(name, title) {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
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

module.exports = function override(config, env) {
    config.entry =  {
        home: './src/home.js',
        about: './src/about.js',
    };
    config.plugins = config.plugins.filter(o=>!(
        o instanceof HtmlWebpackPlugin
        || o instanceof ManifestPlugin
        || o instanceof WorkboxWebpackPlugin.GenerateSW
    ));
    Object.keys(config.entry).forEach(item => {
        const plugin = getHtmlWebpackPlugin(item, item);
        config.plugins.unshift(plugin);
    });
    delete config.optimization.runtimeChunk;
    config.output.path = path.resolve(__dirname, 'dist');
    return config;
}
