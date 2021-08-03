/*
 * Author: yuanzhirong
 * Date: 2021-07-27 15:04:16
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-27 17:42:41
 * Description:
 */
const htmlWebpackPlugin = require("html-webpack-plugin");
class SetScriptTimestampPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('SetScriptTimestampPlugin',
            (compilation) => {
                htmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('SetScriptTimestampPlugin', function (htmlPluginData, callback) {
                    //console.log(htmlPluginData)
                    // 读取并修改 script 上 src 列表
                    //let jsScr = htmlPluginData.assets.js[0];
                    // htmlPluginData.assets.js = [];
                    let result = `
                            <script>
                               console.log('测试')
                            </script>
                        `;
                    let resultHTML = htmlPluginData.html.replace(
                        "<!--SetScriptTimestampPlugin inset script-->", result
                    );
                    // 返回修改后的结果
                    htmlPluginData.html = resultHTML;
                    callback(null, htmlPluginData)
                })

            });
    }
}
module.exports = SetScriptTimestampPlugin;