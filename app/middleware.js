const path = require('path')
module.exports = (app) => {
  // 配置静态根目录
  const koaStatic = require('koa-static');
  app.use(koaStatic(path.resolve(process.cwd(), './app/public')));

  // 模板渲染引擎
  const koaNunjucks = require('koa-nunjucks-2')
  app.use(
    koaNunjucks({
      ext: 'tpl',
      path: path.resolve(process.cwd(), './app/public'),
      nunjucksConfig: {
        noCache: true,
        trimBlocks: true,
      },
    }),
  )

  // 引入 ctx.body 解析中间件
  const bodyParser = require('koa-bodyparser')
  app.use(bodyParser({
    formList: '1000mb',
    enableTypes: ['json', 'form', 'text']
  }))

  app.use(app.middlewares.errorHandle)
  app.use(app.middlewares.apiSignVerify)
  app.use(app.middlewares.apiParamsVerify)
}
