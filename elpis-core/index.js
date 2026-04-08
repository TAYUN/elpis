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
    // 第一阶段：基础能力（被依赖的先加载）
    // 1. 配置 - 所有模块都可能用
    configLoader(app)
    console.log('-- [start] configs loaded --')
    // 2. 扩展 - 先扩展 app，再加载业务
    extendLoader(app)

    // 第二阶段：业务模块（依赖上层）
    // 3. 服务
    serviceLoader(app)
    console.log('-- [start] services loaded --')
    // 4. 业务中间件（暂不注册）
    middleWareLoader(app)
    console.log('-- [start] middlewares loaded --')
    // 5. 路由 Schema
    routerSchemaLoader(app)
    console.log('-- [start] routerSchemas loaded --')
    // 6. 控制器
    controllerLoader(app)
    console.log('-- [start] controllers loaded --')

    // 第三阶段：注册（按洋葱模型）
    // 全局中间件（必须先注册，包裹所有请求）
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app)
      console.log(`-- [start] glob middleware.js loaded --`)
    } catch (error) {
      console.log(`[exception] glob middleware.js not found, skip loading middleware`)
    }
    console.log('-- [start] extends loaded --')

    // 路由及路由级中间件
    // 7. 路由（内部挂载路由级中间件）
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
