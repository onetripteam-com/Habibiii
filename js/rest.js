/** MAHA — A Little Escape · Rest Room. Optional, pressure-free and offline. */
import {soundEffect,startSound} from './audio.js';
import {takeMedia,releaseMedia,isMediaMuted} from './media-control.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const PHASES=[['Inhale',4000],['Hold',4000],['Exhale',6000]];
const fallback={shows:['[Add a comfort show]'],snacks:['[Add her favourite snack]'],songs:['[Add a familiar song]'],voice:{src:'',caption:'[Your voice note belongs here. No rush to add it.]'},rain:{src:'',licence:'Original Web Audio-generated noise, no recording or sample used.'}};
export function mountRest(host,{onPlay=()=>{}}={}){
 let disposed=false,runningBreath=false,breathStart=0,breathPaused=0,raf=0,visibilityPaused=false;
 let audioContext=null,noiseSource=null,noiseGain=null,voice=null,voiceBusy=false,rainVolume=0.36,rainArmed=false;
 let drips=[],rainCanvas,rainCtx,stage,light=72,comfort=fallback;
 host.classList.add('rest-host');
 host.innerHTML=`<section class="restroom" aria-label="A little room for resting">
 <div class="restroom-top"><span class="rr-kicker">THE QUIET CORNER · NO PLANS REQUIRED</span><h1>It's okay to <em>do nothing.</em></h1></div>
 <div class="rr-window" id="rr-window"><canvas id="rr-rain-canvas" aria-hidden="true"></canvas><div class="rr-window-bars" aria-hidden="true"></div><div class="rr-night-sill" aria-hidden="true"></div><div class="rr-lamp" aria-hidden="true"><div class="rr-lamp-light" id="rr-lamp-light"></div><div class="rr-lamp-shade"></div><div class="rr-lamp-stem"></div><div class="rr-lamp-base"></div></div><p class="rr-glass-note">A little rain, somewhere far away.</p></div>
 <div class="rr-dials"><label>☼ Lamp glow <input id="rr-brightness" type="range" min="0" max="100" value="72" aria-label="Lamp brightness"><output id="rr-lamp-value">72%</output></label><label>☂ Rain volume <input id="rr-volume" type="range" min="0" max="100" value="36" aria-label="Rain sound volume"><output id="rr-volume-value">36%</output></label></div><button type="button" id="rr-rain-toggle" class="rr-rain-toggle">☂ Start the rain sound ↗</button>
 <div class="rr-lower"><section class="rr-breath-card"><div class="rr-breath-header"><span>A SMALL BREATHING CIRCLE</span><button type="button" id="rr-breath-toggle">Start ↗</button></div><div class="rr-breath-display"><div class="rr-breath-orb" id="rr-breath-orb" aria-hidden="true"><span>◌</span></div><div class="rr-breath-copy" aria-live="off"><strong id="rr-breath-stage">Whenever you like</strong><small id="rr-breath-timer">In 4 · Hold 4 · Out 6</small></div></div><p>Optional. No counts to keep, nothing to achieve.</p></section>
 <section class="rr-comfort"><span class="rr-section-kicker">THE COMFORT SHELF</span><div class="rr-comfort-tabs" role="group" aria-label="Comfort ideas"><button data-comfort="shows" aria-pressed="true">Shows</button><button data-comfort="snacks" aria-pressed="false">Snacks</button><button data-comfort="songs" aria-pressed="false">Songs</button></div><ul id="rr-comfort-list"></ul></section></div>
 <div class="rr-foot"><button id="rr-voice" type="button">▶ Press to hear me</button><button id="rr-bored" type="button">✦ Bored in bed?</button></div><p class="rr-voice-caption" id="rr-voice-caption">${esc(fallback.voice.caption)}</p><p class="rr-copyright">Rain is generated locally. No tracking, no medical promises.</p>
 </section>`;
 const canvas=host.querySelector('#rr-rain-canvas'),ctx=canvas.getContext('2d'),windowEl=host.querySelector('#rr-window');
 const glow=host.querySelector('#rr-lamp-light'),brightOut=host.querySelector('#rr-lamp-value'),volOut=host.querySelector('#rr-volume-value');
 const voiceButton=host.querySelector('#rr-voice'),voiceCaption=host.querySelector('#rr-voice-caption');
 const view=window.visualViewport;
 function resize(){const r=windowEl.getBoundingClientRect(),dpi=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpi);canvas.height=Math.round(r.height*dpi);canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(dpi,0,0,dpi,0,0);drips=Array.from({length:43},(_,i)=>({x:(i*73.87)%Math.max(1,r.width),y:(i*47.13)%Math.max(1,r.height),speed:.2+(i%7)*.08,l:8+(i*13)%27,w:.7+(i%3)*.45}))}
 function paint(now){if(disposed)return;const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);
 const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#6f9187');g.addColorStop(.6,'#819e90');g.addColorStop(1,'#b5ae8f');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const moon=ctx.createRadialGradient(w*.78,h*.22,1,w*.78,h*.22,85);moon.addColorStop(0,'#fff0cbaa');moon.addColorStop(1,'#fff0ca00');ctx.fillStyle=moon;ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#e9deb4';ctx.beginPath();ctx.arc(w*.79,h*.22,17,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#50766c';for(let i=0;i<13;i++){const x=i*23,y=h*.72+(i%5)*12;ctx.beginPath();ctx.ellipse(x,y,32,65,i%2?.18:-.2,0,Math.PI*2);ctx.fill()}
 ctx.strokeStyle='rgba(248,244,223,.44)';ctx.lineCap='round';drips.forEach((drop,i)=>{
  const move=reduced()?0:(now*drop.speed*.014)%Math.max(1,h+drop.l);const y=(drop.y+move)%(h+drop.l)-drop.l;
  ctx.lineWidth=drop.w;ctx.beginPath();ctx.moveTo(drop.x,y);ctx.lineTo(drop.x-1,y+drop.l);ctx.stroke();ctx.fillStyle='rgba(255,255,245,.28)';ctx.beginPath();ctx.arc(drop.x-1,y+drop.l,drop.w*2,0,Math.PI*2);ctx.fill();
 });
 raf=requestAnimationFrame(tick);
 }
 function tick(now){if(!disposed&&!document.hidden){paint(now);updateBreath(now)}else if(!disposed)raf=requestAnimationFrame(tick)}
 function glowValue(){glow.style.opacity=String(.04+light/100*.96);glow.style.transform=`translate(-50%,-42%) scale(${.45+light/100*.55})`;windowEl.style.setProperty('--rr-lamp-brightness',String(light/100));brightOut.textContent=light+'%'}
 function setVolume(v){rainVolume=v/100;volOut.textContent=v+'%';if(noiseGain&&audioContext)noiseGain.gain.setTargetAtTime(isMediaMuted()?0:rainVolume*.11,audioContext.currentTime,.10);if(v>0&&rainArmed)startRain();else stopRain()}
 function stopRain(){if(noiseGain&&audioContext)noiseGain.gain.setTargetAtTime(0,audioContext.currentTime,.06);if(noiseSource){const s=noiseSource;noiseSource=null;setTimeout(()=>{try{s.stop();s.disconnect()}catch{}},320)}}
 function startRain(){if(disposed||document.hidden||isMediaMuted()||rainVolume===0||voiceBusy||!rainArmed)return;
  try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
   if(!audioContext)audioContext=new AC();audioContext.resume().catch(()=>{});
   if(noiseSource)return;
   // Entirely synthesized rain, no samples, licences, or network fetches.
   const size=audioContext.sampleRate*2,buffer=audioContext.createBuffer(1,size,audioContext.sampleRate),a=buffer.getChannelData(0);
   for(let i=0;i<size;i++)a[i]=(Math.random()*2-1)*.62;
   const src=audioContext.createBufferSource(),lp=audioContext.createBiquadFilter(),hi=audioContext.createBiquadFilter(),gain=audioContext.createGain();
   lp.type='lowpass';lp.frequency.value=1500;hi.type='highpass';hi.frequency.value=180;gain.gain.value=0;
   src.buffer=buffer;src.loop=true;src.connect(lp).connect(hi).connect(gain).connect(audioContext.destination);src.start();
   noiseSource=src;noiseGain=gain;gain.gain.setTargetAtTime(rainVolume*.11,audioContext.currentTime,.3);
  }catch(e){console.warn('Rain unavailable',e)}
 }
 function pauseBreath(){if(!runningBreath)return;breathPaused=performance.now()-breathStart;runningBreath=false;host.querySelector('#rr-breath-toggle').textContent='Resume ↗';}
 function resetBreath(){runningBreath=false;breathPaused=0;host.querySelector('#rr-breath-toggle').textContent='Start ↗';host.querySelector('#rr-breath-stage').textContent='Whenever you like';host.querySelector('#rr-breath-timer').textContent='In 4 · Hold 4 · Out 6';host.querySelector('#rr-breath-orb').style.transform='scale(.83)'}
 function updateBreath(now){if(!runningBreath)return;const elapsed=now-breathStart,cycle=14000,t=elapsed%cycle;let phase,remaining,scale;
  if(t<4000){phase='Inhale';remaining=4-Math.floor(t/1000);scale=.83+.20*(t/4000)}
  else if(t<8000){phase='Hold';remaining=4-Math.floor((t-4000)/1000);scale=1.03}
  else{phase='Exhale';remaining=6-Math.floor((t-8000)/1000);scale=1.03-.2*((t-8000)/6000)}
  host.querySelector('#rr-breath-stage').textContent=phase;host.querySelector('#rr-breath-timer').textContent=remaining+' second'+(remaining===1?'':'s');host.querySelector('#rr-breath-orb').style.transform=reduced()?'scale(.9)':`scale(${scale})`;
 }
 function renderComfort(k){host.querySelectorAll('[data-comfort]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.comfort===k)));
  const list=Array.isArray(comfort[k])?comfort[k]:[];host.querySelector('#rr-comfort-list').innerHTML=list.map(v=>`<li>✿ ${esc(typeof v==='string'?v:v.title||'A little comfort')}</li>`).join('')||'<li>Something cosy, whenever it turns up.</li>';
 }
 function stopVoice(){if(voice){releaseMedia(voice);voice.removeAttribute('src');voice.load();voice=null}voiceBusy=false;voiceButton.textContent='▶ Press to hear me';if(rainVolume>0&&rainArmed)startRain()}
 async function playVoice(){if(voiceBusy){stopVoice();return}startSound();soundEffect('tap');const src=String(comfort.voice?.src||'');
  if(!src){voiceCaption.textContent=comfort.voice?.caption||fallback.voice.caption;return}
  try{stopRain();voiceBusy=true;voiceButton.textContent='Ⅱ Stop voice note';voice=document.createElement('audio');voice.preload='none';voice.src=src;voice.muted=isMediaMuted();takeMedia(voice);voice.addEventListener('ended',stopVoice,{once:true});voice.addEventListener('error',()=>{voiceCaption.textContent='Your voice recording has not been added yet.';stopVoice()},{once:true});await voice.play();}
  catch{voiceCaption.textContent='Not available yet. The caption is here instead.';stopVoice()}
 }
 const mute=()=>{if(isMediaMuted())stopRain();else if(rainVolume>0&&rainArmed)startRain();if(voice)voice.muted=isMediaMuted()};
 const onVisibility=()=>{if(document.hidden){pauseBreath();stopRain()}else if(rainVolume>0&&!isMediaMuted())startRain()};
 host.querySelector('#rr-brightness').addEventListener('input',e=>{light=+e.target.value;glowValue()});
 host.querySelector('#rr-volume').addEventListener('input',e=>setVolume(+e.target.value));
 host.querySelector('#rr-rain-toggle').addEventListener('click',()=>{startSound();soundEffect('tap');rainArmed=!rainArmed;host.querySelector('#rr-rain-toggle').textContent=rainArmed?'☂ Pause the rain sound Ⅱ':'☂ Start the rain sound ↗';if(rainArmed)startRain();else stopRain()});
 host.querySelector('#rr-volume').addEventListener('pointerdown',()=>{if(rainArmed)startRain()},{passive:true});
 host.querySelector('#rr-breath-toggle').addEventListener('click',()=>{soundEffect('tap');if(runningBreath){pauseBreath();return}breathStart=performance.now()-breathPaused;runningBreath=true;host.querySelector('#rr-breath-toggle').textContent='Pause Ⅱ'});
 host.querySelectorAll('[data-comfort]').forEach(b=>b.addEventListener('click',()=>renderComfort(b.dataset.comfort)));
 host.querySelector('#rr-voice').addEventListener('click',playVoice);
 host.querySelector('#rr-bored').addEventListener('click',()=>{stopVoice();stopRain();onPlay()});
 document.addEventListener('maha:mutechange',mute);document.addEventListener('visibilitychange',onVisibility);window.addEventListener('resize',resize);
 resize();glowValue();renderComfort('shows');raf=requestAnimationFrame(tick);
 fetch('./content/comfort.json').then(r=>{if(!r.ok)throw Error('No comfort JSON');return r.json()}).then(c=>{if(!disposed){comfort={...fallback,...c};renderComfort('shows');voiceCaption.textContent=comfort.voice?.caption||fallback.voice.caption}}).catch(()=>{});
 return ()=>{disposed=true;cancelAnimationFrame(raf);stopRain();stopVoice();audioContext?.close().catch(()=>{});document.removeEventListener('maha:mutechange',mute);document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('resize',resize);host.innerHTML='';host.classList.remove('rest-host')};
}
