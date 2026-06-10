'use strict';
/* ============ أكوادرا ERP — لوحة مالك المنصة (إنشاء وبيع حسابات الشركات) ============ */

const ADMIN_NAV=[
 {sec:'الإدارة العامة'},
 {h:'#/admin',i:'dash',l:'لوحة القيادة',k:'home'},
 {h:'#/admin/companies',i:'building',l:'حسابات الشركات',k:'companies'},
 {h:'#/admin/subscriptions',i:'cart',l:'بيع الاشتراكات',k:'subscriptions'},
 {h:'#/admin/plans',i:'layers',l:'الباقات والأسعار',k:'plans'},
 {sec:'المالية والدعم'},
 {h:'#/admin/invoices',i:'file',l:'فواتير المنصة',k:'invoices'},
 {h:'#/admin/tickets',i:'ticket',l:'تذاكر الدعم',k:'tickets'},
 {h:'#/admin/users',i:'users',l:'فريق المنصة',k:'users'},
 {sec:'التحليل والضبط'},
 {h:'#/admin/reports',i:'chart',l:'تقارير الإيرادات',k:'reports'},
 {h:'#/admin/settings',i:'gear',l:'إعدادات المنصة',k:'settings'}
];
function dashShell(content,nav,active,title,subtitle,theme,userName,userTitle){
  return `<div class="dash ${theme||''}">
    <aside class="sidebar" id="sidebar">
      <div class="side-logo"><span class="logo-mark">أ</span>أكوادرا <b style="color:var(--em)">ERP</b><span class="side-tag">${theme==='erp-theme'?'لوحة الشركة':'مالك المنصة'}</span></div>
      <nav class="side-nav">
        ${nav.map(n=>n.sec?`<span class="side-sec">${n.sec}</span>`
          :`<a class="side-link ${n.k===active?'active':''}" href="${n.h}">${ico(n.i)} ${n.l}</a>`).join('')}
      </nav>
      <div class="side-foot">
        <a class="side-link" href="#/">${ico('eye')} عرض الموقع العام</a>
        <a class="side-link" href="javascript:doLogout()">${ico('logout')} تسجيل الخروج</a>
      </div>
    </aside>
    <div class="side-backdrop" id="side-backdrop" style="display:none" onclick="toggleSide()"></div>
    <div class="dash-main">
      <header class="topbar">
        <button class="icon-btn side-toggle" onclick="toggleSide()" aria-label="القائمة">${ico('menu')}</button>
        <div class="tb-title"><h1>${title}</h1><p>${subtitle}</p></div>
        <div class="tb-actions">
          <button class="icon-btn" title="التنبيهات" onclick="toast('لا توجد تنبيهات جديدة حاليًا')">${ico('bell')}</button>
          <div class="user-chip"><span class="avatar">${initials(userName)}</span><div><b>${userName}</b><span>${userTitle}</span></div></div>
        </div>
      </header>
      <main class="content">${content}</main>
    </div>
  </div>`;
}
window.toggleSide=()=>{
  const sb=$('#sidebar'),bd=$('#side-backdrop');
  sb.classList.toggle('open');
  bd.style.display=sb.classList.contains('open')?'block':'none';
};
function adminShell(content,active,title,subtitle){
  const s=session()||{name:'كريم وجيه',title:'مالك المنصة'};
  return dashShell(content,ADMIN_NAV,active,title,subtitle,'',s.name||'كريم وجيه',s.title||'مالك المنصة');
}

