'use strict';
/* ============ أكوادرا ERP — لوحة الشركة (النخبة للتجارة) ============ */

const ERP_NAV=[
 {sec:'العمليات اليومية'},
 {h:'#/erp',i:'dash',l:'لوحة قيادة الشركة',k:'home'},
 {h:'#/erp/sales',i:'cart',l:'المبيعات والفوترة',k:'sales'},
 {h:'#/erp/products',i:'box',l:'المخزون والأصناف',k:'products'},
 {h:'#/erp/purchases',i:'truck',l:'المشتريات',k:'purchases'},
 {sec:'الأطراف والفريق'},
 {h:'#/erp/customers',i:'crm',l:'العملاء CRM',k:'customers'},
 {h:'#/erp/suppliers',i:'building',l:'الموردون',k:'suppliers'},
 {h:'#/erp/hr',i:'hr',l:'الموارد البشرية',k:'hr'},
 {sec:'المالية والتحليل'},
 {h:'#/erp/accounting',i:'book',l:'المحاسبة والقيود',k:'accounting'},
 {h:'#/erp/reports',i:'chart',l:'تقارير الأعمال',k:'reports'},
 {h:'#/erp/settings',i:'gear',l:'إعدادات الشركة',k:'settings'}
];
function erpShell(content,active,title,subtitle){
  const s=session()||{name:'شركة النخبة للتجارة',title:'باقة النمو'};
  return dashShell(content,ERP_NAV,active,title,subtitle,'erp-theme',s.name||'شركة النخبة للتجارة',s.title||'باقة النمو');
}

/* ===== حقول النماذج ===== */
const productFields=[
 {k:'sku',label:'رمز الصنف SKU',req:1,ph:'SKU-10XX'},
 {k:'name',label:'اسم الصنف',req:1,full:1},
 {k:'category',label:'التصنيف',type:'select',options:['إلكترونيات','مكتبية','أثاث مكتبي','تجهيزات متاجر','قطع غيار','تغليف']},
 {k:'unit',label:'وحدة القياس',type:'select',options:['قطعة','كرتون','كجم','لتر']},
 {k:'price',label:'سعر البيع (ر.س)',type:'number',req:1},
 {k:'cost',label:'تكلفة الشراء (ر.س)',type:'number'},
 {k:'stock',label:'الرصيد الحالي',type:'number',def:0},
 {k:'min',label:'حد إعادة الطلب',type:'number',def:5}
];
const customerFields=[
 {k:'name',label:'اسم العميل',req:1},
 {k:'type',label:'نوع العميل',type:'select',options:['شركة','فرد']},
 {k:'email',label:'البريد الإلكتروني',type:'email'},
 {k:'phone',label:'رقم الجوال'},
 {k:'city',label:'المدينة',type:'select',options:['الرياض','جدة','الدمام','الخبر','مكة','أبها','الطائف','القصيم']},
 {k:'balance',label:'الرصيد المستحق (ر.س)',type:'number',def:0},
 {k:'orders',label:'عدد الطلبات',type:'number',def:0}
];
const salesInvoiceFields=[
 {k:'number',label:'رقم الفاتورة',req:1,ph:'S-INV-30XX'},
 {k:'customer',label:'العميل',req:1},
 {k:'date',label:'تاريخ الإصدار',type:'date',def:today()},
 {k:'due',label:'تاريخ الاستحقاق',type:'date'},
 {k:'amount',label:'إجمالي الفاتورة (ر.س)',type:'number',req:1},
 {k:'paid',label:'المبلغ المحصّل (ر.س)',type:'number',def:0},
 {k:'status',label:'حالة السداد',type:'select',options:['مدفوعة','جزئي','معلقة','متأخرة']}
];
const purchaseFields=[
 {k:'number',label:'رقم أمر الشراء',req:1,ph:'PO-2024-XXX'},
 {k:'supplier',label:'المورد',req:1},
 {k:'date',label:'تاريخ الأمر',type:'date',def:today()},
 {k:'amount',label:'قيمة الأمر (ر.س)',type:'number',req:1},
 {k:'status',label:'الحالة',type:'select',options:['قيد التنفيذ','مكتمل','ملغي']}
];
const supplierFields=[
 {k:'name',label:'اسم المورد',req:1,full:1},
 {k:'contact',label:'مسؤول التواصل'},
 {k:'phone',label:'رقم الهاتف'},
 {k:'category',label:'تخصص التوريد',type:'select',options:['إلكترونيات','أثاث مكتبي','مكتبية','تجهيزات متاجر','تغليف','قطع غيار']},
 {k:'balance',label:'الرصيد المستحق له (ر.س)',type:'number',def:0}
];
const employeeFields=[
 {k:'name',label:'اسم الموظف',req:1},
 {k:'dept',label:'الإدارة',type:'select',options:['المالية','المبيعات','المستودعات','الموارد البشرية','التقنية','خدمة العملاء']},
 {k:'title',label:'المسمى الوظيفي',req:1},
 {k:'salary',label:'الراتب الشهري (ر.س)',type:'number',req:1},
 {k:'hireDate',label:'تاريخ التعيين',type:'date'},
 {k:'status',label:'الحالة',type:'select',options:['نشط','إجازة','منتهي']},
 {k:'email',label:'البريد الوظيفي',type:'email',full:1}
];
const journalFields=[
 {k:'number',label:'رقم القيد',req:1,ph:'JE-9XX'},
 {k:'date',label:'التاريخ',type:'date',def:today()},
 {k:'account',label:'الحساب',type:'select',options:['الصندوق','البنك','المبيعات','المشتريات','المصروفات','الرواتب','الأصول الثابتة','العملاء','الموردون']},
 {k:'status',label:'حالة الترحيل',type:'select',options:['مرحّل','مسودة']},
 {k:'debit',label:'مدين (ر.س)',type:'number',def:0},
 {k:'credit',label:'دائن (ر.س)',type:'number',def:0},
 {k:'desc',label:'البيان',type:'textarea',req:1}
];

