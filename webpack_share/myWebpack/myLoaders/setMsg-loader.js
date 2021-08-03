/*
 * Author: yuanzhirong
 * Date: 2021-07-27 10:15:49
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-28 18:27:51
 * Description: 
 */
//loader 必须有返回值
// loader 的api都挂载在this上
module.exports = function (source) {
    console.log('run loader')
    // console.log('--------------')
    // console.log(source);
    // console.log(this.resourcePath);
    // console.log(this.query);
    // console.log('--------------')

    //this.callback
    return `console.log(${JSON.stringify(this.resourcePath)});${source}`;
}