export default {
  async fetch(request, env) {
    const incomingUrl = new URL(request.url);

    // 如果是要反代的路径，统一处理
    if (incomingUrl.pathname.startsWith('/')) {
      // 构造目标地址（带端口）
      const targetOrigin = "https://www.ltyfuq.asia:1025";
      const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, targetOrigin);

      // 克隆原始请求
      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "follow",
      });

      // 执行反代请求
      const response = await fetch(proxyRequest);

      // 可选：为前端跨域请求添加 CORS headers
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      newHeaders.set("Access-Control-Allow-Headers", "*");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // 非反代请求，走静态资源（如有）
    return env.ASSETS.fetch(request);
  }
};
