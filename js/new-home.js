/** MAHA / A Little Escape — a handmade storybook home.
 * Full-width desktop composition and an uncramped mobile story.
 * Seven fully functioning portals are preserved, not reimplemented.
 */
import {store} from './store.js';
import {bouquetMarkup} from './botanical.js';
import {kuwaitParts,dailyLine,lightOfDay} from './time.js';
import {makePortalSystem} from './portal.js';
import {soundEffect,startSound} from './audio.js';
import {worldIllustration,doorIllustration} from './home-art.js';
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const WORLDS=[
 {id:'story',name:'The Little Hideaway',label:'A storybook kind of cosy',monogram:'01',detail:'A small house for ordinary miracles.'},
 {id:'monsoon',name:'Kerala, When It Rains',label:'Green windows and soft weather',monogram:'02',detail:'For the sound of rain on familiar roofs.'},
 {id:'sunroom',name:'A Sunlit Sunday',label:'Warm windows and lazy afternoons',monogram:'03',detail:'Sunshine without a single appointment.'},
 {id:'terracotta',name:'The Postcard House',label:'Clay, stamps and beautiful detours',monogram:'04',detail:'For the places still waiting to happen.'},
 {id:'midnight',name:'After Hours',label:'Your own little after-dark cinema',monogram:'05',detail:'For midnight thoughts and tiny adventures.'},
 {id:'cosmos',name:'Somewhere in the Stars',label:'A pocket-sized universe',monogram:'06',detail:'Some dreams deserve their own planet.'}
];
const DOORS=[
 {id:'letters',num:'01',title:'Letters for any day',sub:'Some words travel further than people.',stamp:'OPEN WHEN',art:'post'},
 {id:'music',num:'02',title:'Habibii FM',sub:'Turn the dial. Find your frequency.',stamp:'ON AIR',art:'music'},
 {id:'movies',num:'03',title:'A little cinema',sub:'A tiny screen. Somewhere else for a while.',stamp:'ADMIT ONE',art:'movies'},
 {id:'travel',num:'04',title:'Places, real & imagined',sub:'Dream trips count too, you know.',stamp:'PASSPORT',art:'travel'},
 {id:'games',num:'05',title:'The silly arcade',sub:'Highly unserious ways to change the mood.',stamp:'PLAYER ONE',art:'games'},
 {id:'garden',num:'06',title:'The word garden',sub:'Some thoughts look better as flowers.',stamp:'LET IT GROW',art:'garden'},
 {id:'rest',num:'07',title:'The quiet corner',sub:'Doing absolutely nothing is also a plan.',stamp:'SOFT LANDING',art:'rest'}
];
const worldOptions=selected=>WORLDS.map(w=>`<button class="home-world-choice" type="button" data-world="${w.id}" aria-pressed="${w.id===selected}">
 <span class="world-choice-art world-choice-${w.id}" aria-hidden="true">${worldIllustration(w.id)}</span>
 <span class="world-choice-info"><small>WORLD ${w.monogram}</small><strong>${w.name}</strong><em>${w.label}</em></span>
 <span class="world-choice-tick" aria-hidden="true">↗</span></button>`).join('');
