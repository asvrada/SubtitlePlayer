const path = require('path');
const webpack = require('webpack');


const ROOT_PATH = path.resolve(__dirname);
const DIST_PATH = path.resolve(ROOT_PATH, './dist');

module.exports = {
    entry: path.resolve(ROOT_PATH, './src/js/app.js'),
    output: {
        path: DIST_PATH,
        publicPath: '/dist/',
        filename: 'app.bundle.js'
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue'],
        alias: {
            components: path.join(ROOT_PATH, './src/components'),
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
}
