addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'POST') {
    const { prompt } = await request.json();
    
    // 阿里通义千问API调用
    // 新版API只有一个Key，无需Secret
    const apiKey = 'sk-922efc99d9ce4584802df2d5d3c5a9f3'; // 请替换为你的实际API Key
    const apiEndpoint = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    
    try {
      // 调用阿里通义千问API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-turbo', // 使用通义千问的 turbo 模型
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1
        })
      });
      
      const data = await response.json();
      
      // 处理API返回的数据格式
      let resultText = '';
      if (data.choices && data.choices.length > 0) {
        resultText = data.choices[0].message.content;
      } else {
        resultText = 'API返回格式异常';
      }
      
      return new Response(JSON.stringify({ result: resultText }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
      
    } catch (error) {
      console.error('通义千问API调用失败:', error);
      return new Response(JSON.stringify({ result: `调用失败: ${error.message}` }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}