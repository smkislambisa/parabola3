/* AbdUmar Lab Maya — navigasi, data lokal, LKPD, dan evaluasi. */
(() => {
  const $ = id => document.getElementById(id);
  const fmt = (n,d=2) => Number(n).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  const state = {trials:JSON.parse(localStorage.getItem('abdumarTrials')||'[]'), answers:{}, question:0, quizSubmitted:false};
  const params = () => ({speed:+$('speed').value,angle:+$('angle').value,height:+$('height').value,gravity:+$('gravity').value,drag:+$('drag')?.value||0});
  function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400);}
  const names={beranda:'Beranda',materi:'Materi Pembelajaran',simulasi:'Simulasi Interaktif',eksperimen:'Eksperimen & Data',lkpd:'LKPD Digital',evaluasi:'Evaluasi',panduan:'Panduan Praktikum',labpro:'Virtual Lab Pro'};
  function navigate(){
    const key=(location.hash||'#beranda').slice(1), page=names[key]?key:'beranda';
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));
    document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.page===page));
    $('crumbCurrent').textContent=names[page];$('sidebar').classList.remove('open');
    if(page==='simulasi')setTimeout(()=>ParabolaSimulation.draw(),50);
    if(page==='eksperimen'){renderTrials();drawChart();}
    if(page==='lkpd')renderLkpdRows();
    window.scrollTo(0,0);
  }
  function updateOutputs(){
    $('speedOut').textContent=$('speed').value+' m/s';$('angleOut').textContent=$('angle').value+'°';$('heightOut').textContent=$('height').value+' m';$('gravityOut').textContent=fmt($('gravity').value,1)+' m/s²';if($('dragOut'))$('dragOut').textContent=fmt($('drag').value,3);
  }
  function updateModel(){
    updateOutputs();const p=params(),m=ParabolaSimulation.configure(p);
    $('flightMetric').innerHTML=fmt(m.flightTime)+' <i>s</i>';$('heightMetric').innerHTML=fmt(m.maxHeight)+' <i>m</i>';$('rangeMetric').innerHTML=fmt(m.range)+' <i>m</i>';$('apexMetric').innerHTML=fmt(m.vx)+' <i>m/s</i>';
    $('interpretation').textContent=`Dengan kecepatan awal ${p.speed} m/s dan sudut ${p.angle}°, komponen horizontal kecepatan adalah ${fmt(m.vx)} m/s. Benda mencapai tinggi maksimum ${fmt(m.maxHeight)} m dan mendarat setelah ${fmt(m.flightTime)} s, dengan jangkauan ${fmt(m.range)} m.`;
    return m;
  }
  function persist(){localStorage.setItem('abdumarTrials',JSON.stringify(state.trials));}
  function renderTrials(){
    $('trialCount').textContent=state.trials.length;
    const avg=state.trials.length?state.trials.reduce((s,t)=>s+t.range,0)/state.trials.length:null;
    const best=state.trials.length?Math.max(...state.trials.map(t=>t.range)):null;
    $('averageRange').textContent=avg===null?'—':fmt(avg)+' m';$('bestRange').textContent=best===null?'—':fmt(best)+' m';
    $('trialRows').innerHTML=state.trials.length?state.trials.map((t,i)=>`<tr><td>${i+1}</td><td>${t.speed} m/s</td><td>${t.angle}°</td><td>${fmt(t.gravity,1)}</td><td>${fmt(t.time)}</td><td>${fmt(t.maxHeight)}</td><td><b>${fmt(t.range)} m</b></td><td><button class="text-button danger-text" data-delete="${t.id}">Hapus</button></td></tr>`).join(''):'<tr><td colspan="8" class="empty-state">Belum ada data. Jalankan simulasi, lalu simpan percobaan.</td></tr>';
    renderLkpdRows();
  }
  function saveTrial(){
    const p=params(),m=ParabolaPhysics.calculate(p);
    state.trials.push({...p,time:m.flightTime,maxHeight:m.maxHeight,range:m.range,id:Date.now()});
    persist();renderTrials();drawChart();toast('Hasil percobaan berhasil disimpan.');
  }
  function renderLkpdRows(){
    const rows=state.trials.map((t,i)=>`<tr><td>${i+1}</td><td>${t.speed}</td><td>${t.angle}</td><td>${fmt(t.gravity,1)}</td><td>${fmt(t.time)}</td><td>${fmt(t.maxHeight)}</td><td>${fmt(t.range)}</td></tr>`).join('');
    $('lkpdRows').innerHTML=rows||'<tr><td colspan="7" class="empty-state">Belum ada data pengamatan.</td></tr>';
  }
  function drawChart(){
    const c=$('rangeChart');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);
    const left=55,right=20,top=20,bottom=45,vals=state.trials.map(t=>t.range),max=Math.max(10,...vals)*1.15;
    ctx.font='11px DM Sans';ctx.strokeStyle='#eeeaf3';ctx.fillStyle='#9994a7';
    for(let i=0;i<=4;i++){const y=h-bottom-(h-top-bottom)*i/4;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();ctx.fillText(fmt(max*i/4,0),8,y+4);}
    ctx.strokeStyle='#aaa4b5';ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,h-bottom);ctx.lineTo(w-right,h-bottom);ctx.stroke();
    if(!vals.length){ctx.fillStyle='#aaa6b4';ctx.textAlign='center';ctx.fillText('Simpan percobaan untuk menampilkan grafik',w/2,h/2);ctx.textAlign='left';return;}
    const step=(w-left-right)/Math.max(1,vals.length);
    vals.forEach((v,i)=>{const x=left+step*(i+.5),y=h-bottom-v/max*(h-top-bottom);ctx.fillStyle='#9a60d1';ctx.beginPath();ctx.roundRect(x-15,y,30,h-bottom-y,5);ctx.fill();ctx.fillStyle='#777286';ctx.textAlign='center';ctx.fillText('P'+(i+1),x,h-bottom+20);ctx.fillStyle='#7952ad';ctx.fillText(fmt(v,1),x,y-8);});
    ctx.textAlign='left';
  }
  const questions=[
    {q:'Gerak parabola merupakan perpaduan dari dua jenis gerak, yaitu ....',o:['GLB horizontal dan GLBB vertikal','GLBB horizontal dan GLB vertikal','Dua gerak melingkar','Dua gerak lurus beraturan'],a:0,e:'Pada arah horizontal tidak ada percepatan, sedangkan arah vertikal dipengaruhi gravitasi.'},
    {q:'Jika hambatan udara diabaikan, komponen kecepatan yang bernilai tetap adalah ....',o:['Kecepatan vertikal','Kecepatan horizontal','Kelajuan total','Percepatan vertikal'],a:1,e:'Komponen horizontal tetap karena percepatan horizontal dianggap nol.'},
    {q:'Pada titik tertinggi lintasan, nilai kecepatan vertikal adalah ....',o:['Maksimum','Sama dengan kecepatan awal','Nol','Sama dengan gravitasi'],a:2,e:'Di titik tertinggi, benda sesaat berhenti bergerak pada arah vertikal, tetapi tetap bergerak horizontal.'},
    {q:'Pada ketinggian awal dan akhir yang sama, sudut yang menghasilkan jangkauan maksimum dalam model ideal adalah ....',o:['15°','30°','45°','75°'],a:2,e:'Jangkauan sebanding dengan sin(2θ), yang maksimum ketika 2θ = 90°.'},
    {q:'Jika gravitasi diperbesar sementara kecepatan dan sudut tetap, waktu terbang pada ketinggian awal nol akan ....',o:['Bertambah','Berkurang','Tetap','Menjadi nol untuk semua sudut'],a:1,e:'Waktu terbang pada ketinggian sama sebanding dengan 1/g untuk kecepatan dan sudut tetap.'}
  ];
  function renderQuestion(){
    const i=state.question,q=questions[i],selected=state.answers[i];
    $('quizProgress').textContent=`SOAL ${i+1} / ${questions.length}`;$('quizProgressBar').style.width=((i+1)/questions.length*100)+'%';
    $('quizContent').innerHTML=`<div class="question-number">PERTANYAAN ${String(i+1).padStart(2,'0')}</div><h2 class="question-title">${q.q}</h2>${q.o.map((v,j)=>`<label class="answer-option ${selected===j?'selected':''}"><input type="radio" name="answer" value="${j}" ${selected===j?'checked':''}><span>${String.fromCharCode(65+j)}.</span>${v}</label>`).join('')}${state.quizSubmitted?`<div class="quiz-feedback ${selected===q.a?'correct':'wrong'}">${selected===q.a?'Benar! ':'Belum tepat. '}${q.e}</div>`:''}`;
    $('prevQuestion').disabled=i===0;$('nextQuestion').textContent=i===questions.length-1?(state.quizSubmitted?'Selesai':'Periksa nilai'):'Selanjutnya →';
    $('scoreDisplay').textContent=state.quizSubmitted?Math.round(questions.reduce((s,q,i)=>s+(state.answers[i]===q.a?1:0),0)/questions.length*100):'—';
    $('quizContent').querySelectorAll('input').forEach(el=>el.addEventListener('change',()=>{state.answers[i]=+el.value;renderQuestion();}));
  }
  function csvExport(){
    if(!state.trials.length){toast('Belum ada data untuk diekspor.');return;}
    const rows=[['No','Kecepatan awal (m/s)','Sudut (derajat)','Ketinggian awal (m)','Gravitasi (m/s2)','Waktu (s)','Tinggi maksimum (m)','Jangkauan (m)'],...state.trials.map((t,i)=>[i+1,t.speed,t.angle,t.height,t.gravity,t.time,t.maxHeight,t.range])];
    const csv='\ufeff'+rows.map(r=>r.join(';')).join('\r\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='data-eksperimen-gerak-parabola.csv';a.click();URL.revokeObjectURL(url);toast('File CSV berhasil dibuat.');
  }
  function saveLkpd(){
    const data={name:$('studentName').value,studentClass:$('studentClass').value,group:$('studentGroup').value,date:$('studentDate').value,analysis:$('analysisAnswer').value,conclusion:$('conclusionAnswer').value};
    localStorage.setItem('abdumarLkpd',JSON.stringify(data));toast('Jawaban LKPD tersimpan di browser.');
  }
  function loadLkpd(){try{const d=JSON.parse(localStorage.getItem('abdumarLkpd')||'{}');$('studentName').value=d.name||'';$('studentClass').value=d.studentClass||'';$('studentGroup').value=d.group||'';$('studentDate').value=d.date||'';$('analysisAnswer').value=d.analysis||'';$('conclusionAnswer').value=d.conclusion||'';}catch(e){}}
  function init(){
    document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
    window.addEventListener('hashchange',navigate);$('menuToggle').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
    ['speed','angle','height','gravity','drag'].forEach(id=>$(id).addEventListener('input',updateModel));
    $('planet').addEventListener('change',e=>{if(e.target.value!=='custom'){$('gravity').value=e.target.value;updateModel();}});
    $('showVectors').addEventListener('change',()=>ParabolaSimulation.draw());$('showGrid').addEventListener('change',()=>ParabolaSimulation.draw());
    $('compareBtn').addEventListener('click',()=>{const angles=[...document.querySelectorAll('.compareAngle:checked')].map(x=>+x.value);if(!angles.length){toast('Pilih minimal satu sudut.');return;}ParabolaSimulation.compare(angles);});
    document.querySelectorAll('input[name=labMode]').forEach(el=>el.addEventListener('change',e=>{$('guidedPanel').hidden=e.target.value!=='guided';}));
    $('drag').addEventListener('input',()=>{updateModel();$('dragOut').textContent=fmt($('drag').value,3);});
    $('simSpeed').addEventListener('input',e=>ParabolaSimulation.setSpeed(+e.target.value));
    if($('simSpeed'))ParabolaSimulation.setSpeed(+$('simSpeed').value);$('launchBtn').addEventListener('click',()=>{updateModel();ParabolaSimulation.play();});$('pauseBtn').addEventListener('click',()=>ParabolaSimulation.pause());$('resetBtn').addEventListener('click',()=>ParabolaSimulation.reset());$('applyBtn').addEventListener('click',()=>{updateModel();ParabolaSimulation.reset();toast('Parameter eksperimen diterapkan.');});
    $('saveTrial').addEventListener('click',saveTrial);$('exportCsv').addEventListener('click',csvExport);
    $('trialRows').addEventListener('click',e=>{const id=+e.target.dataset.delete;if(id){state.trials=state.trials.filter(t=>t.id!==id);persist();renderTrials();drawChart();toast('Data percobaan dihapus.');}});
    $('clearTrials').addEventListener('click',()=>{if(confirm('Hapus seluruh data percobaan pada perangkat ini?')){state.trials=[];persist();renderTrials();drawChart();}});
    $('saveLkpd').addEventListener('click',saveLkpd);$('printLkpd').addEventListener('click',()=>{saveLkpd();window.print();});
    $('prevQuestion').addEventListener('click',()=>{state.question=Math.max(0,state.question-1);renderQuestion();});
    $('nextQuestion').addEventListener('click',()=>{if(state.question<questions.length-1){state.question++;renderQuestion();}else if(!state.quizSubmitted){if(Object.keys(state.answers).length<questions.length){toast('Jawab seluruh soal terlebih dahulu.');return;}state.quizSubmitted=true;renderQuestion();}else{toast('Evaluasi telah selesai.');}});
    $('resetQuiz').addEventListener('click',()=>{state.answers={};state.question=0;state.quizSubmitted=false;renderQuestion();});
    loadLkpd();updateModel();renderTrials();renderQuestion();navigate();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
