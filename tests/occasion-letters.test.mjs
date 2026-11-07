import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {festivalDay,festivalVisible,unlockStatus} from '../js/letter-unlocks.js';
const now=s=>new Date(s);
test('the two occasions respect the Malankara Gregorian calendar',()=>{
 assert.equal(festivalDay('christmas',2026),'2026-12-25');
 assert.equal(festivalDay('easter',2026),'2026-04-05');
 assert.equal(festivalDay('easter',2027),'2027-03-28');
 assert.equal(festivalDay('unknown',2027),null);
});
test('occasion shelf appears near the actual date in Kuwait',()=>{
 assert.equal(festivalVisible('christmas',now('2026-11-07T09:00:00Z')),false);
 assert.equal(festivalVisible('christmas',now('2026-12-05T12:00:00Z')),true);
 assert.equal(festivalVisible('christmas',now('2027-01-03T12:00:00Z')),false);
 assert.equal(festivalVisible('easter',now('2027-03-27T22:00:00Z')),true);
 assert.equal(unlockStatus({type:'festival',name:'christmas'},{},now('2026-12-24T20:59:00Z')).open,false);
 assert.equal(unlockStatus({type:'festival',name:'christmas'},{},now('2026-12-24T21:01:00Z')).open,true);
});
test('all original letters remain and only two small occasion letters were added',()=>{
 const p=JSON.parse(readFileSync(new URL('../content/letters.json',import.meta.url),'utf8'));
 assert.equal(p.letters.length,22);
 assert.deepEqual(p.letters.filter(l=>l.section==='occasion').map(l=>l.occasion),['christmas','easter']);
 for(const l of p.letters.filter(l=>l.section==='occasion'))assert.ok(l.pages.length>=2);
});
test('mobile gets a real visual treatment and icon buttons remain accessible',()=>{
 const css=readFileSync(new URL('../css/letters-responsive-v2.css',import.meta.url),'utf8');
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const home=readFileSync(new URL('../js/new-home.js',import.meta.url),'utf8');
 assert.match(css,/postroom-pocket-scene/);
 assert.match(css,/@media\(max-width:759px\)/);
 assert.match(css,/@media\(min-width:760px\)/);
 assert.match(html,/letters-responsive-v2.css/);
 assert.match(home,/aria-label="Choose a room scene"/);
 assert.match(home,/aria-label="Adjust room lighting"/);
});
