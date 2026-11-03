import {store} from './store.js';
import {flowerSVG,bouquetMarkup,downloadBouquet} from './botanical.js';
import {soundEffect} from './audio.js';
import {move,delay} from './animation.js';
const esc=x=>String(x).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
const floristWords={
 rose:'The classic. Yes, it earned that reputation.',peony:'A little dramatic. In the nicest possible way.',sunflower:'Bringing its own sunshine. Very efficient.',tulip:'All neat lines and quiet confidence.',lily:'The elegant one who never needs to announce it.',orchid:'A bit fancy. Completely allowed.',hibiscus:'A little Kerala sunshine has arrived.',lotus:'Taking its own time. Good idea.',jasmine:'Small flower. Entire room changed.',marigold:'The unofficial festival committee is here.',daisy:'The easy-going one. No big introduction.',lavender:'That is a very good excuse to slow down.',iris:'A little colour with opinions.'
};
export function mountFlowers(root,flowers,onDone,onCancel=null){
 let chosen=[],complete=false,disposed=false;
 root.innerHTML=`<section class="scene flowers-scene flower-studio" data-source-scene="${['story','kerala','bengaluru'].includes(store.get('roomTheme'))?store.get('roomTheme'):'story'}" aria-label="The flower studio: choose seven blooms">
  <div class="flower-studio-background" aria-hidden="true"></div>
  <div class="flower-studio-layout">
   <div class="flower-studio-preview">
    <div class="flowers-top">
     <div class="flower-intro"><span class="eyebrow">MAHA / THE FLOWER STUDIO <span class="studio-edition">A LITTLE ESCAPE · VOL. 07</span></span><h1>Make something <em>lovely.</em></h1><p id="flower-subtitle">Seven flowers. One little bunch. Pick the same one again if it's your favourite.</p></div>
     <div class="flower-status-row">
      <div class="flower-counter" id="flower-counter" aria-live="polite"><strong>0 <span>of 7</span></strong><span class="counter-caption">STEMS COLLECTED</span></div>
      <div class="flower-status-note"><span id="flower-instruction">Start with whatever catches your eye.</span><small>Seven is the only rule.</small></div>
     </div>
     <div id="flower-steps" class="flower-steps" role="group" aria-label="The seven places in your bouquet; tap a placed flower to remove it"></div>
    </div>
    <div class="bouquet-display" id="bouquet-display">
     <span class="bouquet-hint" id="bouquet-hint">Your bouquet grows here.<span aria-hidden="true">✳</span></span>
     <div class="bouquet-growing" id="bouquet-growing"></div>
     <div class="petals" aria-hidden="true"><i>✿</i><i>✿</i><i>✿</i><i>✿</i><i>✿</i></div>
    </div>
    <span class="flower-studio-caption" aria-hidden="true"><i>✳</i> CHOSEN BY YOU · MADE TO KEEP</span>
   </div>
   <div class="flower-bottom flower-studio-editor" id="flower-bottom">
    <div class="shelf-heading"><span><small>THE FLOWER BAR</small> Find your seven.</span><span class="shelf-hint">13 BLOOMS · REPEATS WELCOME</span></div>
    <div class="flower-browser flower-browser-v2"><div id="flower-rail" class="flower-rail" role="group" aria-label="Thirteen different flowers. Tap more than once to add repeats."></div></div>
    <div class="flower-editor-footer">
     <div class="meaning-line" id="meaning-line" aria-live="polite">Pick the ones you like. We'll worry about arranging them.</div>
     <div class="flower-controls"><button type="button" class="text-button" id="undo-flower" disabled>↶ Undo last</button><button type="button" class="text-button" id="reset-flowers" disabled>Start over ↻</button><button type="button" class="text-button studio-exit" id="cancel-flowers" ${store.get('completed')?'':'hidden'}>← Back to room</button></div>
    </div>
   </div>
  </div>
  <div class="bouquet-final" id="bouquet-final" hidden><span class="eyebrow">ALL SEVEN, BEAUTIFULLY UNPLANNED</span><h2>That's your bunch. <span aria-hidden="true">✳</span></h2><p>Made by Maha. Obviously a very exclusive collection.</p><div class="final-controls"><button class="button button-outline" id="save-bouquet">Save as picture ↓</button><button class="button button-primary" id="carry-bouquet">Take them home ↗</button></div><p class="export-hint" id="export-hint"></p></div>
 </section>`;
 const rail=root.querySelector('#flower-rail'),renderPlace=root.querySelector('#bouquet-growing'),display=root.querySelector('#bouquet-display');
 for(const f of flowers){
  const btn=document.createElement('button');btn.type='button';btn.className='flower-option';btn.dataset.flower=f.id;btn.setAttribute('aria-pressed','false');btn.setAttribute('aria-label',`${f.name}: ${f.meaning}`);
  btn.innerHTML=`<span class="flower-option-index" aria-hidden="true">${String(flowers.indexOf(f)+1).padStart(2,'0')}</span><span class="option-art">${flowerSVG(f.id)}</span><span class="flower-option-meta"><span class="option-label">${esc(f.name)}</span><span class="flower-add" aria-hidden="true">+ ADD</span></span><span class="picked-check" aria-hidden="true"></span>`;
  btn.addEventListener('click',()=>pick(f,btn));rail.append(btn);
 }
 function update(){
  root.querySelector('#flower-counter').innerHTML=`<strong>${chosen.length} <span>of 7</span></strong><span class="counter-caption">picked by Maha</span>`;
  root.querySelector('#flower-steps').innerHTML=Array.from({length:7},(_,i)=>{const id=chosen[i];const flower=flowers.find(f=>f.id===id);return id?`<button type="button" class="flower-step is-picked" data-remove-slot="${i}" title="Remove ${esc(flower?.name||'flower')}" aria-label="Remove ${esc(flower?.name||'flower')} from slot ${i+1}"><i aria-hidden="true">✳</i></button>`:`<span class="flower-step" aria-label="Empty flower slot ${i+1}"><i aria-hidden="true">${String(i+1).padStart(2,'0')}</i></span>`}).join('');
  renderPlace.innerHTML=chosen.length?bouquetMarkup(chosen,{stage:complete?'final':'preview'}):'';
  rail.querySelectorAll('button').forEach(b=>{const count=chosen.filter(id=>id===b.dataset.flower).length;b.setAttribute('aria-pressed',String(count>0));b.disabled=complete;b.querySelector('.picked-check').textContent=count?`${count} PICKED`:'';b.querySelector('.flower-add').textContent=count?'+ AGAIN':'+ ADD';});
  root.querySelector('#undo-flower').disabled=!chosen.length||complete; root.querySelector('#reset-flowers').disabled=!chosen.length||complete;
  root.querySelector('#bouquet-hint').hidden=chosen.length>0;
  root.querySelector('.flower-studio-preview').dataset.placed=String(chosen.length);
 }
 function updateInstruction(text){root.querySelector('#flower-instruction').textContent=text;}
 function pick(f,button){
  if(complete||chosen.length>=7) return;
  chosen.push(f.id); root.querySelector("#flower-counter").classList.remove("counter-pop"); void root.querySelector("#flower-counter").offsetWidth; root.querySelector("#flower-counter").classList.add("counter-pop"); soundEffect('pick'); update(); const repeats=chosen.filter(id=>id===f.id).length;
  root.querySelector('#meaning-line').textContent=`${String(chosen.length).padStart(2,'0')} / 07 — ${repeats>1?`Another ${f.name.toLowerCase()}? You've made your choice, and I respect it.`:floristWords[f.id]||f.meaning}`;
  if(button&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   button.classList.remove('flower-just-picked');void button.offsetWidth;button.classList.add('flower-just-picked');
   const last=renderPlace.querySelector('.bouquet-bloom:last-child');if(last){last.classList.add('bloom-new');setTimeout(()=>last.classList.remove('bloom-new'),900)}
  }
  if(chosen.length===7) finish(); else updateInstruction(`${7-chosen.length} more to go`);
 }
 root.querySelector('#flower-steps').addEventListener('click',event=>{
  const slot=event.target.closest('[data-remove-slot]');
  if(!slot||complete||disposed)return;
  const index=Number(slot.dataset.removeSlot);
  if(!Number.isInteger(index)||index<0||index>=chosen.length)return;
  const removed=chosen.splice(index,1)[0];
  soundEffect('undo');update();
  const flower=flowers.find(f=>f.id===removed);
  root.querySelector('#meaning-line').textContent=`${flower?.name||'That one'} is back on the shelf. You can always pick it again.`;
  updateInstruction(`${7-chosen.length} more to go`);
  rail.querySelector('[data-flower="'+removed+'"]')?.focus({preventScroll:true});
 });
 const cancel=root.querySelector('#cancel-flowers');
 if(onCancel&&cancel&&!cancel.hidden)cancel.addEventListener('click',()=>{if(disposed)return;disposed=true;onCancel()});
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
  complete=true; root.querySelector('.flowers-scene').classList.add('is-complete'); store.set('flowers',chosen); soundEffect('complete');
  root.querySelector('#flower-rail').classList.add('shelf-out');
  root.querySelector('.flower-intro').classList.add('flower-intro-fade');
  root.querySelector('#flower-bottom').classList.add('flower-bottom-exit');
  updateInstruction('Gathering them for you…');
  await delay(250); if(disposed) return;
  renderPlace.innerHTML=bouquetMarkup(chosen,{wrapped:false,stage:'gather'});
  display.classList.add('bouquet-gathering');
  await delay(650); if(disposed) return;
  renderPlace.innerHTML=bouquetMarkup(chosen,{wrapped:true,stage:'final'});
  display.classList.remove('bouquet-gathering');
  display.classList.add('bouquet-wrapping');
  await delay(650); if(disposed) return;
  updateInstruction('All seven, ready to go.');
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