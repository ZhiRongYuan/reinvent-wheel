/*
 * Author: yuanzhirong
 * Date: 2021-07-27 11:11:57
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-27 15:55:39
 * Description:
 */
class FileListPlugin {
    constructor(options) {
        const { filename } = options;
        this.filename = filename;
    }
    //apply 函数  帮助插件注册  接收complier类
    apply(compiler) {
        compiler.plugin("emit", function (compilation, cb) {
            console.log('test')
            cb()
        })
        compiler.hooks.emit.tapAsync('TetWebpackPlugin', function (compilation, cb) {
            // console.log(compilation.assets)
            let content = `##  文件名    资源大小 \r\n`;
            // 遍历打包之后的文件列表
            Object.entries(compilation.assets).forEach(([filename, stateObj]) => {
                content += `- ${filename}    ${stateObj.size()}\r\n`
            })
            // const fileJoin = Object.keys(compilation.assets).join('\n')
            compilation.assets['file_list.txt'] = {
                source: function () {
                    // 定义文件的内容
                    return content
                },
                size: function () {
                    // 定义文件的体积
                    return content.length;
                },
            }
            cb()
        })

        compiler.hooks.compilation.tap('TetWebpackPlugin',
            (compilation, callback) => {
                console.log('compilation!');
            });
    }
}

module.exports = FileListPlugin