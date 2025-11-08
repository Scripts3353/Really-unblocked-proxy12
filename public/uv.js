const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  const target = decodeURIComponent(req.url.slice(1)) || 'https://example.com';
  if (!target.startsWith('http')) return res.status(400).send('Invalid URL');

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { '^/uv/': '' },
    onProxyRes: (proxyRes) => {
      // Basic rewrite for proxy links (UV-style)
      proxyRes.headers['x-frame-options'] = 'ALLOWALL';
      delete proxyRes.headers['content-security-policy'];
    },
    onError: (err) => res.status(500).send('Proxy error: ' + err.message)
  })(req, res);
};
