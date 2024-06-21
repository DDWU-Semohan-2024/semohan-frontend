const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/v2/local/geo/coord2address.json',
        createProxyMiddleware({
            target: 'https://dapi.kakao.com',
            changeOrigin: true,
            pathRewrite: {
                '^/v2/local/geo/coord2address.json': '/v2/local/geo/coord2address.json',
            },
        })
    );
};
