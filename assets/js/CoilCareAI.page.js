/* ═══════════════════════════════
   CONFIG
═══════════════════════════════ */
// Configuration de l'app. Je garde tout ici pour pouvoir ajuster vite.
// Haiku 4.5 parce que c'est rapide et 3× moins cher que Sonnet — parfait pour
// du Q&A capillaire (pas besoin de raisonnement complexe).
const CFG={
  free_limit:10,
  pay_m:'https://buy.stripe.com/your-monthly-link',
  pay_y:'https://buy.stripe.com/your-yearly-link',
  codes:['COILCARE2024','NATURAL4EVA','TYPE4QUEEN','COILS2025'],
  model:'claude-haiku-4-5-20251001'
};

/* ═══════════════════════════════
   STORAGE HELPERS
═══════════════════════════════ */
const ld=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const tod=()=>new Date().toISOString().split('T')[0];
const U=()=>ld('cc_u')||{};
const sU=u=>sv('cc_u',u);
const ST=()=>ld('cc_st')||{streak:0,lastLog:null,chatUsed:0,chatMonth:null,badges:[]};
const sST=s=>sv('cc_st',s);
const SET=()=>ld('cc_set')||{dark:false,units:'in'};
const sSET=s=>sv('cc_set',s);
const JN=()=>ld('cc_jn')||[];
const sJN=j=>sv('cc_jn',j);
const PR=()=>ld('cc_pr')||[];
const sPR=p=>sv('cc_pr',p);
const RT=()=>ld('cc_rt')||[];
const sRT=r=>sv('cc_rt',r);
const SC=()=>ld('cc_sc')||[];
const sSC=s=>sv('cc_sc',s);
const GR=()=>ld('cc_gr')||[];
const sGR=g=>sv('cc_gr',g);
const CH=()=>ld('cc_ch')||[];
const sCH=c=>sv('cc_ch',c);

/* ═══════════════════════════════
   BOOT — runs after page loads
═══════════════════════════════ */
function boot(){
  const u=U(), s=SET();
  if(s.dark){
    document.getElementById('root').setAttribute('data-theme','dark');
    const td=document.getElementById('tog-dark');
    if(td) td.checked=true;
  }
  if(!u.onboarded){
    initDots();
    showOB(0);
  } else {
    launch();
  }
}
// Petit message pour quiconque ouvre la console (recruteurs, curieux, vous-même demain).
// Reste discret, juste de quoi marquer la propriété et donner le contact.
console.log('%c🌿 CoilCare AI™','color:#C9934A;font:600 18px Georgia,serif');
console.log('%c© 2024–2026 Schicgirl™. All rights reserved.','color:#A06D28;font-size:12px');
console.log('%cBuilt with care, line by line. No frameworks. Just HTML + the Anthropic Claude API.','color:#A06D28;font-size:11px;font-style:italic');
console.log('%cPortfolio · https://schicgirl.me','color:#A06D28;font-size:11px');
console.log('%cContact · contacte.schicgirl@gmail.com','color:#A06D28;font-size:11px');

// Use both load and DOMContentLoaded for maximum compatibility
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

function launch(){
  document.getElementById('nav').classList.add('show');
  go('home');
  initLearn();
  initRoutines();
  updateHome();
  renderJournal();
  checkStreaks();
  updateSetUI();
}

/* ═══════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════ */
function go(tab){
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('off'));
  const pg=document.getElementById('s-'+tab);
  if(pg) pg.classList.remove('off');
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('on'));
  const nb=document.getElementById('nb-'+tab);
  if(nb) nb.classList.add('on');
  if(tab==='profile') renderProfile();
  if(tab==='routines') renderRoutines();
  if(tab==='journal') renderJournal();
  if(tab==='settings') updateSetUI();
  if(tab==='products') renderProducts();
  if(tab==='decoder') dSearch();
}
function openChat(){
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('off'));
  document.getElementById('s-chat').classList.remove('off');
  renderChat();
  setTimeout(()=>document.getElementById('cta')?.focus(),200);
}

/* ═══════════════════════════════
   ONBOARDING
═══════════════════════════════ */
let OBS=0, QA={};

function initDots(){
  const c=document.getElementById('ob-dots');
  c.innerHTML='';
  for(let i=0;i<11;i++){
    const d=document.createElement('div');
    d.className='ob-dot'+(i===0?' on':'');
    c.appendChild(d);
  }
}

/* KEY FIX: show/hide slides individually — no translateX */
function showOB(n){
  document.querySelectorAll('.ob-slide').forEach((s,i)=>{
    s.classList.toggle('on', i===n);
  });
  OBS=n;
  // Update dots
  document.querySelectorAll('.ob-dot').forEach((d,i)=>d.classList.toggle('on',i===n));
  // Update progress bar
  const fill=document.getElementById('ob-fill');
  if(fill) fill.style.width=Math.round(n/10*100)+'%';
  // Scroll slide to top
  const slide=document.querySelector('.ob-slide.on');
  if(slide) slide.scrollTop=0;
}

function NS(){
  // Validate slide 1 (name)
  if(OBS===1){
    const nm=document.getElementById('ob-name')?.value.trim();
    if(!nm){toast('Tell me your name! 🌿','info');return}
    QA.name=nm;
  }
  // Validate single-select quiz slides (each quiz slide is OBS 2-9, questions 1-8)
  // Slide 2=Q1, 3=Q2, 4=Q3, 5=Q4, 6=Q5, 7=Q6, 8=Q7(multi), 9=Q8
  const needsAns=[2,3,4,5,6,7,9]; // slide 8 is multi-select, handled with Continue button
  if(needsAns.includes(OBS) && !QA['q'+(OBS-1)]){
    toast('Please pick an option to continue','info');return;
  }
  // BUG FIX: build reveal AFTER slide 9 (Q8/experience), not slide 8
  if(OBS===9) buildReveal();
  showOB(OBS+1);
}

function selQ(el){
  const q=el.dataset.q;
  document.querySelectorAll(`[data-q="${q}"]`).forEach(b=>b.classList.remove('sel'));
  el.classList.add('sel');
  QA['q'+q]=el.dataset.v;
  setTimeout(()=>NS(), 260);
}
function selQM(el){
  el.classList.toggle('sel');
  if(!QA.q7) QA.q7=[];
  const v=el.dataset.v;
  if(el.classList.contains('sel')){ if(!QA.q7.includes(v)) QA.q7.push(v) }
  else QA.q7=QA.q7.filter(x=>x!==v);
}

function buildReveal(){
  const ht=QA.q1==='4A'?'4A':QA.q1==='4B'?'4B':'4C';
  const nicks={'4A':'The Defined Spiral','4B':'The Bold Coil','4C':'The Fierce Kink'};
  const por=QA.q3==='high'?'High':QA.q3==='low'?'Low':'Normal';
  const thick=QA.q4==='fine'?'Fine':QA.q4==='coarse'?'Coarse':'Medium';
  const shrink=QA.q2==='extreme'?'90%+':QA.q2==='high'?'75%+':QA.q2==='med'?'50–70%':'20–40%';
  const chalM={moisture:'Moisture retention',breakage:'Breakage',shrinkage:'Shrinkage',tangles:'Tangles & knots',scalp:'Scalp issues'};
  const chal=chalM[QA.q6]||'Moisture retention';
  const nm=QA.name||'sis';
  const g=id=>document.getElementById(id);
  g('rv-type').textContent=ht; g('rv-nick').textContent=nicks[ht];
  g('rv-por').textContent=por+' Porosity'; g('rv-thick').textContent=thick+' Strand';
  g('rv-shrink').textContent=shrink; g('rv-chal').textContent=chal;
  g('rv-name').textContent=nm; g('rv-name2').textContent=nm;
  QA._ht=ht; QA._nick=nicks[ht]; QA._por=por; QA._thick=thick;
  QA._shrink=shrink; QA._chal=chal;
}

function finishOB(){
  const u={
    onboarded:true, name:QA.name||'sis',
    hairType:QA._ht||'4C', hairNick:QA._nick||'The Fierce Kink',
    porosity:QA._por||'High', thickness:QA._thick||'Coarse',
    shrinkage:QA._shrink||'85%+',
    scalp:QA.q5==='dry'?'Dry':QA.q5==='oily'?'Oily':'Normal',
    challenge:QA._chal||'Moisture retention',
    goals:QA.q7||['health'],
    experience:QA.q8||'learning',
    joined:Date.now(), premium:false
  };
  sU(u);
  launch();
  toast(`Welcome, ${u.name}! Your coils are in good hands 🌿`,'ok');
}

function retakeQ(){
  QA={}; OBS=0;
  document.querySelectorAll('.ob-opt').forEach(b=>b.classList.remove('sel'));
  initDots();
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('off'));
  document.getElementById('s-onboard').classList.remove('off');
  document.getElementById('nav').classList.remove('show');
  showOB(2);
}

/* ═══════════════════════════════
   HOME
═══════════════════════════════ */
const TIPS=[
  'Seal your ends before bed — every night makes a difference.',
  'Water first, always. Spritz before applying anything else.',
  'Deep condition for at least 30 minutes — your coils need the time.',
  'Detangle from ends to roots. Never root to tip.',
  'Shrinkage is your hair at its healthiest. Length is just a bonus.',
  'Sleep with a satin bonnet every single night. Non-negotiable.',
  'Clarify once a month to remove buildup. Products work better after.',
  'LOC method: Liquid → Oil → Cream. The order matters more than the products.',
  'Protein and moisture balance matters more than any single product.',
  'Your 4C coils in their natural state are perfect — no definition needed.',
  'Handle your hair as little as possible on non-wash days.',
  'Low porosity? Apply products on slightly damp, steamed hair for best absorption.',
  'Protein-sensitive? Skip hydrolyzed wheat, keratin, and silk amino. Stick to humectants.',
  'Pre-poo with oil before shampooing — reduces tangling and protects your strands.',
  'Massage your scalp for 5 minutes every wash day. Blood flow = growth.',
  'Trim split ends every 12 weeks — they travel up the shaft and cost you length.',
  'Glycerin in low humidity = dry hair. Save it for warm, humid months.',
  'Hard water? Install a shower filter. It will change your hair life.',
  'Steam treatments open low-porosity cuticles. Once a month, minimum.',
  'Banding stretches your hair without heat. Try it before bed on wash day.',
  'Two-strand twists on damp (not wet) hair give cleaner definition.',
  'Pineapple your hair every night — preserves your style and prevents matting.',
];

// Season-specific tips — surfaced by month inside updateHome().
// Months 11,0,1 = winter · 2,3,4 = spring · 5,6,7 = summer · 8,9,10 = fall
const SEASON_TIPS={
  winter:[
    'Cold air pulls moisture from your strands. Switch to heavier creams now.',
    'Wet hair + winter air = breakage. Always dry fully before going outside.',
    'GHE method is your winter superpower — overnight, weekly.',
    'Satin-lined hats only. Wool destroys moisture and edges.',
  ],
  spring:[
    'Humidity is rising — start dialing back the heaviest sealants.',
    'Trim split ends now so new growth retains length through summer.',
    'Switch to lighter leave-ins as the air warms up.',
    'Allergy season can affect your scalp too — clarify monthly.',
  ],
  summer:[
    'Pre-rinse with fresh water BEFORE swimming. Wet hair absorbs less chlorine.',
    'High humidity = ditch the glycerin if it makes you frizzy.',
    'UV breaks down hair protein. Hat or scarf when outside for hours.',
    'Sweat is salty water — rinse your scalp after workouts, even without shampoo.',
  ],
  fall:[
    'Transition season — slowly reintroduce heavier sealants.',
    'Deep condition weekly to prep for winter dryness ahead.',
    'Protective styles work well in fall — moderate temps mean less stress on hair.',
    'A bit of trimming now sets you up for healthy winter ends.',
  ],
};
function getCurrentSeason(){
  const m=new Date().getMonth();
  if(m===11||m===0||m===1) return 'winter';
  if(m>=2&&m<=4) return 'spring';
  if(m>=5&&m<=7) return 'summer';
  return 'fall';
}