/* ===== إعدادات حقول النماذج ===== */
const INDUSTRIES=['تجارة التجزئة','مقاولات وإنشاءات','صحة ودواء','مطاعم وأغذية','لوجستيات','تقنية وبرمجيات','عقارات','صناعة','تعليم وتدريب','طاقة'];
const COUNTRIES=['السعودية','الإمارات','الكويت','قطر','البحرين','عُمان','مصر','الأردن'];
const planOptions=()=>col('plans').map(p=>({v:p.id,l:p.name}));
const companyOptions=()=>col('companies').map(c=>({v:c.id,l:c.name}));
const companyFields=[
 {k:'name',label:'اسم الشركة',req:1,ph:'مثال: شركة النخبة للتجارة'},
 {k:'industry',label:'النشاط التجاري',type:'select',options:INDUSTRIES},
 {k:'planId',label:'الباقة',type:'select',options:planOptions},
 {k:'status',label:'حالة الحساب',type:'select',options:['نشط','تجريبي','موقوف','منتهي']},
 {k:'users',label:'عدد المستخدمين',type:'number',def:5},
 {k:'email',label:'البريد الإلكتروني',type:'email',req:1},
 {k:'phone',label:'رقم الجوال'},
 {k:'country',label:'الدولة',type:'select',options:COUNTRIES},
 {k:'joined',label:'تاريخ الانضمام',type:'date',def:today()},
 {k:'revenue',label:'إجمالي الإيراد منه (ر.س)',type:'number',def:0}
];
const subscriptionFields=[
 {k:'companyId',label:'الشركة',type:'select',options:companyOptions},
 {k:'planId',label:'الباقة',type:'select',options:planOptions},
 {k:'start',label:'تاريخ البداية',type:'date',def:today()},
 {k:'end',label:'تاريخ الانتهاء',type:'date'},
 {k:'amount',label:'قيمة الاشتراك (ر.س)',type:'number',def:9588},
 {k:'method',label:'وسيلة الدفع',type:'select',options:['تحويل بنكي','بطاقة ائتمانية','مدى','تجربة مجانية']},
 {k:'status',label:'الحالة',type:'select',options:['نشط','منتهي','ملغي']}
];
const adminInvoiceFields=[
 {k:'number',label:'رقم الفاتورة',req:1,ph:'INV-2024-0XX'},
 {k:'companyId',label:'الشركة',type:'select',options:companyOptions},
 {k:'amount',label:'المبلغ (ر.س)',type:'number',req:1},
 {k:'date',label:'تاريخ الإصدار',type:'date',def:today()},
 {k:'due',label:'تاريخ الاستحقاق',type:'date'},
 {k:'status',label:'حالة السداد',type:'select',options:['مدفوعة','معلقة','متأخرة']}
];
const planFields=[
 {k:'name',label:'اسم الباقة',req:1},
 {k:'price',label:'السعر الشهري (ر.س)',type:'number',req:1},
 {k:'period',label:'دورة الفوترة',type:'select',options:['شهري','سنوي']},
 {k:'users',label:'حد المستخدمين',ph:'مثال: 50 مستخدمًا'},
 {k:'storage',label:'مساحة التخزين',ph:'مثال: 100 جيجا'},
 {k:'status',label:'الحالة',type:'select',options:['نشط','موقوف']},
 {k:'modules',label:'الوحدات المشمولة',type:'textarea'},
 {k:'desc',label:'وصف تسويقي قصير',type:'textarea'}
];
const ticketFields=[
 {k:'companyId',label:'الشركة',type:'select',options:companyOptions},
 {k:'subject',label:'موضوع التذكرة',req:1,full:1},
 {k:'priority',label:'الأولوية',type:'select',options:['عاجلة','مرتفعة','متوسطة','منخفضة']},
 {k:'status',label:'الحالة',type:'select',options:['مفتوحة','قيد التنفيذ','مغلقة']},
 {k:'date',label:'تاريخ الفتح',type:'date',def:today()}
];
const platformUserFields=[
 {k:'name',label:'الاسم الكامل',req:1},
 {k:'email',label:'البريد الإلكتروني',type:'email',req:1},
 {k:'role',label:'الدور',type:'select',options:['مدير المنصة','مشرف مبيعات','دعم فني','محاسب']},
 {k:'status',label:'الحالة',type:'select',options:['نشط','موقوف']},
 {k:'lastLogin',label:'آخر تسجيل دخول',type:'date',def:today()}
];

