/* Version this list whenever changing the packaged app. Cache-first, local and predictable. */
const VERSION='maha-opening-v2.1.0';
const BASE=new URL('./',self.location.href).href;
const FILES=[
 './','./index.html','./css/style.css','./js/main.js','./js/hug.js','./js/flowers.js',
 './js/botanical.js','./js/room.js','./js/store.js','./js/time.js',
 './js/letters.js','./js/letter-unlocks.js','./content/letters.json','./content/config.json','./assets/letters/handwritten-placeholder.svg','./js/audio.js','./js/animation.js','./js/doors.js','./js/places.js','./js/portal.js',
 './content/hug.json','./content/flowers.json','./content/today.json',
 './assets/room-back.svg','./assets/room-front.svg','./assets/icon.svg',
 './assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png',
 './manifest.json'
];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(FILES.map(path=>new URL(path,BASE)));await self.skipWaiting();})());
});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('maha-opening-')&&k!==VERSION).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const u=new URL(event.request.url);
 if(u.origin!==self.location.origin)return; // GSAP is optional; animation fallbacks are local.
 if(!u.href.startsWith(BASE))return;
 event.respondWith((async()=>{
  const cache=await caches.open(VERSION);const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached)return cached;
  try {const response=await fetch(event.request);if(response.ok)cache.put(event.request,response.clone()).catch(()=>{});return response;}
  catch{return event.request.mode==='navigate'?(await cache.match(new URL('./index.html',BASE))||Response.error()):Response.error();}
 })());
});