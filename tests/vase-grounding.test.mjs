import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {photoBloomsMarkup} from '../js/photo-bouquet.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('approved Kuwait flowers reach the native photographic vase mouth',()=>{
 const css=read('css/arrival-and-kuwait.css');
 const selector='.cinematic-room[data-theme="story"][data-kuwait-photo="ready"] .photographed-vase-flowers';
 const block=css.split(selector+'{')[1]?.split('}')[0];
 assert.ok(block,'An explicit Kuwait-only vase calibration must exist');
 const pct=name=>{
  const match=block.match(new RegExp(name+':([0-9.]+)%!important'));
  assert.ok(match,name+' needs calibrated percentage position');
  return Number(match[1])/100;
 };
 const left=pct('left'),top=pct('top'),width=pct('width'),height=pct('height');
 // Rendered SVG uses xMidYMid meet within the original 1672×941 photograph.
 const scale=(1672*width)/166,letterbox=(941*height-125*scale)/2;
 const rimX=1672*left+82*scale,rimY=941*top+letterbox+108*scale;
 assert.ok(Math.abs(rimX-830)<4,'Flower neck x must align with Kuwait vase: '+rimX);
 assert.ok(Math.abs(rimY-582)<4,'Flower neck y must align with Kuwait vase: '+rimY);
 const output=photoBloomsMarkup(Array(7).fill('rose'),'kuwait');
 assert.ok(output.includes('<ellipse cx="82" cy="108" rx="49" ry="6.8"/>'),
  'A real SVG clipPath should cover the correct ceramic opening');
 assert.ok(!output.includes('${scene'), 'Never leak JavaScript expressions into SVG attributes');
 assert.ok(output.includes('maha-kuwait.webp'));
 assert.equal((output.match(/clip-path="url\(#maha-real-rim\)"/g)||[]).length,1);
 const sprite=read('js/photo-bouquet.js');
 assert.match(sprite,/scene==='kuwait'/);
 assert.ok(sprite.includes('href="./assets/rooms/maha-kuwait.webp"'));
 // The clipped photo above the stems must sample the SAME pixels as the vase.
 const crop= sprite.match(/href="\.\/assets\/rooms\/maha-kuwait\.webp" x="(-?[0-9.]+)" y="(-?[0-9.]+)" width="([0-9.]+)" height="([0-9.]+)"/);
 assert.ok(crop,'The ceramic rim must occlude the stems');
 const [,sx,sy,sw,sh]=crop.map(Number);
 const sourceX=(82-sx)*1672/sw,sourceY=(108-sy)*941/sh;
 assert.ok(Math.abs(sourceX-830)<4&&Math.abs(sourceY-582)<4,
  'The rim composite must sample the real vase opening, not the old photo');
});

test('flower-selection preview includes a vase with the same 500×580 SVG geometry',()=>{
 const source=read('js/flowers.js'),css=read('css/flora-rebuild.css');
 assert.match(source,/const studioVaseMarkup=/);
 assert.match(source,/class="studio-vase" viewBox="0 0 500 580"/);
 assert.match(source,/bouquetMarkup\(chosen,\{stage:complete\?'final':'preview'\}\)\+\(!complete\?studioVaseMarkup\(\):''\)/);
 assert.match(source,/stage:'gather'\}\)\+studioVaseMarkup\(\)/);
 assert.match(source,/bouquetMarkup\(chosen,\{wrapped:true,stage:'final'\}\)/);
 assert.match(css,/\.f2-bouquet>\.studio-vase/);
 assert.match(css,/transform:translate\(-50%,-50%\)!important/);
 assert.match(css,/grid-template-rows:minmax\(0,48%\) minmax\(0,52%\)/);
});

test('Kuwait vase touch zone follows the new ceramic without moving other portals',()=>{
 const source=read('js/room-photo-stage.js');
 assert.match(source,/story:\{flowers:\[43,57,14,27\]/);
 assert.match(source,/photoBloomsMarkup\(chosen,spriteScene\)/);
 const sw=read('sw.js');
 assert.ok(sw.includes('maha-kuwait.webp'));
});