/* ===== لوحة القيادة ===== */
function adminHome(){
  const cos=col('companies'),subs=col('subscriptions'),inv=col('adminInvoices'),tks=col('tickets');
  const active=cos.filter(c=>c.status==='نشط').length;
  const mrr=subs.filter(s=>s.status==='نشط').reduce((a,s)=>a+s.amount,0)/12;
  const openT=tks.filter(t=>t.status!=='مغلقة').length;
  const planDist=col('plans').map(p=>({l:p.name,v:cos.filter(c=>c.planId===p.id).length}));
  const recent=cos.slice(0,5);
  const lateInv=inv.filter(i=>i.status!=='مدفوعة').slice(0,5);
  return adminShell(`
    <div class="kpis">
      ${kpiCard('building','إجمالي حسابات الشركات',num(cos.length),'+8.3%','var(--em)')}
      ${kpiCard('shield','اشتراكات نشطة الآن',num(active),'+5.1%','var(--blue)')}
      ${kpiCard('wallet','الإيراد الشهري المتكرر MRR',money(Math.round(mrr)),'+12.4%','var(--gold)')}
      ${kpiCard('ticket','تذاكر دعم مفتوحة',num(openT),'-9.6%','var(--danger)')}
    </div>
    <div class="grid-2">
      <div class="panel rv"><div class="panel-head"><h3>إيرادات بيع الاشتراكات (آخر 8 أشهر)</h3><p>إجمالي قيمة الاشتراكات المفوترة شهريًا بالريال</p></div>
        ${barChart(REV_MONTHS,MONTHS)}</div>
      <div class="panel rv d1"><div class="panel-head"><h3>توزيع الشركات على الباقات</h3><p>أين يتركّز عملاؤك؟</p></div>
        ${donutChart(planDist,num(cos.length))}</div>
    </div>
    <div class="grid-2 even">
      <div class="panel rv"><div class="panel-head"><h3>أحدث حسابات الشركات</h3><a class="btn ghost sm" href="#/admin/companies">إدارة الكل</a></div>
        <table class="mini-table">${recent.map(c=>`<tr>
          <td><div class="cell-main"><b>${esc(c.name)}</b><span>${esc(c.industry)} • ${esc(c.country)}</span></div></td>
          <td>${esc(planName(c.planId))}</td><td>${badge(c.status)}</td>
          <td><a class="icon-btn" href="#/admin/companies/${c.id}" title="ملف الشركة">${ico('eye')}</a></td></tr>`).join('')}</table></div>
      <div class="panel rv d1"><div class="panel-head"><h3>فواتير بانتظار التحصيل</h3><a class="btn ghost sm" href="#/admin/invoices">كل الفواتير</a></div>
        <table class="mini-table">${lateInv.length?lateInv.map(i=>`<tr>
          <td><div class="cell-main"><b>${esc(i.number)}</b><span>${esc(companyName(i.companyId))}</span></div></td>
          <td>${money(i.amount)}</td><td>${badge(i.status)}</td></tr>`).join(''):'<tr><td style="color:var(--muted)">كل الفواتير محصّلة 🎉</td></tr>'}</table></div>
    </div>
    <div class="panel rv"><div class="panel-head"><h3>إجراءات سريعة لبيع الحسابات</h3><p>أكثر العمليات التي تنفذها يوميًا</p></div>
      <div class="hero-actions">
        <button class="btn primary" onclick="tblAdd('admin-companies-q')">${ico('plus')} إنشاء حساب شركة جديد</button>
        <button class="btn gold" onclick="tblAdd('admin-subs-q')">${ico('cart')} بيع اشتراك جديد</button>
        <button class="btn ghost" onclick="tblAdd('admin-inv-q')">${ico('file')} إصدار فاتورة منصة</button>
      </div></div>
  `,'home','لوحة قيادة المنصة','نظرة لحظية على حسابات الشركات والاشتراكات والإيرادات');
}
/* جداول خفية للإجراءات السريعة */
function registerQuickCfgs(){
  TBL['admin-companies-q']={key:'admin-companies-q',col:'companies',title:'حسابات الشركات',fields:companyFields,after:()=>renderRoute()};
  TBL['admin-subs-q']={key:'admin-subs-q',col:'subscriptions',title:'الاشتراكات',fields:subscriptionFields,after:()=>renderRoute()};
  TBL['admin-inv-q']={key:'admin-inv-q',col:'adminInvoices',title:'فواتير المنصة',fields:adminInvoiceFields,after:()=>renderRoute()};
}

/* ===== حسابات الشركات ===== */
function adminCompanies(){
  return adminShell(renderTable({
    key:'admin-companies',col:'companies',title:'حسابات الشركات المشتركة',
    addLabel:'إنشاء حساب شركة',addTitle:'إنشاء حساب شركة جديد على المنصة',
    searchKeys:['name','email','industry','country'],searchPh:'ابحث باسم الشركة أو البريد أو النشاط...',
    filters:[
      {k:'status',label:'الحالة',options:['نشط','تجريبي','موقوف','منتهي']},
      {k:'planId',label:'الباقة',options:planOptions},
      {k:'country',label:'الدولة',options:COUNTRIES}
    ],
    columns:[
      {k:'name',l:'الشركة',sort:1,r:c=>`<div class="cell-main"><b>${esc(c.name)}</b><span>${esc(c.email)}</span></div>`},
      {k:'industry',l:'النشاط',sort:1},
      {k:'planId',l:'الباقة',r:c=>esc(planName(c.planId))},
      {k:'users',l:'المستخدمون',sort:1,r:c=>num(c.users)},
      {k:'revenue',l:'إجمالي الإيراد',sort:1,r:c=>money(c.revenue)},
      {k:'joined',l:'الانضمام',sort:1},
      {k:'status',l:'الحالة',sort:1,r:c=>badge(c.status)}
    ],
    fields:companyFields,
    view:id=>`/admin/companies/${id}`
  }),'companies','حسابات الشركات','أنشئ حسابات جديدة، فعّل الباقات، وتابع حالة كل شركة');
}

