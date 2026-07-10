
/* ===== NÚCLEO DO SISTEMA ===== */
/* ══ MÓDULO: IMPORTAR PDF COM IA ══ */

var _pdfArquivoBase64 = null;
var _pdfDadosExtraidos = [];

function pdfSelecionado(input) {
  var file = input.files[0];
  if (!file) return;

  var info = document.getElementById('pdf-arquivo-info');
  document.getElementById('pdf-nome-arquivo').textContent = file.name;
  document.getElementById('pdf-tamanho-arquivo').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
  info.style.display = 'flex';

  document.getElementById('pdf-resultado').style.display = 'none';

  var reader = new FileReader();
  reader.onload = function(e) {
    _pdfArquivoBase64 = e.target.result.split(',')[1];
    document.getElementById('btn-processar-pdf').disabled = false;
  };
  reader.readAsDataURL(file);
}

function removerPDF() {
  _pdfArquivoBase64 = null;
  document.getElementById('pdf-arquivo-info').style.display = 'none';
  document.getElementById('pdf-file-input').value = '';
  document.getElementById('btn-processar-pdf').disabled = true;
  document.getElementById('pdf-resultado').style.display = 'none';
}

async function processarPDFcomIA() {
  if (!_pdfArquivoBase64) { alert('Selecione um PDF primeiro.'); return; }

  document.getElementById('pdf-status').style.display = 'block';
  document.getElementById('pdf-resultado').style.display = 'none';
  document.getElementById('btn-processar-pdf').disabled = true;
  document.getElementById('pdf-status-texto').textContent = 'Enviando PDF para a IA...';

  try {
    document.getElementById('pdf-status-texto').textContent = 'IA analisando o documento...';

    // Chama a Edge Function (que guarda a chave do Gemini com segurança no servidor)
    var PDF_IA_URL = (window.SUPA_URL || 'https://btolebkapmysbtqpusjs.supabase.co') + '/functions/v1/processar-pdf-ia';
    var session = (await supa.auth.getSession()).data.session;
    var authHeader = session ? session.access_token : window.SUPA_KEY;

    var response = await fetch(PDF_IA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authHeader,
        'apikey': window.SUPA_KEY
      },
      body: JSON.stringify({ pdf_base64: _pdfArquivoBase64 })
    });

    var data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro ao processar o PDF');

    var resultado = data;
    _pdfDadosExtraidos = resultado.culturas || [];

    exibirResultadoPDF(resultado);

  } catch(err) {
    document.getElementById('pdf-status').style.display = 'none';
    document.getElementById('btn-processar-pdf').disabled = false;
    alert('Erro ao processar o PDF: ' + err.message + '\n\nVerifique se o arquivo é um PDF legível.');
    console.error(err);
  }
}

