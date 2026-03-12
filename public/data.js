// ═══════════════════════════════════════════════════
// FITFORGE v2 — DATA
// 6-day PPL x2 | No RDL | No cardio on leg days
// ═══════════════════════════════════════════════════

const PLAN_START = new Date(2026, 2, 10); // March 10 — first training day (Push A / Chest)

// ─── WARM-UP ───
const WARMUP = [
  { name:"Cervical Gentle Nods", detail:"10 each direction", muscles:"Deep neck stabilizers", howTo:"Stand or sit tall. Slowly nod YES (chin to chest, then look up) 10 times. Slowly shake NO (look left, look right) 10 times. Tilt ear toward each shoulder 10 times. Keep movements SMALL — about 70% of full range. Move 3 seconds per direction. Stop immediately if radiating pain, tingling, or numbness in arms.", safety:"Critical for cervical spine. Small range only." },
  { name:"Cat-Cow", detail:"8 reps | Tempo 3-1-3-1", muscles:"Entire spine, deep core", howTo:"All fours — hands under shoulders, knees under hips. INHALE: belly drops, lift chest and tailbone (Cow — gentle arch). Hold 1s. EXHALE: round back toward ceiling, tuck chin and tailbone (Cat). Hold 1s. Pain-free range only. This hydrates your L4-L5 disc by pumping nutrients into the tissue.", safety:"Pain-free range only." },
  { name:"Bird Dog", detail:"8 each side | 2-2-2-0", muscles:"Core, glutes, erectors", howTo:"All fours. Brace core. Extend RIGHT arm + LEFT leg into one straight line. Hold 2s. Hips stay square — imagine balancing water on lower back. Return 2s. Used in disc rehabilitation — trains multifidus muscles stabilizing each vertebra.", safety:"Hips square. No rotation." },
  { name:"Dead Bug", detail:"8 each side | 3-1-2-0", muscles:"Transverse abdominis", howTo:"On back, arms up, knees 90 degrees. Press lower back FIRMLY into floor — ZERO gap. Lower RIGHT arm + LEFT leg toward floor (3s). Stop before touching. Hold 1s. Return 2s. Lower back must stay on floor THE ENTIRE TIME.", safety:"Lower back glued to floor." },
  { name:"Thoracic Rotation", detail:"8 each side", muscles:"Thoracic mobility", howTo:"Side-lying, knees stacked 90 degrees. Sweep top arm over body, opening chest to ceiling. Follow hand with eyes. Hold 2s. Unlocks thoracic stiffness forcing neck/lower back to compensate.", safety:"Move from upper back, not lower." },
  { name:"Hip Flexor Rockback", detail:"8 each side", muscles:"Psoas, rectus femoris", howTo:"Half-kneeling. Shift hips forward. KEY: Squeeze glute on kneeling side — posteriorly tilts pelvis, intensifies stretch. Hold 2s. Directly lengthens tight hip flexors causing anterior pelvic tilt.", safety:"Squeeze glute on kneeling side." },
  { name:"Glute Bridge", detail:"12 reps | 2-2-2-0", muscles:"Glutes, hamstrings", howTo:"On back, feet flat. Drive through HEELS, squeeze glutes to lift hips (2s). Straight line shoulders to knees. SQUEEZE glutes 2s. Lower 2s. Activates dormant glutes.", safety:"Don't hyperextend." },
  { name:"Wall Slides", detail:"10 reps | 3-1-3-0", muscles:"Lower traps, serratus", howTo:"Back flat on wall. Arms in W, backs of hands on wall. Slide to Y (3s). Keep contact with wall. Hold 1s. Down 3s. Corrects rounded shoulders.", safety:"Back flat. Don't arch lower back." },
  { name:"Band Pull-Apart", detail:"15 reps | 2-1-2-0", muscles:"Rear delts, rhomboids", howTo:"Light band shoulder width, arms straight. Pull apart to chest (2s). Squeeze shoulder blades 1s. Return 2s. Fires posture-correcting muscles.", safety:"Light band. Squeeze shoulder blades." },
  { name:"Leg Swings", detail:"10 each leg", muscles:"Hip mobility", howTo:"Hold wall. Swing leg forward/backward controlled. Start small, increase range. Warms hip joint dynamically.", safety:"Controlled from hip." },
  { name:"Arm Circles", detail:"10 each direction", muscles:"Rotator cuff", howTo:"Arms out, small circles building to large. Forward 10, backward 10. Warms rotator cuff.", safety:"Start small, build large." },
];

// ─── COOLDOWN ───
const COOLDOWN = [
  { name:"Chest Doorway Stretch", detail:"30s each", howTo:"Forearm on door frame at shoulder height. Step through, lean for deep chest stretch. 30s each. Lengthens tight pecs." },
  { name:"Cross-Body Shoulder Stretch", detail:"30s each", howTo:"Arm across body, other hand pulls it closer. Back of shoulder stretch. 30s each." },
  { name:"Hip Flexor Kneeling Stretch", detail:"45s each", howTo:"Half-kneeling. Hips forward, squeeze back glute. Raise same arm overhead, lean away. 45s. Most important stretch for pelvic tilt." },
  { name:"Piriformis Figure-4", detail:"30s each", howTo:"On back. Cross ankle over knee. Pull thigh toward chest. Deep glute stretch. 30s. Releases piriformis." },
  { name:"Hamstring Stretch (Lying)", detail:"30s each", howTo:"On back. Towel around foot, straighten leg, pull gently. Other leg flat. 30s. Spine-neutral." },
  { name:"Child's Pose", detail:"45-60s", howTo:"Kneel, sit back, arms forward, forehead down. Breathe into lower back. Spinal decompression." },
  { name:"Neck Stretch", detail:"20s each", howTo:"Ear to shoulder. Very gentle hand overpressure. 20s each." },
  { name:"Thoracic Foam Roller", detail:"60s", howTo:"Roller at mid-back. Hands behind head. Extend back. Hold, breathe, reposition. 60s." },
  { name:"Supine Twist", detail:"30s each", howTo:"On back, arms T. Knees to chest, lower to side, look opposite. 30s. Comfortable range." },
];

