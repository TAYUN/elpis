/**
 * @file router-schema
 * @param {Object} app - Koa应用实例
 * 路由 Schema 加载器
 * 用于加载和管理路由配置 schema
 * 通过 ‘json-schema & ajv' 对 api 规则进行约束，配合 api-params-verify 中间件使用
 * app/router-schema/**.js
 * 输出：app.routerSchema = {
 *  '${api1}': '${jsonSchema1}',
 *  '${api2}': '${jsonSchema2}',
 *  '${api3}': '${jsonSchema3}',
 * }
 */

const glob = require('glob')
const path = require('path')
const { sep } = path

module.exports = (app) => {
  // 读取 app/router-schema/**/**.js 所有文件
  const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`)
  const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}*.js`))
  // 注册所有路由，使得可以 'app.routerSchema' 这样访问
  let routerSchema = {}

  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file))
    }
  })

  app.routerSchema = routerSchema

}
