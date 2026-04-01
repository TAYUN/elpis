const Koa = require('koa')

module.exports = {
    start() {
        // 创建koa实例
        const app = new Koa()
        // 启动服务
        try {
            console.log(process.env)
            const port = process.env.PORT || 8080
            const host = process.env.IP || '0.0.0.0'
            app.listen(port, host)
            console.log(`Server is running at http://${host}:${port}`)
        } catch (error) {
            console.error(error)

        }
    }
}