// ─── CARDIO (only on Push and Pull days, NOT leg days) ───
const CARDIO_STEADY = {
  name:"Steady Incline Walk", duration:"20 min", hr:"130-145 BPM",
  steps:[
    {phase:"Ease In",time:"0-2 min",speed:"4.5 km/h",incline:"2%"},
    {phase:"Working Walk",time:"2-17 min",speed:"5.5-6.0 km/h",incline:"8-12%"},
    {phase:"Cool Down",time:"17-20 min",speed:"4.0 km/h",incline:"1%"},
  ], tip:"Primary fat burner. Don't hold rails — reduces burn ~40%. Start 8% incline Wk 1, progress to 12% by Wk 5."
};
const CARDIO_INTERVALS = {
  name:"Incline Intervals", duration:"18 min", hr:"140-160 BPM peak",
  steps:[
    {phase:"Warm Up",time:"0-3 min",speed:"5.0 km/h",incline:"3%"},
    {phase:"6x Intervals",time:"3-15 min",speed:"5.5-6.5 km/h",incline:"10-15% / 3%"},
    {phase:"Cool Down",time:"15-18 min",speed:"4.0 km/h",incline:"1%"},
  ], tip:"1 min steep + 1 min easy x 6. Boosts EPOC. Start 10%, progress to 15% by Wk 7."
};
const CARDIO_PROGRESSIVE = {
  name:"Progressive Climb", duration:"17 min", hr:"125-150 BPM",
  steps:[
    {phase:"Base",time:"0-2 min",speed:"5.0 km/h",incline:"2%"},
    {phase:"Build",time:"2-4 min",speed:"5.5 km/h",incline:"5%"},
    {phase:"Climb 1",time:"4-7 min",speed:"5.5 km/h",incline:"8%"},
    {phase:"Climb 2",time:"7-10 min",speed:"5.5-6.0 km/h",incline:"10%"},
    {phase:"Summit",time:"10-13 min",speed:"5.5 km/h",incline:"12-15%"},
    {phase:"Descend",time:"13-15 min",speed:"5.0 km/h",incline:"5%"},
    {phase:"Cool Down",time:"15-17 min",speed:"4.0 km/h",incline:"1%"},
  ], tip:"Mimics climbing a real hill. Gradual ramp is very spine-friendly."
};

// ─── 6-DAY PPL SPLIT ───
// Push A (Tue), Legs A (Wed), Pull A (Thu), Push B (Fri), Legs B (Sat), Pull B (Sun), Rest (Mon)
// Started March 10 (Tue) with Push A (Chest)
// NO RDL — replaced with cable pull-through, stability ball curl, trap bar deadlift
// NO cardio on leg days — extra plank/core instead

