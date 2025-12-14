# Xray Bot Proxy Backend - 阿里云 ESA 版本

基于阿里云 ESA（边缘安全加速）边缘函数服务的后端项目。

## 项目结构

```
.
├── export.js          # 边缘函数主文件
├── local-server.js    # 本地测试服务器
├── package.json       # 项目依赖配置
├── s.yaml.example     # Serverless Devs 配置示例
├── 配置指南.md        # 详细的配置和部署指南
└── README.md          # 本文件
```

## 功能说明

- 从 MongoDB 数据库导出数据
- 支持 GET 请求
- 返回 JSON 格式数据

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地测试

在部署到阿里云之前，可以在本地测试函数：

```bash
# 启动本地测试服务器
npm run dev
# 或
npm start
```

服务器将在 `http://localhost:3000` 启动，访问 `http://localhost:3000/export` 测试函数。

**环境变量配置**（可选）：
- 创建 `.env` 文件（参考 `.env.example`）
- 或直接设置环境变量：
  ```bash
  export MONGODB_URI="your-mongodb-uri"
  export PORT=3000
  ```

**测试命令**：
```bash
# 使用 curl
curl http://localhost:3000/export

# 或使用浏览器直接访问
open http://localhost:3000/export
```

### 3. 配置部署

#### 方式一：通过阿里云控制台部署（推荐）

详细步骤请参考 [配置指南.md](./配置指南.md)

1. 登录 [阿里云 ESA 控制台](https://esa.console.aliyun.com/)
2. 创建边缘函数，上传 `export.js` 文件
3. 配置环境变量和触发器

#### 方式二：通过 Serverless Devs 部署

1. 安装 Serverless Devs：
```bash
npm install -g @serverless-devs/s
```

2. 配置阿里云凭证：
```bash
s config add
```

3. 复制配置文件：
```bash
cp s.yaml.example s.yaml
```

4. 编辑 `s.yaml`，填入实际配置

5. 部署：
```bash
s deploy
```

## 环境变量

建议在阿里云 ESA 控制台配置以下环境变量：

- `MONGODB_URI`: MongoDB 连接字符串

## 注意事项

- 确保 MongoDB 可以从边缘节点访问
- 建议将敏感信息配置为环境变量，不要硬编码
- 函数使用 ES6 模块语法（`import`/`export`）

## 参考文档

- [配置指南.md](./配置指南.md) - 详细的配置和部署步骤
- [阿里云 ESA 官方文档](https://help.aliyun.com/zh/edge-security-acceleration/esa/)

