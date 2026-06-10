'use strict';
/* ============ أكوادرا ERP — مكونات الواجهة: نوافذ + نماذج + جداول + رسوم ============ */

/* ===== النوافذ المنبثقة والتنبيهات ===== */
function openModal(title,body,wide){
  $('#modal-root').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()">
    <div class="modal ${wide?'wide':''}">
      <div class="modal-head"><h3>${title}</h3><button class="icon-btn" onclick="closeModal()" aria-label="إغلاق">✕</button></div>
      <div class="modal-body">${body}</div>
    </div></div>`;
  document.body.classList.add('locked');
}
function closeModal(){$('#modal-root').innerHTML='';document.body.classList.remove('locked');}
function toast(msg,type){
  const t=document.createElement('div');t.className='toast'+(type==='bad'?' t-bad':'');t.textContent=msg;
  $('#toast-root').appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),450)},3200);
}
window.closeModal=closeModal;

/* ===== مولّد النماذج ===== */
function fieldHTML(f,val){
  const v=val===undefined||val===null?(f.def??''):val;
  const full=f.full?' full':'';
  if(f.type==='select'){
    const opts=(typeof f.options==='function'?f.options():f.options)||[];
    return `<div class="field${full}"><label>${f.label}</label><select id="f_${f.k}" ${f.req?'required':''}>
      ${opts.map(o=>{const ov=o.v!==undefined?o.v:o,ol=o.l!==undefined?o.l:o;return `<option value="${esc(ov)}" ${String(ov)===String(v)?'selected':''}>${esc(ol)}</option>`}).join('')}
    </select></div>`;
  }
  if(f.type==='textarea')return `<div class="field${full||' full'}"><label>${f.label}</label><textarea id="f_${f.k}" ${f.req?'required':''}>${esc(v)}</textarea></div>`;
  return `<div class="field${full}"><label>${f.label}</label><input id="f_${f.k}" type="${f.type||'text'}" value="${esc(v)}" ${f.req?'required':''} ${f.type==='number'?'step="any" min="0"':''} placeholder="${esc(f.ph||'')}"/></div>`;
}
function openForm(title,fields,data,onSave,saveLabel){
  openModal(title,`<form id="crud-form" class="form-grid">
    ${fields.map(f=>fieldHTML(f,data?data[f.k]:undefined)).join('')}
    <div class="modal-actions"><button type="button" class="btn ghost" onclick="closeModal()">إلغاء</button>
    <button type="submit" class="btn primary">${saveLabel||'حفظ البيانات'}</button></div></form>`,fields.length>5);
  $('#crud-form').addEventListener('submit',e=>{
    e.preventDefault();
    const obj={};
    fields.forEach(f=>{let v=$('#f_'+f.k).value;if(f.type==='number')v=Number(v||0);obj[f.k]=v;});
    onSave(obj);closeModal();
  });
}
function confirmDel(msg,onYes){
  openModal('تأكيد الحذف',`<p class="confirm-text">${msg}</p>
    <div class="modal-actions"><button class="btn ghost" onclick="closeModal()">تراجع</button>
    <button class="btn danger" id="yes-del">${ico('trash')} حذف نهائي</button></div>`);
  $('#yes-del').onclick=()=>{onYes();closeModal();};
}

/* ===== محرك الجداول (بحث + فلاتر + فرز + ترقيم صفحات + CRUD) ===== */
const PG=8;
const TBL={};
const TS={};
function tstate(k){return TS[k]||(TS[k]={page:1,sort:null,dir:1,q:'',f:{}});}

function tableRows(cfg){
  const st=tstate(cfg.key);
  let rows=col(cfg.col).slice();
  if(cfg.where)rows=rows.filter(cfg.where);
  if(st.q){const q=st.q.toLowerCase();rows=rows.filter(r=>(cfg.searchKeys||[]).some(k=>String(r[k]??'').toLowerCase().includes(q)));}
  for(const fk in st.f){if(st.f[fk])rows=rows.filter(r=>String(r[fk])===st.f[fk]);}
  if(st.sort){rows.sort((a,b)=>{const x=a[st.sort],y=b[st.sort];
    return (typeof x==='number'&&typeof y==='number'?x-y:String(x??'').localeCompare(String(y??''),'ar'))*st.dir;});}
  return rows;
}
function renderTable(cfg){
  TBL[cfg.key]=cfg;
  const st=tstate(cfg.key);
  const all=tableRows(cfg);
  const pages=Math.max(1,Math.ceil(all.length/PG));
  if(st.page>pages)st.page=pages;
  const rows=all.slice((st.page-1)*PG,st.page*PG);
  const from=all.length?((st.page-1)*PG+1):0,to=Math.min(st.page*PG,all.length);
  const filtersHTML=(cfg.filters||[]).map(f=>`<select class="filter-sel" onchange="tblFilter('${cfg.key}','${f.k}',this.value)">
      <option value="">${f.label}: الكل</option>
      ${(typeof f.options==='function'?f.options():f.options).map(o=>{const ov=o.v!==undefined?o.v:o,ol=o.l!==undefined?o.l:o;return `<option value="${esc(ov)}" ${st.f[f.k]===String(ov)?'selected':''}>${esc(ol)}</option>`}).join('')}
    </select>`).join('');
  let pgBtns='';
  const win=[];for(let p=Math.max(1,st.page-2);p<=Math.min(pages,st.page+2);p++)win.push(p);
  pgBtns=`<button class="pg-btn" ${st.page<=1?'disabled':''} onclick="tblPage('${cfg.key}',${st.page-1})">‹ السابق</button>
    ${win.map(p=>`<button class="pg-btn ${p===st.page?'cur':''}" onclick="tblPage('${cfg.key}',${p})">${p}</button>`).join('')}
    <button class="pg-btn" ${st.page>=pages?'disabled':''} onclick="tblPage('${cfg.key}',${st.page+1})">التالي ›</button>`;
  return `<div class="tbl-wrap" id="tblwrap-${cfg.key}">
    <div class="tbl-toolbar">
      <h3>${cfg.title} <span style="color:var(--muted);font-size:.78rem;font-family:var(--font-b)">(${all.length})</span></h3>
      <div class="search-box">${ico('search')}<input id="q-${cfg.key}" placeholder="${cfg.searchPh||'ابحث في السجلات...'}" value="${esc(st.q)}" oninput="tblQ('${cfg.key}',this.value)"/></div>
      ${filtersHTML}
      ${cfg.fields?`<button class="btn primary sm" onclick="tblAdd('${cfg.key}')">${ico('plus')} ${cfg.addLabel||'إضافة سجل'}</button>`:''}
    </div>
    <div class="tbl-scroll"><table class="data-table"><thead><tr>
      ${cfg.columns.map(c=>c.sort?`<th class="sortable" onclick="tblSort('${cfg.key}','${c.k}')">${c.l}${st.sort===c.k?`<span class="sort-ind">${st.dir===1?'▲':'▼'}</span>`:''}</th>`:`<th>${c.l}</th>`).join('')}
      <th>إجراءات</th></tr></thead><tbody>
      ${rows.length?rows.map(r=>`<tr>${cfg.columns.map(c=>`<td>${c.r?c.r(r):esc(r[c.k])}</td>`).join('')}
        <td><div class="row-actions">
          <button class="icon-btn" title="عرض التفاصيل" onclick="tblView('${cfg.key}','${r.id}')">${ico('eye')}</button>
          ${cfg.fields?`<button class="icon-btn" title="تعديل" onclick="tblEdit('${cfg.key}','${r.id}')">${ico('edit')}</button>
          <button class="icon-btn del" title="حذف" onclick="tblDel('${cfg.key}','${r.id}')">${ico('trash')}</button>`:''}
        </div></td></tr>`).join('')
      :`<tr><td colspan="${cfg.columns.length+1}"><div class="empty-state"><b>لا توجد سجلات مطابقة</b>جرّب تعديل البحث أو الفلاتر، أو أضف سجلًا جديدًا.</div></td></tr>`}
    </tbody></table></div>
    <div class="pagination"><span class="pg-info">عرض ${from}–${to} من أصل ${all.length} سجل • صفحة ${st.page} من ${pages}</span>${pgBtns}</div>
  </div>`;
}
function refreshTable(key){
  const cfg=TBL[key];if(!cfg)return;
  const node=document.getElementById('tblwrap-'+key);if(!node)return;
  node.outerHTML=renderTable(cfg);
}
window.tblSort=(key,k)=>{const st=tstate(key);if(st.sort===k)st.dir*=-1;else{st.sort=k;st.dir=1;}refreshTable(key);};
window.tblPage=(key,p)=>{tstate(key).page=p;refreshTable(key);};
window.tblFilter=(key,fk,v)=>{const st=tstate(key);st.f[fk]=v;st.page=1;refreshTable(key);};
window.tblQ=(key,v)=>{const st=tstate(key);st.q=v;st.page=1;clearTimeout(st._t);
  st._t=setTimeout(()=>{refreshTable(key);const inp=document.getElementById('q-'+key);
    if(inp){inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length);}},250);};
window.tblAdd=key=>{const cfg=TBL[key];
  openForm(cfg.addTitle||('إضافة — '+cfg.title),cfg.fields,null,obj=>{
    if(cfg.beforeSave)obj=cfg.beforeSave(obj)||obj;
    addRow(cfg.col,obj);toast('تمت إضافة السجل بنجاح إلى '+cfg.title);refreshTable(key);
    if(cfg.after)cfg.after();
  });};
window.tblEdit=(key,id)=>{const cfg=TBL[key];const row=findRow(cfg.col,id);
  openForm('تعديل — '+cfg.title,cfg.fields,row,obj=>{
    if(cfg.beforeSave)obj=cfg.beforeSave(obj)||obj;
    updRow(cfg.col,id,obj);toast('تم تحديث السجل بنجاح');refreshTable(key);
    if(cfg.after)cfg.after();
  });};
window.tblDel=(key,id)=>{const cfg=TBL[key];
  confirmDel('هل أنت متأكد من حذف هذا السجل نهائيًا من '+cfg.title+'؟ لا يمكن التراجع عن هذا الإجراء.',()=>{
    delRow(cfg.col,id);toast('تم حذف السجل','bad');refreshTable(key);
    if(cfg.after)cfg.after();
  });};
window.tblView=(key,id)=>{const cfg=TBL[key];
  if(cfg.view){location.hash=cfg.view(id);return;}
  const row=findRow(cfg.col,id);if(!row)return;
  openModal('تفاصيل السجل — '+cfg.title,`<div class="detail-list">
    ${cfg.columns.map(c=>`<div><span>${c.l}</span><b>${c.r?c.r(row):esc(row[c.k])}</b></div>`).join('')}
  </div><div class="modal-actions"><button class="btn ghost" onclick="closeModal()">إغلاق</button></div>`);};

/* ===== الرسوم البيانية ===== */
function barChart(data,labels,color){
  const m=Math.max(...data,1);
  return `<div class="bars">${data.map((v,i)=>`<div class="bar-col">
    <div class="bar" style="--h:${Math.max(4,Math.round(v/m*100))}%;--d:${i*70}ms;${color?`--bc:${color}`:''}"><span>${shortN(v)}</span></div>
    <i>${labels[i]||''}</i></div>`).join('')}</div>`;
}
const CHART_COLORS=['#35e3b2','#5d8bff','#f3c46b','#9d7bff','#ff6b81','#ffb454'];
function donutChart(items,centerLabel){
  const total=items.reduce((s,x)=>s+x.v,0)||1;
  let acc=0;
  const stops=items.map((x,i)=>{const a=acc/total*360;acc+=x.v;const b=acc/total*360;
    return `${CHART_COLORS[i%CHART_COLORS.length]} ${a.toFixed(1)}deg ${b.toFixed(1)}deg`;}).join(',');
  return `<div class="donut-wrap">
    <div class="donut" style="background:conic-gradient(${stops})"><b>${centerLabel||shortN(total)}<small>الإجمالي</small></b></div>
    <ul class="legend">${items.map((x,i)=>`<li><i style="background:${CHART_COLORS[i%CHART_COLORS.length]}"></i>${esc(x.l)}<b>${shortN(x.v)}</b></li>`).join('')}</ul>
  </div>`;
}
function kpiCard(icon,label,val,trend,colorVar){
  return `<div class="kpi-card rv" style="--kc:${colorVar||'var(--em)'}">
    <div class="kpi-ico">${ico(icon)}</div>
    <div class="kpi-val">${val}</div>
    <div class="kpi-lbl">${label}</div>
    ${trend?`<div class="kpi-trend ${trend.startsWith('-')?'down':'up'}">${trend.startsWith('-')?'▼':'▲'} ${trend.replace('-','')} مقارنة بالشهر الماضي</div>`:''}
  </div>`;
}
