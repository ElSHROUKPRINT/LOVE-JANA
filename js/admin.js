(()=>{
const el=document.createElement('div');el.id='adm';document.body.append(el);
D.eyes=D.eyes||[];let tab='letter',msg='';
const TABS=[['letter','✉ الرسالة'],['photos','🖼 الصور'],['reels','🎬 الريلز'],['qs','❓ الأسئلة'],['lyr','🎵 كوبليهات'],['set','⚙ إعدادات']];
const q=s=>el.querySelector(s);
const auto=()=>{const m=location.hostname.match(/^(.+)\.github\.io$/);return m?{owner:m[1],repo:location.pathname.split('/')[1]||m[0],branch:'main'}:{}};
const GH=()=>({...auto(),...JSON.parse(localStorage['jenny-gh']||'{}')});
const b64=s=>btoa(unescape(encodeURIComponent(s))),txt=()=>'window.JENNY='+JSON.stringify(D,null,1)+';\n';
const getp=k=>k.reduce((o,x)=>o[x],D),setp=(p,v)=>{const k=p.split('.'),l=k.pop();getp(k)[l]=v};
const st=t=>{msg=t;const s=q('.st');if(s)s.textContent=t};
const f=(p,ph,v,m)=>m?`<textarea data-p="${p}" placeholder="${ph}">${esc(v)}</textarea>`:`<input type="text" data-p="${p}" placeholder="${ph}" value="${esc(v)}">`;
const bt=(a,t)=>`<button class="b alt sm" data-a="${a}">${t}</button>`;
const lab=(id,t,acc,c)=>`<label class="b sm ${c||''}">${t}<input type="file" id="${id}" accept="${acc}" ${id=='fp'?'multiple':''} hidden></label>`;
const strs=(k,ph)=>D[k].map((t,i)=>`<div class="rw">${f(k+'.'+i,ph,t)}${bt('del:'+k+'.'+i,'✕')}</div>`).join('')+bt('add:'+k,'+ إضافة');

const PANE={
 letter:()=>`<h3>الرسالة (اللي بتتكتب على الورقة)</h3>${f('letter','اكتب رسالتك...',D.letter,1).replace('<textarea','<textarea style="min-height:260px"')}<h3>الجمل اللي بتتكتب في أول الصفحة</h3>${strs('typed','جملة')}`,
 photos:()=>`<h3>الصور (${D.photos.length})</h3>`+D.photos.map((p,i)=>`<div class="card"><img src="${esc(p.src)}" alt="" onerror="this.style.opacity=.25"><div>${f('photos.'+i+'.cap','عنوان الصورة',p.cap)}${bt('del:photos.'+i,'حذف الصورة')}</div></div>`).join('')+`<div class="rw" style="flex-wrap:wrap">${lab('fp','+ ارفع صور','image/*')}${lab('fc','صورة الوسط PNG','image/png','alt')}${lab('fe','+ صورة عين','image/*','alt')}${lab('fs','الأغنية mp3','audio/*','alt')}</div><h3>صور العين (${D.eyes.length})</h3>${D.eyes.map((e,i)=>`<div class="card"><img src="${esc(e.src)}" alt="" onerror="this.style.opacity=.25"><div>${f('eyes.'+i+'.y','مكان العين رأسياً %',e.y)}${bt('del:eyes.'+i,'حذف')}</div></div>`).join('')}<p class="hint">الصور المرفوعة بتظهر بعد ما GitHub يحدّث الموقع (دقيقة تقريباً).</p>`,
 reels:()=>`<h3>الريلز / الستوريز (${D.videos.length})</h3><p class="hint">الصق رابط يوتيوب (Shorts أو فيديو). بتشتغل تلقائي بدون صوت زي ستوري واتساب.</p>`+D.videos.map((v,i)=>`<div class="card col">${v.src?f('videos.'+i+'.src','مسار الفيديو',v.src):f('videos.'+i+'.url','رابط يوتيوب',v.url)}${f('videos.'+i+'.cap','التعليق',v.cap)}${bt('del:videos.'+i,'حذف')}</div>`).join('')+bt('add:videos','+ رابط يوتيوب')+lab('fv','+ ارفع فيديو mp4','video/mp4'),
 qs:()=>`<h3>الأسئلة</h3><p class="hint">علّم "صح" على الإجابة الصحيحة. أي اختيار غلط بيظهر رده وبيتقفل ومينفعش تختاره تاني. "يهرب" بيخلي الزر يجري من إيدها.</p>`+D.questions.map((x,i)=>`<div class="card col">${f('questions.'+i+'.q','السؤال',x.q)}`+x.options.map((o,j)=>{const p=`questions.${i}.options.${j}`;return `<div class="opt ${o.ok?'ok':''}">${f(p+'.t','الاختيار',o.t)}${f(p+'.reply','الرد لما تختاره',o.reply||'',1)}<div><label class="chk"><input type="checkbox" data-p="${p}.ok" ${o.ok?'checked':''}> صح</label><label class="chk"><input type="checkbox" data-p="${p}.run" ${o.run?'checked':''}> يهرب</label>${bt('del:'+p,'✕')}</div></div>`}).join('')+`<div class="rw">${bt('addopt:'+i,'+ اختيار')}${bt('del:questions.'+i,'حذف السؤال')}</div></div>`).join('')+bt('add:questions','+ سؤال جديد'),
 lyr:()=>`<h3>الكوبليهات (٣ أماكن في الصفحة)</h3><p class="hint">اكتب السطور تحت بعض، وتحتها اسم المغني والأغنية.</p>`+[0,1,2].map(i=>{const l=D.lyrics[i]||(D.lyrics[i]={t:'',by:''});return `<div class="card col">${f('lyrics.'+i+'.t','الكوبليه',l.t,1)}${f('lyrics.'+i+'.by','المغني - الأغنية',l.by)}</div>`}).join(''),
 set:()=>{const g=GH();return `<h3>رقم واتساب</h3>${f('whatsapp','201XXXXXXXXX',D.whatsapp)}<h3>اختيارات "نفسك في إيه"</h3>${strs('wishes','اختيار')}<h3>النشر</h3><p class="hint">عشان "حفظ ونشر" يشتغل محتاج تلصق GitHub Token مرة واحدة بس (الحساب والريبو بيتعرفوا لوحدهم). بيتحفظ في متصفحك إنت بس. من غيره استخدم "تنزيل data.js" وارفعه في فولدر data.</p><input type="password" id="gt" placeholder="GitHub Token" value="${esc(g.token||'')}"><details ${auto().owner?'':'open'}><summary>إعدادات متقدمة</summary><input type="text" id="go" placeholder="الحساب" value="${esc(g.owner||'')}"><input type="text" id="gr" placeholder="الريبو" value="${esc(g.repo||'')}"><input type="text" id="gb" placeholder="branch" value="${esc(g.branch||'main')}"></details>`}
};

function draw(){const sc=q('.body')?.scrollTop||0;
 el.innerHTML=`<div class="top"><span>لوحة التحكم ✦</span>${bt('close','✕')}</div><div class="tabs">${TABS.map(([k,l])=>`<button data-a="tab:${k}" class="${k==tab?'on':''}">${l}</button>`).join('')}</div><div class="body">${PANE[tab]()}</div><div class="foot"><button class="b sm" data-a="save">حفظ ونشر</button>${bt('dl','تنزيل data.js')}<span class="st">${msg}</span></div>`;
 q('.body').scrollTop=sc}

async function put(path,content){const g=GH();if(!g.token)throw new Error('محتاج Token — من ⚙ إعدادات (مرة واحدة)');
 const u=`https://api.github.com/repos/${g.owner}/${g.repo}/contents/${path}`,h={Authorization:'Bearer '+g.token,Accept:'application/vnd.github+json'};
 const r0=await fetch(u+'?ref='+g.branch,{headers:h});if(r0.status==401)throw new Error('الـ Token غلط أو منتهي');
 const sha=r0.ok?(await r0.json()).sha:undefined;
 const r=await fetch(u,{method:'PUT',headers:h,body:JSON.stringify({message:'update '+path,content,branch:g.branch,sha})});
 if(!r.ok){const m=(await r.json()).message;throw new Error(r.status==404?'الريبو أو الحساب غلط، أو التوكن مالوش صلاحية Contents':m)}}

async function up(f,dir,img){
 if(!GH().token){tab='set';draw();st('محتاج Token الأول (مرة واحدة)');return}
 st('جاري الرفع...');let c,name=`${dir}/${Date.now()}.${img?'jpg':f.name.split('.').pop().toLowerCase()}`;
 if(img){const m=await createImageBitmap(f),k=Math.min(1,1600/Math.max(m.width,m.height)),cv=document.createElement('canvas');cv.width=m.width*k;cv.height=m.height*k;cv.getContext('2d').drawImage(m,0,0,cv.width,cv.height);c=cv.toDataURL('image/jpeg',.85).split(',')[1]}
 else c=await new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result.split(',')[1]);x.readAsDataURL(f)});
 try{await put(name,c)}catch(e){st(e.message);return}
 (D.library=D.library||[]).push({path:name,type:f.type,date:new Date().toISOString().slice(0,10)});st('تم الرفع ✔ (اضغط حفظ ونشر)');return name}

