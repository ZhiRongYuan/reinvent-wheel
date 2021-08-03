/*
 * Author: yuanzhirong
 * Date: 2021-07-27 11:11:57
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-28 18:34:51
 * Description:
 */
class FileListPlugin {
    constructor(options) {
        const { filename } = options;
        this.filename = filename;
    }
    //apply 函数  帮助插件注册  接收complier类
    apply(compiler) {
        compiler.hooks.emit.tap('TetWebpackPlugin', function (compilation) {
            console.log('enter plugin tap')
            console.log(compilation.assets)
        })
    }
}

module.exports = FileListPlugin