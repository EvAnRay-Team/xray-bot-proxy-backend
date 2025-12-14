// api/export.js

import { MongoClient } from 'mongodb';

// 仅从环境变量中读取 URI，保证安全
const uri = process.env.MONGODB_URI; 

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        // 确保只接受 GET 请求
        return res.status(405).send('Method Not Allowed');
    }

    // 假设您还需要一个简单的秘密密钥来防止意外访问
    const secretKey = req.headers.get('X-Proxy-Key');
    if (secretKey !== process.env.PROXY_KEY) {
        return res.status(401).send('Unauthorized');
    }

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        
        // 替换为您的数据库和集合名称
        const db = client.db('xray-mai-bot'); 
        const collection = db.collection('alias');

        // 获取数据
        const data = await collection.find({}).limit(10).toArray(); 

        // 设置响应头：允许跨域 (CORS) 和 JSON 下载
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="data_export.json"');
        
        return res.status(200).json(data);

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Data fetch failed' });
    } finally {
        if (client) {
            await client.close(); 
        }
    }
}