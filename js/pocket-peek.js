/** A room you can pan slowly, not a fake 360° camera.
 * On phones use one continuous swipeable photograph with visible left/right
 * arrow controls. Its physical hotspots move WITH the image. The other room
 * themes retain a small responsive background peek as a fallback.
 */
export function mountPocketPeek(room){
 const stage=room.querySelector('.inhabited-room');
 const left=room.querySelector('#room-pan-left'),right=room.querySelector('#room-pan-right');
 const caption=room.querySelector('#room-pan-caption');
 const layer=room.querySelector('.living-photo-plane');
 if(!stage||!left||!right||!layer)return ()=>{};
 const small=matchMedia('(max-width:759px)');
 let pan=.5,start=null,disposed=false;
 const maxTravel=()=>Math.max(0,(layer.getBoundingClientRect().width-stage.getBoundingClientRect().width)/2);
 function paint(quiet=false){
   if(disposed)return;
   const max=maxTravel();
   const shift=max*(1-2*pan);
   room.style.setProperty('--photo-pan-px',shift.toFixed(1)+'px');
   room.style.setProperty('--peek-offset',((pan-.5)*152).toFixed(1)+'px');
   room.dataset.peek=pan<.32?'0':pan>.68?'2':'1';
   left.disabled=!small.matches||pan<=.002;
   right.disabled=!small.matches||pan>=.998;
   if(caption){
     caption.textContent=pan<.25?'LEFT SIDE':pan>.75?'RIGHT SIDE':'SWIPE THE ROOM';
   }
   if(!quiet)layer.classList.remove('room-is-dragging');
 }
 function set(next){
   pan=Math.max(0,Math.min(1,next));
   paint();
 }
 const goLeft=()=>set(pan-.26),goRight=()=>set(pan+.26);
 const onDown=e=>{
   if(!small.matches||e.button&&e.button!==0)return;
   if(e.target.closest('button,dialog,[role="button"],a,input,textarea'))return;
   start={x:e.clientX,y:e.clientY,initial:pan,dragging:false};
 };
 const onMove=e=>{
   if(!start||!small.matches)return;
   const dx=e.clientX-start.x,dy=e.clientY-start.y;
   if(!start.dragging){
     if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
     if(Math.abs(dx)<Math.abs(dy)*1.25){start=null;return}
     start.dragging=true;
     layer.classList.add('room-is-dragging');
   }
   if(e.cancelable)e.preventDefault();
   const max=maxTravel();
   if(max>0){
     pan=Math.max(0,Math.min(1,start.initial-dx/(2*max)));
     paint(true);
   }
 };
 const onEnd=()=>{
   start=null;
   layer.classList.remove('room-is-dragging');
   paint();
 };
 const onResize=()=>paint();
 left.addEventListener('click',goLeft);
 right.addEventListener('click',goRight);
 stage.addEventListener('pointerdown',onDown,{passive:true});
 stage.addEventListener('pointermove',onMove,{passive:false});
 stage.addEventListener('pointerup',onEnd,{passive:true});
 stage.addEventListener('pointercancel',onEnd,{passive:true});
 window.addEventListener('resize',onResize,{passive:true});
 if(small.addEventListener)small.addEventListener('change',onResize);
 else small.addListener(onResize);
 paint();
 return ()=>{
   disposed=true;start=null;
   left.removeEventListener('click',goLeft);
   right.removeEventListener('click',goRight);
   stage.removeEventListener('pointerdown',onDown);
   stage.removeEventListener('pointermove',onMove);
   stage.removeEventListener('pointerup',onEnd);
   stage.removeEventListener('pointercancel',onEnd);
   window.removeEventListener('resize',onResize);
   if(small.removeEventListener)small.removeEventListener('change',onResize);
   else small.removeListener(onResize);
   room.style.removeProperty('--photo-pan-px');
   room.style.removeProperty('--peek-offset');
 };
}
