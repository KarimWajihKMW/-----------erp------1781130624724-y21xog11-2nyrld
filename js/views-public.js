'use strict';
/* ============ أكوادرا ERP — الصفحات العامة + تسجيل الدخول ============ */

const LOGO=`<a class="logo" href="#/"><span class="logo-mark">أ</span>أكوادرا <b>ERP</b></a>`;
function publicShell(content,active){
  const ses=session();
  return `<header class="site-nav" id="site-nav"><div class="nav-inner">
    ${LOGO}
    <button class="burger" onclick="document.getElementById('site-nav').classList.toggle('open')" aria-label="القائمة"><i></i><i></i><i></i></button>
    <nav class="nav-links">
      <a href="#/" class="${active==='home'?'on':''}">الرئيسية</a>
      <a href="#/features" class="${active==='features'?'on':''}">الوحدات والمزايا</a>
      <a href="#/pricing" class="${active==='pricing'?'on':''}">الباقات والأسعار</a>
      <a href="#/contact" class="${active==='contact'?'on':''}">تواصل معنا</a>
    </nav>
    <div class="nav-cta">
      ${ses?`<a class="btn ghost sm" href="${ses.role==='admin'?'#/admin':'#/erp'}">${ico('dash')} لوحة التحكم</a>`
      :`<a class="btn ghost sm" href="#/login">تسجيل الدخول</a><a class="btn primary sm" href="#/signup">ابدأ تجربتك المجانية</a>`}
    </div>
  </div></header>${content}${siteFooter()}`;
}
function siteFooter(){
  return `<footer class="footer"><div class="foot-grid">
    <div class="foot-col">${LOGO}<p>منظومة تخطيط موارد المؤسسات السحابية الأولى عربيًا: محاسبة، مبيعات، مخزون، مشتريات، موارد بشرية وعلاقات عملاء في منصة واحدة آمنة تنمو مع شركتك.</p></div>
    <div class="foot-col"><h4>المنتج</h4>
      <a href="#/features">وحدات النظام</a><a href="#/pricing">الباقات والأسعار</a><a href="#/signup">إنشاء حساب شركة</a><a href="#/login">تسجيل الدخول</a></div>
    <div class="foot-col"><h4>لوحات التحكم</h4>
      <a href="#/admin">لوحة مالك المنصة</a><a href="#/admin/companies">حسابات الشركات</a><a href="#/erp">لوحة الشركة ERP</a><a href="#/erp/reports">تقارير الأعمال</a></div>
    <div class="foot-col"><h4>الدعم</h4>
      <a href="#/contact">مركز المساعدة</a><a href="#/contact">طلب عرض توضيحي</a><a href="#/contact">اتفاقية مستوى الخدمة</a><a href="#/contact">سياسة الخصوصية</a></div>
  </div><div class="foot-bottom">© 2024 أكوادرا ERP — جميع الحقوق محفوظة • صُمم ليُدير أعمالًا حقيقية بثقة</div></footer>`;
}