/* ===== ملف الشركة (تبويبات عميقة) ===== */
function adminCompanyDetail(id,tab){
  const c=findRow('companies',id);
  if(!c)return adminShell('<div class="empty-state"><b>لم يتم العثور على هذه الشركة</b>ربما تم حذف الحساب.</div>','companies','ملف شركة','');
  tab=tab||'overview';
  const tabs=[['overview','نظرة عامة'],['subscriptions','الاشتراكات'],['invoices','الفواتير'],['support','تذاكر الدعم']];
  let body='';
  if(tab==='overview'){
    const subs=col('subscriptions').filter(s=>s.companyId===id);
    const inv=col('adminInvoices').filter(i=>i.companyId===id);
    body=`<div class="kpis">
      ${kpiCard('cart','اشتراكات هذه الشركة',num(subs.length),'','var(--em)')}
      ${kpiCard('file','فواتير صادرة لها',num(inv.length),'','var(--blue)')}
      ${kpiCard('wallet','إجمالي الإيراد منها',money(c.revenue),'','var(--gold)')}
      ${kpiCard('users','مستخدمون مفعّلون',num(c.users),'','var(--violet)')}
    </div>
    <div class="panel"><div class="panel-head"><h3>بيانات الحساب</h3></div>
      <div class="detail-list">
        <div><span>النشاط التجاري</span><b>${esc(c.industry)}</b></div>
        <div><span>الباقة الحالية</span><b>${esc(planName(c.planId))}</b></div>
        <div><span>البريد الإلكتروني</span><b>${esc(c.email)}</b></div>
        <div><span>رقم الجوال</span><b>${esc(c.phone)}</b></div>
        <div><span>الدولة</span><b>${esc(c.country)}</b></div>
        <div><span>تاريخ الانضمام</span><b>${esc(c.joined)}</b></div>
        <div><span>حالة الحساب</span><b>${badge(c.status)}</b></div>
        <div><span>معرّف الحساب</span><b>${esc(c.id)}</b></div>
      </div></div>`;
  }else if(tab==='subscriptions'){
    body=renderTable({key:'co-subs-'+id,col:'subscriptions',title:'اشتراكات '+c.name,
      addLabel:'بيع اشتراك جديد',searchKeys:['method','status'],
      where:s=>s.companyId===id,
      filters:[{k:'status',label:'الحالة',options:['نشط','منتهي','ملغي']}],
      columns:[
        {k:'planId',l:'الباقة',r:s=>esc(planName(s.planId))},
        {k:'start',l:'البداية',sort:1},{k:'end',l:'الانتهاء',sort:1},
        {k:'amount',l:'القيمة',sort:1,r:s=>money(s.amount)},
        {k:'method',l:'وسيلة الدفع'},
        {k:'status',l:'الحالة',sort:1,r:s=>badge(s.status)}
      ],
      fields:subscriptionFields.map(f=>f.k==='companyId'?{...f,def:id}:f),
      beforeSave:o=>{o.companyId=o.companyId||id;return o;}});
  }else if(tab==='invoices'){
    body=renderTable({key:'co-inv-'+id,col:'adminInvoices',title:'فواتير '+c.name,
      addLabel:'إصدار فاتورة',searchKeys:['number','status'],
      where:i=>i.companyId===id,
      filters:[{k:'status',label:'الحالة',options:['مدفوعة','معلقة','متأخرة']}],
      columns:[
        {k:'number',l:'رقم الفاتورة',sort:1},
        {k:'date',l:'الإصدار',sort:1},{k:'due',l:'الاستحقاق',sort:1},
        {k:'amount',l:'المبلغ',sort:1,r:i=>money(i.amount)},
        {k:'status',l:'الحالة',sort:1,r:i=>badge(i.status)}
      ],
      fields:adminInvoiceFields.map(f=>f.k==='companyId'?{...f,def:id}:f),
      beforeSave:o=>{o.companyId=o.companyId||id;return o;}});
  }else{
    body=renderTable({key:'co-tk-'+id,col:'tickets',title:'تذاكر دعم '+c.name,
      addLabel:'فتح تذكرة',searchKeys:['subject','priority','status'],
      where:t=>t.companyId===id,
      filters:[{k:'status',label:'الحالة',options:['مفتوحة','قيد التنفيذ','مغلقة']}],
      columns:[
        {k:'subject',l:'الموضوع',sort:1},
        {k:'priority',l:'الأولوية',sort:1,r:t=>badge(t.priority)},
        {k:'date',l:'تاريخ الفتح',sort:1},
        {k:'status',l:'الحالة',sort:1,r:t=>badge(t.status)}
      ],
      fields:ticketFields.map(f=>f.k==='companyId'?{...f,def:id}:f),
      beforeSave:o=>{o.companyId=o.companyId||id;return o;}});
  }
  return adminShell(`
    <div class="panel"><div class="detail-head">
      <span class="avatar">${initials(c.name)}</span>
      <div><h2>${esc(c.name)}</h2>
        <div class="detail-meta"><span>${esc(c.industry)}</span><span>•</span><span>${esc(planName(c.planId))}</span><span>•</span><span>${badge(c.status)}</span></div></div>
      <div class="detail-actions">
        <a class="btn ghost sm" href="#/admin/companies">${ico('building')} كل الشركات</a>
        <button class="btn primary sm" onclick="tblEdit('admin-companies-q','${c.id}')">${ico('edit')} تعديل بيانات الحساب</button>
      </div></div></div>
    <nav class="tabs">${tabs.map(t=>`<a class="tab ${t[0]===tab?'on':''}" href="#/admin/companies/${id}/${t[0]}">${t[1]}</a>`).join('')}</nav>
    ${body}
  `,'companies','ملف شركة: '+c.name,'إدارة الاشتراكات والفواتير والدعم لهذا الحساب');
}

