/*
 * Author: yuanzhirong
 * Date: 2021-07-30 10:21:16
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-30 10:26:23
 * Description:
 */


function require(file) {
    var exports = {};
    (function (exports, code) {
        eval(code)
    })(exports, `var a = 1;exports.default = function (a, b) { return a + b };`)
    return exports;
}

var add = require('./add.js').default;
console.log(add(2, 6))