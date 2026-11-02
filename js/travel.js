/** Travel: locally illustrated route map, private dream pins and passport. */
import {store} from './store.js';
import {soundEffect,startSound} from './audio.js';
import {takeMedia,releaseMedia,isMediaMuted} from './media-control.js';
import {paintedWorld} from './painted-worlds.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const safe=(s,max=200)=>String(s||'').trim().slice(0,max);
const mapSVG='<img class="atlas-watercolor" src="./assets/atlas-region.svg" alt="Hand-finished geographic atlas of Kuwait, the Arabian Peninsula, India and Nepal, using accurate country coastlines" loading="eager" draggable="false">';
function validDreams(){return (Array.isArray(store.get('dreamPins'))?store.get('dreamPins'):[]).filter(x=>typeof x.name==='string'&&typeof x.x==='number'&&typeof x.y==='number').slice(0,25)}
function stamps(){const raw=store.get('passportStamps',[]);return Array.isArray(raw)?raw:[]}
export function mountTravel(host,{onPostcard=()=>{}}={}){
 let places=[],tab='map',current=null,disposed=false,clip=null,pending=null,gateTimer=0,zoomed=false,passportPage=0;
 host.classList.add('travel-host');
 const stopClip=()=>{if(clip){releaseMedia(clip);clip.remove();clip=null}};
 const getSeen=()=>Array.isArray(store.get('visitedPlaces',[]))?store.get('visitedPlaces',[]):[];
 function stampVisit(place){const seen=getSeen();if(!seen.includes(place.id))store.set('visitedPlaces',[...seen,place.id]);const list=stamps(),id='travel-'+place.id;if(!list.some(s=>s.id===id))store.set('passportStamps',[...list,{id,earnedAt:new Date().toISOString(),score:0}]);}
 function chrome(){return `<div class="atlas-app"><div class="atlas-heading"><span>✳ MAHA'S POCKET ATLAS</span><small>NOT ALL ROADS REQUIRE A PLAN</small></div><div class="atlas-tabs" role="tablist"><button data-tab="map" role="tab" aria-selected="${tab==='map'}">Explore</button><button data-tab="passport" role="tab" aria-selected="${tab==='passport'}">Passport <i>${stamps().length}</i></button></div><div class="atlas-stage" id="atlas-stage"></div></div>`}
 function render(){host.innerHTML=chrome();host.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{tab=b.dataset.tab;render()}));const stage=host.querySelector('#atlas-stage');tab==='passport'?renderPassport(stage):renderMap(stage)}
 function renderMap(stage){const dreams=validDreams();stage.innerHTML=`<div class="atlas-map-top"><h1>A map with <em>room for more.</em></h1><p>Tap a stamped place, or add a destination of your own.</p></div><div class="atlas-wall"><div class="atlas-board ${zoomed?'is-zoomed':''}" data-board><div class="atlas-map-layer">${mapSVG}<div class="atlas-routes">${places.map((p,i)=>`<button type="button" class="atlas-pin" style="left:${p.x}%;top:${p.y}%;--pin-color:${p.colors[0]}" data-place="${esc(p.id)}" aria-label="Open postcard: ${esc(p.name)}"><span class="atlas-pin-head" aria-hidden="true">✦</span><span class="atlas-pin-name">${esc(p.name)}</span></button>`).join('')}${dreams.map((p,i)=>`<button type="button" class="atlas-pin dream" style="left:${Math.min(93,Math.max(7,p.x))}%;top:${Math.min(92,Math.max(8,p.y))}%" data-dream="${i}" aria-label="Your dream pin: ${esc(p.name)}"><span class="atlas-pin-head" aria-hidden="true">♡</span></button>`).join('')}</div></div></div><button type="button" class="atlas-zoom" data-zoom aria-pressed="${zoomed}">${zoomed?'− Wider view':'+ Look closer at India'}</button></div><div class="atlas-hint">BASED ON REAL COASTLINES · PIN LOCATIONS APPROXIMATE · A PERSONAL ATLAS</div><div class="atlas-place-tape">${places.map(p=>`<button data-place="${esc(p.id)}" type="button" aria-label="Visit ${esc(p.name)}">✦ ${esc(p.name)}</button>`).join('')}</div><div class="atlas-dream-line"><button type="button" data-add-pin>＋ Plant a dream pin</button><small>${dreams.length} personal pin${dreams.length===1?'':'s'} · stays on this device</small></div><div class="atlas-custom-pins">${dreams.map((p,i)=>`<button type="button" data-dream="${i}">♡ ${esc(p.name)}</button>`).join('')}</div><div class="atlas-popover" data-popover hidden></div>`;
 stage.querySelectorAll('[data-place]').forEach(b=>b.addEventListener('click',()=>openPostcard(places.find(p=>p.id===b.dataset.place),b)));
 stage.querySelectorAll('[data-dream]').forEach(b=>b.addEventListener('click',()=>openDream(dreams[+b.dataset.dream])));
 stage.querySelector('[data-zoom]').addEventListener('click',()=>{
  zoomed=!zoomed;
  const board=stage.querySelector('[data-board]');
  board.classList.toggle('is-zoomed',zoomed);
  const button=stage.querySelector('[data-zoom]');
  button.setAttribute('aria-pressed',String(zoomed));
  button.textContent=zoomed?'− Wider view':'+ Look closer at India';
 });
 stage.querySelector('[data-add-pin]').addEventListener('click',()=>pinModal());
 }
 function openDream(dream){const pop=host.querySelector('[data-popover]');pop.hidden=false;pop.innerHTML=`<div class="atlas-dream-card"><span>♡ A DREAM FOR LATER</span><h2>${esc(dream.name)}</h2><p>${esc(dream.note||'A place on your someday list.')}</p><button type="button" data-close>Back to the map</button></div>`;pop.querySelector('[data-close]').addEventListener('click',()=>pop.hidden=true)}
 function pinModal(){const pop=host.querySelector('[data-popover]');pop.hidden=false;pop.innerHTML=`<form class="atlas-dream-form"><span>♡ A PLACE TO KEEP IN MIND</span><h2>Where would you go?</h2><label>Place name<input name="name" required maxlength="55" placeholder="Somewhere wonderful…" autocomplete="off"></label><label>A note to your future self<textarea name="note" maxlength="280" rows="3" placeholder="[What calls you there?]"></textarea></label><p>Saved only in this browser. You can add up to 25 dream pins.</p><div><button type="button" data-cancel>Not now</button><button type="submit">Pin my dream ✦</button></div></form>`;pop.querySelector('[data-cancel]').addEventListener('click',()=>pop.hidden=true);const form=pop.querySelector('form');form.addEventListener('submit',e=>{e.preventDefault();const dreams=validDreams();if(dreams.length>=25){pop.querySelector('p').textContent='25 pins is a whole universe. Keep these for now!';return}const name=safe(form.elements.name.value,55),note=safe(form.elements.note.value,280);if(!name)return;const i=dreams.length;dreams.push({name,note,x:15+(i*27)%69,y:18+(i*19)%67,createdAt:new Date().toISOString()});store.set('dreamPins',dreams);soundEffect('pick');render()});pop.querySelector('input').focus()}
 function renderPassport(stage){
   const issued=stamps(),seen=getSeen();
   const names={spark:'Tiny Joys',lettersmile:'Compliment Heist',softlanding:'Pocket Sunshine',doctor:'Decode the Doctor',world:'Where in the World',vlog:'Vlog Director',chai:'Chai Maker',sadya:'Sadya Builder',baggage:'Airport Baggage'};
   const displayStamp=s=>{
      const id=String(s.id||''),place=places.find(p=>'travel-'+p.id===id);
      const name=place?.name||names[id]||id.replace(/^travel-/,'');
      const date=s.earnedAt?new Date(s.earnedAt):null;
      const when=date&&!Number.isNaN(date.getTime())?date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'UNDATED';
      return `<div class="passport-ink-stamp" style="--ink-angle:${((name.length%7)-3)*4}deg">
        <span>✳ MAHA'S WORLD ✳</span><strong>${esc(name)}</strong>
        <small>${place?'POSTCARD VISITED':'ARCADE ACHIEVEMENT'} · ${esc(when)}</small>
      </div>`;
   };
   const perSpread=6,spreadCount=Math.max(1,Math.ceil(issued.length/perSpread));
   passportPage=Math.min(Math.max(0,passportPage),spreadCount-1);
   const slice=issued.slice(passportPage*perSpread,(passportPage+1)*perSpread);
   const left=slice.slice(0,3),right=slice.slice(3,6);
   const stampsOn=(arr)=>arr.length?arr.map(displayStamp).join(''):`<div class="passport-blank-stamp"><span>✳</span><p>No stamp on this page yet.<br>That's a perfectly good beginning.</p></div>`;
   stage.innerHTML=`<section class="passport-experience" aria-label="Maha's interactive personal travel passport">
     <div class="passport-overline"><span>THE SMALL ADVENTURES DEPARTMENT</span><span>NOT AN OFFICIAL DOCUMENT</span></div>
     <div class="passport-intro"><span>YOUR OWN LITTLE PASSPORT</span><h1>Places worth <em>keeping.</em></h1><p>Every postcard explored becomes ink on a page. Turn the pages whenever you like.</p></div>
     <div class="passport-case">
       <div class="passport-spread" data-spread data-page="${passportPage}">
         <section class="passport-paper passport-left" aria-label="Left passport page">
           <div class="passport-page-header"><span>MAHA · LITTLE ESCAPE</span><span>PAGE ${passportPage*2+1}</span></div>
           ${passportPage===0?`<div class="passport-identity">
             <span class="passport-flower-mark" aria-hidden="true">❀</span>
             <span>PERSONAL RECORD · NO BORDERS</span><strong>MAHA</strong>
             <p>For every place explored, and every place still to come.</p>
             <small>ISSUED WITH UNLIMITED LITTLE DETOURS</small>
           </div>`:`<div class="passport-stamp-grid">${stampsOn(left)}</div>`}
           <div class="passport-page-foot">A PRIVATE COLLECTION <span>✳</span></div>
         </section>
         <div class="passport-spine" aria-hidden="true"></div>
         <section class="passport-paper passport-right" aria-label="Right passport page">
           <div class="passport-page-header"><span>ENTRY & EXPERIENCE</span><span>PAGE ${passportPage*2+2}</span></div>
           <div class="passport-stamp-grid">${stampsOn(passportPage===0?issued.slice(0,6):right)}</div>
           <div class="passport-page-foot">NOT FOR OFFICIAL TRAVEL <span>MAHA'S LITTLE WORLD</span></div>
         </section>
       </div>
     </div>
     <div class="passport-bottom">
       <button type="button" data-passport-prev ${passportPage===0?'disabled':''} aria-label="Previous passport pages">← Earlier pages</button>
       <span role="status" aria-live="polite">SPREAD ${passportPage+1} OF ${spreadCount} · ${issued.length} STAMPS</span>
       <button type="button" data-passport-next ${passportPage>=spreadCount-1?'disabled':''} aria-label="Next passport pages">More pages →</button>
     </div>
     <div class="passport-after"><span>${seen.length} places explored</span><span>${validDreams().length} future stops</span><button type="button" data-map>Back to the atlas ↗</button></div>
     </section>`;
   const turn=dir=>{
     const next=passportPage+dir;
     if(next<0||next>=spreadCount)return;
     const book=stage.querySelector('[data-spread]');
     book.classList.add(dir>0?'passport-turn-forward':'passport-turn-back');
     const delay=reduced()?0:270;
     setTimeout(()=>{if(disposed||!stage.isConnected||tab!=='passport')return;passportPage=next;renderPassport(stage)},delay);
   };
   stage.querySelector('[data-passport-prev]').addEventListener('click',()=>turn(-1));
   stage.querySelector('[data-passport-next]').addEventListener('click',()=>turn(1));
   stage.querySelector('[data-map]').addEventListener('click',()=>{tab='map';render()});
   stage.querySelector('.passport-experience').addEventListener('keydown',e=>{
     if(e.key==='ArrowRight'){e.preventDefault();turn(1)}
     if(e.key==='ArrowLeft'){e.preventDefault();turn(-1)}
   });
 }
 function openPostcard(p,source){if(!p)return;stopClip();current=p;startSound();soundEffect('door');const stage=host.querySelector('#atlas-stage');stage.innerHTML=`<div class="atlas-gateway ${p.gate==='stone'?'stone':'wood'}"><div class="gate-half gate-left"></div><div class="gate-half gate-right"></div><span>ARRIVING IN ${esc(p.name.toUpperCase())}…</span></div><div class="atlas-postcard" hidden><div class="atlas-postcard-head"><button type="button" data-back>← The map</button><span>POSTCARD NO. ${places.indexOf(p)+1}</span></div><div class="atlas-postcard-rotator" data-card><div class="atlas-card-front" style="--scene1:${p.colors[0]};--scene2:${p.colors[1]}"><div class="postcard-art" aria-label="Painted travel postcard artwork">${p.still?`<img class="postcard-photo" src="${esc(p.still)}" alt="" loading="lazy" onerror="this.remove()">`:``}${paintedWorld(({kerala:"palms",kuwait:"city",bangalore:"city",munnar:"hills",manali:"mountains",ladakh:"mountains",nepal:"mountains"})[p.id]||"hills")}</div><h2>${esc(p.name)}</h2><span>FLIP ME ↻</span></div><div class="atlas-card-back"><span>POSTMARK: MAHA'S WORLD</span><h2>Dear Maha,</h2><p>${esc(p.intro)}</p><strong>${esc(p.phrase)}</strong><small>${esc(p.translation)}</small><span class="atlas-postcard-sig">A place for a future memory.</span></div></div><button class="atlas-flip" type="button" data-flip>↻ Flip postcard</button><div class="atlas-vlog-note"><strong>🎬 10-second vlog idea</strong><p>${esc(p.prompt)}</p></div><button class="atlas-keep" type="button" data-keep>♡ Keep this postcard</button><div class="atlas-postcard-clip">${p.clip?`<button data-clip>▶ Play your clip</button>`:'<span>A painted place to keep in your pocket</span>'}</div></div>`;
 const card=stage.querySelector('.atlas-postcard');const gateway=stage.querySelector('.atlas-gateway');gateway.classList.add('gate-open');const show=()=>{if(disposed||!stage.isConnected)return;gateway.remove();card.hidden=false};gateTimer=setTimeout(show,reduced()?40:470);
 stage.querySelector('[data-back]').addEventListener('click',()=>{clearTimeout(gateTimer);stopClip();current=null;render()});stage.querySelector('[data-flip]').addEventListener('click',()=>{card.querySelector('[data-card]').classList.toggle('flipped');soundEffect('tap')});stage.querySelector('[data-keep]').addEventListener('click',()=>{stampVisit(p);store.set('postcardPinned',true);store.set('lastPostcard',p.id);onPostcard(p.id);soundEffect('complete');stage.querySelector('[data-keep]').textContent='♥ Kept in your passport'});
 if(p.clip)stage.querySelector('[data-clip]').addEventListener('click',()=>{if(clip){stopClip();return}clip=document.createElement('video');clip.playsInline=true;clip.controls=false;clip.src=p.clip;clip.muted=isMediaMuted();clip.loop=true;clip.preload='metadata';stage.querySelector('.atlas-postcard-clip').prepend(clip);takeMedia(clip);clip.play().catch(()=>stopClip())});
 }
 fetch('./content/places.json').then(r=>{if(!r.ok)throw Error('No atlas JSON');return r.json()}).then(data=>{if(disposed)return;places=data.places||[];render()}).catch(()=>{if(!disposed)host.innerHTML='<p class="atlas-error">The map is still unfolding. Reload to try again.</p>'});
 const mute=()=>{if(clip)clip.muted=isMediaMuted()};document.addEventListener('maha:mutechange',mute);
 return ()=>{disposed=true;clearTimeout(gateTimer);stopClip();document.removeEventListener('maha:mutechange',mute);host.innerHTML='';host.classList.remove('travel-host')};
}