const EXERCISES = {
  push_a: [
    { name:"Dumbbell Bench Press", sets:"4x10-12", tempo:"3-1-2-0", rest:"90s", muscles:"Chest, front delts, triceps", howTo:"Flat bench. Squeeze shoulder blades together INTO the bench. Press up (don't lock elbows). Lower 3s, pause 1s, press 2s. Start with a weight you control for all 12 reps.", safety:"Shoulder blades pinched back. Neutral wrists." },
    { name:"Incline DB Press (30 deg)", sets:"3x10-12", tempo:"3-1-2-0", rest:"75s", muscles:"Upper chest, front delts", howTo:"Bench at 30 degrees. Same shoulder blade setup. Press from upper chest. Builds upper chest fullness. Lower 3s, pause 1s, press 2s.", safety:"Lower back pressed into bench." },
    { name:"Cable Fly (Low to High)", sets:"3x12-15", tempo:"2-1-2-1", rest:"60s", muscles:"Chest (inner, upper)", howTo:"Cables at lowest. Stand forward. Sweep arms up in arc from low to high. Squeeze 1s at top. Constant cable tension is superior to dumbbell flyes.", safety:"Slight elbow bend throughout." },
    { name:"DB Overhead Press (Seated)", sets:"3x10-12", tempo:"3-1-2-0", rest:"90s", muscles:"All deltoid heads, triceps", howTo:"Bench at 85 degrees with back support. DBs at shoulder height. Press up (don't lock). Lower 3s. Keep lower back ON pad. If neck pain radiates — reduce weight or switch to landmine press.", safety:"Back on pad. Stop if neck radiates." },
    { name:"DB Lateral Raise", sets:"3x12-15", tempo:"2-1-2-0", rest:"60s", muscles:"Side deltoids", howTo:"Slight forward lean. Raise to shoulder height, thumbs slightly up. LIGHT weight (4-6kg). Builds V-taper shoulder width.", safety:"Light weight. No swinging." },
    { name:"Tricep Rope Pushdown", sets:"3x12-15", tempo:"2-1-2-0", rest:"60s", muscles:"Triceps (lateral/medial heads)", howTo:"Rope on high cable. Elbows pinned to sides. Push down 2s. At bottom SPLIT the rope apart for peak contraction. Squeeze 1s. Return 2s.", safety:"Elbows pinned. Split rope at bottom." },
    { name:"Overhead Tricep Extension", sets:"3x12", tempo:"3-1-2-0", rest:"60s", muscles:"Triceps (long head)", howTo:"Seated, back supported. One DB overhead with both hands. Lower behind head 3s (elbows forward). Deep stretch. Press up 2s. Long head is the biggest part of triceps.", safety:"Elbows point forward. Control descent." },
  ],
  pull_a: [
    { name:"Lat Pulldown (Wide)", sets:"4x10-12", tempo:"3-1-2-1", rest:"90s", muscles:"Lats, biceps, rear delts", howTo:"Wide grip (~1.5x shoulders). Lean back 10 degrees. Pull to upper chest, drive elbows DOWN and BACK. Squeeze lats 1s. Return 3s for full stretch. NEVER behind neck. Builds V-taper.", safety:"Pull to chest, NEVER behind neck." },
    { name:"Seated Cable Row (Wide)", sets:"4x10-12", tempo:"3-1-2-1", rest:"90s", muscles:"Mid-back, rhomboids, lats", howTo:"Sit tall, chest up. Pull to lower chest (2s). SQUEEZE shoulder blades together hard, hold 1s. Release forward 3s. Torso stays UPRIGHT. Directly targets posture muscles.", safety:"No torso lean." },
    { name:"Chest Supported Row", sets:"3x10-12", tempo:"3-1-2-1", rest:"75s", muscles:"Mid-back, lats, rhomboids", howTo:"Incline bench 30 degrees, lie FACE DOWN. Row DBs toward hips (2s), squeeze 1s. Lower 3s. ZERO spinal load — safest row for L4-L5.", safety:"Zero spinal load. Safest row." },
    { name:"Face Pull (Rope)", sets:"4x15", tempo:"2-2-2-0", rest:"60s", muscles:"Rear delts, rotator cuff, lower traps", howTo:"Cable at face height with rope. Pull toward forehead 2s. As rope reaches face, EXTERNALLY ROTATE — knuckles point behind you. Hold 2s. Return 2s. LIGHT weight. #1 posture exercise.", safety:"Light weight. External rotation is key." },
    { name:"Band Pull-Apart", sets:"3x15-20", tempo:"2-1-2-0", rest:"45s", muscles:"Rear delts, rhomboids", howTo:"Superset with Face Pulls. Pull band to chest, squeeze shoulder blades 1s.", safety:"Superset with Face Pulls." },
    { name:"EZ Bar Curl", sets:"3x12", tempo:"3-1-2-0", rest:"60s", muscles:"Biceps", howTo:"EZ bar angled grips reduce wrist stress. Curl up 2s, squeeze. Lower 3s (slow eccentric = growth). Elbows pinned to sides.", safety:"Slow 3s lowering." },
    { name:"Hammer Curl", sets:"3x12", tempo:"3-1-2-0", rest:"60s", muscles:"Brachialis, biceps", howTo:"Palms face each other. Curl up 2s. Lower 3s. Elbows pinned. Targets brachialis for arm thickness.", safety:"Elbows stay pinned." },
  ],
  legs_a: [
    { name:"Goblet Squat", sets:"4x10-12", tempo:"3-1-2-0", rest:"90s", muscles:"Quads, glutes, core", howTo:"DB held vertically at chest. Feet shoulder-width, toes out 15-20 degrees. Sit BETWEEN knees. Chest up, heels down. Front-loaded = upright torso = dramatically less L4-L5 load than barbell squat.", safety:"Chest up. Heels down. Torso upright." },
    { name:"Leg Press", sets:"4x12-15", tempo:"3-1-2-0", rest:"90s", muscles:"Quads, glutes", howTo:"Feet shoulder-width, slightly HIGH on platform. Lower 3s to ~90 degree knee angle. CRITICAL: lower back stays on pad ENTIRE time. If hips tuck — too deep.", safety:"NEVER let back lift off pad." },
    { name:"Walking Lunge (DBs)", sets:"3x10 each", tempo:"2-1-2-0", rest:"75s", muscles:"Quads, glutes, balance", howTo:"DBs at sides. Medium step forward. Both knees ~90 degrees (2s down). Front knee over toes. Torso upright. 10 per leg.", safety:"Upright torso. Knee over toes." },
    { name:"Hip Thrust", sets:"4x12", tempo:"2-2-2-0", rest:"75s", muscles:"Glutes (primary)", howTo:"Upper back on bench. BB/DB on hips. Drive through heels, squeeze glutes hard (2s up). Straight line shoulders to knees. SQUEEZE 2s. Lower 2s. #1 glute builder. Corrects anterior pelvic tilt.", safety:"Squeeze glutes hard. Don't hyperextend." },
    { name:"Leg Extension", sets:"3x12-15", tempo:"2-1-2-0", rest:"60s", muscles:"Quads (isolation)", howTo:"Back on pad. Extend fully 2s, squeeze quads 1s. Lower 2s. Light-moderate weight. Zero spinal load.", safety:"Light-moderate. Full extension." },
    { name:"Seated Calf Raise", sets:"4x15-20", tempo:"2-1-2-1", rest:"45s", muscles:"Soleus (deep calf)", howTo:"Full ROM: lower heels fully (2s), hold stretch 1s, push up (2s), squeeze 1s.", safety:"Full stretch, full squeeze." },
    { name:"Plank (Anti-Extension)", sets:"3x30-45s", tempo:"Hold", rest:"60s", muscles:"Core (anti-extension)", howTo:"Elbows under shoulders. Squeeze glutes. Pull ribs DOWN toward pelvis (posterior tilt cue). No lower back sag. Breathe normally. Add plate on back if easy.", safety:"No sag. Glutes squeezed. Ribs down." },
    { name:"Pallof Press", sets:"3x10 each", tempo:"2-2-2-0", rest:"60s", muscles:"Obliques, anti-rotation", howTo:"Sideways to cable, handle at chest. Press arms out 2s — resist cable rotation. Hold 2s. Return 2s. Builds disc-protecting rotational stability.", safety:"Resist rotation. Core braced." },
  ],
  push_b: [
    { name:"Incline DB Press (30 deg)", sets:"4x10-12", tempo:"3-1-2-0", rest:"90s", muscles:"Upper chest, front delts", howTo:"Bench at 30 degrees. Shoulder blades squeezed back. Press from upper chest. Lower 3s, pause 1s, press 2s.", safety:"Lower back on bench." },
    { name:"Flat Dumbbell Fly", sets:"3x12-15", tempo:"3-1-2-1", rest:"60s", muscles:"Chest (stretch focus)", howTo:"Flat bench. Arms slightly bent. Lower DBs out to sides in arc (3s) until deep chest stretch. Pause 1s. Squeeze back up (2s). Hold 1s top.", safety:"Don't go too deep — stop at shoulder level." },
    { name:"Machine Chest Press", sets:"3x12", tempo:"2-1-2-0", rest:"75s", muscles:"Chest, triceps", howTo:"Machine press. Great for safely pushing to near-failure without needing a spotter. Press 2s, return 2s. Full range.", safety:"Back stays on pad." },
    { name:"Arnold Press (Seated)", sets:"3x10-12", tempo:"3-1-2-0", rest:"90s", muscles:"All deltoid heads", howTo:"Start with DBs at chest, palms facing you. As you press up, rotate palms to face forward. Reverse on the way down. 3s down, press 2s. Hits all three deltoid heads in one movement.", safety:"Back supported. Light to moderate weight." },
    { name:"Cable Lateral Raise", sets:"3x12-15", tempo:"2-1-2-0", rest:"60s", muscles:"Side deltoids", howTo:"Low cable, handle in opposite hand. Raise to shoulder height 2s. Constant tension throughout. Better than DBs at bottom range.", safety:"Light weight. Control." },
    { name:"Dips (Machine Assisted)", sets:"3x10-12", tempo:"3-1-2-0", rest:"75s", muscles:"Chest, triceps", howTo:"Use assisted dip machine if needed. Lean forward slightly for chest emphasis. Lower 3s until upper arms parallel. Press up 2s. If shoulder pain — skip and do extra pushdowns.", safety:"Lean forward slightly. Skip if shoulder pain." },
    { name:"Skull Crusher (EZ Bar)", sets:"3x12", tempo:"3-1-2-0", rest:"60s", muscles:"Triceps (all heads)", howTo:"Flat bench, EZ bar overhead. Lower to forehead (3s) by bending elbows only. Press back up (2s). Elbows point to ceiling. Great tricep mass builder.", safety:"Control the weight. Elbows stay pointed up." },
  ],
  pull_b: [
    { name:"Cable Pulldown (Close Grip)", sets:"4x10-12", tempo:"3-1-2-1", rest:"90s", muscles:"Lats (lower emphasis), biceps", howTo:"V-bar or close-grip handle. Lean back slightly. Pull to upper chest. Squeeze lats 1s. The close grip targets the lower lat fibers for thickness.", safety:"Pull to chest. Slight lean back." },
    { name:"Single-Arm DB Row", sets:"3x10-12 each", tempo:"3-1-2-1", rest:"75s", muscles:"Lats, rhomboids, biceps", howTo:"Right hand + knee on bench. DB in left hand. Pull to HIP (not shoulder) 2s. Squeeze lat 1s. Lower 3s. Bench support = spine-safe.", safety:"Flat back. Pull to hip." },
    { name:"Cable Face Pull (High)", sets:"4x15", tempo:"2-2-2-0", rest:"60s", muscles:"Rear delts, rotator cuff, lower traps", howTo:"Rope from HIGH pulley. Pull toward face, externally rotate (knuckles behind you). Hold 2s. 4x15 — primary posture corrector.", safety:"Light weight. External rotation." },
    { name:"Reverse Fly (Bent Over)", sets:"3x12-15", tempo:"2-1-2-0", rest:"60s", muscles:"Rear delts, upper back", howTo:"Torso at 45 degrees, flat back. VERY light DBs (2-5kg). Raise to sides 2s, squeeze 1s. Lower 2s. Neutral spine.", safety:"Very light weight. Flat back." },
    { name:"Prone Y-T-W Raises", sets:"2x8 each shape", tempo:"2-2-2-0", rest:"60s", muscles:"Lower traps, serratus anterior", howTo:"Face down on incline bench. Y (8 reps), T (8 reps), W (8 reps). Thumbs up. Bodyweight or 1-2kg. Fixes scapular winging.", safety:"Very light/bodyweight." },
    { name:"Incline DB Curl", sets:"3x12", tempo:"3-1-2-0", rest:"60s", muscles:"Biceps (long head stretch)", howTo:"Incline bench 45 degrees. Arms hang straight. Curl up 2s. Lower 3s — the incline stretches the long head of biceps maximally, which is the peak builder.", safety:"Don't swing. 3s eccentric." },
    { name:"Cable Curl (Rope)", sets:"3x12-15", tempo:"2-1-2-0", rest:"60s", muscles:"Biceps, brachialis", howTo:"Low cable with rope. Curl up 2s, supinate (turn pinkies out) at top. Squeeze. Lower 2s. Constant tension.", safety:"Elbows at sides." },
  ],
  legs_b: [
    { name:"Bulgarian Split Squat", sets:"4x10 each", tempo:"3-1-2-0", rest:"75s", muscles:"Quads, glutes (single-leg)", howTo:"Rear foot on bench. DBs at sides. Lower 3s until back knee nearly touches floor. Front knee over toes. Torso upright. Push through front heel 2s. Fixes L/R imbalances.", safety:"Torso upright. Front heel down." },
    { name:"Cable Pull-Through", sets:"4x12", tempo:"2-2-2-0", rest:"75s", muscles:"Glutes, hamstrings", howTo:"Face AWAY from low cable. Rope between legs. Hinge at hips (push hips back), feel hamstring stretch. Drive hips forward by squeezing glutes HARD (2s). Squeeze at top 2s. This replaces RDL — it trains the exact same hip-hinge pattern but the cable pulls from behind/below, which means virtually ZERO compressive load on your lumbar spine. Your lower back does not have to support any weight.", safety:"Squeeze glutes to drive hips. Zero spinal compression." },
    { name:"Stability Ball Hamstring Curl", sets:"3x12", tempo:"2-1-3-0", rest:"60s", muscles:"Hamstrings (isolation)", howTo:"Lie on back, heels on stability ball. Lift hips into bridge position. Curl the ball toward your butt by bending knees (2s). Squeeze 1s. Slowly extend back out (3s). The slow 3s eccentric is brutal on hamstrings. Hips stay elevated throughout. Zero spinal load.", safety:"Keep hips elevated. Slow 3s extension." },
    { name:"Trap Bar Deadlift (Light)", sets:"3x10", tempo:"2-1-2-0", rest:"90s", muscles:"Full posterior chain, quads", howTo:"Stand inside the hex/trap bar. Grip the handles. Push through the floor to stand (2s). Hips and knees extend together. Lower 2s. The trap bar is MUCH safer than a barbell deadlift because: the weight is at your sides (not in front), which eliminates the forward shear force on L4-L5. Your torso stays more upright naturally. Use LIGHT to moderate weight — this is for posterior chain activation, not ego lifting.", safety:"Light weight. Torso stays upright. Safest deadlift variation for your disc." },
    { name:"Leg Curl (Lying/Seated)", sets:"3x12-15", tempo:"3-1-2-1", rest:"60s", muscles:"Hamstrings (isolation)", howTo:"Curl 2s, squeeze peak 1s. SLOW 3s eccentric. Control the negative. Complements cable pull-through.", safety:"Slow eccentric. Control." },
    { name:"Standing Calf Raise", sets:"4x12-15", tempo:"2-1-2-1", rest:"45s", muscles:"Gastrocnemius (outer calf)", howTo:"On step/machine. Full stretch at bottom (2s), hold 1s. Rise high (2s), squeeze 1s. Full ROM.", safety:"Full ROM." },
    { name:"Side Plank", sets:"3x20-30s each", tempo:"Hold", rest:"60s", muscles:"Obliques, lateral stability", howTo:"Elbow under shoulder. Hips HIGH. Straight line. Targets lateral spinal stabilizers protecting disc from side forces.", safety:"Hips high. No sag." },
    { name:"Dead Bug (Weighted)", sets:"3x10 each", tempo:"3-1-2-0", rest:"60s", muscles:"Deep core", howTo:"Same as warm-up but add light ankle weight or hold DB. Press lower back into floor. Slowly lower opposite limbs 3s. #1 disc-safe core exercise.", safety:"Lower back on floor. Always." },
    { name:"Bird Dog (Weighted)", sets:"3x8 each", tempo:"2-2-2-0", rest:"60s", muscles:"Multifidus, anti-rotation", howTo:"Add light ankle weight or DB. Extend opposite arm/leg (2s), hold 2s, return 2s. Hips square.", safety:"Slow and controlled." },
  ],
};

