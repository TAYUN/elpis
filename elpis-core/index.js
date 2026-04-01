/**
 * Elpis 核心模块
 * 提供 Koa 服务启动能力
 */
const Koa = require('koa')
const path = require('path')
const env = require('./env')
// 使用 path.sep 作为路径分隔符，确保跨平台兼容性
const { sep } = path

const middleWareLoader = require('./loader/middleware')
const routerSchemaLoader = require('./loader/router-schema')
const serviceLoader = require('./loader/service')
const controllerLoader = require('./loader/controller')
const configLoader = require('./loader/config')
const extendLoader = require('./loader/extend')
const routerLoader = require('./loader/router')


module.exports = {
  /**
   * 启动 Koa 服务
   * @param {Object} options - 应用配置选项
   */
  start(options = {}) {
    // 创建 Koa 实例
    const app = new Koa()

    // 挂载配置
    app.options = options

    // 设置基础路径
    app.baseDir = process.cwd()

    // 设置业务代码路径 (app 目录)
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`)

    app.env = env()
    console.log(`-- [start] env: ${app.env.get()} --`)

    // 1. 加载中间件
    middleWareLoader(app)
    console.log('-- [start] middlewares loaded --')
    // 2. 加载routerSchema
    routerSchemaLoader(app)
    console.log(app.routerSchema)
    console.log('-- [start] routerSchemas loaded --')
    // 3. 加载controller
    controllerLoader(app)
    console.log('-- [start] controllers loaded --')
    // 4. 加载service
    serviceLoader(app)
    console.log('-- [start] services loaded --')
    // 5. 加载config
    configLoader(app)
    console.log('-- [start] configs loaded --')
    // 6. 加载extend
    extendLoader(app)
    console.log('-- [start] extends loaded --')
    // 7. 加载路由
    routerLoader(app)
    console.log('-- [start] routers loaded --')

    // 启动 HTTP 服务
    try {
      const port = process.env.PORT || 8080
      const host = process.env.IP || '0.0.0.0'
      app.listen(port, host)
      console.log(`Server is running at http://${host}:${port}`)
    } catch (error) {
      console.error(error)
    }
  },
}
