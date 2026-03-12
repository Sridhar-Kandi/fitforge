// ═══════════════════════════════════════════════════
// FITFORGE v2 — APP LOGIC
// 6 pages: Today, Calendar (full detail), Food, Medical, Stats, Profile
// Dark/Light toggle, Poppins, full-width, JSONBin sync
// ═══════════════════════════════════════════════════

// ─── STORAGE ───
const STORAGE={binId:null,apiBase:'https://api.jsonbin.io/v3/b',
  async init(){const h=window.location.hash.slice(1);if(h&&h.startsWith('bin-')){this.binId=h.replace('bin-','');return await this.load();}const l=localStorage.getItem('ff_bid');if(l){this.binId=l;window.location.hash='bin-'+l;return await this.load();}return null;},
  async createBin(d){try{const r=await fetch(this.apiBase,{method:'POST',headers:{'Content-Type':'application/json','X-Bin-Private':'false'},body:JSON.stringify(d)});const j=await r.json();if(j.metadata?.id){this.binId=j.metadata.id;window.location.hash='bin-'+this.binId;localStorage.setItem('ff_bid',this.binId);return true;}}catch(e){console.error(e);}return false;},
  async load(){if(!this.binId)return null;try{const r=await fetch(`${this.apiBase}/${this.binId}/latest`);if(!r.ok)return null;return(await r.json()).record||null;}catch(e){return null;}},
  async save(d){localStorage.setItem('ff_data',JSON.stringify(d));if(!this.binId)return await this.createBin(d);try{await fetch(`${this.apiBase}/${this.binId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});return true;}catch(e){return false;}}
};

// ─── STATE ───
let S={profile:{name:'',avatarUrl:'',weight:74,height:175},workoutLog:{},foodLog:{},weightLog:{},notes:{},theme:'dark'};
let curPage='today',selDate=new Date(),calM=new Date().getMonth(),calY=new Date().getFullYear(),saveT=null;
const dk=d=>{const t=d||selDate;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;};
const tdk=()=>dk(new Date());
const dbs=()=>{clearTimeout(saveT);saveT=setTimeout(()=>STORAGE.save(S),1200);};
const esc=s=>String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;');

// ─── THEME ───
function toggleTheme(){S.theme=S.theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',S.theme);dbs();}

// ─── NAV ───
function switchPage(p){curPage=p;document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===p));render();window.scrollTo(0,0);}
function render(){document.getElementById('app').innerHTML=({today:renderToday,calendar:renderCalendar,food:renderFood,medical:renderMedical,progress:renderProgress,profile:renderProfile})[curPage]();}

// ═══════════════════════════════════════
// TODAY
// ═══════════════════════════════════════
function renderToday(){
  const td=new Date(),di=getDayInfo(td),d=tdk(),log=S.workoutLog[d]||{},foods=S.foodLog[d]||[];
  const tc=foods.reduce((s,f)=>s+(f.calories||0),0),tp=foods.reduce((s,f)=>s+(f.protein||0),0);
  let ti=0,done=0;
  if(di?.type==='workout'){ti=di.exercises.length+WARMUP.length+COOLDOWN.length+(di.isLegDay?0:1);done=(log.warmup?WARMUP.length:0)+Object.values(log.exercises||{}).filter(Boolean).length+(log.cardio&&!di.isLegDay?1:0)+(log.cooldown?COOLDOWN.length:0);}
  const pct=ti>0?Math.round(done/ti*100):0;
  const gr=td.getHours()<12?'Good morning':td.getHours()<17?'Good afternoon':'Good evening';
  let h=`<div class="page active">`;
  h+=`<div class="flex-between mb-16"><div><div class="text-sm text-muted">${gr}</div><div class="section-title" style="margin:0;">${esc(S.profile.name||'Warrior')} \u{1F4AA}</div></div><div class="flex gap-8"><div class="theme-toggle" onclick="toggleTheme()" title="Toggle theme"></div><div class="avatar-wrapper" style="width:44px;height:44px;margin:0;border-width:2px;" onclick="switchPage('profile')">${S.profile.avatarUrl?`<img src="${S.profile.avatarUrl}">`:`<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}</div></div></div>`;
  h+=`<div class="stat-grid"><div class="stat-card"><div class="stat-val" style="color:var(--green);">${pct}%</div><div class="stat-label">Complete</div></div><div class="stat-card"><div class="stat-val" style="color:var(--orange);">${tc}</div><div class="stat-label">Calories</div></div><div class="stat-card"><div class="stat-val" style="color:var(--blue);">${tp}g</div><div class="stat-label">Protein</div></div><div class="stat-card"><div class="stat-val" style="color:var(--purple);">Wk ${di?di.weekNum:'-'}</div><div class="stat-label">${di?di.phase.name.split('(')[0].trim():'Off Plan'}</div></div></div>`;
  if(!di){h+=`<div class="empty-state"><div class="e-icon">\u{1F4CB}</div><p>No workout today or outside plan range (Mar 10 - Jun 2, 2026).</p></div>`;}
  else if(di.type==='workout'){
    h+=`<div class="tip tip-blue mb-12"><b>${di.phase.name}:</b> ${di.phase.tip}</div>`;
    h+=`<div class="card flex gap-8" style="border-left:3px solid ${di.color};padding:14px 16px;"><span style="font-size:1.4rem;">${di.icon}</span><div><div class="fw-700">${di.label}</div><div class="text-xs text-muted">${di.sub}</div></div></div>`;
    h+=buildAcc('\u{1F525} Warm-Up (12-15 min)','wu',bulkList(WARMUP,d,log,'warmup','Warm-Up'),log.warmup);
    h+=`<div class="sub-title mt-12">${di.icon} Main Workout</div>`;
    di.exercises.forEach(ex=>{const dn=log.exercises?.[ex.name];h+=exRow(ex,dn,d,di.key);});
    if(!di.isLegDay){const c=getCardio(di.key,di.weekNum);h+=buildAcc(`\u{1F3C3} Cardio \u2014 ${c.name} (${c.duration})`,'cd',cardioBlock(c,d,log),log.cardio);}
    else{h+=`<div class="tip tip-green mt-12"><b>No cardio today (Leg Day).</b> Extra core work is included in the exercises above instead. Your legs need all available recovery for muscle growth.</div>`;}
    h+=buildAcc('\u{1F9CA} Cool-Down & Stretching (10 min)','cd2',bulkList(COOLDOWN,d,log,'cooldown','Stretching'),log.cooldown);
  }else{
    h+=`<div class="card" style="border-left:3px solid ${di.color};"><div class="flex gap-8 mb-8"><span style="font-size:1.3rem;">${di.icon}</span><div class="fw-700">${di.label}</div></div>${di.activities.map(a=>`<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.84rem;display:flex;gap:8px;"><span style="color:${di.color};">\u2022</span><span>${a}</span></div>`).join('')}</div>`;
  }
  h+=`<div class="flex-between mt-20 mb-8"><div class="sub-title" style="margin:0;">Today's Food</div><button class="btn btn-sm btn-primary" onclick="openFoodModal()">+ Log</button></div>`;
  if(!foods.length)h+=`<div class="card text-center text-muted text-sm" style="padding:24px;">No food logged. Tap + to add.</div>`;
  else{h+=`<div class="card" style="padding:8px 14px;">`;foods.forEach((f,i)=>{const cat=FOOD_CATEGORIES.find(c=>c.id===f.type)||FOOD_CATEGORIES[0];h+=`<div class="food-entry"><div class="food-icon" style="background:${cat.color}18;">${cat.icon}</div><div class="food-info"><div class="food-name">${esc(f.name)}</div><div class="food-meta">${f.time||''} \u00B7 P:${f.protein||0}g C:${f.carbs||0}g F:${f.fat||0}g</div></div><div class="food-cals">${f.calories||0}</div><button class="del-btn" onclick="delFood('${d}',${i})"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>`;});h+=`</div>`;}
  return h+`</div>`;
}

// ═══════════════════════════════════════
// CALENDAR (now shows FULL workout detail for selected date)
// ═══════════════════════════════════════
function renderCalendar(){
  const ms=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dns=["Mo","Tu","We","Th","Fr","Sa","Su"];
  const fd=new Date(calY,calM,1);let sd=fd.getDay();sd=sd===0?6:sd-1;
  const dim=new Date(calY,calM+1,0).getDate(),td=tdk();
  let h=`<div class="page active"><div class="flex-between mb-16"><div class="section-title" style="margin:0;">Calendar</div><div class="theme-toggle" onclick="toggleTheme()"></div></div>`;
  h+=`<div class="flex-between mb-12"><button class="btn btn-sm btn-outline" onclick="calM--;if(calM<0){calM=11;calY--;}render();">\u2039</button><span class="fw-700">${ms[calM]} ${calY}</span><button class="btn btn-sm btn-outline" onclick="calM++;if(calM>11){calM=0;calY++;}render();">\u203A</button></div>`;
  h+=`<div class="mini-cal">`;dns.forEach(d=>{h+=`<div class="mini-cal-day mini-cal-head">${d}</div>`;});
  for(let i=0;i<sd;i++)h+=`<div class="mini-cal-day"></div>`;
  for(let d=1;d<=dim;d++){const dt=new Date(calY,calM,d),k=dk(dt),isT=k===td,isS=k===dk(selDate),hasL=S.workoutLog[k]&&Object.values(S.workoutLog[k].exercises||{}).filter(Boolean).length>0;
    h+=`<div class="mini-cal-day ${isT?'today':''} ${isS?'selected':''} ${hasL?'has-workout':''}" onclick="selDate=new Date(${calY},${calM},${d});render();">${d}</div>`;}
  h+=`</div>`;

  // ── FULL DETAIL FOR SELECTED DATE ──
  const si=getDayInfo(selDate),sd2=dk(selDate),sl=S.workoutLog[sd2]||{},sf=S.foodLog[sd2]||[];
  const dstr=selDate.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  h+=`<div class="divider"></div>`;
  h+=`<div class="text-xs text-dim mb-8">${dstr}</div>`;

  if(!si){h+=`<div class="card text-center text-muted">No plan for this date.</div>`;}
  else if(si.type==='workout'){
    h+=`<div class="card flex gap-8 mb-12" style="border-left:3px solid ${si.color};padding:14px 16px;"><span style="font-size:1.3rem;">${si.icon}</span><div><div class="fw-700">${si.label}</div><div class="text-xs text-muted">${si.sub} \u00B7 Week ${si.weekNum} \u00B7 ${si.phase.name}</div></div></div>`;
    // Warm-up
    h+=buildAcc('\u{1F525} Warm-Up','cwu',bulkList(WARMUP,sd2,sl,'warmup','Warm-Up'),sl.warmup);
    // Exercises
    h+=`<div class="sub-title mt-12">${si.icon} Exercises</div>`;
    si.exercises.forEach(ex=>{const dn=sl.exercises?.[ex.name];h+=exRow(ex,dn,sd2,si.key);});
    // Cardio or no-cardio note
    if(!si.isLegDay){const c=getCardio(si.key,si.weekNum);h+=buildAcc(`\u{1F3C3} Cardio \u2014 ${c.name}`,'ccd',cardioBlock(c,sd2,sl),sl.cardio);}
    else{h+=`<div class="tip tip-green mt-12"><b>No cardio on Leg Days.</b> Extra core/plank work is in the exercises above.</div>`;}
    // Cooldown
    h+=buildAcc('\u{1F9CA} Stretching','ccd2',bulkList(COOLDOWN,sd2,sl,'cooldown','Stretching'),sl.cooldown);
  }else{
    h+=`<div class="card" style="border-left:3px solid ${si.color};"><div class="flex gap-8 mb-8"><span style="font-size:1.3rem;">${si.icon}</span><div class="fw-700">${si.label}</div></div>${si.activities.map(a=>`<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.84rem;"><span style="color:${si.color};">\u2022</span> ${a}</div>`).join('')}</div>`;
  }
  if(sf.length){h+=`<div class="sub-title mt-12">Food Log</div><div class="card" style="padding:8px 14px;">`;sf.forEach(f=>{const cat=FOOD_CATEGORIES.find(c=>c.id===f.type)||FOOD_CATEGORIES[0];h+=`<div class="food-entry"><div class="food-icon" style="background:${cat.color}18;">${cat.icon}</div><div class="food-info"><div class="food-name">${esc(f.name)}</div><div class="food-meta">P:${f.protein||0}g C:${f.carbs||0}g F:${f.fat||0}g</div></div><div class="food-cals">${f.calories||0}</div></div>`;});h+=`</div>`;}
  return h+`</div>`;
}

// ═══════════════════════════════════════
// FOOD
// ═══════════════════════════════════════
function renderFood(){
  const d=tdk(),foods=S.foodLog[d]||[],tc=foods.reduce((s,f)=>s+(f.calories||0),0),tp=foods.reduce((s,f)=>s+(f.protein||0),0),tca=foods.reduce((s,f)=>s+(f.carbs||0),0),tf=foods.reduce((s,f)=>s+(f.fat||0),0);
  const isTr=getDayInfo(new Date())?.type==='workout',calT=isTr?2250:1950;
  let h=`<div class="page active"><div class="flex-between mb-16"><div class="section-title" style="margin:0;">Nutrition</div><button class="btn btn-primary" onclick="openFoodModal()">+ Log Food</button></div>`;
  h+=`<div class="card"><div class="text-xs text-dim mb-8">${isTr?'TRAINING':'REST'} DAY \u00B7 Target ~${calT} kcal</div><div class="stat-grid" style="margin-bottom:8px;"><div style="text-align:center;"><div class="fw-700" style="font-size:1.5rem;color:var(--orange);">${tc}<span class="text-xs text-dim">/${calT}</span></div><div class="text-xs text-dim">Calories</div></div><div style="text-align:center;"><div class="fw-700" style="font-size:1.5rem;color:var(--blue);">${tp}g<span class="text-xs text-dim">/150g</span></div><div class="text-xs text-dim">Protein</div></div></div><div class="flex gap-8" style="justify-content:center;"><span class="tag tag-orange">Carbs: ${tca}g</span><span class="tag tag-purple">Fat: ${tf}g</span></div><div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100,tc/calT*100)}%;background:${tc>calT?'var(--red)':'linear-gradient(90deg,var(--green),var(--blue))'};"></div></div></div>`;
  const jk=foods.filter(f=>f.type==='junk').length;
  if(jk)h+=`<div class="tip tip-red mb-12"><b>Heads up:</b> ${jk} junk item${jk>1?'s':''} today. Balance with extra protein next meal.</div>`;
  if(!foods.length)h+=`<div class="empty-state"><div class="e-icon">\u{1F37D}\u{FE0F}</div><p>No food logged. Tap + or use Quick Add.</p></div>`;
  else{h+=`<div class="card" style="padding:8px 14px;">`;foods.forEach((f,i)=>{const cat=FOOD_CATEGORIES.find(c=>c.id===f.type)||FOOD_CATEGORIES[0];h+=`<div class="food-entry"><div class="food-icon" style="background:${cat.color}18;">${cat.icon}</div><div class="food-info"><div class="food-name">${esc(f.name)}</div><div class="food-meta">${f.time||''} \u00B7 P:${f.protein||0}g C:${f.carbs||0}g F:${f.fat||0}g${f.notes?' \u00B7 '+esc(f.notes):''}</div></div><div style="text-align:right;"><div class="food-cals">${f.calories||0}</div><button class="del-btn" onclick="delFood('${d}',${i})"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div></div>`;});h+=`</div>`;}
  h+=`<div class="sub-title mt-20">Quick Add</div><div class="quick-grid">`;
  QUICK_FOODS.forEach(f=>{const cat=FOOD_CATEGORIES.find(c=>c.id===f.type);h+=`<button class="btn btn-sm btn-outline" onclick='qAdd(${JSON.stringify(f)})'>${cat?cat.icon:''} ${f.name}</button>`;});
  return h+`</div></div>`;
}

// ═══════════════════════════════════════
// MEDICAL PAGE (NEW)
// ═══════════════════════════════════════
function renderMedical(){
  let h=`<div class="page active"><div class="flex-between mb-16"><div class="section-title" style="margin:0;">Medical & Posture</div><div class="theme-toggle" onclick="toggleTheme()"></div></div>`;
  h+=`<div class="tip tip-red mb-16"><b>Important:</b> Please see an Orthop\u00E4de for your radiating neck pain. Your Hausarzt can refer you. A cervical MRI may be warranted.</div>`;
  MEDICAL_CONDITIONS.forEach(mc=>{
    h+=`<div class="card med-card mb-16" style="border-left-color:${mc.color};">`;
    h+=`<div class="flex gap-8 mb-12"><span style="font-size:1.5rem;">${mc.icon}</span><div><div class="fw-700" style="font-size:1.05rem;">${mc.name}</div></div></div>`;
    // What
    h+=buildAcc(`What Is This?`,`med-what-${mc.name.slice(0,4)}`,`<p class="text-sm text-muted" style="line-height:1.6;">${mc.what}</p><div class="divider"></div><p class="text-sm text-muted" style="line-height:1.6;"><b style="color:var(--text);">Causes:</b> ${mc.causes}</p>`,false);
    // Symptoms
    if(mc.symptoms?.length)h+=buildAcc(`Symptoms`,`med-sym-${mc.name.slice(0,4)}`,mc.symptoms.map(s=>`<div class="med-item">\u26A0\u{FE0F} ${s}</div>`).join(''),false);
    // Avoid
    if(mc.avoid?.length)h+=buildAcc(`\u{274C} Movements & Things to AVOID`,`med-av-${mc.name.slice(0,4)}`,mc.avoid.map(a=>`<div class="med-item" style="color:var(--red);">\u{1F6AB} ${a}</div>`).join(''),false);
    // Do instead
    if(mc.doInstead?.length)h+=buildAcc(`\u2705 Safe Alternatives`,`med-do-${mc.name.slice(0,4)}`,mc.doInstead.map(d=>`<div class="med-item" style="color:var(--green);">\u2713 ${d}</div>`).join(''),false);
    // Exercises in plan
    if(mc.exercisesInPlan?.length)h+=buildAcc(`\u{1F3CB}\u{FE0F} How Your Plan Fixes This`,`med-ex-${mc.name.slice(0,4)}`,mc.exercisesInPlan.map(e=>`<div class="med-item">\u{1F4AA} ${e}</div>`).join(''),false);
    // Daily tips
    if(mc.dailyTips?.length)h+=buildAcc(`\u{1F4A1} Daily Life Tips`,`med-tip-${mc.name.slice(0,4)}`,mc.dailyTips.map(t=>`<div class="med-item">\u{1F4CC} ${t}</div>`).join(''),false);
    h+=`</div>`;
  });
  return h+`</div>`;
}

// ═══════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════
function renderProgress(){
  const td=new Date();let streak=0;
  for(let i=0;i<84;i++){const d=new Date(td);d.setDate(d.getDate()-i);const inf=getDayInfo(d);if(inf?.type==='workout'){const l=S.workoutLog[dk(d)];if(l&&Object.values(l.exercises||{}).filter(Boolean).length>0)streak++;else break;}}
  const tw=Object.keys(S.workoutLog).filter(k=>{const l=S.workoutLog[k];return l&&Object.values(l.exercises||{}).filter(Boolean).length>0;}).length;
  let te=0;Object.values(S.workoutLog).forEach(l=>{te+=Object.values(l.exercises||{}).filter(Boolean).length;});
  let jw=0;for(let i=0;i<7;i++){const d=new Date(td);d.setDate(d.getDate()-i);jw+=(S.foodLog[dk(d)]||[]).filter(f=>f.type==='junk').length;}
  let h=`<div class="page active"><div class="section-title">Progress</div>`;
  h+=`<div class="stat-grid"><div class="stat-card"><div class="stat-val" style="color:var(--green);">\u{1F525} ${streak}</div><div class="stat-label">Streak</div></div><div class="stat-card"><div class="stat-val" style="color:var(--blue);">${tw}</div><div class="stat-label">Sessions</div></div><div class="stat-card"><div class="stat-val" style="color:var(--orange);">${te}</div><div class="stat-label">Exercises</div></div><div class="stat-card"><div class="stat-val" style="color:${jw>3?'var(--red)':'var(--green)'};">${jw}</div><div class="stat-label">Junk/Week</div></div></div>`;
  h+=`<div class="sub-title mt-16">Weight Tracker</div><div class="card"><div class="flex gap-8 mb-8"><input class="input" type="number" step="0.1" placeholder="Today's weight (kg)" id="wI" style="flex:1;"><button class="btn btn-primary btn-sm" onclick="logW()">Log</button></div>`;
  const we=Object.entries(S.weightLog).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,14);
  if(we.length)we.forEach(([k,w])=>{const d=new Date(k+'T00:00:00');h+=`<div class="flex-between" style="padding:5px 0;border-bottom:1px solid var(--border);"><span class="text-sm">${d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span><span class="fw-600">${w} kg</span></div>`;});
  else h+=`<div class="text-sm text-muted text-center">No weight logged yet.</div>`;
  h+=`</div>`;
  h+=`<div class="sub-title mt-16">Today's Notes</div><div class="card"><textarea class="input" placeholder="How did you feel? Energy? Pain?..." rows="3" onchange="S.notes[tdk()]=this.value;dbs();">${esc(S.notes[tdk()]||'')}</textarea></div>`;
  h+=`<div class="sub-title mt-16">Last 4 Weeks</div><div class="card" style="padding:12px;">`;
  for(let w=3;w>=0;w--){h+=`<div class="flex gap-6 mb-8" style="justify-content:center;">`;for(let d=0;d<7;d++){const dt=new Date(td);dt.setDate(dt.getDate()-(w*7+6-d));const k=dk(dt),l=S.workoutLog[k],ed=l?Object.values(l.exercises||{}).filter(Boolean).length:0,inf=getDayInfo(dt),mx=(inf?.exercises)?inf.exercises.length:1,pct=(inf?.type==='workout')?ed/mx:0;const clr=pct>=0.8?'var(--green)':pct>=0.4?'var(--orange)':pct>0?'var(--yellow)':'var(--surface2)';h+=`<div class="heat-cell" style="background:${clr};color:${pct>0?'#fff':'var(--text3)'};">${dt.getDate()}</div>`;}h+=`</div>`;}
  h+=`<div class="flex gap-8 mt-8" style="justify-content:center;"><span class="text-xs text-dim flex gap-4"><span style="width:10px;height:10px;border-radius:3px;background:var(--green);"></span>80%+</span><span class="text-xs text-dim flex gap-4"><span style="width:10px;height:10px;border-radius:3px;background:var(--orange);"></span>40%+</span><span class="text-xs text-dim flex gap-4"><span style="width:10px;height:10px;border-radius:3px;background:var(--surface2);"></span>None</span></div></div></div>`;
  return h;
}

// ═══════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════
function renderProfile(){
  let h=`<div class="page active"><div class="section-title text-center">Profile</div>`;
  h+=`<div class="text-center mb-16"><div class="avatar-wrapper" onclick="document.getElementById('avI').click();">${S.profile.avatarUrl?`<img src="${S.profile.avatarUrl}">`:`<svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}<div class="cam-overlay"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div></div><input type="file" accept="image/*" class="hidden-input" id="avI" onchange="upAv(this)"><div class="text-xs text-muted">Tap to upload photo</div></div>`;
  h+=`<div class="card"><div class="label">Your Name</div><input class="input" type="text" value="${esc(S.profile.name)}" placeholder="Enter your name" onchange="S.profile.name=this.value;dbs();"></div>`;
  h+=`<div class="card"><div class="label">Body Stats</div><div class="flex gap-8"><div style="flex:1;"><div class="text-xs text-dim mb-6">Weight (kg)</div><input class="input" type="number" value="${S.profile.weight||''}" onchange="S.profile.weight=parseFloat(this.value);dbs();"></div><div style="flex:1;"><div class="text-xs text-dim mb-6">Height (cm)</div><input class="input" type="number" value="${S.profile.height||''}" onchange="S.profile.height=parseFloat(this.value);dbs();"></div></div></div>`;
  h+=`<div class="card"><div class="label">Theme</div><div class="flex-between"><span class="text-sm">Dark / Light Mode</span><div class="theme-toggle" onclick="toggleTheme()"></div></div></div>`;
  h+=`<div class="card"><div class="label">Cloud Sync</div><div class="text-sm text-muted mb-8">Data auto-syncs. Bookmark this URL or copy it to access from any device.</div><div class="text-xs text-dim mb-8" style="word-break:break-all;">${window.location.href}</div><button class="btn btn-sm btn-outline btn-block" onclick="navigator.clipboard.writeText(window.location.href).then(()=>{this.textContent='\u2713 Copied!';setTimeout(()=>{this.textContent='Copy Sync URL'},2e3);})">Copy Sync URL</button></div>`;
  h+=`<div class="card"><div class="label">Your Plan</div><div class="text-sm mb-8">6-Day PPL x2 \u00B7 Push-Legs-Pull repeated twice per week</div><div class="text-xs text-dim">Tue: Push A \u00B7 Wed: Legs A \u00B7 Thu: Pull A</div><div class="text-xs text-dim">Fri: Push B \u00B7 Sat: Legs B \u00B7 Sun: Pull B \u00B7 Mon: Rest</div><div class="text-xs text-dim mt-8">Plan: March 10 - June 2, 2026</div><div class="tip tip-red mt-8"><b>Medical:</b> L4-L5 disc bulge + cervical spine. All exercises spine-safe. No RDL. No cardio on leg days. See Medical tab for full details.</div></div>`;
  h+=`<div class="card" style="border-color:rgba(248,113,113,0.2);"><div class="label" style="color:var(--red);">Danger Zone</div><button class="btn btn-sm btn-danger btn-block" onclick="if(confirm('Reset ALL data?')){S={profile:{name:'',avatarUrl:'',weight:74,height:175},workoutLog:{},foodLog:{},weightLog:{},notes:{},theme:S.theme};STORAGE.save(S);render();}">Reset All Data</button></div></div>`;
  return h;
}

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
function buildAcc(title,id,content,isDone){
  return `<div class="acc mt-12"><div class="acc-head" onclick="togAcc('${id}')"><div class="acc-head-left"><span class="acc-head-title">${title}</span>${isDone?'<span class="tag tag-green" style="margin-left:6px;">\u2713</span>':''}</div><div class="acc-chevron" id="ch-${id}"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 9l6 6 6-6"/></svg></div></div><div class="acc-body" id="bd-${id}">${content}</div></div>`;
}
function bulkList(items,dk2,log,field,label){
  let h=`<div style="margin-bottom:10px;"><button class="btn btn-sm ${log[field]?'btn-green':'btn-primary'} btn-block" onclick="togBulk('${dk2}','${field}')">${log[field]?'\u2713 '+label+' Complete':'Mark All '+label+' Done'}</button></div>`;
  items.forEach(it=>{const d=JSON.stringify({name:it.name,sets:it.detail||'',tempo:'\u2014',rest:'\u2014',muscles:it.muscles||'Flexibility',howTo:it.howTo,safety:it.safety||''});h+=`<div class="check-row" style="padding:8px 4px;" onclick='showEx(${d.replace(/'/g,"&#39;")})'><span style="width:6px;height:6px;border-radius:50%;background:var(--orange);flex-shrink:0;"></span><div class="check-info"><div class="check-name" style="font-size:0.82rem;">${it.name}</div><div class="check-detail">${it.detail}</div></div><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" stroke-width="2"><path stroke-linecap="round" d="M9 18l6-6-6-6"/></svg></div>`;});
  return h;
}
function exRow(ex,done,dk2,wkey){
  return `<div class="check-row" onclick="togEx('${dk2}','${esc(ex.name)}')"><div class="check-box ${done?'checked':''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" d="M5 13l4 4L19 7"/></svg></div><div class="check-info" onclick="event.stopPropagation();showExByName('${esc(ex.name)}','${wkey}')"><div class="check-name ${done?'done':''}">${ex.name}</div><div class="check-detail">${ex.sets} \u00B7 ${ex.tempo} \u00B7 ${ex.rest}</div></div><button class="btn btn-sm btn-outline" style="padding:4px 8px;" onclick="event.stopPropagation();showExByName('${esc(ex.name)}','${wkey}')"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></button></div>`;
}
function cardioBlock(c,dk2,log){
  let h=`<div class="flex-between mb-10"><div class="flex gap-6"><span class="tag tag-purple">\u23F1 ${c.duration}</span><span class="tag tag-red">\u2665 ${c.hr}</span></div><button class="btn btn-sm ${log.cardio?'btn-green':'btn-primary'}" onclick="togBulk('${dk2}','cardio')">${log.cardio?'\u2713 Done':'Mark Done'}</button></div>`;
  c.steps.forEach(s=>{h+=`<div style="padding:7px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;"><div><div class="fw-600 text-sm">${s.phase}</div><div class="text-xs text-dim">${s.time}</div></div><div class="flex gap-4"><span class="tag tag-cyan">${s.speed}</span><span class="tag tag-green">\u26F0 ${s.incline}</span></div></div>`;});
  h+=`<div class="tip tip-green mt-8"><b>Tip:</b> ${c.tip}</div>`;
  h+=`<div class="tip tip-red"><b>Spine:</b> Do NOT run. Incline walk = same burn, zero L4-L5 impact. No rails.</div>`;
  return h;
}

// ═══════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════
function togEx(dk2,nm){if(!S.workoutLog[dk2])S.workoutLog[dk2]={exercises:{}};if(!S.workoutLog[dk2].exercises)S.workoutLog[dk2].exercises={};S.workoutLog[dk2].exercises[nm]=!S.workoutLog[dk2].exercises[nm];dbs();render();}
function togBulk(dk2,f){if(!S.workoutLog[dk2])S.workoutLog[dk2]={exercises:{}};S.workoutLog[dk2][f]=!S.workoutLog[dk2][f];dbs();render();}
function togAcc(id){const b=document.getElementById('bd-'+id),c=document.getElementById('ch-'+id);if(b)b.classList.toggle('open');if(c)c.classList.toggle('open');}
function showExByName(nm,wk){const ex=EXERCISES[wk]?.find(e=>e.name===nm);if(ex)showEx(ex);}
function showEx(ex){
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" onclick="if(event.target===this)closeM();"><div class="modal"><div class="modal-bar"></div><div class="flex-between mb-12"><h3 style="margin:0;">${ex.name}</h3><button onclick="closeM()" style="padding:6px;"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M18 6L6 18M6 6l12 12"/></svg></button></div><div class="flex gap-6 flex-wrap mb-12"><span class="tag tag-blue">${ex.sets}</span><span class="tag tag-purple">Tempo ${ex.tempo}</span><span class="tag tag-orange">Rest ${ex.rest}</span></div>${ex.muscles?`<div class="ex-detail-section"><h4>\u{1F4AA} Muscles</h4><p>${ex.muscles}</p></div>`:''}<div class="ex-detail-section"><h4>\u{1F4D6} How To Perform</h4><p>${ex.howTo}</p></div>${ex.safety?`<div class="tip tip-red"><b>\u26A0\u{FE0F} Safety:</b> ${ex.safety}</div>`:''}</div></div>`);
}
function openFoodModal(){
  const now=new Date().toTimeString().slice(0,5);
  document.body.insertAdjacentHTML('beforeend',`<div class="modal-overlay" onclick="if(event.target===this)closeM();"><div class="modal"><div class="modal-bar"></div><h3>Log Food</h3><div class="label mt-8">Food Name</div><input class="input mb-8" type="text" id="fN" placeholder="e.g., Paneer Tikka..."><div class="label">Category</div><div class="flex gap-6 flex-wrap mb-8">${FOOD_CATEGORIES.map(c=>`<button class="btn btn-sm btn-outline fc" data-cat="${c.id}" onclick="selC('${c.id}')">${c.icon} ${c.label}</button>`).join('')}</div><input type="hidden" id="fCt" value="healthy"><div class="label">Time</div><input class="input mb-8" type="time" id="fTm" value="${now}"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" class="mb-8"><div><div class="text-xs text-dim mb-6">Calories</div><input class="input" type="number" id="fCl" placeholder="kcal"></div><div><div class="text-xs text-dim mb-6">Protein (g)</div><input class="input" type="number" id="fP" placeholder="g"></div><div><div class="text-xs text-dim mb-6">Carbs (g)</div><input class="input" type="number" id="fCa" placeholder="g"></div><div><div class="text-xs text-dim mb-6">Fat (g)</div><input class="input" type="number" id="fFt" placeholder="g"></div></div><div class="label">Notes</div><input class="input mb-12" type="text" id="fNo" placeholder="optional..."><button class="btn btn-primary btn-block" onclick="addF()">Add to Log</button></div></div>`);
}
function selC(id){document.getElementById('fCt').value=id;document.querySelectorAll('.fc').forEach(b=>{const c=FOOD_CATEGORIES.find(x=>x.id===b.dataset.cat);b.style.borderColor=b.dataset.cat===id?c.color:'';b.style.background=b.dataset.cat===id?c.color+'18':'';});}
function addF(){const d=tdk();if(!S.foodLog[d])S.foodLog[d]=[];S.foodLog[d].push({name:document.getElementById('fN').value||'Unnamed',type:document.getElementById('fCt').value,time:document.getElementById('fTm').value,calories:parseInt(document.getElementById('fCl').value)||0,protein:parseInt(document.getElementById('fP').value)||0,carbs:parseInt(document.getElementById('fCa').value)||0,fat:parseInt(document.getElementById('fFt').value)||0,notes:document.getElementById('fNo').value});dbs();closeM();render();}
function qAdd(f){const d=tdk();if(!S.foodLog[d])S.foodLog[d]=[];S.foodLog[d].push({...f,time:new Date().toTimeString().slice(0,5),notes:''});dbs();render();}
function delFood(d,i){if(S.foodLog[d]){S.foodLog[d].splice(i,1);dbs();render();}}
function logW(){const w=parseFloat(document.getElementById('wI')?.value);if(w>0){S.weightLog[tdk()]=w;dbs();render();}}
function upAv(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=200;c.height=200;const ctx=c.getContext('2d');const m=Math.min(img.width,img.height);ctx.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,200,200);S.profile.avatarUrl=c.toDataURL('image/jpeg',0.7);dbs();render();};img.src=e.target.result;};r.readAsDataURL(f);}
function closeM(){document.querySelector('.modal-overlay')?.remove();}

// ─── INIT ───
async function init(){
  const cloud=await STORAGE.init();
  if(cloud)S={...S,...cloud};
  else{const l=localStorage.getItem('ff_data');if(l)try{S={...S,...JSON.parse(l)};}catch(e){}await STORAGE.createBin(S);}
  document.documentElement.setAttribute('data-theme',S.theme||'dark');
  render();
}
init();
