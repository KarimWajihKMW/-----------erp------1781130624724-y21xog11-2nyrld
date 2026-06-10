'use strict';
/* ============ أكوادرا ERP — النواة: أدوات + بيانات + مخزن ============ */
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const money=n=>Number(n||0).toLocaleString('en-US')+' ر.س';
const num=n=>Number(n||0).toLocaleString('en-US');
const shortN=n=>n>=1e6?(n/1e6).toFixed(1)+'م':n>=1e3?Math.round(n/1e3)+'ك':String(Math.round(n));
const uid=p=>(p||'id')+'-'+Date.now().toString(36).slice(-4)+Math.random().toString(36).slice(2,6);
const today=()=>new Date().toISOString().slice(0,10);
const initials=s=>String(s||'؟').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join(' ');

/* ===== أيقونات SVG ===== */
const I={
 dash:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
 building:'<path d="M4 21V5l8-3v19"/><path d="M12 21h8V9l-8-3"/><path d="M8 9h.01M8 13h.01M8 17h.01"/>',
 layers:'<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
 cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.5h11L21 7H6"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
 ticket:'<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M14 7v10"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 14.7c2.8.2 4.8 1.9 5.5 5.3"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
 gear:'<circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.5a7 7 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 2 1.2l.4 2.5h4l.4-2.5a7 7 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.07-.4.1-.8.1-1.2z"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
 box:'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
 truck:'<rect x="1" y="6" width="13" height="10" rx="1.5"/><path d="M14 9h4l3 3v4h-7"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="17.5" cy="18.5" r="1.8"/>',
 hr:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8 17c.6-2 2.2-3 4-3s3.4 1 4 3"/>',
 wallet:'<rect x="2" y="6" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M16 15h3"/>',
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
 menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
 crm:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
 shield:'<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'
};
const ico=n=>`<svg viewBox="0 0 24 24">${I[n]||I.dash}</svg>`;

