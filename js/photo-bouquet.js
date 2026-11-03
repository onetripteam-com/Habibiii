/** Living botanical bouquet aligned to the mouth of each photographed vase.
 * Flowers remain separately identifiable by species, but form one compact
 * bunch with converging stems and actual foliage—not seven spread-out icons.
 * The Kuwait rim is sampled from the same photograph, pixel-for-pixel.
 */
import {photoBloomHead} from './botanical.js';
export function photoBloomsMarkup(chosen=[],scene='story'){
 const picks=Array.isArray(chosen)?chosen.slice(0,7):[];
 const spots=[
  [46,58],[60,44],[78,50],[93,29],[110,44],[125,57],[88,66]
 ];
 const stems=picks.map((id,i)=>{
  const [x,y]=spots[i],end=78+(i%3-1)*3;
  const midX=(x+end)/2+(i%2?3:-4);
  return '<path d="M'+x+' '+(y+5)+' C'+(x+1)+' '+(y+27)+' '+midX.toFixed(1)+' 88 '+end+' 107" fill="none" stroke="'+(i%2?'#62764e':'#506745')+'" stroke-width="'+(i%3===1?2.2:1.7)+'" stroke-linecap="round" opacity=".94"/>';
 }).join('');
 const leaves=picks.length?[
  '<path d="M65 84Q46 74 42 85Q50 97 70 94Z" fill="#667b51" stroke="#344c38" stroke-width=".9"/><path d="M43 85Q56 89 68 92" fill="none" stroke="#a5ae79" stroke-width=".8"/>',
  '<path d="M89 86Q99 68 112 77Q112 91 91 96Z" fill="#647a50" stroke="#394f38" stroke-width=".8"/><path d="M91 94Q100 84 111 78" stroke="#a4b183" stroke-width=".85" fill="none"/>',
  '<path d="M78 97Q64 88 59 99Q67 108 80 106Z" fill="#819065" stroke="#45583d" stroke-width=".7"/>',
  '<path d="M86 101Q95 89 108 96Q102 108 89 110Z" fill="#72875c" stroke="#40553a" stroke-width=".7"/>'
 ].join(''):'';
 const blooms=picks.map((id,i)=>{
  const [x,y]=spots[i];
  return '<g transform="translate('+x+' '+y+')">'+photoBloomHead(id,i)+'</g>';
 }).join('');
 const rim='<defs><clipPath id="maha-real-rim"><ellipse cx="82" cy="108" rx="'+(scene==='kuwait'?36:43)+'" ry="'+(scene==='kuwait'?6.8:7.5)+'"/></clipPath></defs>';
 return '<svg class="photo-blooms" viewBox="0 0 166 125" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+
 rim+'<g class="photo-flower-stems">'+stems+'</g><g class="photo-flower-leaves">'+leaves+'</g><g class="photo-flower-heads">'+blooms+'</g>'+
 (scene==='kuwait'?'<image href="./assets/rooms/maha-kuwait.webp" x="-667" y="-417" width="1509" height="849" preserveAspectRatio="none" clip-path="url(#maha-real-rim)"/>':
  scene==='story'?'<image href="./assets/rooms/maha-living-room.webp" x="-862" y="-479" width="1672" height="941" preserveAspectRatio="none" clip-path="url(#maha-real-rim)"/>':'')+
 '</svg>';
}
