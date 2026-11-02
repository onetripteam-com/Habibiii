import {startSound,soundEffect} from './audio.js';
/** The arrival is a little story, not a fake building entrance.
 * Original whale/butterfly artwork is background-only. Text, envelope,
 * choices and letter folding are real DOM and accessible on every device.
 */
export function mountHug(root,data,onDone){
 let finished=false,disposed=false,opened=false;
 root.innerHTML=`<section class="scene new-hug" aria-label="A small letter for Maha">
  <div class="hug-night-sky" aria-hidden="true"></div>
  <div class="hug-live-stars" aria-hidden="true"></div>
  <div class="hug-stage">
   <div class="hug-overline">AN UNEXPECTED LITTLE DELIVERY · FOR MAHA</div>
   <h1>A little hello, <em>before you go in.</em></h1>
   <div class="hug-postbird" aria-hidden="true"><span>✦</span></div>
   <button type="button" class="hug-envelope" id="hug-open" aria-expanded="false" aria-controls="hug-letter">
    <span class="hug-envelope-flap"></span><span class="hug-envelope-wax">M</span><span class="hug-envelope-address">TO MAHA · OPEN WHENEVER</span>
    <span class="hug-open-instruction">Someone left a letter for you ↗</span>
   </button>
   <div class="hug-letter" id="hug-letter" hidden>
    <span class="hug-letter-stamp">A NOTE, ACROSS THE MILES</span>
    <p>Hey, Maha.</p>
    <p>I can't deliver a proper hug all the way from here. Terrible logistics, really.</p>
    <p>But I can send a little virtual one. <em>Would you like it?</em></p>
    <div class="hug-response">
     <button type="button" class="hug-accept" id="hug-yes">Yes, send it ♡</button>
     <button type="button" class="hug-decline" id="hug-no">Maybe another time</button>
    </div>
   </div>
   <div id="hug-result" class="hug-result" hidden aria-live="polite">
    <div class="hug-heart-burst" aria-hidden="true">♡</div>
    <h2>Consider yourself <em>hugged.</em></h2>
    <p>No international shipping. Just a small reminder that you're thought of.</p>
    <button type="button" id="next-flowers" class="hug-accept">A little surprise is waiting ↗</button>
   </div>
   <button type="button" id="hug-skip" class="hug-skip">Head straight to the flowers →</button>
  </div>
 </section>`;
 const letter=root.querySelector('#hug-letter');
 const envelope=root.querySelector('#hug-open');
 const result=root.querySelector('#hug-result');
 const skip=root.querySelector('#hug-skip');
 const open=()=>{
  if(disposed||opened)return;
  opened=true;startSound();soundEffect('paper');
  envelope.classList.add('is-open');
  envelope.setAttribute('aria-expanded','true');
  letter.hidden=false;
  letter.classList.add('is-revealed');
  skip.textContent='Maybe later. Show me the flowers →';
  root.querySelector('#hug-yes').focus({preventScroll:true});
 };
 envelope.addEventListener('click',open);
 const leave=()=>{if(disposed)return;disposed=true;onDone()};
 const yes=()=>{
  if(disposed||finished)return;
  finished=true;startSound();soundEffect('complete');
  letter.hidden=true;envelope.hidden=true;result.hidden=false;
  root.querySelector('#next-flowers').focus({preventScroll:true});
 };
 root.querySelector('#hug-yes').addEventListener('click',yes);
 root.querySelector('#hug-no').addEventListener('click',leave);
 root.querySelector('#next-flowers').addEventListener('click',leave);
 skip.addEventListener('click',leave);
 return ()=>{disposed=true;};
}