/* ===== لوحة قيادة الشركة ===== */
function erpHome(){
  const si=col('salesInvoices'),prs=col('products'),cus=col('customers');
  const monthSales=si.reduce((a,x)=>a+x.amount,0);
  const unpaid=si.filter(x=>x.status!=='مدفوعة').reduce((a,x)=>a+(x.amount-x.paid),0);
  const stockVal=prs.reduce((a,p)=>a+p.cost*p.stock,0);
  const lowStock=prs.filter(p=>p.stock<=p.min);
  const catDist={};prs.forEach(p=>catDist[p.category]=(catDist[p.category]||0)+1);
  return erpShell(`
    <div class="kpis">
      ${kpiCard('cart','مبيعات الفترة الحالية',money(monthSales),'+14.2%','var(--blue)')}
      ${kpiCard('bell','ذمم غير محصّلة',money(unpaid),'-3.4%','var(--warn)')}
      ${kpiCard('box','قيمة المخزون بالتكلفة',money(Math.round(stockVal)),'+6.8%','var(--em)')}
      ${kpiCard('crm','عملاء نشطون',num(cus.length),'+5','var(--gold)')}
    </div>
    <div class="grid-2">
      <div class="panel rv"><div class="panel-head"><h3>المبيعات الشهرية (آخر 8 أشهر)</h3><p>إجمالي الفواتير الصادرة بالريال</p></div>
        ${barChart(ERP_SALES_MONTHS,MONTHS,'#5d8bff')}</div>
      <div class="panel rv d1"><div class="panel-head"><h3>الأصناف حسب التصنيف</h3><p>تركيبة مخزونك الحالي</p></div>
        ${donutChart(Object.entries(catDist).map(([l,v])=>({l,v})),num(prs.length))}</div>
    </div>
    <div class="grid-2 even">
      <div class="panel rv"><div class="panel-head"><h3>أحدث فواتير المبيعات</h3><a class="btn ghost sm" href="#/erp/sales">كل الفواتير</a></div>
        <table class="mini-table">${si.slice(0,5).map(x=>`<tr>
          <td><div class="cell-main"><b>${esc(x.number)}</b><span>${esc(x.customer)}</span></div></td>
          <td>${money(x.amount)}</td><td>${badge(x.status)}</td></tr>`).join('')}</table></div>
      <div class="panel rv d1"><div class="panel-head"><h3>تنبيهات المخزون</h3><a class="btn ghost sm" href="#/erp/products">إدارة الأصناف</a></div>
        <table class="mini-table">${lowStock.length?lowStock.slice(0,5).map(p=>`<tr>
          <td><div class="cell-main"><b>${esc(p.name)}</b><span>${esc(p.sku)} • الرصيد: ${num(p.stock)} / حد الطلب: ${num(p.min)}</span></div></td>
          <td>${stockBadge(p)}</td></tr>`).join(''):'<tr><td style="color:var(--muted)">كل الأصناف فوق حد إعادة الطلب ✓</td></tr>'}</table></div>
    </div>
  `,'home','لوحة قيادة الشركة','مبيعاتك ومخزونك وتحصيلاتك في شاشة واحدة لحظية');
}