el.addEventListener('input',e=>{const t=e.target;
 if(t.dataset.p)setp(t.dataset.p,t.type=='checkbox'?t.checked:t.value);
 if(t.id=='gt'||t.id=='go'||t.id=='gr'||t.id=='gb'){const o={token:q('#gt').value.trim()};['go','gr','gb'].forEach((k,i)=>{const v=q('#'+k)?.value.trim();if(v)o[['owner','repo','branch'][i]]=v});localStorage['jenny-gh']=JSON.stringify(o)}});
el.addEventListener('change',async e=>{const t=e.target;
 if(t.type=='checkbox')return draw();
 if(t.type!='file'||!t.files.length)return;
 if(t.id=='fp'){for(const f of t.files){const n=await up(f,'photos',1);if(n)D.photos.push({src:n,cap:''})}}
 if(t.id=='fe'){const n=await up(t.files[0],'photos',1);if(n)D.eyes.push({src:n,y:50})}
 if(t.id=='fc'){const n=await up(t.files[0],'photos',0);if(n)D.center=n}
 if(t.id=='fv'){const n=await up(t.files[0],'videos',0);if(n)D.videos.push({src:n,poster:'',cap:''})}
 if(t.id=='fs'){const n=await up(t.files[0],'music',0);if(n)D.song=n}
 draw()});
