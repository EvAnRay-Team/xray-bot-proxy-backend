// netlify/functions/export.js

import { MongoClient } from 'mongodb';

// 从安全的环境变量中读取 URI
const uri = process.env.MONGODB_URI; 

// Netlify Functions 需要使用 exports.handler 格式，参数为 event 和 context
exports.handler = async (event, context) => {
    
    // 检查请求方法
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }
    
    // 从请求头中获取秘密密钥 (注意：在 Netlify 中，请求头是 event.headers)
    const secretKey = event.headers['x-proxy-key'];
    
    // 检查密钥
    if (secretKey !== process.env.PROXY_KEY) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        
        // 替换为您的数据库和集合名称
        const db = client.db('xray-mai-bot'); 
        const collection = db.collection('alias');

        // 1. 获取数据
        const data = await collection.find({}).limit(10).toArray();

        // 2. 返回 Netlify Functions 标准响应对象
        return {
            statusCode: 200,
            headers: {
                // 确保数据以 JSON 格式返回，并设置为下载附件
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename="data_export.json"'
            },
            body: JSON.stringify(data) // 响应体必须是字符串
        };

    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Data fetch failed' })
        };
    } finally {
        if (client) {
            await client.close(); 
        }
    }
}; // 别忘了末尾的 }