/* ===== الصفحة الرئيسية ===== */
function landingView(){
  const plans=col('plans');
  const mods=[
    {i:'wallet',t:'المحاسبة والمالية',d:'دليل حسابات ذكي، قيود تلقائية، مراكز تكلفة، وقوائم مالية لحظية متوافقة مع هيئة الزكاة والضريبة.',c:'rgba(53,227,178,.14)',ic:'#35e3b2'},
    {i:'cart',t:'المبيعات والفوترة',d:'فواتير إلكترونية معتمدة، عروض أسعار، نقاط بيع، وتحصيلات مرتبطة مباشرة بحساباتك.',c:'rgba(243,196,107,.14)',ic:'#f3c46b'},
    {i:'box',t:'المخزون والمستودعات',d:'تتبع لحظي للأرصدة، حدود إعادة الطلب، جرد دوري، وباركود لكل صنف عبر مستودعات متعددة.',c:'rgba(93,139,255,.14)',ic:'#5d8bff'},
    {i:'truck',t:'المشتريات والموردون',d:'دورة شراء كاملة: طلب → أمر شراء → استلام → فاتورة مورد، مع مقارنة أسعار الموردين.',c:'rgba(157,123,255,.14)',ic:'#9d7bff'},
    {i:'hr',t:'الموارد البشرية والرواتب',d:'ملفات موظفين، حضور وإجازات، مسير رواتب آلي، وحساب نهاية الخدمة وفق نظام العمل.',c:'rgba(255,107,129,.14)',ic:'#ff6b81'},
    {i:'crm',t:'علاقات العملاء CRM',d:'خط مبيعات مرئي، متابعة الفرص والعملاء المحتملين، وتذكيرات تلقائية لفريقك التجاري.',c:'rgba(255,180,84,.14)',ic:'#ffb454'},
    {i:'chart',t:'التقارير وذكاء الأعمال',d:'أكثر من 60 تقريرًا جاهزًا ولوحات مؤشرات قابلة للتخصيص تُحدّث لحظيًا مع كل عملية.',c:'rgba(53,227,178,.14)',ic:'#35e3b2'},
    {i:'shield',t:'الصلاحيات والأمان',d:'أدوار دقيقة لكل مستخدم، سجل تدقيق كامل، نسخ احتياطي يومي، وتشفير على مستوى البنوك.',c:'rgba(93,139,255,.14)',ic:'#5d8bff'}
  ];
  return publicShell(`
  <section class="hero">
    <div class="grid-bg"></div>
    <div class="orb o1" data-depth="0.8"></div><div class="orb o2" data-depth="1.2"></div><div class="orb o3" data-depth="0.6"></div>
    <div class="hero-copy">
      <span class="eyebrow rv">منصة ERP سحابية متكاملة للشركات العربية</span>
      <h1 class="hero-title rv d1">شركتك بالكامل،<br/>في <span class="grad-text">منظومة واحدة</span> تتحرك معك</h1>
      <p class="hero-sub rv d2">أكوادرا ERP تجمع المحاسبة والمبيعات والمخزون والمشتريات والموارد البشرية وعلاقات العملاء في لوحة قيادة واحدة — وتمنح مالك المنصة لوحة تحكم لإنشاء حسابات الشركات وبيع الاشتراكات وإدارتها بالكامل.</p>
      <div class="hero-actions rv d3">
        <a class="btn primary" href="#/signup">${ico('plus')} أنشئ حساب شركتك الآن</a>
        <a class="btn ghost" href="#/admin">${ico('building')} لوحة مالك المنصة</a>
      </div>
      <div class="hero-points rv d4">
        <span><b>14 يومًا</b> تجربة مجانية</span><span><b>بدون</b> بطاقة ائتمانية</span><span><b>إعداد</b> في أقل من ساعة</span>
      </div>
    </div>
    <div class="hero-scene" id="hero-scene">
      <div class="ring-3d"></div>
      <div class="scene-layer dash-mock glass-card" data-mz="18">
        <div class="dm-head"><i></i><i></i><i></i><span>app.akwadra.com — لوحة قيادة الشركة</span></div>
        <div class="dm-kpis">
          <div class="dm-kpi"><b>72.8ك</b><i>مبيعات الشهر</i></div>
          <div class="dm-kpi g"><b>96.4%</b><i>نسبة التحصيل</i></div>
          <div class="dm-kpi b"><b>562</b><i>صنف بالمخزون</i></div>
        </div>
        <div class="mini-bars">
          <i style="--h:35%;--d:.1s"></i><i style="--h:55%;--d:.2s"></i><i style="--h:42%;--d:.3s"></i><i style="--h:68%;--d:.4s"></i><i style="--h:60%;--d:.5s"></i><i style="--h:82%;--d:.6s"></i><i style="--h:74%;--d:.7s"></i><i style="--h:95%;--d:.8s"></i>
        </div>
      </div>
      <div class="scene-layer kpi-chip glass-card chip-1" data-mz="40"><span class="ic">💰</span><div><b>+ 18,760 ر.س</b>فاتورة مبيعات محصّلة</div></div>
      <div class="scene-layer kpi-chip glass-card chip-2" data-mz="55"><span class="ic">🏢</span><div><b>شركة جديدة</b>اشتركت في باقة النمو</div></div>
      <div class="scene-layer kpi-chip glass-card chip-3" data-mz="30"><span class="ic">📦</span><div><b>تنبيه مخزون</b>قارئ باركود وصل حد الطلب</div></div>
    </div>
  </section>

  <div class="trust-strip rv"><div class="trust-inner">
    <p>أكثر من <b style="color:var(--em)">1,200 شركة</b> تدير عملياتها اليومية عبر أكوادرا:</p>
    <span class="logo-chip">النخبة للتجارة</span><span class="logo-chip">البنيان للمقاولات</span><span class="logo-chip">الأفق اللوجستية</span><span class="logo-chip">مصنع الصلب الوطني</span><span class="logo-chip">النور للطاقة</span>
  </div></div>

  <section class="section">
    <div class="sec-head rv"><span class="sec-tag">وحدات النظام</span>
      <h2>ثماني وحدات متكاملة تعمل كفريق واحد</h2>
      <p>كل وحدة مبنية على نفس قاعدة البيانات: الفاتورة تحرّك المخزون، وتُنشئ القيد المحاسبي، وتُحدّث ملف العميل — تلقائيًا وفي اللحظة نفسها.</p></div>
    <div class="modules-grid">
      ${mods.map((m,i)=>`<article class="module-card rv d${(i%4)+1}" data-tilt style="--mc:${m.c};--mi:${m.ic}">
        <div class="mod-ico">${ico(m.i)}</div><h3>${m.t}</h3><p>${m.d}</p></article>`).join('')}
    </div>
  </section>

  <section class="section">
    <div class="showcase">
      <div class="rv">
        <span class="sec-tag">لمالك المنصة</span>
        <h2 style="font-size:clamp(1.5rem,2.8vw,2.2rem);margin:14px 0">أنشئ حسابات الشركات، بِع الاشتراكات،<br/>وتابع إيراداتك من لوحة واحدة</h2>
        <ul class="bullets">
          <li><span class="bl-ic">١</span><div><b>إنشاء حساب شركة في دقيقة</b><p>اسم الشركة، النشاط، الباقة، وعدد المستخدمين — ويصبح الحساب جاهزًا فورًا.</p></div></li>
          <li><span class="bl-ic">٢</span><div><b>بيع وتجديد الاشتراكات</b><p>اشتراكات شهرية وسنوية بوسائل دفع متعددة، مع فواتير تلقائية وتنبيهات انتهاء.</p></div></li>
          <li><span class="bl-ic">٣</span><div><b>متابعة الإيراد الشهري المتكرر MRR</b><p>تقارير نمو الشركات، توزيع الباقات، والفواتير المتأخرة في لوحة قيادة لحظية.</p></div></li>
        </ul>
        <div class="hero-actions"><a class="btn gold" href="#/admin/companies">${ico('building')} جرّب إدارة حسابات الشركات</a></div>
      </div>
      <div class="panel-3d rv d2"><div class="show-panel glass-card">
        <div class="dm-head"><i></i><i></i><i></i><span>admin.akwadra.com — حسابات الشركات</span></div>
        <div class="show-rows">
          <div class="show-row"><span class="dotc" style="background:#35e3b2"></span>شركة النخبة للتجارة — باقة النمو<em>نشط • 34 مستخدمًا</em></div>
          <div class="show-row"><span class="dotc" style="background:#f3c46b"></span>مطاعم ذواقة — باقة الانطلاق<em>تجريبي • ينتهي بعد 9 أيام</em></div>
          <div class="show-row"><span class="dotc" style="background:#5d8bff"></span>الأفق للشحن — باقة المؤسسات<em>نشط • 210 مستخدمين</em></div>
          <div class="show-row"><span class="dotc" style="background:#ff6b81"></span>عطور الفخامة — اشتراك منتهي<em>بانتظار التجديد</em></div>
          <div class="show-row"><span class="dotc" style="background:#35e3b2"></span>إيراد مارس المتكرر<em><b style="color:var(--em)">262,400 ر.س</b></em></div>
        </div>
      </div></div>
    </div>
  </section>

  <section class="section">
    <div class="sec-head rv"><span class="sec-tag">كيف تبدأ؟</span><h2>من التسجيل إلى أول فاتورة في أربع خطوات</h2></div>
    <div class="steps">
      <div class="step rv"><span class="num">١</span><h3>أنشئ حساب شركتك</h3><p>سجّل بيانات شركتك واختر الباقة المناسبة لحجم فريقك ونشاطك.</p></div>
      <div class="step rv d1"><span class="num">٢</span><h3>فعّل وحداتك</h3><p>اختر الوحدات التي تحتاجها اليوم وأضف البقية لاحقًا دون أي انقطاع.</p></div>
      <div class="step rv d2"><span class="num">٣</span><h3>ادعُ فريقك</h3><p>أضف المستخدمين وحدّد صلاحيات دقيقة لكل دور: محاسب، بائع، أمين مخزون.</p></div>
      <div class="step rv d3"><span class="num">٤</span><h3>تابع أعمالك لحظيًا</h3><p>أصدر فواتيرك وراقب مؤشراتك من أي جهاز، في المكتب أو خارجه.</p></div>
    </div>
  </section>

  <div class="stats-band rv"><div class="stats-inner">
    <div class="stat"><b data-count="1200">0</b><span>شركة نشطة على المنصة</span></div>
    <div class="stat"><b data-count="4800000">0</b><span>فاتورة أُصدرت عبر النظام</span></div>
    <div class="stat"><b>99.9%</b><span>نسبة توافر الخدمة SLA</span></div>
    <div class="stat"><b>24/7</b><span>دعم فني بالعربية</span></div>
  </div></div>

  <section class="section">
    <div class="sec-head rv"><span class="sec-tag">قالوا عن أكوادرا</span><h2>مدراء ماليون وتنفيذيون يثقون بنا يوميًا</h2></div>
    <div class="testi-grid">
      <article class="testi-card rv"><span class="stars">★★★★★</span>
        <p>"أقفلنا حسابات السنة المالية في ثلاثة أيام بدلًا من ثلاثة أسابيع. القيود التلقائية وربط الفواتير بالمخزون غيّر طريقة عملنا تمامًا."</p>
        <div class="testi-who"><span class="avatar">أ ش</span><div><b>أحمد الشريف</b><span>المدير المالي — شركة النخبة للتجارة</span></div></div></article>
      <article class="testi-card rv d1"><span class="stars">★★★★★</span>
        <p>"ندير 210 مستخدمين عبر 6 فروع لوجستية من لوحة واحدة. تقارير التكلفة لكل شحنة أصبحت تخرج بضغطة زر."</p>
        <div class="testi-who"><span class="avatar">ل ع</span><div><b>ليلى العوضي</b><span>مديرة العمليات — الأفق للشحن واللوجستيات</span></div></div></article>
      <article class="testi-card rv d2"><span class="stars">★★★★★</span>
        <p>"كموزّع معتمد، لوحة مالك المنصة تتيح لي إنشاء حساب لعميلي وتفعيل اشتراكه واستلام عمولتي في نفس الاجتماع."</p>
        <div class="testi-who"><span class="avatar">س م</span><div><b>سارة المطيري</b><span>شريك مبيعات معتمد — أكوادرا</span></div></div></article>
    </div>
  </section>

  <section class="section" id="pricing-sec">
    <div class="sec-head rv"><span class="sec-tag">الباقات والأسعار</span><h2>باقات تنمو مع شركتك — بلا رسوم خفية</h2>
    <p>جميع الباقات تشمل التحديثات المستمرة، النسخ الاحتياطي اليومي، والدعم الفني بالعربية.</p></div>
    <div class="price-grid">
      ${plans.map((p,i)=>`<article class="price-card rv d${i+1} ${p.id==='p2'?'popular':''}">
        ${p.id==='p2'?'<span class="pop-tag">الأكثر اختيارًا</span>':''}
        <h3>${esc(p.name)}</h3><p class="pdesc">${esc(p.desc)}</p>
        <div><span class="price">${num(p.price)}</span> <span class="per">ر.س / ${esc(p.period)}</span></div>
        <ul class="plan-feat">
          <li>${esc(p.users)} بصلاحيات مخصصة</li>
          <li>مساحة تخزين ${esc(p.storage)}</li>
          <li>${esc(p.modules)}</li>
          <li>فوترة إلكترونية متوافقة مع الهيئة</li>
          ${p.id!=='p1'?'<li>تقارير ذكاء أعمال متقدمة</li>':'<li>تقارير أساسية جاهزة</li>'}
          ${p.id==='p3'?'<li>مدير حساب مخصص ودعم أولوية</li>':''}
        </ul>
        <a class="btn ${p.id==='p2'?'primary':'ghost'}" href="#/signup">ابدأ بهذه الباقة</a>
      </article>`).join('')}
    </div>
  </section>

  <section class="section">
    <div class="sec-head rv"><span class="sec-tag">أسئلة شائعة</span><h2>كل ما تريد معرفته قبل أن تبدأ</h2></div>
    <div class="faq rv">
      <details class="faq-item"><summary>هل يمكنني نقل بياناتي من نظامي المحاسبي الحالي؟</summary><div class="faq-body">نعم، يوفر أكوادرا أدوات استيراد جاهزة لدليل الحسابات والأصناف والعملاء والموردين من ملفات Excel، وفريق الإعداد يرافقك خطوة بخطوة خلال فترة الانتقال.</div></details>
      <details class="faq-item"><summary>هل الفواتير الصادرة متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك؟</summary><div class="faq-body">جميع الفواتير تصدر برمز QR ومتوافقة مع المرحلة الثانية من الفوترة الإلكترونية (الربط والتكامل)، مع أرشفة آمنة لكل فاتورة.</div></details>
      <details class="faq-item"><summary>كيف أبيع حسابات أكوادرا لعملائي كموزّع أو شريك؟</summary><div class="faq-body">من لوحة مالك المنصة يمكنك إنشاء حساب شركة جديد، اختيار الباقة، تفعيل الاشتراك وإصدار الفاتورة — وتتابع كل اشتراكاتك وإيراداتك المتكررة من شاشة واحدة.</div></details>
      <details class="faq-item"><summary>ماذا يحدث لبياناتي إذا ألغيت الاشتراك؟</summary><div class="faq-body">تبقى بياناتك متاحة للتصدير الكامل لمدة 90 يومًا بعد الإلغاء، ثم تُحذف نهائيًا وفق سياسة الخصوصية. بياناتك ملكك دائمًا.</div></details>
      <details class="faq-item"><summary>هل يدعم النظام تعدد الفروع والمستودعات والعملات؟</summary><div class="faq-body">باقة المؤسسات تدعم فروعًا ومستودعات غير محدودة مع توحيد مركزي للتقارير، وتسعير وفوترة بعملات متعددة بأسعار صرف يومية.</div></details>
    </div>
  </section>

  <div class="cta-band rv"><div class="cta-inner">
    <h2>جاهز تنقل شركتك إلى إدارة بلا فوضى؟</h2>
    <p>ابدأ تجربتك المجانية 14 يومًا الآن — وفعّل وحدة المحاسبة والمبيعات والمخزون في أقل من ساعة.</p>
    <div class="hero-actions" style="justify-content:center"><a class="btn primary" href="#/signup">أنشئ حساب شركتك مجانًا</a><a class="btn ghost" href="#/contact">اطلب عرضًا توضيحيًا</a></div>
  </div></div>
  `,'home');
}

