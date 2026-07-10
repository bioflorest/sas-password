
function mgPreencherTecnico(sel){
  if(!sel.value) return;
  var parts = sel.value.split('|');
  document.getElementById('mg-tecnico').value  = parts[0]||'';
  document.getElementById('mg-titulo').value   = parts[1]||'';
  document.getElementById('mg-registro').value = parts[2]||'';
}

/* ══ MODAL GERAR RECOMENDAÇÃO ══ */
function abrirModalGerar(){
  // Reseta estado
  document.getElementById('mg-etapa-tecnico').style.display = 'block';
  document.getElementById('mg-etapa-acoes').style.display = 'none';
  document.getElementById('mg-etapa-arquivos').style.display = 'none';
  document.getElementById('mg-loading').style.display = 'none';
  document.getElementById('mg-aviso-fmt').style.display = 'none';
  // Limpa campos
  document.getElementById('mg-tecnico').value = '';
  document.getElementById('mg-titulo').value = '';
  document.getElementById('mg-registro').value = '';
  document.getElementById('modal-gerar').style.display = 'flex';
}

function fecharModalGerar(){
  document.getElementById('modal-gerar').style.display = 'none';
}

function mgCarregarDados(){
  var nome = document.getElementById('mg-tecnico').value.trim();
  if(!nome){ alert('Informe o nome do Responsável Técnico.'); return; }
  document.getElementById('mg-etapa-acoes').style.display = 'block';
  document.getElementById('mg-etapa-acoes').scrollIntoView({behavior:'smooth'});
}

function mgRecomendacaoAdubacao(){
  // Mostra loading
  document.getElementById('mg-loading').style.display = 'block';
  document.getElementById('mg-loading-msg').textContent = 'Os dados estão sendo codificados. Quando o processo for finalizado aparecerá uma mensagem informando. Aguarde...';
  document.getElementById('mg-loading-icon').textContent = '⏳';
  // Simula processamento
  setTimeout(function(){
    document.getElementById('mg-loading').style.display = 'none';
    // Mostra modal de sucesso
    document.getElementById('mg-popup').style.display = 'flex';
    document.getElementById('mg-popup-msg').textContent = 'Os dados foram codificados com sucesso! Clique agora em Gerar Arquivos da Recomendação.';
    // Mostra botão Gerar Arquivos
    document.getElementById('mg-btn-gerar-arq').style.display = 'inline-block';
  }, 2200);
}

function mgFecharPopup(){
  document.getElementById('mg-popup').style.display = 'none';
}

function mgGerarArquivos(){
  document.getElementById('mg-loading').style.display = 'block';
  document.getElementById('mg-loading-msg').textContent = 'Gerando arquivos da recomendação...';
  document.getElementById('mg-loading-icon').textContent = '⏳';
  setTimeout(function(){
    document.getElementById('mg-loading').style.display = 'none';
    document.getElementById('mg-popup').style.display = 'flex';
    document.getElementById('mg-popup-msg').textContent = 'Recomendação em formato .doc e .pdf criada com sucesso!';
    document.getElementById('mg-btn-gerar-arq').style.display = 'none';
    document.getElementById('mg-etapa-arquivos').style.display = 'block';
    document.getElementById('mg-aviso-fmt').style.display = 'block';
  }, 1800);
}

function mgMemoriaCalculo(){
  document.getElementById('mg-loading').style.display = 'block';
  document.getElementById('mg-loading-msg').textContent = 'Os dados estão sendo codificados. Quando o processo for finalizado aparecerá uma mensagem informando. Aguarde...';
  document.getElementById('mg-loading-icon').textContent = '⏳';
  setTimeout(function(){
    document.getElementById('mg-loading').style.display = 'none';
    document.getElementById('mg-popup').style.display = 'flex';
    document.getElementById('mg-popup-msg').textContent = 'Os dados foram codificados com sucesso! Clique agora em Gerar Arquivos da Memória de Cálculo.';
    document.getElementById('mg-btn-gerar-mem').style.display = 'block';
  }, 2200);
}

