/**
 * router loader
 * @param {Object} app - Koa应用实例
 * 路由加载器
 * 用于加载和管理应用路由
 * 解析所有 app/router/ 下所有路由文件，加载到 KoaRouter 下
 * 
 */

const KoaRouter = require('koa-router')
const path = require('path')
const glob = require('glob')
const { sep } = path

module.exports = (app) => {
  // 找到路由文件路径
  const routerPath = path.resolve(app.businessPath, `.${sep}router`)
  // 实例化 KoaRouter
  const router = new KoaRouter()

  // 注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}*.js`))
  fileList.forEach((file) => {
    require(path.resolve(file))(app, router)
  })

  // 将 api 参数校验中间件挂载到路由下（确保 params 已注入）
  if (app.middlewares && app.middlewares.apiParamsVerify) {
    router.use('/api', app.middlewares.apiParamsVerify)
  }

  // 路由兜底（必须放在最后）
  router.get('*', async (ctx, next) => {
    ctx.status = 302
    ctx.redirect(`${app?.options?.homePage ?? '/'}`)
  })

  // 路由注册到app
  app.use(router.routes())
  app.use(router.allowedMethods())
};

// 潜在问题

// 1. path.resolve(file) 是冗余的：glob.sync() 已经返回绝对路径
// 2. 错误处理缺失：路由文件加载失败会导致整个应用崩溃
// 3. 无加载顺序控制：依赖执行顺序的路由可能出问题
// 4. 无日志反馈：加载了哪些路由、是否成功都不可见