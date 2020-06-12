const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    '/auth/*',
    createProxyMiddleware({
      target: 'https://desolate-badlands-28780.herokuapp.com',
      changeOrigin: true
    })
  );

  app.use(
    '/api*',
    createProxyMiddleware({
      target: 'https://desolate-badlands-28780.herokuapp.com',
      changeOrigin: true
    })
  );
};