/* ===== بيع الاشتراكات ===== */
function adminSubscriptions(){
  const subs=col('subscriptions');
  const activeVal=subs.filter(s=>s.status==='نشط').reduce((a,s)=>a+s.amount,0);
  return adminShell(`
    <div class="kpis">
      ${kpiCard('cart','إجمالي عمليات البيع',num(subs.length),'+6.2%','var(--em)')}
      ${kpiCard('shield','اشتراكات نشطة',num(subs.filter(s=>s.status==='نشط').length),'+4.8%','var(--blue)')}
      ${kpiCard('wallet','قيمة العقود النشطة',money(activeVal),'+11.7%','var(--gold)')}
      ${kpiCard('bell','تنتهي خلال 60 يومًا',num(subs.filter(s=>s.status==='نشط'&&s.end<'2024-09-01').length),'','var(--danger)')}
    </div>
    ${renderTable({
      key:'admin-subs',col:'subscriptions',title:'سجل بيع الاشتراكات',
      addLabel:'بيع اشتراك جديد',addTitle:'بيع اشتراك جديد لشركة',
      searchKeys:['method','status'],
      filters:[
        {k:'status',label:'الحالة',options:['نشط','منتهي','ملغي']},
        {k:'planId',label:'الباقة',options:planOptions},
        {k:'method',label:'وسيلة الدفع',options:['تحويل بنكي','بطاقة ائتمانية','مدى','تجربة مجانية']}
      ],
      columns:[
        {k:'companyId',l:'الشركة',r:s=>`<div class="cell-main"><b>${esc(companyName(s.companyId))}</b><span>${esc(s.id)}</span></div>`},
        {k:'planId',l:'الباقة',r:s=>esc(planName(s.planId))},
        {k:'start',l:'البداية',sort:1},{k:'end',l:'الانتهاء',sort:1},
        {k:'amount',l:'القيمة',sort:1,r:s=>money(s.amount)},
        {k:'method',l:'الدفع'},
        {k:'status',l:'الحالة',sort:1,r:s=>badge(s.status)}
      ],
      fields:subscriptionFields
    })}
  `,'subscriptions','بيع الاشتراكات','سجّل عمليات بيع وتجديد اشتراكات الشركات وتابع انتهاءها');
}

