const WHATSAPP = '254701480525'; // ← Replace with real number
const STORAGE_KEY = 'lug_master_storage';
const REQ_KEY = 'lug_requests';
const firebaseConfig = {
  apiKey: "AIzaSyAAy3aAw533l-TTFfg8L3itnzeserDFjhU",
  authDomain: "lugar-1ec3b.firebaseapp.com",
  databaseURL: "https://lugar-1ec3b-default-rtdb.firebaseio.com",
  projectId: "lugar-1ec3b",
  storageBucket: "lugar-1ec3b.firebasestorage.app",
  messagingSenderId: "955939000236",
  appId: "1:955939000236:web:72da6c2ef877113e18b409",
  measurementId: "G-YR38SG6KXM"
};

if(typeof firebase !== 'undefined' && firebase.initializeApp){
  firebase.initializeApp(firebaseConfig);
}
const db = (typeof firebase !== 'undefined' && firebase.database) ? firebase.database() : null;

function getStorage(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}}

/* NAV */
function showSection(id){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  const t=document.getElementById(id);
  if(t)t.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(b=>{
    const txt=b.textContent.toLowerCase();
    if(id==='requests'&&txt==='contact')b.classList.add('active');
    else if(txt===id)b.classList.add('active');
  });
  // Toggle home mode on nav
  const nav=document.querySelector('nav');
  const topbar=document.getElementById('homeTopbar');
  if(id==='home'){nav.classList.add('home-mode');if(topbar)topbar.classList.remove('hidden');}
  else{nav.classList.remove('home-mode');if(topbar)topbar.classList.add('hidden');}
  if(id==='services')renderServices();
  if(id==='staff')renderPeople('staff','staffGrid',false);
  if(id==='executive')renderPeople('executives','execGrid',true);
  window.scrollTo(0,0);
}
function toggleMobileNav(){document.getElementById('mobileDrawer').classList.toggle('open')}
function closeMobileNav(){document.getElementById('mobileDrawer').classList.remove('open')}

/* SERVICES */
const BASE_SERVICES=[
  {icon:'🏙️',name:'Urban Infrastructure Development',desc:'Master-planning and delivery of urban infrastructure including roads, drainage, and public spaces.',tag:'Infrastructure',subs:[
    'Urban Master Planning & Design',
    'Drainage & Stormwater Systems',
    'Street Lighting Installation',
    'Pedestrian Walkways & Pavements',
    'Public Spaces & Parks Development',
    'Utility Corridor Planning',
    'Traffic Management Systems',
  ]},
  {icon:'🏢',name:'Commercial Construction',desc:'End-to-end construction management for offices, retail spaces, and mixed-use developments.',tag:'Construction',subs:[
    'Office Block Construction',
    'Retail & Shopping Mall Development',
    'Mixed-Use Building Projects',
    'Warehouse & Industrial Facilities',
    'Renovation & Fit-Out Works',
    'Structural Assessment & Reporting',
    'Project Management & Supervision',
  ]},
  {icon:'🛣️',name:'Road Networks & Civil Works',desc:'Rural and urban road design, construction, and maintenance across all 47 counties.',tag:'Civil Engineering',subs:[
    'Road Design & Engineering',
    'New Road Construction',
    'Road Rehabilitation & Repairs',
    'Culvert & Bridge Installation',
    'Grading & Gravelling',
    'Tarmacking & Surfacing',
    'Road Maintenance Contracts',
    'Flood Mitigation & Drainage Channels',
  ]},
  {icon:'🔐',name:'KRA eTIMS Integration',desc:"Seamless integration of Kenya Revenue Authority's eTIMS platform for tax compliance.",tag:'Cyber Services',subs:[
    'Register KRA PIN Number',
    'Retrieve KRA PIN Certificate',
    'Update KRA PIN Number',
    'Change KRA PIN Email Address',
    'File KRA Nil Returns',
    'File KRA Employment Returns',
    'File KRA Amended Returns',
    'File KRA Withholding Tax Returns',
    'File KRA Business Income Returns',
    'KRA eTIMS Device Setup & Integration',
    'eTIMS Invoice Management',
    'KRA Compliance Health Check',
  ]},
  {icon:'🛡️',name:'Cybersecurity Audit',desc:'Comprehensive digital security assessments and vulnerability remediation for Kenyan enterprises.',tag:'Cyber Services',subs:[
    'Vulnerability Assessment',
    'Penetration Testing',
    'Network Security Audit',
    'Data Protection & GDPR Compliance',
    'Security Policy Development',
    'Staff Security Awareness Training',
    'Incident Response Planning',
    'ISO 27001 Readiness Assessment',
  ]},
  {icon:'🌐',name:'Network Setup & Management',desc:'Enterprise network design, installation, and 24/7 managed services for businesses of all sizes.',tag:'ICT',subs:[
    'LAN & WAN Design & Installation',
    'Wi-Fi Network Setup',
    'Fibre Optic Cabling',
    'Network Switch & Router Configuration',
    'CCTV & IP Camera Installation',
    'Server Room Setup',
    'VPN & Remote Access Setup',
    '24/7 Network Monitoring & Support',
  ]},
];
/* KRA sub-services now embedded in BASE_SERVICES */

