const PALETTE={
 rose:{outer:'#cb6961',inner:'#efafa0',shadow:'#a34f50',accent:'#d9a95b'},
 daisy:{outer:'#f7ecd5',inner:'#fffaf0',shadow:'#d8bd87',accent:'#e9bb58'},
 sunflower:{outer:'#edae48',inner:'#f7d879',shadow:'#d98c2f',accent:'#644a32'},
 tulip:{outer:'#d9796e',inner:'#f2b1a0',shadow:'#b85253',accent:'#dcb767'},
 peony:{outer:'#d99ba0',inner:'#f1c7ba',shadow:'#bb747f',accent:'#edc772'},
 lily:{outer:'#f5e2b7',inner:'#fff5da',shadow:'#d9b992',accent:'#b67a3d'},
 orchid:{outer:'#c7a1c5',inner:'#ebcadc',shadow:'#986f9f',accent:'#c47870'},
 lavender:{outer:'#9c8bbd',inner:'#bfb0d2',shadow:'#736999',accent:'#e5c6a4'},
 jasmine:{outer:'#fff4d6',inner:'#fffdf4',shadow:'#dbcfa7',accent:'#ebc977'},
 marigold:{outer:'#eab047',inner:'#ffce66',shadow:'#c78730',accent:'#e7a43b'},
 hibiscus:{outer:'#cf615c',inner:'#ef9f8c',shadow:'#a4404c',accent:'#f0c54e'},
 iris:{outer:'#8c83b1',inner:'#b9abd2',shadow:'#645a92',accent:'#e3b96d'},
 lotus:{outer:'#d59ba1',inner:'#f4c8c6',shadow:'#b57482',accent:'#edcd7d'}
};
const STEM='#5c855d', STEM_DARK='#4b7050';
let seq=0;
const safeId=id=>String(id).replace(/[^a-z0-9-]/gi,'');
const esc=x=>String(x).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
function hashCode(str){let h=0;for(let i=0;i<str.length;i++)h=((h<<5)-h)+str.charCodeAt(i)|0;return Math.abs(h);}
function rng(seed){let x=(hashCode(seed)%2147483646)+1;return ()=>{x=(x*48271)%2147483647;return (x-1)/2147483646;};}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function paintDefs(uid,p){
 return `
 <defs>
  <linearGradient id="petal-${uid}" x1="0" y1="0" x2="0" y2="1">
   <stop offset="0" stop-color="${p.inner}"/>
   <stop offset=".57" stop-color="${p.outer}"/>
   <stop offset="1" stop-color="${p.shadow}"/>
  </linearGradient>
  <radialGradient id="petal-wash-${uid}" cx=".45" cy=".24" r=".9">
   <stop offset="0" stop-color="${p.inner}" stop-opacity=".95"/>
   <stop offset=".65" stop-color="${p.outer}" stop-opacity=".88"/>
   <stop offset="1" stop-color="${p.shadow}" stop-opacity=".96"/>
  </radialGradient>
  <linearGradient id="leaf-${uid}" x1="0" y1="0" x2="1" y2="1">
   <stop offset="0" stop-color="#9cb281"/>
   <stop offset="1" stop-color="#4f7454"/>
  </linearGradient>
  <radialGradient id="center-${uid}" cx=".5" cy=".45" r=".8">
   <stop offset="0" stop-color="${p.accent}"/>
   <stop offset="1" stop-color="${p.shadow}"/>
  </radialGradient>
  <filter id="soft-${uid}" x="-25%" y="-25%" width="150%" height="150%">
   <feGaussianBlur stdDeviation=".7" result="b"/>
   <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .22 0" result="soft"/>
   <feBlend in="SourceGraphic" in2="soft" mode="multiply"/>
  </filter>
  <filter id="shadow-${uid}" x="-30%" y="-30%" width="160%" height="160%">
   <feDropShadow dx="0" dy="2.2" stdDeviation="2.3" flood-color="#705241" flood-opacity=".14"/>
  </filter>
  <filter id="grain-${uid}" x="-20%" y="-20%" width="140%" height="140%">
   <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${hashCode(uid)%97}" result="noise"/>
   <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .12 0"/>
   <feBlend in="SourceGraphic" mode="soft-light"/>
  </filter>
 </defs>`;
}
function paintedPetal(cx,cy,angle,length,width,fill,stroke,seed,highlight=true){
 const rand=rng(seed); const lean=(rand()-.5)*6, pinch=.32+rand()*.1, belly=.4+rand()*.12, tip=length*(.96+rand()*.1);
 const p1x=cx-width*(.55+rand()*.15), p1y=cy-length*pinch;
 const p2x=cx-width*(.95+rand()*.2), p2y=cy-length*belly;
 const tx=cx+(rand()-.5)*3, ty=cy-tip;
 const p3x=cx+width*(.95+rand()*.2), p3y=cy-length*belly;
 const p4x=cx+width*(.55+rand()*.15), p4y=cy-length*pinch;
 const highlightPath=`M ${cx.toFixed(2)} ${cy.toFixed(2)} C ${(cx-width*.24).toFixed(2)} ${(cy-length*.2).toFixed(2)} ${(cx-width*.2).toFixed(2)} ${(cy-length*.56).toFixed(2)} ${(cx-width*.05).toFixed(2)} ${(cy-length*.84).toFixed(2)}`;
 return `<g transform="rotate(${angle+lean} ${cx} ${cy})"><path d="M ${cx} ${cy} C ${p1x.toFixed(2)} ${p1y.toFixed(2)} ${p2x.toFixed(2)} ${p2y.toFixed(2)} ${tx.toFixed(2)} ${ty.toFixed(2)} C ${p3x.toFixed(2)} ${p3y.toFixed(2)} ${p4x.toFixed(2)} ${p4y.toFixed(2)} ${cx} ${cy} Z" fill="${fill}" stroke="${stroke}" stroke-opacity=".22" stroke-width="1.25"/><path d="${highlightPath}" fill="none" stroke="#fffdf9" stroke-opacity="${highlight?'.26':'.14'}" stroke-width="1.2" stroke-linecap="round"/></g>`;
}
function petalRing({uid,count=8,cx=100,cy=88,length=48,width=18,radius=22,offset=0,fill,stroke,seed='x'}){
 let s='';
 for(let i=0;i<count;i++){
  const a=offset+(360/count)*i; const rad=a*Math.PI/180;
  const px=cx+Math.sin(rad)*radius, py=cy-Math.cos(rad)*radius;
  s+=paintedPetal(px,py,a,length,width,fill,stroke,`${seed}-${i}`);
 }
 return s;
}
function dottedCenter(cx,cy,r,fill,n=26){
 let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
 for(let i=0;i<n;i++){
  const a=(Math.PI*2/n)*i, rr=r*(.2+.72*((i*7)%n)/n);
  const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;s+=`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(i%3?1.3:1.7)}" fill="#e9c06c" opacity=".68"/>`;
 }
 return s;
}
function flowerHead(id,uid){
 const p=PALETTE[id]||PALETTE.rose; const petalFill=`url(#petal-${uid})`, washFill=`url(#petal-wash-${uid})`, centerFill=`url(#center-${uid})`;
 let s='';
 if(id==='rose'){
  s+=petalRing({uid,count:6,cx:100,cy:87,length:44,width:18,radius:18,offset:10,fill:petalFill,stroke:p.shadow,seed:`${uid}-r1`});
  s+=petalRing({uid,count:5,cx:100,cy:87,length:36,width:16,radius:10,offset:18,fill:washFill,stroke:p.shadow,seed:`${uid}-r2`});
  s+=`<path d="M88 95c4-23 31-25 27-2-4 18-22 17-22 4 0-8 8-13 17-8 4 2 6 7 4 12" fill="none" stroke="${p.shadow}" stroke-width="4.5" stroke-linecap="round"/><path d="M96 92c5-10 12-11 15-2" fill="none" stroke="#fff7f0" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"/>`;
 } else if(id==='peony'){
  s+=petalRing({uid,count:10,cx:100,cy:90,length:42,width:21,radius:22,offset:2,fill:petalFill,stroke:p.shadow,seed:`${uid}-p1`});
  s+=petalRing({uid,count:8,cx:100,cy:90,length:34,width:19,radius:12,offset:14,fill:washFill,stroke:p.shadow,seed:`${uid}-p2`});
  s+=petalRing({uid,count:6,cx:100,cy:92,length:25,width:13,radius:3,offset:6,fill:petalFill,stroke:p.shadow,seed:`${uid}-p3`});
  s+=`<circle cx="100" cy="93" r="5.8" fill="${p.accent}" opacity=".75"/>`;
 } else if(id==='sunflower'){
  s+=petalRing({uid,count:18,cx:100,cy:88,length:44,width:12,radius:28,offset:0,fill:petalFill,stroke:p.shadow,seed:`${uid}-s1`});
  s+=petalRing({uid,count:18,cx:100,cy:88,length:32,width:10,radius:18,offset:10,fill:washFill,stroke:p.shadow,seed:`${uid}-s2`});
  s+=dottedCenter(100,88,24,centerFill,38);
 } else if(id==='tulip'){
  s+=paintedPetal(84,110,-12,58,20,petalFill,p.shadow,`${uid}-t1`);
  s+=paintedPetal(100,118,0,74,23,washFill,p.shadow,`${uid}-t2`);
  s+=paintedPetal(116,110,12,58,20,petalFill,p.shadow,`${uid}-t3`);
  s+=`<path d="M79 118Q100 133 121 118L116 129Q100 136 84 129Z" fill="#74a06c" opacity=".42"/><path d="M84 84q8 15 16 31 11-16 18-32" fill="none" stroke="#fffaf4" stroke-opacity=".28" stroke-width="2.4" stroke-linecap="round"/>`;
 } else if(id==='lily'){
  for(let i=0;i<6;i++) s+=paintedPetal(100,93,i*60,59,17,i%2?petalFill:washFill,p.shadow,`${uid}-l${i}`);
  s+=`<circle cx="100" cy="92" r="7" fill="#f8dfb2"/>`;
  for(let i=0;i<6;i++){const a=i*Math.PI/3;const x=100+Math.cos(a)*18,y=92+Math.sin(a)*18;s+=`<path d="M100 93 ${x.toFixed(1)} ${y.toFixed(1)}" stroke="#a36e3a" stroke-width="1.7"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="2.3" ry="5.4" fill="#a36e3a" transform="rotate(${(i*60)-10} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;}
  for(let i=0;i<7;i++){const x=84+i*4.7,y=78+(i%2?7:0);s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6" fill="#c38b55" opacity=".55"/>`;}
 } else if(id==='orchid'){
  s+=paintedPetal(78,84,-34,48,25,washFill,p.shadow,`${uid}-o1`);
  s+=paintedPetal(122,84,34,48,25,washFill,p.shadow,`${uid}-o2`);
  s+=paintedPetal(67,112,-65,44,21,petalFill,p.shadow,`${uid}-o3`);
  s+=paintedPetal(133,112,65,44,21,petalFill,p.shadow,`${uid}-o4`);
  s+=`<path d="M87 88Q100 65 113 88L122 110Q101 140 77 110Z" fill="${washFill}" stroke="${p.shadow}" stroke-opacity=".28" stroke-width="1.4"/><path d="M92 104Q100 84 108 104Q111 118 100 122Q89 117 92 104Z" fill="${centerFill}"/><path d="M95 106q6 3 10 0" fill="none" stroke="#fffaf4" stroke-opacity=".28" stroke-width="1.5"/>`;
 } else if(id==='hibiscus'){
  s+=petalRing({uid,count:5,cx:100,cy:92,length:50,width:25,radius:26,offset:0,fill:petalFill,stroke:p.shadow,seed:`${uid}-h1`});
  s+=`<path d="M100 94Q118 97 138 67" stroke="${p.shadow}" stroke-width="5" fill="none" stroke-linecap="round"/><g fill="#f8d775"><circle cx="140" cy="66" r="4.8"/><circle cx="145" cy="58" r="2.8"/><circle cx="137" cy="56" r="2.5"/><circle cx="146" cy="67" r="2.2"/></g>`;
 } else if(id==='lotus'){
  s+=petalRing({uid,count:7,cx:100,cy:103,length:51,width:21,radius:10,offset:0,fill:petalFill,stroke:p.shadow,seed:`${uid}-lo1`});
  s+=petalRing({uid,count:6,cx:100,cy:108,length:36,width:16,radius:3,offset:18,fill:washFill,stroke:p.shadow,seed:`${uid}-lo2`});
  s+=`<ellipse cx="100" cy="108" rx="15" ry="6" fill="${centerFill}"/>`;
 } else if(id==='daisy'){
  s+=petalRing({uid,count:16,cx:100,cy:90,length:41,width:10,radius:22,offset:2,fill:washFill,stroke:p.shadow,seed:`${uid}-d1`});
  s+=dottedCenter(100,90,13,centerFill,18);
 } else if(id==='jasmine'){
  s+=petalRing({uid,count:6,cx:100,cy:90,length:31,width:15,radius:10,offset:4,fill:washFill,stroke:p.shadow,seed:`${uid}-j1`});
  s+=`<circle cx="100" cy="90" r="8" fill="#f0d486" opacity=".66"/>`;
 } else if(id==='lavender'){
  for(let j=0;j<8;j++){
   const y=122-j*11, w=11-j*.5;
   s+=`<ellipse cx="${94-w/2}" cy="${y}" rx="${w}" ry="${6+j*.15}" transform="rotate(-34 ${94-w/2} ${y})" fill="${j%2?washFill:petalFill}" stroke="${p.shadow}" stroke-opacity=".18" stroke-width="1"/><ellipse cx="${106+w/2}" cy="${y-2}" rx="${w}" ry="${6+j*.15}" transform="rotate(34 ${106+w/2} ${y-2})" fill="${j%2?petalFill:washFill}" stroke="${p.shadow}" stroke-opacity=".18" stroke-width="1"/>`;
  }
 } else if(id==='marigold'){
  s+=petalRing({uid,count:22,cx:100,cy:90,length:24,width:14,radius:14,offset:2,fill:petalFill,stroke:p.shadow,seed:`${uid}-m1`});
  s+=petalRing({uid,count:16,cx:100,cy:90,length:17,width:11,radius:6,offset:11,fill:washFill,stroke:p.shadow,seed:`${uid}-m2`});
  s+=`<circle cx="100" cy="90" r="5" fill="${centerFill}"/>`;
 } else if(id==='iris'){
  s+=paintedPetal(100,92,0,54,20,washFill,p.shadow,`${uid}-i0`);
  s+=paintedPetal(78,98,-65,46,20,petalFill,p.shadow,`${uid}-i1`);
  s+=paintedPetal(122,98,65,46,20,petalFill,p.shadow,`${uid}-i2`);
  s+=paintedPetal(89,110,-18,36,14,washFill,p.shadow,`${uid}-i3`);
  s+=paintedPetal(111,110,18,36,14,washFill,p.shadow,`${uid}-i4`);
  s+=`<path d="M92 106q8 10 16 0" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>`;
 }
 return `<g class="head-art" filter="url(#shadow-${uid})">${s}</g>`;
}
function singleStem(uid,{y1=121,y2=223,curve=0}={}){
 return `<g class="stem-cluster">
   <path class="stem-main" d="M100 ${y1} C ${100-curve} ${(y1+40).toFixed(1)} ${100+curve*.4} ${(y2-44).toFixed(1)} 100 ${y2}" stroke="${STEM}" stroke-width="5" fill="none" stroke-linecap="round"/>
   <path d="M95 160Q69 133 42 147Q53 175 96 167" fill="url(#leaf-${uid})" stroke="#56744f" stroke-width="1.7"/>
   <path d="M104 184Q139 154 157 164Q145 191 104 191" fill="url(#leaf-${uid})" stroke="#56744f" stroke-width="1.7"/>
   <path d="M66 152 95 166M133 171 107 185" stroke="#dfe6c4" stroke-opacity=".65" stroke-width="1.3" fill="none"/>
  </g>`;
}
function singleFlowerMarkup(id,uid){
 const p=PALETTE[id]||PALETTE.rose;
 return `${paintDefs(uid,p)}${singleStem(uid,{curve:id==='orchid'?9:id==='lavender'?-4:4})}<g class="head-group" transform="translate(0 0)">${flowerHead(id,uid)}</g>`;
}
export function flowerSVG(id,klass=''){
 const uid=`${safeId(id)}-${++seq}`;
 const sway=4.8+(seq%4)*.45, amp=(seq%2?1.4:-1.2);
 return `<svg class="botanical ${klass}" style="--sway:${sway}s;--sway-amp:${amp}deg" viewBox="0 0 200 235" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${singleFlowerMarkup(id,uid)}</svg>`;
}
// Florist-inspired dome: one binding point; staggered flower heads; foliage collar.
// The room and the gift use the very same seven botanical heads and composition.
const POSITIONS=[
 [104,157,.67,-19],[150,104,.70,-10],[203,89,.75,2],
 [257,110,.69,11],[298,162,.66,20],[154,177,.69,-8],[250,181,.70,9]
];
const grip={x:202,y:317};
function bouquetLeaf(x,y,angle,size=1){return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})"><path d="M0 0 Q-29-38 -7-75 Q26-45 0 0Z" fill="#7b9875" stroke="#587753" stroke-width="1.5"/><path d="M0 0Q-5-42-7-69" stroke="#d8e3bf" stroke-opacity=".75" fill="none" stroke-width="1.8"/></g>`;}
function bouquetFlower(id,i,stage){
 const [cx,cy,scale,angle]=POSITIONS[i];
 const uid=`${safeId(id)}-b-${i}-${++seq}`;const p=PALETTE[id]||PALETTE.rose;
 // Shapes are drawn around (100,90), then positioned by a stable translation.
 return `<g class="bunch-flower slot-${i}" style="--delay:${i*95}ms;--drift-x:${(cx-202)*.28}px;--drift-y:${(cy-120)*.45}px" transform="translate(${cx} ${cy}) rotate(${angle}) scale(${scale}) translate(-100 -90)"><g class="gather-layer">${paintDefs(uid,p)}${flowerHead(id,uid)}</g></g>`;
}
export function bouquetMarkup(ids,{wrapped=false,forExport=false,stage='preview',vase=false}={}){
 const selected=ids.slice(0,7);
 const stems=selected.map((id,i)=>{
   const [cx,cy]=POSITIONS[i], sx=cx-1, sy=cy+20, kink=(i-3)*7;
   return `<path d="M${sx} ${sy} Q${sx+kink} 244 ${grip.x} ${grip.y} Q${grip.x+3} 341 ${grip.x-5+i*1.5} 376" fill="none" stroke="${i%2?'#62855e':'#527852'}" stroke-width="${i%2?4.4:5.1}" stroke-linecap="round"/>`;
 }).join('');
 const collar=[bouquetLeaf(125,236,-51,.79),bouquetLeaf(171,226,-17,.73),bouquetLeaf(231,231,27,.75),bouquetLeaf(281,244,53,.79),bouquetLeaf(193,260,-43,.63),bouquetLeaf(221,268,36,.64)].join('');
 const heads=selected.map((id,i)=>bouquetFlower(id,i,stage)).join('');
 const wrap=`<g class="paper-fold"><path class="paper-back" d="M92 224Q141 246 202 302Q260 246 313 224L245 384Q201 405 162 384Z" fill="url(#paperColor)" stroke="#b99d83" stroke-width="2"/><path class="paper-left" d="M92 224 204 314 179 385 113 247Z" fill="#e9d7c1" stroke="#c2a48b" stroke-width="1.5"/><path class="paper-right" d="M313 224 202 314 225 385 290 247Z" fill="#faf0df" stroke="#c2a48b" stroke-width="1.5"/></g><g class="ribbon-tie"><path d="M174 332Q203 341 229 330L228 345Q198 354 176 345Z" fill="url(#ribbonColor)"/><path d="M201 339Q164 307 159 333Q166 351 201 339Q239 308 243 333Q237 351 201 339Z" fill="#ca7667" stroke="#b76059" stroke-width="1.8"/><circle cx="202" cy="340" r="7" fill="#ac5653"/><path d="M198 346 179 377 194 369 203 387 208 344M205 345 228 375 216 369 212 385 202 346" fill="#d58371" stroke="#b76059" stroke-width="1.6"/></g><g class="tag-write"><path d="M232 348 299 351 296 389 230 385Z" fill="#fff8ec" stroke="#ac9681" stroke-width="1.8"/><path d="M232 353 210 340" fill="none" stroke="#ac9681" stroke-width="2"/><text x="264" y="372" fill="#785d4e" text-anchor="middle" font-family="Georgia,cursive" font-size="12" font-style="italic">For Maha</text></g>`;
 return `<svg class="bouquet-svg ${wrapped?'is-wrapped':''} ${stage==='gather'?'is-gathering':''} ${vase?'in-vase':''}" viewBox="0 0 400 418" xmlns="http://www.w3.org/2000/svg" aria-label="Bouquet of ${selected.length} chosen flowers" role="img"><defs><linearGradient id="paperColor" x1="0" x2="1"><stop stop-color="#dbc0a2"/><stop offset=".5" stop-color="#f8ead5"/><stop offset="1" stop-color="#e2c7ac"/></linearGradient><linearGradient id="ribbonColor" x1="0" x2="1"><stop stop-color="#b95e56"/><stop offset="1" stop-color="#e3a18a"/></linearGradient></defs><g class="stem-fan">${stems}</g><g class="foliage-collar">${collar}</g><g class="flower-fan">${heads}</g>${wrapped&&!vase?wrap:''}</svg>`;
}
function exportCardBackground(){
 return `<defs><filter id="exportNoise"><feTurbulence type="fractalNoise" baseFrequency=".86" numOctaves="2" seed="5"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .08 0"/></filter></defs>
 <rect width="960" height="1200" fill="#f8f0e3"/>
 <g opacity=".55"><circle cx="170" cy="206" r="140" fill="#f3d2bf"/><circle cx="758" cy="236" r="160" fill="#dde5ca"/><circle cx="812" cy="808" r="125" fill="#f4debc"/></g>
 <g opacity=".18"><path d="M94 212q212-178 445-18" fill="none" stroke="#dfbda3" stroke-width="44" stroke-linecap="round"/><path d="M542 116q159-59 274 77" fill="none" stroke="#e6dcbf" stroke-width="31" stroke-linecap="round"/></g>
 <rect width="960" height="1200" fill="#ead8c5" opacity=".12" filter="url(#exportNoise)"/>`;
}
export function exportBouquetSVG(ids){
 const svg=bouquetMarkup(ids,{wrapped:true,forExport:true,stage:'final'});
 const inner=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1200" viewBox="0 0 960 1200">${exportCardBackground()}<rect x="50" y="52" width="860" height="1092" rx="30" fill="#f5e9d7" stroke="#d5b99b" stroke-width="3"/><g opacity=".65" fill="none" stroke="#caad91" stroke-width="3"><path d="M115 125Q145 95 178 130M755 105q48 34 75 4M120 995q45 24 74-2"/></g><text x="480" y="165" fill="#77614f" font-family="Georgia,serif" font-size="25" letter-spacing="8" text-anchor="middle">A LITTLE SOMETHING</text><g transform="translate(80 128) scale(2)">${inner}</g><text x="480" y="1052" fill="#905e55" font-family="Georgia,serif" font-size="47" font-style="italic" text-anchor="middle">For Maha, always.</text><text x="480" y="1091" fill="#907d69" font-family="Arial,sans-serif" font-size="17" letter-spacing="3" text-anchor="middle">YOUR SEVEN FLOWERS</text></svg>`;
}
export async function downloadBouquet(ids){
 const svg=exportBouquetSVG(ids); const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'}); const url=URL.createObjectURL(blob); const img=new Image();
 try{
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
  const canvas=document.createElement('canvas');canvas.width=960;canvas.height=1200; const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('Canvas not supported'); ctx.drawImage(img,0,0);
  const png=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG export failed')),'image/png'));
  const pngURL=URL.createObjectURL(png); const a=document.createElement('a'); a.download='for-maha-seven-flowers.png'; a.href=pngURL; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(pngURL),20000);
  return true;
 } finally {URL.revokeObjectURL(url);}
}