/* ===== المبيعات ===== */
function erpSales(){
  const si=col('salesInvoices');
  const total=si.reduce((a,x)=>a+x.amount,0),paid=si.reduce((a,x)=>a+x.paid,0);
  return erpShell(`
    <div class="kpis">
      ${kpiCard('cart','إجمالي الفواتير',num(si.length),'','var(--blue)')}
      ${kpiCard('wallet','قيمة المبيعات',money(total),'+14.2%','var(--em)')}
      ${kpiCard('shield','المحصّل فعليًا',money(paid),'+9.8%','var(--gold)')}
      ${kpiCard('bell','متأخرات السداد',num(si.filter(x=>x.status==='متأخرة').length),'','var(--danger)')}
    </div>
    ${renderTable({
      key:'erp-sales',col:'salesInvoices',title:'فواتير المبيعات',
      addLabel:'فاتورة مبيعات جديدة',searchKeys:['number','customer'],searchPh:'ابحث برقم الفاتورة أو اسم العميل...',
      filters:[{k:'status',label:'حالة السداد',options:['مدفوعة','جزئي','معلقة','متأخرة']}],
      columns:[
        {k:'number',l:'الفاتورة',sort:1,r:x=>`<div class="cell-main"><b>${esc(x.number)}</b><span>${esc(x.customer)}</span></div>`},
        {k:'date',l:'الإصدار',sort:1},{k:'due',l:'الاستحقاق',sort:1},
        {k:'amount',l:'الإجمالي',sort:1,r:x=>money(x.amount)},
        {k:'paid',l:'المحصّل',sort:1,r:x=>money(x.paid)},
        {k:'status',l:'الحالة',sort:1,r:x=>badge(x.status)}
      ],
      fields:salesInvoiceFields
    })}
  `,'sales','المبيعات والفوترة','أصدر فواتيرك الإلكترونية وتابع التحصيل أولًا بأول');
}

/* ===== المخزون ===== */
function erpProducts(){
  const prs=col('products');
  return erpShell(`
    <div class="kpis">
      ${kpiCard('box','عدد الأصناف',num(prs.length),'','var(--em)')}
      ${kpiCard('wallet','قيمة المخزون بالتكلفة',money(Math.round(prs.reduce((a,p)=>a+p.cost*p.stock,0))),'','var(--blue)')}
      ${kpiCard('bell','أصناف عند حد الطلب',num(prs.filter(p=>p.stock>0&&p.stock<=p.min).length),'','var(--warn)')}
      ${kpiCard('shield','أصناف نافدة',num(prs.filter(p=>p.stock<=0).length),'','var(--danger)')}
    </div>
    ${renderTable({
      key:'erp-products',col:'products',title:'الأصناف والمستودعات',
      addLabel:'إضافة صنف',searchKeys:['name','sku','category'],searchPh:'ابحث بالاسم أو SKU...',
      filters:[{k:'category',label:'التصنيف',options:['إلكترونيات','مكتبية','أثاث مكتبي','تجهيزات متاجر','قطع غيار','تغليف']},
               {k:'unit',label:'الوحدة',options:['قطعة','كرتون','كجم','لتر']}],
      columns:[
        {k:'name',l:'الصنف',sort:1,r:p=>`<div class="cell-main"><b>${esc(p.name)}</b><span>${esc(p.sku)} • ${esc(p.category)}</span></div>`},
        {k:'price',l:'سعر البيع',sort:1,r:p=>money(p.price)},
        {k:'cost',l:'التكلفة',sort:1,r:p=>money(p.cost)},
        {k:'stock',l:'الرصيد',sort:1,r:p=>num(p.stock)+' '+esc(p.unit)},
        {k:'min',l:'حد الطلب',sort:1,r:p=>num(p.min)},
        {k:'stock',l:'الحالة',r:p=>stockBadge(p)}
      ],
      fields:productFields
    })}
  `,'products','المخزون والأصناف','تتبع أرصدتك لحظيًا واضبط حدود إعادة الطلب لكل صنف');
}

