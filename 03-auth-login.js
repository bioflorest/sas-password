var _safeStorage = (function(){
  var _mem = {};
  var _hasLS = false;
  try {
    window.localStorage.setItem('__sas_test__','1');
    window.localStorage.removeItem('__sas_test__');
    _hasLS = true;
  } catch(e){ _hasLS = false; }
  return {
    getItem: function(k){
      if(_hasLS){ try{ return window.localStorage.getItem(k); } catch(e){} }
      return _mem[k] !== undefined ? _mem[k] : null;
    },
    setItem: function(k,v){
      if(_hasLS){ try{ window.localStorage.setItem(k,v); return; } catch(e){} }
      _mem[k] = v;
    },
    removeItem: function(k){
      if(_hasLS){ try{ window.localStorage.removeItem(k); return; } catch(e){} }
      delete _mem[k];
    }
  };
})();
/* ══ AUTH SUPABASE ══ */

// Detecta retorno de link de recuperação de senha
(function(){
  var hash = window.location.hash;
  if(hash && hash.includes('type=recovery')){
    window.addEventListener('DOMContentLoaded', function(){
      var intro = document.getElementById('intro-screen');
      if(intro) intro.style.display='none';
      var ls = document.getElementById('login-screen');
      if(ls){ ls.classList.add('visible'); ls.classList.remove('hide'); }
      mostrarNovaSenha();
    });
  }
})();

// Monitora estado de auth
if(window.supa){
  supa.auth.onAuthStateChange(function(event, session){
    if(event === 'PASSWORD_RECOVERY'){
      mostrarNovaSenha();
    }
  });
}

/* ══ RESTAURAR SESSÃO AO ABRIR/ATUALIZAR A PÁGINA ══
   Se já existe uma sessão válida guardada, pula intro + login
   e abre o app direto. A pessoa só volta ao login ao clicar em Sair. */
(function(){
  function _restaurarSessao(){
    if(!window.supa) return;
    // Link de recuperação de senha tem prioridade: não auto-entrar nesse caso
    if(window.location.hash && window.location.hash.indexOf('type=recovery') !== -1) return;
    supa.auth.getSession().then(function(res){
      var session = res && res.data && res.data.session;
      if(session && session.user){
        var intro = document.getElementById('intro-screen');
        if(intro){ intro._exiting = true; intro.style.display = 'none'; }
        var ls = document.getElementById('login-screen');
        if(ls){ ls.classList.remove('visible'); ls.classList.add('hide'); }
        _abrirApp(session.user.email || '');
      }
    }).catch(function(e){ console.warn('Erro ao restaurar sessão:', e); });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', _restaurarSessao);
  } else {
    _restaurarSessao();
  }
})();

function _abrirApp(email){
  document.getElementById('login-screen').classList.add('hide');
  document.getElementById('app').style.display='block';
  var el = document.getElementById('topbar-username');
  if(el) el.textContent = email || '';
  // Carregar dados do Supabase após login
  _carregarDadosSAS();
}

async function doLogin(){
  var u   = document.getElementById('login-user').value.trim();
  var p   = document.getElementById('login-pass').value.trim();
  var err = document.getElementById('login-erro');
  var ok  = document.getElementById('login-ok');
  err.style.display='none';
  ok.style.display='none';
  if(!u || !p){ err.style.display='block'; return; }
  if(!window.supa){
    err.textContent='❌ Erro de conexão. Verifique as credenciais do Supabase.';
    err.style.display='block'; return;
  }
  try {
    var result = await supa.auth.signInWithPassword({ email: u, password: p });
    if(result.error){
      err.style.display='block';
    } else {
      _abrirApp(u);
    }
  } catch(e){
    err.style.display='block';
  }
}

async function doLogout(){
  await supa.auth.signOut();
  document.getElementById('app').style.display='none';
  var ls = document.getElementById('login-screen');
  ls.classList.remove('hide');
  ls.classList.add('visible');
  document.getElementById('login-user').value='';
  document.getElementById('login-pass').value='';
  _mostrarBox('login-box');
}

function mostrarEsqueciSenha(){
  _mostrarBox('esqueci-box');
  document.getElementById('esqueci-email').value='';
  document.getElementById('esqueci-msg').style.display='none';
}

function voltarLogin(){
  _mostrarBox('login-box');
}

function mostrarNovaSenha(){
  _mostrarBox('nova-senha-box');
  document.getElementById('nova-senha-msg').style.display='none';
}

function _mostrarBox(id){
  ['login-box','esqueci-box','nova-senha-box'].forEach(function(bid){
    var el = document.getElementById(bid);
    if(el) el.style.display = (bid===id) ? 'flex' : 'none';
  });
}

