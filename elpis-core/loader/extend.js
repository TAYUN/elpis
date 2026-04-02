/**
 * extend loader
 * 扩展加载器
 * 用于扩展框架和应用的 功能，可通过 'app.extend.${文件}` 访问
 * 与controller loader不太一样，这里是扁平结构，只有一层
 * 例子：
 * app/extend
 *    |------ custom-extend.js
 */
const path = require('path')
const glob = require('glob')
const { sep } = path
module.exports = (app) => {
  // 读取 app/extend/**/**.js 所有文件
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`)
  const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}*.js`))

  // 遍历所有文件目录，把内容加载到 app.extend 下
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径app/extend/custom-extend.js => custom-extend
    name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.'))

    // 把 ‘-’ 统一转成驼峰式 custom-extend.js => customExtend
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 过滤app中已经存在的key
    for (const key in app) {
      if (key === name) {
        console.log(`[extend load error] name: ${name} is already exists in app`)
        return
      }
    }
    // 挂载到 app 上
    app[name] = require(path.resolve(file))(app)
  })
}
