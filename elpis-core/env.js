/**
 * 环境检测模块
 * 用于检测当前运行环境并提供相关方法
 * @param {Object} app - Koa应用实例
 */
module.exports = (app) => {
  return {
    /**
     * 检查是否为本地开发环境
     * @returns {boolean}
     */
    isLocal() {
      return process.env._ENV === 'local'
    },

    /**
     * 检查是否为测试环境
     * @returns {boolean}
     */
    isBeta() {
      return process.env._ENV === 'beta'
    },

    /**
     * 检查是否为生产环境
     * @returns {boolean}
     */
    isProduction() {
      return process.env._ENV === 'production'
    },

    /**
     * 获取当前环境名称
     * @returns {string} 环境名称，默认为 'local'
     */
    get() {
      return process.env._ENV ?? 'local'
    },
  }
}
