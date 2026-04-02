/**
 * service loader
 * 服务加载器
 * 用于加载所有service，可通过 'app.service.${目录}.${文件}' 访问
 * 
 * 例子：
 * app/service
 *    |--- custom-module
 *      |------ custom-service.js
 * app.service.customModule.customService
 */
const glob = require('glob')
const path = require('path')
const { sep } = path

module.exports = (app) => {
  // 读取 app/service/**/**.js 所有文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`)
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}*.js`))

  // 遍历所有文件目录，把内容加载到 app.service 下
  const service = {}
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file)

    // 截取路径 app/service/custom-module/custom-service.js => custom-module/custom-service
    name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.'))

    // 把 '-' 统一转成驼峰式 custom-module/custom-service.js => customModule/customService
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载服务到 service 对象（使用游标模式构建嵌套结构）
    // 示例: name = 'customModule/customService' → names = ['customModule', 'customService']
    const names = name.split(sep)

    // 游标遍历：cursor 是"钻头"，逐层深入嵌套对象
    // service 是"根"，始终保存最终数据
    let cursor = service

    for (let i = 0; i < names.length; i++) {
      const key = names[i]
      const isLast = i === names.length - 1

      if (isLast) {
        // 到达最后一层，直接赋值服务函数
        // 例: cursor['customService'] = 服务函数
        const serviceModule = require(path.resolve(file))(app)
        cursor[key] = new serviceModule()
      } else {
        // 非最后一层，创建或进入下一层
        // 例: cursor['customModule'] 不存在则创建空对象
        if (!cursor[key]) {
          cursor[key] = {}
        }
        // 游标往里钻一层（引用传递，cursor 改变但 service 保持不变）
        cursor = cursor[key]
      }
    }
  })

  // 挂载到 app 上
  app.service = service
}
