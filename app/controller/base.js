module.exports = (app) =>
  class BaseController {
    /**
     * controller 基类
     * @param {Object} ctx 上下文
     */
    constructor() {
      this.app = app
      this.config = app.config
      // this.service = app.service
    }

    /**
     * API 处理成功时统一返回结构
     * @params {object} ctx 上下文
     * @params {object} data 核心数据
     * @params {metadata} metadata 其他数据
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data,
        metadata,
      }
    }

    /**
     * API 处理失败时同意返回结构
     * @param {object} ctx 上下文
     * @params {string} message 错误信息
     * @params {number} code 错误码
     */
    fail(ctx, message, code) {
      ctx.body = {
        success: false,
        message,
        code,
      }
    }
  }
