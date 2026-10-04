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
 $('agcPk').innerHTML='<span>Uw ontwerp</span> '+pakket();var sp=$('agcSlotPk');if(sp)sp.textContent=pakket();
 [1,5,9,11,12].forEach(function(n){var i=new Image();i.src='/assets/samenstellen/'+st.type+'-'+pad(n)+'.jpg'});
 bewaar();if(window.agcZweef)window.agcZweef();
}
function optie(g,v,titel,sub,img,plus){var aan=g==='wp'?((v==='ja')===st.wp):st[g]===v;return '<button type="button" class="agc-optie'+(img?'':' tekst')+(aan?' aan':'')+'" data-g="'+g+'" data-v="'+v+'" aria-pressed="'+aan+'">'+(img?'<img src="'+img+'" alt="" loading="lazy">':'')+'<span class="t"><b>'+titel+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</span>'+(plus?'<span class="plus">'+plus+'</span>':'')+'</button>'}
function keuzes(){
 var k=st.type,h='';
 h+='<div class="agc-blok"><h2>Woning. <span>Welk type heeft u?</span></h2><div class="agc-opties twee">'+TYPES.map(function(t){return optie('type',t.k,t.n,t.s,'/assets/samenstellen/'+t.k+'-01.jpg')}).join('')+'</div></div>';
 h+='<div class="agc-blok"><h2>Gevel. <span>Welke uitstraling?</span></h2><div class="agc-opties">'+optie('gevel','huidig','Huidige gevel','Zoals hij nu is','/assets/samenstellen/'+k+'-01.jpg')+optie('gevel','crepi','Avant-Garde Crepi','Nieuwe, geïsoleerde buitenschil in crepi','/assets/materialen/closeup-crepi.jpg','+30%')+optie('gevel','avant','Avant-Garde Look','Crepi met natuursteen en composiet houtlook','/assets/materialen/closeup-steen.jpg','+40%')+'</div></div>';
 h+='<div class="agc-blok"><h2>Dak. <span>Nieuw of zo laten?</span></h2><div class="agc-opties">'+optie('dak','oud','Huidig dak','',null)+optie('dak','nieuw',k==='bungalow'?'Nieuwe daktrim':'Nieuw dak','Nieuwe pannen en isolatie',null,'+15%')+'</div></div>';
 h+='<div class="agc-blok"><h2>Kozijnen. <span>Het laatste detail.</span></h2><div class="agc-opties">'+optie('kozijnen','oud','Huidige kozijnen','',null)+optie('kozijnen','nieuw','Nieuwe kozijnen','Aluminium antraciet, met nieuwe voordeur',null,'+20%')+'</div></div>';
 h+='<div class="agc-blok"><h2>Warmtepomp. <span>Aanvulling op elk pakket.</span></h2><div class="agc-opties">'+optie('wp','nee','Geen warmtepomp','',null)+optie('wp','ja','Met warmtepomp','Hybride of volledig elektrisch',null,'+25%')+'</div></div>';
 h+='<div class="agc-blok agc-slot"><small>Uw ontwerp</small><h3 id="agcSlotPk">'+pakket()+'</h3><p>Wij maken een ontwerp voor uw eigen woning en komen vrijblijvend bij u langs.</p><a href="/#contact">Plan een adviesgesprek</a></div>';
 $('agcKeuzes').innerHTML=h;
 [].forEach.call(root.querySelectorAll('.agc-optie'),function(b){b.onclick=function(){var g=b.dataset.g,v=b.dataset.v;if(g==='wp')st.wp=v==='ja';else st[g]=v;
  [].forEach.call(root.querySelectorAll('.agc-optie[data-g="'+g+'"]'),function(x){x.classList.toggle('aan',x===b);x.setAttribute('aria-pressed',String(x===b))});
  if(g==='type')keuzes();beeld();}});
}
$('agcDag').onclick=function(){st.avond=false;beeld()};
$('agcAvond').onclick=function(){st.avond=true;beeld()};
$('agcVerg').onclick=function(){st.verg=!st.verg;beeld()};
$('agcSchuif').oninput=function(){st.split=+this.value;$('agcBeeld').style.setProperty('--split',st.split+'%')};
var zweef=$('agcZweef');if('IntersectionObserver' in window){var inBeeld=false;window.agcZweef=function(){zweef.classList.toggle('zicht',inBeeld&&(nr(st)>1||st.wp))};new IntersectionObserver(function(e){inBeeld=e[0].isIntersecting;window.agcZweef()},{rootMargin:'-30% 0px -30% 0px'}).observe(root)}else zweef.classList.add('zicht');
keuzes();beeld();
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="/#contact"]');if(a&&(root.contains(a)||a.closest('#agcZweef'))){try{sessionStorage.setItem('ag-van-atelier','1')}catch(x){}}},true);
})();
