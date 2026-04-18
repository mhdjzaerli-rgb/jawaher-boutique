// Service Worker - محل جواهر PWA
const CACHE_NAME = 'jawaher-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js'
];

// تثبيت: تخزين الأصول المحلية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // فقط تخزين الملفات المحلية (بدون Firebase/CDN لتجنب أخطاء CORS)
      return cache.addAll(['./', './index.html', './manifest.json']);
    }).catch(() => {})
  );
  self.skipWaiting();
});

// تفعيل: حذف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// الطلبات: استراتيجية Network First (السحابة أولاً)
self.addEventListener('fetch', event => {
  // تجاهل طلبات Firebase والـ API
  if (event.request.url.includes('firestore') ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