function mgGerarArquivosMem(){
  document.getElementById('mg-loading').style.display = 'block';
  document.getElementById('mg-loading-msg').textContent = 'Gerando arquivos da Memória de Cálculo...';
  document.getElementById('mg-loading-icon').textContent = '⏳';
  setTimeout(function(){
    document.getElementById('mg-loading').style.display = 'none';
    document.getElementById('mg-popup').style.display = 'flex';
    document.getElementById('mg-popup-msg').textContent = 'Memória de cálculo em formato .doc e .pdf criada com sucesso!';
    document.getElementById('mg-btn-gerar-mem').style.display = 'none';
    document.getElementById('mg-etapa-mem').style.display = 'block';
    document.getElementById('mg-aviso-mem').style.display = 'block';
  }, 1800);
}

function mgBaixarMemPdf(){
  var nome = document.getElementById('mg-tecnico').value.trim() || 'Tecnico';
  var cultura = (window._recData && window._recData.cultura) || 'Cultura';
  var calagem = (window._recData && window._recData.calagem) || '';
  var adubacao = (window._recData && window._recData.adubacao) || '';
  var titulo = document.getElementById('mg-titulo').value || '';
  var registro = document.getElementById('mg-registro').value || '';
  var data = new Date().toLocaleDateString('pt-BR');

  var win = window.open('','_blank');
  win.document.write(
    '<html><head><meta charset="utf-8"><title>Memória de Cálculo</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#222;max-width:780px;margin:0 auto;}' +
    'h1{color:#2c5282;font-size:1.2rem;border-bottom:2px solid #2c5282;padding-bottom:8px;}' +
    'h2{color:#1a5c38;font-size:1rem;margin-top:22px;}' +
    'pre{background:#f5f5f5;padding:14px;border-radius:6px;white-space:pre-wrap;font-size:.88rem;}' +
    '.info{background:#e8edf5;padding:12px 16px;border-radius:6px;margin-bottom:18px;font-size:.88rem;}' +
    '.obs{background:#fff8e1;border:1px solid #ffe082;padding:12px 16px;border-radius:6px;font-size:.82rem;margin-top:22px;line-height:1.7;}' +
    '.rodape{margin-top:32px;font-size:.75rem;color:#888;border-top:1px solid #ddd;padding-top:10px;}' +
    '</style></head><body>' +
    '<h1>MEMÓRIA DE CÁLCULO – CALAGEM E ADUBAÇÃO</h1>' +
    '<div class="info">' +
    '<strong>Responsável Técnico:</strong> ' + nome + '<br>' +
    '<strong>Título Profissional:</strong> ' + titulo + '<br>' +
    '<strong>Nº Registro:</strong> ' + registro + '<br>' +
    '<strong>Data:</strong> ' + data + '<br>' +
    '<strong>Cultura:</strong> ' + cultura +
    '</div>' +
    '<h2>Memória de Cálculo: Calagem</h2><pre>' + calagem + '</pre>' +
    '<h2>Memória de Cálculo: Adubação</h2><pre>' + adubacao + '</pre>' +
    '<div class="obs"><strong>Observação sobre a Memória de Cálculo:</strong><br><br>' +
    'Todos os cálculos apresentados, tanto de calagem quanto de adubação são cálculos baseados em ' +
    'referências consagradas como a 5ª edição do Manual de Calagem e Adubação e Nutrição Mineral ' +
    'de Plantas publicado pelo Professor Euriquides Siqueira de Queiroz e colaboradores.</div>' +
    '<div class="rodape">Gerado pelo SAS – Sistema de Análise de Solo · recFerti</div>' +
    '</body></html>'
  );
  setTimeout(function(){ win.print(); }, 400);
}


var DOCX_FUNCTION_URL = 'https://lbjklgqqtemtjwwwmduz.supabase.co/functions/v1/gerar-docx-SAS';

