import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdir} from 'node:fs/promises';
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
let passed=0;const findings=[];
async function check(browser,engine,w,h){
 const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:engine==='webkit'&&w<760,hasTouch:w<760,reducedMotion:'reduce'});
 await context.addInitScript(()=>{
  localStorage.setItem('maha.escape.v1.completed','true');
  localStorage.setItem('maha.escape.v1.flowers',JSON.stringify(Array(7).fill('rose')));
  localStorage.setItem('maha.escape.v1.visits','3');
 });
 const page=await context.newPage(),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',response=>{if(response.url().startsWith(BASE)&&response.status()>=400)missing.push(response.url()+':'+response.status())});
 try{
 await page.goto(BASE,{waitUntil:'domcontentloaded'});
 await page.locator('.room-scene').waitFor({timeout:20000});
 await page.locator('.director-illustration').waitFor({timeout:12000});
 await page.waitForTimeout(250);
 const room=page.locator('.room-canvas'),rc=await room.boundingBox();
 assert.ok(rc&&rc.width>150&&rc.height>300,'room illustration should have useful size');
 assert.ok(Math.abs((rc.width/rc.height)-(400/780))<.07,'artboard must not distort: '+JSON.stringify(rc));
 const guide=page.locator('.room-guide');
 if(w>=760 && h>=570){
   assert.ok(await page.locator('.room-guide .guide-inner').isVisible(),'desktop directory missing');
   if(w>=1180)assert.ok(await page.locator('.room-editorial').isVisible(),'desktop editorial panel missing');
   assert.ok((await guide.boundingBox()).x>rc.x,'desktop directory must sit right of illustration');
 }else{
   const toggle=page.locator('.guide-toggle');
   assert.ok(await toggle.isVisible(),'mobile explore control missing');
   assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
   assert.ok(await page.locator('[data-studio-door="letters"]').isVisible());
 }
 const art=await page.locator('.director-illustration').evaluate(img=>img.complete&&img.naturalWidth>0);
 assert.ok(art,'room illustration did not load');
 await page.screenshot({path:join(OUT,`${engine}-${w}x${h}-room.png`),animations:'disabled'});
 await page.locator('[data-studio-door="letters"]').click();
 await page.locator('.portal-screen:not([hidden])').waitFor({timeout:15000});
 await page.locator('.portal-back').click();
 await page.locator('.room-scene:not(.room-portal-away)').waitFor({timeout:15000});
 const trigger=page.locator('#theme-trigger');
 if(w<760){await page.locator('.guide-toggle').click();}
 await trigger.click();
 await page.locator('[data-pick-theme="cosmos"]').click();
 await page.locator('#theme-done').click();
 await page.waitForFunction(()=>document.querySelector('.director-illustration')?.getAttribute('src')?.includes('cosmos'));
 await page.screenshot({path:join(OUT,`${engine}-${w}x${h}-cosmos.png`),animations:'disabled'});
 assert.equal(await page.locator('.room-scene').getAttribute('data-theme'),'cosmos');
 if(w===393){
  await page.locator('#room-bouquet').click();
  await page.locator('.flowers-scene').waitFor();
  for(let i=0;i<7;i++)await page.locator('[data-flower="rose"]').click();
  await page.locator('#carry-bouquet').waitFor({state:'visible',timeout:13000});
  await page.locator('#carry-bouquet').click();
  await page.locator('.room-scene').waitFor();
  const flowers=await page.evaluate(()=>JSON.parse(localStorage.getItem('maha.escape.v1.flowers')));
  assert.deepEqual(flowers,Array(7).fill('rose'),'repeated flowers must persist');
 }
 assert.deepEqual(errors,[],'browser exceptions: '+errors.join('; '));
 assert.deepEqual(missing,[],'missing local assets: '+missing.join('; '));
 findings.push(`PASS ${engine} ${w}x${h} room/theme/portal`);
 passed++;
 }catch(e){findings.push(`FAIL ${engine} ${w}x${h}: ${e.stack?.slice(0,900)||e}`);throw e}
 finally{await context.close()}
}
try{
 const engines=[['chromium',chromium],['webkit',webkit]];
 for(const [name,launcher] of engines){
  const browser=await launcher.launch({headless:true});
  try{
   for(const [w,h] of [[360,740],[393,852],[402,874],[768,1024],[1280,720],[1440,900],[1920,1080]]){
    await check(browser,name,w,h);
   }
  }finally{await browser.close()}
 }
}finally{await new Promise(resolve=>server.close(resolve))}
console.log(findings.join('\n'));console.log(`Finished ${passed} responsive browser checks.`);
