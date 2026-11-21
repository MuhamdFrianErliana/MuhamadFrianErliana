(function(){
  var lb=document.getElementById('lb'),im=document.getElementById('lbimg'),c=document.getElementById('lbc');
  var all=[].slice.call(document.querySelectorAll('.shot')),shots=all,cur=0,opener=null;
  function show(i){cur=(i+shots.length)%shots.length;var s=shots[cur].querySelector('img');im.src=s.src;im.alt=s.alt;c.textContent=(cur+1)+' / '+shots.length;}
  function open(i){opener=shots[i];show(i);lb.classList.add('on');document.body.style.overflow='hidden';document.getElementById('lbx').focus();}
  function close(){lb.classList.remove('on');document.body.style.overflow='';if(opener)opener.focus();}
  all.forEach(function(s){s.addEventListener('click',function(){shots=all.filter(function(x){return !x.hidden;});open(shots.indexOf(s));});});
  document.getElementById('lbx').onclick=close;
  document.getElementById('lbp').onclick=function(){show(cur-1);};
  document.getElementById('lbn').onclick=function(){show(cur+1);};
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;
    if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1);});
  var x0=null;
  lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(d)>50)show(cur+(d<0?1:-1));});
})();

(function(){
  var el=document.getElementById('jam');
  function tick(){
    try{
      el.textContent=new Intl.DateTimeFormat('id-ID',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Jakarta'}).format(new Date()).replace(':','.');
    }catch(e){el.textContent='';}
  }
  tick();setInterval(tick,15000);
})();

(function(){
  var ids=['beranda','tentang','pendidikan','galeri','kontak'];
  var links=document.querySelectorAll('.top nav a');
  function go(){
    var h=location.hash.slice(1);if(ids.indexOf(h)<0)h='beranda';
    ids.forEach(function(i){document.getElementById('v-'+i).classList.toggle('on',i===h);});
    links.forEach(function(a){if(a.getAttribute('href')==='#'+h)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',go);go();
})();

(function(){
  var btns=document.querySelectorAll('.filters button'),shots=document.querySelectorAll('.shot');
  function pick(f){
    [].forEach.call(btns,function(x){x.setAttribute('aria-pressed',x.getAttribute('data-f')===f?'true':'false');});
    [].forEach.call(shots,function(s){s.hidden=s.getAttribute('data-c')!==f;});
  }
  [].forEach.call(btns,function(b){b.addEventListener('click',function(){pick(b.getAttribute('data-f'));});});
  pick('Abaw');
})();

(function(){
  var a=document.getElementById('bgm'),b=document.getElementById('musicBtn'),t=document.getElementById('toast'),tm;
  function say(m){t.textContent=m;t.classList.add('on');clearTimeout(tm);tm=setTimeout(function(){t.classList.remove('on');},2200);}
  function set(p){b.setAttribute('aria-pressed',p?'true':'false');b.setAttribute('aria-label',p?'Jeda musik':'Putar musik');}
  var ctx=null,buf=null,src=null,wa=false,waOn=false;
  a.src='musik.mp3';
  function waStart(){
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC){say('Browser ini tidak mendukung audio');return;}
    wa=true;if(!ctx)ctx=new AC();
    function go(){src=ctx.createBufferSource();src.buffer=buf;src.loop=true;src.connect(ctx.destination);src.start(0);if(ctx.resume)ctx.resume();waOn=true;set(true);}
    if(buf){go();return;}
    fetch('musik.mp3').then(function(r){return r.arrayBuffer();}).then(function(ab){
      var ok=function(d){buf=d;go();},fail=function(){say('Musik tidak bisa diputar di browser ini');};
      var r=ctx.decodeAudioData(ab,ok,fail);if(r&&r.then)r.then(ok,fail);
    }).catch(function(){say('Musik tidak bisa dimuat');});
  }
  function waStop(){try{src.stop(0);}catch(e){}waOn=false;set(false);}
  b.addEventListener('click',function(){
    if(wa){if(waOn)waStop();else waStart();return;}
    if(a.paused){
      var p;try{p=a.play();}catch(e){waStart();return;}
      if(p&&p.then){p.then(function(){set(true);}).catch(function(){waStart();});}else{set(true);}
    }else{a.pause();set(false);}
  });
  a.addEventListener('ended',function(){set(false);});
  function stopAll(){
    if(wa&&waOn){waStop();}
    if(!a.paused){a.pause();}
    set(false);
  }
  document.addEventListener('visibilitychange',function(){if(document.hidden)stopAll();});
  window.addEventListener('pagehide',stopAll);
  window.addEventListener('blur',function(){if(document.hidden)stopAll();});
})();
