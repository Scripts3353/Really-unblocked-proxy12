// server.js – tiny, secure HTTP/HTTPS proxy
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8888;

// ---------- Optional basic auth ----------
const BASIC_USER = 'unblocker';
const BASIC_PASS = 'changeMe123';   // <<< CHANGE THIS!
app.use((req, res, next) => {
  const auth = { login: BASIC_USER, password: BASIC_PASS };
  const b64 = Buffer.from((req.headers.authorization || '').split(' ')[1] || '').toString();
  const [login, password] = b64.split(':');
  if (login === auth.login && password === auth.password) return next();
  res.set('WWW-Authenticate', 'Basic realm="Really unbl0ck3d"');
  return res.status(401).send('Authentication required.');
});

// ---------- Serve the UI ----------
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Proxy all other requests ----------
app.use('/', createProxyMiddleware({
  target: 'http://example.com',          // placeholder – overwritten per request
  changeOrigin: true,
  selfHandleResponse: false,
  router: (req) => {
    // Path is the full URL, e.g. /https://google.com/search?q=cat
    const raw = decodeURIComponent(req.path.slice(1));
    if (!raw) return 'http://httpbin.org';   // fallback
    const url = raw.startsWith('http') ? raw : `https://${raw}`;
    return url;
  },
  onProxyReq: (proxyReq) => {
    // Hide that we are a proxy
    proxyReq.removeHeader('via');
    proxyReq.removeHeader('x-forwarded-for');
  },
  onError: (err, req, res) => {
    res.status(502).send(`Proxy error: ${err.message}`);
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Really unbl0ck3d proxy listening on http://0.0.0.0:${PORT}`);
  console.log(`Open the UI at http://localhost:${PORT}`);
});