async function enviarResetSenha(){
  var email = document.getElementById('esqueci-email').value.trim();
  var msg   = document.getElementById('esqueci-msg');
  msg.style.display='none';
  if(!email){
    msg.style.cssText='display:block;background:rgba(231,76,60,.2);border:1px solid rgba(231,76,60,.4);border-radius:8px;padding:8px 12px;color:#ff6b6b;font-size:.82rem;';
    msg.textContent='❌ Informe seu e-mail.';
    return;
  }
  try {
    var result = await supa.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href
    });
    if(result.error){
      msg.style.cssText='display:block;background:rgba(231,76,60,.2);border:1px solid rgba(231,76,60,.4);border-radius:8px;padding:8px 12px;color:#ff6b6b;font-size:.82rem;';
      msg.textContent='❌ Erro: '+result.error.message;
    } else {
      msg.style.cssText='display:block;background:rgba(46,204,113,.2);border:1px solid rgba(46,204,113,.4);border-radius:8px;padding:8px 12px;color:#00e676;font-size:.82rem;';
      msg.textContent='✅ E-mail enviado! Verifique sua caixa de entrada.';
    }
  } catch(e){
    msg.style.cssText='display:block;background:rgba(231,76,60,.2);border:1px solid rgba(231,76,60,.4);border-radius:8px;padding:8px 12px;color:#ff6b6b;font-size:.82rem;';
    msg.textContent='❌ Erro ao enviar e-mail.';
  }
}

async function salvarNovaSenha(){
  var nova  = document.getElementById('nova-senha-input').value;
  var conf  = document.getElementById('nova-senha-conf').value;
  var msg   = document.getElementById('nova-senha-msg');
  msg.style.display='none';
  if(!nova || nova.length < 6){
    msg.style.cssText='display:block;background:rgba(231,76,60,.2);border:1px solid rgba(231,76,60,.4);border-radius:8px;padding:8px 12px;color:#ff6b6b;font-size:.82rem;';
    msg.textContent='❌ A senha deve ter ao menos 6 caracteres.';
    return;
  }
  if(nova !== conf){
    msg.style.cssText='display:block;background:rgba(231,76,60,.2);border:1px solid rgba(231,76,60,.4);border-radius:8px;padding:8px 12px;color:#ff6b6b;font-size:.82rem;';
    msg.textContent='❌ As senhas não coincidem.';
    return;
  }
  try {
    var result = await supa.auth.updateUser({ password: nova });
    if(result.error){
      msg.style.cssText='display:block;background:rgba(231,76,60,.2);border:1px solid rgba(231,76,60,.4);border-radius:8px;padding:8px 12px;color:#ff6b6b;font-size:.82rem;';
      msg.textContent='❌ Erro: '+result.error.message;
    } else {
      msg.style.cssText='display:block;background:rgba(46,204,113,.2);border:1px solid rgba(46,204,113,.4);border-radius:8px;padding:8px 12px;color:#00e676;font-size:.82rem;';
      msg.textContent='✅ Senha alterada com sucesso! Faça login.';
      setTimeout(function(){ _mostrarBox('login-box'); }, 2500);
    }
  } catch(e){
    msg.style.cssText='display:block;background:rgba(231,76,60,.2);border:1px solid rgba(231,76,60,.4);border-radius:8px;padding:8px 12px;color:#ff6b6b;font-size:.82rem;';
    msg.textContent='❌ Erro ao salvar senha.';
  }
}

/* ══ CARREGAR DADOS DO SUPABASE ══ */
async function _carregarDadosSAS(){
  try {
    // Carregar clientes (colunas reais: nome, cpf, tel, email)
    var resCli = await supa.from('clientes').select('*').order('nome');
    if(resCli.data){
      var clientes = resCli.data.map(function(c){
        return { id: c.id, nome: c.nome || '', cpf: c.cpf || '', tel: c.tel || '', email: c.email || '' };
      });
      _setClientes(clientes);
      _atualizarSelectClientes();
      renderListaClientes();
    }
  } catch(e){ console.warn('Erro ao carregar clientes:', e); }

  try {
    // Carregar técnicos (tabela equipe — colunas: nome, titulo, registro)
    var resTec = await supa.from('equipe').select('*').order('nome');
    if(resTec.data){
      _tecnicos = resTec.data.map(function(t){
        return { id: t.id, nome: t.nome || '', titulo: t.titulo || '', registro: t.registro || '' };
      });
      _salvarTecnicosLS();
      _atualizarSelectTecnicos();
      tecRender();
    }
  } catch(e){ console.warn('Erro ao carregar técnicos:', e); }

  try {
    // Carregar parâmetros de cultura importados (tabela parametros_cultura)
    // e reaplicar nas tabelas do sistema (sem regravar no banco: 2º arg = false)
    var resPar = await supa.from('parametros_cultura').select('*');
    if(resPar.data && resPar.data.length && typeof _aplicarCulturaNoSistema === 'function'){
      resPar.data.forEach(function(row){
        _aplicarCulturaNoSistema(row, false);
      });
      if(typeof renderCulturasDB === 'function'){ try{ renderCulturasDB(); }catch(e){} }
    }
  } catch(e){ console.warn('Erro ao carregar parâmetros de cultura:', e); }
}

/* ══ NAVEGAÇÃO ══ */
function showPage(id, btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  var pg=document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  if(id==='tecnicos') tecRender();
  if(id==='clientes') renderListaClientes();
}

/* ══ ANÁLISE ══ */

// ── Clientes: armazenamento ──