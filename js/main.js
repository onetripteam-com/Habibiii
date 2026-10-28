import {store,beginVisit} from './store.js';
import {mountHug} from './hug.js';
import {mountFlowers} from './flowers.js';
import {mountRoom} from './new-home.js';
import {initAudioUI,startSound} from './audio.js';
import {move} from './animation.js';
const root=document.querySelector('#scene-root'),frame=document.querySelector('#app');
let unmount=()=>{};
const getJSON=async(path)=>{const r=await fetch(new URL(path,import.meta.url));if(!r.ok)throw new Error(`${path}: HTTP ${r.status}`);return r.json();};
async function init(){
 initAudioUI();
 // GSAP is optional progressive enhancement. CSS/Web Animations stay functional offline.
 const [hug,flowerList,todayLines]=await Promise.all([
  getJSON('../content/hug.json'),getJSON('../content/flowers.json'),getJSON('../content/today.json')]);
 const visits=beginVisit();const previousVisit=store.get('lastVisit');
 const catalogue={hug,flowerList,todayLines};
 function transition(type,render){unmount();frame.dataset.scene=type;root.innerHTML='';render();}
 function sceneHug(){transition('hug',()=>{unmount=mountHug(root,hug,sceneFlowers);});}
 function sceneFlowers(){transition('flowers',()=>{unmount=mountFlowers(root,flowerList,chosen=>{
  store.set('flowers',chosen);store.set('completed',true);sceneRoom(chosen);
 });});}
 function sceneRoom(chosen){
  transition('room',()=>{unmount=mountRoom(root,{flowers:{today:todayLines},chosen,lastVisit:previousVisit,visits,onReplay:sceneHug,onNewBouquet:sceneFlowers});});
  store.set('lastVisit',Date.now());
 }
 const flowers=store.get('flowers',[]);
 const valid=Array.isArray(flowers)&&flowers.length===7&&flowers.every(id=>flowerList.some(f=>f.id===id));
 if(store.get('completed')&&valid){sceneRoom(flowers);}else{sceneHug();}
 // User gesture only: never start audio from page load, visibility or SW.
 document.addEventListener('pointerdown',event=>{if(event.isTrusted)startSound();},{once:true,passive:true});
 if('serviceWorker' in navigator && location.protocol.startsWith('http')){
   window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{}),{once:true});
 }
}
init().catch(err=>{
 console.error('MAHA could not initialize:',err);
 frame.dataset.scene='error';root.innerHTML=`<section class="scene" style="padding:25%;text-align:center"><h1 style="font:32px Georgia">Oops, a page went missing.</h1><p style="line-height:1.5">Open this site from GitHub Pages, Cloudflare Pages, or a local HTTP server. It won’t run directly from a file.</p><button class="button button-primary" onclick="location.reload()">Try again</button></section>`;
});