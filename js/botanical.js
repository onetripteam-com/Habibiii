// Hand-shaped vector botanicals. Every species has its own petal structure.
// Pure SVG: works in the interface and in a downloadable image without remote assets.
const PALETTE={
 rose:['#cb6961','#efafa0','#aa4e4e','#d9a95b'], daisy:['#f7ecd5','#fffaf0','#d9be88','#e9bb58'],
 sunflower:['#edae48','#f7d879','#d98c2f','#644a32'], tulip:['#d9796e','#f2b1a0','#b85253','#dcb767'],
 peony:['#d99ba0','#f1c7ba','#bb747f','#edc772'], lily:['#f5e2b7','#fff5da','#d9b992','#b67a3d'],
 orchid:['#c7a1c5','#ebcadc','#986f9f','#c47870'], lavender:['#9c8bbd','#bfb0d2','#736999','#e5c6a4'],
 jasmine:['#fff4d6','#fffdf4','#dbcfa7','#ebc977'], marigold:['#eab047','#ffce66','#c78730','#e7a43b'],
 hibiscus:['#cf615c','#ef9f8c','#a4404c','#d7a34b'], iris:['#8c83b1','#b9abd2','#645a92','#e3b96d'],
 lotus:['#d59ba1','#f4c8c6','#b57482','#edcd7d']
};
let seq=0;
const safeId=id=>String(id).replace(/[^a-z0-9-]/g,'');
function petal(cx,cy,angle,rx,ry,fill,extra=''){
 return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" transform="rotate(${angle} 100 81)" ${extra}/>`;
}
function radialPetals(n,outerRx,outerRy,innerRx,innerRy,fillA,fillB,offset=0,spread=27){
 let s='';for(let i=0;i<n;i++){const a=i*360/n+offset;const rad=a*Math.PI/180;const x=100+Math.sin(rad)*spread,y=81-Math.cos(rad)*spread;
 s+=`<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${i%2?outerRx:innerRx}" ry="${i%2?outerRy:innerRy}" fill="${i%2?fillA:fillB}" stroke="#765542" stroke-opacity=".12" stroke-width="1.15" transform="rotate(${a} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;
 }return s;
}
function shape(id,g,h,p){
 let s='';
 if(id==='rose'){
  s=radialPetals(11,18,35,16,31,g,h,10,19)+radialPetals(7,14,26,15,25,h,g,15,12);
  s+=`<path d="M87 82c4-24 37-24 28 1-6 15-24 13-24 0 0-8 14-14 18-3" fill="none" stroke="${p}" stroke-width="5" stroke-linecap="round"/>`;
 } else if(id==='sunflower'){
  s=radialPetals(19,11,40,12,35,g,h,0,34)+radialPetals(18,7,30,8,28,h,g,10,22);
  s+=`<circle cx="100" cy="81" r="28" fill="${p}" stroke="#9a6339" stroke-width="4"/>`;
  for(let a=0;a<5;a++)for(let b=0;b<5;b++){const x=86+a*7,y=67+b*7;if((x-100)**2+(y-81)**2<520)s+=`<circle cx="${x}" cy="${y}" r="2.1" fill="#e1a457" opacity=".78"/>`;}
 } else if(id==='daisy' || id==='jasmine'){
  s=radialPetals(id==='daisy'?17:7,id==='daisy'?9:15,id==='daisy'?31:28,id==='daisy'?10:17,id==='daisy'?29:25,g,h,0,id==='daisy'?24:21);
  s+=`<circle cx="100" cy="81" r="${id==='daisy'?16:12}" fill="${p}"/><circle cx="97" cy="77" r="5" fill="#fff5cc" opacity=".65"/>`;
 } else if(id==='tulip'){
  s=`<path d="M72 75L76 29 97 52 119 24 126 75Q118 126 100 124Q81 126 72 75Z" fill="${g}" stroke="#974e4c" stroke-opacity=".3" stroke-width="2"/><path d="M78 39Q86 75 100 119Q111 71 118 33Q119 95 100 121Q82 101 78 39Z" fill="${h}" opacity=".8"/><path d="M96 54 100 120" stroke="${p}" stroke-width="2" opacity=".28"/>`;
 } else if(id==='peony'){
  s=radialPetals(16,20,30,17,30,g,h,0,18)+radialPetals(13,15,24,15,27,h,g,8,10)+radialPetals(8,13,17,12,19,g,h,14,3);
  s+=`<circle cx="100" cy="81" r="7" fill="${p}" opacity=".8"/>`;
 } else if(id==='lily'){
  for(let a=0;a<6;a++){s+=`<path d="M100 85 Q72 44 100 9 Q126 49 100 85Z" fill="${a%2?g:h}" stroke="${p}" stroke-opacity=".25" stroke-width="2" transform="rotate(${a*60} 100 85)"/><path d="M100 83 100 26" stroke="${p}" stroke-opacity=".28" stroke-width="2" transform="rotate(${a*60} 100 85)"/>`;}
  s+=`<circle cx="100" cy="85" r="8" fill="#f6d9a2"/>`;
  for(let a=0;a<5;a++){const x=100+Math.cos(a*1.26)*17,y=84+Math.sin(a*1.26)*17;s+=`<path d="M100 85 ${x.toFixed(1)} ${y.toFixed(1)}" stroke="#a36e3a" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="3" ry="6" fill="#a36e3a"/>`;}
 } else if(id==='orchid'){
  s=`<ellipse cx="73" cy="59" rx="27" ry="33" fill="${h}" transform="rotate(-36 73 59)"/><ellipse cx="127" cy="59" rx="27" ry="33" fill="${h}" transform="rotate(36 127 59)"/><ellipse cx="63" cy="98" rx="24" ry="37" fill="${g}" transform="rotate(-56 63 98)"/><ellipse cx="137" cy="98" rx="24" ry="37" fill="${g}" transform="rotate(56 137 98)"/><path d="M86 79Q100 57 114 79L124 104Q101 137 76 104Z" fill="${h}" stroke="${p}" stroke-opacity=".36" stroke-width="2"/><path d="M93 95Q100 80 107 95Q110 109 100 113Q90 107 93 95Z" fill="${p}"/>`;
 } else if(id==='lavender'){
  s=`<path d="M100 126Q92 70 100 21" stroke="#779169" stroke-width="4" fill="none"/>`;
  for(let j=0;j<9;j++){const y=35+j*10;const w=(10-j*.55);s+=`<ellipse cx="${91-w/2}" cy="${y}" rx="${w}" ry="${7+j*.25}" transform="rotate(-37 ${91-w/2} ${y})" fill="${j%2?h:g}"/><ellipse cx="${109+w/2}" cy="${y-3}" rx="${w}" ry="${7+j*.25}" transform="rotate(37 ${109+w/2} ${y-3})" fill="${j%2?g:h}"/>`;}
 } else if(id==='marigold'){
  s=radialPetals(28,10,25,10,25,g,h,0,19)+radialPetals(23,8,19,9,17,h,g,6,11)+radialPetals(17,7,12,6,15,g,h,8,2);
  s+=`<circle cx="100" cy="81" r="6" fill="${p}"/>`;
 } else if(id==='hibiscus'){
  s=radialPetals(5,33,40,31,36,g,h,0,29);
  s+=`<path d="M100 86Q125 88 140 59" stroke="${p}" stroke-width="5" fill="none"/><circle cx="141" cy="58" r="5" fill="#f7d279"/><circle cx="145" cy="51" r="3" fill="#f7d279"/><circle cx="136" cy="53" r="3" fill="#f7d279"/>`;
 } else if(id==='iris'){
  s=`<path d="M100 87Q64 53 87 10Q105 32 100 87Z" fill="${h}"/><path d="M100 87Q135 41 119 11Q95 35 100 87Z" fill="${g}"/><path d="M95 88Q42 53 39 100Q46 129 80 126Q102 111 95 88Z" fill="${g}"/><path d="M104 88Q159 53 161 100Q154 129 120 126Q97 111 104 88Z" fill="${h}"/><path d="M88 95Q100 115 112 95L102 150Q96 154 88 95Z" fill="${g}"/><path d="M100 91 100 126" stroke="${p}" stroke-width="7" stroke-linecap="round"/>`;
 } else if(id==='lotus'){
  for(let i=0;i<9;i++){const a=(i-4)*24;s+=`<path d="M100 109Q73 75 100 23Q125 73 100 109Z" fill="${i%2?g:h}" stroke="${p}" stroke-opacity=".24" stroke-width="1.6" transform="rotate(${a} 100 106)"/>`;}
  s+=`<ellipse cx="100" cy="108" rx="15" ry="6" fill="${p}"/>`;
 }
 return s;
}
export function flowerCore(id,uid){
 const [a,b,c,d]=PALETTE[id]||PALETTE.rose;
 return `<defs><radialGradient id="f-${uid}" cx=".37" cy=".24" r=".82"><stop stop-color="${b}"/><stop offset=".75" stop-color="${a}"/><stop offset="1" stop-color="${c}"/></radialGradient><linearGradient id="leaf-${uid}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#9aaf79"/><stop offset="1" stop-color="#4e7253"/></linearGradient></defs>
 <path d="M101 103Q88 163 103 216" stroke="#5d835b" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M98 163Q73 132 43 146Q52 174 98 166" fill="url(#leaf-${uid})" stroke="#547550" stroke-width="2"/><path d="M99 185Q137 151 157 161Q145 191 100 191" fill="url(#leaf-${uid})" stroke="#547550" stroke-width="2"/><path d="M65 150 96 165M133 169 104 185" stroke="#c6c99c" stroke-opacity=".7" stroke-width="1.6" fill="none"/>
 <g class="petal-group">${shape(id,`url(#f-${uid})`,b,d)}</g>`;
}
export function flowerSVG(id,klass=''){
 const uid=`${safeId(id)}-${++seq}`;
 return `<svg class="botanical ${klass}" viewBox="0 0 200 235" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${flowerCore(id,uid)}</svg>`;
}
const SLOTS=[[12,84,-18],[81,44,-9],[149,82,14],[221,52,19],[36,149,-13],[174,146,12],[106,124,1]];
export function bouquetMarkup(ids,{wrapped=false,forExport=false}={}){
  const flowers=ids.map((id,i)=>{
    const [x,y,r]=SLOTS[i];return `<g class="bunch-flower" transform="translate(${x} ${y}) rotate(${r} 100 180) scale(.68)"><g class="flower-arrive" style="--flower-index:${i}">${flowerCore(id,`${safeId(id)}-b-${i}`)}</g></g>`;
  }).join('');
  // Mark-up is re-created on every selection; never reorders the user's own bouquet.
  return `<svg class="bouquet-svg ${wrapped?'is-wrapped':''}" viewBox="0 0 400 410" xmlns="http://www.w3.org/2000/svg" aria-label="Bouquet of ${ids.length} selected flowers" role="img">
    <defs><linearGradient id="paperColor" x1="0" x2="1"><stop stop-color="#eadbc5"/><stop offset=".5" stop-color="#f8ead6"/><stop offset="1" stop-color="#d7bea4"/></linearGradient><linearGradient id="ribbonColor" x1="0" x2="1"><stop stop-color="#bf6760"/><stop offset="1" stop-color="#db8e76"/></linearGradient></defs>
    <g>${flowers}</g>
    ${wrapped?`<g class="paper-fold"><path d="M97 235L202 388 308 235 268 248 199 298 130 245Z" fill="url(#paperColor)" stroke="#bd977b" stroke-width="3"/><path d="M97 235 204 300 196 388Z" fill="#d9c5ad" opacity=".82"/><path d="M308 235 197 301 202 388Z" fill="#f7e7d3" opacity=".85"/><path d="M105 235 200 297 299 235" fill="none" stroke="#b58e74" stroke-width="2" stroke-dasharray="5 5"/></g><g class="ribbon-tie"><path d="M154 315Q198 333 246 315L241 330Q196 344 158 331Z" fill="url(#ribbonColor)"/><path d="M199 326Q151 285 146 311Q145 332 199 326Q244 287 252 311Q250 331 199 326Z" fill="#ca7667" stroke="#b76059" stroke-width="2"/><circle cx="199" cy="326" r="8" fill="#b85c59"/><path d="M195 331 175 375 189 366 198 382 207 334M202 331 227 375 215 367 210 381 201 335" fill="#ce8170" stroke="#b76059" stroke-width="2"/></g><g class="tag-write"><path d="M243 334 301 339 297 379 243 375Z" fill="#fff7e8" stroke="#ae9986" stroke-width="2"/><path d="M241 340 211 330" stroke="#9c866e" fill="none" stroke-width="2"/><text x="270" y="359" fill="#6d5a4e" font-family="cursive" font-style="italic" font-size="11" font-weight="bold" text-anchor="middle">For Maha</text><path d="M259 366q10 5 23 0" fill="none" stroke="#c58069" stroke-width="1.5"/></g>`:''}
  </svg>`;
}
export function exportBouquetSVG(ids) {
 const svg=bouquetMarkup(ids,{wrapped:true,forExport:true});
 const inner=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="1200" viewBox="0 0 960 1200"><rect width="960" height="1200" fill="#f8f0e3"/><rect x="50" y="52" width="860" height="1092" rx="30" fill="#f5e9d7" stroke="#d5b99b" stroke-width="3"/><g opacity=".65" fill="none" stroke="#caad91" stroke-width="3"><path d="M115 125Q145 95 178 130M755 105q48 34 75 4M120 995q45 24 74-2"/></g><text x="480" y="165" fill="#77614f" font-family="Georgia,serif" font-size="25" letter-spacing="8" text-anchor="middle">A LITTLE SOMETHING</text><g transform="translate(80 130) scale(2)">${inner}</g><text x="480" y="1052" fill="#905e55" font-family="Georgia,serif" font-size="47" font-style="italic" text-anchor="middle">For Maha, always.</text><text x="480" y="1091" fill="#907d69" font-family="Arial,sans-serif" font-size="17" letter-spacing="3" text-anchor="middle">YOUR SEVEN FLOWERS</text></svg>`;
}
export async function downloadBouquet(ids){
 const svg=exportBouquetSVG(ids);const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
 const url=URL.createObjectURL(blob);const img=new Image();
 try {
   await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
   const canvas=document.createElement('canvas');canvas.width=960;canvas.height=1200;
   const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas not supported');ctx.drawImage(img,0,0);
   const png=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG export failed')),'image/png'));
   const pngURL=URL.createObjectURL(png);const a=document.createElement('a');a.download='for-maha-seven-flowers.png';a.href=pngURL;document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(pngURL),20000);
   return true;
 } finally {URL.revokeObjectURL(url);}
}
