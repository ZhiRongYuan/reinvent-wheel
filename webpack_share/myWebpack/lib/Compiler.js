/*
 * Author: yuanzhirong
 * Date: 2021-07-28 11:10:24
 * LastEditors: yuanzhirong
 * LastEditTime: 2021-07-30 17:37:14
 * Description: 
 */
const { SyncHook } = require('tapable')
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const acorn = require("acorn");
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

module.exports = class Compiler {
  constructor(options) {
    const { entry, output, module, plugins } = options;
    this.entry = entry;
    this.output = output;
    this.rules = module && module.rules;
    this.plugins = plugins;
    this.modules = [];

    // tapable 的构造函数内部定义的钩子
    this.hooks = {
      afterPlugins: new SyncHook(),
      beforeRun: new SyncHook(),
      run: new SyncHook(),
      make: new SyncHook(),
      compiler: new SyncHook(),
      afterCompiler: new SyncHook(),
      shouldEmit: new SyncHook(),
      emit: new SyncHook(['compilation', 'b']),
      afterEmit: new SyncHook(['compilation']),
      done: new SyncHook(),
    }

    if (Array.isArray(this.plugins)) {
      this.plugins.forEach(plugin => {
        plugin.apply(this)
      });
    }
  }

  run() {
    // 开发编译，执行打包
    this.hooks.compiler.call() // 开始编译

    const info = this.getModuleParseInfo(this.entry);
    this.modules.push(info);
    this.loopDependencies(info)


    // 数组结构转对象结构
    const obj = {};
    this.modules.forEach((item) => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code,
      };
    });

    this.hooks.afterCompiler.call() //编译完成了

    this.generateFile(obj);

    this.hooks.done.call() // 完成
  }

  loopDependencies(moduleInfo) {
    const { dependencies } = moduleInfo;
    Object.keys(dependencies).forEach((key) => {
      const child = this.getModuleParseInfo(dependencies[key]);
      this.modules.push(child);
      this.loopDependencies(child);
    });
  }

  getModuleParseInfo(entryFile) {
    // 分析入口模块的内容
    let content = fs.readFileSync(entryFile, "utf-8");

    content = this.handlerLoader(entryFile, content)

    // 处理依赖
    const ast = parser.parse(content, {
      sourceType: "module",
    });
    //console.log(ast)

    const dependencies = {};
    traverse(ast, {
      ImportDeclaration: function ({ node }) {
        const dirname = path.dirname(entryFile);
        const pathName = "./" + path.join(dirname, node.source.value);
        dependencies[node.source.value] = pathName;
      },
    });

    // ES6转成ES5
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });

    return {
      entryFile,
      dependencies,
      code,
    };
  }

  handlerLoader(entryFile, content) {
    let loaderDealContent = content;
    // 内部定义一个处理loader的函数
    const _handleLoader = (usePath, _this) => {
      const loader = require(path.join(usePath));
      loaderDealContent = loader.call({
        resourcePath: path.resolve(__dirname, entryFile),
        query: _this && _this.query
      }, loaderDealContent)
    }

    // 读取 rules 规则, 进行倒序遍历
    const rules = this.rules || [];
    for (let i = rules.length - 1; i >= 0; i--) {
      const {
        test,
        use
      } = rules[i]

      // 匹配 modulePath 是否符合规则，若是符合规则就需要倒序遍历获取所有的loader
      // 获取每一条规则，和当前的 modulePath 进行匹配
      if (test.test(entryFile)) {
        // use 可能是 数组、对象、字符串
        if (Array.isArray(use)) {
          for (let j = use.length - 1; j >= 0; j--) {
            if (use[j] instanceof Object) {
              _handleLoader(use[j].loader, {
                query: use[j].options,
              })
            } else {
              _handleLoader(use[j])
            }
          }
        } else if (typeof use === 'string') {
          // string
          _handleLoader(use)
        } else if (use instanceof Object) {
          // object
          _handleLoader(use.loader, {
            query: use.options
          })
        }
      }
    }

    return loaderDealContent
  }

  generateFile(code) {
    // 生成代码内容 webpack启动函数
    const filePath = path.join(this.output.path, this.output.filename);
    const newCode = JSON.stringify(code);
    const bundle = `(function(graph){
        function require(module){
            function PathRequire(relativePath){
               return require(graph[module].dependencies[relativePath])
            }
            const exports = {};
            (function(require,exports,code){
               eval(code) 
            })(PathRequire,exports,graph[module].code)
            return exports;
        }
        require('${this.entry}')
    })(${newCode})`;

    // 开始发射文件
    this.hooks.emit.call({
      assets: {
        [this.output.filename]: bundle
      }
    }, 'dd')

    // 生成main.js 位置是./dist目录
    !fs.existsSync(this.output.path) && fs.mkdirSync(this.output.path);
    fs.writeFileSync(filePath, bundle, "utf-8");
  }
};