function renderServices(){
  const d=getStorage();
  const all=[...BASE_SERVICES,...(d.services||[])];
  document.getElementById('servicesGrid').innerHTML=all.map(s=>{
    const hasSubs = s.subs && s.subs.length;
    if(hasSubs){
      const subItems = s.subs.map(sub=>`
        <div class="service-subitem" onclick="event.stopPropagation();selectSubService('${sub}')">
          <span class="service-subitem-dot"></span>
          <span class="service-subitem-text">${sub}</span>
          <span class="service-subitem-arrow">→</span>
        </div>`).join('');
      return `
        <div class="service-card expandable" onclick="toggleServiceExpand(this)">
          <div class="service-icon">${s.icon||'⚙️'}</div>
          <div class="service-name">${s.name} <span class="service-expand-arrow">▾</span></div>
          <div class="service-desc">${s.desc||''}</div>
          <span class="service-tag">${s.tag||'Service'}</span>
          <div class="service-sublist">${subItems}</div>
        </div>`;
    }
    return `
      <div class="service-card">
        <div class="service-icon">${s.icon||'⚙️'}</div>
        <div class="service-name">${s.name}</div>
        <div class="service-desc">${s.desc||''}</div>
        <span class="service-tag">${s.tag||'Service'}</span>
      </div>`;
  }).join('');
}

function toggleServiceExpand(card){
  card.classList.toggle('open');
}

function selectSubService(name){
  // Pre-fill the contact form with the selected sub-service and navigate to it
  showSection('requests');
  setTimeout(()=>{
    const sel = document.getElementById('reqService');
    if(sel){
      // Try to match existing option, otherwise set custom value display
      let matched = false;
      for(let opt of sel.options){
        if(opt.value === 'KRA eTIMS Integration' || opt.text.includes('eTIMS')){
          sel.value = opt.value;
          matched = true;
          break;
        }
      }
    }
    const msg = document.getElementById('reqMessage');
    if(msg) msg.value = 'I would like to request: ' + name;
    // Scroll to form
    document.getElementById('requests').scrollIntoView({behavior:'smooth'});
  }, 200);
}

/* PEOPLE */
function renderPeople(key,gridId,isExec){
  const d=getStorage();
  const arr=d[key]||[];
  const g=document.getElementById(gridId);
  if(!arr.length){g.innerHTML='<div class="empty-state">No profiles published yet.</div>';return}
  g.innerHTML=arr.map(p=>`
    <div class="person-card">
      <div class="person-avatar" ${isExec?'style="border-color:rgba(201,168,76,0.4)"':''}>${p.photo?`<img src="${p.photo}" alt="${p.name}"/>`:p.name.charAt(0)}</div>
      <div class="person-name">${p.name}</div>
      <div class="person-role" ${isExec?'style="color:var(--gold)"':''}>${p.role}</div>
      <div class="person-dept">${p.dept||''}</div>
      ${isExec?'<span class="exec-badge">Executive</span>':''}
    </div>`).join('');
}

