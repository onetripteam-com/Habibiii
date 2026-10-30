/** PC photographic home atmosphere. No tracking, no media APIs, no network.
 * Retain the DOM hotspots as the source of truth; parallax is decorative only. */
export function mountCinematicHome(room){
  const photo=room.querySelector('.cinematic-photo');
  const stage=room.querySelector('.inhabited-room');
  if(!photo||!stage)return ()=>{};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(pointer: fine) and (hover: hover)');
  const wide=matchMedia('(min-width:760px)');
  let pointer={x:0,y:0},raf=0,alive=true;
  const paint=()=>{
    raf=0;
    if(!alive||reduced.matches||!fine.matches||!wide.matches)return;
    photo.style.setProperty('--parallax-x',pointer.x+'px');
    photo.style.setProperty('--parallax-y',pointer.y+'px');
  };
  const onMove=e=>{
    if(reduced.matches||!fine.matches||!wide.matches)return;
    const b=stage.getBoundingClientRect();
    if(!b.width||!b.height)return;
    const normX=(e.clientX-b.left)/b.width-.5;
    const normY=(e.clientY-b.top)/b.height-.5;
    pointer={x:Math.max(-11,Math.min(11,normX*-20)),y:Math.max(-7,Math.min(7,normY*-14))};
    if(!raf)raf=requestAnimationFrame(paint);
  };
  const onLeave=()=>{
    photo.style.setProperty('--parallax-x','0px');
    photo.style.setProperty('--parallax-y','0px');
  };
  stage.addEventListener('pointermove',onMove,{passive:true});
  stage.addEventListener('pointerleave',onLeave);
  return ()=>{
    alive=false;
    if(raf)cancelAnimationFrame(raf);
    stage.removeEventListener('pointermove',onMove);
    stage.removeEventListener('pointerleave',onLeave);
    photo.style.removeProperty('--parallax-x');
    photo.style.removeProperty('--parallax-y');
  };
}
