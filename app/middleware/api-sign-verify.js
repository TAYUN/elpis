/**
 * 校验api签名合法性
 */
const md5 = require('md5');
module.exports = (app) => {
  return async (ctx, next) => {
    //只对api请求做签名校验
    if(ctx.path.indexOf('api') < 0){
      return await next()
    }
    const { path, method } = ctx
    const { headers} = ctx.request
    const { s_sign: sSign, s_t: st} = headers
    const signKey = 'wrewerKe234K232Jfsdusd23K9sdJ2'
    const signnature = md5(`${signKey}_${st}`)
    app.logger.info(`[${method} ${path}] signature: ${signnature}`)
    if(!sSign || !st || signnature !== sSign.toLowerCase() || Date.now() - st > 600000){
      ctx.status = 200
      ctx.body = {
        success: false,
        code: 445,
        message: 'signature not correct or api timeout'
      }
      return
    }
    await next()
  }

}