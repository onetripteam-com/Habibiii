import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {photoBloomsMarkup} from '../js/photo-bouquet.js';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('real Kuwait vase is used without duplicating any photo rim or synthetic vase',()=>{
 const css=read('css/arrival-and-kuwait.css');
 const selector='.cinematic-room[data-theme="story"][data-kuwait-photo="ready"] .photographed-vase-flowers';
 const block=css.split(selector+'{')[1]?.split('}')[0];
 assert.ok(block,'Keep a Kuwait-only sprite calibration');
 const pct=name=>{
  const m=block.match(new RegExp(name+':([0-9.]+)%!important'));
  assert.ok(m,name+' requires percentage calibration');
  return Number(m[1])/100;
 };
 const left=pct('left'),top=pct('top'),width=pct('width'),height=pct('height');
 const scale=1672*width/166,letterbox=(941*height-125*scale)/2;
 const neckX=1672*left+82*scale,neckY=941*top+letterbox+108*scale;
 assert.ok(Math.abs(neckX-830)<4&&Math.abs(neckY-582)<4,
  'Selected flowers must remain aligned with the real photographed neck');
 for(const scene of ['kuwait','story','kerala','bengaluru']){
  const svg=photoBloomsMarkup(Array(7).fill('rose'),scene);
  assert.doesNotMatch(svg,/<image\\b|href="\\.\\/assets\\/rooms\\//,
   'Never paste a second copy of any room image over the vase');
  assert.doesNotMatch(svg,/maha-real-rim|<ellipse\\b/,
   'Never draw an additional dark oval / vase rim');
  assert.match(svg,/<clipPath id="maha-stem-neck"><rect x="0" y="0" width="166" height="105"\\/><\\/clipPath>/);
  assert.equal((svg.match(/clip-path="url\\(#maha-stem-neck\\)"/g)||[]).length,2,
   'Only stems and leaves should be clipped at the real vase neck');
  assert.equal((svg.match(/data-species="/g)||[]).length,7);
 }
 assert.match(css,/#room-bouquet \\.real-vase/);
 assert.match(css,/display:none!important/);
 assert.match(css,/\\.photo-blooms image/);
});

test('Photographic flowers form a compact living bouquet, not seven flat icons spread outside the vase',()=>{
 const picks=['rose','peony','lily','orchid','sunflower','jasmine','tulip'];
 const html=photoBloomsMarkup(picks,'kuwait');
 const heads=[...html.matchAll(/data-species="([^"]+)"/g)].map(x=>x[1]);
 assert.deepEqual(heads,picks);
 assert.match(html,/class="photo-flower-leaves"/);
 assert.match(html,/radialGradient/);
 const source=read('js/photo-bouquet.js');
 assert.match(source,/photoBloomHead\(id,i\)/);
 const points=[...source.matchAll(/\[(\d+),(\d+)\]/g)].slice(0,7).map(x=>[Number(x[1]),Number(x[2])]);
 assert.equal(points.length,7);
 const xs=points.map(p=>p[0]);
 assert.ok(Math.max(...xs)-Math.min(...xs)<85,'Flower heads should be grouped over one ceramic neck');
});

test('flower-selection preview includes a vase with the same 500×580 SVG geometry',()=>{
 const source=read('js/flowers.js'),css=read('css/flora-rebuild.css');
 assert.match(source,/const studioVaseMarkup=/);
 assert.match(source,/class="studio-vase" viewBox="0 0 500 580"/);
 assert.match(source,/renderPlace\.innerHTML=\(chosen\.length\?bouquetMarkup\(chosen,\{stage:complete\?'final':'preview'\}\):''\)\+\(!complete\?studioVaseMarkup\(\):''\)/);
 assert.match(source,/stage:'gather'\}\)\+studioVaseMarkup\(\)/);
 assert.match(source,/bouquetMarkup\(chosen,\{wrapped:true,stage:'final'\}\)/);
 assert.match(css,/\.f2-bouquet>\.studio-vase/);
 assert.match(css,/transform:translate\(-50%,-50%\)!important/);
 assert.match(css,/grid-template-rows:minmax\(0,52%\) minmax\(0,48%\)/);
});

test('Kuwait vase touch zone follows the new ceramic without moving other portals',()=>{
 const source=read('js/room-photo-stage.js');
 assert.match(source,/story:\{flowers:\[43,57,14,27\]/);
 assert.match(source,/photoBloomsMarkup\(chosen,spriteScene\)/);
 const sw=read('sw.js');
 assert.ok(sw.includes('maha-kuwait.webp'));
});
