import {photoBloomsMarkup} from './photo-bouquet.js';
/** Direct manipulation of Maha's own original room illustration.
 * Every portal is positioned over the exact physical object in the one
 * full-bleed scene. Buttons stay semantic, focusable and part of existing portal
 * system. The photo and hotspots share one aspect-ratio-locked canvas.
 */
export function mountLivingRoomPhoto(room,chosen=[]){
 const stage=room.querySelector('.inhabited-room');
 if(!stage)return ()=>{};
 const layer=document.createElement('div');
 layer.className='living-photo-plane';
 layer.setAttribute('aria-label','Explore the objects in this room');
 const image=document.createElement('img');
 image.className='living-photo-image';
 image.alt='';
 image.draggable=false;
 image.decoding='async';
 image.src='./assets/rooms/maha-living-room.webp';
 image.addEventListener('error',()=>{
  room.dataset.roomPhoto='unavailable';
 });
 image.addEventListener('load',()=>{
  room.dataset.roomPhoto='ready';
 });
 layer.append(image);
 const flowerLayer=document.createElement('div');
 flowerLayer.className='photographed-vase-flowers';
 flowerLayer.innerHTML=photoBloomsMarkup(chosen);
 layer.append(flowerLayer);
 const vineLayer=document.createElement('div');
 vineLayer.className='living-leaf-sway';
 vineLayer.setAttribute('aria-hidden','true');
 layer.append(vineLayer);
 // Move the existing semantic controls, never clone them; event listeners,
 // references, saved bouquet and reverse portal transitions remain intact.
 const portals=[...stage.querySelectorAll('.room-object[data-door],#room-bouquet')];
 for(const control of portals)layer.append(control);
 stage.insertBefore(layer,stage.querySelector('#room-traces'));
 const areas={
  rest:{x:2,y:43,w:35,h:45,title:'The sofa · somewhere to rest'},
  garden:{x:39,y:23,w:18,h:37,title:'The living plants · word garden'},
  movies:{x:87,y:5,w:13,h:29,title:'The projector screen · cinema'},
  travel:{x:60,y:17,w:26,h:22,title:'The travel wall · passport & map'},
  letters:{x:67,y:39,w:17,h:17,title:'The letter desk · letters'},
  music:{x:88,y:43,w:12,h:18,title:'The radio · Habibii FM'},
  games:{x:60,y:77,w:16,h:15,title:'The handheld game console · arcade'},
  flowers:{x:51,y:59,w:12,h:20,title:'The vase · A few flowers for whatever today brings'}
 };
 for(const [id,area] of Object.entries(areas)){
  const btn=id==='flowers'?room.querySelector('#room-bouquet'):room.querySelector('[data-door="'+id+'"]');
  if(btn&&id!=='flowers'){
    const sublines={
      rest:'The world can wait a minute.',
      garden:'Some words deserve to grow.',
      movies:'One seat. Your kind of stories.',
      travel:'Every postcard has somewhere to take you.',
      letters:'There are words worth keeping.',
      music:'Find a song for the day you had.',
      games:'A little silliness, on purpose.'
    };
    const label=btn.querySelector('.object-label');
    if(label)label.innerHTML='<strong>'+label.textContent.replace('↗','').trim()+'</strong><small>'+sublines[id]+'</small>';
  }

  if(!btn)continue;
  btn.classList.add('living-hit-area');
  btn.style.setProperty('--object-x',area.x+'%');
  btn.style.setProperty('--object-y',area.y+'%');
  btn.style.setProperty('--object-w',area.w+'%');
  btn.style.setProperty('--object-h',area.h+'%');
  btn.setAttribute('aria-label',area.title);
  btn.title=area.title;
 }
 const oldImage=room.querySelector('.cinematic-photo');
 function setTheme(){
  const active=room.dataset.theme==='story';
  // In other themes, the SAME buttons must return to the scene root.
  // Hiding their parent would otherwise make all portals disappear.
  for(const control of portals){
    if(active&&control.parentElement!==layer)layer.append(control);
    if(!active&&control.parentElement!==stage)stage.append(control);
  }
  layer.hidden=!active;
  room.dataset.roomPhotoScene=active?'original':'other';
  if(active&&oldImage)oldImage.style.visibility='hidden';
  else if(oldImage)oldImage.style.removeProperty('visibility');
 }
 const observer=new MutationObserver(setTheme);
 observer.observe(room,{attributes:true,attributeFilter:['data-theme']});
 setTheme();
 return ()=>{
  observer.disconnect();
  if(oldImage)oldImage.style.removeProperty('visibility');
  for(const b of portals){b.classList.remove('living-hit-area');b.style.removeProperty('--object-x');b.style.removeProperty('--object-y');b.style.removeProperty('--object-w');b.style.removeProperty('--object-h');stage.append(b);}
  layer.remove();
 };
}
