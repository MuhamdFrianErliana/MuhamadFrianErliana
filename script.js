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
  var cur='Abaw';
  function pick(f){
    cur=f;
    [].forEach.call(btns,function(x){x.setAttribute('aria-pressed',x.getAttribute('data-f')===cur?'true':'false');});
    [].forEach.call(shots,function(s){s.hidden=s.getAttribute('data-c')!==cur;});
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
  document.addEventListener('freeze',stopAll);
  setInterval(function(){if(document.visibilityState==='hidden')stopAll();},500);
})();

(function(){
  var NS='http://www.w3.org/2000/svg',root=document.documentElement;
  var grid=document.querySelector('.homegrid'),fx=document.getElementById('fx'),pic=document.querySelector('.homephoto');
  var lines=[].slice.call(document.querySelectorAll('#v-beranda h1 span i')),motto=document.querySelector('.motto');
  if(!grid||!fx||!pic||!lines.length)return;
  var played=false,busy=false;
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  function rel(r){var g=grid.getBoundingClientRect();return{x:r.left-g.left,y:r.top-g.top,w:r.width,h:r.height};}
  function handPt(){var r=rel(pic.getBoundingClientRect());return{x:r.x+r.w*.05,y:r.y+r.h*.50};}
  function endPt(el){var rg=document.createRange();rg.selectNodeContents(el);var r=rel(rg.getBoundingClientRect());return{x:r.x+r.w+4,y:r.y+r.h*.5};}
  function burst(p){var g=document.createElementNS(NS,'g');g.setAttribute('class','hit');
    var c=document.createElementNS(NS,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',9);g.appendChild(c);
    for(var i=0;i<8;i++){var a=i*Math.PI/4,l=document.createElementNS(NS,'line');l.setAttribute('x1',p.x+Math.cos(a)*13);l.setAttribute('y1',p.y+Math.sin(a)*13);l.setAttribute('x2',p.x+Math.cos(a)*24);l.setAttribute('y2',p.y+Math.sin(a)*24);g.appendChild(l);}
    fx.appendChild(g);g.animate([{opacity:1,transform:'scale(.3)'},{opacity:1,transform:'scale(1)',offset:.4},{opacity:0,transform:'scale(1.25)'}],{duration:520,easing:'ease-out',fill:'forwards'});}
  function reveal(el,delay){return el.animate([{opacity:0,transform:'translateX(-26px) scale(.82)'},{opacity:1,transform:'none'}],{duration:420,delay:delay||0,easing:'cubic-bezier(.2,1.4,.4,1)',fill:'forwards'});}
  async function web(from,to,k,bend){
    var p=document.createElementNS(NS,'path');p.setAttribute('class','web');p.setAttribute('pathLength','1');
    var cx=(from.x+to.x)/2+bend,cy=(from.y+to.y)/2+26;
    p.setAttribute('d','M'+from.x+' '+from.y+' Q'+cx+' '+cy+' '+to.x+' '+to.y);p.style.strokeDasharray='1 1';fx.appendChild(p);p.style.opacity=1;
    await p.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'}).finished;
    burst(to);reveal(lines[k],0);if(k===lines.length-1)reveal(motto,260);
    await sleep(650);
    await p.animate([{strokeDashoffset:0},{strokeDashoffset:-1}],{duration:260,easing:'ease-in',fill:'forwards'}).finished;
    p.remove();}
  async function play(){
    if(busy)return;busy=true;pic.classList.remove('goyang');
    if(!root.classList.contains('wb')){busy=false;return;}
    root.classList.remove('wbdone');fx.innerHTML='';
    lines.concat([motto]).forEach(function(e){e.getAnimations().forEach(function(a){a.cancel();});});
    await sleep(400);
    var from=handPt();
    pic.animate([{transform:'none'},{transform:'rotate(-4deg) scale(1.03,.97)'},{transform:'none'}],{duration:380,easing:'ease-out'});
    var bends=[26,18,10];
    await Promise.all(lines.map(function(l,k){return web(from,endPt(l),k,bends[k]||12);}));
    root.classList.add('wbdone');
    lines.concat([motto]).forEach(function(e){e.getAnimations().forEach(function(a){a.cancel();});});
    pic.classList.add('goyang');
    played=true;busy=false;}
  function ready(){var f=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
    var im=pic.complete?Promise.resolve():new Promise(function(r){pic.addEventListener('load',r);pic.addEventListener('error',r);});
    return Promise.all([f,im]);}
  function onHome(){return (location.hash.slice(1)||'beranda')==='beranda';}
  function start(){if(played||!onHome()){if(!onHome()){root.classList.add('wbdone');}return;}ready().then(function(){if(onHome())play();else root.classList.add('wbdone');});}
  window.addEventListener('hashchange',function(){if(!played&&onHome())start();else if(!onHome()&&!busy)root.classList.add('wbdone');});
  pic.addEventListener('click',function(){if(!busy&&onHome())play();});
  start();
})();

(function(){
  var t=document.getElementById('toast'),b=document.getElementById('musicBtn');
  if(!t||!b)return;
  try{if(sessionStorage.getItem('musikHint'))return;}catch(e){}
  setTimeout(function(){
    if(b.getAttribute('aria-pressed')==='true')return;
    t.textContent='Ketuk tombol Musik untuk memutar lagu';t.classList.add('on');
    setTimeout(function(){t.classList.remove('on');},3500);
    try{sessionStorage.setItem('musikHint','1');}catch(e){}
  },4200);
})();
