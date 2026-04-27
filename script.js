// ── UTILS ──────────────────────────────────────
const R4 = v => Math.round(v*10000)/10000;
const fN  = v => v < 0 ? `(${v})` : `${v}`;
const fSq = v => v < 0 ? `(${v})^2` : `${v}^2`;
function dot3(u,v){ return u[0]*v[0]+u[1]*v[1]+u[2]*v[2]; }
function norm3(u){ return Math.sqrt(dot3(u,u)); }
function cross3(u,v){ return [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; }
function collinear3(u,v){ const c=cross3(u,v); return norm3(c)<1e-9; }

// ── CALCULATEURS ──────────────────────────────────────
function calcDroite(){
  const ax=+document.getElementById('dr-ax').value, ay=+document.getElementById('dr-ay').value, az=+document.getElementById('dr-az').value;
  const bx=+document.getElementById('dr-bx').value, by=+document.getElementById('dr-by').value, bz=+document.getElementById('dr-bz').value;
  const dx=bx-ax, dy=by-ay, dz=bz-az;
  const el=document.getElementById('droite-res');
  const mkTerm=(v0,dv,v)=>`${v0} ${dv>=0?'+':'-'} ${Math.abs(dv)}t`;
  el.innerHTML = `\\(\\overrightarrow{AB}=\\begin{pmatrix}${dx}\\\\${dy}\\\\${dz}\\end{pmatrix}\\) — \\(\\begin{cases}x=${mkTerm(ax,dx,'x')}\\\\y=${mkTerm(ay,dy,'y')}\\\\z=${mkTerm(az,dz,'z')}\\end{cases},\\ t\\in\\mathbb{R}\\)`;
  if(window.MathJax) MathJax.typeset([el]);
}
calcDroite();

function calcAppart(){
  const ax=+document.getElementById('ap-ax').value,ay=+document.getElementById('ap-ay').value,az=+document.getElementById('ap-az').value;
  const da=+document.getElementById('ap-da').value,db=+document.getElementById('ap-db').value,dc=+document.getElementById('ap-dc').value;
  const mx=+document.getElementById('ap-mx').value,my=+document.getElementById('ap-my').value,mz=+document.getElementById('ap-mz').value;
  const el=document.getElementById('appart-res');
  const d=[da,db,dc], A=[ax,ay,az], M=[mx,my,mz];
  const ts=[];
  for(let i=0;i<3;i++){ if(Math.abs(d[i])>1e-9) ts.push({i, t:(M[i]-A[i])/d[i]}); }
  if(!ts.length){ el.textContent='Vecteur directeur nul'; return; }
  const t0=ts[0].t;
  const consistent = ts.every(({t})=>Math.abs(t-t0)<1e-9);
  if(consistent){
    el.innerHTML=`\\(M\\in\\mathcal{D}\\) pour \\(t=${R4(t0)}\\) ✓`;
  } else {
    const details=ts.map(({i,t})=>`t_{${['x','y','z'][i]}}=${R4(t)}`).join(',\\;');
    el.innerHTML=`\\(M\\notin\\mathcal{D}\\) — valeurs de \\(t\\) incohérentes : \\(${details}\\)`;
  }
  if(window.MathJax) MathJax.typeset([el]);
}
calcAppart();

function calcPlanApp(){
  const a=+document.getElementById('pa-a').value, b=+document.getElementById('pa-b').value,
        c=+document.getElementById('pa-c').value, d=+document.getElementById('pa-d').value;
  const x=+document.getElementById('pa-x').value, y=+document.getElementById('pa-y').value, z=+document.getElementById('pa-z').value;
  const val=a*x+b*y+c*z+d;
  const el=document.getElementById('planapp-res');
  const terms=[[a,'x'],[b,'y'],[c,'z']].map(([co,v])=>`${fN(co)}\\times ${fN(v)}`).join('+')+`+(${d})`;
  el.innerHTML=`\\(${a}\\times${fN(x)}+${b}\\times${fN(y)}+${c}\\times${fN(z)}+${d}=${val}\\) — `
    +(Math.abs(val)<1e-9 ? `<strong style="color:var(--teal)">M appartient au plan ✓</strong>` : `<em style="color:var(--rust)">M n'appartient pas au plan (valeur = ${val})</em>`);
  if(window.MathJax) MathJax.typeset([el]);
}
calcPlanApp();

function calcConv(){
  const ax=+document.getElementById('cv-ax').value,ay=+document.getElementById('cv-ay').value,az=+document.getElementById('cv-az').value;
  const u1=+document.getElementById('cv-u1').value,u2=+document.getElementById('cv-u2').value,u3=+document.getElementById('cv-u3').value;
  const v1=+document.getElementById('cv-v1').value,v2=+document.getElementById('cv-v2').value,v3=+document.getElementById('cv-v3').value;
  const u=[u1,u2,u3], v=[v1,v2,v3];
  const n=cross3(u,v);
  const el=document.getElementById('conv-res');
  if(norm3(n)<1e-9){ el.textContent='⚠ u et v sont colinéaires — ils ne définissent pas un plan.'; return; }
  const [a,b,c]=n;
  const d=-(a*ax+b*ay+c*az);
  // Build equation string
  let eq='';
  [[a,'x'],[b,'y'],[c,'z']].forEach(([co,va],i)=>{
    if(co===0) return;
    if(eq&&co>0) eq+='+';
    if(co===-1) eq+='-'; else if(co!==1) eq+=co;
    eq+=va;
  });
  if(d>0) eq+=`+${d}`; else if(d<0) eq+=`${d}`;
  el.innerHTML=`\\(\\vec{u}\\wedge\\vec{v}=\\begin{pmatrix}${a}\\\\${b}\\\\${c}\\end{pmatrix}\\) — Équation : \\(${eq}=0\\)`;
  if(window.MathJax) MathJax.typeset([el]);
}
calcConv();

function calcIntersect(){
  const ax=+document.getElementById('ip-ax').value,ay=+document.getElementById('ip-ay').value,az=+document.getElementById('ip-az').value;
  const da=+document.getElementById('ip-da').value,db=+document.getElementById('ip-db').value,dc=+document.getElementById('ip-dc').value;
  const a=+document.getElementById('ip-a').value, b=+document.getElementById('ip-b').value,
        c=+document.getElementById('ip-c').value, d=+document.getElementById('ip-d').value;
  const k=a*da+b*db+c*dc;
  const val=a*ax+b*ay+c*az+d;
  const el=document.getElementById('intersect-res');
  if(Math.abs(k)>1e-9){
    const t=-val/k;
    const Ix=ax+t*da,Iy=ay+t*db,Iz=az+t*dc;
    el.innerHTML=`\\(\\vec{d}\\cdot\\vec{n}=${k}\\neq 0\\) — Intersection en \\(I=(${R4(Ix)};${R4(Iy)};${R4(Iz)})\\) pour \\(t^*=${R4(t)}\\)`;
  } else {
    const msg=Math.abs(val)<1e-9?`<strong style="color:var(--teal)">Droite incluse dans le plan</strong>`:`<em style="color:var(--rust)">Droite parallèle (disjointe)</em>`;
    el.innerHTML=`\\(\\vec{d}\\cdot\\vec{n}=0\\) — ${msg}`;
  }
  if(window.MathJax) MathJax.typeset([el]);
}
calcIntersect();

function calcDeuxPlans(){
  const a1=+document.getElementById('pp-a1').value,b1=+document.getElementById('pp-b1').value,
        c1=+document.getElementById('pp-c1').value,d1=+document.getElementById('pp-d1').value;
  const a2=+document.getElementById('pp-a2').value,b2=+document.getElementById('pp-b2').value,
        c2=+document.getElementById('pp-c2').value,d2=+document.getElementById('pp-d2').value;
  const n1=[a1,b1,c1], n2=[a2,b2,c2];
  const el=document.getElementById('deuxplans-res');
  if(collinear3(n1,n2)){
    // Trouver un point de P1
    let pt;
    if(Math.abs(a1)>1e-9) pt=[-d1/a1,0,0];
    else if(Math.abs(b1)>1e-9) pt=[0,-d1/b1,0];
    else pt=[0,0,-d1/c1];
    const inP2=Math.abs(a2*pt[0]+b2*pt[1]+c2*pt[2]+d2)<1e-9;
    el.innerHTML=inP2
      ? `\\(\\vec{n}_1\\parallel\\vec{n}_2\\) et point de \\(\\mathcal{P}_1\\in\\mathcal{P}_2\\) → <strong style="color:var(--teal)">Plans confondus</strong>`
      : `\\(\\vec{n}_1\\parallel\\vec{n}_2\\) mais plans distincts → <em style="color:var(--rust)">Plans parallèles</em>`;
  } else {
    const dPS=dot3(n1,n2);
    const cos_a=Math.abs(dPS)/(norm3(n1)*norm3(n2));
    const angle=Math.round(Math.acos(Math.min(1,cos_a))*180/Math.PI*100)/100;
    el.innerHTML=`Normales non colinéaires → <strong style="color:var(--copper2)">Plans sécants</strong> — angle dièdre \\(\\approx${angle}°\\)`;
  }
  if(window.MathJax) MathJax.typeset([el]);
}
calcDeuxPlans();

function calcAngle(){
  const type=document.getElementById('ang-type').value;
  const a1=+document.getElementById('ang-a1').value,b1=+document.getElementById('ang-b1').value,c1=+document.getElementById('ang-c1').value;
  const a2=+document.getElementById('ang-a2').value,b2=+document.getElementById('ang-b2').value,c2=+document.getElementById('ang-c2').value;
  const u=[a1,b1,c1], v=[a2,b2,c2];
  const n1=norm3(u), n2=norm3(v);
  const el=document.getElementById('angle-res');
  if(n1<1e-12||n2<1e-12){ el.textContent='Vecteur nul'; return; }
  const dp=dot3(u,v);
  let angle, formula, label;
  if(type==='dd'){
    angle=Math.acos(Math.min(1,Math.abs(dp)/(n1*n2)))*180/Math.PI;
    formula=`\\cos\\theta=\\dfrac{|\\vec{d}_1\\cdot\\vec{d}_2|}{\\|\\vec{d}_1\\|\\|\\vec{d}_2\\|}`;
    label='\\theta';
  } else if(type==='dp'){
    angle=Math.asin(Math.min(1,Math.abs(dp)/(n1*n2)))*180/Math.PI;
    formula=`\\sin\\varphi=\\dfrac{|\\vec{d}\\cdot\\vec{n}|}{\\|\\vec{d}\\|\\|\\vec{n}\\|}`;
    label='\\varphi';
  } else {
    angle=Math.acos(Math.min(1,Math.abs(dp)/(n1*n2)))*180/Math.PI;
    formula=`\\cos\\psi=\\dfrac{|\\vec{n}_1\\cdot\\vec{n}_2|}{\\|\\vec{n}_1\\|\\|\\vec{n}_2\\|}`;
    label='\\psi';
  }
  el.innerHTML=`\\(${formula}=\\dfrac{|${dp}|}{${R4(n1)}\\times${R4(n2)}}\\) → \\(${label}\\approx${R4(angle)}°\\)`;
  if(window.MathJax) MathJax.typeset([el]);
}
calcAngle();

// ── VISUALISEUR 3D — DROITES ──────────────────────────
let drMode='secantes', drRotX=0.4, drRotY=0.5, drDrag=false, drLX=0, drLY=0;
const drCanvas=document.getElementById('canvas-dr');
const drCtx=drCanvas.getContext('2d');
drCanvas.onmousedown=e=>{drDrag=true;drLX=e.clientX;drLY=e.clientY;};
drCanvas.onmousemove=e=>{if(!drDrag)return;drRotY+=(e.clientX-drLX)*0.012;drRotX+=(e.clientY-drLY)*0.012;drLX=e.clientX;drLY=e.clientY;drawDr();};
drCanvas.onmouseup=drCanvas.onmouseleave=()=>drDrag=false;
function setDrMode(m){drMode=m;['sect','paral','gauch'].forEach(id=>document.getElementById('bv-'+id).classList.remove('on'));document.getElementById('bv-'+(m==='secantes'?'sect':m==='paralleles'?'paral':'gauch')).classList.add('on');drawDr();}
function resetViz(){drRotX=0.4;drRotY=0.5;drawDr();}

function proj3D(x,y,z,W,H){
  const cX=Math.cos(drRotX),sX=Math.sin(drRotX),cY=Math.cos(drRotY),sY=Math.sin(drRotY);
  const x2=x*cY-z*sY, z2=x*sY+z*cY, y2=y*cX-z2*sX;
  return [W/2+x2*52, H/2-y2*52];
}

function drArrow(ctx,x1,y1,z1,x2,y2,z2,col,W,H){
  const [px1,py1]=proj3D(x1,y1,z1,W,H), [px2,py2]=proj3D(x2,y2,z2,W,H);
  ctx.strokeStyle=col; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(px1,py1); ctx.lineTo(px2,py2); ctx.stroke();
  const ang=Math.atan2(py2-py1,px2-px1);
  ctx.fillStyle=col;
  ctx.beginPath(); ctx.moveTo(px2,py2);
  ctx.lineTo(px2-9*Math.cos(ang-0.38),py2-9*Math.sin(ang-0.38));
  ctx.lineTo(px2-9*Math.cos(ang+0.38),py2-9*Math.sin(ang+0.38));
  ctx.closePath(); ctx.fill();
}
function drDot(ctx,x,y,z,col,W,H,lbl){
  const [px,py]=proj3D(x,y,z,W,H);
  ctx.fillStyle=col; ctx.beginPath(); ctx.arc(px,py,4,0,2*Math.PI); ctx.fill();
  if(lbl){ctx.font='bold 12px Inconsolata,monospace'; ctx.fillStyle=col; ctx.fillText(lbl,px+5,py-4);}
}
function drLine(ctx,x1,y1,z1,x2,y2,z2,col,W,H,dash=[]){
  const [px1,py1]=proj3D(x1,y1,z1,W,H),[px2,py2]=proj3D(x2,y2,z2,W,H);
  ctx.strokeStyle=col; ctx.lineWidth=2; ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(px1,py1); ctx.lineTo(px2,py2); ctx.stroke();
  ctx.setLineDash([]);
}

function drawDr(){
  const W=880,H=310, ctx=drCtx;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle=var2hex('--bg'); ctx.fillRect(0,0,W,H);

  // Grille légère
  ctx.strokeStyle='rgba(50,55,74,0.6)'; ctx.lineWidth=0.5;
  for(let i=-3;i<=3;i++){
    const [a,b]=proj3D(i,0,-3,W,H),[c,d]=proj3D(i,0,3,W,H);
    ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();
    const [e,f]=proj3D(-3,0,i,W,H),[g,hh]=proj3D(3,0,i,W,H);
    ctx.beginPath();ctx.moveTo(e,f);ctx.lineTo(g,hh);ctx.stroke();
  }

  // Axes
  drArrow(ctx,-2.5,0,0,2.5,0,0,'#c0403a',W,H);
  drArrow(ctx,0,-2.5,0,0,2.5,0,'#4db6ac',W,H);
  drArrow(ctx,0,0,-2.5,0,0,2.5,'#9c7de0',W,H);
  ctx.font='12px Inconsolata,monospace';
  [['x',2.6,0,0,'#c0403a'],['y',0,2.6,0,'#4db6ac'],['z',0,0,2.6,'#9c7de0']].forEach(([l,x,y,z,c])=>{
    const [px,py]=proj3D(x,y,z,W,H);
    ctx.fillStyle=c; ctx.fillText(l,px+3,py-3);
  });

  // Droites selon le mode
  if(drMode==='secantes'){
    drLine(ctx,-2,-1,0,2,1,0,'#e8a080',W,H);
    drLine(ctx,0,-1,-2,0,1,2,'#4db6ac',W,H);
    drDot(ctx,0,0,0,'#d4a840',W,H,'I');
    ctx.font='11px Inconsolata,monospace'; ctx.fillStyle='#a8a49c';
    ctx.fillText('Droites sécantes — point d\'intersection I',14,H-12);
  } else if(drMode==='paralleles'){
    drLine(ctx,-2,0.5,-1,2,0.5,1,'#e8a080',W,H);
    drLine(ctx,-2,-0.5,-1,2,-0.5,1,'#4db6ac',W,H);
    drLine(ctx,-1,0.5,-0.5,-1,-0.5,-0.5,'#5a5862',W,H,[4,4]);
    ctx.font='11px Inconsolata,monospace'; ctx.fillStyle='#a8a49c';
    ctx.fillText('Droites parallèles — même direction, pas de point commun',14,H-12);
  } else {
    drLine(ctx,-2,0,-2,2,0,2,'#e8a080',W,H);
    drLine(ctx,-2,1.5,0,2,-1.5,0,'#4db6ac',W,H);
    ctx.font='11px Inconsolata,monospace'; ctx.fillStyle='#a8a49c';
    ctx.fillText('Droites gauches — non coplanaires, non parallèles, sans point commun',14,H-12);
  }
}
function var2hex(name){ const s=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return s||'#191c22'; }
drawDr();

// ── PYODIDE ──────────────────────────────────────
let pyodide=null, pyoLoading=false;
const origCodes={};
document.querySelectorAll('.py-code').forEach(ta=>{ origCodes[ta.id]=ta.value; });
async function loadPyo(){
  if(pyodide) return true; if(pyoLoading) return false; pyoLoading=true;
  const st=document.getElementById('py-status'); st.textContent='⏳ Chargement Python…';
  try{
    const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
    document.head.appendChild(s); await new Promise((res,rej)=>{s.onload=res;s.onerror=rej;});
    pyodide=await window.loadPyodide();
    st.textContent='✓ Python prêt'; st.classList.add('ready'); setTimeout(()=>st.classList.add('hidden'),3000); return true;
  }catch(e){st.textContent='✗ Erreur Python'; return false;}
}
async function runPy(id){
  const code=document.getElementById(id+'-code').value;
  const out=document.getElementById(id+'-out');
  out.className='py-out active'; out.textContent='⏳ Exécution…'; out.style.color='#888';
  const ok=await loadPyo();
  if(!ok){out.className='py-out active error';out.textContent='Python non disponible.';return;}
  try{
    let stdout=''; pyodide.setStdout({batched:s=>stdout+=s+'\n'});
    await pyodide.runPythonAsync(code);
    out.className='py-out active'; out.style.color='#a6e3a1'; out.textContent=stdout||'(aucune sortie)';
  }catch(e){out.className='py-out active error';out.textContent='⚠ '+e.message;}
}
function dlPy(id){
  const code=document.getElementById(id+'-code').value;
  const fname=document.getElementById(id+'-code').closest('.py-block').querySelector('.py-title').textContent.trim();
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([code],{type:'text/plain'})); a.download=fname; a.click();
}
function rstPy(id){
  document.getElementById(id+'-code').value=origCodes[id+'-code'];
  const out=document.getElementById(id+'-out'); out.className='py-out'; out.textContent='';
}

