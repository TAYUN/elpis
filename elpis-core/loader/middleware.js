/**
 * 中间件加载器
 * 用于加载和管理应用中间件, 可通过`app.middleware.${目录}.${文件名}`访问
 * @param {Object} app - Koa应用实例
 * => app.middleware.customModule.custoModule.js
 */

const glob = require('glob')
const path = require('path')
const { sep } = path

module.exports = (app) => {
  // 读取 app/middleware/**/**.js 所有文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`)
  const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}*.js`))

  // 遍历所有文件目录，把内容加载到app.middleware下
  const middleware = {}
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
    name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf('.'))

    // 把 ‘-’ 统一转成驼峰式 custom-module/custom-middleware.js => customModule/customMiddleware
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载中间件到 middleware 对象（使用游标模式构建嵌套结构）
    // 示例: name = 'customModule/customMiddleware' → names = ['customModule', 'customMiddleware']
    const names = name.split(sep)

    // 游标遍历：cursor 是"钻头"，逐层深入嵌套对象
    // middleware 是"根"，始终保存最终数据
    let cursor = middleware

    for (let i = 0; i < names.length; i++) {
      const key = names[i]
      const isLast = i === names.length - 1

      if (isLast) {
        // 到达最后一层，直接赋值中间件函数
        // 例: cursor['customMiddleware'] = 中间件函数
        cursor[key] = require(path.resolve(file))(app)
      } else {
        // 非最后一层，创建或进入下一层
        // 例: cursor['customModule'] 不存在则创建空对象
        if (!cursor[key]) {
          cursor[key] = {}
        }
        // 游标往里钻一层（引用传递，cursor 改变但 middleware 保持不变）
        cursor = cursor[key]
      }
    }
  })
}