async function _baixarDocx(tipo) {
  var nome     = document.getElementById('mg-tecnico').value.trim() || 'Tecnico';
  var titulo   = document.getElementById('mg-titulo').value || '';
  var registro = document.getElementById('mg-registro').value || '';
  var cultura  = (window._recData && window._recData.cultura) || 'Cultura';
  var calagem  = (window._recData && window._recData.calagem) || '';
  var adubacao = (window._recData && window._recData.adubacao) || '';
  var data     = new Date().toLocaleDateString('pt-BR');

  var loadEl   = document.getElementById('mg-loading');
  var loadMsg  = document.getElementById('mg-loading-msg');
  var loadIcon = document.getElementById('mg-loading-icon');
  if (loadEl) {
    loadEl.style.display = 'block';
    loadMsg.textContent  = 'Gerando documento Word (.docx)... aguarde.';
    loadIcon.textContent = '⏳';
  }

  try {
    var session = (await supa.auth.getSession()).data.session;
    var authHeader = session ? session.access_token : SUPA_KEY;
    var resp = await fetch(DOCX_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authHeader,
        'apikey': SUPA_KEY
      },
      body: JSON.stringify({ tipo: tipo, tecnico: nome, titulo: titulo, registro: registro,
                             cultura: cultura, calagem: calagem, adubacao: adubacao, data: data })
    });
    if (!resp.ok) { var err = await resp.text(); throw new Error('Erro na Edge Function: ' + err); }
    var blob = await resp.blob();
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = (tipo === 'recomendacao'
      ? 'Recomendacao_' : 'MemoriaCalculo_') + cultura.replace(/\s/g,'_') + '.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch(e) {
    alert('Erro ao gerar .docx:\n' + e.message);
    console.error(e);
  } finally {
    if (loadEl) loadEl.style.display = 'none';
  }
}

async function mgBaixarDoc(){
  await _baixarDocx('recomendacao');
}

async function mgBaixarMemDoc(){
  await _baixarDocx('memoria');
}

function mgBaixarPdf(){
  var nome = document.getElementById('mg-tecnico').value.trim() || 'Tecnico';
  var cultura = (window._recData && window._recData.cultura) || 'Cultura';
  var calagem = (window._recData && window._recData.calagem) || '';
  var adubacao = (window._recData && window._recData.adubacao) || '';
  var titulo = document.getElementById('mg-titulo').value || '';
  var registro = document.getElementById('mg-registro').value || '';
  var data = new Date().toLocaleDateString('pt-BR');

  var win = window.open('','_blank');
  win.document.write(
    '<html><head><meta charset="utf-8"><title>Recomendação</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#222;max-width:780px;margin:0 auto;}' +
    'h1{color:#1a5c38;font-size:1.2rem;border-bottom:2px solid #1a5c38;padding-bottom:8px;}' +
    'h2{color:#2c5282;font-size:1rem;margin-top:22px;}' +
    'pre{background:#f5f5f5;padding:14px;border-radius:6px;white-space:pre-wrap;font-size:.88rem;}' +
    '.info{background:#e8f5e9;padding:12px 16px;border-radius:6px;margin-bottom:18px;font-size:.88rem;}' +
    '.rodape{margin-top:32px;font-size:.75rem;color:#888;border-top:1px solid #ddd;padding-top:10px;}' +
    '</style></head><body>' +
    '<h1>RECOMENDAÇÃO DE ADUBAÇÃO E CALAGEM</h1>' +
    '<div class="info">' +
    '<strong>Responsável Técnico:</strong> ' + nome + '<br>' +
    '<strong>Título Profissional:</strong> ' + titulo + '<br>' +
    '<strong>Nº Registro:</strong> ' + registro + '<br>' +
    '<strong>Data:</strong> ' + data + '<br>' +
    '<strong>Cultura:</strong> ' + cultura +
    '</div>' +
    '<h2>Calagem</h2><pre>' + calagem + '</pre>' +
    '<h2>Adubação</h2><pre>' + adubacao + '</pre>' +
    '<div class="rodape">Gerado pelo SAS – Sistema de Análise de Solo · recFerti</div>' +
    '</body></html>'
  );
  setTimeout(function(){ win.print(); }, 400);
}

/* ══ MODAL CLIENTE ══ */