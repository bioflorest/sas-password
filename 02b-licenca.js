/* ══ LICENÇA – integração com a Central de Licenças ══
   Usa o client `supa` (01-config-intro.js) e a tabela `licencas`
   do projeto Supabase do SAS (ver sas-licencas-setup.sql). */

// Lê a licença do usuário logado e calcula dias/status (mesma regra da Central)
async function obterLicenca() {
  try {
    var u = (await supa.auth.getUser()).data.user;
    if (!u) return { erro: 'Sessão não encontrada.' };

    var email = (u.email || '').toLowerCase();
    var r = await supa.from('licencas').select('*').eq('email', email).maybeSingle();
    if (r.error) return { erro: 'Não foi possível verificar a licença. Tente novamente.' };

    if (!r.data) {
      // admin da Central pode entrar no SAS sem ter licença própria
      try { var a = await supa.rpc('is_licenca_admin'); if (a.data === true) return { admin: true }; } catch (e) {}
      return { erro: 'Nenhuma licença encontrada para este e-mail. Entre em contato com o suporte.' };
    }

    var lic = r.data;
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var dias = Math.ceil((new Date(lic.vencimento + 'T00:00:00') - hoje) / 86400000);
    var status = dias <= 0 ? 'vencida' : dias <= 7 ? 'vencendo' : dias <= 30 ? 'atenção' : 'ativa';
    if (lic.ativo === false) status = 'desativada';
    return { lic: lic, dias: dias, status: status };
  } catch (e) {
    return { erro: 'Não foi possível verificar a licença. Tente novamente.' };
  }
}

// Usado no login e ao restaurar sessão: ok = pode entrar
async function verificarLicenca() {
  var r = await obterLicenca();
  if (r.admin) return { ok: true };
  if (r.erro)  return { ok: false, motivo: r.erro };
  if (r.status === 'desativada') return { ok: false, motivo: 'Licença desativada. Entre em contato com o suporte.' };
  if (r.status === 'vencida') {
    var d = new Date(r.lic.vencimento + 'T00:00:00').toLocaleDateString('pt-BR');
    return { ok: false, motivo: 'Licença vencida em ' + d + '. Entre em contato com o suporte para renovar.' };
  }
  return { ok: true, dias: r.dias, aviso: r.dias <= 30 ? 'Atenção: sua licença vence em ' + r.dias + ' dia(s).' : null };
}

// Preenche a página "Licença" (Status da Licença)
async function carregarStatusLicenca() {
  var box = document.getElementById('lic-box');
  if (!box) return;
  box.innerHTML = '<span style="color:#666">Carregando...</span>';
  var r = await obterLicenca();
  if (r.admin) { box.innerHTML = '<span style="color:#1a5c38;font-weight:700">Conta administradora — sem licença própria.</span>'; return; }
  if (r.erro)  { box.innerHTML = '<span style="color:#c0392b">' + r.erro + '</span>'; return; }
  var cores = { 'ativa': '#1a8f4c', 'atenção': '#d68910', 'vencendo': '#e67e22', 'vencida': '#c0392b', 'desativada': '#7f8c8d' };
  var esc = function(s){ return String(s).replace(/[&<>]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]; }); };
  var campo = function(rot, val){
    return '<div style="min-width:130px"><div style="font-size:.72rem;color:#777">' + rot +
           '</div><div style="font-weight:700;font-size:1rem">' + val + '</div></div>';
  };
  var venc = new Date(r.lic.vencimento + 'T00:00:00').toLocaleDateString('pt-BR');
  box.innerHTML =
    campo('Cliente', esc(r.lic.cliente || '—')) +
    campo('Plano', esc(r.lic.plano || '—')) +
    campo('Vencimento', '📅 ' + venc) +
    campo('Dias restantes', '⏳ ' + Math.max(r.dias, 0) + ' dias') +
    campo('Status', '<span style="color:' + cores[r.status] + '">● ' + r.status.toUpperCase() + '</span>');
}