/* ===== المشتريات ===== */
function erpPurchases(){
  const pos=col('purchases');
  return erpShell(`
    <div class="kpis">
      ${kpiCard('truck','أوامر الشراء',num(pos.length),'','var(--blue)')}
      ${kpiCard('wallet','قيمة المشتريات',money(pos.reduce((a,x)=>a+x.amount,0)),'+7.5%','var(--em)')}
      ${kpiCard('bell','قيد التنفيذ',num(pos.filter(x=>x.status==='قيد التنفيذ').length),'','var(--warn)')}
      ${kpiCard('shield','أوامر مكتملة',num(pos.filter(x=>x.status==='مكتمل').length),'','var(--gold)')}
    </div>
    ${renderTable({
      key:'erp-purchases',col:'purchases',title:'أوامر الشراء',
      addLabel:'أمر شراء جديد',searchKeys:['number','supplier'],
      filters:[{k:'status',label:'الحالة',options:['قيد التنفيذ','مكتمل','ملغي']}],
      columns:[
        {k:'number',l:'أمر الشراء',sort:1,r:x=>`<div class="cell-main"><b>${esc(x.number)}</b><span>${esc(x.supplier)}</span></div>`},
        {k:'date',l:'التاريخ',sort:1},
        {k:'amount',l:'القيمة',sort:1,r:x=>money(x.amount)},
        {k:'status',l:'الحالة',sort:1,r:x=>badge(x.status)}
      ],
      fields:purchaseFields
    })}
  `,'purchases','المشتريات والتوريد','دورة شراء كاملة من الطلب حتى استلام البضاعة وفاتورة المورد');
}

/* ===== العملاء ===== */
function erpCustomers(){
  const cus=col('customers');
  return erpShell(`
    <div class="kpis">
      ${kpiCard('crm','إجمالي العملاء',num(cus.length),'+5','var(--gold)')}
      ${kpiCard('building','عملاء شركات',num(cus.filter(c=>c.type==='شركة').length),'','var(--blue)')}
      ${kpiCard('wallet','إجمالي الذمم المدينة',money(cus.reduce((a,c)=>a+c.balance,0)),'','var(--warn)')}
      ${kpiCard('cart','إجمالي الطلبات',num(cus.reduce((a,c)=>a+c.orders,0)),'+12%','var(--em)')}
    </div>
    ${renderTable({
      key:'erp-customers',col:'customers',title:'سجل العملاء',
      addLabel:'إضافة عميل',searchKeys:['name','email','phone','city'],
      filters:[{k:'type',label:'النوع',options:['شركة','فرد']},
               {k:'city',label:'المدينة',options:['الرياض','جدة','الدمام','الخبر','مكة','أبها','الطائف','القصيم']}],
      columns:[
        {k:'name',l:'العميل',sort:1,r:c=>`<div class="cell-main"><b>${esc(c.name)}</b><span>${esc(c.email)}</span></div>`},
        {k:'type',l:'النوع',sort:1,r:c=>badge(c.type)},
        {k:'city',l:'المدينة',sort:1},
        {k:'orders',l:'الطلبات',sort:1,r:c=>num(c.orders)},
        {k:'balance',l:'الرصيد المستحق',sort:1,r:c=>money(c.balance)}
      ],
      fields:customerFields
    })}
  `,'customers','علاقات العملاء CRM','اعرف عملاءك: أرصدتهم، طلباتهم، ومدنهم في سجل واحد');
}

