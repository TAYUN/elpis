const superagent = require('superagent')
module.exports = (app) => class BaseService {
  /**
   * service 基类
   * 统一收拢service 层的方法
   */
  constructor() {
    this.app = app
    this.config = app.config
    this.curl = superagent
  }
}