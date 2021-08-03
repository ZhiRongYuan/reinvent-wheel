/*
 * Author: yuanzhirong
 * Date: 2021-07-27 10:15:49
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-27 17:43:52
 * Description: 
 */
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FileListPlugin = require('./myPlugins/FileListPlugin');
const SetScriptTimestampPlugin = require('./myPlugins/SetScriptTimestampPlugin')
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "main.js"
    },
    resolveLoader: {
        modules: ["node_modules", "./myLoaders"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    // {
                    //     loader: 'babel-loader',
                    //     options: {
                    //         presets: ["@babel/preset-env"]
                    //     },
                    // },
                    {
                        // loader:path.resolve(__dirname, './myLoaders/setMsg-loader.js'),
                        loader: 'setMsg-loader',
                        options: {
                            name: 'casic'
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./src/index.html",
            filename: 'index.html',
            chunks: ["main"],
            hash: true
        }),
        new FileListPlugin({
            filename: 'file_list.txt'
        }),
        new SetScriptTimestampPlugin(),
        new CleanWebpackPlugin()
    ],
    mode: 'development'
}