/* ===== الموردون ===== */
function erpSuppliers(){
  const sus=col('suppliers');
  return erpShell(`
    <div class="kpis">
      ${kpiCard('building','الموردون المعتمدون',num(sus.length),'','var(--blue)')}
      ${kpiCard('wallet','إجمالي المستحق للموردين',money(sus.reduce((a,s)=>a+s.balance,0)),'','var(--warn)')}
      ${kpiCard('truck','أوامر شراء هذا الشهر',num(col('purchases').length),'','var(--em)')}
      ${kpiCard('shield','موردون بدون مستحقات',num(sus.filter(s=>s.balance===0).length),'','var(--gold)')}
    </div>
    ${renderTable({
      key:'erp-suppliers',col:'suppliers',title:'سجل الموردين',
      addLabel:'إضافة مورد',searchKeys:['name','contact','phone'],
      filters:[{k:'category',label:'التخصص',options:['إلكترونيات','أثاث مكتبي','مكتبية','تجهيزات متاجر','تغليف','قطع غيار']}],
      columns:[
        {k:'name',l:'المورد',sort:1,r:s=>`<div class="cell-main"><b>${esc(s.name)}</b><span>${esc(s.contact)}</span></div>`},
        {k:'category',l:'التخصص',sort:1},
        {k:'phone',l:'الهاتف'},
        {k:'balance',l:'المستحق له',sort:1,r:s=>money(s.balance)}
      ],
      fields:supplierFields
    })}
  `,'suppliers','الموردون','قاعدة مورديك وأرصدتهم لتفاوض أفضل وسداد منضبط');
}

/* ===== الموارد البشرية ===== */
function erpHR(){
  const emps=col('employees');
  const payroll=emps.filter(e=>e.status!=='منتهي').reduce((a,e)=>a+e.salary,0);
  const deptDist={};emps.forEach(e=>deptDist[e.dept]=(deptDist[e.dept]||0)+1);
  return erpShell(`
    <div class="kpis">
      ${kpiCard('hr','إجمالي الموظفين',num(emps.length),'+2','var(--em)')}
      ${kpiCard('wallet','مسير الرواتب الشهري',money(payroll),'','var(--gold)')}
      ${kpiCard('bell','في إجازة حاليًا',num(emps.filter(e=>e.status==='إجازة').length),'','var(--warn)')}
      ${kpiCard('users','إدارات نشطة',num(Object.keys(deptDist).length),'','var(--blue)')}
    </div>
    <div class="grid-2">
      ${renderTable({
        key:'erp-hr',col:'employees',title:'ملفات الموظفين',
        addLabel:'إضافة موظف',searchKeys:['name','title','email'],
        filters:[{k:'dept',label:'الإدارة',options:['المالية','المبيعات','المستودعات','الموارد البشرية','التقنية','خدمة العملاء']},
                 {k:'status',label:'الحالة',options:['نشط','إجازة','منتهي']}],
        columns:[
          {k:'name',l:'الموظف',sort:1,r:e=>`<div class="cell-main"><b>${esc(e.name)}</b><span>${esc(e.title)}</span></div>`},
          {k:'dept',l:'الإدارة',sort:1},
          {k:'salary',l:'الراتب',sort:1,r:e=>money(e.salary)},
          {k:'hireDate',l:'التعيين',sort:1},
          {k:'status',l:'الحالة',sort:1,r:e=>badge(e.status)}
        ],
        fields:employeeFields
      })}
      <div class="panel rv d1"><div class="panel-head"><h3>توزيع الفريق على الإدارات</h3><p>أين تتركز الكفاءات؟</p></div>
        ${donutChart(Object.entries(deptDist).map(([l,v])=>({l,v})),num(emps.length))}</div>
    </div>
  `,'hr','الموارد البشرية والرواتب','ملفات موظفيك ومسير رواتبك وحالات الإجازة في مكان واحد');
}

