/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

const worker=self as unknown as ServiceWorkerGlobalScope;
const cache=`tropico-planer-${version}`;
const assets=[...build,...files];

worker.addEventListener('install',event=>event.waitUntil(caches.open(cache).then(c=>c.addAll(assets)).then(()=>worker.skipWaiting())));
worker.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==cache).map(key=>caches.delete(key)))).then(()=>worker.clients.claim())));
worker.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(cached=>cached??fetch(event.request).then(response=>{const copy=response.clone();caches.open(cache).then(c=>c.put(event.request,copy));return response;}).catch(()=>caches.match(assets[0]) as Promise<Response>)));
});
