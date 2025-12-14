// 本地测试服务器
// 模拟阿里云 ESA 边缘函数环境

import http from 'http';
import handler from './export.js';

const PORT = process.env.PORT || 3000;

// 将 Node.js 的 IncomingMessage 转换为标准的 Request 对象
function createRequest(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // 构建 headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
            headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        }
    }
    
    // 创建标准的 Request 对象
    return new Request(url.toString(), {
        method: req.method,
        headers: headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req : null,
    });
}

// 将 Response 对象转换为 Node.js 的 ServerResponse
async function sendResponse(response, res) {
    // 设置状态码
    res.statusCode = response.status;
    
    // 设置响应头
    for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
    }
    
    // 获取响应体
    const body = await response.text();
    res.end(body);
}

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        
        // 只处理 /export 路径（模拟 ESA 路由配置）
        if (req.url !== '/export' && !req.url.startsWith('/export?')) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
                error: 'Not Found',
                message: 'Function only available at /export'
            }));
            return;
        }
        
        // 创建 Request 对象
        const request = createRequest(req);
        
        // 调用函数处理器
        const response = await handler(request);
        
        // 发送响应
        await sendResponse(response, res);
        
    } catch (error) {
        console.error('Server error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
            error: 'Internal Server Error',
            message: error.message 
        }));
    }
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`\n🚀 本地测试服务器已启动`);
    console.log(`📍 访问地址: http://localhost:${PORT}/export`);
    console.log(`\n测试命令:`);
    console.log(`  curl http://localhost:${PORT}/export`);
    console.log(`  或直接在浏览器打开: http://localhost:${PORT}/export\n`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

