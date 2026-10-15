const D=window.JENNY,$=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),song=$('#song');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const yt=u=>((u||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)||[])[1];
let done=false;const chosen=new Set();

const vo=new IntersectionObserver(es=>es.forEach(e=>{const s=e.target;if(e.isIntersecting&&!s.querySelector('iframe')){const id=s.dataset.id;s.insertAdjacentHTML('beforeend',`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1" allow="autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe>`)}}),{threshold:.4});
const lo=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('on')),{threshold:.5});

function render(){
 song.src=D.song;const ei=$('#eyeimg');ei.style.opacity=1;ei.src=D.eye;
 $('#board').innerHTML=D.photos.map(p=>`<div class="pol"><div class="shot"><img src="${esc(p.src)}" alt="" onerror="this.remove()">♥</div><p>${esc(p.cap)}</p></div>`).join('');
 $('#reels').innerHTML=D.videos.map(v=>{const id=yt(v.url);return id?`<div class="reel"><div class="v" data-id="${id}"></div><span class="cap">${esc(v.cap)}</span></div>`:''}).join('');
 $$('.v[data-id]').forEach(s=>vo.observe(s));
 $$('.lyr').forEach((el,i)=>{const L=D.lyrics[i];el.classList.remove('on');el.innerHTML=L?L.t.split('\n').map((l,j)=>`<span style="transition-delay:${j*.9}s">${esc(l)}</span>`).join('')+(L.by?`<small>${esc(L.by)}</small>`:''):'';lo.observe(el)});
 $('#qs').innerHTML='';
 D.questions.forEach(Q=>{const c=document.createElement('div');c.className='q';c.innerHTML=`<h3>${esc(Q.q)}</h3><div class="btns"><button class="b">${esc(Q.yes)}</button><button class="b alt no">لأ</button></div><div class="ans"></div>`;$('#qs').append(c);
  const no=c.querySelector('.no'),yes=c.querySelector('.b');
  const run=()=>{no.style.position='relative';no.style.transform=`translate(${(Math.random()-.5)*220}px,${(Math.random()-.5)*90}px)`};
  no.onmouseenter=run;no.ontouchstart=e=>{e.preventDefault();run()};no.onclick=run;
  yes.onclick=()=>{c.querySelector('.ans').textContent=Q.reply;no.style.display='none';yes.disabled=true;const r=yes.getBoundingClientRect();burst(r.x+r.width/2,r.y,30)}});
 $('#chips').innerHTML='';
 D.wishes.forEach(w=>{const b=document.createElement('button');b.className='chip';b.textContent=w;b.onclick=()=>{b.classList.toggle('on');b.classList.contains('on')?chosen.add(w):chosen.delete(w);const r=b.getBoundingClientRect();burst(r.x,r.y,6)};$('#chips').append(b)});
 if(done)$('#letter').textContent=D.letter;
}

/* envelope */
$('#enter').onclick=()=>{const g=$('#gate');g.classList.add('go');song.play().catch(()=>{});setTimeout(release,1700);setTimeout(()=>{g.classList.add('bye');typeLoop()},2900)};
$('#mute').onclick=()=>{song.paused?song.play():song.pause();$('#mute').style.opacity=song.paused?.5:1};

/* hero typing */
function typeLoop(){const el=$('#typed');let i=0,j=0,del=false;(function t(){const w=D.typed[i%D.typed.length]||'';el.textContent=w.slice(0,j);if(!del){if(j<w.length){j++;return setTimeout(t,90)}del=true;return setTimeout(t,1600)}if(j>0){j--;return setTimeout(t,40)}del=false;i++;setTimeout(t,300)})()}

/* papyrus unrolls, then the letter writes itself */
new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){o.disconnect();$('#scr').classList.add('on');setTimeout(()=>{const el=$('#letter');let k=0;el.classList.add('typing');(function t(){const L=D.letter;el.textContent=L.slice(0,k++);if(k<=L.length)setTimeout(t,L[k-1]==='\n'?380:55);else{el.classList.remove('typing');done=true}})()},1900)}},{threshold:.5}).observe($('#scr'));

/* wishes → WhatsApp */
$('#wish').value=localStorage.getItem('jenny-wish')||'';
$('#wish').oninput=e=>localStorage.setItem('jenny-wish',e.target.value);
$('#send').onclick=()=>open(`https://wa.me/${D.whatsapp}?text=${encodeURIComponent('نفسي في: '+[...chosen].join('، ')+'\n'+$('#wish').value)}`,'_blank');

/* eye → memory reel (uses all photos + captions) */
function openReel(){const r=$('#reel'),Ps=D.photos.filter(p=>p.src);if(!Ps.length)return;r.querySelectorAll('.slide').forEach(s=>s.remove());Ps.forEach(x=>{const s=document.createElement('div');s.className='slide';s.innerHTML=`<div class="bg" style="background-image:url('${esc(x.src)}');background-color:#3a2058"></div><div class="cap">${esc(x.cap)}</div>`;r.append(s)});r.classList.add('on');let i=0;const S=r.querySelectorAll('.slide');(function n(){if(!r.classList.contains('on'))return;S.forEach(s=>s.classList.remove('on'));const s=S[i++%S.length];s.classList.add('on');const b=s.querySelector('.bg');b.style.animation='none';b.offsetWidth;b.style.animation='';setTimeout(n,4500)})()}
$('#eye').onclick=openReel;$('#eye').onkeydown=e=>e.key==='Enter'&&openReel();
$('#reelx').onclick=()=>$('#reel').classList.remove('on');