/* ===== الباقات ===== */
function adminPlans(){
  const plans=col('plans');
  return adminShell(`
    <div class="grid-3">
      ${plans.map((p,i)=>`<div class="panel rv d${i+1}" style="border-color:${p.id==='p2'?'rgba(53,227,178,.45)':'var(--line)'}">
        <div class="panel-head"><h3>${esc(p.name)}</h3>${badge(p.status)}</div>
        <div style="font-family:var(--font-d);font-size:1.9rem;color:var(--em)">${num(p.price)} <small style="font-size:.8rem;color:var(--muted)">ر.س/${esc(p.period)}</small></div>
        <p style="color:var(--muted);font-size:.85rem;margin:10px 0">${esc(p.desc)}</p>
        <p style="font-size:.82rem"><b>المستخدمون:</b> ${esc(p.users)} • <b>التخزين:</b> ${esc(p.storage)}</p>
        <p style="font-size:.82rem;color:var(--muted);margin-top:6px">${esc(p.modules)}</p>
        <p style="font-size:.78rem;color:var(--gold);margin-top:10px">${num(col('companies').filter(c=>c.planId===p.id).length)} شركة مشتركة بهذه الباقة</p>
      </div>`).join('')}
    </div>
    ${renderTable({
      key:'admin-plans',col:'plans',title:'إدارة الباقات',
      addLabel:'إنشاء باقة جديدة',searchKeys:['name','modules'],
      filters:[{k:'status',label:'الحالة',options:['نشط','موقوف']}],
      columns:[
        {k:'name',l:'الباقة',sort:1},
        {k:'price',l:'السعر',sort:1,r:p=>money(p.price)+' / '+esc(p.period)},
        {k:'users',l:'المستخدمون'},
        {k:'storage',l:'التخزين'},
        {k:'status',l:'الحالة',sort:1,r:p=>badge(p.status)}
      ],
      fields:planFields
    })}
  `,'plans','الباقات والأسعار','صمّم باقاتك وحدّد أسعار البيع وحدود الاستخدام');
}

/* ===== فواتير المنصة ===== */
function adminInvoicesView(){
  const inv=col('adminInvoices');
  const paid=inv.filter(i=>i.status==='مدفوعة').reduce((a,i)=>a+i.amount,0);
  const due=inv.filter(i=>i.status!=='مدفوعة').reduce((a,i)=>a+i.amount,0);
  return adminShell(`
    <div class="kpis">
      ${kpiCard('file','إجمالي الفواتير الصادرة',num(inv.length),'','var(--blue)')}
      ${kpiCard('wallet','إجمالي المحصّل',money(paid),'+9.3%','var(--em)')}
      ${kpiCard('bell','مبالغ بانتظار التحصيل',money(due),'','var(--warn)')}
      ${kpiCard('shield','نسبة التحصيل',Math.round(paid/(paid+due||1)*100)+'%','+2.1%','var(--gold)')}
    </div>
    ${renderTable({
      key:'admin-invoices',col:'adminInvoices',title:'فواتير اشتراكات المنصة',
      addLabel:'إصدار فاتورة',searchKeys:['number'],
      filters:[{k:'status',label:'الحالة',options:['مدفوعة','معلقة','متأخرة']}],
      columns:[
        {k:'number',l:'رقم الفاتورة',sort:1,r:i=>`<div class="cell-main"><b>${esc(i.number)}</b><span>${esc(companyName(i.companyId))}</span></div>`},
        {k:'date',l:'الإصدار',sort:1},{k:'due',l:'الاستحقاق',sort:1},
        {k:'amount',l:'المبلغ',sort:1,r:i=>money(i.amount)},
        {k:'status',l:'الحالة',sort:1,r:i=>badge(i.status)}
      ],
      fields:adminInvoiceFields
    })}
  `,'invoices','فواتير المنصة','فواتير بيع وتجديد اشتراكات الشركات وحالة تحصيلها');
}

/* ===== تذاكر الدعم ===== */
function adminTickets(){
  return adminShell(renderTable({
    key:'admin-tickets',col:'tickets',title:'تذاكر دعم الشركات المشتركة',
    addLabel:'فتح تذكرة',searchKeys:['subject'],
    filters:[
      {k:'status',label:'الحالة',options:['مفتوحة','قيد التنفيذ','مغلقة']},
      {k:'priority',label:'الأولوية',options:['عاجلة','مرتفعة','متوسطة','منخفضة']}
    ],
    columns:[
      {k:'subject',l:'الموضوع',sort:1,r:t=>`<div class="cell-main"><b>${esc(t.subject)}</b><span>${esc(companyName(t.companyId))}</span></div>`},
      {k:'priority',l:'الأولوية',sort:1,r:t=>badge(t.priority)},
      {k:'date',l:'تاريخ الفتح',sort:1},
      {k:'status',l:'الحالة',sort:1,r:t=>badge(t.status)}
    ],
    fields:ticketFields
  }),'tickets','تذاكر الدعم الفني','تابع طلبات الشركات وحلّها ضمن اتفاقية مستوى الخدمة');
}