function updateHome(){
  const u=U(), st=ST(), sc=SC(), j=JN();
  const h=new Date().getHours();
  const greet=h<12?'Good morning ☀️':h<17?'Good afternoon 🌿':'Good evening 🌙';
  const g=id=>document.getElementById(id);
  g('h-greet').textContent=greet;
  g('h-name').textContent=u.name?`Hey, ${u.name} 👑`:'Your coils are ready.';
  // Astuce du jour : un jour sur deux, je surface une astuce saisonnière au lieu
  // d'une astuce générale. Ça fait sentir l'app vivante et adaptée au moment.
  const day=new Date().getDate();
  if(day%2===0){
    const seasonal=SEASON_TIPS[getCurrentSeason()];
    g('h-tip').textContent=seasonal[Math.floor(day/2)%seasonal.length];
  } else {
    g('h-tip').textContent=TIPS[day%TIPS.length];
  }
  // Streak
  if(st.streak>0) g('h-streak').innerHTML=`<div class="streak">🔥 ${st.streak}-day streak</div>`;
  g('h-streak-n').textContent=st.streak+' day'+(st.streak!==1?'s':'');
  // Chat count
  g('h-chats').textContent=u.premium?'∞':Math.max(0,CFG.free_limit-(st.chatUsed||0));
  // Wash day
  const upcoming=sc.filter(d=>d>=tod()).sort()[0];
  if(upcoming){
    const days=Math.ceil((new Date(upcoming)-new Date(tod()))/(864e5));
    g('h-wash').textContent=days===0?'Today!':days+'d';
    g('h-wash-s').textContent=days===0?'🎉 It\'s wash day!':'away — '+upcoming;
  }
  // Health score
  if(j.length){
    const avg=j.slice(0,7).reduce((a,l)=>a+(l.rating||3),0)/Math.min(j.length,7);
    const sc2=Math.round(50+avg*10);
    g('h-score').textContent=sc2;
    g('h-score-l').textContent=sc2>=80?'Thriving 🌱':sc2>=60?'Growing 💪':'Needs attention 💧';
    g('h-ring').style.strokeDashoffset=151-(151*sc2/100);
  }
  // Recent logs
  const rl=g('h-logs'), rec=j.slice(0,3);
  if(rec.length) rl.innerHTML=rec.map(l=>`<div class="log-mini"><div class="lm-d">${l.date}</div><div class="lm-s">${l.state||'📝'}</div>${l.notes?`<div class="lm-n">"${esc(l.notes)}"</div>`:''}<div class="lm-r">${'★'.repeat(l.rating||3)}</div></div>`).join('');
  else rl.innerHTML=`<div class="empty"><div class="big">📝</div>No logs yet! Start tracking your coil journey.<br/><button class="btn bg bsm" style="margin-top:10px" onclick="openLog()">Log Today 🌿</button></div>`;
}

/* ═══════════════════════════════
   AI CHAT
═══════════════════════════════ */
let chatBusy=false;

function getSys(){
  const u=U(), mo=new Date().toLocaleString('default',{month:'long'});
  return `You are CoilCare AI — the world's most knowledgeable, warm, and culturally competent natural hair companion, specializing EXCLUSIVELY in Type 4 natural hair (4A, 4B, 4C).

PERSONALITY: You are the user's wise, encouraging older sister who has been natural for 20 years with a background in trichology. Speak warmly and naturally. Never talk down to the user. Be real and practical. Celebrate coils in their natural state.

USER PROFILE:
Name: ${u.name||'sis'} | Type: ${u.hairType||'4C'} (${u.hairNick||''}) | Porosity: ${u.porosity||'High'} | Strand: ${u.thickness||'Coarse'} | Shrinkage: ${u.shrinkage||'85%+'} | Scalp: ${u.scalp||'Normal'} | Challenge: ${u.challenge||'Moisture retention'} | Goals: ${(u.goals||[]).join(', ')} | Experience: ${u.experience||'learning'} | Month: ${mo}

RULES — NEVER BREAK:
1. Every answer must be tailored to TYPE 4 — never generic curly hair advice
2. Always reference the user's specific profile (e.g. "For your ${u.hairType||'4C'}, ${u.porosity||'high'}-porosity hair...")
3. Give ACTIONABLE, specific advice only — no vague suggestions
4. Lead with ingredient/product TYPE before brand names
5. NEVER say: "manage frizz", "tame your hair", "make curls more defined"
6. USE: "your coils", "wash day", "shrinkage is a superpower"
7. End complex answers with "✨ Pro Tip for ${u.hairType||'4C'}:" callout block
8. Be real about myths vs. what actually works for Type 4
9. Keep responses focused — under 300 words unless step-by-step requires more
10. Use line breaks and formatting for readability`;
}

async function doSend(){
  const ta=document.getElementById('cta');
  const msg=ta.value.trim();
  if(!msg||chatBusy) return;
  const u=U(), st=ST(), mo=new Date().toISOString().slice(0,7);
  // Free tier : 10 messages / mois. Le compteur se reset chaque mois.
  if(!u.premium){
    if(st.chatMonth!==mo){st.chatUsed=0;st.chatMonth=mo}
    if(st.chatUsed>=CFG.free_limit){showUpgrade();toast('Free messages used up this month 💕 Upgrade for unlimited!','info');return}
  }
  const key=ld('cc_apikey');
  if(!key){ go('settings'); tApi(); toast('Add your Anthropic API key in Settings first! 🔑','info'); return }
  ta.value=''; ar(ta);
  document.getElementById('starters').style.display='none';
  chatBusy=true;
  addBub(msg,true);
  const typ=addTyp();
  document.getElementById('sbtn').disabled=true;
  try{
    // Je garde seulement les 12 derniers messages pour limiter les tokens envoyés.
    // Sur Type 4 hair, 12 tours suffisent largement à garder le contexte.
    const hist=CH().slice(-12).map(m=>({role:m.role,content:m.content}));
    hist.push({role:'user',content:msg});
    const resp=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':key,
        'anthropic-version':'2023-06-01',
        // Required when calling the Anthropic API directly from a browser.
        // The end user provides their own API key (BYO-key) via the UI.
        'anthropic-dangerous-direct-browser-access':'true'
      },
      body:JSON.stringify({model:CFG.model,max_tokens:1000,system:getSys(),messages:hist,stream:true})
    });
    if(!resp.ok){const e=await resp.json();throw new Error(e.error?.message||'API error '+resp.status)}
    typ.remove();
    const bub=addBub('',false);
    let full='';
    const reader=resp.body.getReader(), dec=new TextDecoder();
    let buf='';
    while(true){
      const{done,value}=await reader.read(); if(done)break;
      buf+=dec.decode(value,{stream:true});
      const lines=buf.split('\n'); buf=lines.pop()||'';
      for(const ln of lines){
        if(ln.startsWith('data: ')){
          const d=ln.slice(6); if(d==='[DONE]') break;
          try{const ev=JSON.parse(d);if(ev.type==='content_block_delta'&&ev.delta?.text){full+=ev.delta.text;bub.innerHTML=fmtAI(full);sCht()}}catch{}
        }
      }
    }
    const h=CH();
    h.push({role:'user',content:msg,ts:Date.now()},{role:'assistant',content:full,ts:Date.now()});
    if(h.length>50) h.splice(0,h.length-50);
    sCH(h);
    st.chatUsed=(st.chatUsed||0)+1; st.chatMonth=mo; sST(st); uStrip();
  }catch(e){
    typ.remove();
    addBub('Sorry sis, something went wrong. Check your API key in Settings and try again. 💕',false);
    console.error(e);
  }
  chatBusy=false;
  document.getElementById('sbtn').disabled=false;
  sCht();
}

function qs(el){document.getElementById('cta').value=el.textContent.trim();doSend()}

function addBub(txt,isU){
  const w=document.getElementById('msgs');
  const id='m'+uid();
  const row=document.createElement('div');
  row.className='mrow'+(isU?' u':'');
  row.innerHTML=isU?`<div class="bub u">${esc(txt)}</div>`:`<div class="mav">🌿</div><div class="bub ai" id="${id}">${fmtAI(txt)}</div>`;
  w.appendChild(row); sCht();
  return document.getElementById(id);
}
function addTyp(){
  const w=document.getElementById('msgs'), id='t'+uid();
  const r=document.createElement('div'); r.className='mrow'; r.id=id;
  r.innerHTML=`<div class="mav">🌿</div><div class="bub ai"><span class="tdot"></span><span class="tdot"></span><span class="tdot"></span></div>`;
  w.appendChild(r); sCht(); return r;
}
function fmtAI(t){
  if(!t)return '';
  let s=esc(t);
  s=s.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/✨ Pro Tip for ([^:\n]+)[:：](.*?)(?=\n|$)/g,(_,tp,ti)=>
    `<div class="ptip"><div class="ptip-l">✨ Pro Tip for ${esc(tp.trim())}</div>${esc(ti.trim())}</div>`);
  s=s.replace(/\n/g,'<br/>');
  return s;
}
function sCht(){const m=document.getElementById('msgs');if(m)m.scrollTop=m.scrollHeight}
function renderChat(){
  const h=CH(),w=document.getElementById('msgs'); w.innerHTML='';
  if(!h.length){
    addBub(`Hey ${U().name||'sis'}! 🌿 I'm CoilCare AI — your personal Type 4 hair expert.\n\nI know your profile: ${U().hairType||'4C'}, ${U().porosity||'high'} porosity, challenge is ${U().challenge||'moisture retention'}.\n\nI'm ready for ALL your questions — from wash day routines to ingredient breakdowns to emergency hair fixes.\n\n**What's going on with your coils today?** 💕`,false);
    return;
  }
  h.forEach(m=>{
    if(m.role==='user') addBub(m.content,true);
    else { addBub('',false); const b=document.querySelector('.bub.ai:last-child'); if(b)b.innerHTML=fmtAI(m.content) }
  });
}
function uStrip(){
  const u=U(),st=ST(),strip=document.getElementById('u-strip');
  if(!u.premium){ strip.classList.remove('off'); document.getElementById('u-used').textContent=st.chatUsed||0; document.getElementById('u-max').textContent=CFG.free_limit; document.getElementById('u-fill').style.width=((st.chatUsed||0)/CFG.free_limit*100)+'%' }
  else strip.classList.add('off');
}
function ar(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,110)+'px'}
function artAI(){const t=document.getElementById('rdr-body')?.querySelector('.rtitle')?.textContent||'this topic';cRdr();openChat();setTimeout(()=>{document.getElementById('cta').value=`Tell me more about: ${t} — specifically for my ${U().hairType||'4C'} hair`;doSend()},400)}
function analyzeP(){const p=PR();if(!p.length){openAddP();return}const l=p.map(x=>x.name+' ('+x.cat+')').join(', ');openChat();setTimeout(()=>{document.getElementById('cta').value=`Analyze my product pantry for my ${U().hairType||'4C'} ${U().porosity||'high'}-porosity hair. My products: ${l}. What gaps exist? Any conflicts? What am I missing?`;doSend()},400)}
function aiRoutine(){openChat();setTimeout(()=>{const u=U();document.getElementById('cta').value=`Build me a complete wash day routine for my ${u.hairType||'4C'}, ${u.porosity||'high'}-porosity, ${u.thickness||'coarse'} hair. Challenge: ${u.challenge||'moisture retention'}. Goals: ${(u.goals||[]).join(', ')}. Give every step with timing and product types.`;doSend()},400)}

