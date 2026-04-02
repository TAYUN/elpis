/**
 * config loader
 * @param {Object} app - Koa应用实例
 * 配置加载器
 * 用于加载和管理应用配置
 * 配置区分 本地/测试/生产，通过 env 环境读取不同文件配置 env.config
 * 通过 env.config 覆盖 default.config 加载到 app.config 中
 *
 * 对应根目录 config 下的配置
 * 默认配置 config.default.js
 * 本地配置 config.local.js
 * 测试配置 config.beta.js
 * 生产配置 config.prod.js
 */

const path = require('path')
const { sep } = path
module.exports = (app) => {
  // 找到 config/ 目录
  const configPath = path.resolve(app.baseDir, `.${sep}config`)
  // 获取default.config
  let defaultConfig = {}

  try {
    defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`))
  } catch (error) {
    console.log('[exception] default.config not found')
  }

  // 获取环境env.config（环境配置用于覆盖默认配置）
  let envConfig = {}

  try {
    if (app.env.isLocal()) {
      // 本地环境
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`))
    } else if (app.env.isBeta()) {
      // 测试环境
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`))
    } else if (app.env.isProduction()) {
      // 生产环境
      envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`))
    }
    // 其他情况 envConfig 保持为 {}，使用默认配置
  } catch (error) {
    console.log('[exception] env.config not found, use default config')
  }

  // 挂载到app上（环境配置覆盖默认配置）
  app.config = Object.assign({}, defaultConfig, envConfig)
}
