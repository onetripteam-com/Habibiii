/** The Post Office: paper envelopes, data-driven letters, and device-only keepsakes. */
import {store} from './store.js';
import {soundEffect,startSound} from './audio.js';
import {unlockStatus,unlocks,newlyUnlocked,quietLetterState,kuwaitDay} from './letter-unlocks.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const byId=(letters,id)=>letters.find(l=>l.id===id);
const niceDate=value=>{try{return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kuwait'}).format(new Date(`${value}T12:00:00Z`));}catch{return value||'';}};
function quietVariant(letters,config,now){
 const quiet=quietLetterState(config.quietLetterDate,now);
 return letters.filter(l=>l.section!=='quiet'||quiet.visible).map(l=>l.section==='quiet'?{...l,section:quiet.section}:l);
}
function paragraphs(lines){return (Array.isArray(lines)?lines:[lines]).map(s=>`<p>${esc(s)}</p>`).join('');}
function bookmark(state,id){return Array.isArray(state)&&state.includes(id);}
function renderAvatar(){return `<span class="sender-avatar" aria-hidden="true"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="20" fill="#f0d4a8" stroke="#b97d5b"/><path d="M9 28Q13 20 18 25M24 25Q30 21 34 29" fill="none" stroke="#754c3c" stroke-width="1.8"/><path d="M13 16q2-3 6 0m6 0q2-3 5 0" stroke="#754c3c" stroke-width="2" fill="none"/><path d="M17 24q4 5 9-1" fill="none" stroke="#a9644e" stroke-width="2"/><path d="M6 11q8-15 25-6M10 5q15-6 26 6" fill="none" stroke="#7e8b67" stroke-width="2.4" stroke-linecap="round"/></svg></span>`;}
function envelopeIcon(sealed){return `<span class="mail-envelope ${sealed?'with-seal':''}" aria-hidden="true"><span class="mail-flap"></span><span class="mail-insert"></span><span class="mail-front"></span>${sealed?'<span class="mail-wax">✶</span>':''}</span>`;}
const openWhenEmoji={tired:'☁', 'miss-home':'⌂', 'great-news':'✳',nervous:'◈','cant-sleep':'☾',overthinking:'∞',laugh:'☺',stuck:'⇢','finished-big':'★',raining:'☂',birthday:'✶','first-vlog':'▶','forgot-yourself':'♡','missing-me':'✉'};
export function mountLetters(host,{visits=1,lastVisit=null,onPlay=()=>{},onKeep=()=>{},onExit=()=>{}}={}){
 let disposed=false,activeTab=store.get('lettersTab','inbox'),current=null,page=0,asText=false,zoom=1,letters=[],config={senderName:'[MY NAME]',senderEmail:null,quietLetterDate:null};
 const asState=()=>({visits,firstVisitAt:store.get('firstVisitAt',null),games:store.get('gameCompletions',{})});
 const now=()=>new Date();
 host.innerHTML=`<div class="mail-loading" role="status">Sorting very important stationery…</div>`;
 const list=()=>quietVariant(letters,config,now());
 const allKept=()=>store.get('keptLetters',[]);
 function header(){return `<div class="mail-heading"><div class="mail-postmark">✳ &nbsp; THE VERY UNOFFICIAL POST OFFICE &nbsp; ✳</div><div class="mail-header-row"><h1>Dear <em>Maha,</em></h1><span class="mail-mini-stamp" aria-hidden="true">✿<small>AIR MAIL</small></span></div><p>Some things are nicer in an envelope.</p></div>`;}
 function tabs(){return `<nav class="mail-tabs" aria-label="Letter sections"><button data-tab="inbox" ${activeTab==='inbox'?'aria-current="page"':''}>Inbox</button><button data-tab="openWhen" ${activeTab==='openWhen'?'aria-current="page"':''}>Open When</button><button data-tab="keepsakes" ${activeTab==='keepsakes'?'aria-current="page"':''}>Keepsakes <span>${allKept().length||''}</span></button></nav>`;}
 function itemMarkup(l){
  const state=asState(),status=unlockStatus(l.unlock,state,now()),read=store.get('readLetter:'+l.id,false),isKept=bookmark(allKept(),l.id),open=status.open;
  const badge=open?(read?'Read':'New'):'Sealed';
  return `<button class="mail-row ${open?'is-available':'is-sealed'}" data-open-letter="${esc(l.id)}" type="button" aria-label="${esc(l.title)}. ${open?read?'Read':'New':status.label}">
   ${envelopeIcon(!open)}<span class="mail-row-words"><span class="mail-sender">${renderAvatar()}<span>${esc(config.senderName||'[MY NAME]')}</span></span><strong class="mail-subject">${esc(l.title)}</strong><span class="mail-preview">${esc(l.preview||'A little letter inside.')}</span><span class="mail-status ${open?read?'status-read':'status-new':'status-locked'}">${open?read?'✓ Read':'<i class="marigold-dot"></i> New':'✶ '+esc(status.label)}</span></span><span class="mail-row-edge">${isKept?'♥':'⌁'}</span>
  </button>`;
 }
 function awayShelf(){
  const unlocked=newlyUnlocked(list(),asState(),lastVisit,now());
  const gone=lastVisit&&now().getTime()-Number(lastVisit)>=30*86400000;
  if(!gone)return '';
  const line=unlocked.length?`These seals broke while you were away: ${unlocked.map(x=>x.title).join(' · ')}`:'The envelopes waited. No new seals yet, but the kettle is on.';
  return `<aside class="away-shelf" aria-label="While you were away"><span class="away-shelf-icon" aria-hidden="true">✉</span><div><strong>While you were away…</strong><p>${esc(line)}</p></div></aside>`;
 }
 function inbox(){const inboxLetters=list().filter(l=>l.section==='inbox');return `<div class="mail-inbox-list">${awayShelf()}<p class="mail-section-caption">DELIVERIES FOR MAHA <span>${inboxLetters.length} ENVELOPES</span></p>${inboxLetters.map(itemMarkup).join('')}<div class="mail-bottom-invite"><span>Or would you like to play something?</span><button class="mail-play-button" data-go-play type="button">Take me to the games ↗</button></div></div>`;}
 function openWhen(){return `<div class="when-collection"><p class="mail-section-caption">FOR EXACTLY THE SORT OF DAY YOU'RE HAVING</p><div class="when-bundle">${list().filter(l=>l.section==='openWhen').map(l=>`<div class="when-clip"><span class="when-symbol">${openWhenEmoji[l.id.replace('when-','')]||'♡'}</span>${itemMarkup(l)}</div>`).join('')}</div><p class="mail-draft-note">The envelopes will be here whenever you feel like opening one.</p></div>`;}
 function keepsakes(){
  const selected=list().filter(l=>bookmark(allKept(),l.id));
  return `<div class="mail-keepsakes"><p class="mail-section-caption">THE ONES YOU DECIDED TO KEEP</p>${selected.length?selected.map(itemMarkup).join(''):'<p class="mail-keepsake-empty">No saved letters yet. Read one, tap ♡, and it will find its way here.</p>'}
   <div class="future-note"><span class="future-note-pin">✿</span><h2>A note to future me</h2><p>This one stays on this device. No sending, no postmarks.</p><label class="sr-only" for="future-note-text">Write a note to your future self</label><textarea id="future-note-text" rows="5" placeholder="Dear future Maha, remember…">${esc(store.get('futureNote',''))}</textarea><span class="future-save-indicator" role="status">Saved privately on this device</span></div></div>`;
 }
 // Hide unfinished email settings; enable the button only when there is a real address.
 function footer(){
  const active=Boolean(config.senderEmail&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.senderEmail));
  return active?`<div class="mail-footer"><button type="button" class="mail-writeback" data-writeback>✍ Write back ↗</button></div>`:'';
 }
 function renderList(){
  current=null;
  host.innerHTML=`<div class="letterbox-app">${header()}${tabs()}<div class="mail-scroll" id="mail-scroll">${activeTab==='inbox'?inbox():activeTab==='openWhen'?openWhen():keepsakes()}</div>${footer()}</div>`;
  bindList();
 }
 function bindList(){
  host.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.tab;store.set('lettersTab',activeTab);soundEffect('paper');renderList();}));
  host.querySelectorAll('[data-open-letter]').forEach(b=>b.addEventListener('click',()=>openEnvelope(b.dataset.openLetter,b)));
  host.querySelector('[data-go-play]')?.addEventListener('click',onPlay);
  host.querySelector('[data-writeback]')?.addEventListener('click',writeBack);
  host.querySelector('#future-note-text')?.addEventListener('input',e=>{store.set('futureNote',e.currentTarget.value);});
 }
 function writeBack(){
  if(!config.senderEmail||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.senderEmail)){
   const note=host.querySelector('.mail-footer span');if(note)note.textContent='Add senderEmail in content/config.json first.';return;
  }
  const subject=encodeURIComponent(config.writeBackSubject||'A little letter back from Maha');
  window.location.href=`mailto:${encodeURIComponent(config.senderEmail)}?subject=${subject}`;
 }
 async function openEnvelope(id,button){
  const l=byId(list(),id);if(!l)return;
  const status=unlockStatus(l.unlock,asState(),now());
  if(!status.open){
   button.classList.remove('mail-shake');void button.offsetWidth;button.classList.add('mail-shake');
   const el=button.querySelector('.mail-status');if(el)el.setAttribute('aria-live','polite');soundEffect('undo');return;
  }
  if(current||disposed)return;
  current=l;page=0;asText=false;zoom=1;store.set('readLetter:'+l.id,true);soundEffect('paper');
  button.classList.add('mail-opening');
  await new Promise(r=>setTimeout(r,window.matchMedia('(prefers-reduced-motion: reduce)').matches?65:590));
  if(disposed||current!==l)return;renderReader();
 }
 function totalPages(){return current?.kind==='handwritten'?(asText?(current.transcriptionPages?.length||1):(current.images?.length||1)):(current?.pages?.length||1);}
 function handwrittenPage(){
  const src=current.images?.[page];
  return `<div class="handwritten-sheet"><div class="handwritten-controls"><button type="button" data-toggle-transcript aria-pressed="${asText}">${asText?'View handwriting':'Read as text'}</button><span>${asText?'Typed transcription':'Pinch or double tap to zoom'}</span></div>
    ${asText?`<div class="handwritten-transcript letter-verse">${paragraphs([current.transcriptionPages?.[page]||'[ADD YOUR TRANSCRIPTION HERE.]'])}</div>`:`<div class="handwriting-viewport" id="handwriting-viewport"><img src="${esc(src||'')}" alt="Handwritten page ${page+1}: ${esc(current.title)}" loading="lazy" decoding="async" class="handwriting-image"/><div class="handwriting-fallback" hidden>Paper page not found. Put the scan in <code>assets/letters/</code>, or choose Read as text.</div></div><div class="handwriting-zoom"><button data-zoom-out type="button" aria-label="Zoom out">−</button><button data-zoom-reset type="button" aria-label="Reset zoom">Reset</button><button data-zoom-in type="button" aria-label="Zoom in">+</button></div>`}
   </div>`;
 }
 function readerPage(){return current.kind==='handwritten'?handwrittenPage():`<article class="letter-verse">${paragraphs([current.pages?.[page]||''])}</article>`;}
 function readerFoot(){const last=page===totalPages()-1;return `<div class="reader-pagination"><button data-prev-page type="button" ${page===0?'disabled':''} aria-label="Previous page">← Earlier</button><span class="reader-page-index">${page+1} / ${totalPages()}</span><button data-next-page type="button" ${last?'disabled':''} aria-label="Next page">Next →</button></div>`;}
 function renderReader(){
  if(!current)return;
  const kept=bookmark(allKept(),current.id);
  host.innerHTML=`<div class="letter-reader"><div class="reader-navigation"><button type="button" data-back-letters>← Letters</button><span class="reader-privacy">PERSONAL DELIVERY · KUWAIT</span></div><div class="reader-paper"><span class="reader-tape" aria-hidden="true"></span><div class="reader-intro"><span class="reader-dateline">${esc(niceDate(current.date))} · FROM ${esc(config.senderName)}</span><h1>${esc(current.title)}</h1>${current.draft?'<span class="reader-draft">DRAFT · ADD YOUR OWN MEMORIES</span>':''}</div><div class="reader-page" id="reader-page">${readerPage()}</div>${page===totalPages()-1&&current.kind!=='handwritten'?(current.malayalam?`<p class="reader-malayalam">${esc(current.malayalam)}</p>`:'')+(current.ps?`<p class="reader-postscript"><strong>P.S.</strong> ${esc(current.ps)}</p>`:''):''}</div><div class="reader-bottom">${readerFoot()}<button class="reader-heart ${kept?'is-kept':''}" data-keep-letter type="button" aria-pressed="${kept}">${kept?'♥ Kept':'♡ Keep'}</button></div></div>`;
  bindReader();
 }
 function bindReader(){
  host.querySelector('[data-back-letters]')?.addEventListener('click',()=>{soundEffect('paper');renderList();});
  host.querySelector('[data-keep-letter]')?.addEventListener('click',()=>{
   const kept=allKept();const next=kept.includes(current.id)?kept.filter(x=>x!==current.id):[...kept,current.id];store.set('keptLetters',next);store.set('keptLetter',next.length>0);onKeep();soundEffect('pick');
   const b=host.querySelector('[data-keep-letter]');b.classList.toggle('is-kept',next.includes(current.id));b.setAttribute('aria-pressed',String(next.includes(current.id)));b.textContent=next.includes(current.id)?'♥ Kept':'♡ Keep';
  });
  host.querySelector('[data-prev-page]')?.addEventListener('click',()=>pageTurn(-1));
  host.querySelector('[data-next-page]')?.addEventListener('click',()=>pageTurn(1));
  host.querySelector('[data-toggle-transcript]')?.addEventListener('click',()=>{asText=!asText;page=0;zoom=1;renderReader();});
  const image=host.querySelector('.handwriting-image'),viewport=host.querySelector('.handwriting-viewport');
  image?.addEventListener('error',()=>{image.hidden=true;const fallback=host.querySelector('.handwriting-fallback');if(fallback)fallback.hidden=false;});
  const applyZoom=()=>{if(image)image.style.transform=`scale(${zoom})`;};
  host.querySelector('[data-zoom-in]')?.addEventListener('click',()=>{zoom=Math.min(4,zoom+.5);applyZoom();});
  host.querySelector('[data-zoom-out]')?.addEventListener('click',()=>{zoom=Math.max(1,zoom-.5);applyZoom();});
  host.querySelector('[data-zoom-reset]')?.addEventListener('click',()=>{zoom=1;applyZoom();});
  image?.addEventListener('dblclick',()=>{zoom=zoom===1?2:1;applyZoom();});
  if(viewport){let distance=0,initialZoom=1;const measure=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
   viewport.addEventListener('touchstart',e=>{if(e.touches.length===2){distance=measure(e.touches);initialZoom=zoom;}},{passive:true});
   viewport.addEventListener('touchmove',e=>{if(e.touches.length===2&&distance){e.preventDefault();zoom=Math.max(1,Math.min(4,initialZoom*measure(e.touches)/distance));applyZoom();}},{passive:false});
   viewport.addEventListener('touchend',e=>{if(e.touches.length<2)distance=0;},{passive:true});
  }
 }
 function pageTurn(direction){if(!current)return;const next=page+direction;if(next<0||next>=totalPages())return;soundEffect('paper');const turn=host.querySelector('.reader-paper');turn?.classList.add(direction>0?'page-turn-forward':'page-turn-back');setTimeout(()=>{if(disposed||!current)return;page=next;renderReader();},window.matchMedia('(prefers-reduced-motion: reduce)').matches?20:185);}
 Promise.all([
  fetch(new URL('../content/letters.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('letters.json unavailable');return r.json();}),
  fetch(new URL('../content/config.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('config.json unavailable');return r.json();})
 ]).then(([payload,cfg])=>{if(disposed)return;letters=Array.isArray(payload.letters)?payload.letters:[];config={...config,...cfg};renderList();}).catch(err=>{if(disposed)return;console.error('Post office loading error',err);host.innerHTML='<div class="mail-loading">The post has gone astray. Refresh to try again.</div>';});
 return ()=>{disposed=true;};
}