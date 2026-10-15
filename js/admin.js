(()=>{
const el=document.createElement('div');el.id='adm';document.body.append(el);
const L=s=>s.split('\n').map(x=>x.trim()).filter(Boolean),P=l=>l.split('|').map(x=>x.trim());
const FL=[
 ['letter','الرسالة (سطر فاضي بين الفقرات)',0,v=>v,v=>v.trim()],
 ['typed','الجمل اللي بتتكتب في الأول (سطر لكل جملة)',1,a=>a.join('\n'),L],
 ['questions','الأسئلة — السؤال | كلمة زر الموافقة | الرد',1,a=>a.map(q=>[q.q,q.yes,q.reply].join(' | ')).join('\n'),s=>L(s).map(l=>{const[q,y,r]=P(l);return{q,yes:y||'أكيد',reply:r||'♥'}})],
 ['wishes','اختيارات "نفسك في إيه" (سطر لكل اختيار)',1,a=>a.join('\n'),L],
 ['videos','ريلز يوتيوب — الرابط | التعليق',1,a=>a.map(v=>v.url+' | '+v.cap).join('\n'),s=>L(s).map(l=>{const[url,cap]=P(l);return{url,cap:cap||''}})],
 ['lyrics','الكوبليهات (٣ أماكن بالترتيب) — السطر الأول / السطر التاني | المغني والأغنية',1,a=>a.map(l=>l.t.replace(/\n/g,' / ')+' | '+l.by).join('\n'),s=>L(s).map(l=>{const[t,by]=P(l);return{t:t.split('/').map(x=>x.trim()).join('\n'),by:by||''}})],
 ['whatsapp','رقم واتساب (دولي بدون +)',2,v=>v,v=>v.trim()]
];
const GH=()=>JSON.parse(localStorage['jenny-gh']||'{}'),q=s=>el.querySelector(s);
const txt=()=>'window.JENNY='+JSON.stringify(D,null,1)+';\n';
const b64=s=>btoa(unescape(encodeURIComponent(s)));

async function put(path,content){const g=GH(),u=`https://api.github.com/repos/${g.owner}/${g.repo}/contents/${path}`,h={Authorization:'Bearer '+g.token,Accept:'application/vnd.github+json'};
 const r0=await fetch(u+'?ref='+g.branch,{headers:h}),sha=r0.ok?(await r0.json()).sha:undefined;
 const r=await fetch(u,{method:'PUT',headers:h,body:JSON.stringify({message:'update '+path,content,branch:g.branch,sha})});
 if(!r.ok)throw new Error((await r.json()).message)}

async function up(f,dir,img){
 if(!GH().token){alert('اكتب بيانات GitHub والـ Token الأول');return}
 let c,name=`${dir}/${Date.now()}.${img?'jpg':f.name.split('.').pop().toLowerCase()}`;
 if(img){const m=await createImageBitmap(f),k=Math.min(1,1600/Math.max(m.width,m.height)),cv=document.createElement('canvas');cv.width=m.width*k;cv.height=m.height*k;cv.getContext('2d').drawImage(m,0,0,cv.width,cv.height);c=cv.toDataURL('image/jpeg',.85).split(',')[1]}
 else c=await new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result.split(',')[1]);x.readAsDataURL(f)});
 try{await put(name,c)}catch(e){alert('فشل الرفع: '+e.message);return}
 (D.library=D.library||[]).push({path:name,type:f.type,date:new Date().toISOString().slice(0,10)});
 return name}

function sync(){
 el.querySelectorAll('[data-k]').forEach(i=>{const f=FL.find(x=>x[0]===i.dataset.k);D[f[0]]=f[4](i.value)});
 el.querySelectorAll('[data-c]').forEach(i=>D.photos[i.dataset.c].cap=i.value);
 if(q('#go'))localStorage['jenny-gh']=JSON.stringify({owner:q('#go').value.trim(),repo:q('#gr').value.trim(),branch:q('#gb').value.trim()||'main',token:q('#gt').value.trim()})}

function draw(){const g=GH();
 el.innerHTML='<h2 style="text-align:center">لوحة التحكم ✦</h2>'
 +FL.map(([k,l,t,f])=>`<label>${l}</label>`+(t==2?`<input type="text" data-k="${k}" value="${esc(f(D[k]))}">`:`<textarea data-k="${k}"${t==0?' style="min-height:240px"':''}>${esc(f(D[k]))}</textarea>`)).join('')
 +`<h3>الصور (${D.photos.length})</h3>`+D.photos.map((p,i)=>`<div class="ph-row"><img src="${esc(p.src)}" alt=""><input type="text" data-c="${i}" value="${esc(p.cap)}" placeholder="تعليق"><button class="b alt" data-d="${i}">حذف</button></div>`).join('')
 +'<div class="row"><label class="b">+ ارفع صور<input type="file" accept="image/*" multiple hidden id="fp"></label><label class="b alt">صورة العين<input type="file" accept="image/*" hidden id="fe"></label><label class="b alt">الأغنية mp3<input type="file" accept="audio/*" hidden id="fs"></label></div>'
 +`<h3>ربط GitHub (مرة واحدة)</h3><input type="text" id="go" placeholder="اسم حسابك" value="${esc(g.owner)}"><input type="text" id="gr" placeholder="اسم الريبو" value="${esc(g.repo)}"><input type="text" id="gb" placeholder="branch" value="${esc(g.branch||'main')}"><input type="password" id="gt" placeholder="Token" value="${esc(g.token)}">`
 +'<div class="row"><button class="b" id="sv">حفظ ونشر</button><button class="b alt" id="dl">تنزيل data.js</button><button class="b alt" id="cl">إغلاق</button></div><p id="st" style="margin-top:1rem"></p>';
 el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{sync();D.photos.splice(b.dataset.d,1);draw()});
 q('#fp').onchange=async e=>{sync();for(const f of e.target.files){const n=await up(f,'photos',1);if(n)D.photos.push({src:n,cap:''})}draw()};
 q('#fe').onchange=async e=>{sync();const n=await up(e.target.files[0],'photos',1);if(n)D.eye=n;draw()};
 q('#fs').onchange=async e=>{sync();const n=await up(e.target.files[0],'music',0);if(n)D.song=n;draw()};
 q('#sv').onclick=async()=>{sync();const s=q('#st');s.textContent='جاري الحفظ...';try{await put('data/data.js',b64(txt()));s.textContent='تم ✔ استنى دقيقة لحد ما GitHub يحدّث الموقع';render()}catch(x){s.textContent='خطأ: '+x.message}};
 q('#dl').onclick=()=>{sync();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt()],{type:'text/javascript'}));a.download='data.js';a.click()};
 q('#cl').onclick=()=>{sync();el.classList.remove('on');render()}}

const open_=()=>{draw();el.classList.add('on')};
if(location.hash==='#admin')open_();
addEventListener('hashchange',()=>location.hash==='#admin'&&open_());
let n=0,tm;$('#secret').onclick=()=>{clearTimeout(tm);if(++n>=7){n=0;open_()}tm=setTimeout(()=>n=0,2500)};
})();