// ─── SCHEDULE: 6-Day PPL x2 ───
const WORKOUT_LABELS = {
  push_a:{label:"Push A",sub:"Chest & Shoulders & Triceps",icon:"\u{1F4AA}",color:"#5b8af5"},
  pull_a:{label:"Pull A",sub:"Back & Biceps & Posture",icon:"\u{1F3CB}\u{FE0F}",color:"#22d3ee"},
  legs_a:{label:"Legs A",sub:"Quad & Glute Focus + Core",icon:"\u{1F9B5}",color:"#f59e42"},
  push_b:{label:"Push B",sub:"Chest & Shoulders & Triceps",icon:"\u{1F4AA}",color:"#5b8af5"},
  pull_b:{label:"Pull B",sub:"Back & Biceps & Posture",icon:"\u{1F3CB}\u{FE0F}",color:"#22d3ee"},
  legs_b:{label:"Legs B",sub:"Hamstring & Glute + Core",icon:"\u{1F525}",color:"#f59e42"},
};

// Schedule: Tue=PushA, Wed=LegsA, Thu=PullA, Fri=PushB, Sat=LegsB, Sun=PullB, Mon=Rest
// You did: Tue Mar 10 = Chest (Push A), Wed Mar 11 = Legs (Legs A), Thu Mar 12 = Back (Pull A)
const WORKOUT_MAP = {2:'push_a',3:'legs_a',4:'pull_a',5:'push_b',6:'legs_b',0:'pull_b'};

