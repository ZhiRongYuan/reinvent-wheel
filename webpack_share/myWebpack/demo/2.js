/*
 * Author: yuanzhirong
 * Date: 2021-07-30 10:26:44
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-30 10:31:59
 * Description:
 */
(function (graph) {
    function require(file) {
        var exports = {};
        (function (exports, code) {
            eval(code)
        })(exports, graph[file])
        return exports;
    }
    require('./index.js');
})({
    './index.js': `var add = require('./add.js').default;
console.log(add(2, 6))`,
    './add.js': `var a = 1;exports.default = function (a, b) { return a + b };`
})