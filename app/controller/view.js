module.exports = (app) =>{
  return class viewController {
    /**
     * 渲染页面
     * @param {Object} ctx 上下文 
     */
    async renderPage(ctx){
      await ctx.render(`output/entry.${ctx.params.page}`)

    }
  }
}