const REST_DAYS = {
  1:{label:"Full Rest & Recovery",icon:"\u{1F634}",color:"#34d399",type:"rest",
    activities:["No structured exercise. Light walking fine.","Hit protein target: 140-160g (eggetarian sources)","Stay hydrated: 2.5-3L water","Foam roll tight areas: quads, glutes, upper back","7-9 hours sleep — growth hormone peaks during deep sleep","Optional: gentle cervical nods + thoracic rotation if stiff"]}
};

// Legs days get NO cardio — push/pull days get cardio
const LEG_DAYS = ['legs_a','legs_b'];

// ─── FOOD CATEGORIES & PRESETS ───
const FOOD_CATEGORIES = [
  {id:'healthy',icon:'\u{1F957}',label:'Clean Meal',color:'#34d399'},
  {id:'protein',icon:'\u{1F95A}',label:'Protein Rich',color:'#5b8af5'},
  {id:'snack',icon:'\u{1F34C}',label:'Snack',color:'#f59e42'},
  {id:'junk',icon:'\u{1F355}',label:'Junk / Cheat',color:'#f87171'},
  {id:'drink',icon:'\u{1F964}',label:'Drink / Shake',color:'#22d3ee'},
  {id:'supplement',icon:'\u{1F48A}',label:'Supplement',color:'#a78bfa'},
];
const QUICK_FOODS = [
  {name:"3 Eggs Scrambled + Toast",calories:350,protein:25,carbs:30,fat:18,type:'protein'},
  {name:"Whey Shake + Banana",calories:250,protein:30,carbs:35,fat:3,type:'drink'},
  {name:"Rice + Dal + Paneer",calories:550,protein:32,carbs:65,fat:16,type:'healthy'},
  {name:"Skyr/Greek Yogurt + Muesli",calories:280,protein:25,carbs:35,fat:5,type:'protein'},
  {name:"Banana",calories:105,protein:1,carbs:27,fat:0,type:'snack'},
  {name:"2 Roti + Sabzi",calories:300,protein:8,carbs:50,fat:8,type:'healthy'},
  {name:"Chana Masala + Rice",calories:480,protein:18,carbs:72,fat:12,type:'healthy'},
  {name:"Paneer Tikka (150g)",calories:320,protein:28,carbs:5,fat:22,type:'protein'},
  {name:"Moong Dal Cheela + Egg",calories:280,protein:22,carbs:28,fat:10,type:'protein'},
  {name:"Rajma + Rice + Raita",calories:520,protein:22,carbs:70,fat:12,type:'healthy'},
  {name:"Palak Paneer + 2 Roti",calories:500,protein:28,carbs:48,fat:20,type:'healthy'},
  {name:"Tofu Bhurji + 2 Roti",calories:380,protein:24,carbs:45,fat:12,type:'healthy'},
  {name:"Almonds (10)",calories:70,protein:3,carbs:2,fat:6,type:'snack'},
  {name:"Peanut Butter Toast",calories:250,protein:10,carbs:25,fat:14,type:'snack'},
  {name:"Creatine 5g",calories:0,protein:0,carbs:0,fat:0,type:'supplement'},
  {name:"Vitamin D3",calories:0,protein:0,carbs:0,fat:0,type:'supplement'},
  {name:"Omega-3 Capsule",calories:10,protein:0,carbs:0,fat:1,type:'supplement'},
  {name:"Pizza Slice",calories:280,protein:12,carbs:34,fat:11,type:'junk'},
  {name:"Burger",calories:550,protein:25,carbs:45,fat:30,type:'junk'},
  {name:"Samosa (2)",calories:300,protein:6,carbs:32,fat:18,type:'junk'},
  {name:"French Fries",calories:380,protein:4,carbs:48,fat:19,type:'junk'},
  {name:"Ice Cream (scoop)",calories:200,protein:3,carbs:24,fat:11,type:'junk'},
  {name:"Chai (milk+sugar)",calories:80,protein:3,carbs:12,fat:2,type:'drink'},
  {name:"Black Coffee",calories:5,protein:0,carbs:0,fat:0,type:'drink'},
];

