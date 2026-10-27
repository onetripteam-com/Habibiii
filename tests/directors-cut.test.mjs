import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {paintedWorld} from '../js/painted-worlds.js';
import {FMAtmosphere} from '../js/fm-atmosphere.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const obj=p=>JSON.parse(read(p));
test('original illustrated scenes use unique gradient names and all requested motifs',()=>{
 const motifs=['palms','rain','chai','road','sun','moon','hills','mountains','city','stars','camera'];
 const ids=new Set();for(const m of motifs){const art=paintedWorld(m);assert.match(art,/class="director-frame"/);assert.match(art,/<svg/);const id=art.match(/id="(mw\d+)sky"/);assert.ok(id,m);assert.ok(!ids.has(id[1]),'no shared SVG gradient collision');ids.add(id[1]);}
});
test('room asset is intact and exactly 400 by 780 coordinates',()=>{
 const svg=read('assets/room-directors-cut.svg');assert.match(svg,/viewBox="0 0 400 780"/);for(const object of ['window','radio','letter','projector','suitcase','garden'])assert.ok(svg.toLowerCase().includes(object),object);
});
test('Director layer responds to actual room and portal scenes and stops FM when leaving',()=>{
 const js=read('js/director.js');assert.match(js,/MutationObserver/);assert.match(js,/director-room/);assert.match(js,/radioSound\.stop\(\)/);assert.match(js,/caption\)note\.textContent=caption/);
});
test('synthesized FM voices are gesture-activated and use no external audio',()=>{
 const ctor=new FMAtmosphere('88.3');assert.equal(ctor.running,false);assert.equal(ctor.context,null);const s=read('js/fm-atmosphere.js');assert.match(s,/AudioContext/);assert.doesNotMatch(s,/fetch\(|\.src\s*=/);
});
test('letters and radio have no draft brackets and names are honest',()=>{
 const letters=obj('content/letters.json');assert.equal(letters.letters.length,20);assert.doesNotMatch(JSON.stringify(letters),/\[(?:ADD|YOUR|REPLACE|MY)\b/i);
 assert.ok(letters.letters.every(x=>Array.isArray(x.pages)&&x.pages.length>=2));
 const conf=obj('content/config.json');assert.equal(conf.senderEmail,null);assert.equal(conf.senderName,'Your long-distance nuisance');
 const radio=obj('content/radio.json');assert.equal(radio.stations.length,5);assert.ok(radio.stations.every(x=>x.introAudio===null&&x.ambientAudio===null));
 assert.doesNotMatch(JSON.stringify(radio),/\[YOUR VOICE NOTE/i);
});
test('opening provides a genuine decline, keeps hug optional',()=>{
 const data=obj('content/hug.json');assert.ok(data.closing.includes('No hug. Entirely respected'));assert.ok(data.footnote);
});
test('work with reduced motion and descriptive style layers',()=>{
 const css=read('css/directors-cut.css');assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/\.director-illustration/);
});