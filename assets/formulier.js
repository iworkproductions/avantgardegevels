(function(){
var WEBHOOK='https://hook.eu1.make.com/d11l86yufvlnq827fyve9fipe0693gwq';
var root=document.getElementById('agf');if(!root)return;
var W=[{n:'Vrijstaand',k:'vrijstaand',s:'Vier gevels vrij'},{n:'Twee-onder-een-kap',k:'hoek',s:'Drie gevels vrij'},{n:'Bungalow',k:'bungalow',s:'Eén laag, groot dak'},{n:'Boerderij',k:'farm',s:'Karakter en ruimte'}];
var V=[{n:'Gevel',s:'Crepi, natuursteen en houtlook'},{n:'Dak',s:'Nieuwe pannen en isolatie'},{n:'Kozijnen',s:'Nieuw, met triple glas'},{n:'Warmtepomp',s:'Aanvulling op elk pakket'}];
var S=[{n:'Binnen 3 maanden',s:'Liefst snel'},{n:'Dit jaar',s:'Komende maanden'},{n:'Volgend jaar',s:'Plannen maken'},{n:'Ik oriënteer me',s:'Eerst zien wat kan'}];
var st={stap:0,woning:'',vern:[],start:'',velden:{}};
root.innerHTML='<div class="agf-beeld"><img class="a" src="/assets/samenstellen/vrijstaand-01.jpg" alt=""><img class="b weg" alt=""><div class="agf-chip"></div></div><div class="agf-in"><div class="agf-gang"><i></i><i></i><i></i><i></i></div><div class="agf-scherm-box"></div></div>';
var q=function(s){return root.querySelector(s)};
var A=q('img.a'),B=q('img.b'),voor=A,box=q('.agf-scherm-box');
function wk(){var w=W.filter(function(x){return x.n===st.woning})[0];return w?w.k:'vrijstaand'}
function heeft(v){return st.vern.indexOf(v)>-1}
function bron(avond){var k=wk();if(k==='farm')return (st.vern.length||avond)?'/assets/farm-na.jpg':'/assets/farm-voor.jpg';
 if(avond&&heeft('Gevel')&&heeft('Dak')&&heeft('Kozijnen'))return '/assets/samenstellen/'+k+'-avond.jpg';
 var n=(heeft('Gevel')?9:1)+(heeft('Kozijnen')?1:0)+(heeft('Dak')?2:0);return '/assets/samenstellen/'+k+'-'+(n<10?'0':'')+n+'.jpg'}
function beeld(avond){var u=bron(avond);if(voor.getAttribute('src')===u)return;var nieuw=voor===A?B:A,i=new Image();i.onload=function(){nieuw.src=u;nieuw.classList.remove('weg');voor.classList.add('weg');voor=nieuw;};i.src=u}
function chip(){var c=['Impressie'];if(st.woning)c.push(st.woning);c=c.concat(st.vern);q('.agf-chip').innerHTML=c.map(function(t,i){return '<span'+(i?'':' class="z"')+'>'+t+'</span>'}).join('')}
function gang(){[].forEach.call(q('.agf-gang').children,function(e,i){e.classList.toggle('vol',i<st.stap)})}
function kop(nr,v){return '<div class="agf-kop"><span class="agf-nr">Vraag '+nr+' van 4</span>'+(nr>1?'<button type="button" class="agf-terug">Terug</button>':'<span></span>')+'</div><h3 class="agf-vraag">'+v+'</h3>'}
function veld(n,l,ac,cls,type){return '<div class="agf-veld '+cls+'"><input id="agf-'+n+'" name="'+n+'" placeholder=" "'+(type?' type="'+type+'" inputmode="'+type+'"':'')+' autocomplete="'+(ac||'off')+'" value="'+(st.velden[n]||'').replace(/"/g,'&quot;')+'"><label for="agf-'+n+'">'+l+'</label></div>'}
function samen(){return [st.vern.join(', '),st.woning,st.start].filter(Boolean).join(' · ')}
function teken(){
 gang();chip();var h;
 if(st.stap===0)h=kop(1,'Wat voor woning heeft u?')+'<div class="agf-tegels">'+W.map(function(w){var s=w.k==='farm'?'/assets/farm-voor.jpg':'/assets/samenstellen/'+w.k+'-01.jpg';return '<button type="button" class="agf-tegel'+(st.woning===w.n?' aan':'')+'" data-w="'+w.n+'"><img src="'+s+'" alt="" loading="lazy"><b>'+w.n+'</b><small>'+w.s+'</small></button>'}).join('')+'</div>';
 else if(st.stap===1)h=kop(2,'Wat wilt u vernieuwen?')+'<div class="agf-tegels">'+V.map(function(v){return '<button type="button" class="agf-tegel tekst'+(heeft(v.n)?' aan':'')+'" data-v="'+v.n+'"><b>'+v.n+'</b><small>'+v.s+'</small></button>'}).join('')+'</div><button type="button" class="agf-knop verder'+(st.vern.length?'':' uit')+'">Verder</button>';
 else if(st.stap===2)h=kop(3,'Wanneer wilt u starten?')+'<div class="agf-lijst">'+S.map(function(s){return '<button type="button" class="agf-rij'+(st.start===s.n?' aan':'')+'" data-s="'+s.n+'"><span>'+s.n+'</span><small>'+s.s+'</small></button>'}).join('')+'</div>';
 else if(st.stap===3)h=kop(4,'Waar kunnen we u bereiken?')+'<form novalidate><div class="agf-velden">'+veld('voornaam','Voornaam','given-name','half')+veld('achternaam','Achternaam','family-name','half')+veld('telefoon','Telefoon','tel','heel','tel')+veld('email','E-mailadres','email','heel','email')+veld('postcode','Postcode','postal-code','')+veld('huisnummer','Huisnummer','','')+'<p class="agf-adres"></p><div class="agf-veld heel plaats" hidden><input id="agf-plaats" name="plaats" placeholder=" " autocomplete="address-level2"><label for="agf-plaats">Plaats</label></div></div><label class="agf-weg" aria-hidden="true">Laat leeg<input name="website" tabindex="-1" autocomplete="off"></label><p class="agf-melding" role="alert"></p><button class="agf-knop" type="submit">Verstuur aanvraag</button></form><p class="agf-privacy">Wij gebruiken uw gegevens alleen om contact met u op te nemen. <a href="/privacy/">Privacyverklaring</a></p>';
 else h='<div class="agf-dank"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg><h3>Dank u, '+esc(st.velden.voornaam||'')+'.</h3><p>Uw aanvraag is binnen. Wij nemen contact met u op om een adviesgesprek bij u thuis te plannen.</p></div>';
 box.innerHTML='<div class="agf-scherm">'+h+'</div>';
 var t=q('.agf-terug');if(t)t.onclick=function(){bewaar();st.stap--;teken()};
 [].forEach.call(box.querySelectorAll('[data-w]'),function(b){b.onclick=function(){st.woning=b.dataset.w;beeld();teken();setTimeout(function(){if(st.stap===0){st.stap=1;teken()}},380)}});
 [].forEach.call(box.querySelectorAll('[data-v]'),function(b){b.onclick=function(){var p=st.vern.indexOf(b.dataset.v);if(p>-1)st.vern.splice(p,1);else st.vern.push(b.dataset.v);st.vern.sort(function(x,y){return V.map(function(v){return v.n}).indexOf(x)-V.map(function(v){return v.n}).indexOf(y)});beeld();teken()}});
 var vd=q('.verder');if(vd)vd.onclick=function(){if(st.vern.length){st.stap=2;teken()}else vd.textContent='Kies er minstens één'};
 [].forEach.call(box.querySelectorAll('[data-s]'),function(b){b.onclick=function(){st.start=b.dataset.s;teken();setTimeout(function(){if(st.stap===2){st.stap=3;teken()}},320)}});
 var f=box.querySelector('form');if(f)formulier(f);
}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var formEl=null;function bewaar(){if(!formEl)return;['voornaam','achternaam','telefoon','email','postcode','huisnummer'].forEach(function(n){st.velden[n]=formEl[n].value})}
var adres={straat:'',plaats:''},adresP=Promise.resolve(),tm=null;
function formulier(f){
 formEl=f;var melding=f.querySelector('.agf-melding'),knop=f.querySelector('button[type=submit]'),plaatsVeld=f.querySelector('.plaats'),adresEl=f.querySelector('.agf-adres');
 function toonPlaats(){plaatsVeld.hidden=false}
 function zoek(){var pc=f.postcode.value.replace(/\s/g,'').toUpperCase(),hn=f.huisnummer.value.trim();adres={straat:'',plaats:''};adresEl.textContent='';clearTimeout(tm);
  if(!/^[1-9][0-9]{3}[A-Z]{2}$/.test(pc)||!hn){adresP=Promise.resolve();return}
  var nr=hn.match(/^\d+/);if(!nr){toonPlaats();adresP=Promise.resolve();return}
  adresP=new Promise(function(klaar){tm=setTimeout(function(){
   fetch('https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?fq=type:adres&rows=1&fl=straatnaam,woonplaatsnaam&q='+encodeURIComponent('postcode:'+pc+' and huisnummer:'+nr[0])).then(function(r){return r.json()}).then(function(j){var d=j&&j.response&&j.response.docs&&j.response.docs[0];
    if(d&&d.woonplaatsnaam){adres={straat:d.straatnaam||'',plaats:d.woonplaatsnaam};adresEl.textContent='✓  '+(adres.straat?adres.straat+' '+hn+', ':'')+adres.plaats;plaatsVeld.hidden=true}else toonPlaats()}).catch(toonPlaats).then(klaar)},300)})}
 f.postcode.addEventListener('input',zoek);f.huisnummer.addEventListener('input',zoek);if(f.postcode.value&&f.huisnummer.value)zoek();
 f.addEventListener('input',function(e){e.target.classList.remove('fout');melding.textContent=''});
 try{f.voornaam.focus({preventScroll:true})}catch(e){}
 f.addEventListener('submit',function(e){e.preventDefault();if(f.website.value)return;knop.disabled=true;
  adresP.then(function(){knop.disabled=false;
   var regels=[['voornaam',function(v){return v}],['achternaam',function(v){return v}],['telefoon',function(v){return v.replace(/\D/g,'').length>=10}],['email',function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)}],['postcode',function(v){return /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(v)}],['huisnummer',function(v){return v}]];
   if(!plaatsVeld.hidden)regels.push(['plaats',function(v){return v}]);
   var ok=true,eerste=null;regels.forEach(function(r){var el=f[r[0]],g=!!r[1](el.value.trim());el.classList.toggle('fout',!g);if(!g){ok=false;if(!eerste)eerste=el}});
   if(!ok){melding.textContent='Controleer de rood gemarkeerde velden.';eerste.focus();return}
   verstuur(f,knop,melding);
  })});
}
function verstuur(f,knop,melding){
 knop.disabled=true;knop.textContent='Bezig met versturen…';bewaar();
 var u=new URLSearchParams(location.search),d=new URLSearchParams(),vn=f.voornaam.value.trim().replace(/\s+/g,' '),an=f.achternaam.value.trim().replace(/\s+/g,' '),pc=f.postcode.value.replace(/\s/g,'').toUpperCase();
 d.append('naam',(vn+' '+an).trim());d.append('voornaam',vn);d.append('achternaam',an);
 d.append('telefoon',f.telefoon.value.trim());d.append('email',f.email.value.trim());
 d.append('postcode',pc.slice(0,4)+' '+pc.slice(4));d.append('huisnummer',f.huisnummer.value.trim());
 d.append('straat',adres.straat);d.append('plaats',adres.plaats||f.plaats.value.trim());d.append('land','NL');
 d.append('vernieuwen',st.vern.join(', '));d.append('woning',st.woning);d.append('start',st.start);d.append('keuzes',samen());
 d.append('bron','Website');d.append('pagina',location.pathname);
 ['utm_source','utm_medium','utm_campaign','utm_content','fbclid'].forEach(function(k){d.append(k,u.get(k)||'')});
 fetch(WEBHOOK,{method:'POST',body:d}).then(function(r){if(!r.ok)throw new Error(r.status);
  st.stap=4;beeld(true);teken();if(window.fbq)fbq('track','Lead');
 }).catch(function(){knop.disabled=false;knop.textContent='Verstuur aanvraag';melding.innerHTML='Versturen lukte niet. Probeer het opnieuw of bel <a href="tel:+31640506451">06 40 50 64 51</a>.'});
}
teken();
})();
