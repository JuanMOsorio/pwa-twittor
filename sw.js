// Imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMNUTABLE_CACHE = 'inmutable-v1';

const APP_SELL = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js'
];

const APP_SELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
];

// Intalación
self.addEventListener('install', event => {

  // Creando el cache estatico.
  const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SELL));
  // Creando el cache inmutable.
  const cacheInmutable = caches.open(IMNUTABLE_CACHE).then(cache => cache.addAll(APP_SELL_INMUTABLE));

  event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

// Borrar los caches anteriores.
self.addEventListener('activate', event => {
  const d = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }
    });
  });

  event.waitUntil(d);
});


self.addEventListener('fetch', event => {
  const respond = caches.match(event.resquest).then(res => {
    if (res) {
      return res;
    } else {
      return fetch(event.request).then(newRes => {
        return updateDynamicCache(DYNAMIC_CACHE, event.request, newRes);
      });
    }
  });

  event.respondWith(respond);
});