/* ═══════════════════════════════
   PROFILE
═══════════════════════════════ */
function renderProfile(){
  const u=U(), g=id=>document.getElementById(id);
  g('p-type').textContent=u.hairType||'4C';
  g('p-nick').textContent=u.hairNick||'The Fierce Kink';
  g('p-pills').innerHTML=[(u.porosity||'High')+' Porosity',(u.thickness||'Coarse')+' Strand',(u.scalp||'Normal')+' Scalp'].map(t=>`<div class="ppill">${t}</div>`).join('');
  const gMap={length:'Length Retention',health:'Hair Health',definition:'Better Definition',scalp_h:'Healthy Scalp',transition:'Transitioning'};
  g('p-goals').innerHTML=(u.goals||['health']).map(gl=>`<span class="chip cg">${gMap[gl]||gl}</span>`).join('');
  const p=PR(), cats=['Shampoos','Conditioners','Leave-ins','Stylers','Oils','Tools'], ids=['s','c','l','st','o','t'];
  cats.forEach((c,i)=>{const n=p.filter(x=>x.cat===c).length; g('cnt-'+ids[i]).textContent=n+' product'+(n!==1?'s':'')});
  renderGrow();
}

function renderGrow(){
  const gr=GR(),set=SET(),u=set.units==='cm'?'cm':'in',area=document.getElementById('p-grow');
  if(!gr.length){ area.innerHTML='<div class="empty"><div class="big">📏</div>No measurements yet.<br/><button class="btn bg bsm" style="margin-top:10px" onclick="openGrow()">Log My Length</button></div>'; return }
  let ret='';
  if(gr.length>=2){
    const f=gr[0],l=gr[gr.length-1];
    const mo=Math.max(1,Math.round((new Date(l.date)-new Date(f.date))/(864e5*30)));
    const growth=parseFloat(l.crown||0)-parseFloat(f.crown||0);
    if(growth>0) ret=`<div style="background:rgba(201,147,74,.1);border-radius:12px;padding:10px 13px;margin-bottom:12px;font-size:13px;color:var(--p)">📈 ~${(growth/mo).toFixed(1)} ${u}/month · +${(growth/mo*12).toFixed(1)} ${u}/year at this rate</div>`;
  }
  area.innerHTML=ret+gr.slice(-5).map(g=>`<div class="gi"><div style="font-size:24px">📏</div><div><div class="gi-d">${g.date}</div><div class="gi-val">${g.crown||'—'} ${u}</div><div style="font-size:11.5px;color:var(--mu)">${g.sides?'Sides: '+g.sides+' '+u:''}${g.back?' · Back: '+g.back+' '+u:''}</div></div></div>`).join('');
}

