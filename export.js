// 阿里云 ESA 边缘函数版本
// 适配阿里云 ESA 的 Request/Response 格式

import { MongoClient } from 'mongodb';

// 从环境变量中读取 URI（建议在阿里云 ESA 控制台配置环境变量）
const uri = process.env.MONGODB_URI || "mongodb://atlaseuan:ysygfy980@xwx.xiaokong.space:21017/admin";

// 阿里云 ESA 边缘函数入口
// 使用标准的 Request/Response 对象
export default async function handler(request) {
    // 检查请求方法
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', {
            status: 405,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }

    // 从请求头中获取秘密密钥
    const secretKey = 'Ysygfy980';
    const proxyKey = request.headers.get('X-Proxy-Key') || request.headers.get('proxy-key');
    
    // 检查密钥（如果需要）
    // if (proxyKey !== secretKey) {
    //     return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //         status: 401,
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    // }

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        
        // 数据库和集合名称
        const db = client.db('xray-mai-bot'); 
        const collection = db.collection('alias');

        // 获取数据
        const data = await collection.find({}).limit(10).toArray();

        // 返回响应（使用标准的 Response 对象）
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename="data_export.json"'
            }
        });

    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Data fetch failed' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        if (client) {
            await client.close(); 
        }
    }
}

