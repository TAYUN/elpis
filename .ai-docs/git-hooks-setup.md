# Git Hooks 配置笔记

## 问题背景

项目中使用 `ghooks` 配置 git hooks，但提交代码时没有触发校验。

## 问题排查

### 1. 检查 hooks 是否生成

查看 `.git/hooks` 目录，发现只有 `.sample` 模板文件，没有实际的钩子文件。

```
.git/hooks/
  - pre-commit.sample    # 模板，不会执行
  - commit-msg.sample    # 模板，不会执行
```

### 2. ghooks 不兼容

`ghooks` 已多年未维护，与新版 Node.js 和 pnpm 不兼容，无法正确生成钩子文件。

## 解决方案：使用 Husky

### 安装依赖

```bash
# 移除旧的 ghooks
pnpm remove ghooks validate-commit-msg

# 安装 husky 和 commitlint
pnpm add -D husky @commitlint/cli @commitlint/config-conventional

# 初始化 husky
npx husky init
```

### 配置文件

#### 1. pre-commit 钩子

文件：`.husky/pre-commit`

```bash
pnpm run lint
```

#### 2. commit-msg 钩子

文件：`.husky/commit-msg`

```bash
npx --no -- commitlint --edit $1
```

#### 3. commitlint 配置

文件：`commitlint.config.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

#### 4. package.json

```json
{
  "scripts": {
    "lint": "eslint --quiet --ext js,vue .",
    "prepare": "husky"
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "@commitlint/cli": "^20.5.0",
    "@commitlint/config-conventional": "^20.5.0"
  }
}
```

> 注意：`prepare` 脚本会在 `pnpm install` 后自动执行，确保 hooks 正确注册。

### 提交信息规范

使用 commitlint 后，提交信息需符合 Conventional Commits 规范：

```
<type>: <description>
```

常用 type：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具变更

示例：
```bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复登录验证 bug"
```

## 相关知识点

### pnpm 命令区别

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装 package.json 中的依赖 |
| `pnpm add <pkg>` | 添加生产依赖 |
| `pnpm add <pkg> -D` | 添加开发依赖 |

### eslint . 的含义

`.` 表示当前目录，eslint 会递归扫描所有匹配 `--ext` 扩展名的文件。

### process.env.IP

`process.env.IP` 是环境变量，需要手动设置，不会自动获取本机 IP。

```bash
# Windows PowerShell 设置环境变量
$env:IP="127.0.0.1"; node index.js
```

`0.0.0.0` 表示监听所有网络接口，可通过 localhost、127.0.0.1 或局域网 IP 访问。

## 参考

- [Husky 官方文档](https://typicode.github.io/husky/)
- [Commitlint 官方文档](https://commitlint.js.org/)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
