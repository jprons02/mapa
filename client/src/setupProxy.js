//Proxy needed for double server set up in local development only.

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    '/auth/*',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true
    })
  );

  app.use(
    '/api*',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true
    })
  );
};