// ── QCM ──────────────────────────────────────────────
const allQ=[
  {q:"La droite passant par \\(A(1;2;3)\\) et \\(B(3;4;5)\\) a pour vecteur directeur :",
   opts:["\\((1;2;3)\\)","\\((3;4;5)\\)","\\((2;2;2)\\)","\\((4;6;8)\\)"],ans:2,
   exp:"\\(\\overrightarrow{AB}=(3-1;4-2;5-3)=(2;2;2)\\)."},
  {q:"Un plan de l'espace peut se définir par :",
   opts:["Une équation cartésienne unique","Deux équations cartésiennes","Une représentation paramétrique avec 1 paramètre","Uniquement via un vecteur normal"],ans:0,
   exp:"Un plan admet une équation cartésienne \\(ax+by+cz+d=0\\) (unique à facteur multiplicatif près). La représentation paramétrique utilise 2 paramètres."},
  {q:"Pour obtenir l'équation cartésienne d'un plan défini par un point et deux vecteurs directeurs, on calcule :",
   opts:["La somme des vecteurs","Le produit scalaire des deux vecteurs","Le produit vectoriel des deux vecteurs directeurs","La moyenne des coordonnées"],ans:2,
   exp:"\\(\\vec{n}=\\vec{u}\\wedge\\vec{v}\\) est normal au plan. L'équation est ensuite \\(\\vec{n}\\cdot\\overrightarrow{AM}=0\\)."},
  {q:"L'angle entre deux droites est toujours dans l'intervalle :",
   opts:["\\([0°;180°]\\)","\\([0°;360°]\\)","\\([0°;90°]\\)","\\(]-90°;90°[\\)"],ans:2,
   exp:"On prend la valeur absolue du cosinus pour obtenir l'angle aigu : \\(\\theta\\in[0°;90°]\\)."},
  {q:"Pour calculer l'angle entre une droite (vecteur \\(\\vec{d}\\)) et un plan (normale \\(\\vec{n}\\)), on utilise :",
   opts:["\\(\\cos\\varphi=\\dfrac{|\\vec{d}\\cdot\\vec{n}|}{\\|\\vec{d}\\|\\|\\vec{n}\\|}\\)","\\(\\sin\\varphi=\\dfrac{|\\vec{d}\\cdot\\vec{n}|}{\\|\\vec{d}\\|\\|\\vec{n}\\|}\\)","\\(\\tan\\varphi=\\dfrac{\\|\\vec{d}\\|}{\\|\\vec{n}\\|}\\)","\\(\\cos\\varphi=\\dfrac{\\vec{d}\\cdot\\vec{n}}{\\|\\vec{d}\\|}\\)"],ans:1,
   exp:"L'angle droite/plan est le complément de l'angle entre \\(\\vec{d}\\) et \\(\\vec{n}\\), donc on utilise \\(\\sin\\varphi\\)."},
  {q:"Deux droites gauches sont :",
   opts:["Parallèles et non coplanaires","Non coplanaires et non parallèles","Sécantes mais non perpendiculaires","Confondues mais distinctes"],ans:1,
   exp:"Des droites gauches sont non coplanaires (pas dans le même plan) et non parallèles — situation spécifique à l'espace 3D."},
  {q:"Le produit vectoriel \\(\\vec{u}\\wedge\\vec{v}\\) est :",
   opts:["Un scalaire","Un vecteur parallèle à \\(\\vec{u}\\) et \\(\\vec{v}\\)","Un vecteur perpendiculaire à \\(\\vec{u}\\) et \\(\\vec{v}\\)","Le produit scalaire multiplié par 2"],ans:2,
   exp:"\\(\\vec{u}\\wedge\\vec{v}\\perp\\vec{u}\\) et \\(\\vec{u}\\wedge\\vec{v}\\perp\\vec{v}\\) — c'est un vecteur normal au plan engendré par \\(\\vec{u}\\) et \\(\\vec{v}\\)."},
  {q:"Pour tester si la droite \\(\\mathcal{D}:(A+t\\vec{d})\\) est parallèle au plan \\(\\mathcal{P}\\) (normale \\(\\vec{n}\\)), on vérifie :",
   opts:["\\(\\vec{d}\\cdot\\vec{n}\\neq 0\\)","\\(\\vec{d}\\cdot\\vec{n}=0\\) ET \\(A\\notin\\mathcal{P}\\)","\\(\\|\\vec{d}\\|=\\|\\vec{n}\\|\\)","\\(\\vec{d}=\\vec{n}\\)"],ans:1,
   exp:"Parallèle = perpendiculaire à la normale (\\(\\vec{d}\\cdot\\vec{n}=0\\)) ET le point \\(A\\) n'est pas dans le plan."},
  {q:"Si le point \\(M(2;1;0)\\) doit appartenir au plan \\(x+y+z+d=0\\), alors \\(d\\) vaut :",
   opts:["\\(3\\)","\\(-3\\)","\\(0\\)","\\(1\\)"],ans:1,
   exp:"\\(1\\times2+1\\times1+1\\times0+d=0 \\Rightarrow 3+d=0 \\Rightarrow d=-3\\)."},
  {q:"Deux plans \\(\\mathcal{P}_1:x+2y-z=3\\) et \\(\\mathcal{P}_2:2x+4y-2z=5\\) sont :",
   opts:["Confondus","Sécants","Parallèles et distincts","Perpendiculaires"],ans:2,
   exp:"\\(\\vec{n}_2=2\\vec{n}_1\\), donc normales colinéaires. Mais \\(3/1\\neq 5/2\\), donc plans distincts → parallèles."},
  {q:"La représentation paramétrique d'une droite dans \\(\\mathbb{R}^3\\) utilise combien de paramètres ?",
   opts:["0","1","2","3"],ans:1,
   exp:"Une droite est une variété de dimension 1, décrite par un seul paramètre \\(t\\in\\mathbb{R}\\)."},
  {q:"L'angle entre les plans \\(z=0\\) et \\(x=0\\) vaut :",
   opts:["\\(0°\\)","\\(45°\\)","\\(90°\\)","\\(60°\\)"],ans:2,
   exp:"Normales : \\(\\vec{n}_1=(0,0,1)\\) et \\(\\vec{n}_2=(1,0,0)\\). \\(\\vec{n}_1\\cdot\\vec{n}_2=0\\) → angle \\(=90°\\)."},
];

