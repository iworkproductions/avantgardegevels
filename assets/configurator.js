(function(){
var root=document.getElementById('agc');if(!root)return;
var TYPES=[{k:'vrijstaand',n:'Vrijstaand huis',s:'Jaren-tachtig, zadeldak'},{k:'villa',n:'Villa',s:'Breed, met schilddak'},{k:'bungalow',n:'Bungalow',s:'Eén laag, plat dak'},{k:'hoek',n:'Hoekwoning',s:'Einde van een rij'}];
var st={type:'vrijstaand',gevel:'huidig',dak:'oud',kozijnen:'oud',wp:false,avond:false,verg:false,split:50};
try{var o=JSON.parse(localStorage.getItem('ag-config-v12')||'null');if(o&&TYPES.some(function(t){return t.k===o.type}))for(var k in o)if(k!=='avond'&&k!=='verg')st[k]=o[k]}catch(e){}
var $=function(i){return document.getElementById(i)};
function nr(s){var b=s.gevel==='huidig'?1:s.gevel==='crepi'?5:9;return b+(s.kozijnen==='nieuw'?1:0)+(s.dak==='nieuw'?2:0)}
function pad(n){return (n<10?'0':'')+n}
function src(s,avond){return '/assets/samenstellen/'+s.type+'-'+(avond?'avond':pad(nr(s)))+'.jpg'}
function score(){var x=0;if(st.gevel==='crepi')x+=30;if(st.gevel==='avant')x+=40;if(st.dak==='nieuw')x+=15;if(st.kozijnen==='nieuw')x+=20;if(st.wp)x+=25;return Math.min(100,x)}
function pakket(){var g=st.gevel,d=st.dak==='nieuw',z=st.kozijnen==='nieuw',p;
 if(g==='avant'&&d&&z)p='Avant-Garde Compleet';else if(g==='avant'&&d)p='Look & Dak';else if(g==='avant')p='Avant-Garde Look';else if(g==='crepi')p='Avant-Garde Crepi'+(d||z?' + '+[d?'dak':'',z?'kozijnen':''].filter(Boolean).join(' en '):'');
 else if(d||z)p=[d?'Nieuw dak':'',z?'nieuwe kozijnen':''].filter(Boolean).join(' en ');else p='Nog geen keuze';
 return p+(st.wp?' + warmtepomp':'')}
var na=$('agcNaA'),naAnder=$('agcNaB');
function zet(el,u){if(el.getAttribute('src')!==u)el.src=u}
function bewaar(){try{localStorage.setItem('ag-config-v12',JSON.stringify(st))}catch(e){}}
function beeld(){
 var compleet=nr(st)===12;if(!compleet)st.avond=false;var u=src(st,st.avond);
 zet($('agcVoor'),src({type:st.type,gevel:'huidig',dak:'oud',kozijnen:'oud'}));
 if(na.getAttribute('src')!==u){var nieuw=naAnder,oud=na,img=new Image();img.onload=function(){nieuw.src=u;nieuw.classList.remove('weg');oud.classList.add('weg');na=nieuw;naAnder=oud;};img.src=u;}
 $('agcAvond').disabled=!compleet;$('agcDag').setAttribute('aria-pressed',String(!st.avond));$('agcAvond').setAttribute('aria-pressed',String(st.avond));
 var veranderd=nr(st)>1;if(!veranderd)st.verg=false;$('agcVerg').parentNode.style.display=veranderd?'':'none';
 $('agcBeeld').classList.toggle('verg',st.verg);$('agcVerg').setAttribute('aria-pressed',String(st.verg));$('agcBeeld').style.setProperty('--split',st.split+'%');
 var t=TYPES.filter(function(x){return x.k===st.type})[0];$('agcNaam').innerHTML=t.n+' <span>· impressie</span>';
 var p=score();$('agcBalkI').style.width=p+'%';$('agcPct').textContent=p+'%';
var sp=$('agcSlotPk');if(sp)sp.textContent=pakket();
 [1,5,9,11,12].forEach(function(n){var i=new Image();i.src='/assets/samenstellen/'+st.type+'-'+pad(n)+'.jpg'});
 bewaar();
}
var GEVEL=[{v:'huidig',n:'Huidig',w:'',u:'De gevel blijft zoals hij nu is.'},{v:'crepi',n:'Crepi',w:'+30%',u:'Nieuwe, geïsoleerde buitenschil in crepi.'},{v:'avant',n:'Look',w:'+40%',u:'Crepi met natuursteen en composiet houtlook.'}];
function schak(g,opties){return '<div class="agc-schak" role="group">'+opties.map(function(o){var aan=st[g]===o.v;return '<button type="button" data-g="'+g+'" data-v="'+o.v+'" class="'+(aan?'aan':'')+'" aria-pressed="'+aan+'">'+o.n+(o.w?'<small>'+o.w+'</small>':'<small>&nbsp;</small>')+'</button>'}).join('')+'</div>'}
function keuzes(){
 var k=st.type,gv=GEVEL.filter(function(o){return o.v===st.gevel})[0],h='';
 h+='<div><h1>Ontwerp uw woning.</h1><p class="sub">Kies, en zie uw huis direct veranderen.</p></div>';
 h+='<div class="agc-groep"><div class="kop"><b>Woning</b><span>'+TYPES.filter(function(t){return t.k===k})[0].s+'</span></div><div class="agc-types">'+TYPES.map(function(t){var aan=t.k===k;return '<button type="button" class="agc-type'+(aan?' aan':'')+'" data-g="type" data-v="'+t.k+'" aria-pressed="'+aan+'"><img src="/assets/samenstellen/'+t.k+'-01.jpg" alt="">'+t.n.replace(' huis','')+'</button>'}).join('')+'</div></div>';
 h+='<div class="agc-groep"><div class="kop"><b>Gevel</b></div>'+schak('gevel',GEVEL)+'<div class="agc-uitleg">'+gv.u+'</div></div>';
 h+='<div class="agc-duo"><div class="agc-groep"><div class="kop"><b>Dak</b></div>'+schak('dak',[{v:'oud',n:'Huidig'},{v:'nieuw',n:'Nieuw',w:'+15%'}])+'</div>';
 h+='<div class="agc-groep"><div class="kop"><b>Kozijnen</b></div>'+schak('kozijnen',[{v:'oud',n:'Huidig'},{v:'nieuw',n:'Nieuw',w:'+20%'}])+'</div></div>';
 h+='<button type="button" class="agc-wissel'+(st.wp?' aan':'')+'" id="agcWp" role="switch" aria-checked="'+st.wp+'"><span><b>Warmtepomp</b><small>Aanvulling op elk pakket · +25%</small></span><i></i></button>';
 h+='<div class="agc-slot"><small>Uw ontwerp</small><h3 id="agcSlotPk">'+pakket()+'</h3><a href="/#contact">Plan een adviesgesprek</a></div>';
 $('agcKeuzes').innerHTML=h;$('agcKeuzes').className='agc-keuzes agc-paneel';
 [].forEach.call(root.querySelectorAll('[data-g]'),function(b){b.onclick=function(){st[b.dataset.g]=b.dataset.v;keuzes();beeld();}});
 $('agcWp').onclick=function(){st.wp=!st.wp;keuzes();beeld();};
}
$('agcDag').onclick=function(){st.avond=false;beeld()};
$('agcAvond').onclick=function(){st.avond=true;beeld()};
$('agcVerg').onclick=function(){st.verg=!st.verg;beeld()};
$('agcSchuif').oninput=function(){st.split=+this.value;$('agcBeeld').style.setProperty('--split',st.split+'%')};
keuzes();beeld();
})();
