/*
 * Author: yuanzhirong
 * Date: 2021-07-28 15:52:34
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-30 10:34:26
 * Description:
 */
(function (graph) {
    function require(file) {
        var exports = {};
        graph[file].call(exports, exports, require)
        return exports;
    }
    require('./index.js')
})(
    {
        './index.js': function (exports, require) {
            eval(`var add = require('./add.js').default;
                        console.log(add(2,5))
            `)
        },
        './add.js': function (exports, require) {
            eval(`exports.default = function (a, b) { return a + b };`)
        }
    }
)






 // for (let i = 0; i < this.modules.length; i++) {
    //   const item = this.modules[i];
    //   const dependencies = item.dependencies;
    //   if (dependencies) {
    //     for (let j in dependencies) {
    //       this.modules.push(this.getModuleParseInfo(dependencies[j]));
    //     }
    //   }
    // }