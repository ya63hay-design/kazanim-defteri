// Kazanım Defteri 2026-2027 — çevrimdışı çalışma
const SURUM="kdm-2627-v1";
const CEKIRDEK=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(SURUM).then(c=>c.addAll(CEKIRDEK)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==SURUM).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  // Önce ağ, olmazsa önbellek: güncellemeler hemen gelir, internetsiz de açılır
  e.respondWith(fetch(e.request).then(r=>{
    if(r&&(r.ok||r.type==="opaque")){const kopya=r.clone();caches.open(SURUM).then(c=>c.put(e.request,kopya));}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("./index.html"))));
});
