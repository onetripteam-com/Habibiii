/** Pure Kuwait-calendar unlocks. `state` is plain data, never reads global storage. */
export const KUWAIT_TIME_ZONE='Asia/Kuwait';
export function kuwaitDay(value=new Date()){
  const d=value instanceof Date?value:new Date(value);
  if(!Number.isFinite(d.getTime()))throw new Error('Invalid date');
  const f=new Intl.DateTimeFormat('en-CA',{timeZone:KUWAIT_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'});
  const p=Object.fromEntries(f.formatToParts(d).map(v=>[v.type,v.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
export function dayNumber(ymd){
 if(typeof ymd!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(ymd))return NaN;
 const [y,m,d]=ymd.split('-').map(Number),date=new Date(Date.UTC(y,m-1,d));
 return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d?date.getTime()/86400000:NaN;
}
export function kuwaitDaysApart(from,to){return dayNumber(to)-dayNumber(from);}
function stateVisits(state){return Number.isFinite(+state?.visits)?Math.max(0,Math.floor(+state.visits)):0;}
function firstDay(state){try{return state?.firstVisitAt?kuwaitDay(state.firstVisitAt):null;}catch{return null;}}
export function unlockStatus(rule,state={},now=new Date()){
 if(!rule||rule.type==='always')return {open:true,label:'Ready to open',remaining:0};
 const today=kuwaitDay(now);const todayN=dayNumber(today);
 switch(rule.type){
  case 'date':{
   const target=dayNumber(rule.on);
   if(!Number.isFinite(target))return {open:false,label:'Date not configured',remaining:null};
   const n=Math.max(0,target-todayN);
   return {open:n===0,label:n===0?'Ready to open':`Opens in ${n} ${n===1?'day':'days'}`,remaining:n};
  }
  case 'visits':{
   const required=Math.max(1,Math.floor(Number(rule.n)||1)),n=Math.max(0,required-stateVisits(state));
   return {open:n===0,label:n===0?'Ready to open':`After ${required} visits · ${n} to go`,remaining:n};
  }
  case 'daysAfterFirstVisit':{
   const started=firstDay(state);
   if(!started)return {open:false,label:'Opens after your first visit',remaining:null};
   const days=Math.max(0,Math.floor(Number(rule.n)||0)),elapsed=kuwaitDaysApart(started,today);
   const n=Math.max(0,days-elapsed);
   return {open:n===0,label:n===0?'Ready to open':`Opens in ${n} ${n===1?'day':'days'}`,remaining:n};
  }
  case 'game':{
   const id=rule.id;
   const finished=Boolean(id&&(state.games?.[id]===true||state[`game:${id}:completed`]===true));
   return {open:finished,label:finished?'Ready to open':`Finish the ${id||'specified'} game`,remaining:null};
  }
  default:return {open:false,label:'Waiting for an unlock rule',remaining:null};
 }
}
export function unlocks(rule,state={},now=new Date()){return unlockStatus(rule,state,now).open;}
export function quietLetterState(date,now=new Date()){
 const target=dayNumber(date);if(!Number.isFinite(target))return {visible:false,section:null};
 const offset=dayNumber(kuwaitDay(now))-target;
 return {visible:offset>=-7,section:offset>14?'openWhen':'inbox',offset};
}
export function newlyUnlocked(letters,state,lastVisit,now=new Date()){
 const old=Number(lastVisit);if(!Number.isFinite(old)||old<=0||new Date(now).getTime()-old<30*86400000)return [];
 const previous={...state,visits:Math.max(0,stateVisits(state)-1)};
 return letters.filter(l=>!unlocks(l.unlock,previous,new Date(old))&&unlocks(l.unlock,state,now));
}