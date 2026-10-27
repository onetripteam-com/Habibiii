import {move,delay,reduce} from './animation.js';
import {startSound,soundEffect} from './audio.js';
export function mountHug(root,data,onDone){
  let noCount=0,finished=false,disposed=false;
  root.innerHTML=`<section class="scene hug-scene" aria-label="The virtual hug">
    <div class="hug-doodle" aria-hidden="true"><svg viewBox="0 0 280 238"><path d="M50 145c-15-11-20-39-8-52 16-17 39-3 51 9M231 145c15-11 20-39 8-52-16-17-39-3-51 9" stroke="#ba715c" stroke-width="7" stroke-linecap="round" fill="none" opacity=".8"/><path d="M90 85c21-13 46-6 50 8 7-23 38-21 51-7 26 27-11 57-51 86-42-30-77-64-50-87z" fill="#d87e70" opacity=".85" stroke="#b95e56" stroke-width="3"/><path d="M64 166c22 13 45 20 76 20s61-7 81-20" fill="none" stroke="#aa765e" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 11"/></svg><span class="hug-doodle-caption">${escapeHTML(data.illustrationCaption)}</span></div>
    <div class="hug-content"><span class="eyebrow">${escapeHTML(data.eyebrow)}</span><h1>${escapeHTML(data.heroFirst)}<br>${escapeHTML(data.heroSecond)}<em>${escapeHTML(data.heroEmphasis)}</em></h1><div class="hug-lines" id="hug-lines"></div><div class="no-reply" id="no-reply" aria-live="polite"></div></div>
    <div class="hug-actions" id="hug-actions"><div class="hug-action-question">${escapeHTML(data.actionQuestion)}</div><div class="button-row"><button class="button button-primary" id="hug-yes">${escapeHTML(data.yesButton)}</button><button class="button button-outline" id="hug-no">${escapeHTML(data.noButton)}</button></div><span class="tiny-footnote">${escapeHTML(data.footnote)}</span><button type="button" class="hug-skip" id="hug-skip">Continue without a hug →</button></div>
    <div class="hug-complete" id="hug-complete" hidden><span class="little-knot" aria-hidden="true">❧</span><p id="hug-result"></p><p class="next-line">${escapeHTML(data.next)}</p><button class="button button-primary" id="next-flowers">${escapeHTML(data.flowerButton)} <span aria-hidden="true">→</span></button></div>
    </section>`;
  const lines=root.querySelector('#hug-lines');
  const response=root.querySelector('#no-reply');
  const actions=root.querySelector('#hug-actions');
  const done=root.querySelector('#hug-complete');
  const question=root.querySelector('.hug-action-question');
  const noButton=root.querySelector('#hug-no');
  data.opening.forEach((line,i)=>{const p=document.createElement('p');p.textContent=line;p.className='opening-line';p.style.animationDelay=`${.32+i*.8}s`;lines.append(p);});
  const reveal=async(reply,isYes)=>{
    if(finished)return;finished=true;startSound();soundEffect('complete');
    actions.classList.add('leaving'); response.textContent='';
    const heart=root.querySelector('.hug-doodle');heart.classList.add('hug-given');
    if(isYes) await delay(1300); else await delay(600);
    if(disposed)return;
    actions.hidden=true;done.hidden=false;root.querySelector('#hug-result').textContent=reply;
    await move(done,{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'},580);
    root.querySelector('#next-flowers')?.focus({preventScroll:true});
  };
  root.querySelector('#hug-yes').addEventListener('click',()=>reveal(data.yes,true));
  noButton.addEventListener('click',()=>reveal(data.closing,false));
  root.querySelector('#hug-skip').addEventListener('click',()=>{disposed=true;onDone();});
  root.querySelector('#next-flowers').addEventListener('click',()=>{disposed=true;onDone();});
  return ()=>{disposed=true;};
}
function escapeHTML(x){return String(x).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