let curQ=[],answered={},cSecs=0,cPaused=false,cIntv=null;
function shuf(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function pad2(n){return String(n).padStart(2,'0');}

function newQCM(){
  answered={};curQ=shuf(allQ).slice(0,8);
  document.getElementById('qcm-r').classList.remove('active');
  document.getElementById('sc-v').textContent='0 / 0';
  resetC(); startC(); renderQ();
}
function renderQ(){
  const c=document.getElementById('qcm-c');
  c.innerHTML=curQ.map((q,qi)=>`
    <div class="qcm-q" id="qq-${qi}">
      <div class="qcm-question">${qi+1}. ${q.q}</div>
      <div class="qcm-opts">
        ${q.opts.map((o,oi)=>`
          <div class="qcm-opt" id="opt-${qi}-${oi}" onclick="selO(${qi},${oi})">
            <span class="opt-l">${String.fromCharCode(65+oi)}</span><span>${o}</span>
          </div>`).join('')}
      </div>
      <div class="qcm-fb" id="fb-${qi}"></div>
    </div>`).join('');
  if(window.MathJax) MathJax.typeset([c]);
}
function selO(qi,oi){
  if(answered[qi]!==undefined)return;
  document.querySelectorAll(`#qq-${qi} .qcm-opt`).forEach(e=>e.classList.remove('selected'));
  document.getElementById(`opt-${qi}-${oi}`).classList.add('selected');
  answered[qi]=oi;
}
function submitQCM(){
  let sc=0,tot=curQ.length;
  curQ.forEach((q,qi)=>{
    const ch=answered[qi];
    const qEl=document.getElementById(`qq-${qi}`),fb=document.getElementById(`fb-${qi}`);
    q.opts.forEach((_,oi)=>{
      const el=document.getElementById(`opt-${qi}-${oi}`);
      el.classList.add('disabled');
      if(oi===q.ans) el.classList.add('correct');
      if(ch===oi&&ch!==q.ans) el.classList.add('wrong');
    });
    if(ch===q.ans){sc++;qEl.classList.add('correct');fb.innerHTML=`✓ Correct ! ${q.exp}`;}
    else{qEl.classList.add('wrong');fb.innerHTML=`✗ ${ch===undefined?'Non répondu. ':''}Réponse : <strong>${q.opts[q.ans]}</strong>. ${q.exp}`;}
    fb.classList.add('active');
  });
  document.getElementById('sc-v').textContent=`${sc} / ${tot}`;
  const pct=Math.round(sc/tot*100);
  const msg=pct>=87?'🏆 Maîtrise parfaite !':pct>=62?'👍 Bien ! Quelques points à consolider.':'📚 À retravailler — relisez le cours.';
  document.getElementById('r-sc').textContent=`${sc} / ${tot} — ${pct} %`;
  document.getElementById('r-msg').textContent=msg;
  document.getElementById('qcm-r').classList.add('active');
  if(window.MathJax) MathJax.typeset([document.getElementById('qcm-r'),document.getElementById('qcm-c')]);
  stopC();
}
function startC(){stopC();cPaused=false;document.getElementById('btn-c').textContent='Pause';cIntv=setInterval(()=>{if(!cPaused){cSecs++;document.getElementById('c-disp').textContent=`${pad2(Math.floor(cSecs/60))}:${pad2(cSecs%60)}`;}},1000);}
function stopC(){clearInterval(cIntv);cIntv=null;}
function resetC(){stopC();cSecs=0;cPaused=false;document.getElementById('c-disp').textContent='00:00';document.getElementById('btn-c').textContent='Pause';}
function toggleC(){cPaused=!cPaused;document.getElementById('btn-c').textContent=cPaused?'Reprendre':'Pause';}

newQCM();

// ── SCROLL REVEAL & NAV ──────────────────────────────
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:0.07});
document.querySelectorAll('section').forEach(s=>io.observe(s));
const navLinks=document.querySelectorAll('nav a');
window.addEventListener('scroll',()=>{
  let cur='';
  document.querySelectorAll('main section').forEach(s=>{if(window.scrollY>=s.offsetTop-130)cur=s.id;});
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
},{passive:true});