/* ===== صفحة الوحدات والمزايا ===== */
function featuresView(){
  const blocks=[
    {tag:'المحاسبة والمالية',h:'إقفال شهري بلا سهر، وقوائم مالية لحظية',rows:[['دليل الحسابات','شجرة حسابات مرنة حتى 6 مستويات مع مراكز تكلفة','#35e3b2'],['القيود التلقائية','كل فاتورة وسند يولّد قيده المزدوج فورًا','#5d8bff'],['القوائم المالية','ميزانية، قائمة دخل، وتدفقات نقدية بضغطة زر','#f3c46b'],['ضريبة القيمة المضافة','إقرار ضريبي جاهز للتقديم مع تدقيق آلي','#9d7bff']],
     bullets:[['قيود مزدوجة آلية','تُنشأ القيود من المبيعات والمشتريات والرواتب تلقائيًا مع إمكانية القيود اليدوية.'],['مراكز تكلفة وأرباح','حلّل ربحية كل فرع أو مشروع أو خط إنتاج على حدة.'],['تسويات بنكية ذكية','طابق كشف حسابك البنكي مع قيودك في دقائق.']]},
    {tag:'المبيعات والمخزون',h:'من عرض السعر إلى التحصيل — والمخزون يتحدّث لحظيًا',rows:[['فاتورة S-INV-3041','مكتبة جرير — 18,760 ر.س','#35e3b2'],['حركة مخزون','صرف 12 لابتوب ProBook من المستودع الرئيسي','#5d8bff'],['تنبيه إعادة طلب','قارئ الباركود اللاسلكي وصل حد الطلب (5)','#ffb454'],['تحصيل','دفعة 20,000 ر.س من فنادق ضيافة الخليج','#f3c46b']],
     bullets:[['فوترة إلكترونية معتمدة','فواتير برمز QR متوافقة مع المرحلة الثانية للربط والتكامل.'],['مستودعات متعددة','تحويلات داخلية، جرد دوري، وتقييم بمتوسط التكلفة المرجح.'],['نقاط بيع POS','شاشة بيع سريعة تعمل حتى مع انقطاع الإنترنت وتزامن لاحقًا.']]},
    {tag:'الموارد البشرية وCRM',h:'فريقك وعملاؤك في نفس المنظومة',rows:[['مسير رواتب مارس','114,300 ر.س لـ 10 موظفين — جاهز للاعتماد','#35e3b2'],['طلب إجازة','هند الفيصل — إجازة سنوية 5 أيام','#ffb454'],['فرصة بيعية','مستشفى السلام — توريد أجهزة بقيمة 27,600 ر.س','#5d8bff'],['تذكير متابعة','الاتصال بمعارض النخيل بخصوص الفاتورة المتأخرة','#ff6b81']],
     bullets:[['مسير رواتب آلي','بدلات، استقطاعات، وحساب نهاية الخدمة وفق نظام العمل السعودي.'],['خط مبيعات مرئي','اسحب الفرص بين المراحل وتابع نسب الإغلاق لكل مندوب.'],['سجل تدقيق شامل','من فعل ماذا ومتى — على مستوى كل سجل في النظام.']]}
  ];
  return publicShell(`
  <section class="section" style="padding-top:70px">
    <div class="sec-head rv"><span class="sec-tag">منصة واحدة، عمق حقيقي</span>
      <h2>وحدات أكوادرا ERP بالتفصيل</h2>
      <p>صُممت كل وحدة مع مدراء ماليين ومشغّلين حقيقيين، لتغطي دورة العمل كاملة دون جداول خارجية أو أنظمة موازية.</p></div>
    ${blocks.map((b,i)=>`<div class="showcase ${i%2?'flip':''}" style="margin-bottom:90px">
      <div class="rv ${i%2?'':'d1'}" style="order:${i%2?2:1}">
        <span class="sec-tag">${b.tag}</span>
        <h2 style="font-size:clamp(1.4rem,2.6vw,2rem);margin:14px 0">${b.h}</h2>
        <ul class="bullets">${b.bullets.map(x=>`<li><span class="bl-ic">✓</span><div><b>${x[0]}</b><p>${x[1]}</p></div></li>`).join('')}</ul>
      </div>
      <div class="panel-3d rv d2" style="order:${i%2?1:2}"><div class="show-panel glass-card">
        <div class="dm-head"><i></i><i></i><i></i><span>أكوادرا ERP — ${b.tag}</span></div>
        <div class="show-rows">${b.rows.map(r=>`<div class="show-row"><span class="dotc" style="background:${r[2]}"></span>${r[0]}<em>${r[1]}</em></div>`).join('')}</div>
      </div></div>
    </div>`).join('')}
    <div class="cta-band rv"><div class="cta-inner">
      <h2>شاهد الوحدات تعمل ببياناتك أنت</h2><p>أنشئ حسابًا تجريبيًا واستكشف كل وحدة ببيانات جاهزة قابلة للتعديل.</p>
      <div class="hero-actions" style="justify-content:center"><a class="btn primary" href="#/signup">ابدأ التجربة المجانية</a><a class="btn ghost" href="#/pricing">قارن الباقات</a></div>
    </div></div>
  </section>`,'features');
}