/* ===== فريق المنصة ===== */
function adminUsers(){
  return adminShell(renderTable({
    key:'admin-users',col:'platformUsers',title:'فريق إدارة المنصة',
    addLabel:'إضافة عضو فريق',searchKeys:['name','email','role'],
    filters:[
      {k:'role',label:'الدور',options:['مدير المنصة','مشرف مبيعات','دعم فني','محاسب']},
      {k:'status',label:'الحالة',options:['نشط','موقوف']}
    ],
    columns:[
      {k:'name',l:'العضو',sort:1,r:u=>`<div class="cell-main"><b>${esc(u.name)}</b><span>${esc(u.email)}</span></div>`},
      {k:'role',l:'الدور',sort:1},
      {k:'lastLogin',l:'آخر دخول',sort:1},
      {k:'status',l:'الحالة',sort:1,r:u=>badge(u.status)}
    ],
    fields:platformUserFields
  }),'users','فريق المنصة','أدوار وصلاحيات موظفي أكوادرا: مبيعات، دعم، ومحاسبة');
}

/* ===== تقارير الإيرادات ===== */
function adminReports(){
  const cos=col('companies');
  const byCountry={};cos.forEach(c=>byCountry[c.country]=(byCountry[c.country]||0)+1);
  const byIndustry={};cos.forEach(c=>byIndustry[c.industry]=(byIndustry[c.industry]||0)+c.revenue);
  const topInd=Object.entries(byIndustry).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return adminShell(`
    <div class="grid-2">
      <div class="panel rv"><div class="panel-head"><h3>نمو الإيراد الشهري المتكرر</h3><p>قيمة الاشتراكات المفوترة شهريًا (ر.س)</p></div>
        ${barChart(REV_MONTHS,MONTHS,'#f3c46b')}</div>
      <div class="panel rv d1"><div class="panel-head"><h3>الشركات حسب الدولة</h3><p>التوزع الجغرافي لحسابات المنصة</p></div>
        ${donutChart(Object.entries(byCountry).map(([l,v])=>({l,v})),num(cos.length))}</div>
    </div>
    <div class="grid-2 even">
      <div class="panel rv"><div class="panel-head"><h3>أعلى القطاعات إيرادًا</h3><p>إجمالي ما حققته المنصة من كل نشاط</p></div>
        <table class="mini-table">${topInd.map(([l,v],i)=>`<tr><td><b style="color:${CHART_COLORS[i]}">${i+1}.</b> ${esc(l)}</td><td><b>${money(v)}</b></td></tr>`).join('')}</table></div>
      <div class="panel rv d1"><div class="panel-head"><h3>مؤشرات صحة المنصة</h3><p>أرقام تشغيلية رئيسية</p></div>
        <table class="mini-table">
          <tr><td>متوسط إيراد الشركة الواحدة</td><td><b>${money(Math.round(cos.reduce((a,c)=>a+c.revenue,0)/(cos.length||1)))}</b></td></tr>
          <tr><td>معدل تجديد الاشتراكات</td><td><b style="color:var(--em)">91.4%</b></td></tr>
          <tr><td>معدل تحويل الحسابات التجريبية</td><td><b style="color:var(--gold)">62%</b></td></tr>
          <tr><td>متوسط زمن إغلاق تذكرة الدعم</td><td><b>3.2 ساعة</b></td></tr>
        </table></div>
    </div>
  `,'reports','تقارير الإيرادات والنمو','حلّل أداء بيع الحسابات والاشتراكات عبر الزمن والقطاعات');
}

