# 阿里云 ESA 部署说明

## 文件说明

- `export.js` - 适配阿里云 ESA 的函数文件（使用 ES6 语法和 Request/Response 格式）

## 主要改动

1. **语法格式**：从 CommonJS (`require`/`exports`) 改为 ES6 (`import`/`export`)
2. **函数入口**：从 `exports.handler(event, context)` 改为 `export default async function handler(request)`
3. **请求对象**：使用标准的 `Request` 对象（`request.method`, `request.headers`）
4. **响应对象**：使用标准的 `Response` 对象（`new Response(body, options)`）

## 部署步骤

### 方式一：通过阿里云控制台部署

1. 登录阿里云控制台，进入 **边缘安全加速（ESA）** 服务
2. 选择 **边缘计算** > **边缘函数**
3. 创建新函数，上传 `export.js` 文件
4. 配置环境变量（如需要）：
   - `MONGODB_URI`: MongoDB 连接字符串
5. 配置路由规则，绑定域名

### 方式二：通过 Serverless Devs 部署

1. 安装 Serverless Devs：
```bash
npm install -g @serverless-devs/s
```

2. 配置阿里云凭证：
```bash
s config add
```

3. 在项目根目录创建 `s.yaml` 配置文件（参考项目根目录的 `s.yaml.example`）

4. 部署：
```bash
s deploy
```

## 注意事项

- 确保 MongoDB 连接字符串可以从边缘节点访问
- 建议将敏感信息（如数据库 URI）配置为环境变量
- 阿里云 ESA 支持直接导入 GitHub 仓库进行部署