export function mountRoom(root,{flowers,chosen,lastVisit,visits,onReplay,onNewBouquet}){
 const known=new Set(WORLDS.map(w=>w.id));
 let theme=store.get('roomTheme','story');if(!known.has(theme))theme='story';
 const parts=kuwaitParts(),light=lightOfDay(parts.hour),today=dailyLine(flowers.today);
 const doorHTML=DOORS.map(d=>`<button class="little-door room-object object-${d.id}" type="button" data-place="${d.id}" data-door="${d.id}" aria-label="Visit ${esc(d.title)}">
  <span class="little-door-top"><span class="door-number">${d.num} / 07</span><span class="door-stamp">${d.stamp}</span></span>
  <span class="door-art" aria-hidden="true">${doorIllustration(d.id)}</span>
  <span class="door-caption"><strong>${d.title}</strong><small>${d.sub}</small></span>
  <span class="door-arrow" aria-hidden="true">↗</span></button>`).join('');
 root.innerHTML=`<section class="scene room-scene new-home" data-theme="${theme}" data-light="${light}" aria-label="Maha's little escape">
  <div class="home-paper-grain" aria-hidden="true"></div>
  <div class="home-book">
   <div class="home-topline"><span><span class="home-asterisk" aria-hidden="true">✳</span> MAHA'S VERY OWN LITTLE UNIVERSE <span class="home-edition">/ EST. JUST BECAUSE</span></span>
     <button class="home-theme-open" id="theme-trigger" type="button" aria-haspopup="dialog" aria-controls="home-world-overlay"><span aria-hidden="true">◐</span> Change the scenery <span class="home-theme-count">06</span></button></div>
   <div class="home-hero">
    <div class="home-hero-copy"><span class="home-pretitle">A LITTLE SOMETHING, FOR MAHA <span>❧</span></span>
      <h1>There you<br>are, <em>Habibii.</em></h1>
      <p class="home-lead">Some days are a whole adventure. Some days getting through them is enough. There’s room for both here.</p>
      <div class="home-stitch" aria-hidden="true"><span>✳</span><i></i><span>❀</span></div>
      <p class="home-small">No occasion. No grand speech. Just seven tiny places you can come back to whenever.</p>
      <button type="button" class="home-enter" id="home-enter">Find your little escape <span aria-hidden="true">↘</span></button>
      <div class="home-clock"><span class="clock-light">●</span> SOMEWHERE IN KUWAIT <strong id="clock-value">${parts.clock}</strong></div>
    </div>
    <div class="home-hero-visual"><div class="home-halo" aria-hidden="true"></div><div class="home-scene-illustration" id="home-art">${worldIllustration(theme)}</div>
     <span class="home-illustration-note">THE UNIVERSE IS VERY SMALL. THAT'S THE POINT.</span>
     <button type="button" id="room-bouquet" class="home-bouquet" aria-label="Choose seven new flowers for Maha"><span class="home-bouquet-art">${bouquetMarkup(chosen,{wrapped:true,stage:'final'})}</span><span class="bouquet-annotation">your seven flowers <span>↗</span></span></button>
    </div>
   </div>
   <div class="home-paper-note"><span class="home-note-kicker">TODAY'S LITTLE MARGIN NOTE</span><p>${esc(today)}</p><button type="button" id="today-card" aria-label="Read a letter for Maha">Read something longer <span aria-hidden="true">↗</span></button><span class="note-tape" aria-hidden="true"></span></div>
   <section class="home-places" id="home-places" aria-labelledby="places-title">
    <div class="home-section-heading"><span class="home-section-number">CHAPTER 01 — PICK A DOOR</span><h2 id="places-title">Where shall we<br><em>disappear to?</em></h2><p>There isn't a right order. Touch whatever looks interesting.</p></div>
    <div class="home-door-grid">${doorHTML}</div>
   </section>
   <div class="home-mood-section"><span class="mood-flourish" aria-hidden="true">✿</span><span class="home-section-number">IN CASE THE DAY IS BEING A LOT</span><h2>Pick your <em>kind of okay.</em></h2>
    <div class="home-mood-picks"><button type="button" data-mood="games">I need a laugh <span>↗</span></button><button type="button" data-mood="rest">Some quiet, please <span>↗</span></button><button type="button" data-mood="travel">Take me somewhere <span>↗</span></button></div>
   </div>
   <footer class="home-footer"><p>Whatever kind of day it is, <em>you can always come back.</em></p><div><button type="button" id="replay-opening">↶ Back to the beginning</button><span>MADE WITH A LITTLE TOO MUCH THOUGHT ♡</span></div></footer>
  </div>
  <div class="home-world-overlay" id="home-world-overlay" hidden>
   <div class="home-world-modal" role="dialog" aria-modal="true" aria-labelledby="world-dialog-title">
    <div class="world-modal-header"><div><span class="home-section-number">SIX COMPLETELY DIFFERENT SKIES</span><h2 id="world-dialog-title">Where are we today?</h2></div><button type="button" class="world-close" id="world-close" aria-label="Close theme selection">✕</button></div>
    <p class="world-modal-subtitle">A new little universe. Same seven places, same flowers, same Maha.</p>
    <div class="home-world-choices" role="group" aria-label="Choose your little universe">${worldOptions(theme)}</div>
   </div>
  </div>
 </section>`;
 const scene=root.querySelector('.new-home');
 const portal=makePortalSystem({room:scene,frame:document.querySelector('#app'),visits,lastVisit,onReturn:refreshKeepsakes});
 const doorButtons=[...root.querySelectorAll('[data-door]')];
 doorButtons.forEach(button=>button.addEventListener('click',()=>portal.open(button.dataset.door,button)));
 function refreshKeepsakes(){
  doorButtons.forEach(button=>button.classList.toggle('door-visited',Boolean(store.get('seenPlace:'+button.dataset.door,false))));
 }
 refreshKeepsakes();
 const enter=root.querySelector('#home-enter');enter.addEventListener('click',()=>root.querySelector('#home-places').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'}));
 const note=root.querySelector('#today-card');note.addEventListener('click',()=>portal.open('letters',note));
 root.querySelectorAll('[data-mood]').forEach(b=>b.addEventListener('click',()=>portal.open(b.dataset.mood,b)));
 root.querySelector('#room-bouquet').addEventListener('click',()=>{startSound();soundEffect('pick');onNewBouquet()});
 root.querySelector('#replay-opening').addEventListener('click',onReplay);
 const themeTrigger=root.querySelector('#theme-trigger'),overlay=root.querySelector('#home-world-overlay');
 const closeBtn=root.querySelector('#world-close');
 let lastFocus=null;
 const openTheme=()=>{lastFocus=document.activeElement;overlay.hidden=false;root.querySelector(`[data-world="${theme}"]`)?.focus({preventScroll:true});};
 const closeTheme=()=>{overlay.hidden=true;(lastFocus||themeTrigger).focus({preventScroll:true});};
 themeTrigger.addEventListener('click',openTheme);closeBtn.addEventListener('click',closeTheme);
 root.querySelectorAll('[data-world]').forEach(button=>button.addEventListener('click',()=>{
  theme=button.dataset.world;store.set('roomTheme',theme);scene.dataset.theme=theme;
  root.querySelector('#home-art').innerHTML=worldIllustration(theme);
  root.querySelectorAll('[data-world]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.world===theme)));
  startSound();soundEffect('pick');closeTheme();
 }));
 overlay.addEventListener('click',e=>{if(e.target===overlay)closeTheme()});
 const onKey=e=>{
  if(overlay.hidden)return;
  if(e.key==='Escape'){e.preventDefault();closeTheme();return;}
  if(e.key==='Tab'){
   const focusables=[...overlay.querySelectorAll('button:not([disabled])')];
   const first=focusables[0],last=focusables[focusables.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 };
 document.addEventListener('keydown',onKey);
 const clock=root.querySelector('#clock-value');let day=parts.date;
 const clockInterval=setInterval(()=>{const cur=kuwaitParts();clock.textContent=cur.clock;
  if(cur.date!==day){day=cur.date;root.querySelector('.home-paper-note p').textContent=dailyLine(flowers.today);}
 },60000);
 return ()=>{clearInterval(clockInterval);document.removeEventListener('keydown',onKey);portal.destroy()};
}