/* ═══════════════════════════════
   PRODUCT PANTRY
═══════════════════════════════ */
let _ePId=null, _pSt=5;
function openAddP(cat){
  _ePId=null; _pSt=5;
  ['pr-nm','pr-br','pr-no'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
  const em=document.getElementById('pr-em');if(em)em.value='🫙';
  if(cat){const c=document.getElementById('pr-cat');if(c)c.value=cat}
  setSt2('pr-st',0);
  oSh('prod');
  document.getElementById('sh-prod-t').textContent='Add Product';
}
function setPSt(n){_pSt=n;setSt2('pr-st',n)}
function saveProd(){
  const nm=document.getElementById('pr-nm').value.trim();
  if(!nm){toast('Product name required','err');return}
  const p={id:_ePId||uid(),cat:document.getElementById('pr-cat').value,name:nm,brand:document.getElementById('pr-br').value.trim(),emoji:document.getElementById('pr-em').value||'🫙',rating:_pSt,notes:document.getElementById('pr-no').value.trim(),added:tod()};
  const ps=PR(); if(_ePId){const i=ps.findIndex(x=>x.id===_ePId);ps[i]=p}else ps.unshift(p);
  sPR(ps); cSh('prod'); renderProfile(); toast('Product saved! 🧴','ok');
}
function openPantry(cat){
  document.getElementById('sh-pantry-t').textContent=cat;
  const ps=PR().filter(p=>p.cat===cat);
  const body=document.getElementById('sh-pantry-b');
  if(!ps.length) body.innerHTML=`<div class="empty"><div class="big">🧴</div>No ${cat.toLowerCase()} yet.<br/><button class="btn bg bsm" style="margin-top:10px" onclick="openAddP('${cat}')">+ Add Product</button></div>`;
  else body.innerHTML=ps.map(p=>`<div class="perf"><div class="perf-e">${p.emoji||'🧴'}</div><div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--ink)">${esc(p.name)}</div><div style="font-size:11.5px;color:var(--mu)">${p.brand||''}</div><div style="color:var(--gold);font-size:13px">${'★'.repeat(p.rating||0)}</div></div><button class="btn bo bsm" onclick="eProd('${p.id}')">Edit</button></div>`).join('');
  oSh('pantry');
}
function eProd(id){const p=PR().find(x=>x.id===id);if(!p)return;_ePId=id;document.getElementById('pr-cat').value=p.cat;document.getElementById('pr-nm').value=p.name;document.getElementById('pr-br').value=p.brand||'';document.getElementById('pr-em').value=p.emoji||'🫙';document.getElementById('pr-no').value=p.notes||'';_pSt=p.rating||5;setSt2('pr-st',_pSt);oSh('prod');document.getElementById('sh-prod-t').textContent='Edit Product'}

/* ═══════════════════════════════
   ROUTINES
═══════════════════════════════ */
const METHODS=[
  {i:'💧',n:'LOC Method',d:'Liquid → Oil → Cream. Best for high-porosity Type 4.',t:['4B','4C','High Por.'],
   steps:['Spray hair fully wet with water or leave-in (Liquid)','Apply penetrating oil — coconut, olive, or avocado (Oil)','Seal with a thick cream or butter (Cream)','Section into 4–6 parts, work through each fully','Reapply daily on ends only — never restart the whole routine']},
  {i:'🌊',n:'LCO Method',d:'Liquid → Cream → Oil. Best for low-porosity coils.',t:['4A','4B','Low Por.'],
   steps:['Spray hair with warm water — opens the cuticle (Liquid)','Apply a lightweight cream or leave-in immediately (Cream)','Seal with a light oil — argan, jojoba, grapeseed (Oil)','Steam under a plastic cap for 15 minutes to lock in moisture','Repeat every 2–3 days as needed']},
  {i:'🎁',n:'Baggy Method',d:'Cover moisturized hair overnight for extreme hydration.',t:['4C','Dry Hair'],
   steps:['Moisturize ends with water + cream + oil','Cover hair with a plastic shower cap or processing cap','Add a satin bonnet over the plastic cap (warmth + protection)','Sleep with it on — your body heat does the work','Remove in the morning, do not rinse']},
  {i:'🌿',n:'GHE (Greenhouse)',d:'Trap body heat to open the cuticle for deep moisture penetration.',t:['4B','4C'],
   steps:['Spray hair with water until dripping','Apply your favorite leave-in conditioner generously','Cover with a plastic cap, then a beanie or scarf','Leave for 1–4 hours (or overnight) — the longer, the better','Style as usual — your hair will be noticeably softer']},
  {i:'💪',n:'Inversion Method',d:'Scalp massage + inversion for accelerated growth.',t:['Growth'],
   steps:['Warm a scalp oil — jojoba, grapeseed, or castor','Massage into your scalp for 4 minutes','Lower your head below your heart (sit and lean over)','Stay inverted for 4 minutes — improves blood flow to follicles','Do for 7 days, then take a 3-week break (only effective in cycles)']},
  {i:'✂️',n:'Big Chop Recovery',d:'First 6 months post-chop routine and styling guide.',t:['New Natural'],
   steps:['Wash weekly with sulfate-free shampoo','Deep condition every wash — your TWA is fragile','Moisturize daily with a light cream + oil','Try wash-n-gos, finger coils, and braid-outs to learn your pattern','Avoid heat for the first year — let your texture set']},
  {i:'🛡️',n:'Protective Styling',d:'Safe limits, takedown routine, and edge care.',t:['4B','4C','Retention'],
   steps:['Never accept tight styles — they cause traction alopecia','Moisturize scalp 2x per week through the style','Wash scalp with diluted shampoo every 10–14 days','Take down within 6–8 weeks maximum','Deep condition immediately after takedown']},
  {i:'🔄',n:'Max Hydration',d:'Multi-step daily moisturizing system for coarse 4C hair.',t:['4C','Coarse'],
   steps:['Day 1: clarify, deep condition, apply leave-in','Day 2: cherry-lola treatment (mayo + yogurt + baking soda)','Day 3: clay rinse with bentonite clay','Days 4–7: spritz with water + glycerin mix 2x daily','Repeat the entire cycle weekly for 4 weeks for hair transformation']},
  {i:'🥥',n:'Pre-Poo',d:'Oil treatment BEFORE shampoo — protects strands during wash.',t:['All Type 4'],
   steps:['1 hour before shampooing, saturate hair with oil','Best oils: coconut (penetrates), olive, or avocado','Cover with a plastic cap — body heat helps penetration','Detangle gently while oiled — strands are slippery and protected','Shampoo as normal — your hair will feel less stripped']},
  {i:'🧴',n:'Co-Washing',d:'Wash with conditioner instead of shampoo between cleanses.',t:['4A','4B','Dry'],
   steps:['Wet hair thoroughly with warm water','Apply a cleansing conditioner — NOT a regular conditioner','Massage into scalp like shampoo (3–5 minutes)','Rinse with cool water to seal cuticle','Alternate with sulfate-free shampoo every 2nd wash']},
  {i:'🌬️',n:'Stretching Methods',d:'Reduce shrinkage without heat damage.',t:['Length Display'],
   steps:['Banding: section damp hair, wrap with elastics every 2 inches','Threading: wrap sections in yarn from root to tip','African threading: same as threading but with cotton thread','Twist-outs: do on damp hair, unravel completely dry','African threading shows the most length with zero heat']},
  {i:'🧪',n:'Protein-Moisture Balance',d:'The #1 thing that determines if your hair thrives or breaks.',t:['All Type 4'],
   steps:['Test: stretch a wet strand. If it snaps — needs moisture. If it stretches forever then breaks — needs protein','Too much protein: hair feels stiff, straw-like, breaks at touch → moisture treatment','Too much moisture: hair feels limp, mushy, stringy → protein treatment','Weekly moisture, monthly protein is the standard for most Type 4','Strong protein (hydrolyzed wheat, keratin) only for damaged hair']},
];
let _rSteps=[];

function renderRoutines(){
  const rts=RT(), g=id=>document.getElementById(id);
  const list=g('r-list');
  list.innerHTML=!rts.length?`<div class="empty"><div class="big">🌿</div>No routines yet. Create one or let AI build it!<br/><button class="btn bg bsm" style="margin-top:10px" onclick="openNewR()">+ Create Routine</button></div>`:rts.map(r=>`<div class="rc"><div class="rowb" style="margin-bottom:8px"><div class="rc-n">${esc(r.name)}</div><span class="chip cg">${r.type}</span></div><div class="rc-m">⏱ ${r.dur||'—'} · ${r.steps?.length||0} steps</div><div class="rc-steps">${(r.steps||[]).slice(0,5).map(s=>`<div class="rc-step">${esc(s)}</div>`).join('')}</div></div>`).join('');
  renderCal();
  g('r-methods').innerHTML=METHODS.map(m=>`<div class="mcard"><div class="mcard-i">${m.i}</div><div class="mcard-n">${m.n}</div><div class="mcard-d">${m.d}</div><div class="mcard-t">${m.t.map(t=>`<span class="chip cd">${t}</span>`).join('')}</div></div>`).join('');
}
// Boot-time setup for the Routines screen — just renders once with current data.
// Kept separate from renderRoutines() so launch() reads cleanly alongside initLearn().
function initRoutines(){
  renderRoutines();
}

function renderCal(){
  const sc=SC(), cal=document.getElementById('r-cal'), now=new Date(), yr=now.getFullYear(), mo=now.getMonth();
  const first=new Date(yr,mo,1), days=['S','M','T','W','T','F','S'];
  let h=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:11px"><div style="font-family:'Playfair Display',Georgia,serif;font-size:16px;font-weight:600;color:var(--ink)">${now.toLocaleString('default',{month:'long',year:'numeric'})}</div><div style="font-size:11px;color:var(--mu)">Tap to schedule</div></div><div class="cal-g">`;
  days.forEach(d=>h+=`<div class="cal-dh">${d}</div>`);
  for(let i=0;i<first.getDay();i++) h+=`<div class="cal-d dim"></div>`;
  const dim=new Date(yr,mo+1,0).getDate();
  for(let d=1;d<=dim;d++){
    const ds=`${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isW=sc.includes(ds), isT=ds===tod();
    h+=`<div class="cal-d${isW?' wash':''}${isT?' today':''}" onclick="tWD('${ds}')">${d}</div>`;
  }
  cal.innerHTML=h+'</div>';
}
function tWD(date){const sc=SC();const i=sc.indexOf(date);if(i>-1){sc.splice(i,1);toast('Wash day removed','info')}else{sc.push(date);toast('Wash day scheduled! 💧','ok')}sSC(sc);renderCal();updateHome()}

function openNewR(){_rSteps=[];['r-nm','r-du'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});renderRSteps();oSh('routine')}
function addRS(){const s=document.getElementById('r-step-sel');if(!s.value)return;_rSteps.push(s.value);s.value='';renderRSteps()}
function renderRSteps(){document.getElementById('r-steps').innerHTML=_rSteps.map((s,i)=>`<div class="rstep"><div class="rstep-n">${i+1}</div><div style="flex:1;font-size:13.5px;color:var(--ink)">${esc(s)}</div><button onclick="_rSteps.splice(${i},1);renderRSteps()" style="color:var(--mu);font-size:18px;padding:4px;cursor:pointer;border:none;background:none">×</button></div>`).join('')}
function saveR(){const nm=document.getElementById('r-nm').value.trim();if(!nm){toast('Name required','err');return}const r={id:uid(),name:nm,type:document.getElementById('r-ty').value,steps:[..._rSteps],dur:document.getElementById('r-du').value.trim(),created:tod()};const rts=RT();rts.unshift(r);sRT(rts);cSh('routine');renderRoutines();toast('Routine saved! 🌿','ok')}

/* ═══════════════════════════════
   LEARN
═══════════════════════════════ */
const ARTS=[
  {id:'a1',cat:'Science',i:'🔬',t:'Why Type 4 Hair Is Naturally Dry',d:'The science behind why your coils crave moisture.',time:'4 min',
  body:`<h2>The Science of Natural Dryness</h2><p>Type 4 hair is the most naturally dry hair type, and there's a beautiful, scientific reason for it.</p><h3>The Sebum Problem</h3><p>Your scalp produces <strong>sebum</strong> — natural hair oil. On straight hair it slides right down. On Type 4 coils, it must navigate every twist and turn of your tight coil pattern. By the time it reaches your ends, most has been left behind.</p><div class="callout"><div class="callout-l">4C Specifically</div>The tighter your coil pattern, the more dramatically this affects you. 4C hair has the tightest pattern — which is why moisture retention is the #1 challenge.</div><h3>What This Means</h3><ul><li><strong>Water is your best product</strong> — always start with water first</li><li><strong>Sealing is non-negotiable</strong> — oil or butter locks in moisture</li><li><strong>Moisturize more frequently</strong> than naturals with looser textures</li><li><strong>Product layering works</strong> — LOC/LCO mimics what sebum does naturally</li></ul><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>If your hair feels dry, add MORE water first. Then seal immediately before it evaporates. Moisturize 2–3x more than you think you need to.</div>`},
  {id:'a2',cat:'Science',i:'💧',t:'Porosity Explained for Type 4 Coils',d:'High, normal, or low — understanding porosity changes everything.',time:'5 min',
  body:`<h2>What Is Hair Porosity?</h2><p>Porosity is your hair's ability to absorb and retain moisture, determined by the state of your cuticle — the outermost layer of each strand.</p><h3>High Porosity (most common in Type 4)</h3><p>Raised cuticles with gaps — moisture enters easily but escapes quickly. Signs: hair dries fast, feels dry again within hours. Best approach: <strong>LOC method</strong> with heavy sealants.</p><h3>Low Porosity</h3><p>Tightly sealed cuticles — moisture struggles to enter but stays once inside. Signs: products sit on top, hair takes forever to dry. Best approach: <strong>steam or heat during deep conditioning</strong> + lightweight products.</p><h3>Normal Porosity</h3><p>The balanced middle — absorbs and retains well. Most standard advice works for this type.</p><div class="callout"><div class="callout-l">Porosity Test</div>Drop a clean shed strand in water. Sinks = high. Floats in the middle = normal. Floats on top = low. Use 3–5 strands from different areas for accuracy.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Hair feels dry hours after moisturizing? High porosity. Products build up without penetrating? Low porosity. Your routine should address YOUR porosity, not generic Type 4 advice.</div>`},
  {id:'a3',cat:'Ingredients',i:'🌿',t:'Holy Grail Ingredients for Type 4 Hair',d:'The ingredients your coils actually need.',time:'6 min',
  body:`<h2>Reading Labels for Type 4 Coils</h2><p>The beauty industry isn't designed for Type 4 hair. Here's what your coils actually need.</p><h3>Humectants (attract moisture)</h3><ul><li><strong>Glycerin</strong> — Pulls water from the air into your hair. The gold standard humectant.</li><li><strong>Aloe vera</strong> — Lightweight, penetrating, soothing. Perfect first layer in LOC.</li><li><strong>Panthenol (Pro-Vitamin B5)</strong> — Enters the shaft and attracts water from inside out.</li></ul><h3>Penetrating Oils (enter the shaft)</h3><ul><li><strong>Coconut oil</strong> — The only oil scientifically proven to penetrate the hair shaft. Reduces protein loss. Test first — some Type 4 coils don't like it.</li><li><strong>Avocado oil</strong> — Rich in oleic acid. Great for thick, coarse coils.</li></ul><h3>Sealing Agents (lock moisture in)</h3><ul><li><strong>Castor oil</strong> — The Type 4 staple. Thick, sealing, great for scalp and ends. Don't use full-length — too heavy.</li><li><strong>Shea butter</strong> — The GOAT of Type 4 sealants. Your ends need this every single night.</li><li><strong>JBCO (Jamaican Black Castor Oil)</strong> — The growth community's holy grail.</li></ul><div class="callout"><div class="callout-l">Avoid These</div>SLS/SLES sulfates in everyday shampoo. Drying alcohols (alcohol denat, isopropyl). Petrolatum and mineral oil. Silicones without sulfate shampoos to remove them.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Holy trinity for 4C: Aloe vera (liquid) + coconut/olive oil (penetrating) + shea butter (seal). These three address moisture retention better than most expensive products.</div>`},
  {id:'a4',cat:'Styling',i:'💦',t:'Wash-n-Go for 4C Hair: The Real Guide',d:'The wash-n-go that actually works for 4C.',time:'7 min',
  body:`<h2>The 4C Wash-n-Go Truth</h2><p>"4C hair can't do wash-n-gos" is a myth. The truth: 4C wash-n-gos require a different technique than tutorials made for 3C and 4A hair.</p><h3>Step 1: Start Completely Soaking Wet</h3><p>Not damp — <strong>dripping soaking wet</strong>. Work in the shower with the water running, or section and saturate each area fully with a spray bottle. This is the most common mistake.</p><h3>Step 2: Apply On Soaking Wet Hair</h3><ul><li>Apply leave-in or conditioner first — detangle while still soaking wet</li><li>Apply gel or custard immediately while leave-in is still wet on hair</li><li>Optional: second application of gel on top for more hold</li></ul><div class="callout"><div class="callout-l">4C Technique</div>Don't rake products through in one direction. Use the "shingling method" — work through small sections, smoothing each coil group individually with your fingers. Respect your natural pattern.</div><h3>Step 3: Do Not Touch Until Bone Dry</h3><p>Zero touching until 100% dry. Any manipulation while wet = frizz. Air dry fully or diffuse on low heat.</p><h3>Step 4: Fluff When Completely Dry</h3><p>Gently separate coils with a pick or fingers only after fully dry. Scrunch out any gel cast gently.</p><div class="callout"><div class="callout-l">✨ Pro Tip for 4C</div>Shrinkage on a wash-n-go is normal and beautiful. To show more length, stretch sections with banding or threading before applying products — then let your coils fall into their natural pattern.</div>`},
  {id:'a5',cat:'Growth',i:'📏',t:'Why Your Type 4 Hair IS Growing',d:'Shrinkage isn\'t lack of growth. The truth about retention.',time:'4 min',
  body:`<h2>Your Hair Is Growing. Really.</h2><p>The most common natural hair myth: "My hair hasn't grown in 3 years." It has. The problem isn't growth — it's <strong>retention</strong>.</p><h3>The Growth Rate Reality</h3><p>ALL human hair grows approximately half an inch per month regardless of race or hair type. That's 6 inches per year. Type 4 hair breaks at the ends as fast or faster than it grows at the root — so you see no change in length even though your follicles are working perfectly.</p><h3>The 5 Retention Killers</h3><ul><li><strong>Dryness</strong> — Dry hair is brittle. Brittle hair breaks at the ends.</li><li><strong>Over-manipulation</strong> — Every time you touch your hair, you risk breakage. Handle less.</li><li><strong>Tight styles</strong> — Traction alopecia is real and can be irreversible. Never accept tight styles.</li><li><strong>Heat damage</strong> — Once you alter the protein structure with heat, it's changed permanently.</li><li><strong>Mechanical damage</strong> — Wrong tools, rough detangling, cotton pillowcases.</li></ul><div class="callout"><div class="callout-l">4C Specifically</div>With 90%+ shrinkage, 6 inches of growth looks like barely an inch when shrunken. This isn't slow growth. This is your elastic, healthy 4C hair doing exactly what it's designed to do.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Your ends are the oldest part of your hair. Treat them like they're priceless — because without them, all your growth is invisible. Moisturize your ends obsessively, seal every night, and trim split ends before they travel up the shaft.</div>`},
  {id:'a6',cat:'Scalp',i:'🧖',t:'Scalp Health for Type 4 Naturals',d:'Healthy scalp = healthy coils from the root up.',time:'5 min',
  body:`<h2>The Scalp-Hair Connection</h2><p>Every strand of your hair is born from a follicle in your scalp. If your scalp is inflamed, clogged, or irritated, the hair that emerges from it is compromised before it even starts.</p><h3>Common Type 4 Scalp Issues</h3><p><strong>Product buildup:</strong> Heavy butters and creams — essential for Type 4 moisture — can clog follicles if not properly removed. Result: slow growth, itching, and weakened strands at the root.</p><p><strong>Seborrheic dermatitis:</strong> Persistent flaking, oily scales, and itching. This is NOT just dandruff — it requires antifungal treatment. Look for products with zinc pyrithione, ketoconazole, or tea tree oil.</p><p><strong>CCCA (Central Centrifugal Cicatricial Alopecia):</strong> Hair loss starting at the crown, spreading outward. Disproportionately affects Black women. If you notice persistent crown thinning, see a dermatologist immediately — this is a medical condition.</p><h3>Scalp Care Essentials</h3><ul><li><strong>Clarify monthly minimum</strong> — Your follicles need to breathe</li><li><strong>Scalp massage 3–5x per week</strong> — Improves circulation, stimulates growth</li><li><strong>Tea tree oil (diluted)</strong> — Antibacterial and antifungal for itching</li><li><strong>Never scratch</strong> — Creates micro-tears that invite infection and scarring</li></ul><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Do a 5-minute scalp massage before every wash day. Use jojoba or grapeseed oil. It loosens buildup, increases blood flow to follicles, and costs nothing. The single best thing you can do for growth.</div>`},
  {id:'a7',cat:'Protective',i:'🛡️',t:'How Long Is Too Long? Protective Style Guide',d:'Safe timeframes, takedowns, and protecting your edges.',time:'5 min',
  body:`<h2>The Protective Style Paradox</h2><p>Protective styles are meant to protect your hair — but done wrong, they cause more damage than no style at all.</p><h3>Safe Time Limits</h3><ul><li><strong>Box braids / knotless braids:</strong> 6–8 weeks maximum</li><li><strong>Faux locs:</strong> 6 weeks</li><li><strong>Cornrows:</strong> 2–4 weeks</li><li><strong>Crochet styles:</strong> 4–6 weeks</li><li><strong>Wigs (cap):</strong> No time limit on the wig itself — care for the hair underneath weekly</li></ul><div class="callout"><div class="callout-l">The Edge Warning</div>Your edges are the most fragile hair on your head. Tension from tight styles causes traction alopecia — PERMANENT hair loss. If you feel pulling at your hairline when a style is installed, it is ALREADY too tight. Do not accept this.</div><h3>During the Style</h3><ul><li>Moisturize your scalp weekly with a light spray or oil</li><li>Wash your scalp through braids with diluted shampoo</li><li>Satin bonnet every single night without exception</li></ul><h3>The Takedown</h3><ul><li>Saturate with conditioner or oil BEFORE starting takedown</li><li>Remove extensions gently and slowly — never rush</li><li>Detangle immediately in sections with conditioner still in hair</li><li>Deep condition after every takedown — your hair needs recovery time</li></ul><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Knotless braids are significantly better than traditional box braids for retention. Less tension from the root from day one. Your natural hair is under less continuous stress throughout the entire style duration.</div>`},
  {id:'a8',cat:'Seasonal',i:'❄️',t:'Winter Type 4 Hair Guide',d:'Cold air steals your moisture. Here\'s exactly how to fight back.',time:'4 min',
  body:`<h2>Winter and Type 4 Coils</h2><p>Cold air holds dramatically less moisture than warm air. This means the air itself will actively pull moisture out of your coils — leaving you drier than usual even if you don't change your routine.</p><h3>Winter Adjustments That Matter</h3><ul><li><strong>Moisturize more frequently</strong> — What worked twice a week may need to happen daily</li><li><strong>Upgrade your sealant</strong> — Switch to heavier butters (shea, mango, kokum) to create a stronger barrier</li><li><strong>Satin-lined everything</strong> — Hats, scarves, bonnets. Regular wool and cotton are moisture vampires</li><li><strong>Never go outside with wet hair</strong> — The cuticle contracts rapidly in cold air, causing breakage at the shaft</li></ul><h3>DIY Winter Moisture Mask</h3><p>2 tbsp shea butter + 1 tbsp honey + 1 tbsp olive oil. Apply to dry hair before bed, cover with satin bonnet, wash out in the morning. Weekly through winter.</p><div class="callout"><div class="callout-l">4C in Winter</div>The GHE (Greenhouse Effect) method becomes your best friend in winter — sealing moisture under a shower cap overnight. Your body heat becomes a natural steamer that forces moisture into even the most resistant low-porosity coils.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Switch from spray leave-ins to cream-based leave-ins in winter months, and add one extra sealant step. That extra layer is the difference between retained length and a full winter of breakage.</div>`},
  {id:'a9',cat:'Science',i:'⚖️',t:'Protein-Moisture Balance: The Most Important Concept',d:'Why your hair is breaking — and exactly how to fix it.',time:'6 min',
  body:`<h2>The Balance That Determines Everything</h2><p>If you understand one thing about Type 4 hair, make it this: every strand needs <strong>both</strong> protein and moisture in balance. Too much of either causes breakage. Most "mystery breakage" comes from this imbalance.</p><h3>The Diagnostic Stretch Test</h3><p>Take a single shed strand. Wet it. Stretch it gently.</p><ul><li><strong>Snaps immediately</strong> → moisture deficient. Hair is stiff and brittle.</li><li><strong>Stretches forever then breaks</strong> → protein deficient. Hair is mushy and over-elastic.</li><li><strong>Stretches a bit, then bounces back</strong> → balanced. This is what you want.</li></ul><h3>Moisture Overload Signs</h3><ul><li>Hair feels limp, stringy, or mushy when wet</li><li>Won't hold any style — curl pattern looks weak</li><li>Snaps easily, especially when wet</li><li>Solution: protein treatment (hydrolyzed wheat, keratin, rice water)</li></ul><h3>Protein Overload Signs</h3><ul><li>Hair feels stiff, hard, straw-like</li><li>Won't accept moisture no matter what you apply</li><li>Breaks at the slightest touch</li><li>Solution: deep moisture treatment (no protein for 4–6 weeks)</li></ul><div class="callout"><div class="callout-l">Type 4 Default Schedule</div>Most Type 4 hair thrives on: weekly moisture deep conditioning + monthly mild protein treatment. Adjust from there based on YOUR hair's response.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Protein-sensitive hair is real and common in Type 4. If hydrolyzed wheat or keratin make your hair feel worse, switch to amino acids (gentler) or skip protein entirely and rebuild with moisture.</div>`},
  {id:'a10',cat:'Scalp',i:'💦',t:'Hard Water and Your Coils',d:'The hidden cause of dryness, buildup, and breakage.',time:'4 min',
  body:`<h2>What Hard Water Does to Type 4 Hair</h2><p>Hard water contains high levels of calcium, magnesium, and iron. These minerals bind to your hair strands, leaving a coating that:</p><ul><li>Prevents moisture from penetrating</li><li>Causes buildup that products can't remove</li><li>Makes hair feel dry no matter what you apply</li><li>Causes breakage where minerals weaken the strand</li></ul><h3>Signs You Have Hard Water</h3><ul><li>Soap doesn't lather well</li><li>White film on your shower head or faucets</li><li>Hair feels coated even after shampooing</li><li>Skin feels itchy and dry after showering</li></ul><h3>Solutions That Work</h3><ul><li><strong>Install a shower filter</strong> — $30–80, screws onto your existing shower head, removes 90%+ of minerals. Single biggest hair upgrade most Type 4 women never try.</li><li><strong>Chelating shampoo monthly</strong> — Look for EDTA or sodium gluconate. Removes mineral buildup.</li><li><strong>ACV rinse after washing</strong> — 1 tbsp apple cider vinegar in 2 cups water, final rinse. Reverses mineral binding.</li><li><strong>Bottled water for final rinse</strong> — Distilled or filtered water as a treatment when traveling.</li></ul><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>If you've tried "everything" and your hair still feels dry — get your water tested. Hard water is the #1 invisible cause of Type 4 hair frustration in the US, especially in the Midwest and Southwest.</div>`},
  {id:'a11',cat:'Seasonal',i:'☀️',t:'Summer Type 4 Hair Guide',d:'Humidity, sun, pool, sweat — your warm weather playbook.',time:'5 min',
  body:`<h2>Type 4 in Summer</h2><p>Summer brings unique challenges that winter doesn't: humidity, UV exposure, chlorine, salt water, and constant sweat. Each requires its own strategy.</p><h3>Humidity Survival</h3><p>High humidity reactivates anti-humectants you may have used. Glycerin works WITH high humidity — but in extreme humidity, even glycerin makes hair frizzy. Switch to anti-humectants like:</p><ul><li>Beeswax-based products</li><li>Silicone-free smoothing serums</li><li>Aloe vera juice as a setting agent</li></ul><h3>Pre-Swim Protection</h3><ul><li>Saturate hair with fresh water BEFORE entering pool/ocean — soaked hair absorbs less chlorine/salt</li><li>Apply a heavy oil (coconut or olive) as a barrier</li><li>Wear a swim cap or braid hair up</li><li>Rinse immediately after — chlorine and salt are cumulative damage</li></ul><h3>UV Damage</h3><p>The sun degrades melanin in hair, causing color fading and protein breakdown. Type 4 hair is especially vulnerable because the tightly coiled structure exposes more surface area.</p><ul><li>Wear a wide-brim hat or scarf when outdoors</li><li>Use products with UV filters (cyclohexane, octinoxate)</li><li>Deep condition weekly through summer</li></ul><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Summer is the ONLY time to safely cut back on heavy sealants — humidity is doing the moisturizing for you. Switch to lightweight leave-ins and your hair will look its best of the year.</div>`},
  {id:'a12',cat:'Growth',i:'👑',t:'Edge Care: Protecting Your Hairline',d:'Why your edges are different — and how to keep them.',time:'5 min',
  body:`<h2>Your Edges Need Special Care</h2><p>The hair around your hairline (edges, baby hairs, temple area) is biologically different from the rest of your hair:</p><ul><li><strong>Finer in diameter</strong> — half the thickness of crown hair</li><li><strong>Shorter growth cycles</strong> — these strands break and regrow faster</li><li><strong>More fragile cuticle</strong> — less protein per strand</li><li><strong>More vulnerable to tension</strong> — traction alopecia starts here</li></ul><h3>Common Edge Destroyers</h3><ul><li><strong>Tight braids/cornrows at the front</strong> — the #1 cause of permanent edge loss</li><li><strong>Slick edge gels with high alcohol content</strong> — dries them out, causes breakage</li><li><strong>Daily slicking with brushes</strong> — friction wears them down</li><li><strong>Sleeping without a satin scarf/bonnet</strong> — cotton pulls and dries edges nightly</li><li><strong>Wigs without a satin liner</strong> — the cap rubs your edges raw</li></ul><h3>Edge Restoration Routine</h3><ul><li>Castor oil (JBCO) massage 5 minutes nightly</li><li>Rosemary oil or rice water spritz 3x weekly</li><li>Avoid all tension styles at the front for 8–12 weeks</li><li>Take biotin/MSM/collagen supplements (with doctor approval)</li><li>Be patient — edges take 3–6 months to visibly recover</li></ul><div class="callout"><div class="callout-l">Medical Reality</div>If you have visible bald patches at your hairline, see a dermatologist. Traction alopecia caught early can be reversed. Caught late, it's permanent. Don't wait to "see if it grows back" for a year.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>The "wolf cut" of laying edges is hurting more women than it's helping. Embrace your natural baby hairs as-is. They were never meant to be perfectly slicked — they're protective, not decorative.</div>`},
  {id:'a13',cat:'Science',i:'🧬',t:'How Your Hair Changes With Age',d:'Hormones, gray hair, density — what to expect at every decade.',time:'6 min',
  body:`<h2>Type 4 Hair Across Decades</h2><p>Your hair will not be the same at 40 as it was at 20. Understanding the changes lets you adapt instead of fight.</p><h3>20s: The Baseline</h3><p>Maximum density (most hair on your head you'll ever have). Sebum production is high — your scalp is oilier. Hair grows fastest. This is when bad habits are most forgiving.</p><h3>30s: First Shifts</h3><ul><li>Sebum decreases — hair feels drier even with the same routine</li><li>First gray strands may appear (especially temples)</li><li>Postpartum shedding (if applicable) can dramatically change density</li><li>Curl pattern may loosen slightly after pregnancies</li></ul><h3>40s: Hormonal Transitions</h3><ul><li>Perimenopause begins — estrogen drops affect hair growth cycles</li><li>Hair may grow slower and shed more</li><li>Texture often becomes coarser and drier</li><li>Many Type 4 women see their pattern tighten back up</li></ul><h3>50s+: The New Normal</h3><ul><li>Menopause shifts hair to a more permanent state</li><li>Hair grows slower but each strand can be thicker</li><li>Gray hair is more porous — needs different moisturizing approach</li><li>Heat damage from prior decades shows up more visibly</li></ul><h3>Universal Adjustments by Decade</h3><ul><li>More moisture, less manipulation as you age</li><li>Heavier sealants — your scalp produces less natural oil</li><li>Protective styling becomes more valuable, not less</li><li>Trimming consistency matters more — ends thin faster with age</li></ul><div class="callout"><div class="callout-l">Gray Hair Specifics</div>Gray hair has more porosity and less natural moisture. Use heavier products and never apply heat to gray strands — they damage faster.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>The routine that grew your hair waist-length at 25 may not work at 45 — and that's okay. Adapt as your hair adapts. Listen to what your hair is telling you, not what worked five years ago.</div>`},
  {id:'a14',cat:'Styling',i:'📋',t:'Building Your First Real Regimen',d:'Stop product-hopping. Build a routine that actually works.',time:'7 min',
  body:`<h2>The Regimen That Will Save Your Hair</h2><p>Most natural hair frustration comes from inconsistency. A real regimen has 4 layers — once you build yours, you stop product-hopping forever.</p><h3>Layer 1: Weekly Wash Day (the foundation)</h3><ul><li>Pre-poo: oil treatment for 1 hour (optional but recommended)</li><li>Cleanse: sulfate-free shampoo OR clarifying co-wash</li><li>Deep condition: minimum 30 minutes, with heat or steam if possible</li><li>Leave-in: water-based, lightweight</li><li>Style with chosen products (LOC, LCO, etc.)</li></ul><h3>Layer 2: Mid-Week Refresh</h3><p>2–3 days after wash, hair starts to dry out. Spritz with water + leave-in, reapply a light cream to ends only. Re-twist or re-pineapple. 5-minute maintenance.</p><h3>Layer 3: Nightly Care</h3><ul><li>Re-moisturize ends if dry</li><li>Pineapple long hair or scarf shorter hair</li><li>Satin bonnet — every single night, no exceptions</li><li>Scalp oil (lightweight) 2–3x per week</li></ul><h3>Layer 4: Monthly Deep Work</h3><ul><li>Clarifying wash to remove buildup</li><li>Protein treatment (or moisture, depending on what hair needs)</li><li>Trim split ends</li><li>Reassess: is the routine working? What needs adjustment?</li></ul><h3>The 30/30/30 Rule</h3><p>Once you have a regimen: <strong>30 days</strong> with no changes. <strong>30 minutes</strong> on wash day minimum. <strong>30 strands</strong> shed per day is normal — don't panic.</p><div class="callout"><div class="callout-l">Common Mistake</div>Changing products every 2 weeks. Your hair needs at least 4 weeks to show whether a product is working. Patience is the most underrated tool in natural hair care.</div><div class="callout"><div class="callout-l">✨ Pro Tip for Type 4</div>Write down your regimen. Literally on paper or in your phone. When something stops working, you can pinpoint what changed. Most "my hair stopped responding to products" issues are actually "I added/removed something and forgot."</div>`},
];

let _lCat='All';
function initLearn(){
  const cats=['All','Science','Ingredients','Styling','Growth','Scalp','Protective','Seasonal'];
  document.getElementById('l-cats').innerHTML=cats.map(c=>`<button class="ctab${c==='All'?' on':''}" onclick="setLCat('${c}',this)">${c}</button>`).join('');
  fArts();
}
function setLCat(c,el){_lCat=c;document.querySelectorAll('.ctab').forEach(b=>b.classList.remove('on'));el.classList.add('on');fArts()}
function fArts(q=''){
  if(!q) q=document.getElementById('lq')?.value.toLowerCase()||'';
  let arts=ARTS;
  if(_lCat!=='All') arts=arts.filter(a=>a.cat===_lCat);
  if(q) arts=arts.filter(a=>a.t.toLowerCase().includes(q)||a.d.toLowerCase().includes(q));
  document.getElementById('arts').innerHTML=arts.map((a,i)=>`<div class="art ani d${Math.min(i+1,4)}" onclick="openArt('${a.id}')"><div style="float:right;font-size:26px;margin-left:8px">${a.i}</div><div class="art-cat">${a.cat}</div><div class="art-t">${a.t}</div><div class="art-d">${a.d}</div><div class="art-m">📖 ${a.time} read · Type 4 specific</div></div>`).join('');
}
function openArt(id){
  const a=ARTS.find(x=>x.id===id);if(!a)return;
  const r=document.getElementById('reader');
  document.getElementById('rdr-body').innerHTML=`<div class="rcat">${a.cat}</div><div class="rtitle">${a.t}</div><div class="rmeta">📖 ${a.time} read · Type 4 specific</div><div class="rcontent">${a.body}</div>`;
  r.classList.add('open');
  r.onscroll=()=>{const p=r.scrollTop/(r.scrollHeight-r.clientHeight)*100;document.getElementById('rpf').style.width=p+'%'};
}
function cRdr(){document.getElementById('reader').classList.remove('open')}
function lqSend(){const q=document.getElementById('lq')?.value.trim();if(q&&q.length>4){openChat();setTimeout(()=>{document.getElementById('cta').value=q;doSend()},400);if(document.getElementById('lq'))document.getElementById('lq').value=''}}

/* ═══════════════════════════════
   JOURNAL
═══════════════════════════════ */
let _lState='', _lMood='', _lStars=3, _lPhoto=null;

function renderJournal(){rJLogs();rJPhotos();rJGrow();rJPerf()}
function jTab(t,el){['log','photos','growth','products'].forEach(v=>document.getElementById('jv-'+v).classList.toggle('off',v!==t));document.querySelectorAll('.jtab').forEach(b=>b.classList.remove('on'));el.classList.add('on')}

function rJLogs(){
  const j=JN(), list=document.getElementById('j-logs');
  if(!j.length){list.innerHTML='<div class="empty"><div class="big">📓</div>No entries yet.<br/><button class="btn bg bsm" style="margin-top:10px" onclick="openLog()">Start Your First Entry</button></div>';return}
  list.innerHTML=j.map(l=>`<div class="lcard"><div class="rowb"><div class="lc-d">${l.date}</div><div class="lc-r">${'★'.repeat(l.rating||3)}</div></div><div class="lc-s">${l.state||'📝'} <span style="font-size:12px;color:var(--mu)">${l.mood||''}</span></div>${l.products?`<div class="lc-p">${l.products.split(',').map(p=>`<span class="lc-pi">${esc(p.trim())}</span>`).join('')}</div>`:''} ${l.notes?`<div class="lc-n">"${esc(l.notes)}"</div>`:''} ${l.photo?`<img src="${l.photo}" style="width:100%;border-radius:11px;margin-top:8px;max-height:200px;object-fit:cover"/>`:''}</div>`).join('');
}
function rJPhotos(){const j=JN().filter(l=>l.photo);const grid=document.getElementById('j-photos');grid.innerHTML=!j.length?'<div class="empty" style="grid-column:1/-1"><div class="big">📸</div>Add photos to your logs to see them here.</div>':j.map(l=>`<div class="pcell"><img src="${l.photo}"/><div class="pdate">${l.date}</div></div>`).join('')}
function rJGrow(){const gr=GR(),set=SET(),u=set.units==='cm'?'cm':'in',list=document.getElementById('j-grow');if(!gr.length){list.innerHTML='<div class="empty"><div class="big">📏</div>No measurements yet.<br/><button class="btn bg bsm" style="margin-top:10px" onclick="openGrow()">Log First Measurement</button></div>';return}list.innerHTML=gr.map(g=>`<div class="gi"><div style="font-size:24px">📏</div><div><div class="gi-d">${g.date}</div><div class="gi-val">${g.crown||'—'} ${u}</div><div style="font-size:11.5px;color:var(--mu)">${g.sides?'Sides: '+g.sides+' '+u:''}${g.back?' · Back: '+g.back+' '+u:''}</div>${g.notes?`<div style="font-size:12px;color:var(--mu);font-style:italic;margin-top:3px">${esc(g.notes)}</div>`:''}</div></div>`).join('')}
function rJPerf(){const j=JN(),perf={},list=document.getElementById('j-perfs');j.forEach(l=>{if(!l.products)return;l.products.split(',').forEach(p=>{const n=p.trim();if(!n)return;if(!perf[n])perf[n]={count:0,total:0};perf[n].count++;perf[n].total+=(l.rating||3)})});const entries=Object.entries(perf).sort((a,b)=>b[1].count-a[1].count);if(!entries.length){list.innerHTML='<div class="empty"><div class="big">🧴</div>Log products in daily entries to see performance here.</div>';return}list.innerHTML=entries.map(([nm,d])=>`<div class="perf"><div class="perf-e">🧴</div><div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--ink)">${esc(nm)}</div><div style="font-size:11.5px;color:var(--mu)">Used ${d.count} time${d.count!==1?'s':''}</div></div><div style="text-align:right"><div style="color:var(--gold);font-size:13px">${'★'.repeat(Math.round(d.total/d.count))}</div><div style="font-size:11px;color:var(--mu)">${(d.total/d.count).toFixed(1)} avg</div></div></div>`).join('')}

function openLog(){
  _lState=''; _lMood=''; _lStars=3; _lPhoto=null;
  document.querySelectorAll('#log-states .mc, #log-moods .mc').forEach(c=>c.classList.remove('on'));
  ['log-p','log-n'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
  document.getElementById('lp-prev').innerHTML='';
  setSt2('log-st',3);
  oSh('log');
}
function selSt(el){document.querySelectorAll('#log-states .mc').forEach(c=>c.classList.remove('on'));el.classList.add('on');_lState=el.dataset.v}
function selMd(el){document.querySelectorAll('#log-moods .mc').forEach(c=>c.classList.remove('on'));el.classList.add('on');_lMood=el.dataset.v}
function setSt(n){_lStars=n;setSt2('log-st',n)}
function setSt2(id,n){document.querySelectorAll('#'+id+' .star').forEach((s,i)=>s.classList.toggle('on',i<n))}
function addLP(inp){if(!inp.files[0])return;const r=new FileReader();r.onload=e=>{_lPhoto=e.target.result;document.getElementById('lp-prev').innerHTML=`<img src="${e.target.result}" style="width:100%;border-radius:12px;margin-top:8px;max-height:200px;object-fit:cover"/>`};r.readAsDataURL(inp.files[0])}
function saveLog(){
  const entry={id:uid(),date:tod(),ts:Date.now(),state:_lState,mood:_lMood,rating:_lStars,products:document.getElementById('log-p').value.trim(),notes:document.getElementById('log-n').value.trim(),photo:_lPhoto};
  const j=JN();j.unshift(entry);sJN(j);
  updateStreaks();
  cSh('log');rJLogs();updateHome();
  toast('Journal entry saved! 🌿','ok');
}
function openGrow(){['g-cr','g-si','g-ba','g-no'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});const set=SET();const u=document.getElementById('g-unit');if(u)u.textContent=set.units==='cm'?'cm':'in';oSh('grow')}
function saveGrow(){const c=document.getElementById('g-cr').value;if(!c){toast('Enter your crown length','err');return}const g={id:uid(),date:tod(),ts:Date.now(),crown:c,sides:document.getElementById('g-si').value,back:document.getElementById('g-ba').value,notes:document.getElementById('g-no').value.trim()};const gr=GR();gr.push(g);sGR(gr);cSh('grow');rJGrow();renderGrow();toast('Length logged! 📏','ok')}

/* ═══════════════════════════════
   STREAKS & BADGES
═══════════════════════════════ */
function updateStreaks(){
  const st=ST(), td2=tod();
  if(st.lastLog===td2)return;
  const y=new Date();y.setDate(y.getDate()-1);
  const ys=y.toISOString().split('T')[0];
  if(st.lastLog===ys) st.streak=(st.streak||0)+1; else st.streak=1;
  st.lastLog=td2;sST(st);checkBadges(st);
}
function checkStreaks(){
  const st=ST();if(!st.lastLog)return;
  const y=new Date();y.setDate(y.getDate()-1);
  if(st.lastLog!==tod()&&st.lastLog!==y.toISOString().split('T')[0]){st.streak=0;sST(st)}
}
function checkBadges(st){
  const b=st.badges||[];const j=JN();
  if(j.length>=1&&!b.includes('fl')){b.push('fl');toast('🏅 Badge unlocked: First Log! 🌱','ok')}
  if(st.streak>=7&&!b.includes('s7')){b.push('s7');toast('🏅 Badge: 7-Day Streak! 🔥','ok')}
  if(st.streak>=30&&!b.includes('s30')){b.push('s30');toast('🏅 Badge: Streak Star! ⭐','ok')}
  st.badges=b;sST(st);
}

/* ═══════════════════════════════
   SETTINGS
═══════════════════════════════ */
function updateSetUI(){
  const u=U(),set=SET(),g=id=>document.getElementById(id);
  g('s-name').textContent=u.name||'—';
  g('s-type').textContent=`Type ${u.hairType||'4'} Natural`;
  const td=g('tog-dark');if(td)td.checked=set.dark||false;
  g('s-units').textContent=set.units==='cm'?'Centimeters':'Inches';
  const key=ld('cc_apikey');g('api-st').textContent=key?'Set ✓ — tap to change':'Not set — tap to add';
  updatePlanUI();
}
function updatePlanUI(){const u=U(),g=id=>document.getElementById(id);g('s-plan').textContent=u.premium?'Premium ✨':'Free Plan';g('s-plan-s').textContent=u.premium?'Unlimited access':`${CFG.free_limit} AI messages/month`;const b=g('s-plan-b');if(b)b.innerHTML=u.premium?'<span class="chip cg">✨ Premium</span>':'<span class="chip cd">Free Tier</span>'}
function tDark(v){const set=SET();set.dark=v;sSET(set);document.getElementById('root').setAttribute('data-theme',v?'dark':'light')}
function sUnits(){const set=SET();set.units=set.units==='cm'?'in':'cm';sSET(set);document.getElementById('s-units').textContent=set.units==='cm'?'Centimeters':'Inches';toast('Units: '+(set.units==='cm'?'centimeters':'inches'),'info')}
function tApi(){const a=document.getElementById('api-area');a.classList.toggle('off');if(!a.classList.contains('off'))document.getElementById('api-inp')?.focus()}
function saveKey(){const k=document.getElementById('api-inp')?.value.trim();if(!k||!k.startsWith('sk-')){toast('Enter a valid API key (starts with sk-)','err');return}sv('cc_apikey',k);document.getElementById('api-st').textContent='Set ✓ — tap to change';document.getElementById('api-area').classList.add('off');if(document.getElementById('api-inp'))document.getElementById('api-inp').value='';toast('API key saved! You can now chat freely. 🌿','ok')}
function clearKey(){localStorage.removeItem('cc_apikey');document.getElementById('api-st').textContent='Not set — tap to add';if(document.getElementById('api-inp'))document.getElementById('api-inp').value='';toast('API key cleared','info')}
function expData(){const d={user:U(),journal:JN(),products:PR(),routines:RT(),schedule:SC(),growth:GR(),exported:new Date().toISOString()};const b=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`coilcare-${tod()}.json`;a.click();toast('Data exported! 📥','ok')}
function resetApp(){'cc_u,cc_st,cc_set,cc_jn,cc_pr,cc_rt,cc_sc,cc_gr,cc_ch,cc_apikey'.split(',').forEach(k=>localStorage.removeItem(k));location.reload()}

/* ═══════════════════════════════
   SUBSCRIPTION
═══════════════════════════════ */
function showUpgrade(){document.getElementById('upgrade-modal').classList.remove('off')}
function cMod(){document.getElementById('upgrade-modal').classList.add('off')}
function sPlan(t){window.open(t==='yearly'?CFG.pay_y:CFG.pay_m,'_blank');cMod()}
function actCode(){const c=document.getElementById('promo')?.value.trim().toUpperCase();if(CFG.codes.includes(c)){const u=U();u.premium=true;sU(u);cMod();updatePlanUI();updateHome();toast('Welcome to Premium! ✨ Unlimited access unlocked.','ok')}else toast('Invalid code. Check your purchase email.','err')}

/* ═══════════════════════════════
   SHEETS & READER
═══════════════════════════════ */
function oSh(id){document.getElementById('sh-'+id)?.classList.add('open')}
function cSh(id){document.getElementById('sh-'+id)?.classList.remove('open')}

/* ═══════════════════════════════
   TOAST
═══════════════════════════════ */
function toast(msg,type='ok'){
  const c=document.getElementById('toasts');
  const t=document.createElement('div');
  t.className='toast '+(type==='ok'?'tok':type==='err'?'terr':'tinfo');
  t.textContent=msg;c.appendChild(t);
  setTimeout(()=>t.style.opacity='0',2700);
  setTimeout(()=>t.remove(),3000);
}

/* ═══════════════════════════════
   PRODUCTS — curated Type 4 picks
   ─────────────────────────────────
   Each product has: id, cat, name, brand, why, tags, link.
   Categories: Cleanse, Moisture, Style, Sealant, Tools, Protein, Scalp
   The link field uses '#' as placeholder — Amazon affiliate links go here.
═══════════════════════════════ */
const PRODUCTS=[
  {id:'p1',cat:'Cleanse',name:'Black Soap Shampoo',brand:'Alaffia',why:'Sulfate-free, gentle on coils, removes buildup without stripping. African heritage ingredients.',tags:['4B','4C','Sensitive Scalp'],link:'#'},
  {id:'p2',cat:'Cleanse',name:'Curl Clarifying Shampoo',brand:'Mielle Organics',why:'Monthly clarifier that doesn\'t leave hair straw-dry. Essential for hard water areas.',tags:['Hard Water','Buildup'],link:'#'},
  {id:'p3',cat:'Cleanse',name:'Co-Wash Cleansing Conditioner',brand:'As I Am',why:'The original Type 4 co-wash. Cleanses without sulfates, moisturizes while you wash.',tags:['4A','4B','Dry Hair'],link:'#'},
  {id:'p4',cat:'Moisture',name:'Deep Conditioner',brand:'Aunt Jackie\'s "Quench"',why:'Penetrates the cuticle, softens 4C immediately. Affordable and consistent.',tags:['4B','4C','High Porosity'],link:'#'},
  {id:'p5',cat:'Moisture',name:'Hydrate Hair Milk',brand:'Cantu Beauty',why:'Daily leave-in that doesn\'t weigh hair down. Perfect for refresh days.',tags:['4A','4B','Lightweight'],link:'#'},
  {id:'p6',cat:'Moisture',name:'Curling Custard',brand:'Kinky Curly',why:'Holy grail definition without crunch. Plays well with thick coils.',tags:['4B','4C','Defined Styles'],link:'#'},
  {id:'p7',cat:'Style',name:'Mango & Carrot Curling Cream',brand:'Camille Rose',why:'Smells incredible, defines coils with soft hold. Worth the price.',tags:['4A','4B','Coarse'],link:'#'},
  {id:'p8',cat:'Style',name:'Pomade Edge Control',brand:'Eco Style "Black Castor + Flaxseed"',why:'Slicks without flaking. The edge gel that doesn\'t destroy your edges.',tags:['Edges','Slick Styles'],link:'#'},
  {id:'p9',cat:'Sealant',name:'100% Raw Shea Butter',brand:'Better Shea Butter',why:'Unrefined, ivory shea. Single most useful product for ends and winter sealing.',tags:['4C','All Porosity','Heavy Sealant'],link:'#'},
  {id:'p10',cat:'Sealant',name:'Jamaican Black Castor Oil',brand:'Tropic Isle Living',why:'The growth community\'s holy grail. Thick, ash-rich, perfect for scalp + edges.',tags:['Growth','Edges','Scalp'],link:'#'},
  {id:'p11',cat:'Sealant',name:'Cold-Pressed Coconut Oil',brand:'Viva Naturals',why:'Penetrates the shaft (rare for oils). Best as a pre-poo or sealant.',tags:['Pre-poo','Penetrating'],link:'#'},
  {id:'p12',cat:'Protein',name:'Aphogee 2-Min Reconstructor',brand:'Aphogee',why:'Mild protein for monthly maintenance. Strengthens without overload.',tags:['Mild Protein','Monthly'],link:'#'},
  {id:'p13',cat:'Protein',name:'Aphogee 2-Step Treatment',brand:'Aphogee',why:'Strong protein — only for damaged or over-moisturized hair. Use with care.',tags:['Strong Protein','Damaged Hair'],link:'#'},
  {id:'p14',cat:'Tools',name:'Satin-Lined Bonnet',brand:'Grace Eleyae',why:'Non-negotiable. Cotton pillowcases ruin your edges and ends every night you sleep on them.',tags:['Essential','Night'],link:'#'},
  {id:'p15',cat:'Tools',name:'Wide-Tooth Detangling Comb',brand:'Felicia Leatherwood',why:'Designed specifically for kinky-coily textures. Glides through wet hair with conditioner.',tags:['Detangling','Wet Hair'],link:'#'},
  {id:'p16',cat:'Tools',name:'Microfiber Hair Towel',brand:'Aquis',why:'Cuts drying time, reduces frizz. Stop using regular bath towels on your coils.',tags:['Frizz Reduction','Wash Day'],link:'#'},
  {id:'p17',cat:'Tools',name:'Shower Head Filter',brand:'AquaBliss High Output',why:'$30-50 game changer. Removes chlorine and minerals from hard water. Your hair will thank you in 2 weeks.',tags:['Hard Water','Essential'],link:'#'},
  {id:'p18',cat:'Scalp',name:'Rosemary Mint Scalp Oil',brand:'Mielle Organics',why:'The viral product that actually works. Stimulates follicles, smells amazing.',tags:['Growth','Scalp Massage'],link:'#'},
  {id:'p19',cat:'Scalp',name:'Tea Tree Scalp Treatment',brand:'Briogeo "Scalp Revival"',why:'Antifungal, antibacterial. For itchy/flaky scalps that other products can\'t fix.',tags:['Itchy Scalp','Dandruff'],link:'#'},
  {id:'p20',cat:'Scalp',name:'Apple Cider Vinegar',brand:'Bragg Organic Raw',why:'$5 product, works as a clarifying rinse. Removes hard-water mineral buildup.',tags:['Hard Water','Clarify','Cheap'],link:'#'},
];

let _pCat='All';
function renderProducts(){
  const cats=['All','Cleanse','Moisture','Style','Sealant','Protein','Tools','Scalp'];
  document.getElementById('p-cats').innerHTML=cats.map(c=>
    `<button class="ctab${c===_pCat?' on':''}" onclick="setPCat('${c}',this)">${c}</button>`
  ).join('');
  fProducts();
}
function setPCat(c,el){
  _pCat=c;
  document.querySelectorAll('#p-cats .ctab').forEach(b=>b.classList.remove('on'));
  el.classList.add('on');
  fProducts();
}
function fProducts(){
  let list=PRODUCTS;
  if(_pCat!=='All') list=list.filter(p=>p.cat===_pCat);
  const html=list.map((p,i)=>{
    const tagHtml=(p.tags||[]).map(t=>`<span class="chip cd">${esc(t)}</span>`).join(' ');
    const linkBtn=p.link&&p.link!=='#'
      ? `<a href="${esc(p.link)}" target="_blank" rel="noopener" class="btn bg bsm" style="text-decoration:none;display:inline-block">Get it →</a>`
      : `<span class="chip cd" style="opacity:.7">Link coming soon</span>`;
    return `<div class="art ani d${Math.min(i+1,4)}" style="cursor:default">
      <div class="art-cat">${esc(p.cat)} · ${esc(p.brand)}</div>
      <div class="art-t">${esc(p.name)}</div>
      <div class="art-d">${esc(p.why)}</div>
      <div style="margin:10px 0">${tagHtml}</div>
      ${linkBtn}
    </div>`;
  }).join('');
  document.getElementById('p-grid').innerHTML=html||'<div class="empty"><div class="big">🛍️</div>No products in this category yet.</div>';
}

/* ═══════════════════════════════
   INGREDIENT DECODER
   ─────────────────────────────────
   Curated database of common hair-care ingredients with
   verdict (good/caution/avoid) and a Type-4-specific note.
═══════════════════════════════ */
const INGREDIENTS=[
  // Good
  {n:'Glycerin',v:'good',w:'Humectant',d:'Pulls water from the air into your hair. The gold standard for moisture. Works best in moderate-to-high humidity.'},
  {n:'Aloe Vera',v:'good',w:'Humectant',d:'Lightweight, penetrating, soothing. Perfect first layer in LOC method. Helps balance scalp pH.'},
  {n:'Panthenol',v:'good',w:'Vitamin B5',d:'Enters the hair shaft, attracts moisture from inside out. Strengthens without protein overload.'},
  {n:'Shea Butter',v:'good',w:'Sealant',d:'The GOAT of Type 4 sealants. Heavy, protective, perfect for ends and winter. Use unrefined for best results.'},
  {n:'Coconut Oil',v:'good',w:'Penetrating Oil',d:'One of the only oils scientifically proven to penetrate the hair shaft. Some Type 4 hair finds it drying — test first.'},
  {n:'Castor Oil',v:'good',w:'Sealant',d:'Thick, ash-rich, perfect for scalp + edges. JBCO (Jamaican Black) is the growth community holy grail.'},
  {n:'Avocado Oil',v:'good',w:'Penetrating Oil',d:'Rich in oleic acid, penetrates the shaft. Great for thick, coarse coils that resist most oils.'},
  {n:'Argan Oil',v:'good',w:'Lightweight Oil',d:'Light enough for low-porosity hair. Adds shine without weight. Good for daily refresh.'},
  {n:'Jojoba Oil',v:'good',w:'Scalp Oil',d:'Closest match to your natural sebum. Excellent for scalp massage and balance.'},
  {n:'Honey',v:'good',w:'Humectant',d:'Natural humectant + mild lightener. Avoid if you don\'t want subtle color change. Great in deep conditioners.'},
  {n:'Hydrolyzed Wheat Protein',v:'good',w:'Mild Protein',d:'Small molecules that penetrate the shaft. Strengthens damaged hair. Some Type 4 hair is sensitive — test first.'},
  {n:'Cetearyl Alcohol',v:'good',w:'Fatty Alcohol',d:'NOT a drying alcohol. Actually moisturizes and softens. Common base in good conditioners.'},
  {n:'Cetyl Alcohol',v:'good',w:'Fatty Alcohol',d:'Same as above — fatty alcohol that conditions and softens. Don\'t avoid this.'},
  // Caution
  {n:'Behentrimonium Chloride',v:'caution',w:'Detangler',d:'Powerful slip agent but can cause buildup in low-porosity hair. Use occasionally, clarify monthly.'},
  {n:'Polyquaternium',v:'caution',w:'Film-Former',d:'Coats the hair for slip and shine. Builds up over time — needs clarifying shampoo to remove fully.'},
  {n:'Mineral Oil',v:'caution',w:'Petroleum',d:'Sits on top of the hair, prevents moisture from penetrating. Avoid in leave-ins; OK in pre-poo treatments.'},
  {n:'Petrolatum',v:'caution',w:'Petroleum',d:'Same as mineral oil — coats but doesn\'t penetrate. Common in cheap hair greases. Don\'t apply to clean hair.'},
  {n:'Dimethicone',v:'caution',w:'Silicone',d:'Adds shine but requires sulfate shampoo to remove. Build-up causes dryness over time. Use sparingly.'},
  {n:'Fragrance (Parfum)',v:'caution',w:'Unspecified',d:'Could be hundreds of chemicals. If you have a sensitive scalp, avoid. Otherwise, watch for irritation.'},
  // Avoid
  {n:'Sodium Lauryl Sulfate (SLS)',v:'avoid',w:'Harsh Detergent',d:'Strips natural oils, dries Type 4 hair severely. Avoid in everyday shampoo. OK in monthly clarifying shampoo.'},
  {n:'Sodium Laureth Sulfate (SLES)',v:'avoid',w:'Harsh Detergent',d:'Slightly gentler than SLS but still too harsh for daily Type 4 use. Same advice.'},
  {n:'Isopropyl Alcohol',v:'avoid',w:'Drying Alcohol',d:'Severely drying. Causes brittleness and breakage in Type 4 hair. Avoid in all leave-in products.'},
  {n:'Alcohol Denat',v:'avoid',w:'Drying Alcohol',d:'Same as isopropyl — strips moisture. Read your gel labels carefully.'},
  {n:'Propylene Glycol',v:'avoid',w:'Solvent',d:'Common but irritating to many sensitive scalps. Linked to itchy scalp and breakouts.'},
  {n:'Parabens',v:'avoid',w:'Preservative',d:'Endocrine disruptors with potential health concerns. Many brands have switched away. You should too.'},
  {n:'Formaldehyde Releasers',v:'avoid',w:'Preservative',d:'DMDM hydantoin, quaternium-15, imidazolidinyl urea. Linked to hair loss in some women. Avoid.'},
];

// Le décodeur ne dit pas juste "bon" ou "mauvais" — j'ai fait 3 niveaux parce
// que les soins capillaires sont plus nuancés que ça. Une silicone n'est pas
// "interdite", elle demande juste un shampoing clarifiant régulier.
function dSearch(){
  const q=(document.getElementById('dq')?.value||'').toLowerCase().trim();
  const list=document.getElementById('d-results');
  if(!q){
    // Show all by category when search is empty
    const groups={good:[],caution:[],avoid:[]};
    INGREDIENTS.forEach(i=>groups[i.v].push(i));
    list.innerHTML=`
      <div class="slbl" style="color:#2d7a3e;margin:6px 0 8px">✓ Safe & Effective for Type 4</div>
      ${groups.good.map(i=>dCard(i)).join('')}
      <div class="slbl" style="color:#b8702a;margin:18px 0 8px">⚠ Use With Caution</div>
      ${groups.caution.map(i=>dCard(i)).join('')}
      <div class="slbl" style="color:#8b2e2e;margin:18px 0 8px">✗ Avoid in Daily Use</div>
      ${groups.avoid.map(i=>dCard(i)).join('')}
    `;
    return;
  }
  const filtered=INGREDIENTS.filter(i=>
    i.n.toLowerCase().includes(q)||i.w.toLowerCase().includes(q)||i.d.toLowerCase().includes(q)
  );
  if(!filtered.length){
    list.innerHTML=`<div class="empty"><div class="big">🔬</div>No match for "${esc(q)}". Try a shorter or simpler term — or ask the AI for help!</div>`;
    return;
  }
  list.innerHTML=filtered.map(i=>dCard(i)).join('');
}
function dCard(i){
  const colors={good:{bg:'rgba(45,122,62,.08)',bd:'rgba(45,122,62,.25)',c:'#2d7a3e',lbl:'✓ Safe'},
                caution:{bg:'rgba(184,112,42,.08)',bd:'rgba(184,112,42,.3)',c:'#b8702a',lbl:'⚠ Caution'},
                avoid:{bg:'rgba(139,46,46,.08)',bd:'rgba(139,46,46,.3)',c:'#8b2e2e',lbl:'✗ Avoid'}};
  const s=colors[i.v];
  return `<div style="background:${s.bg};border:1px solid ${s.bd};border-radius:14px;padding:14px 16px;margin-bottom:10px">
    <div class="rowb" style="margin-bottom:6px">
      <div style="font-weight:700;font-size:15px;color:var(--ink)">${esc(i.n)}</div>
      <span style="font-size:10.5px;font-weight:700;color:${s.c};letter-spacing:.06em">${s.lbl}</span>
    </div>
    <div style="font-size:11px;color:var(--mu);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px">${esc(i.w)}</div>
    <div style="font-size:13px;color:var(--ink);line-height:1.5">${esc(i.d)}</div>
  </div>`;
}


/* ═══════════════════════════════
   UTILS
═══════════════════════════════ */
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
