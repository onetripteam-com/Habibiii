/* Version this list whenever changing the packaged app. Cache-first, local and predictable. */
const VERSION='maha-worlds-v6.0.1';
const BASE=new URL('./',self.location.href).href;
const FILES=[
 './','./index.html','./css/style.css','./css/refresh.css','./css/new-home.css','./js/main.js','./js/hug.js','./js/flowers.js',
 './js/botanical.js','./js/room.js','./js/new-home.js','./js/home-art.js','./js/room-studio.js','./js/store.js','./js/time.js',
 './js/letters.js','./js/letter-unlocks.js','./content/letters.json','./content/config.json','./assets/letters/handwritten-placeholder.svg','./js/audio.js','./js/animation.js','./js/doors.js',
 './js/arcade.js','./js/games/common.js','./js/games/rules.js',
 './js/games/softlanding.js','./js/games/spark.js','./js/games/lettersmile.js','./js/games/baggage.js',
 './js/games/phase2-rules.js','./js/games/doctor.js','./js/games/world.js','./js/games/vlog.js','./js/places.js','./js/portal.js',
 './js/media-control.js','./js/cinema.js','./js/radio.js','./js/travel.js','./js/garden.js','./js/rest.js','./content/comfort.json',
 './content/movies.json','./content/radio.json','./content/places.json',
 './assets/video/kerala.en.vtt','./assets/video/kerala.ml.vtt',
 './assets/video/kuwait.en.vtt','./assets/video/kuwait.ml.vtt',
 './assets/video/places.en.vtt','./assets/video/places.ml.vtt',
 './assets/video/trailer.en.vtt','./assets/video/trailer.ml.vtt',
 './content/hug.json','./content/flowers.json','./content/today.json',
 './assets/room-back.svg','./assets/room-front.svg','./assets/room-theme-monsoon.svg','./assets/room-theme-sunroom.svg','./assets/room-theme-terracotta.svg','./assets/room-theme-midnight.svg','./assets/room-theme-cosmos.svg','./assets/icon.svg',
 './assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png',
 './js/director.js','./js/painted-worlds.js','./js/fm-atmosphere.js',
 './css/directors-cut.css','./css/studio.css','./assets/room-directors-cut.svg',
 './manifest.json'
];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(FILES.map(path=>new URL(path,BASE)));await self.skipWaiting();})());
});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>(k.startsWith('maha-opening-')||k.startsWith('maha-studio-')||k.startsWith('maha-worlds-'))&&k!==VERSION).map(k=>caches.delete(k)));await self.clients.claim();})());});
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