/* ===== صفحة الأسعار ===== */
function pricingView(){
  const plans=col('plans');
  const cmp=[
    ['عدد المستخدمين','10','50','غير محدود'],
    ['المحاسبة والقوائم المالية','✓','✓','✓'],
    ['المبيعات والفوترة الإلكترونية','✓','✓','✓'],
    ['المخزون والمستودعات','مستودع واحد','3 مستودعات','غير محدود'],
    ['المشتريات والموردون','—','✓','✓'],
    ['الموارد البشرية والرواتب','—','✓','✓'],
    ['علاقات العملاء CRM','—','✓','✓'],
    ['ذكاء الأعمال والتقارير المتقدمة','—','أساسي','كامل + مخصص'],
    ['تعدد الفروع والعملات','—','—','✓'],
    ['واجهة برمجة التطبيقات API','—','—','✓'],
    ['مدير حساب مخصص','—','—','✓']
  ];
  return publicShell(`
  <section class="section" style="padding-top:70px">
    <div class="sec-head rv"><span class="sec-tag">استثمار واضح، عائد ملموس</span>
      <h2>اختر الباقة التي تناسب مرحلة شركتك اليوم</h2>
      <p>يمكنك الترقية أو التخفيض في أي وقت — وتُحتسب الفروقات تلقائيًا على فاتورتك التالية.</p></div>
    <div class="price-grid">
      ${plans.map((p,i)=>`<article class="price-card rv d${i+1} ${p.id==='p2'?'popular':''}">
        ${p.id==='p2'?'<span class="pop-tag">الأكثر اختيارًا</span>':''}
        <h3>${esc(p.name)}</h3><p class="pdesc">${esc(p.desc)}</p>
        <div><span class="price">${num(p.price)}</span> <span class="per">ر.س / ${esc(p.period)}</span></div>
        <ul class="plan-feat"><li>${esc(p.users)}</li><li>مساحة ${esc(p.storage)}</li><li>${esc(p.modules)}</li><li>دعم فني بالعربية على مدار الساعة</li></ul>
        <a class="btn ${p.id==='p2'?'primary':'ghost'}" href="#/signup">اشترك الآن</a>
      </article>`).join('')}
    </div>
    <div class="panel rv" style="margin-top:60px;overflow-x:auto">
      <div class="panel-head"><h3>مقارنة تفصيلية بين الباقات</h3><p>كل ما تحصل عليه في كل باقة، بشفافية كاملة</p></div>
      <table class="data-table" style="min-width:640px"><thead><tr><th>الميزة</th><th>الانطلاق</th><th>النمو</th><th>المؤسسات</th></tr></thead>
      <tbody>${cmp.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table>
    </div>
    <div class="cta-band rv" style="margin-top:60px"><div class="cta-inner">
      <h2>تحتاج عرضًا خاصًا لمجموعة شركات أو شراكة توزيع؟</h2><p>فريق المبيعات يجهّز لك تسعيرًا مخصصًا وعمولات شركاء خلال 24 ساعة.</p>
      <div class="hero-actions" style="justify-content:center"><a class="btn gold" href="#/contact">تواصل مع فريق المبيعات</a></div>
    </div></div>
  </section>`,'pricing');
}

