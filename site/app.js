import {setupInteractive} from './interactive.mjs';
import {content} from './content.mjs';
import {render} from './render.mjs';
const app=document.querySelector('#app');
let lang=new URL(location.href).searchParams.get('lang')==='en'?'en':'zh';
let paused=false;
let lastTrigger;
let mediaCleanup=()=>{};
let interactiveCleanup=()=>{};
let syncVideos=()=>{};
function update(){
 mediaCleanup();
 interactiveCleanup();
 const c=content[lang];
 app.innerHTML=render(c,lang);
 document.documentElement.lang=c.lang;
 document.title=c.title;
 document.querySelector('meta[name="description"]').content=c.description;
 document.querySelector('#language').addEventListener('click',()=>{
  const y=scrollY;lang=lang==='zh'?'en':'zh';
  const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);
  update();scrollTo({top:y,behavior:'instant'});document.querySelector('#language').focus({preventScroll:true});
 });
 const motion=document.querySelector('.motion');
 function motionState(){document.body.classList.toggle('paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?c.motion.play:c.motion.pause);motion.textContent=paused?'▷':'Ⅱ';syncVideos();}
 motionState();motion.addEventListener('click',()=>{paused=!paused;motionState()});
 const tabs=[...document.querySelectorAll('[data-tab]')];
 function activate(index){tabs.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;b.querySelector('.tab-plus').textContent=i===index?'−':'+';document.querySelector(`#panel-${i}`).hidden=i!==index;});}
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>activate(i));b.addEventListener('keydown',event=>{let target;if(event.key==='ArrowDown'||event.key==='ArrowRight')target=(i+1)%tabs.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')target=(i-1+tabs.length)%tabs.length;if(event.key==='Home')target=0;if(event.key==='End')target=tabs.length-1;if(target!==undefined){event.preventDefault();activate(target);tabs[target].focus()}})});
 const dialog=document.querySelector('.image-dialog');
 document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{lastTrigger=button;const image=dialog.querySelector('img');image.src=`./assets/${button.dataset.image}.webp`;image.alt=button.dataset.alt;dialog.showModal();}));
 document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog.addEventListener('close',()=>lastTrigger?.focus());
 setupVideos();
 interactiveCleanup=setupInteractive(lang,()=>paused);
 setBar();
}
function setupVideos(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const videos=[...document.querySelectorAll('.concept-video')];
 const bindings=[];
 syncVideos=()=>videos.forEach(video=>{
  const shouldPlay=!paused&&!document.hidden&&video.dataset.inView==='true'&&video.dataset.userPaused!=='true'&&(!reduced.matches||video.dataset.explicit==='true');
  if(shouldPlay){video.play().catch(()=>{});}else{video.pause();}
 });
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{entry.target.dataset.inView=String(entry.isIntersecting)});syncVideos()},{threshold:.15});
 videos.forEach(video=>{
  video.muted=true;
  const button=video.closest('article').querySelector('.video-toggle');
  const paint=()=>{const playing=!video.paused;button.textContent=playing?(lang==='zh'?'Ⅱ 暂停':'Ⅱ PAUSE'):(lang==='zh'?'▶ 播放':'▶ PLAY');button.setAttribute('aria-pressed',String(playing));};
  video.addEventListener('play',paint);video.addEventListener('pause',paint);
  button.addEventListener('click',()=>{
   if(video.paused){video.dataset.explicit='true';video.dataset.userPaused='false';if(paused)document.querySelector('.motion').click();video.play().catch(()=>{});}else{video.dataset.userPaused='true';video.pause();}
  });
  paint();observer.observe(video);bindings.push([video,paint]);
 });
 const mediaChanged=()=>syncVideos();
 reduced.addEventListener('change',mediaChanged);document.addEventListener('visibilitychange',mediaChanged);
 mediaCleanup=()=>{observer.disconnect();bindings.forEach(([video,paint])=>{video.pause();video.removeEventListener('play',paint);video.removeEventListener('pause',paint)});reduced.removeEventListener('change',mediaChanged);document.removeEventListener('visibilitychange',mediaChanged);syncVideos=()=>{};};
}
function setBar(){document.querySelector('.bottom-bar')?.classList.toggle('visible',scrollY>450)}
addEventListener('scroll',setBar,{passive:true});
update();
// Resolve an initial deep link after fonts settle and the prerender is hydrated.
if(location.hash){document.fonts.ready.then(()=>requestAnimationFrame(()=>{
 const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));
 target?.scrollIntoView({behavior:'instant'});
}));}
