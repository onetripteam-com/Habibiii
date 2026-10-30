/** A gentle phone-sized peek around the same room.
 * Not a false 360 panorama: three safe camera framings, no gyroscope or camera,
 * no permission prompt, and every object remains reachable.
 */
export function mountPocketPeek(room){
 const button=room.querySelector('#room-peek');
 if(!button)return ()=>{};
 const positions=[-76,0,76];
 const names=['Looking left','Looking straight ahead','Looking right'];
 const stage=room.querySelector('.inhabited-room');
 let index=1;
 const small=matchMedia('(max-width:759px)');
 const moveTo=(next)=>{
  index=Math.max(0,Math.min(2,next));
  room.dataset.peek=String(index);
  room.style.setProperty('--peek-offset',positions[index]+'px');
  const label=names[index]+'. Tap to look '+(index===2?'left again':'right')+'.';
  button.setAttribute('aria-label',label);
  button.querySelector('span').textContent=index===1?'LOOK AROUND ↔':index===0?'← LEFT SIDE':'RIGHT SIDE →';
 };
 const onClick=()=>moveTo((index+1)%3);
 button.addEventListener('click',onClick);
 let start=null;
 const startGesture=e=>{
  if(!small.matches||e.target.closest('button,dialog,[role="button"]'))return;
  start={x:e.clientX,y:e.clientY};
 };
 const endGesture=e=>{
  if(!start)return;
  const dx=e.clientX-start.x,dy=e.clientY-start.y;
  start=null;
  // A committed horizontal swipe, never hijacking vertical page movement.
  if(Math.abs(dx)>54&&Math.abs(dx)>Math.abs(dy)*1.4)moveTo(index+(dx<0?1:-1));
 };
 stage.addEventListener('pointerdown',startGesture,{passive:true});
 stage.addEventListener('pointerup',endGesture,{passive:true});
 stage.addEventListener('pointercancel',()=>start=null);
 moveTo(1);
 return ()=>{
   button.removeEventListener('click',onClick);
   stage.removeEventListener('pointerdown',startGesture);
   stage.removeEventListener('pointerup',endGesture);
   room.style.removeProperty('--peek-offset');
 };
}
