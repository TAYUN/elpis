module.exports = (app, router) => {
  const { view: viewController } = app.controller

  // 用户输入http://ip:port/view/page1 能渲染出相应页面
  router.get('/view/:page', viewController.renderPage.bind(viewController))

  // 根路径重定向到 page1
  router.get('/', async (ctx) => {
    ctx.redirect('view/page1')
  })
}
