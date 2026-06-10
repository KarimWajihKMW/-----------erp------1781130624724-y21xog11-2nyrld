'use strict';
/* ============ أكوادرا ERP — الموجّه + محرك الحركة ثلاثية الأبعاد ============ */

/* ===== المسارات ===== */
const ROUTES=[
  {p:/^\/$/,v:()=>landingView()},
  {p:/^\/features$/,v:()=>featuresView()},
  {p:/^\/pricing$/,v:()=>pricingView()},
  {p:/^\/contact$/,v:()=>contactView()},
  {p:/^\/login$/,v:()=>loginView()},
  {p:/^\/signup$/,v:()=>signupView()},
  {p:/^\/admin$/,v:()=>adminHome()},
  {p:/^\/admin\/companies$/,v:()=>adminCompanies()},
  {p:/^\/admin\/companies\/([\w-]+)(?:\/([\w-]+))?$/,v:(id,tab)=>adminCompanyDetail(id,tab)},
  {p:/^\/admin\/subscriptions$/,v:()=>adminSubscriptions()},
  {p:/^\/admin\/plans$/,v:()=>adminPlans()},
  {p:/^\/admin\/invoices$/,v:()=>adminInvoicesView()},
  {p:/^\/admin\/tickets$/,v:()=>adminTickets()},
  {p:/^\/admin\/users$/,v:()=>adminUsers()},
  {p:/^\/admin\/reports$/,v:()=>adminReports()},
  {p:/^\/admin\/settings(?:\/([\w-]+))?$/,v:tab=>settingsView('admin',tab)},
  {p:/^\/erp$/,v:()=>erpHome()},
  {p:/^\/erp\/sales$/,v:()=>erpSales()},
  {p:/^\/erp\/products$/,v:()=>erpProducts()},
  {p:/^\/erp\/purchases$/,v:()=>erpPurchases()},
  {p:/^\/erp\/customers$/,v:()=>erpCustomers()},
  {p:/^\/erp\/suppliers$/,v:()=>erpSuppliers()},
  {p:/^\/erp\/hr$/,v:()=>erpHR()},
  {p:/^\/erp\/accounting$/,v:()=>erpAccounting()},
  {p:/^\/erp\/reports$/,v:()=>erpReports()},
  {p:/^\/erp\/settings(?:\/([\w-]+))?$/,v:tab=>settingsView('erp',tab)}
];
function renderRoute(){
  const path=(location.hash.slice(1)||'/').split('?')[0];
  let html=null;
  for(const r of ROUTES){const m=path.match(r.p);if(m){html=r.v(...m.slice(1));break;}}
  if(html===null)html=notFoundView();
  $('#app').innerHTML=html;
  registerQuickCfgs();
  bindForms();
  window.scrollTo({top:0});
  initFX();
}
window.renderRoute=renderRoute;
window.addEventListener('hashchange',renderRoute);

/* ===== نماذج الصفحات العامة ===== */
function bindForms(){
  const lf=$('#login-form');
  if(lf)lf.addEventListener('submit',e=>{e.preventDefault();
    const em=($('#login-email').value||'').toLowerCase();
    doLogin(em.includes('admin')||em.includes('akwadra')?'admin':'company');});
  const sf=$('#signup-form');
  if(sf)sf.addEventListener('submit',e=>{e.preventDefault();
    const name=$('#su-name').value.trim();
    addRow('companies',{name,industry:$('#su-industry').value,planId:$('#su-plan').value,status:'تجريبي',users:1,email:$('#su-email').value,phone:$('#su-phone').value,country:'السعودية',joined:today(),revenue:0});
    setSession({role:'company',name,title:'حساب تجريبي — 14 يومًا'});
    toast('تم إنشاء حساب شركتك بنجاح! أهلًا بك في أكوادرا');
    location.hash='#/erp';});
  const cf=$('#contact-form');
  if(cf)cf.addEventListener('submit',e=>{e.preventDefault();cf.reset();
    toast('استلمنا رسالتك — سيتواصل معك فريقنا خلال 30 دقيقة عمل');});
}

/* ===== محرك الحركة: عمق حقيقي + تفاعل مع التمرير والمؤشر ===== */
let revObs=null,cntObs=null;
function ensureObservers(){
  if(!revObs)revObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target);}}),{threshold:.12});
  if(!cntObs)cntObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){animateCount(e.target);cntObs.unobserve(e.target);}}),{threshold:.4});
}
function animateCount(el){
  const target=Number(el.dataset.count||0),t0=performance.now(),dur=1800;
  const fmt=v=>v>=1e6?(v/1e6).toFixed(1)+'م+':Math.round(v).toLocaleString('en-US')+'+';
  const tick=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);
    el.textContent=fmt(target*e);
    if(k<1)requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
}
function initFX(){
  ensureObservers();
  $$('.rv').forEach(el=>revObs.observe(el));
  $$('[data-count]').forEach(el=>cntObs.observe(el));
  /* إمالة ثلاثية الأبعاد للبطاقات */
  $$('[data-tilt]').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const rx=((e.clientY-r.top)/r.height-.5)*-10;
      const ry=((e.clientX-r.left)/r.width-.5)*12;
      card.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
  /* مشهد البطل: طبقات تستجيب لحركة المؤشر */
  const scene=$('#hero-scene');
  if(scene){
    const hero=scene.closest('.hero');
    hero.addEventListener('mousemove',e=>{
      const r=hero.getBoundingClientRect();
      const dx=(e.clientX-r.left)/r.width-.5;
      const dy=(e.clientY-r.top)/r.height-.5;
      $$('.scene-layer',scene).forEach(l=>{
        const z=Number(l.dataset.mz||20);
        l.style.transform=`translate3d(${dx*z*-1}px,${dy*z*-1}px,0) rotateY(${dx*z*.18}deg) rotateX(${dy*z*-.18}deg)`;
      });
    });
    hero.addEventListener('mouseleave',()=>{$$('.scene-layer',scene).forEach(l=>l.style.transform='');});
  }
}
/* تمرير: شريط التقدم + عمق الطبقات (Parallax) */
let scrollPending=false;
window.addEventListener('scroll',()=>{
  if(scrollPending)return;scrollPending=true;
  requestAnimationFrame(()=>{
    scrollPending=false;
    const h=document.documentElement;
    const pct=h.scrollTop/((h.scrollHeight-h.clientHeight)||1)*100;
    const bar=$('#progress-bar');if(bar)bar.style.width=pct+'%';
    $$('[data-depth]').forEach(el=>{
      const r=el.getBoundingClientRect();
      const mid=window.innerHeight/2-(r.top+r.height/2);
      el.style.transform=`translateY(${(mid*Number(el.dataset.depth||.5)/8).toFixed(1)}px)`;
    });
  });
},{passive:true});

/* ===== الإقلاع ===== */
db();
renderRoute();
window.addEventListener('load',()=>{
  setTimeout(()=>{const s=$('#splash');if(s)s.classList.add('gone');},650);
});
setTimeout(()=>{const s=$('#splash');if(s)s.classList.add('gone');},1800);
