import {store} from './store.js';
import {flowerSVG,bouquetMarkup} from './botanical.js';
import {kuwaitParts,lightOfDay,dailyLine,greeting} from './time.js';
import {roomDoors,enterDoor,hasNew} from './doors.js';
import {soundEffect,startSound} from './audio.js';
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
let weatherTimer;
const weatherFor=(date)=>{const d=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);return ['clouds','clear','clear','breeze','rain'][((d%5)+5)%5];};
export function mountRoom(root,{flowers,chosen,lastVisit,visits,onReplay}){
 const now=new Date(),parts=kuwaitParts(now),light=lightOfDay(parts.hour),weather=weatherFor(parts.date);
 root.innerHTML=`<section class="scene room-scene light-${light}" aria-label="Maha's little room">
   <div class="room-paint" aria-hidden="true"><img class="room-background" src="./assets/room-back.svg" alt=""><div class="window-sky light-${light} weather-${weather}" id="window-sky"><div class="weather-sun"></div><div class="weather-cloud cloud-one"></div><div class="weather-cloud cloud-two"></div><div class="weather-rain"></div><div class="window-landscape"><svg viewBox="0 0 180 200" preserveAspectRatio="none"><path d="M0 161q26-40 49-15t55-18t76 15v65H0Z" fill="#769988" opacity=".65"/><path d="M0 177q50-38 91-1t89-22v48H0Z" fill="#63857b" opacity=".85"/><path d="M0 194q40-22 97-5t83-9v20H0Z" fill="#607968"/><path d="M127 170v-28m-7 11 7-14 8 14" stroke="#365f59" stroke-width="3" fill="none"/></svg></div></div><img class="room-front" src="./assets/room-front.svg" alt=""></div>
   <div class="room-overlay">
     <div class="room-greeting" id="room-greeting"><span class="eyebrow">YOUR LITTLE CORNER OF THE WORLD</span><h1>${esc(greeting(lastVisit,now))}</h1><div class="place-clock">☼ &nbsp;Kuwait <span class="clock-value" id="clock-value">${parts.clock}</span></div></div>
     <div class="room-bouquet" id="room-bouquet" aria-label="Your seven flowers" role="img">${bouquetMarkup(chosen)}</div><div class="room-vase" aria-hidden="true"><svg viewBox="0 0 110 130"><defs><linearGradient id="vase" x2="1" y2="0"><stop stop-color="#adbea5"/><stop offset=".5" stop-color="#d7d6b3"/><stop offset="1" stop-color="#829e90"/></linearGradient></defs><ellipse cx="55" cy="22" rx="31" ry="10" fill="#668579"/><path d="M23 22Q21 80 39 113Q55 123 71 113Q89 80 87 22Z" fill="url(#vase)" stroke="#779487" stroke-width="3"/><ellipse cx="55" cy="22" rx="33" ry="8" fill="#b1c0a4" stroke="#6f9185" stroke-width="3"/><path d="M44 33Q39 77 47 107" fill="none" stroke="#f7e9cc" stroke-width="4" opacity=".5"/></svg></div>
     <button class="today-card" id="today-card" aria-label="Today's note: ${esc(dailyLine(flowers.today,now))}"><span class="today-label">TODAY, FOR MAHA ✳</span><span class="today-copy">${esc(dailyLine(flowers.today,now))}</span><span class="today-tiny">a note on your sill</span></button>
     <div class="room-objects" id="room-objects"></div>
     <div class="room-bottom-label">tap something curious <span aria-hidden="true">↗</span></div>
     <button type="button" class="replay-opening" id="replay-opening">↶ replay the opening</button>
   </div>
   <div class="door-backdrop" id="door-backdrop" hidden><div class="door-card" role="dialog" aria-modal="true" aria-labelledby="door-title"><div class="door-glyph" aria-hidden="true">✿</div><span class="eyebrow">COMING SOON TO THIS LITTLE ROOM</span><h2 id="door-title"></h2><p id="door-copy"></p><button class="button button-primary" id="door-close">Back to the room ↗</button></div></div>
   <div class="install-nudge" id="install-nudge" hidden><button class="nudge-close" id="nudge-close" aria-label="Dismiss tip">×</button><span class="eyebrow">A LITTLE SHORTCUT</span><strong>Want this on your home screen?</strong><p>In Safari, tap <b>Share</b> → <b>Add to Home Screen</b>. Turn on <b>Open as Web App</b> if offered, then tap Add.</p></div>
 </section>`;
 const objects=root.querySelector('#room-objects');
 const spots=[['music','radio',16,45,16,12],['letters','letter box',9,58,29,12],['movies','projector',45,69,24,11],['travel','suitcase',74,78,23,14],['games','game console',25,89,29,10],['rest','lamp',76,57,20,15],['rest','bed',10,77,38,12]];
 spots.forEach(([id,label,x,y,w,h])=>{
 const b=document.createElement('button');b.type='button';b.className=`room-object object-${id}`;b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%;`;b.setAttribute('aria-label',`Open ${id==='rest'?'Rest':roomDoors.find(d=>d.id===id)?.name} (${label})`);
 b.innerHTML=`<span class="object-dot ${hasNew(id)?'new-item':''}" aria-hidden="true"></span><span class="sr-only">${esc(label)}</span>`;
 b.addEventListener('click',()=>open(id));objects.append(b);
 });
 const backdrop=root.querySelector('#door-backdrop');let lastFocus=null;
 const close=()=>{backdrop.hidden=true;lastFocus?.focus({preventScroll:true});};
 const open=id=>{startSound();soundEffect('door');if(enterDoor(id,{root,close}))return;
  const d=roomDoors.find(d=>d.id===id);lastFocus=document.activeElement;
  root.querySelector('#door-title').textContent=d.name;root.querySelector('#door-copy').textContent=d.line;backdrop.hidden=false;root.querySelector('#door-close').focus({preventScroll:true});};
 root.querySelector('#door-close').addEventListener('click',close);
 backdrop.addEventListener('click',event=>{if(event.target===backdrop)close();});
 const onEscape=e=>{if(backdrop.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();root.querySelector('#door-close').focus();}};document.addEventListener('keydown',onEscape);
 root.querySelector('#replay-opening').addEventListener('click',()=>{startSound();soundEffect('tap');onReplay();});
 const sill=root.querySelector('#today-card');sill.addEventListener('click',()=>{startSound();soundEffect('pick');sill.classList.remove('card-flip');void sill.offsetWidth;sill.classList.add('card-flip');});
 const bouquet=root.querySelector('#room-bouquet');bouquet.addEventListener('click',()=>{startSound();soundEffect('pick');bouquet.classList.remove('vase-wiggle');void bouquet.offsetWidth;bouquet.classList.add('vase-wiggle');});
 const clock=root.querySelector('#clock-value');
 const sky=root.querySelector('#window-sky');let dayAtMount=parts.date, lightAtMount=light;
 const refresh=()=>{
   const current=kuwaitParts();clock.textContent=current.clock;
   const nextLight=lightOfDay(current.hour);
   if(nextLight!==lightAtMount){sky.classList.replace('light-'+lightAtMount,'light-'+nextLight);root.querySelector('.room-scene').classList.replace('light-'+lightAtMount,'light-'+nextLight);lightAtMount=nextLight;}
   if(current.date!==dayAtMount){
     sky.classList.replace('weather-'+weatherFor(dayAtMount),'weather-'+weatherFor(current.date));
     dayAtMount=current.date;
     const line=dailyLine(flowers.today);
     sill.querySelector('.today-copy').textContent=line;sill.setAttribute('aria-label',`Today's note: ${line}`);
   }
 };weatherTimer=setInterval(refresh,60000);
 const ua=navigator.userAgent||'';const onIOS=/iPhone|iPad|iPod/.test(ua)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
 const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 if(onIOS&&!isStandalone&&visits>=2&&!store.get('installShown',false)){
   store.set('installShown',true);const n=root.querySelector('#install-nudge');n.hidden=false;
   root.querySelector('#nudge-close').addEventListener('click',()=>{n.hidden=true;store.set('installDismissed',true);});
 }
 return ()=>{clearInterval(weatherTimer);document.removeEventListener('keydown',onEscape);};
}