/* ===== بيانات البداية ===== */
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس'];
const REV_MONTHS=[182000,195400,210800,198600,226300,241900,238500,262400];
const ERP_SALES_MONTHS=[42500,51200,47800,56400,61900,58300,67200,72800];
function seed(){return{
 plans:[
  {id:'p1',name:'باقة الانطلاق',price:299,period:'شهري',users:'10 مستخدمين',storage:'20 جيجا',modules:'المحاسبة • المبيعات • المخزون',desc:'للشركات الناشئة التي تبدأ رحلة الرقمنة',status:'نشط'},
  {id:'p2',name:'باقة النمو',price:799,period:'شهري',users:'50 مستخدمًا',storage:'100 جيجا',modules:'وحدات الانطلاق + CRM • المشتريات • الموارد البشرية',desc:'الأكثر اختيارًا للشركات المتوسطة النامية',status:'نشط'},
  {id:'p3',name:'باقة المؤسسات',price:1999,period:'شهري',users:'غير محدود',storage:'1 تيرا',modules:'جميع الوحدات + ذكاء أعمال • API مفتوح • فروع متعددة',desc:'للمجموعات والمؤسسات متعددة الفروع',status:'نشط'}
 ],
 companies:[
  {id:'co-1',name:'شركة النخبة للتجارة',industry:'تجارة التجزئة',planId:'p2',status:'نشط',users:34,email:'info@elite-trade.sa',phone:'0501234567',country:'السعودية',joined:'2023-03-12',revenue:28760},
  {id:'co-2',name:'مؤسسة البنيان للمقاولات',industry:'مقاولات وإنشاءات',planId:'p3',status:'نشط',users:120,email:'erp@bonyan.sa',phone:'0559871234',country:'السعودية',joined:'2022-11-02',revenue:95400},
  {id:'co-3',name:'صيدليات الشفاء',industry:'صحة ودواء',planId:'p2',status:'نشط',users:48,email:'it@alshifa-ph.com',phone:'0533219876',country:'الإمارات',joined:'2023-06-20',revenue:41200},
  {id:'co-4',name:'مطاعم ذواقة',industry:'مطاعم وأغذية',planId:'p1',status:'تجريبي',users:8,email:'admin@thawaqa.com',phone:'0561112233',country:'السعودية',joined:'2024-01-15',revenue:3588},
  {id:'co-5',name:'الأفق للشحن واللوجستيات',industry:'لوجستيات',planId:'p3',status:'نشط',users:210,email:'ops@horizon-log.com',phone:'0544445566',country:'قطر',joined:'2022-08-09',revenue:112300},
  {id:'co-6',name:'تقنية المستقبل',industry:'تقنية وبرمجيات',planId:'p2',status:'نشط',users:27,email:'hello@futuretech.sa',phone:'0577889900',country:'السعودية',joined:'2023-09-01',revenue:19176},
  {id:'co-7',name:'الواحة للأغذية',industry:'مطاعم وأغذية',planId:'p1',status:'موقوف',users:6,email:'acc@alwaha-food.com',phone:'0588776655',country:'الكويت',joined:'2023-02-18',revenue:5980},
  {id:'co-8',name:'روائع العقارية',industry:'عقارات',planId:'p2',status:'نشط',users:41,email:'crm@rawae-re.sa',phone:'0501239988',country:'السعودية',joined:'2023-04-27',revenue:33558},
  {id:'co-9',name:'مصنع الصلب الوطني',industry:'صناعة',planId:'p3',status:'نشط',users:96,email:'erp@steel-national.com',phone:'0567654321',country:'البحرين',joined:'2022-05-30',revenue:87956},
  {id:'co-10',name:'أكاديمية المعرفة',industry:'تعليم وتدريب',planId:'p1',status:'تجريبي',users:12,email:'admin@maarifa-edu.com',phone:'0593332211',country:'مصر',joined:'2024-02-03',revenue:897},
  {id:'co-11',name:'عطور الفخامة',industry:'تجارة التجزئة',planId:'p2',status:'منتهي',users:19,email:'sales@fakhama.sa',phone:'0521098765',country:'السعودية',joined:'2022-12-14',revenue:22372},
  {id:'co-12',name:'النور للطاقة',industry:'طاقة',planId:'p3',status:'نشط',users:74,email:'it@alnoor-energy.com',phone:'0512348765',country:'عُمان',joined:'2023-07-22',revenue:67966}
 ],
 subscriptions:[
  {id:'sb-1',companyId:'co-1',planId:'p2',start:'2024-01-01',end:'2024-12-31',amount:9588,method:'تحويل بنكي',status:'نشط'},
  {id:'sb-2',companyId:'co-2',planId:'p3',start:'2024-02-01',end:'2025-01-31',amount:23988,method:'بطاقة ائتمانية',status:'نشط'},
  {id:'sb-3',companyId:'co-3',planId:'p2',start:'2024-03-15',end:'2025-03-14',amount:9588,method:'مدى',status:'نشط'},
  {id:'sb-4',companyId:'co-4',planId:'p1',start:'2024-04-01',end:'2024-04-30',amount:0,method:'تجربة مجانية',status:'نشط'},
  {id:'sb-5',companyId:'co-5',planId:'p3',start:'2023-09-01',end:'2024-08-31',amount:23988,method:'تحويل بنكي',status:'نشط'},
  {id:'sb-6',companyId:'co-6',planId:'p2',start:'2024-01-10',end:'2025-01-09',amount:9588,method:'بطاقة ائتمانية',status:'نشط'},
  {id:'sb-7',companyId:'co-7',planId:'p1',start:'2023-02-18',end:'2024-02-17',amount:3588,method:'مدى',status:'ملغي'},
  {id:'sb-8',companyId:'co-8',planId:'p2',start:'2024-02-20',end:'2025-02-19',amount:9588,method:'تحويل بنكي',status:'نشط'},
  {id:'sb-9',companyId:'co-9',planId:'p3',start:'2023-06-01',end:'2024-05-31',amount:23988,method:'تحويل بنكي',status:'نشط'},
  {id:'sb-10',companyId:'co-10',planId:'p1',start:'2024-02-03',end:'2024-03-04',amount:0,method:'تجربة مجانية',status:'منتهي'},
  {id:'sb-11',companyId:'co-11',planId:'p2',start:'2023-01-01',end:'2023-12-31',amount:9588,method:'بطاقة ائتمانية',status:'منتهي'},
  {id:'sb-12',companyId:'co-12',planId:'p3',start:'2024-03-01',end:'2025-02-28',amount:23988,method:'تحويل بنكي',status:'نشط'}
 ],
 adminInvoices:[
  {id:'ai-1',number:'INV-2024-001',companyId:'co-1',amount:9588,date:'2024-01-01',due:'2024-01-15',status:'مدفوعة'},
  {id:'ai-2',number:'INV-2024-002',companyId:'co-2',amount:23988,date:'2024-02-01',due:'2024-02-15',status:'مدفوعة'},
  {id:'ai-3',number:'INV-2024-003',companyId:'co-3',amount:9588,date:'2024-03-15',due:'2024-03-29',status:'مدفوعة'},
  {id:'ai-4',number:'INV-2024-004',companyId:'co-5',amount:23988,date:'2024-03-20',due:'2024-04-03',status:'معلقة'},
  {id:'ai-5',number:'INV-2024-005',companyId:'co-6',amount:9588,date:'2024-01-10',due:'2024-01-24',status:'مدفوعة'},
  {id:'ai-6',number:'INV-2024-006',companyId:'co-7',amount:3588,date:'2024-02-18',due:'2024-03-03',status:'متأخرة'},
  {id:'ai-7',number:'INV-2024-007',companyId:'co-8',amount:9588,date:'2024-02-20',due:'2024-03-05',status:'مدفوعة'},
  {id:'ai-8',number:'INV-2024-008',companyId:'co-9',amount:23988,date:'2024-03-01',due:'2024-03-15',status:'معلقة'},
  {id:'ai-9',number:'INV-2024-009',companyId:'co-11',amount:9588,date:'2023-12-01',due:'2023-12-15',status:'متأخرة'},
  {id:'ai-10',number:'INV-2024-010',companyId:'co-12',amount:23988,date:'2024-03-01',due:'2024-03-15',status:'مدفوعة'},
  {id:'ai-11',number:'INV-2024-011',companyId:'co-1',amount:1200,date:'2024-03-22',due:'2024-04-05',status:'معلقة'},
  {id:'ai-12',number:'INV-2024-012',companyId:'co-2',amount:4500,date:'2024-03-25',due:'2024-04-08',status:'مدفوعة'}
 ],
 tickets:[
  {id:'tk-1',companyId:'co-1',subject:'طلب تفعيل الفوترة الإلكترونية',priority:'مرتفعة',status:'قيد التنفيذ',date:'2024-03-18'},
  {id:'tk-2',companyId:'co-5',subject:'خطأ في مزامنة المستودعات',priority:'عاجلة',status:'مفتوحة',date:'2024-03-21'},
  {id:'tk-3',companyId:'co-3',subject:'إضافة مستخدمين جدد للفروع',priority:'منخفضة',status:'مغلقة',date:'2024-03-10'},
  {id:'tk-4',companyId:'co-9',subject:'تخصيص تقرير التكاليف الصناعية',priority:'متوسطة',status:'قيد التنفيذ',date:'2024-03-15'},
  {id:'tk-5',companyId:'co-2',subject:'ربط النظام مع منصة اعتماد',priority:'مرتفعة',status:'مفتوحة',date:'2024-03-20'},
  {id:'tk-6',companyId:'co-8',subject:'استفسار عن ترقية الباقة',priority:'منخفضة',status:'مغلقة',date:'2024-03-08'},
  {id:'tk-7',companyId:'co-6',subject:'مشكلة في تصدير التقارير PDF',priority:'متوسطة',status:'مفتوحة',date:'2024-03-22'},
  {id:'tk-8',companyId:'co-12',subject:'تدريب فريق المحاسبة على النظام',priority:'متوسطة',status:'قيد التنفيذ',date:'2024-03-19'}
 ],
 platformUsers:[
  {id:'pu-1',name:'كريم وجيه',email:'karim@akwadra.com',role:'مدير المنصة',status:'نشط',lastLogin:'2024-03-25'},
  {id:'pu-2',name:'سارة المطيري',email:'sara@akwadra.com',role:'مشرف مبيعات',status:'نشط',lastLogin:'2024-03-24'},
  {id:'pu-3',name:'محمد العتيبي',email:'mohd@akwadra.com',role:'دعم فني',status:'نشط',lastLogin:'2024-03-25'},
  {id:'pu-4',name:'نورة الشهري',email:'noura@akwadra.com',role:'محاسب',status:'نشط',lastLogin:'2024-03-23'},
  {id:'pu-5',name:'فهد الدوسري',email:'fahad@akwadra.com',role:'دعم فني',status:'موقوف',lastLogin:'2024-02-11'},
  {id:'pu-6',name:'لينا حجازي',email:'lina@akwadra.com',role:'مشرف مبيعات',status:'نشط',lastLogin:'2024-03-22'}
 ],
 products:[
  {id:'pr-1',sku:'SKU-1001',name:'لابتوب أعمال ProBook 15',category:'إلكترونيات',price:3450,cost:2780,stock:42,min:10,unit:'قطعة'},
  {id:'pr-2',sku:'SKU-1002',name:'طابعة ليزر مكتبية M404',category:'إلكترونيات',price:1290,cost:940,stock:7,min:8,unit:'قطعة'},
  {id:'pr-3',sku:'SKU-1003',name:'ورق تصوير A4 (5 رزم)',category:'مكتبية',price:95,cost:62,stock:320,min:50,unit:'كرتون'},
  {id:'pr-4',sku:'SKU-1004',name:'كرسي مكتب طبي قابل للتعديل',category:'أثاث مكتبي',price:780,cost:520,stock:18,min:6,unit:'قطعة'},
  {id:'pr-5',sku:'SKU-1005',name:'شاشة عرض 27 بوصة 4K',category:'إلكترونيات',price:1650,cost:1240,stock:0,min:5,unit:'قطعة'},
  {id:'pr-6',sku:'SKU-1006',name:'حبر طابعة أصلي 59A',category:'مكتبية',price:340,cost:255,stock:64,min:20,unit:'قطعة'},
  {id:'pr-7',sku:'SKU-1007',name:'خزانة ملفات معدنية 4 أدراج',category:'أثاث مكتبي',price:1120,cost:810,stock:11,min:4,unit:'قطعة'},
  {id:'pr-8',sku:'SKU-1008',name:'جهاز نقاط بيع POS متكامل',category:'إلكترونيات',price:2890,cost:2150,stock:23,min:8,unit:'قطعة'},
  {id:'pr-9',sku:'SKU-1009',name:'قارئ باركود لاسلكي',category:'إلكترونيات',price:420,cost:290,stock:5,min:10,unit:'قطعة'},
  {id:'pr-10',sku:'SKU-1010',name:'درج نقدية معدني ثقيل',category:'تجهيزات متاجر',price:380,cost:260,stock:31,min:10,unit:'قطعة'},
  {id:'pr-11',sku:'SKU-1011',name:'ميزان إلكتروني تجاري 30 كجم',category:'تجهيزات متاجر',price:560,cost:395,stock:14,min:5,unit:'قطعة'},
  {id:'pr-12',sku:'SKU-1012',name:'طابعة فواتير حرارية 80mm',category:'تجهيزات متاجر',price:495,cost:340,stock:27,min:12,unit:'قطعة'}
 ],
 customers:[
  {id:'cu-1',name:'مكتبة جرير التجارية',email:'orders@jarir-b2b.sa',phone:'0501112222',city:'الرياض',type:'شركة',balance:12400,orders:38},
  {id:'cu-2',name:'مجموعة الراجحي للمكاتب',email:'supply@rajhi-office.sa',phone:'0553334444',city:'جدة',type:'شركة',balance:0,orders:21},
  {id:'cu-3',name:'عبدالله الحربي',email:'a.harbi@gmail.com',phone:'0565556666',city:'الدمام',type:'فرد',balance:850,orders:6},
  {id:'cu-4',name:'فنادق ضيافة الخليج',email:'pm@gulf-hosp.com',phone:'0547778888',city:'الخبر',type:'شركة',balance:23800,orders:44},
  {id:'cu-5',name:'مدارس الرواد الأهلية',email:'procurement@rowad.edu.sa',phone:'0579990000',city:'الرياض',type:'شركة',balance:5600,orders:17},
  {id:'cu-6',name:'سارة القحطاني',email:'sara.q@hotmail.com',phone:'0581234567',city:'أبها',type:'فرد',balance:0,orders:3},
  {id:'cu-7',name:'مستشفى السلام التخصصي',email:'it@alsalam-hosp.com',phone:'0509876543',city:'مكة',type:'شركة',balance:18250,orders:29},
  {id:'cu-8',name:'شركة الخليج للتموين',email:'buy@gulf-catering.com',phone:'0556789012',city:'الرياض',type:'شركة',balance:7300,orders:25},
  {id:'cu-9',name:'محمد الزهراني',email:'m.zahrani@gmail.com',phone:'0563210987',city:'الطائف',type:'فرد',balance:420,orders:4},
  {id:'cu-10',name:'معارض النخيل للأثاث',email:'sales@nakheel-furn.sa',phone:'0541098765',city:'القصيم',type:'شركة',balance:9900,orders:15}
 ],
 salesInvoices:[
  {id:'si-1',number:'S-INV-3041',customer:'مكتبة جرير التجارية',date:'2024-03-24',due:'2024-04-07',amount:18760,paid:18760,status:'مدفوعة'},
  {id:'si-2',number:'S-INV-3042',customer:'فنادق ضيافة الخليج',date:'2024-03-23',due:'2024-04-06',amount:42300,paid:20000,status:'جزئي'},
  {id:'si-3',number:'S-INV-3043',customer:'مدارس الرواد الأهلية',date:'2024-03-22',due:'2024-04-05',amount:9450,paid:0,status:'معلقة'},
  {id:'si-4',number:'S-INV-3044',customer:'عبدالله الحربي',date:'2024-03-21',due:'2024-03-28',amount:3450,paid:3450,status:'مدفوعة'},
  {id:'si-5',number:'S-INV-3045',customer:'مستشفى السلام التخصصي',date:'2024-03-18',due:'2024-04-01',amount:27600,paid:0,status:'معلقة'},
  {id:'si-6',number:'S-INV-3046',customer:'شركة الخليج للتموين',date:'2024-03-15',due:'2024-03-29',amount:11280,paid:11280,status:'مدفوعة'},
  {id:'si-7',number:'S-INV-3047',customer:'معارض النخيل للأثاث',date:'2024-03-10',due:'2024-03-24',amount:15640,paid:0,status:'متأخرة'},
  {id:'si-8',number:'S-INV-3048',customer:'مجموعة الراجحي للمكاتب',date:'2024-03-08',due:'2024-03-22',amount:8920,paid:8920,status:'مدفوعة'},
  {id:'si-9',number:'S-INV-3049',customer:'سارة القحطاني',date:'2024-03-05',due:'2024-03-12',amount:1290,paid:1290,status:'مدفوعة'},
  {id:'si-10',number:'S-INV-3050',customer:'فنادق ضيافة الخليج',date:'2024-02-28',due:'2024-03-13',amount:31200,paid:31200,status:'مدفوعة'},
  {id:'si-11',number:'S-INV-3051',customer:'محمد الزهراني',date:'2024-02-25',due:'2024-03-03',amount:2890,paid:0,status:'متأخرة'},
  {id:'si-12',number:'S-INV-3052',customer:'مكتبة جرير التجارية',date:'2024-02-20',due:'2024-03-05',amount:22140,paid:22140,status:'مدفوعة'}
 ],
 purchases:[
  {id:'po-1',number:'PO-2024-118',supplier:'شركة التقنية الذكية للتوريدات',date:'2024-03-22',amount:68400,status:'قيد التنفيذ'},
  {id:'po-2',number:'PO-2024-117',supplier:'مصنع الجودة للأثاث المكتبي',date:'2024-03-19',amount:24300,status:'مكتمل'},
  {id:'po-3',number:'PO-2024-116',supplier:'الموردون المتحدون للورقيات',date:'2024-03-15',amount:8650,status:'مكتمل'},
  {id:'po-4',number:'PO-2024-115',supplier:'مؤسسة الإلكترون للتجهيزات',date:'2024-03-12',amount:41200,status:'قيد التنفيذ'},
  {id:'po-5',number:'PO-2024-114',supplier:'شركة التقنية الذكية للتوريدات',date:'2024-03-08',amount:15800,status:'مكتمل'},
  {id:'po-6',number:'PO-2024-113',supplier:'الخليج لأنظمة نقاط البيع',date:'2024-03-04',amount:53700,status:'مكتمل'},
  {id:'po-7',number:'PO-2024-112',supplier:'مصنع الجودة للأثاث المكتبي',date:'2024-02-27',amount:18900,status:'ملغي'},
  {id:'po-8',number:'PO-2024-111',supplier:'الموردون المتحدون للورقيات',date:'2024-02-22',amount:6200,status:'مكتمل'},
  {id:'po-9',number:'PO-2024-110',supplier:'مؤسسة الإلكترون للتجهيزات',date:'2024-02-18',amount:37500,status:'مكتمل'},
  {id:'po-10',number:'PO-2024-109',supplier:'الخليج لأنظمة نقاط البيع',date:'2024-02-12',amount:29800,status:'مكتمل'}
 ],
 suppliers:[
  {id:'su-1',name:'شركة التقنية الذكية للتوريدات',contact:'خالد العمري',phone:'0112345678',category:'إلكترونيات',balance:34200},
  {id:'su-2',name:'مصنع الجودة للأثاث المكتبي',contact:'بدر السبيعي',phone:'0126789012',category:'أثاث مكتبي',balance:12300},
  {id:'su-3',name:'الموردون المتحدون للورقيات',contact:'عمر حافظ',phone:'0138901234',category:'مكتبية',balance:2650},
  {id:'su-4',name:'مؤسسة الإلكترون للتجهيزات',contact:'سلطان الغامدي',phone:'0145678901',category:'إلكترونيات',balance:41200},
  {id:'su-5',name:'الخليج لأنظمة نقاط البيع',contact:'ياسر الشمري',phone:'0117654321',category:'تجهيزات متاجر',balance:0},
  {id:'su-6',name:'النسيج الأول للتغليف',contact:'حسن مراد',phone:'0123456789',category:'تغليف',balance:5400},
  {id:'su-7',name:'مستودعات الشرق للقرطاسية',contact:'فيصل النعيمي',phone:'0134567890',category:'مكتبية',balance:1850},
  {id:'su-8',name:'التميز لقطع الغيار التقنية',contact:'ماجد الحارثي',phone:'0149012345',category:'قطع غيار',balance:8700}
 ],
 employees:[
  {id:'em-1',name:'أحمد الشريف',dept:'المالية',title:'مدير مالي',salary:18500,hireDate:'2021-04-10',status:'نشط',email:'ahmed@elite-trade.sa'},
  {id:'em-2',name:'منى عبدالعزيز',dept:'المبيعات',title:'مديرة مبيعات',salary:15200,hireDate:'2021-09-15',status:'نشط',email:'mona@elite-trade.sa'},
  {id:'em-3',name:'طارق السيد',dept:'المستودعات',title:'مشرف مستودع',salary:8400,hireDate:'2022-01-20',status:'نشط',email:'tarek@elite-trade.sa'},
  {id:'em-4',name:'هند الفيصل',dept:'الموارد البشرية',title:'أخصائية توظيف',salary:9800,hireDate:'2022-06-01',status:'إجازة',email:'hind@elite-trade.sa'},
  {id:'em-5',name:'سامي الحمدان',dept:'التقنية',title:'مهندس أنظمة',salary:14600,hireDate:'2021-11-08',status:'نشط',email:'sami@elite-trade.sa'},
  {id:'em-6',name:'ريم الجهني',dept:'المبيعات',title:'مندوبة مبيعات أولى',salary:7900,hireDate:'2023-02-12',status:'نشط',email:'reem@elite-trade.sa'},
  {id:'em-7',name:'وليد قطب',dept:'المالية',title:'محاسب رئيسي',salary:11200,hireDate:'2022-08-25',status:'نشط',email:'walid@elite-trade.sa'},
  {id:'em-8',name:'دلال العنزي',dept:'خدمة العملاء',title:'قائدة فريق الدعم',salary:8800,hireDate:'2023-05-03',status:'نشط',email:'dalal@elite-trade.sa'},
  {id:'em-9',name:'ناصر القرني',dept:'المستودعات',title:'أمين مخزون',salary:6500,hireDate:'2023-08-14',status:'نشط',email:'nasser@elite-trade.sa'},
  {id:'em-10',name:'أمل بخاري',dept:'التقنية',title:'مطورة تقارير BI',salary:13400,hireDate:'2022-03-30',status:'إجازة',email:'amal@elite-trade.sa'}
 ],
 journal:[
  {id:'jn-1',number:'JE-901',date:'2024-03-24',account:'المبيعات',desc:'إثبات فاتورة مبيعات S-INV-3041',debit:0,credit:18760,status:'مرحّل'},
  {id:'jn-2',number:'JE-902',date:'2024-03-24',account:'العملاء',desc:'استحقاق على فنادق ضيافة الخليج',debit:42300,credit:0,status:'مرحّل'},
  {id:'jn-3',number:'JE-903',date:'2024-03-23',account:'البنك',desc:'تحصيل دفعة جزئية من ضيافة الخليج',debit:20000,credit:0,status:'مرحّل'},
  {id:'jn-4',number:'JE-904',date:'2024-03-22',account:'المشتريات',desc:'أمر شراء تجهيزات PO-2024-118',debit:68400,credit:0,status:'مسودة'},
  {id:'jn-5',number:'JE-905',date:'2024-03-21',account:'الصندوق',desc:'مبيعات نقدية نقطة بيع الفرع الرئيسي',debit:3450,credit:0,status:'مرحّل'},
  {id:'jn-6',number:'JE-906',date:'2024-03-20',account:'الرواتب',desc:'استحقاق رواتب شهر مارس',debit:114300,credit:0,status:'مسودة'},
  {id:'jn-7',number:'JE-907',date:'2024-03-18',account:'المصروفات',desc:'إيجار المستودع الرئيسي',debit:12500,credit:0,status:'مرحّل'},
  {id:'jn-8',number:'JE-908',date:'2024-03-15',account:'البنك',desc:'سداد فاتورة S-INV-3046',debit:11280,credit:0,status:'مرحّل'},
  {id:'jn-9',number:'JE-909',date:'2024-03-12',account:'الموردون',desc:'سداد دفعة لمؤسسة الإلكترون',debit:0,credit:25000,status:'مرحّل'},
  {id:'jn-10',number:'JE-910',date:'2024-03-10',account:'الأصول الثابتة',desc:'شراء رفوف مستودع جديدة',debit:8900,credit:0,status:'مرحّل'},
  {id:'jn-11',number:'JE-911',date:'2024-03-06',account:'المصروفات',desc:'اشتراك أكوادرا ERP السنوي',debit:9588,credit:0,status:'مرحّل'},
  {id:'jn-12',number:'JE-912',date:'2024-03-02',account:'المبيعات',desc:'إثبات إيراد عقد توريد مدارس الرواد',debit:0,credit:9450,status:'مرحّل'}
 ]
}}

