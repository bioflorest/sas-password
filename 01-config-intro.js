/* ===== CHAVES + createClient ===== */
/* ── Chaves protegidas — não editar manualmente ── */
(function(){
  var _xk=[0x5a,0x3f,0x71,0xa2,0x18,0xc4,0x2d,0x9e];
  function _d(arr){ return arr.map(function(v,i){ return String.fromCharCode(v^_xk[i%_xk.length]); }).join(''); }
  window.SUPA_URL = _d([50,75,5,210,107,254,2,177,56,75,30,206,125,166,70,255,42,82,8,209,122,176,92,238,47,76,27,209,54,183,88,238,59,93,16,209,125,234,78,241]);
  window.SUPA_KEY = _d([63,70,59,202,122,131,78,247,21,86,59,235,77,190,100,175,20,86,56,209,81,170,127,171,57,124,56,148,81,175,93,198,12,124,59,155,54,161,84,212,42,92,66,239,113,139,68,212,32,91,41,224,112,157,64,216,32,101,34,235,107,141,67,212,54,101,24,235,46,141,64,212,106,93,67,218,116,157,64,234,50,92,54,147,45,167,31,212,106,92,41,224,41,167,31,238,32,118,24,213,113,167,64,167,41,101,34,235,46,141,64,216,47,93,67,150,113,136,110,212,42,102,41,243,113,139,71,219,105,112,53,239,42,138,105,223,106,114,27,227,107,141,64,200,110,92,50,235,46,137,71,223,111,112,37,235,96,138,71,207,35,114,57,146,54,161,126,217,23,120,65,242,106,169,107,248,43,103,19,243,93,246,21,232,32,13,55,231,71,128,87,168,105,120,65,242,90,146,65,255,0,71,68,201,114,188,105,237]);
})();
const supa = supabase.createClient(SUPA_URL, SUPA_KEY);
window.supa = supa;

/* ===== INTRO/LOGIN ===== */
(function(){
  var intro = document.getElementById('intro-screen');
  if(!intro) return;
  for(var i=0;i<40;i++){
    var p=document.createElement('div');
    p.className='intro-particle';
    var s=Math.random()*3+1;
    p.style.cssText='width:'+s+'px;height:'+s+'px;background:'+(Math.random()>.5?'#00e676':'#2e7d32')+';left:'+Math.random()*100+'%;--drift:'+((Math.random()-.5)*150)+'px;animation-duration:'+(Math.random()*3+4)+'s;animation-delay:'+(Math.random()*5)+'s;';
    intro.appendChild(p);
  }
  window.startLogin = function(){
    if(intro._exiting) return;
    intro._exiting=true;
    intro.classList.add('exit');
    setTimeout(function(){
      intro.style.display='none';
      var ls=document.getElementById('login-screen');
      if(ls){ls.classList.add('visible');ls.classList.remove('hide');}
    },850);
  };
  setTimeout(window.startLogin,4500);
})();