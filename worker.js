addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'POST') {
    const { prompt } = await request.json();
    
    // 文心一言API调用
    const apiKey = '你的API Key';
    const secretKey = '你的Secret Key';
    
    // 获取Access Token
    const tokenResponse = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
    );
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // 调用模型
    const response = await fetch(
      `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1  // 降低随机性
        })
      }
    );
    
    const data = await response.json();
    return new Response(JSON.stringify({ result: data.result }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
}