// ─── MEDICAL DATA ───
const MEDICAL_CONDITIONS = [
  {
    name: "L4-L5 Disc Bulge",
    icon: "\u{1F9B4}",
    color: "var(--red)",
    what: "The gel-like cushion (intervertebral disc) between your 4th and 5th lumbar vertebrae has pushed outward beyond its normal boundary. This disc acts as a shock absorber — when it bulges, it can press on nearby nerves causing pain, stiffness, or occasionally radiating sensations into the legs.",
    causes: "Prolonged sitting with poor posture, repeated spinal flexion under load (like bad deadlift form), weak core muscles failing to stabilize the spine, anterior pelvic tilt increasing lumbar lordosis and compressive forces on the posterior disc.",
    symptoms: ["Lower back pain or stiffness (especially after prolonged sitting or bending forward)","Occasional radiating pain or tingling into the buttock or legs (sciatica)","Pain worsening with forward bending, coughing, or sneezing","Morning stiffness that improves with gentle movement"],
    avoid: ["Conventional barbell deadlifts from the floor (high shear force)","Romanian Deadlifts (you experience discomfort)","Sit-ups and crunches (repeated spinal flexion compresses disc)","Barbell back squats with heavy load","Good mornings with barbell","Rounded-back rowing or any exercise with lost neutral spine","Hyperextension bench past neutral","Leg press with excessive depth (lower back lifts off pad)","Twisting under load (Russian twists with weight)","Prolonged sitting without breaks (>45 min)"],
    doInstead: ["Goblet squats (front-loaded, upright torso, less spinal load)","Cable pull-through (hip hinge with zero spinal compression)","Trap bar deadlift at light weight (weight at sides, not in front)","Dead bugs, planks, Pallof press (anti-movement core training)","Bird dogs (used in disc rehabilitation)","Hip thrusts (glute loading with neutral spine)","Chest-supported rows (zero back load)","Stand up every 30-45 minutes when sitting","Maintain neutral spine in ALL exercises"],
    dailyTips: ["Stand up and walk for 2 minutes every 30-45 minutes of sitting","Sleep with a pillow between your knees (side sleeping) or under your knees (back sleeping)","Avoid bending forward to pick things up — squat down instead by bending your knees","When carrying groceries, distribute weight evenly in both hands","Avoid soft couches that make your pelvis sink — sit on firm surfaces","Do cat-cow and bird dog every morning for 5 minutes to hydrate the disc","Strengthen your core daily — even 5 minutes of dead bugs and planks helps","Maintain a healthy weight — every kg lost reduces disc pressure significantly"],
    exercisesInPlan: ["Goblet Squat — front-loaded keeps torso upright, dramatically less L4-L5 load","Cable Pull-Through — replaces RDL, trains hip hinge with zero lumbar compression","Trap Bar Deadlift (light) — weight at sides eliminates forward shear force","Dead Bug — #1 disc-safe core exercise, trains deep stabilizers","Plank — isometric neutral spine hold, builds endurance","Pallof Press — anti-rotation training protects disc during twisting","Bird Dog — used in physiotherapy for disc rehabilitation","Hip Thrust — loads glutes with spine in neutral, corrects pelvic tilt","Chest Supported Row — zero spinal load, safest row variation"],
  },
  {
    name: "Cervical Spine Issue (Radiating Neck Pain)",
    icon: "\u{1F3E5}",
    color: "var(--orange)",
    what: "You experience occasional radiating pain from your neck. This could indicate cervical disc irritation, nerve compression, or muscular tension in the cervical spine. The radiating pattern suggests possible nerve involvement. A professional assessment (Orthopade referral from your Hausarzt) with potential cervical MRI is recommended.",
    causes: "Forward head posture (your head sits ~2-3cm ahead of shoulders, adding ~4.5kg of load per inch), prolonged phone/computer use, tight upper trapezius and suboccipital muscles, weak deep neck flexors, thoracic stiffness forcing the neck to compensate.",
    symptoms: ["Pain at the base of the skull or sides of the neck","Radiating pain, tingling, or numbness into shoulders or arms","Headaches (often starting from the back of the head)","Stiffness when turning your head, especially in the morning","Pain worsening with prolonged screen time or overhead reaching"],
    avoid: ["Behind-the-neck pulldowns or presses (extreme cervical stress)","Heavy overhead pressing without thoracic mobility","Barbell shrugs with forward head lean","Any exercise causing radiating arm pain — STOP immediately","Neck bridges or direct heavy neck loading","Looking up sharply during exercises (keep neck neutral)","Sleeping on your stomach (twists the cervical spine)"],
    doInstead: ["Chin tucks (retraction exercises) — pull chin straight back to create a double chin, hold 5s","Gentle cervical nods from the warm-up protocol — daily, even on rest days","Face pulls with external rotation — strengthens muscles supporting cervical spine","Wall slides — activates lower traps that decompress the neck","Thoracic extension and rotation — reduces compensation demands on the neck","Seated overhead press with back support (reduces cervical compensation)","Landmine press as alternative if overhead pressing causes pain"],
    dailyTips: ["Set up your computer screen at eye level — top of screen at eye height","Hold your phone at eye level, not down in your lap","Take screen breaks every 20 minutes — look away and do 5 chin tucks","Sleep on your back or side with a supportive pillow that keeps your neck neutral","Avoid carrying heavy bags on one shoulder","Do 10 chin tucks + 10 gentle cervical nods twice daily (morning and evening)","Apply warmth (not ice) to tense neck muscles for 10 minutes in the evening","See an Orthopade in Germany — your Hausarzt can refer you for evaluation and possible MRI"],
    exercisesInPlan: ["Cervical Gentle Nods — daily neck mobility in every warm-up","Face Pull with external rotation — #1 exercise for neck-supporting muscles","Wall Slides — activates lower traps that decompress cervical spine","Chest Supported Row — no neck strain, fully supported","Thoracic Rotation — unlocks thoracic stiffness causing neck compensation","Band Pull-Apart — strengthens rear delts and rhomboids supporting cervical posture","Prone Y-T-W — lower trap and serratus activation for scapular stability"],
  },
  {
    name: "Forward Head Posture",
    icon: "\u{1F4F1}",
    color: "var(--purple)",
    what: "Your head sits approximately 2-3cm ahead of your shoulder line (visible in side photos). The ear should align vertically with the shoulder joint. Every 2.5cm forward adds roughly 4.5kg of effective load on the cervical spine.",
    causes: "Prolonged computer/phone use, weak deep neck flexors, tight upper trapezius and suboccipital muscles, thoracic kyphosis (upper back rounding).",
    symptoms: ["Neck pain and tension headaches","Jaw tightness (TMJ issues)","Reduced shoulder mobility","Appearance of a 'tech neck' or forward head"],
    avoid: ["Looking down at phone for extended periods","Sleeping with too many pillows (pushes head forward)","Carrying heavy backpacks that pull shoulders back and head forward"],
    doInstead: ["Chin tucks — 10 reps, 3 times daily","Face pulls — in every pull workout","Wall slides — in every warm-up","Thoracic extension on foam roller"],
    dailyTips: ["Chin tucks at your desk every hour","Screen at eye level","Strengthen posterior chain with rows and face pulls","Stretch chest daily"],
    exercisesInPlan: ["Every pull exercise (rows, face pulls, band pull-aparts) directly corrects this","Wall slides in warm-up activate the lower traps","Thoracic rotation in warm-up unlocks the upper back"],
  },
  {
    name: "Rounded Shoulders (Protracted Scapulae)",
    icon: "\u{1F9CD}",
    color: "var(--blue)",
    what: "Both shoulders roll inward and forward. Shoulder blades are not flat against your ribcage but wing slightly outward. This is part of 'upper crossed syndrome' — tight anterior muscles + weak posterior muscles.",
    causes: "Tight pectorals (chest), weak rhomboids, mid-traps, and lower traps. Serratus anterior weakness contributing to scapular winging. Desk posture reinforcing the position.",
    symptoms: ["Reduced overhead reach","Shoulder impingement risk (pinching rotator cuff)","Chest looks flatter than it should","Slumped appearance"],
    avoid: ["Excessive bench pressing without balancing with pulls","Rounded-forward position during exercises","Ignoring rear deltoid and upper back work"],
    doInstead: ["2:1 pulling to pushing ratio (every push workout has more pull volume)","Face pulls in every pull session","Band pull-aparts in warm-up AND workout","Chest doorway stretch daily"],
    dailyTips: ["Squeeze shoulder blades together 10 times every hour at your desk","Open your chest with doorway stretches morning and night","Avoid crossing arms habitually — it reinforces the rounding"],
    exercisesInPlan: ["Face Pulls (4x15 in every pull day)","Band Pull-Aparts (warm-up + pull days)","Chest Supported Row (targets mid-back)","Prone Y-T-W (scapular stabilizers)","Wall Slides (lower trap activation)"],
  },
  {
    name: "Mild Anterior Pelvic Tilt",
    icon: "\u{1F9CD}\u{200D}\u{2642}\u{FE0F}",
    color: "var(--yellow)",
    what: "Your pelvis tilts forward — belt line dips at the front, exaggerated lumbar curve. This directly increases compressive forces on L4-L5 disc and makes your belly look larger than it is.",
    causes: "Tight hip flexors (from sitting) + weak glutes + weak lower abdominals. Hip flexors pull front of pelvis down, weak glutes fail to counteract.",
    symptoms: ["Lower back pain and tightness","Belly appearing larger than actual fat level","Reduced glute activation in exercises","Increased L4-L5 disc pressure"],
    avoid: ["Excessive lumbar arching during exercises","Sitting for prolonged periods without hip flexor breaks","Ignoring glute training"],
    doInstead: ["Hip flexor stretching (45s each side, daily)","Glute bridges and hip thrusts","Dead bugs with posterior pelvic tilt cue","Planks with 'ribs down' cue"],
    dailyTips: ["Stand up and do 10 hip flexor stretches every hour of sitting","Squeeze your glutes when standing (builds the habit of neutral pelvis)","When standing in line, tuck your pelvis slightly — practice neutral alignment","Sleep with a pillow under your knees if on your back"],
    exercisesInPlan: ["Hip Thrust (4x12) — #1 glute strengthener, directly corrects tilt","Hip Flexor Rockback in every warm-up","Glute Bridge in every warm-up","Dead Bug — trains core with posterior tilt cue","Plank with 'ribs down' cue — teaches corrected position"],
  },
];

