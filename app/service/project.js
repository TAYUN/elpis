module.exports = (app) => {
  return class ProjectService {
    /**
     * 获取项目列表
     */
    async getList() {
      return [
        { name: 'project1', desc: 'project1 desc' },
        { name: 'project2', desc: 'project2 desc' },
        { name: 'project3', desc: 'project3 desc' },
      ]
    }
  }
}