/* cat meows */
$('#cat').onclick=()=>{const m=document.createElement('div');m.className='meow';m.textContent=['مياو ♥','مياو... جني أحلى','بحبك يا جني مياو'][Math.random()*3|0];$('#hero').append(m);setTimeout(()=>m.remove(),2000);burst(innerWidth*.12,150,8)};

/* particles + butterflies */
const cv=$('#fx'),cx=cv.getContext('2d'),eyeEl=$('#eye');let W,H,P=[],B=[];
const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();addEventListener('resize',rs);
const mk=(x,y,b)=>({x,y,t:Math.random()<.5?'f':Math.random()<.5?'h':'p',s:Math.random()*10+5,vx:b?(Math.random()-.5)*7:(Math.random()-.5)*.6,vy:b?-Math.random()*7-2:-Math.random()*.8-.2,r:Math.random()*6,a:1,burst:b});
for(let i=0;i<45;i++)P.push(mk(Math.random()*innerWidth,Math.random()*innerHeight));
function burst(x,y,n){for(let i=0;i<n;i++){const p=mk(x,y,1);p.t='h';P.push(p)}}
const CO=[['#ff8fa3','#ffd0da'],['#a98bff','#e0d6ff'],['#f2c97d','#fff0c0'],['#7fd8ff','#d9f4ff']];
function release(){for(let i=0;i<16;i++)B.push({o:i<7,x:W/2,y:H/2,a:Math.random()*6.28,v:1.2+Math.random()*1.2,p:Math.random()*9,s:14+Math.random()*10,c:CO[i%4],th:Math.random()*6.28,k:.6+Math.random()*.5,r:0})}
function heart(x,y,s){cx.beginPath();cx.moveTo(x,y+s/4);cx.bezierCurveTo(x,y-s/3,x-s,y-s/3,x-s,y+s/4);cx.bezierCurveTo(x-s,y+s*.8,x,y+s,x,y+s*1.2);cx.bezierCurveTo(x,y+s,x+s,y+s*.8,x+s,y+s/4);cx.bezierCurveTo(x+s,y-s/3,x,y-s/3,x,y+s/4);cx.fill()}
function bf(b,t){const w=Math.abs(Math.sin(t/90+b.p))*.8+.2,s=b.s;cx.save();cx.translate(b.x,b.y);cx.rotate(b.r+Math.PI/2);cx.globalAlpha=1;cx.shadowColor=b.c[0];cx.shadowBlur=12;for(const d of[-1,1]){cx.save();cx.scale(d*w,1);cx.fillStyle=b.c[0];cx.beginPath();cx.moveTo(0,0);cx.bezierCurveTo(s*.2,-s,s*1.1,-s*.9,s*.9,-s*.1);cx.bezierCurveTo(s*.8,s*.2,s*.2,s*.1,0,0);cx.fill();cx.fillStyle=b.c[1];cx.beginPath();cx.moveTo(0,0);cx.bezierCurveTo(s*.6,s*.1,s*.8,s*.9,s*.3,s*.8);cx.bezierCurveTo(s*.1,s*.7,0,s*.3,0,0);cx.fill();cx.restore()}cx.shadowBlur=0;cx.fillStyle='#2a1840';cx.fillRect(-1.5,-s*.5,3,s);cx.restore()}
(function loop(t){cx.clearRect(0,0,W,H);
 P.forEach((p,i)=>{p.x+=p.vx+Math.sin(t/900+p.r)*.4;p.y+=p.vy;p.r+=.02;if(p.burst){p.vy+=.12;p.a-=.012;if(p.a<=0)P[i]=null}else if(p.y<-20){p.y=H+20;p.x=Math.random()*W}
  if(!P[i])return;cx.globalAlpha=Math.max(p.a,0)*(p.t==='f'?.5+.5*Math.sin(t/400+p.r):.8);
  if(p.t==='f'){cx.fillStyle='#fff3b0';cx.shadowColor='#ffe27a';cx.shadowBlur=16;cx.beginPath();cx.arc(p.x,p.y,p.s/5,0,7);cx.fill()}
  else if(p.t==='h'){cx.fillStyle='#ff8fa3';cx.shadowBlur=0;heart(p.x,p.y,p.s/2.2)}
  else{cx.fillStyle='#ffc2d1';cx.shadowBlur=0;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.beginPath();cx.ellipse(0,0,p.s/2,p.s/4,0,0,7);cx.fill();cx.restore()}});
 P=P.filter(Boolean);
 const e=eyeEl.getBoundingClientRect(),ex=e.left+e.width/2,ey=e.top+e.height/2;
 B.forEach(b=>{if(b.o){b.th+=.012*b.k;const ox=b.x,oy=b.y,nx=ex+Math.cos(b.th)*e.width*.62,ny=ey+Math.sin(b.th*2)*e.height*.8+Math.sin(t/300+b.p)*8;b.x+=(nx-b.x)*.05;b.y+=(ny-b.y)*.05;if(Math.hypot(b.x-ox,b.y-oy)>.2)b.r=Math.atan2(b.y-oy,b.x-ox)}
  else{b.a+=Math.sin(t/600+b.p)*.04;b.x+=Math.cos(b.a)*b.v;b.y+=Math.sin(b.a)*b.v-.15;b.r=b.a;if(b.x<-40)b.x=W+30;if(b.x>W+40)b.x=-30;if(b.y<-40)b.y=H+30;if(b.y>H+40)b.y=-30}
  bf(b,t)});
 requestAnimationFrame(loop)})(0);
addEventListener('pointerdown',e=>burst(e.clientX,e.clientY,6));
render();
