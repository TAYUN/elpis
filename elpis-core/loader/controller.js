/**
 * controller loader
 * 控制器加载器
 * 用于加载所有controller，可通过 ‘app.controller.${目录}.${文件}` 访问
 * 
 * 例子：
 * app/controller
 *    |--- custom-module
 *      |------ custom-controller.js
 * app.conterller.customModule.customController
 */
const glob = require('glob')
const path = require('path')
const { sep } = path

module.exports = (app) => {
  // 读取 app/controller/**/**.js 所有文件
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`)
  const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}*.js`))

  // 遍历所有文件目录，把内容加载到 app.controller 下
  const controller = {}
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径app/controller/custom-module/custom-controller.js => custom-module/custom-controller
    name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.'))

    // 把 ‘-’ 统一转成驼峰式 custom-module/custom-controller.js => customModule/customController
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载中间件到 controller 对象（使用游标模式构建嵌套结构）
    // 示例: name = 'customModule/customController' → names = ['customModule', 'customController']
    const names = name.split(sep)

    // 游标遍历：cursor 是"钻头"，逐层深入嵌套对象
    // controller 是"根"，始终保存最终数据
    let cursor = controller

    for (let i = 0; i < names.length; i++) {
      const key = names[i]
      const isLast = i === names.length - 1

      if (isLast) {
        // 到达最后一层，直接赋值中间件函数
        // 例: cursor['customController'] = 中间件函数
        const controllerModule = require(path.resolve(file))(app)
        cursor[key] = new controllerModule()
      } else {
        // 非最后一层，创建或进入下一层
        // 例: cursor['customModule'] 不存在则创建空对象
        if (!cursor[key]) {
          cursor[key] = {}
        }
        // 游标往里钻一层（引用传递，cursor 改变但 controller 保持不变）
        cursor = cursor[key]
      }
    }
  })

  // 挂载到 app 上
  app.controller = controller
}
