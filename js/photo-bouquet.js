/** Seven user-chosen flowers grow from the *mouth of the photographed vase*.
 * Keep the visible ceramic entirely in the original picture. Do not draw a
 * duplicate ceramic or a separate rectangular clickable flower sticker.
 * The sprite is authored in the photo's native 1672x941 coordinates.
 */
import {renderBloomHead} from './botanical-miniatures.js';
const colours={
 rose:['#ac4459','#dc8189'], peony:['#df9ca8','#f2c4c0'],
 sunflower:['#ce912c','#f3cc5c'], tulip:['#ab536c','#df8491'],
 lily:['#e4d9bd','#f2ead4'], orchid:['#9d77a2','#ccb0d8'],
 hibiscus:['#c65c65','#ef9285'],lotus:['#ce99ac','#f1cad6'],
 jasmine:['#e1d3a5','#f7f2d9'], marigold:['#d49538','#eebd59'],
 daisy:['#e5dfcc','#fff5df'],lavender:['#8472a4','#b9acd4'],
 iris:['#526493','#a7acd8']
};
export function photoBloomsMarkup(chosen=[],scene='story'){
 const picks=Array.isArray(chosen)?chosen.slice(0,7):[];
 const xs=[26,43,60,80,100,120,140],ys=[62,42,53,29,51,43,62];
 // Every stem terminates at the neck; never across the photographed pot.
 const stems=xs.map((x,i)=>{
   const y=ys[i],endX=77+(i-3)*1.3;
   return '<path d="M'+x+','+(y+3)+' Q'+(x+(endX-x)*.34).toFixed(1)+',78 '+endX.toFixed(1)+',106" fill="none" stroke="'+(i%2?'#68865e':'#506c4f')+'" stroke-width="'+(i%2?1.6:2.1)+'" stroke-linecap="round" opacity=".86"/>';
 }).join('');
 const petals=xs.map((x,i)=>{
   const [dark,light]=colours[picks[i]]||colours.rose;
   return '<g transform="translate('+x+' '+ys[i]+') scale('+(i===3?'1.02':'.85')+')">'+renderBloomHead(picks[i]||'rose',dark,light,i)+'</g>';
 }).join('');
 // A clipped strip of the same photograph lies in front of the stem ends,
 // so they actually disappear *inside* the photographed rim.
 return '<svg class="photo-blooms" viewBox="0 0 166 125" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+
 '<defs><clipPath id="maha-real-rim"><ellipse cx="82" cy="108" rx="${scene==='kuwait'?49:43}" ry="${scene==='kuwait'?6.8:7.5}"/></clipPath></defs>'+
 '<g class="photo-flower-stems">'+stems+'</g><g class="photo-flower-heads">'+petals+'</g>'+
 // Each source photograph needs its OWN front rim. Kuwait's new ceramic is
 // centred near (830,582) in the native 1672x941 photo, NOT at the legacy rim.
 // These coordinates match the 44.2%/48%/11%/17% CSS sprite box.
 (scene==='kuwait'?'<image href="./assets/rooms/maha-kuwait.webp" x="-667" y="-417" width="1509" height="849" preserveAspectRatio="none" clip-path="url(#maha-real-rim)"/>':
  scene==='story'?'<image href="./assets/rooms/maha-living-room.webp" x="-862" y="-479" width="1672" height="941" preserveAspectRatio="none" clip-path="url(#maha-real-rim)"/>':'')+
 '</svg>';
}
