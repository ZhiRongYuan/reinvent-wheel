/*
 * Author: yuanzhirong
 * Date: 2021-07-28 11:10:24
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-28 18:06:21
 * Description: 
 */
const path = require("path");
const FileListPlugin = require('./myPlugins/FileListPlugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, './myLoaders/setMsg-loader.js'),
            options: {
              name: 'casic'
            },
          }
        ]
      }
    ]
  },
  plugins: [
    new FileListPlugin({
      filename: 'file_list.txt'
    })
  ],
};
