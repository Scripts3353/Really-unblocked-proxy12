// Basic UV Static SW (from UV-on-vercel guide)
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(location.origin + '/uv/')) {
    event.respondWith(fetch(event.request.url.replace('/uv/', '/api/uv/')));
  }
});