/* REQUESTS */
function validateField(id,errId){
  const v=document.getElementById(id).value.trim();
  const e=document.getElementById(errId);
  if(!v){e.style.display='block';return false}
  e.style.display='none';return true;
}
function submitRequest(){
  const ok1=validateField('reqName','errName');
  const ok2=validateField('reqContact','errContact');
  if(!ok1||!ok2)return;
  const req={
    id:Date.now(),
    name:document.getElementById('reqName').value.trim(),
    contact:document.getElementById('reqContact').value.trim(),
    service:document.getElementById('reqService').value||'General Inquiry',
    message:document.getElementById('reqMessage').value.trim(),
    time:new Date().toLocaleString('en-KE'),
    read:false
  };
  const finishSubmit = () => {
    ['reqName','reqContact','reqMessage'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('reqService').value='';
    const s=document.getElementById('successMsg');
    if(s){
      s.style.display='block';
      setTimeout(()=>s.style.display='none',6000);
    }
  };
  if(db && typeof db.ref === 'function'){
    db.ref('requests').push(req).then(finishSubmit).catch(err=>{
      console.warn('Firebase error, saving locally:', err);
      const reqs=JSON.parse(localStorage.getItem(REQ_KEY)||'[]');
      reqs.unshift(req);
      localStorage.setItem(REQ_KEY,JSON.stringify(reqs));
      finishSubmit();
    });
  } else {
    console.warn('Firebase unavailable, saving request locally');
    const reqs=JSON.parse(localStorage.getItem(REQ_KEY)||'[]');
    reqs.unshift(req);
    localStorage.setItem(REQ_KEY,JSON.stringify(reqs));
    finishSubmit();
  }
}

function openWhatsApp(){
  const name=document.getElementById('reqName').value.trim()||'a visitor';
  const svc=document.getElementById('reqService').value||'General Inquiry';
  const msg=document.getElementById('reqMessage').value.trim();
  const text=`Hello LUGARES Group,\n\nMy name is ${name}.\nService needed: ${svc}${msg?'\nMessage: '+msg:''}\n\nKindly get back to me. Thank you.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
}

/* INIT */
renderServices();

if (typeof db !== 'undefined' && db.ref) {
    db.ref('portalData').on('value', (snapshot) => {
        const data = snapshot.val();
       if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Safely re-render sections if their functions exist
    if (typeof renderServices === 'function') renderServices();
    if (typeof renderPeople === 'function') {
        renderPeople('staff', 'staffGrid', false);
        renderPeople('executives', 'execGrid', true);
    }
    if (typeof renderProjects === 'function') renderProjects();
}    });
}
// Check if returning from a sub-page with a target section
(function(){
  const params = new URLSearchParams(window.location.search);
  const target = params.get('section') || sessionStorage.getItem('lugSection');
  if(target){
    sessionStorage.removeItem('lugSection');
    showSection(target);
    if(params.has('section')) history.replaceState({}, '', window.location.pathname);
  }
})();

/* PROJECTS FILTER */
function filterProjects(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.querySelectorAll('.proj-card').forEach(c=>{
    (cat==='all'||c.dataset.pcat===cat)?c.classList.remove('proj-hidden'):c.classList.add('proj-hidden');
  });
}

function syncPublishedWorkspace(data){
  if(!data || data.storageKey !== STORAGE_KEY) return;
  if(data.payload && typeof data.payload === 'object'){
    try{localStorage.setItem(STORAGE_KEY, JSON.stringify(data.payload))}catch(e){console.warn('Unable to sync workspace storage:', e)}
  }
  renderServices();
  renderPeople('staff','staffGrid',false);
  renderPeople('executives','execGrid',true);
}

// Cross-window sync: BroadcastChannel (if available) and postMessage from worker
const SYNC_CHANNEL = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('lugares-sync') : null;
if(SYNC_CHANNEL){
  SYNC_CHANNEL.onmessage = e => {
    if(e.data && e.data.type === 'workspace-updated' && e.data.storageKey === STORAGE_KEY){
      syncPublishedWorkspace({storageKey: e.data.storageKey, payload: e.data.payload});
    }
  };
}

window.addEventListener('message', event => {
  if(!event.data || typeof event.data !== 'object') return;
  const data = event.data;
  // Only handle messages for our storageKey when provided
  if(data.storageKey && data.storageKey !== STORAGE_KEY) return;
  switch(data.type){
    case 'worker-published':
      syncPublishedWorkspace(data);
      break;
    case 'service-added':
    case 'project-added':
    case 'staff-added':
    case 'executive-added':
    case 'item-removed':
      // worker sends the full workspace in payload.full when available
      if(data.payload && data.payload.full){
        try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(data.payload.full)); }
        catch(e){ console.warn('Unable to save workspace from worker message:', e); }
      }
      renderServices();
      renderPeople('staff','staffGrid',false);
      renderPeople('executives','execGrid',true);
      break;
    case 'data-cleared':
      try{ localStorage.removeItem(STORAGE_KEY); } catch(e){}
      renderServices();
      renderPeople('staff','staffGrid',false);
      renderPeople('executives','execGrid',true);
      break;
    default:
      // ignore other message types
  }
});

window.addEventListener('storage', event => {
  if(event.key === STORAGE_KEY) {
    renderServices();
    renderPeople('staff','staffGrid',false);
    renderPeople('executives','execGrid',true);
  }
});

/* BLOG FILTER */
function filterBlog(cat,btn){
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.querySelectorAll('.blog-card').forEach(c=>{
    (cat==='all'||c.dataset.bcat===cat)?c.classList.remove('blog-hidden'):c.classList.add('blog-hidden');
  });
}

/* NEWSLETTER */
function subscribeNL(){
  const e=document.getElementById('nlEmail');
  if(!e||!e.value.includes('@')){alert('Please enter a valid email.');return}
  e.value='';
  alert('Subscribed! Thank you.');
}
document.querySelector('nav').classList.add('home-mode');
// homeTopbar is visible by default on home
