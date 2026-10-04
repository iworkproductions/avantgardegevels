(function(){
var WEBHOOK='https://hook.eu1.make.com/d11l86yufvlnq827fyve9fipe0693gwq';
var vragen=[
 {k:'vernieuwen',q:'Wat wilt u vernieuwen?',multi:true,o:['Gevel','Dak','Kozijnen','Warmtepomp']},
 {k:'woning',q:'Wat voor woning heeft u?',o:['Vrijstaand','Twee-onder-een-kap','Hoekwoning','Bungalow','Boerderij','Anders']},
 {k:'start',q:'Wanneer wilt u starten?',o:['Binnen 3 maanden','Dit jaar','Volgend jaar','Ik oriënteer me']}
];
var g=function(i){return document.getElementById(i)};
var kies=g('kies');if(!kies)return;
var i=0,keuze=[[],[],[]],totaal=4,andersOpen=false;
var stap=g('kiesStap'),balk=g('kiesBalk'),scherm=g('kiesScherm'),vraag=g('kiesVraag'),knoppen=g('kiesKnoppen'),verder=g('kiesVerder'),terug=g('kiesTerug'),form=g('kiesForm'),fout=g('kiesFout'),verstuur=g('kiesVerstuur');
var overgenomen='',over=document.createElement('p');over.className='kies-over';over.hidden=true;vraag.parentNode.insertBefore(over,vraag);
try{if(sessionStorage.getItem('ag-van-atelier')==='1'){sessionStorage.removeItem('ag-van-atelier');
 var c=JSON.parse(localStorage.getItem('ag-config-v12')||'null');
 if(c){var vv=[];if(c.gevel&&c.gevel!=='huidig')vv.push('Gevel');if(c.dak==='nieuw')vv.push('Dak');if(c.kozijnen==='nieuw')vv.push('Kozijnen');if(c.wp)vv.push('Warmtepomp');
  var w={vrijstaand:'Vrijstaand',villa:'Vrijstaand',bungalow:'Bungalow',hoek:'Hoekwoning'}[c.type];
  if(vv.length){keuze[0]=vv;i=1;if(w){keuze[1]=[w];i=2;}overgenomen=[vv.join(', '),w].filter(Boolean).join(' · ');}}}}catch(e){}
function samen(){return keuze.map(function(k){return k.join(', ')}).filter(Boolean).join(' · ')}
function teken(){
 form.hidden=true;scherm.hidden=false;
 var v=vragen[i];
 stap.textContent='Vraag '+(i+1)+' van '+totaal;balk.style.width=(i/totaal*100)+'%';terug.hidden=i===0;
 vraag.textContent=v.q;knoppen.innerHTML='';
 over.hidden=!(overgenomen&&i>0);if(!over.hidden){over.innerHTML='';var s=document.createElement('span');s.textContent='Uit het Gevelatelier: '+overgenomen;var wz=document.createElement('button');wz.type='button';wz.textContent='Wijzig';wz.onclick=function(){overgenomen='';i=0;teken();};over.appendChild(s);over.appendChild(wz);}
 var eigen=i===1&&keuze[1].length&&v.o.indexOf(keuze[1][0])<0;
 v.o.forEach(function(o){var b=document.createElement('button');b.type='button';b.textContent=o;if(keuze[i].indexOf(o)>-1||(o==='Anders'&&(eigen||andersOpen)))b.className='aan';
  b.onclick=function(){
   if(v.multi){var p=keuze[i].indexOf(o);if(p>-1)keuze[i].splice(p,1);else keuze[i].push(o);teken();}
   else if(o==='Anders'){andersOpen=true;teken();var a=g('kiesAnders');if(a)a.focus();}
   else{andersOpen=false;keuze[i]=[o];volgende();}
  };knoppen.appendChild(b);});
 if(i===1&&(andersOpen||eigen)){andersOpen=true;var inp=document.createElement('input');inp.id='kiesAnders';inp.className='kies-anders';inp.placeholder='Bijvoorbeeld rijwoning of herenhuis';inp.maxLength=60;inp.value=eigen?keuze[1][0]:'';inp.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();verder.click();}};knoppen.appendChild(inp);}
 verder.hidden=!(v.multi||(i===1&&andersOpen));verder.textContent='Verder';verder.classList.toggle('leeg',v.multi&&!keuze[i].length);
}
function volgende(){if(i<2){i++;teken();}else gegevens();}
verder.onclick=function(){if(i===1&&andersOpen){var t=(g('kiesAnders').value||'').trim().replace(/\s+/g,' ');if(!t){g('kiesAnders').classList.add('fout');g('kiesAnders').focus();return;}keuze[1]=[t];volgende();return;}if(keuze[i].length)volgende();else verder.textContent='Kies er minstens één';};
terug.onclick=function(){if(!form.hidden){i=2;teken();}else if(i>0){i--;teken();}};
function gegevens(){
 i=3;stap.textContent='Vraag 4 van 4';balk.style.width='75%';terug.hidden=false;
 scherm.hidden=true;form.hidden=false;
 var t=samen();g('kiesSamen').textContent=t?'Uw keuze: '+t:'';
 try{form.voornaam.focus({preventScroll:true});}catch(e){}
}
function check(){
 var ok=true,eerste=null;
 [].forEach.call(form.querySelectorAll('input[required]'),function(el){
  var v=el.value.trim(),goed=v.length>0;
  if(el.name==='email')goed=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  if(el.name==='telefoon')goed=v.replace(/[^0-9]/g,'').length>=10;
  if(el.name==='postcode')goed=/^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(v);
  el.classList.toggle('fout',!goed);if(!goed){ok=false;if(!eerste)eerste=el;}
 });
 if(!ok){fout.textContent='Controleer de rood gemarkeerde velden.';eerste.focus();}
 return ok;
}
var adres={straat:'',plaats:''},zoek=null,adresP=Promise.resolve();
function zoekAdres(){
 var pc=form.postcode.value.replace(/\s/g,'').toUpperCase(),hn=form.huisnummer.value.trim();
 adres={straat:'',plaats:''};g('adresOk').hidden=true;
 if(!/^[1-9][0-9]{3}[A-Z]{2}$/.test(pc)||!hn)return;
 var nr=hn.match(/^\d+/);if(!nr)return toonPlaats();
 clearTimeout(zoek);adresP=new Promise(function(klaar){zoek=setTimeout(function(){
  fetch('https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?fq=type:adres&rows=1&fl=straatnaam,woonplaatsnaam,huisnummer&q='+encodeURIComponent('postcode:'+pc+' and huisnummer:'+nr[0]))
  .then(function(r){return r.json()}).then(function(j){
   var d=j&&j.response&&j.response.docs&&j.response.docs[0];
   if(d&&d.woonplaatsnaam){adres={straat:d.straatnaam||'',plaats:d.woonplaatsnaam};
    g('adresOk').textContent=(adres.straat?adres.straat+' '+hn+', ':'')+adres.plaats;g('adresOk').hidden=false;
    g('plaatsVeld').hidden=true;form.plaats.required=false;}
   else toonPlaats();
  }).catch(toonPlaats).then(klaar);
 },350);});
}
function toonPlaats(){g('plaatsVeld').hidden=false;form.plaats.required=true;}
form.postcode.addEventListener('input',zoekAdres);form.huisnummer.addEventListener('input',zoekAdres);
form.addEventListener('input',function(e){if(e.target.classList.contains('fout'))e.target.classList.remove('fout');fout.textContent='';});
form.addEventListener('submit',function(e){
 e.preventDefault();if(form.website.value)return;
 verstuur.disabled=true;
 adresP.then(function(){verstuur.disabled=false;if(!check())return;verzend();});
});
function verzend(){
 verstuur.disabled=true;verstuur.textContent='Bezig met versturen…';
 var q=new URLSearchParams(location.search),d=new URLSearchParams();
 var vn=form.voornaam.value.trim().replace(/\s+/g,' '),an=form.achternaam.value.trim().replace(/\s+/g,' ');
 d.append('naam',(vn+' '+an).trim());d.append('voornaam',vn);d.append('achternaam',an);d.append('telefoon',form.telefoon.value.trim());d.append('email',form.email.value.trim());
 var pcN=form.postcode.value.replace(/\s/g,'').toUpperCase();d.append('postcode',pcN.slice(0,4)+' '+pcN.slice(4));d.append('huisnummer',form.huisnummer.value.trim());d.append('straat',adres.straat);d.append('plaats',adres.plaats||form.plaats.value.trim());d.append('land','NL');
 vragen.forEach(function(v,n){d.append(v.k,keuze[n].join(', '));});
 d.append('keuzes',samen());d.append('bron','Website');d.append('pagina',location.pathname);
 ['utm_source','utm_medium','utm_campaign','utm_content','fbclid'].forEach(function(k){d.append(k,q.get(k)||'');});
 fetch(WEBHOOK,{method:'POST',body:d}).then(function(r){if(!r.ok)throw new Error('status '+r.status);
  g('dankKop').textContent=(vn?'Dank u, '+vn+'. ':'Dank u. ')+'Uw aanvraag is binnen.';
  form.hidden=true;g('kiesDank').hidden=false;stap.textContent='Verstuurd';balk.style.width='100%';terug.hidden=true;
  if(window.fbq)fbq('track','Lead');
 }).catch(function(){
  verstuur.disabled=false;verstuur.textContent='Verstuur aanvraag';
  fout.innerHTML='Versturen lukte niet. Probeer het opnieuw of bel <a href="tel:+31640506451">06 40 50 64 51</a>.';
 });
}
teken();
})();
