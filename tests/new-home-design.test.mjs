import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {worldIllustration,doorIllustration} from '../js/home-art.js';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const worlds=['story','monsoon','sunroom','terracotta','midnight','cosmos'];
const places=['letters','music','movies','travel','games','garden','rest'];
test('six illustrated world scenes are distinct original vector drawings',()=>{
 const art=worlds.map(world=>worldIllustration(world));
 assert.equal(new Set(art).size,6);
 for(const a of art){assert.match(a,/viewBox="0 0 720 620"/);assert.match(a,/<svg/);assert.match(a,/<\/svg>/);assert.doesNotMatch(a,/(?:unsplash|lorem ipsum|TODO)/i);}
});
test('seven destinations have illustrated object identities',()=>{
 const art=places.map(doorIllustration);
 assert.equal(new Set(art).size,7);
 for(const a of art){assert.match(a,/viewBox="0 0 240 155"/);assert.match(a,/aria-hidden="true"/);}
});
test('home routes all seven doors through the existing portal and retains chosen flowers',()=>{
 const home=read('js/new-home.js');
 for(const id of places)assert.ok(home.includes("id:'"+id+"'"),id);
 for(const world of worlds)assert.ok(home.includes("id:'"+world+"'"),world);
 assert.match(home,/makePortalSystem/);
 assert.match(home,/bouquetMarkup\(chosen/);
 assert.match(home,/portal\.open\(button\.dataset\.door,button\)/);
 assert.match(home,/onNewBouquet\(\)/);
 assert.match(home,/onReplay/);
 assert.match(home,/roomTheme/);
 assert.match(home,/aria-modal="true"/);
});
test('phone and desktop designs are real separate compositions, not a narrow frame',()=>{
 const css=read('css/new-home.css');
 assert.match(css,/\.new-home/);
 assert.match(css,/@media\(max-width:759px\)/);
 assert.match(css,/@media\(min-width:760px\)/);
 assert.match(css,/overflow-y:auto!important/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(read('js/main.js'),/new-home\.js/);
});