/* ===== صفحة التواصل ===== */
function contactView(){
  return publicShell(`
  <section class="section" style="padding-top:70px">
    <div class="sec-head rv"><span class="sec-tag">نحن هنا لمساعدتك</span>
      <h2>تحدّث مع فريق أكوادرا</h2><p>استفسار عن الباقات، طلب عرض توضيحي مباشر، أو دعم فني — نرد خلال ساعات العمل في أقل من 30 دقيقة.</p></div>
    <div class="grid-2 even">
      <div class="panel rv">
        <div class="panel-head"><h3>أرسل رسالتك</h3><p>سيتواصل معك مختص بنشاطك التجاري</p></div>
        <form id="contact-form" class="form-grid">
          <div class="field"><label>الاسم الكامل</label><input required placeholder="مثال: أحمد الشريف"/></div>
          <div class="field"><label>اسم الشركة</label><input required placeholder="مثال: شركة النخبة للتجارة"/></div>
          <div class="field"><label>البريد الإلكتروني</label><input type="email" required placeholder="name@company.com"/></div>
          <div class="field"><label>رقم الجوال</label><input required placeholder="05xxxxxxxx"/></div>
          <div class="field full"><label>موضوع الطلب</label><select><option>طلب عرض توضيحي مباشر</option><option>استفسار عن الباقات والأسعار</option><option>طلب شراكة توزيع وبيع حسابات</option><option>دعم فني لحساب قائم</option><option>نقل بيانات من نظام آخر</option></select></div>
          <div class="field full"><label>رسالتك</label><textarea required placeholder="أخبرنا عن حجم شركتك والوحدات التي تهمك..."></textarea></div>
          <div class="modal-actions"><button class="btn primary" type="submit">إرسال الطلب الآن</button></div>
        </form>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px">
        <div class="panel rv d1"><div class="panel-head"><h3>قنوات مباشرة</h3></div>
          <ul class="bullets">
            <li><span class="bl-ic">${ico('bell')}</span><div><b>مبيعات المنصة</b><p>sales@akwadra.com — 920001234</p></div></li>
            <li><span class="bl-ic">${ico('ticket')}</span><div><b>الدعم الفني للمشتركين</b><p>support@akwadra.com — متاح 24/7 من داخل النظام</p></div></li>
            <li><span class="bl-ic">${ico('building')}</span><div><b>المقر الرئيسي</b><p>الرياض — حي الملقا، طريق الملك فهد، برج الأعمال 12</p></div></li>
          </ul></div>
        <div class="panel rv d2"><div class="panel-head"><h3>شركاء التوزيع</h3></div>
          <p style="color:var(--muted);font-size:.9rem">هل تبيع حلولًا تقنية للشركات؟ انضم لبرنامج شركاء أكوادرا واحصل على لوحة مالك منصة خاصة بك لإنشاء حسابات عملائك وبيع الاشتراكات بعمولة تصل إلى 25٪ متكررة.</p>
          <a class="btn gold sm" style="margin-top:14px" href="#/signup">قدّم طلب شراكة</a></div>
      </div>
    </div>
  </section>`,'contact');
}

