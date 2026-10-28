import {store} from './store.js';
import {flowerSVG,bouquetMarkup,downloadBouquet} from './botanical.js';
import {soundEffect} from './audio.js';
import {move,delay} from './animation.js';
const esc=x=>String(x).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
export function mountFlowers(root,flowers,onDone){
 let chosen=[],complete=false,disposed=false;
 root.innerHTML=`<section class="scene flowers-scene" aria-label="Choose seven flowers">
   <div class="flowers-top">
     <div class="flower-intro"><span class="eyebrow">02 / THIS ONE'S FOR YOU</span><h1>Seven flowers.<br><em>Your rules.</em></h1><p id="flower-subtitle">Pick any seven blooms. Yes, seven roses if you want. This florist minds her business.</p></div>
     <div class="flower-status-row">
       <div class="flower-counter" id="flower-counter" aria-live="polite"><strong>0 <span>of 7</span></strong><span class="counter-caption">picked by Maha</span></div>
       <div class="flower-status-note"><span id="flower-instruction">Choose your flowers</span><small>Every flower can be picked again</small></div>
     </div>
   </div>
   <div class="bouquet-display" id="bouquet-display"><span class="bouquet-hint" id="bouquet-hint">Your little bunch begins here <span aria-hidden="true">↘</span></span><div class="bouquet-growing" id="bouquet-growing"></div><div class="petals" aria-hidden="true"><i>✿</i><i>✿</i><i>✿</i><i>✿</i><i>✿</i></div></div>
   <div class="flower-bottom" id="flower-bottom"><div class="shelf-heading"><span>Choose your flowers</span><span class="shelf-hint">SCROLL DOWN · PICK ANY ONE AGAIN</span></div><div class="flower-browser flower-browser-v2"><div id="flower-rail" class="flower-rail" role="group" aria-label="Thirteen flowers. Repeats allowed."></div></div><div class="meaning-line" id="meaning-line" aria-live="polite">Choose from all thirteen. Tap a favourite seven times if you like.</div><div class="flower-controls"><button class="text-button" id="undo-flower" disabled>↶ Undo</button><button class="text-button" id="reset-flowers" disabled>Reset ↺</button></div></div>
   <div class="bouquet-final" id="bouquet-final" hidden><span class="eyebrow">HAND-PICKED. VERY OFFICIAL.</span><h2>For Maha. <span aria-hidden="true">♡</span></h2><p>Seven chosen by you. Which makes them the right seven.</p><div class="final-controls"><button class="button button-outline" id="save-bouquet">Save as picture ↓</button><button class="button button-primary" id="carry-bouquet">Take them in →</button></div><p class="export-hint" id="export-hint"></p></div>
 </section>`;
 const rail=root.querySelector('#flower-rail'),renderPlace=root.querySelector('#bouquet-growing'),display=root.querySelector('#bouquet-display');
 for(const f of flowers){
  const btn=document.createElement('button');btn.type='button';btn.className='flower-option';btn.dataset.flower=f.id;btn.setAttribute('aria-pressed','false');btn.setAttribute('aria-label',`${f.name}: ${f.meaning}`);
  btn.innerHTML=`<span class="option-art">${flowerSVG(f.id)}</span><span class="option-label">${esc(f.name)}</span><span class="flower-add" aria-hidden="true">+ add</span><span class="picked-check" aria-hidden="true">✓</span>`;
  btn.addEventListener('click',()=>pick(f,btn));rail.append(btn);
 }
 function update(){
  root.querySelector('#flower-counter').innerHTML=`<strong>${chosen.length} <span>of 7</span></strong><span class="counter-caption">picked by Maha</span>`;
  renderPlace.innerHTML=chosen.length?bouquetMarkup(chosen,{stage:complete?'final':'preview'}):'';
  rail.querySelectorAll('button').forEach(b=>{const count=chosen.filter(id=>id===b.dataset.flower).length;b.setAttribute('aria-pressed',String(count>0));b.disabled=complete;b.querySelector('.picked-check').textContent=count?`×${count}`:'';});
  root.querySelector('#undo-flower').disabled=!chosen.length||complete; root.querySelector('#reset-flowers').disabled=!chosen.length||complete;
  root.querySelector('#bouquet-hint').hidden=chosen.length>0;
 }
 function updateInstruction(text){root.querySelector('#flower-instruction').textContent=text;}
 function pick(f,button){
  if(complete||chosen.length>=7) return;
  chosen.push(f.id); root.querySelector("#flower-counter").classList.remove("counter-pop"); void root.querySelector("#flower-counter").offsetWidth; root.querySelector("#flower-counter").classList.add("counter-pop"); soundEffect('pick'); update(); root.querySelector('#meaning-line').textContent=f.meaning;
  if(button&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   button.classList.remove('flower-just-picked');void button.offsetWidth;button.classList.add('flower-just-picked');
   const last=renderPlace.querySelector('.bouquet-bloom:last-child');if(last){last.classList.add('bloom-new');setTimeout(()=>last.classList.remove('bloom-new'),900)}
  }
  if(chosen.length===7) finish(); else updateInstruction(`${7-chosen.length} more to go`);
 }
 root.querySelector('#undo-flower').addEventListener('click',()=>{
  if(complete||!chosen.length) return;
  chosen.pop(); soundEffect('undo'); update(); root.querySelector('#meaning-line').textContent='Changed your mind? Excellent flower-shop behaviour.';
  updateInstruction(chosen.length?`${7-chosen.length} more to go`:'Choose your flowers');
 });
 root.querySelector('#reset-flowers').addEventListener('click',()=>{
  if(complete) return;
  chosen=[]; soundEffect('undo'); update(); root.querySelector('#meaning-line').textContent='Fresh start. Take your time.'; updateInstruction('Choose your flowers');
 });
 async function finish(){
  complete=true; store.set('flowers',chosen); soundEffect('complete');
  root.querySelector('#flower-rail').classList.add('shelf-out');
  root.querySelector('.flower-intro').classList.add('flower-intro-fade');
  root.querySelector('#flower-bottom').classList.add('flower-bottom-exit');
  updateInstruction('Gathering them for you…');
  await delay(250); if(disposed) return;
  renderPlace.innerHTML=bouquetMarkup(chosen,{wrapped:false,stage:'gather'});
  display.classList.add('bouquet-gathering');
  await delay(1650); if(disposed) return;
  renderPlace.innerHTML=bouquetMarkup(chosen,{wrapped:true,stage:'final'});
  display.classList.remove('bouquet-gathering');
  display.classList.add('bouquet-wrapping');
  await delay(3400); if(disposed) return;
  root.querySelector('#flower-bottom').hidden=true;
  root.querySelector('#bouquet-final').hidden=false;
  await move(root.querySelector('#bouquet-final'),{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'},500);
 }
 root.querySelector('#save-bouquet').addEventListener('click',async(e)=>{
  const button=e.currentTarget; button.disabled=true; button.textContent='Making your picture…';
  try{await downloadBouquet(chosen); root.querySelector('#export-hint').textContent='Saved! On iPhone, if the picture opens instead, touch and hold it to save.';}
  catch{root.querySelector('#export-hint').textContent='PNG export was blocked by this browser. Try Safari or Chrome.';}
  finally{if(!disposed){button.disabled=false;button.textContent='Save as picture ↓';}}
 });
 root.querySelector('#carry-bouquet').addEventListener('click',async()=>{
  if(disposed) return;
  const b=root.querySelector('.bouquet-growing');
  await move(b,{transform:'translate3d(0,0,0) scale(1)',opacity:1},{transform:'translate3d(37%, -30%, 0) scale(.28)',opacity:.25},740);
  if(!disposed){disposed=true; onDone(chosen);} 
 });
 update();
 return ()=>{disposed=true;};
}