function exibirResultadoPDF(resultado) {
  document.getElementById('pdf-status').style.display = 'none';
  document.getElementById('btn-processar-pdf').disabled = false;

  document.getElementById('pdf-resumo-fonte').innerHTML =
    '<strong>📚 Fonte:</strong> ' + (resultado.fonte || 'Não identificada') + '<br>' +
    '<strong>🗺 Região:</strong> ' + (resultado.regiao || 'Nacional') + '<br>' +
    '<strong>📝 Resumo:</strong> ' + (resultado.resumo || '');

  document.getElementById('pdf-obs-ia').textContent = resultado.observacoes || '';

  var tbody = document.getElementById('pdf-tabela-corpo');
  tbody.innerHTML = '';

  if (!_pdfDadosExtraidos || _pdfDadosExtraidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:20px;color:#999;">Nenhuma cultura encontrada no documento.</td></tr>';
  } else {
    _pdfDadosExtraidos.forEach(function(c, idx) {
      var tr = document.createElement('tr');
      tr.style.background = idx % 2 === 0 ? '#fff' : '#f9f9f9';
      var calcStr = '';
      if (c.calcario_arenoso != null || c.calcario_medio != null || c.calcario_argiloso != null) {
        calcStr = [c.calcario_arenoso, c.calcario_medio, c.calcario_argiloso]
          .map(function(v){ return v != null ? v : '—'; }).join(' / ');
      } else { calcStr = '—'; }

      tr.innerHTML =
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;font-weight:700;color:#1a5c38;white-space:nowrap;">' + (c.nome || '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;">' + (c.n != null ? c.n : '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;">' + (c.p != null ? c.p : '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;">' + (c.k != null ? c.k : '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;">' + (c.ca != null ? c.ca : '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;">' + (c.mg != null ? c.mg : '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;">' + (c.s != null ? c.s : '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;font-size:.74rem;">' + calcStr + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;font-size:.72rem;color:#555;">' + (resultado.fonte || '—') + '</td>' +
        '<td style="padding:7px 10px;border:1px solid #e0e0e0;text-align:center;">' +
          '<button onclick="aplicarUmParametro(' + idx + ')" ' +
          'style="background:#1a5c38;color:#fff;border:none;border-radius:5px;padding:5px 10px;font-size:.74rem;cursor:pointer;font-family:Nunito,sans-serif;white-space:nowrap;">✅ Aplicar</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
  }

  document.getElementById('pdf-resultado').style.display = 'block';
  document.getElementById('pdf-resultado').scrollIntoView({behavior:'smooth'});
}

function aplicarUmParametro(idx) {
  var c = _pdfDadosExtraidos[idx];
  if (!c || !c.nome) return;
  _aplicarCulturaNoSistema(c);
  _mostrarMsgAplicado(
    '<strong>✅ "' + c.nome + '" salva no sistema!</strong><br>' +
    '<span style="font-size:.82rem;">Gravada no banco de dados — continua salva ao fechar ou atualizar a página.</span>',
    true
  );
}

function _mostrarMsgAplicado(html, sucesso) {
  var el = document.getElementById('pdf-aplicado-msg');
  if (!el) return;
  if (sucesso) {
    el.style.background = '#e8f5e9';
    el.style.border = '1px solid #1a7a3c';
    el.style.color = '#1a5c38';
  } else {
    el.style.background = '#fdecea';
    el.style.border = '1px solid #e74c3c';
    el.style.color = '#c0392b';
  }
  el.innerHTML = html;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function aplicarTodosParametros() {
  if (_pdfDadosExtraidos.length === 0) {
    _mostrarMsgAplicado('Nenhum dado para aplicar.', false);
    return;
  }
  var count = 0;
  _pdfDadosExtraidos.forEach(function(c) {
    if (c && c.nome) { _aplicarCulturaNoSistema(c); count++; }
  });
  _mostrarMsgAplicado(
    '<div style="font-size:1.4rem;margin-bottom:4px;">✅</div>' +
    '<strong>' + count + ' cultura(s) salvas no sistema!</strong><br>' +
    '<span style="font-size:.82rem;">Os valores foram gravados no banco de dados e continuarão salvos mesmo se você fechar ou atualizar a página. Já valem para as próximas recomendações.</span>',
    true
  );
}

function _aplicarCulturaNoSistema(c, persistir) {
  var nome = c.nome.toUpperCase().trim();

  // Atualiza _ssTabela (recomendação sem análise de solo)
  if (typeof _ssTabela !== 'undefined') {
    _ssTabela[nome] = {
      n:  c.n  != null ? c.n  : (_ssTabela[nome] ? _ssTabela[nome].n  : 100),
      p:  c.p  != null ? c.p  : (_ssTabela[nome] ? _ssTabela[nome].p  : 80),
      k:  c.k  != null ? c.k  : (_ssTabela[nome] ? _ssTabela[nome].k  : 80),
      ca: c.ca != null ? c.ca : (_ssTabela[nome] ? _ssTabela[nome].ca : 40),
      mg: c.mg != null ? c.mg : (_ssTabela[nome] ? _ssTabela[nome].mg : 20),
      s:  c.s  != null ? c.s  : (_ssTabela[nome] ? _ssTabela[nome].s  : 15),
      b:  c.b  != null ? c.b  : (_ssTabela[nome] ? _ssTabela[nome].b  : 0.5),
      zn: c.zn != null ? c.zn : (_ssTabela[nome] ? _ssTabela[nome].zn : 2),
      cu: c.cu != null ? c.cu : (_ssTabela[nome] ? _ssTabela[nome].cu : 0.5),
      mn: c.mn != null ? c.mn : (_ssTabela[nome] ? _ssTabela[nome].mn : 1),
      fe: c.fe != null ? c.fe : (_ssTabela[nome] ? _ssTabela[nome].fe : 1),
      calcario: {
        arenoso:  c.calcario_arenoso  != null ? c.calcario_arenoso  : (_ssTabela[nome] ? _ssTabela[nome].calcario.arenoso  : 2),
        medio:    c.calcario_medio    != null ? c.calcario_medio    : (_ssTabela[nome] ? _ssTabela[nome].calcario.medio    : 2.5),
        argiloso: c.calcario_argiloso != null ? c.calcario_argiloso : (_ssTabela[nome] ? _ssTabela[nome].calcario.argiloso : 3)
      }
    };
  }

  // Atualiza _rfSoloRef (recomendação com análise de solo)
  if (typeof _rfSoloRef !== 'undefined') {
    var refAtual = _rfSoloRef[nome] || {};
    _rfSoloRef[nome] = Object.assign({}, refAtual, {
      p:  c.p  != null ? c.p  : refAtual.p,
      k:  c.k  != null ? c.k  : refAtual.k,
      ca: c.ca != null ? c.ca : refAtual.ca,
      mg: c.mg != null ? c.mg : refAtual.mg,
      s:  c.s  != null ? c.s  : refAtual.s,
      b:  c.b  != null ? c.b  : refAtual.b,
      zn: c.zn != null ? c.zn : refAtual.zn,
      cu: c.cu != null ? c.cu : refAtual.cu,
      mn: c.mn != null ? c.mn : refAtual.mn,
      fe: c.fe != null ? c.fe : refAtual.fe
    });
  }

  // Atualiza culturasDB (modal Parâmetros de Cultura) se a cultura existir
  if (typeof culturasDB !== 'undefined') {
    var dbIdx = culturasDB.findIndex(function(d){ return d.nome === nome; });
    if(dbIdx >= 0){
      var dbEntry = culturasDB[dbIdx];
      if(c.n  != null) dbEntry.n  = c.n;
      if(c.p  != null) dbEntry.p  = c.p;
      if(c.k  != null) dbEntry.k  = c.k;
      if(c.ca != null) dbEntry.ca = c.ca;
      if(c.mg != null) dbEntry.mg = c.mg;
      if(c.s  != null) dbEntry.s  = c.s;
      if(c.b  != null) dbEntry.b  = c.b;
      if(c.zn != null) dbEntry.zn = c.zn;
      if(c.cu != null) dbEntry.cu = c.cu;
      if(c.mn != null) dbEntry.mn = c.mn;
      if(c.fe != null) dbEntry.fe = c.fe;
      if(c.calcario_arenoso != null) dbEntry.arn = c.calcario_arenoso;
      if(c.calcario_medio   != null) dbEntry.med = c.calcario_medio;
      if(c.calcario_argiloso!= null) dbEntry.arg = c.calcario_argiloso;
    }
  }

  // persistir === false => veio do banco no login (só aplica na memória, não regrava)
  if (persistir !== false) {
    // Grava permanentemente no banco (Supabase)
    _supaSalvarParametroCultura(c);

    // Salva registro no _safeStorage para auditoria
    try {
      var historico = JSON.parse(_safeStorage.getItem('sas_parametros_importados') || '[]');
      historico.push({
        cultura: nome,
        dados: c,
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR')
      });
      _safeStorage.setItem('sas_parametros_importados', JSON.stringify(historico));
    } catch(e) { /* silencia falha de auditoria */ }
  }
}

// Grava (ou atualiza) os parâmetros de uma cultura na tabela parametros_cultura.
async function _supaSalvarParametroCultura(c) {
  if (!window.supa || !c || !c.nome) return;
  function num(v){ return (v === undefined ? null : v); }
  try {
    var row = {
      nome: c.nome.toUpperCase().trim(),
      n: num(c.n), p: num(c.p), k: num(c.k), ca: num(c.ca), mg: num(c.mg), s: num(c.s),
      b: num(c.b), zn: num(c.zn), cu: num(c.cu), mn: num(c.mn), fe: num(c.fe),
      calcario_arenoso: num(c.calcario_arenoso),
      calcario_medio: num(c.calcario_medio),
      calcario_argiloso: num(c.calcario_argiloso),
      observacao: c.observacao || null
    };
    var r = await supa.from('parametros_cultura').upsert(row, { onConflict: 'nome' });
    if (r.error) console.warn('Supabase (salvar parâmetro de cultura):', r.error.message);
  } catch (e) { console.warn('Supabase (parâmetro de cultura):', e); }
}

function limparResultadoPDF() {
  _pdfDadosExtraidos = [];
  _pdfArquivoBase64 = null;
  document.getElementById('pdf-resultado').style.display = 'none';
  document.getElementById('pdf-arquivo-info').style.display = 'none';
  document.getElementById('pdf-file-input').value = '';
  document.getElementById('btn-processar-pdf').disabled = true;
}


/* ══ SAFE STORAGE: wrapper com fallback em memória para ambientes sem localStorage ══ */