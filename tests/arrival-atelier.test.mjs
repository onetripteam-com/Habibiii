import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('No, Never and Not at all are distinct replies, never forced hugs',()=>{
 const hug=read('js/hug.js');
 for(const id of ['no','never','not-at-all'])assert.ok(hug.includes('data-hug-no="'+id+'"'),id);
 assert.match(hug,/No-Hug Certificate/);
 assert.match(hug,/Head of Flowers/);
 assert.match(hug,/The whale has updated his CV/);
 assert.match(hug,/result\.dataset\.outcome='no'/);
 assert.match(hug,/textContent='Fine\. Show me the flowers →'/);
 assert.match(hug,/root\.querySelector\('#next-flowers'\)\.addEventListener\('click',leave\)/);
});

test('flower backdrop uses bundled generated-photo bokeh but controls remain live',()=>{
 const css=read('css/atelier-photo.css');
 assert.match(css,/data:image\/webp;base64,/);
 assert.match(css,/flowers-scene::before/);
 assert.match(read('js/flowers.js'),/chosen\.push\(f\.id\)/);
 assert.match(read('js/flowers.js'),/flower-steps/);
 const index=read('index.html');
 assert.ok(index.indexOf('atelier-photo.css')>index.indexOf('experience-polish.css'));
 const sw=read('sw.js');
 assert.ok(sw.includes('atelier-photo.css'));
});

test('new Kuwait artwork is optional until placed, with safe fallback and flowers matching the active image',()=>{
 const stage=read('js/room-photo-stage.js');
 assert.match(stage,/maha-kuwait\.webp/);
 assert.match(stage,/maha-living-room\.webp/);
 assert.match(stage,/kuwaitMissing=true/);
 assert.match(stage,/photoBloomsMarkup\(chosen,spriteScene\)/);
 assert.match(read('css/arrival-and-kuwait.css'),/data-kuwait-photo="ready"/);
});