/* ===== المحاسبة ===== */
function erpAccounting(){
  const jn=col('journal');
  const debit=jn.reduce((a,x)=>a+x.debit,0),credit=jn.reduce((a,x)=>a+x.credit,0);
  return erpShell(`
    <div class="kpis">
      ${kpiCard('book','قيود اليومية',num(jn.length),'','var(--em)')}
      ${kpiCard('wallet','إجمالي المدين',money(debit),'','var(--blue)')}
      ${kpiCard('wallet','إجمالي الدائن',money(credit),'','var(--gold)')}
      ${kpiCard('bell','قيود مسودة بانتظار الترحيل',num(jn.filter(x=>x.status==='مسودة').length),'','var(--warn)')}
    </div>
    ${renderTable({
      key:'erp-journal',col:'journal',title:'قيود اليومية العامة',
      addLabel:'قيد يدوي جديد',searchKeys:['number','desc','account'],searchPh:'ابحث برقم القيد أو البيان...',
      filters:[{k:'account',label:'الحساب',options:['الصندوق','البنك','المبيعات','المشتريات','المصروفات','الرواتب','الأصول الثابتة','العملاء','الموردون']},
               {k:'status',label:'الترحيل',options:['مرحّل','مسودة']}],
      columns:[
        {k:'number',l:'القيد',sort:1,r:x=>`<div class="cell-main"><b>${esc(x.number)}</b><span>${esc(x.desc)}</span></div>`},
        {k:'date',l:'التاريخ',sort:1},
        {k:'account',l:'الحساب',sort:1},
        {k:'debit',l:'مدين',sort:1,r:x=>x.debit?money(x.debit):'—'},
        {k:'credit',l:'دائن',sort:1,r:x=>x.credit?money(x.credit):'—'},
        {k:'status',l:'الترحيل',sort:1,r:x=>badge(x.status)}
      ],
      fields:journalFields
    })}
  `,'accounting','المحاسبة والقيود','دفتر يوميتك: قيود تلقائية من العمليات وقيود يدوية بترحيل مضبوط');
}

/* ===== تقارير الشركة ===== */
function erpReports(){
  const si=col('salesInvoices'),prs=col('products');
  const byCust={};si.forEach(x=>byCust[x.customer]=(byCust[x.customer]||0)+x.amount);
  const topCust=Object.entries(byCust).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const margin=prs.map(p=>({l:p.name,v:Math.round((p.price-p.cost)*p.stock)})).sort((a,b)=>b.v-a.v).slice(0,5);
  return erpShell(`
    <div class="grid-2">
      <div class="panel rv"><div class="panel-head"><h3>منحنى المبيعات الشهري</h3><p>أداء الفوترة عبر آخر 8 أشهر (ر.س)</p></div>
        ${barChart(ERP_SALES_MONTHS,MONTHS,'#35e3b2')}</div>
      <div class="panel rv d1"><div class="panel-head"><h3>أعلى العملاء شراءً</h3><p>إجمالي فواتير كل عميل</p></div>
        <table class="mini-table">${topCust.map(([l,v],i)=>`<tr><td><b style="color:${CHART_COLORS[i]}">${i+1}.</b> ${esc(l)}</td><td><b>${money(v)}</b></td></tr>`).join('')}</table></div>
    </div>
    <div class="grid-2 even">
      <div class="panel rv"><div class="panel-head"><h3>هامش الربح الكامن بالمخزون</h3><p>(سعر البيع − التكلفة) × الرصيد لأعلى 5 أصناف</p></div>
        <table class="mini-table">${margin.map((m,i)=>`<tr><td><b style="color:${CHART_COLORS[i]}">${i+1}.</b> ${esc(m.l)}</td><td><b>${money(m.v)}</b></td></tr>`).join('')}</table></div>
      <div class="panel rv d1"><div class="panel-head"><h3>مؤشرات مالية سريعة</h3><p>صحة التشغيل بنظرة واحدة</p></div>
        <table class="mini-table">
          <tr><td>متوسط قيمة الفاتورة</td><td><b>${money(Math.round(si.reduce((a,x)=>a+x.amount,0)/(si.length||1)))}</b></td></tr>
          <tr><td>نسبة التحصيل</td><td><b style="color:var(--em)">${Math.round(si.reduce((a,x)=>a+x.paid,0)/(si.reduce((a,x)=>a+x.amount,0)||1)*100)}%</b></td></tr>
          <tr><td>متوسط هامش الربح على الأصناف</td><td><b style="color:var(--gold)">${Math.round(prs.reduce((a,p)=>a+(p.price-p.cost)/(p.price||1),0)/(prs.length||1)*100)}%</b></td></tr>
          <tr><td>مسير الرواتب ÷ المبيعات الشهرية</td><td><b>${Math.round(col('employees').reduce((a,e)=>a+e.salary,0)/(ERP_SALES_MONTHS[7]||1)*100)}%</b></td></tr>
        </table></div>
    </div>
  `,'reports','تقارير الأعمال','قرارات أسرع بأرقام لحظية: عملاؤك وأصنافك وهوامشك');
}
