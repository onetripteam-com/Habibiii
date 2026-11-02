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
 let pan=.5,start=null,disposed=false,lastVelocity=0,frame=0,settleFrame=0,travel=0;
 const measure=()=>{travel=Math.max(0,(layer.offsetWidth-stage.clientWidth)/2)};
 const maxTravel=()=>travel;
 measure();
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
     const theme=room.dataset.theme;
     const names=theme==='kerala'?['RAIN AT THE WINDOW','A QUIET AFTERNOON','POSTCARDS FROM KERALA']:theme==='bengaluru'?['THE SOFTER SIDE','A COFFEE BREAK','THINGS WORTH KEEPING']:['YOUR QUIET CORNER','FLOWERS ON THE TABLE','PLACES YOU COULD GO'];
     caption.textContent=pan<.3?names[0]:pan>.7?names[2]:names[1];
   }
   if(!quiet)layer.classList.remove('room-is-dragging');
 }
 function set(next){
   pan=Math.max(0,Math.min(1,next));
   paint();
 }
 // Five camera stops preserve detail without a sudden half-room jump.
 const stopAt=next=>Math.round(Math.max(0,Math.min(1,next))*4)/4;
 const settle=next=>{
   if(settleFrame){cancelAnimationFrame(settleFrame);settleFrame=0}
   // Flush the unanimated drag pose before enabling the easing transition.
   layer.classList.remove('room-is-dragging');
   void layer.offsetWidth;
   set(stopAt(next));
 };
 const goLeft=()=>settle(pan-.25),goRight=()=>settle(pan+.25);
 const onDown=e=>{
   if(!small.matches||e.button&&e.button!==0)return;
   if(e.target.closest('button,dialog,[role="button"],a,input,textarea'))return;
   if(frame)cancelAnimationFrame(frame);
   if(settleFrame)cancelAnimationFrame(settleFrame);
   settleFrame=0;
   lastVelocity=0;
   start={x:e.clientX,y:e.clientY,previousX:e.clientX,previousT:performance.now(),initial:pan,dragging:false};
 };
 const onMove=e=>{
   if(!start||!small.matches)return;
   const dx=e.clientX-start.x,dy=e.clientY-start.y;
   if(!start.dragging){
     if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
     if(Math.abs(dx)<Math.abs(dy)*1.25){start=null;return}
     start.dragging=true;
     layer.classList.add('room-is-dragging');
     try{stage.setPointerCapture?.(e.pointerId)}catch{}
   }
   if(e.cancelable)e.preventDefault();
   const max=maxTravel();
   if(max>0){
     const now=performance.now(),elapsed=Math.max(9,now-start.previousT);
     lastVelocity=Math.max(-2,Math.min(2,(e.clientX-start.previousX)/elapsed));
     start.previousX=e.clientX;start.previousT=now;
     pan=Math.max(0,Math.min(1,start.initial-dx/(2*max)));
     if(!frame)frame=requestAnimationFrame(()=>{frame=0;paint(true)});
   }
 };
 const onEnd=e=>{
   const dragging=start?.dragging;
   start=null;
   if(frame){cancelAnimationFrame(frame);frame=0;paint(true)}
   try{if(e&&stage.hasPointerCapture?.(e.pointerId))stage.releasePointerCapture(e.pointerId)}catch{}
   if(!dragging){layer.classList.remove('room-is-dragging');paint();return}
   const max=Math.max(1,maxTravel());
   // Project a little momentum in photo pixels, then ease to a real viewpoint.
   const projected=pan-lastVelocity*85/(2*max);
   settle(projected);
 };
 const onCancel=()=>{start=null;lastVelocity=0;if(frame){cancelAnimationFrame(frame);frame=0}settle(pan)};
 const onResize=()=>{measure();paint()};
 left.addEventListener('click',goLeft);
 right.addEventListener('click',goRight);
 stage.addEventListener('pointerdown',onDown,{passive:true});
 stage.addEventListener('pointermove',onMove,{passive:false});
 stage.addEventListener('pointerup',onEnd,{passive:true});
 stage.addEventListener('pointercancel',onCancel,{passive:true});
 window.addEventListener('resize',onResize,{passive:true});
 if(small.addEventListener)small.addEventListener('change',onResize);
 else small.addListener(onResize);
 paint();
 return ()=>{
   disposed=true;start=null;if(frame)cancelAnimationFrame(frame);if(settleFrame)cancelAnimationFrame(settleFrame);
   left.removeEventListener('click',goLeft);
   right.removeEventListener('click',goRight);
   stage.removeEventListener('pointerdown',onDown);
   stage.removeEventListener('pointermove',onMove);
   stage.removeEventListener('pointerup',onEnd);
   stage.removeEventListener('pointercancel',onCancel);
   window.removeEventListener('resize',onResize);
   if(small.removeEventListener)small.removeEventListener('change',onResize);
   else small.removeListener(onResize);
   room.style.removeProperty('--photo-pan-px');
   room.style.removeProperty('--peek-offset');
 };
}
