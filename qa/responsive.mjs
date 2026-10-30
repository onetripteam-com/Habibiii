/** Responsive integration QA: a real HTTP site, actual Chromium + WebKit engines. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {join,resolve,extname} from 'node:path';
import {chromium,webkit} from 'playwright';
const ROOT=resolve('.'),OUT=join(ROOT,'qa','screenshots');
await mkdir(OUT,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.vtt':'text/vtt'};
const server=createServer(async(req,res)=>{
 let raw;try{raw=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end();return}
 const path=resolve(ROOT,'.'+(raw==='/'?'/index.html':raw));
 if(!path.startsWith(ROOT+'/')&&path!==ROOT){res.writeHead(403);res.end();return}
 try{const bytes=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(bytes)}
 catch{res.writeHead(404);res.end('not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const BASE='http://127.0.0.1:'+server.address().port+'/';
const sizes=[[360,740],[393,852],[402,874],[768,1024],[1280,720],[1440,900],[1920,1080]];
const reports=[];let failed=0;
async function run(engine,launcher,w,h){
 const browser=await launcher.launch({headless:true});
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:engine==='webkit'&&w<760,hasTouch:w<760,reducedMotion:'reduce'});
 await context.addInitScript(()=>{
  localStorage.setItem('maha.escape.v1.completed','true');
  localStorage.setItem('maha.escape.v1.flowers',JSON.stringify(Array(7).fill('rose')));
  localStorage.setItem('maha.escape.v1.visits','3');
 });
 const page=await context.newPage(),errors=[],missing=[];
 page.setDefaultTimeout(12000);
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith(BASE)&&r.status()>=400)missing.push(r.url()+':'+r.status())});
 const key=`${engine}-${w}x${h}`;
 try{
  await page.goto(BASE,{waitUntil:'domcontentloaded'});
  await page.locator('.room-scene.new-home').waitFor({timeout:16000});
  assert.ok(await page.locator('.room-heading h1').isVisible());
  assert.equal(await page.locator('[data-door]').count(),7);
  const artManifestResponse=await page.request.get(new URL('./assets/rooms/originals/manifest.json',BASE).href);
  assert.equal(artManifestResponse.status(),200);
  const artManifest=await artManifestResponse.json();
  const variant=w<760?'portrait':'wide';
  const original=artManifest?.scenes?.story?.[variant]===true;
  if(original)await page.waitForFunction(()=>document.querySelector('.cinematic-room')?.dataset.originalArt==='true',{timeout:15000});


  assert.equal(await page.locator('.room-object .physical-object-art').count(),7,'Every scene portal must contain physical art');
  assert.equal(await page.locator('.table-bouquet .real-vase').count(),1,'Bouquet must live in a physical vase');
  if(!original)assert.ok(await page.locator('.object-movies .physical-object-art').isVisible(),'Physical cinema screen must be RENDERED, not hidden by CSS');
  assert.ok(await page.locator('.table-bouquet .real-vase').isVisible(),'Vase must be rendered, not a hidden SVG');
  const actualArt=await page.locator('.object-drawing').first().evaluate(el=>({
    display:getComputedStyle(el).display,
    svg:getComputedStyle(el.querySelector('svg')).display,
    area:el.getBoundingClientRect().width*el.getBoundingClientRect().height
  }));
  if(!original)assert.ok(actualArt.display!=='none'&&actualArt.svg!=='none'&&actualArt.area>100,'Actual foreground props must occupy visible pixels');
  if(w<760){
    assert.ok(await page.locator('#room-peek').isVisible(),'The phone room needs a discoverable peek control');
    await page.locator('#room-peek').click();
    assert.equal(await page.locator('.cinematic-room').getAttribute('data-peek'),'2');
    await page.locator('#room-peek').click();
    assert.equal(await page.locator('.cinematic-room').getAttribute('data-peek'),'0');
    await page.locator('#room-peek').click();
  }

  assert.equal(await page.locator('.real-vase ellipse[fill]').count()>0,true,'Vase needs drawn blooms');
  assert.equal(await page.locator('.physical-movies').count(),1,'Cinema portal must be an actual screen');

  assert.ok(await page.locator('.atelier-home').isVisible(),'Atelier should be active');
  assert.equal(await page.locator('.atelier-illustration').count(),0,'No invisible legacy cartoon room markup should be mounted');
  assert.equal(await page.locator('.theme-preview-art').count(),6,'All six themes should have real photographic previews');
  assert.ok(await page.locator('#take-me-anywhere').isVisible(),'surprise portal should be reachable');
  assert.ok(await page.locator('.cinematic-photo').count()===1,'Photo stage should exist');
  if(w<760){
    assert.ok(await page.locator('.cinematic-photo').isVisible(),'Mobile photo stage should be visible');
    const background=await page.locator('.cinematic-photo').evaluate(el=>getComputedStyle(el).backgroundImage);
    assert.ok(background.includes(original?'story-'+variant+'.webp':'story.webp'),'Mobile must use real local room photography');
    const labels=await page.locator('[data-door] .object-label').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).display!=='none'&&getComputedStyle(n).opacity!=='0'));
    assert.ok(labels,'All seven mobile doors need readable on-screen labels');
  }
  if(w>=760){
    const photo=page.locator('.cinematic-photo');
    assert.ok(await photo.isVisible(),'Real scene image should be visible on PC');
    const data=await photo.evaluate(el=>({background:getComputedStyle(el).backgroundImage,area:el.getBoundingClientRect().width}));
    assert.ok(data.background.includes(original?'story-'+variant+'.webp':'story.webp') && data.area>200,'Photographic background should be loaded on desktop');
    const image=await page.request.get(new URL(original?'./assets/rooms/originals/story-'+variant+'.webp':'./assets/rooms/story.webp',BASE).href);
    assert.equal(image.status(),200,'Local scene must be packaged');
  }
  await page.locator('#room-window').click();
  assert.equal(await page.locator('.atelier-home').getAttribute('data-sky'),'rain');
  await page.locator('#room-window').click();
  assert.equal(await page.locator('.atelier-home').getAttribute('data-sky'),'night');
  await page.locator('#room-window').click();
  assert.equal(await page.locator('.atelier-home').getAttribute('data-sky'),'natural');
  assert.equal(await page.locator('.home-feature-art').count(),0,'No hidden thumbnail vector art should be in the new room');
  const overflow=await page.locator('.new-home').evaluate(el=>el.scrollWidth-el.clientWidth);
  assert.ok(overflow<=5,'horizontal scroll overflow: '+overflow);
  const targets=await page.locator('[data-door]').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,x:r.x,y:r.y,bottom:r.bottom,right:r.right}}));
  for(const r of targets){assert.ok(r.w>=44&&r.h>=44,'comfortable touch target');assert.ok(r.x>=0&&r.y>=0&&r.right<=w+1&&r.bottom<=h+1,'all objects fit on screen')}
  const frame=await page.locator('#app').boundingBox();
  assert.ok(Math.abs(frame.width-w)<2&&Math.abs(frame.height-h)<2,'home fills viewport: '+JSON.stringify({frame,w,h}));
  if(w>=760){const room=await page.locator('.inhabited-room').boundingBox();assert.ok(room.x<1&&room.y<1&&Math.abs(room.width-w)<2&&Math.abs(room.height-h)<2,'desktop room has no inner panel')}

  await page.screenshot({path:join(OUT,key+'-home.png'),animations:'disabled'});
  await page.locator('#theme-trigger').click();
  await page.locator('#home-world-overlay').waitFor({state:'visible'});
  assert.equal(await page.locator('[data-world]').count(),6);
  await page.locator('[data-world="cosmos"]').click();
  assert.equal(await page.locator('.new-home').getAttribute('data-theme'),'cosmos');
  if(w>=760){
    const photo=await page.locator('.cinematic-photo').evaluate(el=>getComputedStyle(el).backgroundImage);
    assert.ok(photo.includes(artManifest?.scenes?.cosmos?.[variant]?'cosmos-'+variant+'.webp':'cosmos.webp'),'Cosmos must load a DIFFERENT real photo, not recolour story');
  } else {
    assert.equal(await page.locator('.cinematic-note').isVisible(),false,'PC-only copy must not leak into mobile');
  }
  await page.screenshot({path:join(OUT,key+'-cosmos.png'),animations:'disabled'});
  await page.locator('[data-door="letters"]').scrollIntoViewIfNeeded();
  await page.locator('[data-door="letters"]').click();
  await page.locator('#portal-screen').waitFor({state:'visible'});
  await page.locator('#portal-screen.portal-arrived').waitFor({state:'visible',timeout:15000});
  await page.locator('.portal-back').click();
  await page.locator('#portal-screen').waitFor({state:'hidden',timeout:16000});
  await page.locator('.remembering-home:not([inert])').waitFor();
  await page.locator('.inhabited-room').scrollIntoViewIfNeeded();
  await page.screenshot({path:join(OUT,key+'-doors.png'),animations:'disabled'});
  // A real DOM portal tap, not a test-name assertion or static markup check.
  await page.locator('#take-me-anywhere').click();
  await page.locator('#portal-screen').waitFor({state:'visible'});
  assert.ok(await page.locator('#portal-screen').getAttribute('data-place'));
  await page.locator('.portal-back').click();
  await page.locator('#portal-screen').waitFor({state:'hidden',timeout:16000});
  if(w===393||w===1440){
   for(const scene of ['letters','music','movies','travel','games','garden','rest']){
     const door=page.locator('[data-door="'+scene+'"]');
     await door.click();
     await page.locator('#portal-screen[data-place="'+scene+'"]').waitFor({state:'visible'});
     await page.locator('#portal-screen.portal-arrived').waitFor({state:'visible',timeout:15000});
     const worldRoot=${JSON.stringify(app)}[scene];
     await page.locator(worldRoot).waitFor({state:'visible',timeout:15000});
     const content=page.locator('#portal-screen .portal-content');
     await content.locator(':scope > *').first().waitFor({state:'visible',timeout:10000});
     await page.screenshot({path:join(OUT,key+'-world-'+scene+'.png'),animations:'disabled'});
     await page.locator('.portal-back').click();
     await page.locator('#portal-screen').waitFor({state:'hidden',timeout:16000});
   }
  }
  if(w===393){
   await page.locator('#room-bouquet').scrollIntoViewIfNeeded();
   await page.locator('#room-bouquet').click();
   await page.locator('.flowers-scene').waitFor();
   for(let i=0;i<7;i++)await page.locator('[data-flower="rose"]').click();
   await page.locator('#carry-bouquet').waitFor({state:'visible',timeout:18000});
   await page.locator('#carry-bouquet').click();
   await page.locator('.new-home').waitFor();
   assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('maha.escape.v1.flowers'))),Array(7).fill('rose'));
  }
  assert.deepEqual(errors,[],'JS errors: '+errors.join('; '));
  assert.deepEqual(missing,[],'Missing assets: '+missing.join('; '));
  reports.push('PASS '+key);
 }catch(err){failed++;reports.push('FAIL '+key+': '+String(err).slice(0,1100))}
 finally{await context.close();await browser.close()}
}
try{
 for(const [name,engine] of [['chromium',chromium],['webkit',webkit]]){
  for(const [w,h] of sizes)await run(name,engine,w,h);
 }
}finally{await new Promise(resolve=>server.close(resolve))}
console.log(reports.join('\n'));
console.log(`Finished ${reports.length} responsive browser checks; failures=${failed}`);
if(failed)process.exitCode=1;