// ─── HELPERS ───
function getWeekNum(d) {
  const diff = Math.floor((d - PLAN_START)/(864e5));
  return diff < 0 ? -1 : Math.floor(diff/7)+1;
}
function getPhase(wk) {
  if(wk<=4) return {name:"Foundation (Wk 1-4)",tip:"Learn correct form. RPE 6-7. Finish sets feeling you could do 3-4 more.",color:"var(--green)"};
  if(wk<=8) return {name:"Building (Wk 5-8)",tip:"Add weight when you hit top of rep range. RPE 7-8.",color:"var(--blue)"};
  if(wk<=11) return {name:"Intensification (Wk 9-11)",tip:"Push toward PRs. RPE 8-9. Add drop sets on isolation moves.",color:"var(--orange)"};
  return {name:"Deload (Wk 12)",tip:"All weights -40-50%. RPE 4-5. Planned recovery.",color:"var(--purple)"};
}
function getDayInfo(d) {
  const wk = getWeekNum(d);
  if(wk<1||wk>12) return null;
  const dow = d.getDay();
  const wk_key = WORKOUT_MAP[dow];
  if(wk_key) return {type:'workout',key:wk_key,...WORKOUT_LABELS[wk_key],exercises:EXERCISES[wk_key],weekNum:wk,phase:getPhase(wk),isLegDay:LEG_DAYS.includes(wk_key)};
  if(REST_DAYS[dow]) return {type:'recovery',...REST_DAYS[dow],weekNum:wk,phase:getPhase(wk)};
  return null;
}
function getCardio(type, wk) {
  if(type.startsWith('push')) return wk%2===1?CARDIO_STEADY:CARDIO_PROGRESSIVE;
  return wk%2===1?CARDIO_INTERVALS:CARDIO_STEADY;
}