/* ===== المخزن المحلي ===== */
const DB_KEY='akwadra_erp_v1';
let _DB=null;
function db(){if(!_DB){try{_DB=JSON.parse(localStorage.getItem(DB_KEY))}catch(e){_DB=null}if(!_DB||!_DB.companies){_DB=seed();persist();}}return _DB;}
function persist(){localStorage.setItem(DB_KEY,JSON.stringify(_DB));}
function col(n){return db()[n]||[];}
function addRow(n,row){row.id=row.id||uid(n.slice(0,2));db()[n].unshift(row);persist();return row;}
function updRow(n,id,patch){const r=col(n).find(x=>x.id===id);if(r)Object.assign(r,patch);persist();return r;}
function delRow(n,id){db()[n]=col(n).filter(x=>x.id!==id);persist();}
function findRow(n,id){return col(n).find(x=>x.id===id);}
function planName(id){const p=findRow('plans',id);return p?p.name:'—';}
function companyName(id){const c=findRow('companies',id);return c?c.name:'—';}

/* ===== الجلسة ===== */
const SES_KEY='akwadra_session';
function session(){try{return JSON.parse(localStorage.getItem(SES_KEY))}catch(e){return null}}
function setSession(s){localStorage.setItem(SES_KEY,JSON.stringify(s));}
function clearSession(){localStorage.removeItem(SES_KEY);}

/* ===== شارات الحالة ===== */
const BADGE={'نشط':'ok','مدفوعة':'ok','مكتمل':'ok','متاح':'ok','مغلقة':'ok','مرحّل':'ok','تجريبي':'info','قيد التنفيذ':'info','مسودة':'info','فرد':'info','شركة':'ok','معلقة':'warn','منخفض':'warn','منخفضة':'info','مفتوحة':'warn','إجازة':'warn','جزئي':'warn','متوسطة':'info','مرتفعة':'warn','متأخرة':'bad','موقوف':'bad','ملغي':'bad','منتهي':'bad','نافد':'bad','عاجلة':'bad','تجربة مجانية':'info'};
const badge=s=>`<span class="badge b-${BADGE[s]||'info'}">${esc(s)}</span>`;
function stockBadge(p){if(Number(p.stock)<=0)return badge('نافد');if(Number(p.stock)<=Number(p.min))return badge('منخفض');return badge('متاح');}
