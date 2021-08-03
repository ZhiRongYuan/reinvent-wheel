/*
 * Author: yuanzhirong
 * Date: 2021-07-28 11:10:24
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-28 11:23:03
 * Description: 
 */

// 读取配置
const options = require("./webpack.config.js");

const Compiler = require("./lib/Compiler.js");

new Compiler(options).run();
