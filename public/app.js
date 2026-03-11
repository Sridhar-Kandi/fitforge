// ═══════════════════════════════════════════════════
// FITFORGE — APPLICATION LOGIC
// Storage: JSONBin.io (free, cross-device sync)
// ═══════════════════════════════════════════════════

// ─── CLOUD STORAGE ENGINE ───
const STORAGE = {
  binId: null,
  apiBase: 'https://api.jsonbin.io/v3/b',

  async init() {
    const hash = window.location.hash.slice(1);
    if (hash && hash.startsWith('bin-')) {
      this.binId = hash.replace('bin-', '');
      return await this.load();
    }
    const localId = localStorage.getItem('fitforge_bin_id');
    if (localId) {
      this.binId = localId;
      window.location.hash = 'bin-' + localId;
      return await this.load();
    }
    return null;
  },

  async createBin(data) {
    try {
      const res = await fetch(this.apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Bin-Private': 'false' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.metadata && json.metadata.id) {
        this.binId = json.metadata.id;
        window.location.hash = 'bin-' + this.binId;
        localStorage.setItem('fitforge_bin_id', this.binId);
        return true;
      }
    } catch (e) { console.error('Create bin error:', e); }
    return false;
  },

  async load() {
    if (!this.binId) return null;
    try {
      const res = await fetch(`${this.apiBase}/${this.binId}/latest`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.record || null;
    } catch (e) {
      console.error('Load error:', e);
      return null;
    }
  },

  async save(data) {
    // Always save locally first as fallback
    localStorage.setItem('fitforge_data', JSON.stringify(data));
    if (!this.binId) return await this.createBin(data);
    try {
      await fetch(`${this.apiBase}/${this.binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return true;
    } catch (e) {
      console.error('Cloud save error (saved locally):', e);
      return false;
    }
  }
};

// ─── APP STATE ───
let STATE = {
  profile: { name: '', avatarUrl: '', weight: 74, height: 175 },
  workoutLog: {},
  foodLog: {},
  weightLog: {},
  notes: {},
};

let currentPage = 'today';
let selectedDate = new Date();
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();
let saveTimeout = null;

// ─── UTILITIES ───
function dateKey(d) {
  const dt = d || selectedDate;
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}
function todayKey() { return dateKey(new Date()); }
function debounceAutoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => STORAGE.save(STATE), 1200);
}
function esc(s) { return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;'); }

// ─── PAGE SWITCHING ───
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  render();
  window.scrollTo(0, 0);
}

function render() {
  const app = document.getElementById('app');
  switch (currentPage) {
    case 'today': app.innerHTML = renderToday(); break;
    case 'calendar': app.innerHTML = renderCalendar(); break;
    case 'food': app.innerHTML = renderFood(); break;
    case 'progress': app.innerHTML = renderProgress(); break;
    case 'profile': app.innerHTML = renderProfile(); break;
  }
}

// ═══════════════════════════════════════
// TODAY PAGE
// ═══════════════════════════════════════
function renderToday() {
  const today = new Date();
  const dayInfo = getDayInfo(today);
  const dk = todayKey();
  const log = STATE.workoutLog[dk] || {};
  const foods = STATE.foodLog[dk] || [];
  const totalCals = foods.reduce((s, f) => s + (f.calories || 0), 0);
  const totalProtein = foods.reduce((s, f) => s + (f.protein || 0), 0);

  let totalItems = 0, doneItems = 0;
  if (dayInfo && dayInfo.type === 'workout') {
    totalItems = dayInfo.exercises.length + WARMUP.length + COOLDOWN.length + 1;
    doneItems = (log.warmup ? WARMUP.length : 0)
      + Object.values(log.exercises || {}).filter(Boolean).length
      + (log.cardio ? 1 : 0)
      + (log.cooldown ? COOLDOWN.length : 0);
  }
  const pct = totalItems > 0 ? Math.round(doneItems / totalItems * 100) : 0;
  const hr = today.getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const name = STATE.profile.name || 'Warrior';

  let h = `<div class="page active">`;

  // Header
  h += `<div class="flex-between mb-16">
    <div>
      <div class="text-sm text-muted">${greeting}</div>
      <div class="section-title" style="margin-bottom:0;">${esc(name)} \u{1F4AA}</div>
    </div>
    <div class="avatar-wrapper" style="width:48px;height:48px;margin:0;border-width:2px;" onclick="switchPage('profile')">
      ${STATE.profile.avatarUrl ? `<img src="${STATE.profile.avatarUrl}" alt="">` : `<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
    </div>
  </div>`;

  // Stats
  h += `<div class="stat-grid">
    <div class="stat-card"><div class="stat-val" style="color:var(--green);">${pct}%</div><div class="stat-label">Workout Done</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--orange);">${totalCals}</div><div class="stat-label">Calories</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--blue);">${totalProtein}g</div><div class="stat-label">Protein</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--purple);">Wk ${dayInfo ? dayInfo.weekNum : '-'}</div><div class="stat-label">${dayInfo ? dayInfo.phase.name.split('(')[0].trim() : 'No Plan'}</div></div>
  </div>`;

  if (!dayInfo) {
    h += `<div class="empty-state"><div class="e-icon">\u{1F4CB}</div><p>No workout scheduled today or outside your 12-week plan range (Mar 10 - Jun 2, 2026).</p></div>`;
  } else if (dayInfo.type === 'workout') {
    h += `<div class="tip tip-blue mb-12"><b>${dayInfo.phase.name}:</b> ${dayInfo.phase.tip}</div>`;
    h += `<div class="card flex gap-8 mb-12" style="border-left:3px solid ${dayInfo.color};padding:14px 16px;">
      <span style="font-size:1.4rem;">${dayInfo.icon}</span>
      <div><div class="fw-700">${dayInfo.label}</div><div class="text-xs text-muted">${dayInfo.sub}</div></div>
    </div>`;

    // Warm-up
    h += buildAccordion('\u{1F525} Warm-Up Protocol (12-15 min)', 'warmup', renderBulkChecklist(WARMUP, dk, log, 'warmup', 'Warm-Up'), log.warmup);

    // Main exercises
    h += `<div class="sub-title mt-12">${dayInfo.icon} Main Workout</div>`;
    dayInfo.exercises.forEach(ex => {
      const done = log.exercises && log.exercises[ex.name];
      h += `<div class="check-row" onclick="toggleExercise('${dk}','${esc(ex.name)}')">
        <div class="check-box ${done ? 'checked' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" d="M5 13l4 4L19 7"/></svg></div>
        <div class="check-info" onclick="event.stopPropagation();showExercise('${esc(ex.name)}','${dayInfo.key}')">
          <div class="check-name ${done ? 'done' : ''}">${ex.name}</div>
          <div class="check-detail">${ex.sets} \u00B7 Tempo ${ex.tempo} \u00B7 Rest ${ex.rest}</div>
        </div>
        <button class="btn btn-sm btn-outline" style="padding:4px 8px;" onclick="event.stopPropagation();showExercise('${esc(ex.name)}','${dayInfo.key}')">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </button>
      </div>`;
    });

    // Cardio
    const cardio = getCardio(dayInfo.key, dayInfo.weekNum);
    h += buildAccordion(`\u{1F3C3} Cardio \u2014 ${cardio.name} (${cardio.duration})`, 'cardio', renderCardioBlock(cardio, dk, log), log.cardio);

    // Cooldown
    h += buildAccordion('\u{1F9CA} Cool-Down & Stretching (10 min)', 'cooldown', renderBulkChecklist(COOLDOWN, dk, log, 'cooldown', 'Stretching'), log.cooldown);

  } else {
    // Recovery day
    h += `<div class="card" style="border-left:3px solid ${dayInfo.color};">
      <div class="flex gap-8 mb-8"><span style="font-size:1.4rem;">${dayInfo.icon}</span><div class="fw-700">${dayInfo.label}</div></div>
      ${dayInfo.activities.map(a => `<div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:0.85rem;display:flex;gap:8px;align-items:flex-start;"><span style="color:${dayInfo.color};margin-top:2px;">\u2022</span><span>${a}</span></div>`).join('')}
    </div>`;
    h += `<div class="tip tip-green"><b>Rest Day Nutrition:</b> Follow rest day plan (~1,950 kcal). Protein stays at 140-160g. Lower carbs, slightly higher fats.</div>`;
  }

  // Quick food section
  h += `<div class="flex-between mt-16 mb-8"><div class="sub-title" style="margin:0;">Today's Food</div><button class="btn btn-sm btn-primary" onclick="openFoodModal()">+ Log</button></div>`;
  if (foods.length === 0) {
    h += `<div class="card text-center text-muted text-sm" style="padding:24px;">No food logged yet. Tap + to add.</div>`;
  } else {
    h += `<div class="card" style="padding:8px 14px;">`;
    foods.forEach((f, i) => {
      const cat = FOOD_CATEGORIES.find(c => c.id === f.type) || FOOD_CATEGORIES[0];
      h += `<div class="food-entry">
        <div class="food-icon" style="background:${cat.color}18;">${cat.icon}</div>
        <div class="food-info"><div class="food-name">${esc(f.name)}</div><div class="food-meta">${f.time || ''} \u00B7 P:${f.protein||0}g C:${f.carbs||0}g F:${f.fat||0}g</div></div>
        <div class="food-cals">${f.calories||0}</div>
        <button class="del-btn" onclick="deleteFood('${dk}',${i})"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>`;
    });
    h += `</div>`;
  }

  h += `</div>`;
  return h;
}

// ═══════════════════════════════════════
// CALENDAR PAGE
// ═══════════════════════════════════════
function renderCalendar() {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Mo","Tu","We","Th","Fr","Sa","Su"];
  const firstDay = new Date(calYear, calMonth, 1);
  let startDow = firstDay.getDay(); startDow = startDow === 0 ? 6 : startDow - 1;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const tdk = todayKey();

  let h = `<div class="page active"><div class="section-title">Calendar</div>`;
  h += `<div class="flex-between mb-12">
    <button class="btn btn-sm btn-outline" onclick="calMonth--;if(calMonth<0){calMonth=11;calYear--;}render();">\u2039</button>
    <span class="fw-700">${months[calMonth]} ${calYear}</span>
    <button class="btn btn-sm btn-outline" onclick="calMonth++;if(calMonth>11){calMonth=0;calYear++;}render();">\u203A</button>
  </div>`;

  h += `<div class="mini-cal">`;
  dayNames.forEach(d => { h += `<div class="mini-cal-day mini-cal-head">${d}</div>`; });
  for (let i = 0; i < startDow; i++) h += `<div class="mini-cal-day"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(calYear, calMonth, d);
    const dk = dateKey(date);
    const isToday = dk === tdk;
    const isSel = dk === dateKey(selectedDate);
    const hasLog = STATE.workoutLog[dk] && Object.values(STATE.workoutLog[dk].exercises || {}).filter(Boolean).length > 0;
    h += `<div class="mini-cal-day ${isToday?'today':''} ${isSel?'selected':''} ${hasLog?'has-workout':''}" onclick="selectedDate=new Date(${calYear},${calMonth},${d});render();">${d}</div>`;
  }
  h += `</div>`;

  // Selected day detail
  const selInfo = getDayInfo(selectedDate);
  const selDk = dateKey(selectedDate);
  const selLog = STATE.workoutLog[selDk] || {};
  const selFoods = STATE.foodLog[selDk] || [];
  const selStr = selectedDate.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' });

  h += `<div class="card mt-12"><div class="text-xs text-dim mb-8">${selStr}</div>`;
  if (!selInfo) {
    h += `<div class="text-sm text-muted">No plan for this date.</div>`;
  } else if (selInfo.type === 'workout') {
    const done = Object.values(selLog.exercises || {}).filter(Boolean).length;
    h += `<div class="flex gap-8 mb-8"><span style="font-size:1.2rem;">${selInfo.icon}</span><div><div class="fw-700">${selInfo.label}</div><div class="text-xs text-muted">${selInfo.sub} \u00B7 Week ${selInfo.weekNum}</div></div></div>`;
    h += `<div class="text-sm text-muted mb-8">${done}/${selInfo.exercises.length} exercises completed</div>`;
    const badges = [];
    if (selLog.warmup) badges.push('Warm-up \u2713');
    if (selLog.cardio) badges.push('Cardio \u2713');
    if (selLog.cooldown) badges.push('Stretching \u2713');
    if (badges.length) h += `<div class="flex gap-6 flex-wrap">${badges.map(b=>`<span class="tag tag-green">${b}</span>`).join('')}</div>`;
  } else {
    h += `<div class="flex gap-8"><span style="font-size:1.2rem;">${selInfo.icon}</span><div><div class="fw-700">${selInfo.label}</div><div class="text-xs text-muted">Week ${selInfo.weekNum}</div></div></div>`;
  }
  if (selFoods.length > 0) {
    h += `<div class="divider"></div><div class="text-sm text-muted">${selFoods.length} food entries \u00B7 ${selFoods.reduce((s,f)=>s+(f.calories||0),0)} kcal</div>`;
  }
  h += `</div>`;

  h += `<div class="flex gap-8 mt-8" style="justify-content:center;">
    <span class="text-xs text-dim flex gap-4"><span style="width:8px;height:8px;border-radius:50%;background:var(--green);"></span>Logged</span>
    <span class="text-xs text-dim flex gap-4"><span style="width:8px;height:8px;border-radius:50%;border:2px solid var(--blue);"></span>Today</span>
  </div></div>`;
  return h;
}

// ═══════════════════════════════════════
// FOOD PAGE
// ═══════════════════════════════════════
function renderFood() {
  const dk = todayKey();
  const foods = STATE.foodLog[dk] || [];
  const tc = foods.reduce((s,f)=>s+(f.calories||0), 0);
  const tp = foods.reduce((s,f)=>s+(f.protein||0), 0);
  const tca = foods.reduce((s,f)=>s+(f.carbs||0), 0);
  const tf = foods.reduce((s,f)=>s+(f.fat||0), 0);
  const isTraining = getDayInfo(new Date())?.type === 'workout';
  const calT = isTraining ? 2250 : 1950;

  let h = `<div class="page active">
    <div class="flex-between mb-16"><div class="section-title" style="margin:0;">Nutrition</div><button class="btn btn-primary" onclick="openFoodModal()">+ Log Food</button></div>`;

  h += `<div class="card">
    <div class="text-xs text-dim mb-8">${isTraining ? 'TRAINING' : 'REST'} DAY \u00B7 Target ~${calT} kcal</div>
    <div class="stat-grid" style="margin-bottom:8px;">
      <div style="text-align:center;"><div class="fw-700" style="font-size:1.5rem;color:var(--orange);">${tc}<span class="text-xs text-dim">/${calT}</span></div><div class="text-xs text-dim">Calories</div></div>
      <div style="text-align:center;"><div class="fw-700" style="font-size:1.5rem;color:var(--blue);">${tp}g<span class="text-xs text-dim">/150g</span></div><div class="text-xs text-dim">Protein</div></div>
    </div>
    <div class="flex gap-8" style="justify-content:center;"><span class="tag tag-orange">Carbs: ${tca}g</span><span class="tag tag-purple">Fat: ${tf}g</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100,tc/calT*100)}%;background:${tc>calT?'var(--red)':'linear-gradient(90deg,var(--green),var(--blue))'};"></div></div>
  </div>`;

  const junk = foods.filter(f => f.type === 'junk').length;
  if (junk > 0) h += `<div class="tip tip-red mb-12"><b>Heads up:</b> ${junk} junk item${junk>1?'s':''} today. Balance with extra protein and lighter carbs next meal.</div>`;

  if (foods.length === 0) {
    h += `<div class="empty-state"><div class="e-icon">\u{1F37D}\u{FE0F}</div><p>No food logged yet today.<br>Tap + Log Food or use Quick Add below.</p></div>`;
  } else {
    h += `<div class="card" style="padding:8px 14px;">`;
    foods.forEach((f, i) => {
      const cat = FOOD_CATEGORIES.find(c => c.id === f.type) || FOOD_CATEGORIES[0];
      h += `<div class="food-entry">
        <div class="food-icon" style="background:${cat.color}18;">${cat.icon}</div>
        <div class="food-info"><div class="food-name">${esc(f.name)}</div><div class="food-meta">${f.time||''} \u00B7 P:${f.protein||0}g C:${f.carbs||0}g F:${f.fat||0}g${f.notes?' \u00B7 '+esc(f.notes):''}</div></div>
        <div style="text-align:right;"><div class="food-cals">${f.calories||0}</div>
          <button class="del-btn" onclick="deleteFood('${dk}',${i})"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
      </div>`;
    });
    h += `</div>`;
  }

  h += `<div class="sub-title mt-16">Quick Add</div><div class="quick-grid">`;
  QUICK_FOODS.forEach(f => {
    const cat = FOOD_CATEGORIES.find(c => c.id === f.type);
    h += `<button class="btn btn-sm btn-outline" onclick='quickAdd(${JSON.stringify(f)})'>${cat ? cat.icon : ''} ${f.name}</button>`;
  });
  h += `</div></div>`;
  return h;
}

// ═══════════════════════════════════════
// PROGRESS PAGE
// ═══════════════════════════════════════
function renderProgress() {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 84; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const info = getDayInfo(d);
    if (info && info.type === 'workout') {
      const log = STATE.workoutLog[dateKey(d)];
      if (log && Object.values(log.exercises || {}).filter(Boolean).length > 0) streak++;
      else break;
    }
  }
  const totalW = Object.keys(STATE.workoutLog).filter(dk => {
    const l = STATE.workoutLog[dk];
    return l && Object.values(l.exercises || {}).filter(Boolean).length > 0;
  }).length;
  let totalEx = 0;
  Object.values(STATE.workoutLog).forEach(l => { totalEx += Object.values(l.exercises || {}).filter(Boolean).length; });
  let junkWk = 0;
  for (let i = 0; i < 7; i++) { const d = new Date(today); d.setDate(d.getDate()-i); junkWk += (STATE.foodLog[dateKey(d)] || []).filter(f=>f.type==='junk').length; }

  let h = `<div class="page active"><div class="section-title">Progress</div>`;
  h += `<div class="stat-grid">
    <div class="stat-card"><div class="stat-val" style="color:var(--green);">\u{1F525} ${streak}</div><div class="stat-label">Workout Streak</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--blue);">${totalW}</div><div class="stat-label">Total Sessions</div></div>
    <div class="stat-card"><div class="stat-val" style="color:var(--orange);">${totalEx}</div><div class="stat-label">Exercises Done</div></div>
    <div class="stat-card"><div class="stat-val" style="color:${junkWk>3?'var(--red)':'var(--green)'};">${junkWk}</div><div class="stat-label">Junk This Week</div></div>
  </div>`;

  // Weight
  h += `<div class="sub-title mt-16">Weight Tracker</div><div class="card">
    <div class="flex gap-8 mb-8"><input class="input" type="number" step="0.1" placeholder="Today's weight (kg)" id="wInput" style="flex:1;"><button class="btn btn-primary btn-sm" onclick="logWeight()">Log</button></div>`;
  const wEntries = Object.entries(STATE.weightLog).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 14);
  if (wEntries.length) {
    wEntries.forEach(([k, w]) => {
      const d = new Date(k + 'T00:00:00');
      h += `<div class="flex-between" style="padding:5px 0;border-bottom:1px solid var(--border);"><span class="text-sm">${d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span><span class="fw-600">${w} kg</span></div>`;
    });
  } else h += `<div class="text-sm text-muted text-center">No weight logged yet.</div>`;
  h += `</div>`;

  // Notes
  h += `<div class="sub-title mt-16">Today's Notes</div><div class="card">
    <textarea class="input" placeholder="How did you feel? Energy? Any pain?..." rows="3" onchange="STATE.notes[todayKey()]=this.value;debounceAutoSave();">${esc(STATE.notes[todayKey()] || '')}</textarea>
  </div>`;

  // Heatmap
  h += `<div class="sub-title mt-16">Last 4 Weeks</div><div class="card" style="padding:12px;">`;
  for (let w = 3; w >= 0; w--) {
    h += `<div class="flex gap-6 mb-8" style="justify-content:center;">`;
    for (let d = 0; d < 7; d++) {
      const date = new Date(today); date.setDate(date.getDate() - (w*7 + 6 - d));
      const dk = dateKey(date);
      const log = STATE.workoutLog[dk];
      const exDone = log ? Object.values(log.exercises || {}).filter(Boolean).length : 0;
      const info = getDayInfo(date);
      const maxEx = (info && info.exercises) ? info.exercises.length : 1;
      const pct = (info && info.type === 'workout') ? exDone / maxEx : 0;
      const clr = pct >= 0.8 ? 'var(--green)' : pct >= 0.4 ? 'var(--orange)' : pct > 0 ? 'var(--yellow)' : 'var(--surface2)';
      h += `<div class="heat-cell" style="background:${clr};color:${pct>0?'#fff':'var(--text3)'};" title="${dk}">${date.getDate()}</div>`;
    }
    h += `</div>`;
  }
  h += `<div class="flex gap-8 mt-8" style="justify-content:center;">
    <span class="text-xs text-dim flex gap-4"><span style="width:10px;height:10px;border-radius:3px;background:var(--green);"></span>80%+</span>
    <span class="text-xs text-dim flex gap-4"><span style="width:10px;height:10px;border-radius:3px;background:var(--orange);"></span>40%+</span>
    <span class="text-xs text-dim flex gap-4"><span style="width:10px;height:10px;border-radius:3px;background:var(--yellow);"></span>Started</span>
    <span class="text-xs text-dim flex gap-4"><span style="width:10px;height:10px;border-radius:3px;background:var(--surface2);"></span>None</span>
  </div></div></div>`;
  return h;
}

// ═══════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════
function renderProfile() {
  let h = `<div class="page active"><div class="section-title text-center">Profile</div>`;

  h += `<div class="text-center mb-16">
    <div class="avatar-wrapper" onclick="document.getElementById('avInput').click();">
      ${STATE.profile.avatarUrl ? `<img src="${STATE.profile.avatarUrl}" alt="">` : `<svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
      <div class="cam-overlay"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
    </div>
    <input type="file" accept="image/*" class="hidden-input" id="avInput" onchange="uploadAvatar(this)">
    <div class="text-xs text-muted">Tap to upload photo</div>
  </div>`;

  h += `<div class="card"><div class="label">Your Name</div><input class="input" type="text" value="${esc(STATE.profile.name)}" placeholder="Enter your name" onchange="STATE.profile.name=this.value;debounceAutoSave();"></div>`;

  h += `<div class="card"><div class="label">Body Stats</div><div class="flex gap-8">
    <div style="flex:1;"><div class="text-xs text-dim mb-8">Weight (kg)</div><input class="input" type="number" value="${STATE.profile.weight||''}" onchange="STATE.profile.weight=parseFloat(this.value);debounceAutoSave();"></div>
    <div style="flex:1;"><div class="text-xs text-dim mb-8">Height (cm)</div><input class="input" type="number" value="${STATE.profile.height||''}" onchange="STATE.profile.height=parseFloat(this.value);debounceAutoSave();"></div>
  </div></div>`;

  h += `<div class="card"><div class="label">Cloud Sync</div>
    <div class="text-sm text-muted mb-8">Your data auto-syncs to the cloud. Bookmark this URL or copy it — open the same URL on any device or browser to access your data.</div>
    <div class="text-xs text-dim mb-8" style="word-break:break-all;">${window.location.href}</div>
    <button class="btn btn-sm btn-outline btn-block" onclick="navigator.clipboard.writeText(window.location.href).then(()=>{this.textContent='\u2713 Copied!';setTimeout(()=>{this.textContent='Copy Sync URL'},2000);})">Copy Sync URL</button>
  </div>`;

  h += `<div class="card"><div class="label">Your Plan</div>
    <div class="text-sm mb-8">12-Week Upper/Lower Split \u00B7 4 training days/week</div>
    <div class="text-xs text-dim">Tue: Upper A \u00B7 Wed: Lower A \u00B7 Thu: Mobility</div>
    <div class="text-xs text-dim">Fri: Upper B \u00B7 Sat: Lower B \u00B7 Sun: Active Recovery \u00B7 Mon: Rest</div>
    <div class="text-xs text-dim mt-8">Plan: March 10 - June 2, 2026</div>
    <div class="tip tip-red mt-8"><b>Medical note:</b> L4-L5 disc bulge + cervical considerations. All exercises are spine-safe. Please see an Orthop\u00E4de for radiating neck pain.</div>
  </div>`;

  h += `<div class="card" style="border-color:rgba(248,113,113,0.2);"><div class="label" style="color:var(--red);">Danger Zone</div>
    <button class="btn btn-sm btn-danger btn-block" onclick="if(confirm('Reset ALL data? This cannot be undone.')){STATE={profile:{name:'',avatarUrl:'',weight:74,height:175},workoutLog:{},foodLog:{},weightLog:{},notes:{}};STORAGE.save(STATE);render();}">Reset All Data</button>
  </div></div>`;
  return h;
}

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════
function buildAccordion(title, id, content, isDone) {
  return `<div class="acc mt-12">
    <div class="acc-head" onclick="toggleAcc('${id}')">
      <div class="acc-head-left"><span class="acc-head-title">${title}</span>${isDone ? '<span class="tag tag-green" style="margin-left:6px;">\u2713</span>' : ''}</div>
      <div class="acc-chevron" id="chev-${id}"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 9l6 6 6-6"/></svg></div>
    </div>
    <div class="acc-body" id="body-${id}">${content}</div>
  </div>`;
}

function renderBulkChecklist(items, dk, log, field, label) {
  let h = `<div style="margin-bottom:10px;">
    <button class="btn btn-sm ${log[field] ? 'btn-green' : 'btn-primary'} btn-block" onclick="toggleBulk('${dk}','${field}')">
      ${log[field] ? '\u2713 ' + label + ' Complete' : 'Mark All ' + label + ' Done'}
    </button>
  </div>`;
  items.forEach(item => {
    const safeItem = JSON.stringify({
      name: item.name, sets: item.detail || '', tempo: '\u2014', rest: '\u2014',
      muscles: item.muscles || 'Flexibility / Mobility',
      howTo: item.howTo, safety: item.safety || ''
    });
    h += `<div class="check-row" style="cursor:pointer;padding:8px 4px;" onclick='showExDetail(${safeItem.replace(/'/g,"&#39;")})'>
      <span style="width:6px;height:6px;border-radius:50%;background:var(--orange);flex-shrink:0;"></span>
      <div class="check-info"><div class="check-name" style="font-size:0.82rem;">${item.name}</div><div class="check-detail">${item.detail}</div></div>
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" stroke-width="2"><path stroke-linecap="round" d="M9 18l6-6-6-6"/></svg>
    </div>`;
  });
  return h;
}

function renderCardioBlock(cardio, dk, log) {
  let h = `<div class="flex-between mb-10">
    <div class="flex gap-6"><span class="tag tag-purple">\u23F1 ${cardio.duration}</span><span class="tag tag-red">\u2665 ${cardio.hr}</span></div>
    <button class="btn btn-sm ${log.cardio ? 'btn-green' : 'btn-primary'}" onclick="toggleBulk('${dk}','cardio')">${log.cardio ? '\u2713 Done' : 'Mark Done'}</button>
  </div>`;
  cardio.steps.forEach(s => {
    h += `<div style="padding:7px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
      <div><div class="fw-600 text-sm">${s.phase}</div><div class="text-xs text-dim">${s.time}</div></div>
      <div class="flex gap-4"><span class="tag tag-cyan">${s.speed}</span><span class="tag tag-green">\u26F0 ${s.incline}</span></div>
    </div>`;
  });
  h += `<div class="tip tip-green mt-8"><b>Protocol tip:</b> ${cardio.tip}</div>`;
  h += `<div class="tip tip-red"><b>Spine safety:</b> Do NOT run. Incline walking = same calorie burn as jogging with zero impact on L4-L5. Keep torso upright. Do not hold rails.</div>`;
  return h;
}

// ═══════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════
function toggleExercise(dk, name) {
  if (!STATE.workoutLog[dk]) STATE.workoutLog[dk] = { exercises: {} };
  if (!STATE.workoutLog[dk].exercises) STATE.workoutLog[dk].exercises = {};
  STATE.workoutLog[dk].exercises[name] = !STATE.workoutLog[dk].exercises[name];
  debounceAutoSave(); render();
}

function toggleBulk(dk, field) {
  if (!STATE.workoutLog[dk]) STATE.workoutLog[dk] = { exercises: {} };
  STATE.workoutLog[dk][field] = !STATE.workoutLog[dk][field];
  debounceAutoSave(); render();
}

function toggleAcc(id) {
  const body = document.getElementById('body-' + id);
  const chev = document.getElementById('chev-' + id);
  if (body) body.classList.toggle('open');
  if (chev) chev.classList.toggle('open');
}

function showExercise(name, workoutKey) {
  const ex = EXERCISES[workoutKey].find(e => e.name === name);
  if (ex) showExDetail(ex);
}

function showExDetail(ex) {
  const h = `<div class="modal-overlay" onclick="if(event.target===this)closeModal();">
    <div class="modal">
      <div class="modal-bar"></div>
      <div class="flex-between mb-12">
        <h3 style="margin:0;">${ex.name}</h3>
        <button onclick="closeModal()" style="padding:6px;"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>
      <div class="flex gap-6 flex-wrap mb-12">
        <span class="tag tag-blue">${ex.sets}</span>
        <span class="tag tag-purple">Tempo ${ex.tempo}</span>
        <span class="tag tag-orange">Rest ${ex.rest}</span>
      </div>
      ${ex.muscles ? `<div class="ex-detail-section"><h4>\u{1F4AA} Target Muscles</h4><p>${ex.muscles}</p></div>` : ''}
      <div class="ex-detail-section"><h4>\u{1F4D6} How To Perform</h4><p>${ex.howTo}</p></div>
      ${ex.safety ? `<div class="tip tip-red"><b>\u26A0\u{FE0F} Safety:</b> ${ex.safety}</div>` : ''}
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', h);
}

function openFoodModal() {
  const now = new Date().toTimeString().slice(0, 5);
  const h = `<div class="modal-overlay" onclick="if(event.target===this)closeModal();">
    <div class="modal">
      <div class="modal-bar"></div>
      <h3>Log Food</h3>
      <div class="label mt-8">Food Name</div>
      <input class="input mb-8" type="text" id="fName" placeholder="e.g., Paneer Tikka, Pizza...">
      <div class="label">Category</div>
      <div class="flex gap-6 flex-wrap mb-8">
        ${FOOD_CATEGORIES.map(c => `<button class="btn btn-sm btn-outline fcat" data-cat="${c.id}" onclick="selCat('${c.id}')">${c.icon} ${c.label}</button>`).join('')}
      </div>
      <input type="hidden" id="fCat" value="healthy">
      <div class="label">Time</div>
      <input class="input mb-8" type="time" id="fTime" value="${now}">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;" class="mb-8">
        <div><div class="text-xs text-dim mb-8">Calories</div><input class="input" type="number" id="fCal" placeholder="kcal"></div>
        <div><div class="text-xs text-dim mb-8">Protein (g)</div><input class="input" type="number" id="fP" placeholder="g"></div>
        <div><div class="text-xs text-dim mb-8">Carbs (g)</div><input class="input" type="number" id="fC" placeholder="g"></div>
        <div><div class="text-xs text-dim mb-8">Fat (g)</div><input class="input" type="number" id="fF" placeholder="g"></div>
      </div>
      <div class="label">Notes (optional)</div>
      <input class="input mb-12" type="text" id="fNotes" placeholder="e.g., cheat meal, post-workout...">
      <button class="btn btn-primary btn-block" onclick="addFood()">Add to Log</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', h);
}

function selCat(id) {
  document.getElementById('fCat').value = id;
  document.querySelectorAll('.fcat').forEach(b => {
    const cat = FOOD_CATEGORIES.find(c => c.id === b.dataset.cat);
    const sel = b.dataset.cat === id;
    b.style.borderColor = sel ? cat.color : '';
    b.style.background = sel ? cat.color + '18' : '';
  });
}

function addFood() {
  const dk = todayKey();
  if (!STATE.foodLog[dk]) STATE.foodLog[dk] = [];
  STATE.foodLog[dk].push({
    name: document.getElementById('fName').value || 'Unnamed',
    type: document.getElementById('fCat').value,
    time: document.getElementById('fTime').value,
    calories: parseInt(document.getElementById('fCal').value) || 0,
    protein: parseInt(document.getElementById('fP').value) || 0,
    carbs: parseInt(document.getElementById('fC').value) || 0,
    fat: parseInt(document.getElementById('fF').value) || 0,
    notes: document.getElementById('fNotes').value,
  });
  debounceAutoSave(); closeModal(); render();
}

function quickAdd(food) {
  const dk = todayKey();
  if (!STATE.foodLog[dk]) STATE.foodLog[dk] = [];
  STATE.foodLog[dk].push({ ...food, time: new Date().toTimeString().slice(0, 5), notes: '' });
  debounceAutoSave(); render();
}

function deleteFood(dk, idx) {
  if (STATE.foodLog[dk]) { STATE.foodLog[dk].splice(idx, 1); debounceAutoSave(); render(); }
}

function logWeight() {
  const w = parseFloat(document.getElementById('wInput').value);
  if (w > 0) { STATE.weightLog[todayKey()] = w; debounceAutoSave(); render(); }
}

function uploadAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      const sz = 200; c.width = sz; c.height = sz;
      const ctx = c.getContext('2d');
      const m = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width-m)/2, (img.height-m)/2, m, m, 0, 0, sz, sz);
      STATE.profile.avatarUrl = c.toDataURL('image/jpeg', 0.7);
      debounceAutoSave(); render();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function closeModal() {
  const o = document.querySelector('.modal-overlay');
  if (o) o.remove();
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
async function init() {
  const cloud = await STORAGE.init();
  if (cloud) {
    STATE = { ...STATE, ...cloud };
  } else {
    const local = localStorage.getItem('fitforge_data');
    if (local) { try { STATE = { ...STATE, ...JSON.parse(local) }; } catch(e) {} }
    await STORAGE.createBin(STATE);
  }
  render();
}

init();