el.addEventListener('click',async e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(!a)return;const[c,x]=a.split(':');
 if(c=='tab'){tab=x;draw()}
 else if(c=='close'){el.classList.remove('on');render()}
 else if(c=='add'){D[x].push(x=='videos'?{url:'',cap:''}:x=='questions'?{q:'',options:[{t:'',ok:true,reply:''},{t:'',ok:false,reply:''}]}:'');draw()}
 else if(c=='addopt'){D.questions[x].options.push({t:'',ok:false,reply:''});draw()}
 else if(c=='del'){const k=x.split('.'),i=+k.pop();getp(k).splice(i,1);draw()}
 else if(c=='dl'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([txt()],{type:'text/javascript'}));l.download='data.js';l.click()}
 else if(c=='save'){st('جاري الحفظ...');try{await put('data/data.js',b64(txt()));st('تم ✔ استنى دقيقة ويتحدّث الموقع');render()}catch(x){st(x.message)}}});

const open_=()=>{draw();el.classList.add('on')};
if(location.hash=='#admin')open_();
addEventListener('hashchange',()=>location.hash=='#admin'&&open_());
let n=0,tm;document.querySelector('#secret').onclick=()=>{clearTimeout(tm);if(++n>=7){n=0;open_()}tm=setTimeout(()=>n=0,2500)};
})();
