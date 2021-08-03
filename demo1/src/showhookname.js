/*
 * Author: yuanzhirong
 * Date: 2021-07-27 10:59:27
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-27 11:04:39
 * Description:
 */
const webpack = require("webpack");
const webpackConfig = require("../webpack.config.js");

const compiler = webpack(webpackConfig);
Object.keys(compiler.hooks).forEach((hookName) => {
    compiler.hooks[hookName].tap('hello', () => {
        console.log(`hook ----> ${hookName}`)
    })
});

compiler.run();