/* ===== الإعدادات (تبويبات عميقة) ===== */
function settingsBody(tab,scope){
  const t=tab||'general';
  if(t==='general')return `<div class="settings-grid">
      <div class="field"><label>${scope==='erp'?'اسم الشركة':'اسم المنصة'}</label><input value="${scope==='erp'?'شركة النخبة للتجارة':'أكوادرا ERP'}"/></div>
      <div class="field"><label>البريد الرسمي</label><input value="${scope==='erp'?'info@elite-trade.sa':'admin@akwadra.com'}"/></div>
      <div class="field"><label>العملة الافتراضية</label><select><option>ريال سعودي (ر.س)</option><option>درهم إماراتي</option><option>دينار كويتي</option><option>دولار أمريكي</option></select></div>
      <div class="field"><label>المنطقة الزمنية</label><select><option>الرياض (GMT+3)</option><option>دبي (GMT+4)</option><option>القاهرة (GMT+2)</option></select></div>
      <div class="field"><label>بداية السنة المالية</label><input type="date" value="2024-01-01"/></div>
      <div class="field"><label>لغة الواجهة</label><select><option>العربية</option><option>English</option></select></div>
    </div>`;
  if(t==='billing')return `<div class="settings-grid">
      <div class="field"><label>الرقم الضريبي</label><input value="3104587612300003"/></div>
      <div class="field"><label>نسبة ضريبة القيمة المضافة</label><input type="number" value="15"/></div>
      <div class="field"><label>بادئة أرقام الفواتير</label><input value="${scope==='erp'?'S-INV-':'INV-2024-'}"/></div>
      <div class="field"><label>شروط السداد الافتراضية</label><select><option>14 يومًا من الإصدار</option><option>30 يومًا من الإصدار</option><option>فوري</option></select></div>
      <div class="field full"><label>نص أسفل الفاتورة</label><textarea>شكراً لتعاملكم معنا — تستحق الفاتورة خلال مدة السداد الموضحة أعلاه.</textarea></div>
    </div>`;
  if(t==='security')return `<div>
      <div class="toggle-row"><div><b>التحقق بخطوتين لكل المستخدمين</b><span>رمز إضافي عبر تطبيق المصادقة عند كل تسجيل دخول</span></div><label class="switch"><input type="checkbox" checked/><i></i></label></div>
      <div class="toggle-row"><div><b>قفل الجلسة بعد 30 دقيقة خمول</b><span>حماية الأجهزة المشتركة في الفروع والمستودعات</span></div><label class="switch"><input type="checkbox" checked/><i></i></label></div>
      <div class="toggle-row"><div><b>سجل التدقيق التفصيلي</b><span>تسجيل كل عمليات الإنشاء والتعديل والحذف باسم المستخدم</span></div><label class="switch"><input type="checkbox" checked/><i></i></label></div>
      <div class="toggle-row"><div><b>تقييد الدخول بعناوين IP محددة</b><span>السماح بالوصول من شبكة المكتب فقط</span></div><label class="switch"><input type="checkbox"/><i></i></label></div>
    </div>`;
  return `<div>
      <div class="toggle-row"><div><b>تنبيه انتهاء الاشتراكات قبل 30 يومًا</b><span>بريد تلقائي لفريق المبيعات وللشركة</span></div><label class="switch"><input type="checkbox" checked/><i></i></label></div>
      <div class="toggle-row"><div><b>تنبيه الفواتير المتأخرة</b><span>تذكير يومي حتى السداد</span></div><label class="switch"><input type="checkbox" checked/><i></i></label></div>
      <div class="toggle-row"><div><b>تنبيهات انخفاض المخزون</b><span>عند وصول أي صنف لحد إعادة الطلب</span></div><label class="switch"><input type="checkbox" checked/><i></i></label></div>
      <div class="toggle-row"><div><b>ملخص أسبوعي للأداء</b><span>تقرير بريدي صباح كل أحد بأهم المؤشرات</span></div><label class="switch"><input type="checkbox"/><i></i></label></div>
    </div>`;
}
function settingsView(scope,tab){
  const tabs=[['general','عام'],['billing','الفوترة والضريبة'],['security','الأمان'],['notifications','الإشعارات']];
  const base=scope==='erp'?'#/erp/settings':'#/admin/settings';
  const content=`
    <nav class="tabs">${tabs.map(t=>`<a class="tab ${t[0]===(tab||'general')?'on':''}" href="${base}/${t[0]}">${t[1]}</a>`).join('')}</nav>
    <div class="panel">${settingsBody(tab,scope)}
      <div class="modal-actions" style="margin-top:20px"><button class="btn primary" onclick="toast('تم حفظ الإعدادات بنجاح')">حفظ الإعدادات</button></div>
    </div>`;
  if(scope==='erp')return erpShell(content,'settings','إعدادات الشركة','اضبط بيانات شركتك والفوترة والأمان والإشعارات');
  return adminShell(content,'settings','إعدادات المنصة','تحكم في هوية المنصة وقواعد الفوترة والأمان');
}