/* ===== تسجيل الدخول وإنشاء حساب ===== */
function authSide(){
  return `<div class="auth-side">
    <div class="orb o1"></div><div class="orb o2"></div>
    ${LOGO}
    <h2>منظومة واحدة تُدير شركتك… ومنصة كاملة تبيع بها</h2>
    <p>سجّل دخولك إلى لوحة شركتك لإدارة المحاسبة والمبيعات والمخزون، أو إلى لوحة مالك المنصة لإنشاء حسابات الشركات وبيع الاشتراكات.</p>
    <ul class="auth-points">
      <li>فوترة إلكترونية متوافقة مع هيئة الزكاة والضريبة</li>
      <li>تقارير لحظية تُحدّث مع كل عملية</li>
      <li>صلاحيات دقيقة وسجل تدقيق كامل</li>
      <li>نسخ احتياطي يومي وتشفير بمستوى البنوك</li>
    </ul>
  </div>`;
}
function loginView(){
  return `<div class="auth-wrap">${authSide()}
  <div class="auth-form-zone"><div class="auth-card glass-card">
    <h1>تسجيل الدخول</h1><p>أهلًا بعودتك! أدخل بياناتك للوصول إلى لوحة التحكم.</p>
    <form id="login-form">
      <div class="field"><label>البريد الإلكتروني</label><input id="login-email" type="email" required placeholder="name@company.com"/></div>
      <div class="field"><label>كلمة المرور</label><input id="login-pass" type="password" required placeholder="••••••••"/></div>
      <button class="btn primary" type="submit">دخول إلى النظام</button>
    </form>
    <div class="quick-login">
      <p>دخول سريع للاستكشاف:</p>
      <button class="btn gold sm" onclick="doLogin('admin')">${ico('building')} لوحة مالك المنصة (بيع الحسابات)</button>
      <button class="btn ghost sm" onclick="doLogin('company')">${ico('dash')} لوحة شركة — النخبة للتجارة</button>
      <p>ليس لديك حساب؟ <a href="#/signup" style="color:var(--em)">أنشئ حساب شركتك مجانًا</a> • <a href="#/" style="color:var(--muted)">العودة للرئيسية</a></p>
    </div>
  </div></div></div>`;
}
function signupView(){
  const plans=col('plans');
  return `<div class="auth-wrap">${authSide()}
  <div class="auth-form-zone"><div class="auth-card glass-card">
    <h1>أنشئ حساب شركتك</h1><p>14 يومًا مجانًا بكل المزايا — دون بطاقة ائتمانية.</p>
    <form id="signup-form">
      <div class="field"><label>اسم الشركة</label><input id="su-name" required placeholder="مثال: شركة النخبة للتجارة"/></div>
      <div class="field"><label>النشاط التجاري</label><select id="su-industry"><option>تجارة التجزئة</option><option>مقاولات وإنشاءات</option><option>صحة ودواء</option><option>مطاعم وأغذية</option><option>لوجستيات</option><option>تقنية وبرمجيات</option><option>عقارات</option><option>صناعة</option><option>تعليم وتدريب</option><option>طاقة</option></select></div>
      <div class="field"><label>البريد الإلكتروني للعمل</label><input id="su-email" type="email" required placeholder="name@company.com"/></div>
      <div class="field"><label>رقم الجوال</label><input id="su-phone" required placeholder="05xxxxxxxx"/></div>
      <div class="field"><label>الباقة</label><select id="su-plan">${plans.map(p=>`<option value="${p.id}" ${p.id==='p2'?'selected':''}>${esc(p.name)} — ${num(p.price)} ر.س/${esc(p.period)}</option>`).join('')}</select></div>
      <button class="btn primary" type="submit">إنشاء الحساب وبدء التجربة</button>
    </form>
    <div class="quick-login"><p>لديك حساب بالفعل؟ <a href="#/login" style="color:var(--em)">سجّل دخولك</a></p></div>
  </div></div></div>`;
}
window.doLogin=role=>{
  setSession(role==='admin'?{role:'admin',name:'كريم وجيه',title:'مالك المنصة'}:{role:'company',name:'شركة النخبة للتجارة',title:'باقة النمو'});
  toast(role==='admin'?'مرحبًا كريم! تم الدخول إلى لوحة مالك المنصة':'مرحبًا بفريق النخبة للتجارة!');
  location.hash=role==='admin'?'#/admin':'#/erp';
};
window.doLogout=()=>{clearSession();toast('تم تسجيل الخروج بأمان');location.hash='#/login';};

function notFoundView(){
  return publicShell(`<div class="nf"><h1>404</h1><h2>هذه الصفحة غير موجودة في منظومة أكوادرا</h2>
    <p style="color:var(--muted)">ربما تبحث عن لوحة التحكم أو صفحة الباقات؟</p>
    <div class="hero-actions"><a class="btn primary" href="#/">العودة للرئيسية</a><a class="btn ghost" href="#/admin">لوحة مالك المنصة</a></div></div>`,'');
}
