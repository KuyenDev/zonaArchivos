// ════════════════════════════════
//  SISTEMA DE ARCHIVOS — ZONA
// ════════════════════════════════

// ── UTILS ──────────────────────
function $(id){ return document.getElementById(id); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

// ── GLITCH RANDOM ──────────────
function randomGlitch(){
  const els = document.querySelectorAll('.section-title,.panel-title,.faction-name-ru,.taum-title');
  if(!els.length) return;
  const el = els[Math.floor(Math.random()*els.length)];
  const orig = el.textContent;
  const chars = '░▒▓█▄▀■□▪▫';
  el.style.transition='none';
  let i=0;
  const iv = setInterval(()=>{
    if(i>6){ clearInterval(iv); el.textContent=orig; el.style.color=''; return; }
    el.textContent = orig.split('').map(c=>Math.random()<0.15?chars[Math.floor(Math.random()*chars.length)]:c).join('');
    if(i===3) el.style.color='#cc4444';
    i++;
  },60);
}

setInterval(()=>{ if(Math.random()<0.3) randomGlitch(); }, 7000+Math.random()*8000);

// ── TOPBAR CLOCK ───────────────
function updateClock(){
  const now = new Date();
  const h=String(now.getHours()).padStart(2,'0');
  const m=String(now.getMinutes()).padStart(2,'0');
  const s=String(now.getSeconds()).padStart(2,'0');
  $('topbar-time').textContent=`${h}:${m}:${s}`;
}
setInterval(updateClock,1000);

// ── GLOBALS ────────────────────
let currentUser = '';
let currentRole = '';
let currentLevel = '';

// ── LOGIN ──────────────────────
function doLogin(){
  const user = $('login-user').value.trim().toLowerCase();
  const pass = $('login-pass').value.trim();
  const st = $('login-status');
  
  if(!user || !pass){ 
    st.className='login-status error'; 
    st.textContent='ERROR — CAMPOS INCOMPLETOS'; 
    return; 
  }
  
  st.className='login-status'; 
  st.textContent='VERIFICANDO CREDENCIALES...';
  
  setTimeout(()=>{
    if(user === 'admin' && pass === 'zona1991') {
      currentUser = 'ADMINISTRADOR-01';
      currentRole = 'admin';
      currentLevel = 'DIRECTOR';
      st.className='login-status ok'; 
      st.textContent='ACCESO CONCEDIDO — CARGANDO SISTEMA (DIRECTOR)';
      setTimeout(startLoading, 800);
    } else if (user === 'operador' && pass === 'visor') {
      currentUser = 'OPERADOR-██';
      currentRole = 'user';
      currentLevel = 'NIVEL-3';
      st.className='login-status ok'; 
      st.textContent='ACCESO CONCEDIDO — CARGANDO SISTEMA (LIMITADO)';
      setTimeout(startLoading, 800);
    } else {
      st.className='login-status error'; 
      st.textContent='ERROR — CREDENCIALES INVÁLIDAS'; 
    }
  },1200);
}

$('login-user').addEventListener('keydown',e=>{ if(e.key==='Enter') doLogin(); });
$('login-pass').addEventListener('keydown',e=>{ if(e.key==='Enter') doLogin(); });

function doLogout(){
  $('app').style.display='none';
  $('screen-login').style.display='flex';
  $('login-user').value='';
  $('login-pass').value='';
  $('login-status').textContent='SISTEMA EN ESPERA — ВВЕДИТЕ ДАННЫЕ';
  $('login-status').className='login-status';
  currentUser = '';
  currentRole = '';
  currentLevel = '';
}

// ── LOADING ─────────────────────
const loadMessages=[
  ['ИНИЦИАЛИЗАЦИЯ...','Iniciando núcleo del sistema...',''],
  ['ПРОВЕРКА КЛЮЧЕЙ','Verificando claves de acceso...','ok'],
  ['CARGANDO ARCHIVOS','Módulo: REGISTROS GENERALES...','ok'],
  ['CARGANDO ARCHIVOS','Módulo: BASE DE DATOS ENTIDADES...','ok'],
  ['ADVERTENCIA','Módulo: ZN-ENT-G03 — integridad comprometida','warn'],
  ['CARGANDO ARCHIVOS','Módulo: FACCIONES ACTIVAS...','ok'],
  ['ERROR','Sector ██ — acceso no disponible','err'],
  ['ВОССТАНОВЛЕНИЕ','Recuperando datos parciales...','warn'],
  ['CARGANDO ARCHIVOS','Módulo: SISTEMA DE MONITOREO...','ok'],
  ['VERIFICANDO','Registro taumatúrgico — en línea','ok'],
  ['ADVERTENCIA','3 brechas activas detectadas','warn'],
  ['SISTEMA LISTO','Acceso concedido — Nivel 3','ok'],
];

async function startLoading(){
  $('screen-login').style.display='none';
  
  if($('topbar-access-level')) $('topbar-access-level').textContent = currentLevel;
  if($('session-user')) $('session-user').textContent = currentUser;
  loadMessages[loadMessages.length - 1][1] = 'Acceso concedido — ' + currentLevel;
  
  const sl=$('screen-loading');
  sl.style.display='flex';
  const log=$('load-log');
  const bar=$('load-bar');
  const pct=$('load-pct');
  log.innerHTML='';
  
  for(let i=0;i<loadMessages.length;i++){
    const [cat,msg,type]=loadMessages[i];
    const p=document.createElement('div');
    p.className='load-line';
    const prefix=type==='ok'?'<span class="ok">[OK] </span>':type==='err'?'<span class="err">[ERR]</span>':type==='warn'?'<span class="warn">[WAR]</span>':'[...] ';
    p.innerHTML=`${prefix}<span style="opacity:0.5">${cat}</span> — ${msg}`;
    log.appendChild(p);
    await sleep(30);
    p.classList.add('show');
    const pctVal=Math.round(((i+1)/loadMessages.length)*100);
    bar.style.width=pctVal+'%';
    pct.textContent=pctVal+'%';
    await sleep(180+Math.random()*200);
  }
  await sleep(600);
  sl.style.display='none';
  const app=$('app');
  app.style.display='flex';
  app.style.flexDirection='column';
  initMonitor();
  updateClock();
}

// ── NAVIGATION ──────────────────
function navTo(page){
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const idx={'lore':0,'factions':1,'entities':2,'monitor':3};
  document.querySelectorAll('.nav-item')[idx[page]].classList.add('active');
  document.querySelectorAll('.section-page').forEach(p=>p.classList.remove('active'));
  $('page-'+page).classList.add('active');
}

// ── PANEL TOGGLE ────────────────
function togglePanel(id){
  const p=$(id);
  p.classList.toggle('open');
}

// ── UNLOCK SECTION ──────────────
function unlockSection(id, inputId){
  const val=$(inputId).value.trim();
  const msg=$(id+'-msg');
  const content=$(id+'-content');
  const lock = $(inputId).closest('.locked-section');
  if(!val){ msg.textContent='ERROR — CÓDIGO REQUERIDO'; return; }
  msg.textContent='VERIFICANDO...';
  setTimeout(()=>{
    // any code works
    msg.textContent='✓ ACCESO CONCEDIDO';
    setTimeout(()=>{
      lock.style.opacity='0.3';
      lock.style.pointerEvents='none';
      if(content) content.style.display='block';
    },500);
  },900);
}

// ════════════════════════════════
//  MONITOR MODULE
// ════════════════════════════════
let taumCtx, taumData=[], taumT=0;
let breachCtx, breachAngle=0, breachTarget=0, breachVal=0;
let currentBreach='sealed';

function initMonitor(){
  initTaumaturgic();
  initBreachDetector();
  initSectorChart();
  initEventLog();
  initAnomalyTable();
  setInterval(updateStats,1000);
}

// ── TAUMATURGIC CANVAS ──────────
function initTaumaturgic(){
  const canvas = $('taum-canvas');
  if(!canvas) return;
  canvas.width = canvas.offsetWidth || 600;
  taumCtx = canvas.getContext('2d');
  // init data
  for(let i=0;i<canvas.width;i++) taumData.push(0);
  requestAnimationFrame(drawTaum);
}

function taumSignal(t){
  // EKG-like pattern with anomaly spikes
  const base = Math.sin(t*0.08)*3 + Math.sin(t*0.02)*2;
  // heartbeat pattern every ~60 frames
  const phase = t%60;
  let beat=0;
  if(phase===0) beat=28;
  else if(phase===2) beat=-12;
  else if(phase===4) beat=22;
  else if(phase===6) beat=-8;
  else if(phase===8) beat=4;
  // random anomaly spikes
  const spike = Math.random()<0.004 ? (Math.random()-0.5)*40 : 0;
  return base+beat+spike;
}

let taumFrame=0;
function drawTaum(){
  requestAnimationFrame(drawTaum);
  const canvas=$('taum-canvas');
  if(!canvas || !taumCtx) return;
  taumFrame++;
  taumData.push(taumSignal(taumT++));
  if(taumData.length>canvas.width) taumData.shift();

  taumCtx.clearRect(0,0,canvas.width,canvas.height);
  const h=canvas.height/2;

  // grid lines
  taumCtx.strokeStyle='rgba(58,46,26,0.4)';
  taumCtx.lineWidth=0.5;
  for(let y=0;y<canvas.height;y+=16){
    taumCtx.beginPath(); taumCtx.moveTo(0,y); taumCtx.lineTo(canvas.width,y); taumCtx.stroke();
  }
  for(let x=0;x<canvas.width;x+=40){
    taumCtx.beginPath(); taumCtx.moveTo(x,0); taumCtx.lineTo(x,canvas.height); taumCtx.stroke();
  }

  // center line
  taumCtx.strokeStyle='rgba(139,26,26,0.2)';
  taumCtx.lineWidth=0.8;
  taumCtx.beginPath(); taumCtx.moveTo(0,h); taumCtx.lineTo(canvas.width,h); taumCtx.stroke();

  // main signal
  const grad=taumCtx.createLinearGradient(0,0,canvas.width,0);
  grad.addColorStop(0,'rgba(200,168,75,0.2)');
  grad.addColorStop(0.7,'rgba(200,168,75,0.7)');
  grad.addColorStop(1,'rgba(200,168,75,1)');

  taumCtx.beginPath();
  taumCtx.strokeStyle=grad;
  taumCtx.lineWidth=1.5;
  taumCtx.shadowColor='rgba(200,168,75,0.4)';
  taumCtx.shadowBlur=4;
  for(let i=0;i<taumData.length;i++){
    const x=i;
    const y=h-taumData[i];
    if(i===0) taumCtx.moveTo(x,y);
    else taumCtx.lineTo(x,y);
  }
  taumCtx.stroke();
  taumCtx.shadowBlur=0;

  // peak highlight — last spike
  const last=taumData[taumData.length-1];
  if(Math.abs(last)>15){
    taumCtx.beginPath();
    taumCtx.arc(canvas.width-1,h-last,3,0,Math.PI*2);
    taumCtx.fillStyle='#cc2222';
    taumCtx.shadowColor='#cc2222';
    taumCtx.shadowBlur=8;
    taumCtx.fill();
    taumCtx.shadowBlur=0;
  }
}

// ── BREACH DETECTOR ─────────────
const breachStates=[
  {label:'PERÍMETRO SELLADO',desc:'Integridad del muro exterior confirmada. Sin movimiento detectado en zonas de exclusión.',cls:'sealed',color:'#4a8a4a',angle:0.15},
  {label:'ADVERTENCIA ACTIVA',desc:'Actividad anómala elevada en sector norte. Monitoreo intensificado.',cls:'warning',color:'#c8a020',angle:0.55},
  {label:'BRECHA DETECTADA',desc:'Apertura no autorizada detectada — Sector ██. Protocolo de contención activo.',cls:'breach',color:'#cc2222',angle:0.88},
];
let breachStateIdx=0, breachChangeT=0;

function initBreachDetector(){
  const canvas=$('breach-canvas');
  if(!canvas) return;
  breachCtx=canvas.getContext('2d');
  setBreach(0);
  requestAnimationFrame(drawBreach);
  // cycle states every ~12s
  setInterval(()=>{
    breachStateIdx=(breachStateIdx+1)%3;
    setBreach(breachStateIdx);
  },12000+Math.random()*6000);
  buildSectorGrid();
}

function setBreach(idx){
  const s=breachStates[idx];
  breachTarget=s.angle;
  $('breach-label').textContent=s.label;
  $('breach-desc').textContent=s.desc;
  const dot=$('breach-dot');
  dot.className='breach-indicator '+s.cls;
}

function drawBreach(){
  requestAnimationFrame(drawBreach);
  if(!breachCtx) return;
  const c=$('breach-canvas');
  breachCtx.clearRect(0,0,c.width,c.height);
  const cx=c.width/2, cy=c.height/2, r=56;

  // ease toward target
  breachVal+=(breachTarget-breachVal)*0.03;

  // arco de fondo
  breachCtx.beginPath();
  breachCtx.arc(cx,cy,r,Math.PI*0.75,Math.PI*2.25,false);
  breachCtx.strokeStyle='rgba(58,46,26,0.6)';
  breachCtx.lineWidth=8;
  breachCtx.stroke();

  // arco de valor
  const state=breachStates[breachStateIdx];
  const startA=Math.PI*0.75;
  const endA=Math.PI*0.75+Math.PI*1.5*breachVal;
  const grd=breachCtx.createLinearGradient(cx-r,cy,cx+r,cy);
  grd.addColorStop(0,'#4a8a4a');
  grd.addColorStop(0.5,'#c8a020');
  grd.addColorStop(1,'#cc2222');

  breachCtx.beginPath();
  breachCtx.arc(cx,cy,r,startA,endA,false);
  breachCtx.strokeStyle=grd;
  breachCtx.lineWidth=8;
  breachCtx.shadowColor=state.color;
  breachCtx.shadowBlur=12;
  breachCtx.stroke();
  breachCtx.shadowBlur=0;

  // aguja
  const angle=startA+Math.PI*1.5*breachVal;
  const nx=cx+Math.cos(angle)*(r-4);
  const ny=cy+Math.sin(angle)*(r-4);
  breachCtx.beginPath();
  breachCtx.moveTo(cx,cy);
  breachCtx.lineTo(nx,ny);
  breachCtx.strokeStyle=state.color;
  breachCtx.lineWidth=2;
  breachCtx.shadowColor=state.color;
  breachCtx.shadowBlur=6;
  breachCtx.stroke();
  breachCtx.shadowBlur=0;

  // punto central
  breachCtx.beginPath();
  breachCtx.arc(cx,cy,5,0,Math.PI*2);
  breachCtx.fillStyle='var(--bg3)';
  breachCtx.fill();
  breachCtx.strokeStyle=state.color;
  breachCtx.lineWidth=1.5;
  breachCtx.stroke();

  // etiquetas
  breachCtx.font='700 9px Oswald, sans-serif';
  breachCtx.fillStyle='#4a8a4a';
  breachCtx.textAlign='left';
  breachCtx.fillText('SELLADO',cx-r-6,cy+r*0.5);
  breachCtx.fillStyle='#cc2222';
  breachCtx.textAlign='right';
  breachCtx.fillText('BRECHA',cx+r+6,cy+r*0.5);

  // porcentaje
  const pct=Math.round(breachVal*100);
  breachCtx.font='600 18px Oswald, sans-serif';
  breachCtx.fillStyle=state.color;
  breachCtx.textAlign='center';
  breachCtx.shadowColor=state.color;
  breachCtx.shadowBlur=8;
  breachCtx.fillText(pct+'%',cx,cy+8);
  breachCtx.shadowBlur=0;

  breachCtx.font='400 8px Oswald, sans-serif';
  breachCtx.fillStyle='rgba(180,160,120,0.5)';
  breachCtx.fillText('RIESGO',cx,cy+20);
}

function buildSectorGrid(){
  const grid=$('sector-grid');
  const sectors=['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ'];
  const states=['NORMAL','NORMAL','ALERTA','NORMAL','ACTIVO','NORMAL','NORMAL','ALERTA','NORMAL','NORMAL','ACTIVO','NORMAL'];
  grid.innerHTML=sectors.map((s,i)=>`
    <div class="sector-cell${states[i]==='ACTIVO'?' active':''}">
      <span class="sector-cell-id">SEC-${s}</span>
      <span class="sector-cell-val">${states[i]}</span>
    </div>
  `).join('');
}

// ── SECTOR CHART ─────────────────
function initSectorChart(){
  const c=$('sector-chart');
  if(!c) return;
  const ctx=c.getContext('2d');
  const data=[12,8,31,14,22,9,18,7,25,11,29,6];
  const labels=['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ'];
  const max=Math.max(...data);
  const bw=(c.width-40)/data.length;
  ctx.clearRect(0,0,c.width,c.height);

  // grid
  ctx.strokeStyle='rgba(58,46,26,0.4)';
  ctx.lineWidth=0.5;
  for(let y=10;y<c.height-20;y+=30){
    ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(c.width,y);ctx.stroke();
  }

  data.forEach((v,i)=>{
    const x=30+i*bw+bw*0.15;
    const h=(v/max)*(c.height-35);
    const y=c.height-20-h;
    const grd=ctx.createLinearGradient(0,y,0,c.height-20);
    grd.addColorStop(0,v>25?'rgba(204,34,34,0.9)':v>18?'rgba(200,160,32,0.8)':'rgba(139,26,26,0.7)');
    grd.addColorStop(1,'rgba(139,26,26,0.1)');
    ctx.fillStyle=grd;
    ctx.fillRect(x,y,bw*0.7,h);
    ctx.fillStyle='rgba(180,160,120,0.5)';
    ctx.font='8px Oswald, sans-serif';
    ctx.textAlign='center';
    ctx.fillText(labels[i],x+bw*0.35,c.height-8);
  });
}

// ── EVENT LOG ────────────────────
const logEvents=[
  ['03:17','BRECHA','Apertura tipo BETA — Sector γ — Duración: en curso','red'],
  ['04:02','ENTIDAD','Sombra animada detectada — Edificio 14, Sector ε','warn'],
  ['05:44','TAUMATÚRGICO','Pico de frecuencia anómala 2.4x media — Zona central','warn'],
  ['07:11','PERSONAL','Unidad Delta-3 — sin respuesta desde 06:50','red'],
  ['08:33','PERÍMETRO','Movimiento detectado — Zona exclusión Norte','warn'],
  ['09:15','SISTEMA','Sector ι — datos inaccesibles · CAUSA DESCONOCIDA','red'],
  ['11:22','BRECHA','Cierre confirmado tipo ALFA — Sector λ','ok'],
  ['12:07','ENTIDAD','Actividad carroñera elevada — Zona residencial S',''],
  ['14:55','TAUMATÚRGICO','Normalización temporal de señal — duración: 3min','ok'],
  ['16:33','PERSONAL','Peredel — contacto interrumpido en sector β','warn'],
  ['18:01','SISTEMA','Actualización de registro — protocolo automático','ok'],
  ['19:47','BRECHA','Actividad anómala en perímetro — Sector α · MONITOREO','warn'],
  ['21:13','ENTIDAD','Fauna alterada — movimiento en manada — Sector δ','red'],
  ['22:58','TAUMATÚRGICO','Evento sin clasificación — duración: 8 segundos','red'],
  ['23:41','SISTEMA','Error en datos: Sector ζ — CAUSA DESCONOCIDA','red'],
];

function initEventLog(){
  const el=$('event-log');
  if(!el) return;
  el.innerHTML=logEvents.map(([t,cat,msg,cls])=>`
    <div style="display:flex;gap:8px;border-bottom:1px solid rgba(58,46,26,0.3);padding:3px 0;">
      <span style="color:var(--cream3);opacity:0.5;flex-shrink:0;font-size:9px;">${t}</span>
      <span style="color:${cls==='red'?'var(--red3)':cls==='warn'?'#c8a020':cls==='ok'?'var(--gold)':'var(--cream3)'};font-size:9px;width:90px;flex-shrink:0;">${cat}</span>
      <span style="color:var(--cream3);font-size:9px;">${msg}</span>
    </div>
  `).join('');
}

// ── ANOMALY TABLE ─────────────────
const anomalies=[
  ['ANM-001','Gravitacional','Sector γ','ACTIVO','ALTO',true],
  ['ANM-002','Temporal','Sector ε','ACTIVO','CRÍTICO',true],
  ['ANM-003','Portal inestable','Sector α','EN MONITOREO','MEDIO',false],
  ['ANM-004','Interferencia EM','Sector η','ACTIVO','MEDIO',false],
  ['ANM-005','Distorsión espacial','Sector λ','SELLADO','BAJO',false],
  ['ANM-006','Tipo no clasificado','Sector ζ','DATOS CORRUPTOS','???',true],
  ['ANM-007','Energía anómala','Sector β','ACTIVO','ALTO',true],
  ['ANM-008','Sin clasificación','Sector ι','ILEGIBLE','???',true],
];

function initAnomalyTable(){
  const tb=$('anomaly-table-body');
  if(!tb) return;
  $('anomaly-count').textContent=anomalies.filter(a=>a[3]==='ACTIVO').length;
  tb.innerHTML=anomalies.map(([id,tipo,sec,est,niv,locked])=>`
    <tr style="border-bottom:1px solid rgba(58,46,26,0.3);">
      <td style="padding:7px 12px;font-family:var(--font-title);font-size:10px;letter-spacing:1px;color:var(--gold3);">${id}</td>
      <td style="padding:7px 12px;color:var(--cream2);font-size:11px;">${tipo}</td>
      <td style="padding:7px 12px;color:var(--cream3);font-size:11px;">${sec}</td>
      <td style="padding:7px 12px;">
        <span style="font-size:9px;letter-spacing:1px;color:${est==='ACTIVO'?'var(--red3)':est==='SELLADO'?'#4a8a4a':est==='EN MONITOREO'?'#c8a020':'#888'};">${est}</span>
      </td>
      <td style="padding:7px 12px;">
        <span class="threat-badge ${niv==='CRÍTICO'?'critico':niv==='ALTO'?'alto':niv==='MEDIO'?'medio':niv==='BAJO'?'bajo':'desconocido'}" style="padding:1px 6px;font-size:9px;">${niv}</span>
      </td>
      <td style="padding:7px 12px;">
        ${locked?`<span style="color:var(--red3);font-size:9px;letter-spacing:1px;cursor:pointer;" onclick="requestAccess('${id}')">🔒 RESTRINGIDO</span>`
        :`<span style="color:var(--cream3);font-size:9px;">VISIBLE</span>`}
      </td>
    </tr>
  `).join('');
}

function requestAccess(id){
  alert('ACCESO DENEGADO — '+id+'\nClasificación: NIVEL DIRECTOR\nContacte a su supervisor.');
}

// ── STATS UPDATER ─────────────────
function updateStats(){
  const freq=(0.8+Math.random()*1.4).toFixed(2);
  const intv=(15+Math.random()*40).toFixed(1);
  const ev=Math.floor(3+Math.random()*8);
  const fEl=$('taum-freq'); if(fEl) fEl.textContent=freq+' Hz';
  const iEl=$('taum-int'); if(iEl) iEl.textContent=intv;
  const eEl=$('taum-ev'); if(eEl) eEl.textContent=ev;
}

// ── MODAL ──────────────────────────
function openModal(title, id, html){
  $('modal-title').textContent=title;
  $('modal-id').textContent=id;
  $('modal-body').innerHTML=html;
  $('modal-overlay').classList.add('open');
}

function closeModal(e){
  if(!e || e.target===$('modal-overlay')) $('modal-overlay').classList.remove('open');
}

// ── AMBIENT COUNTER ───────────────
setInterval(()=>{
  const n=Math.floor(5+Math.random()*12);
  const el=$('anomaly-count');
  if(el) el.textContent=n;
},8000);

// ── PERIMETER FLICKER ─────────────
const periStates=['ACTIVO','ACTIVO','ALERTA','ACTIVO','ACTIVO'];
let periIdx=0;
setInterval(()=>{
  periIdx=(periIdx+1)%periStates.length;
  const el=$('perimeter-status');
  if(el){
    el.textContent=periStates[periIdx];
    el.className='topbar-stat-val '+(periStates[periIdx]==='ALERTA'?'red':'gold');
  }
},9000);

// ── INIT ──────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  updateClock();
});