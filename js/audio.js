import {store} from './store.js';
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let context, master, tick, active=false, chordIndex=0;
const chords=[[220,277.18,329.63],[196,246.94,293.66],[174.61,220,261.63],[196,261.63,329.63]];
let muted=store.get('muted',false) === true;
function init() {
  if(!AudioContextClass) return false;
  if(!context) { context=new AudioContextClass(); master=context.createGain(); master.gain.value=0; master.connect(context.destination); }
  if(context.state==='suspended') context.resume().catch(()=>{});
  return true;
}
function tone(frequency,at,length,volume=0.015,type='sine') {
  if(!context||!master) return;
  const oscillator=context.createOscillator(),envelope=context.createGain();
  oscillator.type=type; oscillator.frequency.setValueAtTime(frequency,at);
  envelope.gain.setValueAtTime(0.00001,at);
  envelope.gain.exponentialRampToValueAtTime(Math.max(volume,0.0001),at+Math.min(length*0.34,1.25));
  envelope.gain.exponentialRampToValueAtTime(0.00001,at+length);
  oscillator.connect(envelope).connect(master); oscillator.start(at);oscillator.stop(at+length+0.04);
  oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();};
}
function pad() {
  if(!context || muted || document.hidden) return;
  let at=context.currentTime+0.03;
  chords[chordIndex%chords.length].forEach((f,i)=>tone(f/2,at+i*0.08,7.5,0.11,'sine'));
  chordIndex++;
}
function updateButton() {
  const b=document.querySelector('#sound-toggle'); if(!b)return;
  b.setAttribute('aria-pressed',String(muted)); b.setAttribute('aria-label',muted?'Unmute sound':'Mute sound');
  b.querySelector('span').textContent=muted?'♩':'♫'; b.classList.toggle('is-muted',muted);
}
export function startSound(){ if(active||muted||!init())return;active=true;master.gain.setTargetAtTime(0.15,context.currentTime,0.6);pad();tick=setInterval(pad,6200); }
export function soundEffect(kind='tap') {
  if(muted||!active||!context||context.state!=='running') return;
  const now=context.currentTime;
  const sets={tap:[[440,0],[659,.09]],pick:[[523,0],[659,.09],[784,.2]],undo:[[523,0],[349,.12]],complete:[[392,0],[523,.15],[659,.3],[784,.5]],door:[[349,0],[440,.13]]};
  (sets[kind]||sets.tap).forEach(([n,d])=>tone(n,now+d,0.28,0.055,'sine'));
}
export function initAudioUI() {
  updateButton();
  document.querySelector('#sound-toggle')?.addEventListener('click',()=>{
    muted=!muted;store.set('muted',muted); updateButton();
    if(muted){ if(master&&context)master.gain.setTargetAtTime(0,context.currentTime,0.05); }
    else {if(!active)startSound();else if(master&&context)master.gain.setTargetAtTime(0.15,context.currentTime,0.15); soundEffect('tap');}
  });
  document.addEventListener('visibilitychange',()=>{if(!master||!context)return;master.gain.setTargetAtTime((document.hidden||muted)?0:0.15,context.currentTime,0.16);});
}
