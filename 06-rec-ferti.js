function abrirRecFerti(){
  var el = document.getElementById('modal-recferti');
  el.style.display = 'flex';
  recfertiTipoCultura = '';
  _rfEtapaAtual = 0;
  document.getElementById('recferti-calagem').value = '';
  document.getElementById('recferti-adubacao').value = '';
  document.getElementById('recferti-notas-rodape').style.display = 'none';
  document.getElementById('recferti-gerar-btn').style.display = 'none';
  document.getElementById('btn-cult-temp').style.outline = 'none';
  document.getElementById('btn-cult-perm').style.outline = 'none';
  _rfMostrarEtapa(0);
}

function fecharRecFerti(){
  document.getElementById('modal-recferti').style.display = 'none';
}

/* ── ETAPAS recFerti ────────────────────────────────────── */
function _rfMostrarEtapa(etapa) {
  _rfEtapaAtual = etapa;

  /* Etapa 0: tipo de cultura — sempre visível no corpo do modal */
  /* Oculta ou mostra os painéis conforme a etapa */
  var cultPanel    = document.getElementById('recferti-cult-panel');
  var soloPanel    = document.getElementById('recferti-solo-panel');
  var resultPanel  = document.getElementById('recferti-resultados');

  /* Esconde tudo */
  cultPanel.style.display   = 'none';
  soloPanel.style.display   = 'none';
  resultPanel.style.display = 'none';

  /* Instrução e botões de tipo */
  var instrucao  = document.getElementById('rf-instrucao-tipo');
  var botoesTipo = document.getElementById('rf-btns-tipo');
  if(instrucao)  instrucao.style.display  = etapa === 0 ? 'block' : 'none';
  if(botoesTipo) botoesTipo.style.display = etapa === 0 ? 'flex'  : 'none';

  if(etapa === 1) { cultPanel.style.display  = 'flex'; }
  if(etapa === 2) { cultPanel.style.display  = 'flex'; soloPanel.style.display = 'block'; }
  if(etapa === 3) { cultPanel.style.display  = 'flex'; soloPanel.style.display = 'block'; resultPanel.style.display = 'flex'; setTimeout(function(){ resultPanel.scrollIntoView({behavior:'smooth'}); }, 100); }
}

function voltarRecFerti(){
  if(_rfEtapaAtual <= 0){
    fecharRecFerti();
    return;
  }
  var anterior = _rfEtapaAtual - 1;
  /* Ao voltar para etapa 0, limpa seleção de tipo */
  if(anterior === 0){
    recfertiTipoCultura = '';
    document.getElementById('btn-cult-temp').style.outline = 'none';
    document.getElementById('btn-cult-perm').style.outline = 'none';
    /* limpa select de cultura */
    var sel = document.getElementById('recferti-cultura-select');
    if(sel) sel.value = '';
  }
  /* Ao voltar para etapa 1, limpa resultados */
  if(anterior === 1){
    document.getElementById('recferti-calagem').value  = '';
    document.getElementById('recferti-adubacao').value = '';
  document.getElementById('recferti-notas-rodape').style.display = 'none';
    document.getElementById('recferti-gerar-btn').style.display = 'none';
  }
  /* Ao voltar para etapa 2, só oculta resultados */
  if(anterior === 2){
    document.getElementById('recferti-calagem').value  = '';
    document.getElementById('recferti-adubacao').value = '';
  document.getElementById('recferti-notas-rodape').style.display = 'none';
    document.getElementById('recferti-gerar-btn').style.display = 'none';
    /* scroll de volta para o topo do painel */
    document.getElementById('recferti-solo-panel').scrollIntoView({behavior:'smooth'});
  }
  _rfMostrarEtapa(anterior);
}

function selecionarTipoCultura(tipo){
  recfertiTipoCultura = tipo;
  // Destacar botão ativo
  document.getElementById('btn-cult-temp').style.outline = tipo==='temporaria' ? '3px solid #00e676' : 'none';
  document.getElementById('btn-cult-perm').style.outline = tipo==='permanente' ? '3px solid #00e676' : 'none';

  // Atualizar label
  var label = document.getElementById('recferti-tipo-label');
  label.textContent = tipo==='temporaria' ? 'Cultura Temporária' : 'Cultura Permanente';

  // Atualizar opções do método P conforme tipo de cultura
  var selMetodoP = document.getElementById('solo-metodo-p');
  selMetodoP.innerHTML = '';
  var opcoes = tipo === 'permanente'
    ? ['P Mehlich', 'P Remanescente', 'P Resina']
    : ['P Mehlich', 'P Remanescente', 'P Resina'];
  opcoes.forEach(function(op){
    var o = document.createElement('option');
    o.value = op; o.textContent = op;
    selMetodoP.appendChild(o);
  });

  // Popular select com lista ordenada
  var sel = document.getElementById('recferti-cultura-select');
  var lista = recfertiCulturas[tipo].slice().sort();
  sel.innerHTML = '<option value="">-- Selecione --</option>';
  lista.forEach(function(c){
    var opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });

  document.getElementById('recferti-calagem').value = '';
  document.getElementById('recferti-adubacao').value = '';
  document.getElementById('recferti-notas-rodape').style.display = 'none';
  _rfMostrarEtapa(1);
}

/* ══ VALORES DE REFERÊNCIA DE SOLO POR CULTURA (típicos para análise de solo) ══
   Baseados em EMBRAPA, SBCS Manual 5ª ed., IAC, UFV/UFLA.
   Representam condições medianas encontradas em lavouras brasileiras.
   O agrônomo pode e deve ajustar conforme a análise real do cliente.
═══════════════════════════════════════════════════════════════════════════════ */
var _rfSoloRef = {
  /* ─ CEREAIS ─ */
  'ARROZ'            :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:40, ph:5.0,mo:20,co:12,sb:30,ctc:60,v:50, prod:6000, prnt:90},
  'AVEIA'            :{metodoP:'P Mehlich',textura:'media',   p:10, k:80, ca:2.5, mg:1, s:10, b:0.3,cu:0.8,zn:0.9,mn:3,  fe:35, ph:5.5,mo:25,co:15,sb:35,ctc:65,v:55, prod:4000, prnt:90},
  'CEVADA'           :{metodoP:'P Mehlich',textura:'media',   p:10, k:80, ca:2.5, mg:1, s:10, b:0.3,cu:0.8,zn:0.9,mn:3,  fe:35, ph:5.8,mo:25,co:15,sb:35,ctc:65,v:58, prod:4000, prnt:90},
  'MILHO'            :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:3, mg:1.2, s:12, b:0.4,cu:0.8,zn:1.0,mn:4,  fe:45, ph:5.5,mo:25,co:15,sb:40,ctc:70,v:60, al:0.3, prod:6000, prnt:90},  /* Embrapa Pará 2020 p.257: P<12(média/argilosa)→60kg P2O5; K<80(0-40)→70kg K2O; V2=60% */
  'MILHETO'          :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:40, ph:5.2,mo:20,co:12,sb:30,ctc:60,v:50, prod:3000, prnt:90},
  'SORGO'            :{metodoP:'P Mehlich',textura:'media',   p:10, k:70, ca:2.5, mg:1, s:10, b:0.3,cu:0.8,zn:0.9,mn:3,  fe:40, ph:5.5,mo:22,co:13,sb:35,ctc:65,v:55, prod:5000, prnt:90},
  'TRIGO'            :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:3, mg:1.2, s:12, b:0.4,cu:0.8,zn:1.0,mn:3,  fe:35, ph:6.0,mo:28,co:17,sb:42,ctc:72,v:60, prod:4000, prnt:90},
  'TRITICALE'        :{metodoP:'P Mehlich',textura:'media',   p:10, k:75, ca:2.8, mg:1, s:10, b:0.3,cu:0.8,zn:0.9,mn:3,  fe:35, ph:5.8,mo:25,co:15,sb:38,ctc:68,v:58, prod:3500, prnt:90},
  /* ─ LEGUMINOSAS / OLEAGINOSAS ─ */
  'AMENDOIM'         :{metodoP:'P Mehlich',textura:'arenosa', p:8,  k:60, ca:2.5, mg:0.8,  s:12, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:30, ph:5.5,mo:18,co:11,sb:32,ctc:55,v:58, prod:3000, prnt:90},
  'CANOLA'           :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:3, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.0,mn:3,  fe:35, ph:6.0,mo:25,co:15,sb:40,ctc:70,v:60, prod:2500, prnt:90},
  'ERVILHA'          :{metodoP:'P Mehlich',textura:'media',   p:10, k:70, ca:2.8, mg:1, s:10, b:0.4,cu:0.8,zn:0.9,mn:3,  fe:35, ph:6.0,mo:22,co:13,sb:38,ctc:65,v:60, prod:2000, prnt:90},
  'FEIJÃO'           :{metodoP:'P Mehlich',textura:'media',   p:8,  k:40, ca:2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.8,mn:3,  fe:35, ph:5.5,mo:20,co:12,sb:30,ctc:60,v:50, al:0.3, prod:1500, prnt:90},  /* Embrapa Pará 2020 p.249 Feijão-Caupi: P<8(Baixo med); K<40→90kg K2O; V2=50%; SAD-Al=20% */
  'GIRASSOL'         :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:2.8, mg:1, s:12, b:0.5,cu:0.8,zn:0.9,mn:3,  fe:35, ph:6.0,mo:25,co:15,sb:38,ctc:68,v:58, prod:2500, prnt:90},
  'MAMONA'           :{metodoP:'P Mehlich',textura:'media',   p:10, k:70, ca:2.5, mg:1, s:10, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:40, ph:5.5,mo:20,co:12,sb:35,ctc:65,v:55, prod:2000, prnt:90},
  'SOJA'             :{metodoP:'P Mehlich',textura:'media',   p:8,  k:40, ca:2.5, mg:1, s:12, b:0.4,cu:0.8,zn:1.0,mn:4,  fe:40, ph:5.8,mo:28,co:17,sb:42,ctc:72,v:60, al:0.2, prod:3500, prnt:90},  /* Embrapa Pará 2020 p.261: P<8(Baixo med); K<40→90kg K2O; V2=60%; SAD-Al=10% */
  /* ─ TUBÉRCULOS / RAÍZES ─ */
  'BATATA-DOCE'      :{metodoP:'P Mehlich',textura:'arenosa', p:10, k:80, ca:2, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:35, ph:5.5,mo:18,co:11,sb:28,ctc:55,v:52, prod:15000,prnt:90},
  'BATATA-INGLESA'   :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3, mg:1.2, s:15, b:0.4,cu:0.8,zn:1.0,mn:4,  fe:35, ph:5.5,mo:28,co:17,sb:42,ctc:72,v:58, prod:25000,prnt:90},
  'CENOURA'          :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:2.8, mg:1, s:12, b:0.4,cu:0.8,zn:0.9,mn:3,  fe:35, ph:6.0,mo:25,co:15,sb:38,ctc:68,v:58, prod:30000,prnt:90},
  /* MANDIOCA – Embrapa Pará 2020 (p.253): N=40kg/ha, P solo baixo=0-8mg Mehlich1→100kg P2O5, K solo baixo=0-40mg→120kg K2O; V=50%; pH=5,5; SAD-Al≤25% */
  'MANDIOCA'         :{metodoP:'P Mehlich',textura:'arenosa', p:8,  k:40, ca:1.8, mg:0.6,  s:8,  b:0.2,cu:0.5,zn:0.6,mn:2,  fe:30, ph:5.5,mo:15,co:9, sb:25,ctc:50,v:50, al:0.5, prod:30000,prnt:90},  /* Embrapa Pará 2020 p.253: P<8(Baixo aren); K<40→120kg K2O; V2=50%; SAD-Al=25%; max 2t/ha calcário */
  /* ─ HORTALIÇAS ─ */
  'ALFACE'           :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3.5, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.2,mn:4,  fe:40, ph:6.0,mo:30,co:18,sb:45,ctc:75,v:62, prod:25000,prnt:90},
  'CEBOLA'           :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3.5, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.2,mn:4,  fe:40, ph:6.0,mo:30,co:18,sb:45,ctc:75,v:62, prod:30000,prnt:90},
  'PEPINO'           :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3.5, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.2,mn:4,  fe:40, ph:6.0,mo:28,co:17,sb:42,ctc:72,v:60, prod:40000,prnt:90},
  'PIMENTÃO'         :{metodoP:'P Mehlich',textura:'media',   p:18, k:110,ca:4, mg:1.5, s:18, b:0.5,cu:1.0,zn:1.5,mn:5,  fe:45, ph:6.0,mo:32,co:19,sb:48,ctc:78,v:62, prod:35000,prnt:90},
  'REPOLHO'          :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:4, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.2,mn:4,  fe:40, ph:6.0,mo:30,co:18,sb:45,ctc:75,v:62, prod:50000,prnt:90},
  'TOMATE'           :{metodoP:'P Mehlich',textura:'media',   p:20, k:120,ca:4.5, mg:1.8, s:20, b:0.6,cu:1.0,zn:1.5,mn:5,  fe:50, ph:6.0,mo:35,co:21,sb:52,ctc:82,v:65, prod:60000,prnt:90},
  'BERINJELA'        :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3.8, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.2,mn:4,  fe:42, ph:6.0,mo:28,co:17,sb:42,ctc:72,v:60, prod:30000,prnt:90},
  'BRÓCOLIS'         :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3.8, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.2,mn:4,  fe:40, ph:6.0,mo:28,co:17,sb:42,ctc:72,v:60, prod:12000,prnt:90},
  'COUVE-FLOR'       :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3.8, mg:1.2, s:15, b:0.5,cu:0.8,zn:1.2,mn:4,  fe:40, ph:6.0,mo:28,co:17,sb:42,ctc:72,v:60, prod:15000,prnt:90},
  'QUIABO'           :{metodoP:'P Mehlich',textura:'media',   p:12, k:90, ca:3, mg:1, s:12, b:0.4,cu:0.8,zn:1.0,mn:3,  fe:38, ph:6.0,mo:25,co:15,sb:38,ctc:68,v:58, prod:12000,prnt:90},
  /* ─ INDUSTRIAIS / FIBRAS ─ */
  'ALGODÃO HERBÁCEO' :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:2.8, mg:1, s:12, b:0.5,cu:0.8,zn:1.0,mn:4,  fe:40, ph:5.8,mo:22,co:13,sb:38,ctc:68,v:56, prod:3500, prnt:90},
  'CANA-DE-AÇÚCAR'   :{metodoP:'P Mehlich',textura:'media',   p:10, k:80, ca:2.5, mg:0.8,  s:12, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:40, ph:5.5,mo:20,co:12,sb:32,ctc:62,v:52, prod:80000,prnt:90},
  /* ─ FORRAGEIRAS ─ */
  'BRAQUIÁRIA'       :{metodoP:'P Mehlich',textura:'arenosa', p:5,  k:45, ca:1.5, mg:0.5,  s:8,  b:0.2,cu:0.4,zn:0.5,mn:2,  fe:25, ph:5.0,mo:15,co:9, sb:22,ctc:48,v:46, prod:12000,prnt:90},
  'CAPIM-ELEFANTE'   :{metodoP:'P Mehlich',textura:'media',   p:8,  k:70, ca:2.2, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.7,mn:3,  fe:35, ph:5.5,mo:20,co:12,sb:30,ctc:60,v:50, prod:40000,prnt:90},
  /* ─ FRUTÍFERAS CICLO CURTO ─ */
  'MELANCIA'         :{metodoP:'P Mehlich',textura:'arenosa', p:12, k:80, ca:3, mg:1, s:10, b:0.4,cu:0.6,zn:1.0,mn:3,  fe:35, ph:6.0,mo:20,co:12,sb:38,ctc:65,v:58, prod:30000,prnt:90},
  'MELÃO'            :{metodoP:'P Mehlich',textura:'arenosa', p:12, k:80, ca:3, mg:1, s:10, b:0.4,cu:0.6,zn:1.0,mn:3,  fe:35, ph:6.0,mo:20,co:12,sb:38,ctc:65,v:58, prod:25000,prnt:90},
  'MORANGO'          :{metodoP:'P Mehlich',textura:'media',   p:15, k:90, ca:3.5, mg:1.2, s:12, b:0.4,cu:0.8,zn:1.2,mn:4,  fe:38, ph:5.8,mo:25,co:15,sb:40,ctc:70,v:58, prod:30000,prnt:90},
  /* ─ FRUTÍFERAS PERMANENTES ─ */
  'ABACATE'          :{metodoP:'P Mehlich',textura:'media',   p:12, k:90, ca:3, mg:1.2, s:15, b:0.4,cu:0.8,zn:1.0,mn:4,  fe:45, ph:6.0,mo:25,co:15,sb:42,ctc:72,v:60, prod:15000,prnt:90},
  'ACEROLA'          :{metodoP:'P Mehlich',textura:'arenosa', p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:35, ph:5.5,mo:18,co:11,sb:28,ctc:55,v:52, prod:15000,prnt:90},
  'BANANA'           :{metodoP:'P Mehlich',textura:'media',   p:10, k:120,ca:2.5, mg:1, s:12, b:0.4,cu:0.8,zn:0.9,mn:4,  fe:40, ph:5.5,mo:22,co:13,sb:35,ctc:65,v:54, prod:25000,prnt:90},
  'CAFÉ ARÁBICA'     :{metodoP:'P Mehlich',textura:'media',   p:15, k:80, ca:2.5, mg:1, s:12, b:0.5,cu:1.0,zn:1.2,mn:5,  fe:45, ph:5.5,mo:30,co:18,sb:38,ctc:70,v:55, prod:3000, prnt:90},
  'CAFÉ CONILON'     :{metodoP:'P Mehlich',textura:'media',   p:15, k:85, ca:2.5, mg:1, s:12, b:0.5,cu:1.0,zn:1.2,mn:5,  fe:45, ph:5.5,mo:30,co:18,sb:38,ctc:70,v:55, prod:3500, prnt:90},
  'CAJU'             :{metodoP:'P Mehlich',textura:'arenosa', p:6,  k:55, ca:1.8, mg:0.6,  s:8,  b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:5.5,mo:15,co:9, sb:25,ctc:52,v:48, prod:5000, prnt:90},
  'COCO-DA-BAÍA'     :{metodoP:'P Mehlich',textura:'arenosa', p:8,  k:100,ca:2, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:35, ph:5.5,mo:15,co:9, sb:28,ctc:55,v:50, prod:15000,prnt:90},
  'GOIABA'           :{metodoP:'P Mehlich',textura:'media',   p:10, k:70, ca:2.5, mg:1, s:10, b:0.4,cu:0.8,zn:0.9,mn:3,  fe:38, ph:5.5,mo:20,co:12,sb:35,ctc:62,v:56, prod:20000,prnt:90},
  'LARANJA'          :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:3, mg:1.2, s:12, b:0.5,cu:1.0,zn:1.2,mn:5,  fe:45, ph:6.0,mo:25,co:15,sb:42,ctc:72,v:60, prod:25000,prnt:90},
  'LIMÃO'            :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:2.8, mg:1.2, s:12, b:0.5,cu:1.0,zn:1.2,mn:5,  fe:45, ph:5.8,mo:25,co:15,sb:40,ctc:70,v:58, prod:25000,prnt:90},
  'MANGA'            :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:2.8, mg:1.2, s:12, b:0.5,cu:1.0,zn:1.2,mn:4,  fe:45, ph:5.5,mo:22,co:13,sb:38,ctc:68,v:56, prod:15000,prnt:90},
  'MAMÃO'            :{metodoP:'P Mehlich',textura:'media',   p:15, k:100,ca:3, mg:1.2, s:15, b:0.5,cu:1.0,zn:1.2,mn:4,  fe:45, ph:6.0,mo:25,co:15,sb:42,ctc:72,v:60, prod:60000,prnt:90},
  'MARACUJÁ'         :{metodoP:'P Mehlich',textura:'media',   p:12, k:80, ca:2.8, mg:1, s:12, b:0.5,cu:0.8,zn:1.0,mn:4,  fe:40, ph:5.5,mo:22,co:13,sb:38,ctc:68,v:56, prod:15000,prnt:90},
  'UVA'              :{metodoP:'P Mehlich',textura:'media',   p:15, k:90, ca:3.5, mg:1.5, s:15, b:0.5,cu:1.2,zn:1.2,mn:5,  fe:45, ph:6.0,mo:28,co:17,sb:48,ctc:75,v:65, prod:15000,prnt:90},
  /* CACAU – Embrapa Pará 2020 (p.338 Tab3 polo Transamazônica): N=130kg/ha, P solo 0-10→120kg P2O5, K solo 0-60→140kg K2O; V=60%; pH=5,5 */
  'CACAU'            :{metodoP:'P Mehlich',textura:'argilosa', p:10, k:60, ca:2.8, mg:1.2, s:12, b:0.4,cu:1.0,zn:1.0,mn:4,  fe:45, ph:5.5,mo:30,co:18,sb:38,ctc:70,v:60, prod:2000, prnt:90},
  'ERVA-MATE'        :{metodoP:'P Mehlich',textura:'media',   p:8,  k:55, ca:1.8, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.7,mn:3,  fe:38, ph:4.5,mo:25,co:15,sb:28,ctc:60,v:47, prod:6000, prnt:90},
  /* AÇAÍ – Embrapa Pará 2020 (p.324): V=60%; P solo 0-10→alta dose; K solo 0-40→alta dose; pH recomendado 5,5-6,0 */
  'AÇAÍ'             :{metodoP:'P Mehlich',textura:'argilosa', p:10, k:40, ca:2, mg:0.8,  s:10, b:0.3,cu:0.6,zn:0.7,mn:3,  fe:40, ph:5.5,mo:25,co:15,sb:28,ctc:60,v:60, prod:10000,prnt:90},
  'DENDÊ'            :{metodoP:'P Mehlich',textura:'argilosa', p:8,  k:80, ca:2.2, mg:0.8,  s:12, b:0.3,cu:0.6,zn:0.8,mn:3,  fe:42, ph:5.0,mo:28,co:17,sb:30,ctc:65,v:46, prod:20000,prnt:90},
  /* CUPUAÇU – Embrapa Pará 2020 (p.352): V=50%; P solo 0-10→190g P2O5/pl; K solo 0-40→260g K2O/pl; 180pl/ha */
  'CUPUAÇU'          :{metodoP:'P Mehlich',textura:'argilosa', p:10, k:40, ca:2, mg:0.8,  s:10, b:0.4,cu:0.6,zn:0.8,mn:3,  fe:40, ph:5.5,mo:25,co:15,sb:30,ctc:62,v:50, prod:8000, prnt:90},
  /* PIMENTA-DO-REINO – Embrapa Pará 2020 (p.285): prod N=200g/pl, P solo 0-10→90g P2O5/pl, K solo 0-40→290g K2O/pl; V=60%; pH=5,5 */
  'PIMENTA-DO-REINO' :{metodoP:'P Mehlich',textura:'argilosa', p:10, k:40, ca:2.5, mg:1, s:12, b:0.5,cu:1.0,zn:1.0,mn:4,  fe:45, ph:5.5,mo:28,co:17,sb:35,ctc:68,v:60, prod:2500, prnt:90},
  /* ─ MEDICINAIS ─ */
  'ALECRIM'          :{metodoP:'P Mehlich',textura:'arenosa', p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:6.0,mo:18,co:11,sb:30,ctc:55,v:55, prod:5000, prnt:90},
  'BABOSA'           :{metodoP:'P Mehlich',textura:'arenosa', p:6,  k:50, ca:1.8, mg:0.6,  s:8,  b:0.2,cu:0.4,zn:0.6,mn:2,  fe:25, ph:6.0,mo:15,co:9, sb:28,ctc:52,v:54, prod:30000,prnt:90},
  'CAPIM-LIMÃO'      :{metodoP:'P Mehlich',textura:'arenosa', p:6,  k:55, ca:1.8, mg:0.6,  s:8,  b:0.2,cu:0.4,zn:0.6,mn:2,  fe:28, ph:5.5,mo:15,co:9, sb:26,ctc:52,v:50, prod:15000,prnt:90},
  'CITRONELA'        :{metodoP:'P Mehlich',textura:'arenosa', p:6,  k:55, ca:1.8, mg:0.6,  s:8,  b:0.2,cu:0.4,zn:0.6,mn:2,  fe:28, ph:5.5,mo:15,co:9, sb:26,ctc:52,v:50, prod:12000,prnt:90},
  'LAVANDA'          :{metodoP:'P Mehlich',textura:'arenosa', p:8,  k:60, ca:2.2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:6.5,mo:18,co:11,sb:32,ctc:56,v:58, prod:4000, prnt:90},
  'LOURO'            :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:32, ph:6.0,mo:20,co:12,sb:30,ctc:58,v:52, prod:5000, prnt:90},
  'MELISSA'          :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:6.0,mo:20,co:12,sb:30,ctc:58,v:52, prod:8000, prnt:90},
  'SÁLVIA'           :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2.2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:6.0,mo:18,co:11,sb:30,ctc:56,v:54, prod:5000, prnt:90},
  /* ─ MEDICINAIS TEMPORÁRIAS ─ */
  'CAMOMILA'         :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:6.0,mo:18,co:11,sb:30,ctc:55,v:55, prod:6000, prnt:90},
  'ERVA-DOCE'        :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:6.0,mo:18,co:11,sb:30,ctc:55,v:55, prod:5000, prnt:90},
  'HORTELÃ'          :{metodoP:'P Mehlich',textura:'media',   p:10, k:70, ca:2.5, mg:1, s:10, b:0.4,cu:0.6,zn:0.8,mn:3,  fe:35, ph:6.0,mo:22,co:13,sb:35,ctc:62,v:58, prod:15000,prnt:90},
  'MANJERICÃO'       :{metodoP:'P Mehlich',textura:'media',   p:10, k:70, ca:2.5, mg:1, s:10, b:0.4,cu:0.6,zn:0.8,mn:3,  fe:35, ph:6.0,mo:22,co:13,sb:35,ctc:62,v:58, prod:10000,prnt:90},
  'ORÉGANO'          :{metodoP:'P Mehlich',textura:'media',   p:8,  k:60, ca:2.2, mg:0.8,  s:10, b:0.3,cu:0.5,zn:0.7,mn:2,  fe:30, ph:6.5,mo:18,co:11,sb:32,ctc:56,v:58, prod:5000, prnt:90},
};

/* Valores padrão genéricos para culturas não mapeadas */
var _rfSoloDefault = {
  metodoP:'P Mehlich', textura:'media',
  p:10, k:70, ca:2.5, mg:1.0, s:10,
  b:0.3, cu:0.6, zn:0.8, mn:3, fe:35,
  ph:5.8, mo:22, co:13, sb:35, ctc:65, v:55,
  al:0, prod:10000, prnt:90
};

function _rfPreencherSolo(cultura){
  var ref = _rfSoloRef[cultura.toUpperCase()] || _rfSoloDefault;

  /* Método P */
  var selMetP = document.getElementById('solo-metodo-p');
  for(var i=0; i<selMetP.options.length; i++){
    if(selMetP.options[i].value === ref.metodoP){ selMetP.selectedIndex = i; break; }
  }
  /* Textura */
  var selTex = document.getElementById('solo-textura');
  for(var j=0; j<selTex.options.length; j++){
    if(selTex.options[j].value === ref.textura){ selTex.selectedIndex = j; break; }
  }

  /* Macronutrientes */
  document.getElementById('solo-p').value  = ref.p;
  document.getElementById('solo-k').value  = ref.k;
  document.getElementById('solo-ca').value = ref.ca;
  document.getElementById('solo-mg').value = ref.mg;
  document.getElementById('solo-s').value  = ref.s;

  /* Micronutrientes */
  document.getElementById('solo-b').value  = ref.b;
  document.getElementById('solo-cu').value = ref.cu;
  document.getElementById('solo-zn').value = ref.zn;
  document.getElementById('solo-mn').value = ref.mn;
  document.getElementById('solo-fe').value = ref.fe;

  /* pH e parâmetros */
  document.getElementById('solo-ph').value  = ref.ph;
  document.getElementById('solo-mo').value  = ref.mo;
  document.getElementById('solo-co').value  = ref.co;
  document.getElementById('solo-sb').value  = ref.sb;
  document.getElementById('solo-ctc').value = ref.ctc;
  document.getElementById('solo-v').value   = ref.v;

  /* Al³⁺ trocável — valor de referência 0 (deve ser ajustado conforme laudo real) */
  var alEl = document.getElementById('solo-al');
  if(alEl) alEl.value = (ref.al !== undefined ? ref.al : 0);

  /* Produção e calcário */
  document.getElementById('solo-prod').value = ref.prod;
  document.getElementById('solo-prnt').value = ref.prnt;
}

function confirmarCulturaRecFerti(){
  var sel = document.getElementById('recferti-cultura-select');
  if(!sel.value){ 
    document.getElementById('recferti-solo-panel').style.display = 'none';
    return; 
  }
  /* ✅ Auto-preenche os campos com valores de referência da cultura */
  _rfPreencherSolo(sel.value);
  document.getElementById('recferti-calagem').value = '';
  document.getElementById('recferti-adubacao').value = '';
  document.getElementById('recferti-notas-rodape').style.display = 'none';
  document.getElementById('recferti-gerar-btn').style.display = 'none';
  _rfMostrarEtapa(2);
}

function carregarDadosRecFerti(){
  var cultura = document.getElementById('recferti-cultura-select').value;
  if(!cultura){ alert('Selecione uma cultura primeiro.'); return; }
  /* Reaplica valores de referência (permite resetar caso o usuário tenha editado) */
  _rfPreencherSolo(cultura);
  var ref = _rfSoloRef[cultura.toUpperCase()];
  var msg = ref
    ? '✅ Valores de referência carregados para: ' + cultura + '\n\nOs campos foram preenchidos com dados típicos desta cultura.\nAjuste conforme a análise real do solo do cliente.\n\nAgora clique em Calcular Calagem ou Calcular Adubação.'
    : '✅ Valores padrão carregados para: ' + cultura + '\n\nSem referência específica cadastrada. Ajuste os valores.\n\nAgora clique em Calcular Calagem ou Calcular Adubação.';
  alert(msg);
}

function _getSoloVals(){
  return {
    ph:   parseFloat(document.getElementById('solo-ph').value)  || 0,
    mo:   parseFloat(document.getElementById('solo-mo').value)  || 0,
    p:    parseFloat(document.getElementById('solo-p').value)   || 0,
    k:    parseFloat(document.getElementById('solo-k').value)   || 0,
    ca:   parseFloat(document.getElementById('solo-ca').value)  || 0,
    mg:   parseFloat(document.getElementById('solo-mg').value)  || 0,
    s:    parseFloat(document.getElementById('solo-s').value)   || 0,
    b:    parseFloat(document.getElementById('solo-b').value)   || 0,
    cu:   parseFloat(document.getElementById('solo-cu').value)  || 0,
    zn:   parseFloat(document.getElementById('solo-zn').value)  || 0,
    mn:   parseFloat(document.getElementById('solo-mn').value)  || 0,
    fe:   parseFloat(document.getElementById('solo-fe').value)  || 0,
    co:   parseFloat(document.getElementById('solo-co').value)  || 0,
    sb:   parseFloat(document.getElementById('solo-sb').value)  || 0,
    ctc:  parseFloat(document.getElementById('solo-ctc').value) || 0,
    v:    parseFloat(document.getElementById('solo-v').value)   || 0,
    al:   parseFloat(document.getElementById('solo-al') ? document.getElementById('solo-al').value : 0) || 0,
    prod: parseFloat(document.getElementById('solo-prod').value)|| 0,
    prnt: parseFloat(document.getElementById('solo-prnt').value)|| 90,
  };
  /* Se H+Al informado, recalcula CTC = SB + H+Al (mais preciso que CTC direto) */
  var halEl = document.getElementById('solo-hal');
  if(halEl && halEl.value !== '' && !isNaN(parseFloat(halEl.value))){
    var hal = parseFloat(halEl.value);
    var sbVal = parseFloat(document.getElementById('solo-sb').value) || 0;
    if(hal > 0 && sbVal >= 0){
      vals.ctc = Math.round((sbVal + hal) * 100) / 100;
      document.getElementById('solo-ctc').value = vals.ctc;
    }
  }
  return vals;
}

function calcularCalagem(){
  var cultura = document.getElementById('recferti-cultura-select').value;
  if(!cultura){ alert('Selecione uma cultura.'); return; }
  var d = _getSoloVals();
  if(!d.ph || !d.ctc){ alert('Preencha pelo menos pH do Solo, T (CTC) e V%.'); return; }

  /* ── V2 (saturação por bases alvo) por cultura – Embrapa Pará 2020 ──
     Fontes: tabelas de recomendação de cada cultura no livro.
     Culturas não listadas assumem V2=60% (padrão conservador Amazônia). */
  var _v2Cultura = {
    /* Cereais */
    'ARROZ':50,'MILHO':60,'SORGO':55,'TRIGO':60,'TRITICALE':58,'AVEIA':55,'CEVADA':58,'MILHETO':50,
    /* Leguminosas / oleaginosas */
    'SOJA':60,'FEIJÃO':50,'FEIJÃO-CAUPI':50,'FAVA':50,'AMENDOIM':58,
    'GIRASSOL':58,'CANOLA':60,'MAMONA':55,'ERVILHA':60,'LENTILHA':60,'GRÃO-DE-BICO':60,
    /* Raízes / tubérculos */
    'MANDIOCA':50,'BATATA-INGLESA':55,'BATATA-DOCE':52,'CENOURA':58,
    /* Hortaliças */
    'ALFACE':62,'CEBOLA':62,'PEPINO':60,'PIMENTÃO':62,'REPOLHO':62,'TOMATE':65,
    'BERINJELA':60,'BRÓCOLIS':60,'COUVE-FLOR':60,'QUIABO':58,
    /* Industriais */
    'ALGODÃO HERBÁCEO':56,'CANA-DE-AÇÚCAR':52,
    /* Forrageiras */
    'BRAQUIÁRIA':46,'CAPIM-ELEFANTE':50,'CAPIM-MOMBAÇA':50,'CAPIM-TANZÂNIA':50,
    'PASTAGEM CULTIVADA':46,'GRAMADO ESPORTIVO':50,'GRAMADOS ORNAMENTAIS':50,
    'CROTALÁRIA':50,'FEIJÃO-GUANDU':50,'MUCUNA':50,
    /* Frutíferas */
    'MELANCIA':58,'MELÃO':58,'MORANGO':58,
    'ABACATE':60,'ACEROLA':52,'BANANA':54,'CACAU':60,'CAJU':48,
    'COCO-DA-BAÍA':50,'CUPUAÇU':50,'GOIABA':56,'LARANJA':60,'LIMÃO':58,
    'MAMÃO':60,'MANGA':56,'MARACUJÁ':56,'UVA':65,
    'ABACAXI':55,'AÇAÍ':60,'DENDÊ':46,'ATEMOIA':60,'CAQUI':60,
    'CARAMBOLA':58,'CAJÁ':50,'GRAVIOLA':55,'JACA':55,'LICHIA':58,
    /* Perenes industriais */
    'CAFÉ ARÁBICA':55,'CAFÉ CONILON':55,
    'PIMENTA-DO-REINO':60,'BAUNILHA':55,'CANELA':55,'CARDAMOMO':55,
    'CRAVO-DA-ÍNDIA':55,'NOZ-MOSCADA':55,'PIMENTEIRA-LONGA':58,
    /* Florestais */
    'EUCALIPTO':50,'TECA':50,'MOGNO AFRICANO':50,'PARAPARÁ':50,'PARICÁ':50,
    'CEDRO AUSTRALIANO':50,'ACÁCIA':46,
    /* Medicinais */
    'CAMOMILA':55,'ERVA-DOCE':55,'HORTELÃ':58,'MANJERICÃO':58,'ORÉGANO':55,
    /* Outros */
    'ABACAXÍ':55,'AMARANTO':55,'PAINÇO':50,'QUINOA':58,'TREMOÇO':50,
    'ERVA-MATE':47,'GUARANÁ':55,'ALGODÃO HERBÁCEO':56,'CURAUÁ':50,
    'FUMO':58,'JUTA':50,'LINHO':55,'RAMI':50,'SISAL':50,'GERGELIM':55
  };
  var vAlvo  = _v2Cultura[cultura] !== undefined ? _v2Cultura[cultura] : 60;
  var vAtual = d.v || ((d.sb / d.ctc) * 100);

  /* ── Interpretação do pH – Embrapa Pará 2020, Cap. 4 e Cap. 10 ── */
  var phClass, phCor;
  if(d.ph < 4.5)      { phClass='Muito Ácido';  phCor='⛔'; }
  else if(d.ph < 5.0) { phClass='Ácido';        phCor='🔴'; }
  else if(d.ph < 5.5) { phClass='Med. Ácido';   phCor='🟠'; }
  else if(d.ph < 6.0) { phClass='Pouco Ácido';  phCor='🟡'; }
  else                 { phClass='Adequado';     phCor='🟢'; }

  var txt = phCor + ' pH do Solo: ' + d.ph.toFixed(1) + ' — ' + phClass + '\n';
  txt += '  (Referência: <4,5=Muito Ácido | 4,5–5,0=Ácido | 5,1–5,5=Med.Ácido | 5,6–6,0=Pouco Ácido | >6,0=Adequado)\n\n';

  /* ── Método 1: Saturação por Bases – NC = T × (V2 - V1) / PRNT ── */
  /* Embrapa Pará 2020, Cap. 10, p.128 */
  if(vAtual < vAlvo){
    var nc = (d.ctc * (vAlvo - vAtual) / 100) / (d.prnt / 100);
    nc = Math.max(0, nc);
    txt  = '▸ Método Saturação por Bases (principal):\n';
    txt += '  V2 alvo para ' + cultura + ': ' + vAlvo + '%\n';
    txt += '  V1 atual: ' + vAtual.toFixed(1) + '%\n';
    txt += '  Dose de Calcário Dolomítico: ' + nc.toFixed(2) + ' t/ha\n';
    txt += '  PRNT utilizado: ' + d.prnt + '%\n\n';
  } else {
    txt  = '▸ Método Saturação por Bases:\n';
    txt += '  Solo com V% adequada (' + vAtual.toFixed(0) + '% ≥ ' + vAlvo + '% alvo).\n';
    txt += '  Calagem pelo método V% não necessária para ' + cultura + '.\n\n';
  }

  /* ── Método 2: Neutralização do Al³⁺ – NC = [2×Al + (2 - Ca+Mg)] × f ──
     Embrapa Pará 2020, Cap. 10, p.128
     ATENÇÃO: Ca e Mg devem estar em cmolc/dm³ para esta fórmula.
     Os campos Ca e Mg do formulário são lidos em cmolc/dm³ (padrão laudo Pará). */
  var alTroc  = d.al  || 0;   /* Al³⁺ trocável em cmolc/dm³ */
  var caMg    = (d.ca || 0) + (d.mg || 0); /* Ca+Mg em cmolc/dm³ */
  if(alTroc > 0){
    var f    = 100 / d.prnt;
    var ncAl = Math.max(0, (2 * alTroc + Math.max(0, 2 - caMg)) * f);
    txt += '▸ Método Neutralização do Al³⁺ (complementar):\n';
    txt += '  NC = [2×' + alTroc.toFixed(2) + ' + (2 - ' + caMg.toFixed(2) + ')] × (100/' + d.prnt + ')\n';
    txt += '  Dose de Calcário Dolomítico: ' + ncAl.toFixed(2) + ' t/ha\n';
    txt += '  (Use a MAIOR dose entre os dois métodos)\n\n';
  } else {
    txt += '▸ Método Al³⁺: Al trocável = 0 ou não informado. Método V% suficiente.\n\n';
  }

  txt += 'Aplicar calcário Dolomítico a lanço, incorporar ao solo 20–30 dias antes do plantio.\n';
  txt += 'Fonte: Embrapa Pará 2020, Cap. 10, p.128.';

  /* ── Saturação por Alumínio (m%) – Embrapa Pará 2020, Cap.4 ──
     m% = Al³⁺ / (SB + Al³⁺) × 100
     SAD-Al crítico: Soja=10%, Milho=10%, Mandioca=25%, Feijão=20%, Arroz Terras Altas=20%
     Para a maioria das culturas comerciais, m% > 20% indica toxidez. */
  var _sadAlCritico = {
    'SOJA':10,'MILHO':10,'MILHO (EMBRAPA-PA)':10,'ARROZ':20,'ARROZ TERRAS ALTAS':20,
    'ARROZ IRRIGADO':0,'MANDIOCA':25,'FEIJÃO':20,'FEIJÃO-CAUPI':20,'FAVA':20,
    'AMENDOIM':20,'PASTAGEM CULTIVADA':20,'BRAQUIÁRIA':30,'CAPIM-ELEFANTE':30,
    'SORGO':20,'SORGO GRANÍFERO':20,'SORGO FORRAGEIRO':20
  };
  var sadLimite = _sadAlCritico[cultura] !== undefined ? _sadAlCritico[cultura] : 20;
  var sb = d.sb || 0;
  var mPct = (alTroc + sb) > 0 ? (alTroc / (alTroc + sb)) * 100 : 0;
  txt += '\n\n▸ Saturação por Alumínio (m%):\n';
  txt += '  m% = Al³⁺ / (SB + Al³⁺) × 100 = ' + mPct.toFixed(1) + '%\n';
  if(mPct > sadLimite && sadLimite > 0){
    txt += '  ⚠️ ATENÇÃO: m% = ' + mPct.toFixed(1) + '% > ' + sadLimite + '% (limite SAD-Al para ' + cultura + ')\n';
    txt += '  Solo com toxidez de alumínio! A calagem é indispensável.\n';
    txt += '  Não plante esta cultura sem corrigir o Al³⁺ antes.';
  } else if(sadLimite === 0){
    txt += '  Cultura tolerante (várzea/arroz irrigado) — Al³⁺ geralmente não é limitante em várzea.';
  } else {
    txt += '  m% dentro do tolerado para ' + cultura + ' (limite SAD-Al: ' + sadLimite + '%).';
  }

  document.getElementById('recferti-calagem').value = txt;
  _rfMostrarEtapa(3);
}

function calcularAdubacao(){
  var cultura = document.getElementById('recferti-cultura-select').value;
  if(!cultura){ alert('Selecione uma cultura.'); return; }
  var d = _getSoloVals();

  var textura = document.getElementById('solo-textura').value;
  var metodoP = document.getElementById('solo-metodo-p').value;
  var limP;
  if(metodoP === 'P Remanescente'){
    limP = [10, 20, 30];
  } else if(metodoP === 'P Resina'){
    limP = textura==='arenosa'  ? [6,12,18]  :
           textura==='media'    ? [10,20,30]  :
           textura==='argilosa' ? [15,30,45] : [20,35,50];
  } else {
    // P Mehlich 1 – Embrapa Pará 2020 (Tabela 1, p.62)
    limP = textura==='arenosa'  ? [10, 18, 25] :
           textura==='media'    ? [8,  15, 20] :
           textura==='argilosa' ? [5,  10, 15] : [8, 15, 20];
  }
  var classP = d.p < limP[0] ? 'Muito Baixo' : d.p < limP[1] ? 'Baixo' : d.p < limP[2] ? 'Médio' : 'Alto';
  var doseP  = d.p < limP[0] ? 120 : d.p < limP[1] ? 90 : d.p < limP[2] ? 60 : 30;

  // K Mehlich 1 – Embrapa Pará 2020 (Tabela 2, p.62)
  var classK = d.k <= 40 ? 'Baixo' : d.k <= 60 ? 'Médio' : d.k <= 90 ? 'Alto' : 'Muito Alto';
  var doseK  = d.k <= 40 ? 120 : d.k <= 60 ? 80 : 40;

  var fatorN = d.prod > 0 ? d.prod / 10000 : 3;
  var doseN  = Math.round(Math.min(Math.max(fatorN * (d.mo < 15 ? 35 : d.mo < 30 ? 25 : 18), 30), 400));

  /* ── Ca e Mg – Embrapa Pará 2020 (Tabela 3, p.63) ──
     Ca e Mg inseridos em cmolc/dm³ (padrão laudo Amazônia, extrator KCl 1mol/L)
     Ca+Mg: Baixo ≤2,0 | Médio 2,0-5,0 | Alto >5,0  (cmolc/dm³)
     Mg:    Baixo ≤0,5 | Médio 0,5-1,5 | Alto >1,5  (cmolc/dm³) */
  var caMg = (d.ca || 0) + (d.mg || 0);
  var doseCa, doseMg, classCa, classMg;
  if(caMg <= 2.0){      classCa = 'Baixo'; doseCa = 80; }
  else if(caMg <= 5.0){ classCa = 'Médio'; doseCa = 40; }
  else {                classCa = 'Alto';  doseCa = 0;  }
  if((d.mg||0) <= 0.5){      classMg = 'Baixo'; doseMg = 30; }
  else if((d.mg||0) <= 1.5){ classMg = 'Médio'; doseMg = 15; }
  else {                     classMg = 'Alto';  doseMg = 0;  }

  /* ── Enxofre – Embrapa Pará 2020 (Tabela 3, p.63) ──
     Extrator Ca(H₂PO₄)₂ em ácido acético 2N
     S: Baixo <4,0 | Médio 4,0-10,0 | Alto >10,0  (mg/dm³) */
  var doseS, classS;
  if((d.s||0) < 4.0){       classS = 'Baixo'; doseS = 30; }
  else if((d.s||0) <= 10.0){ classS = 'Médio'; doseS = 15; }
  else {                     classS = 'Alto';  doseS = 0;  }

  // Micronutrientes – Embrapa Pará 2020 (Tabela 4, p.64)
  // B:  Baixo <0,35 | Cu: Baixo <0,70 | Fe: Baixo <18 | Mn: Baixo <5 | Zn: Baixo <0,9
  var doseB  = d.b  < 0.35 ? 2 : 0;
  var doseZn = d.zn < 0.9  ? 3 : 0;
  var doseCu = d.cu < 0.70 ? 1 : 0;
  var doseMn = d.mn < 5    ? 2 : 0;
  var doseFe = d.fe < 18   ? 2 : 0;

  var txt = 'Recomendação com Nutrientes Separados:\n';
  txt += 'Nitrogênio (N): ' + doseN + ' kg/ha - Aplicar em cobertura.\n';
  txt += 'Fósforo (P2O5): ' + doseP + ' kg/ha [P ' + classP + '] - Aplicar no sulco.\n';
  txt += 'Potássio (K2O): ' + doseK + ' kg/ha [K ' + classK + '] - Aplicar em cobertura.\n';
  txt += 'Cálcio (via calcário): ' + doseCa + ' kg/ha [Ca+Mg ' + classCa + ' = ' + caMg.toFixed(2) + ' cmolc/dm³]\n';
  txt += 'Magnésio (via calc. dolomítico): ' + doseMg + ' kg/ha [Mg ' + classMg + ' = ' + (d.mg||0).toFixed(2) + ' cmolc/dm³]\n';
  txt += 'Enxofre (S): ' + doseS + ' kg/ha [S ' + classS + '] - Aplicar em cobertura.\n';
  txt += 'Boro (B): '     + doseB  + ' kg/ha - via foliar ou cobertura.\n';
  txt += 'Zinco (Zn): '   + doseZn + ' kg/ha - Aplicar no sulco.\n';
  txt += 'Cobre (Cu): '   + doseCu + ' kg/ha - via foliar.\n';
  txt += 'Manganês (Mn): '+ doseMn + ' kg/ha - via foliar.\n';
  txt += 'Ferro (Fe): '   + doseFe + ' kg/ha - via foliar.\n';
  txt += '\nFertilizantes Comerciais por Nutriente:\n';
  txt += 'Nitrogênio (N):\n';
  txt += '- Ureia (44% N): '            + (doseN/0.44).toFixed(2) + ' kg/ha\n';
  txt += '- Nitrato de Cálcio (15% N): '+ (doseN/0.15).toFixed(2) + ' kg/ha\n';
  txt += '- Sulfato de Amônio (20% N): '+ (doseN/0.20).toFixed(2) + ' kg/ha\n';
  txt += '- Amiorgan (17% N): '         + (doseN/0.17).toFixed(2) + ' kg/ha\n';
  txt += '\nFósforo (P2O5):\n';
  txt += '- MAP (50% P2O5): '               + (doseP/0.50).toFixed(2) + ' kg/ha\n';
  txt += '- Fosfato Bicálcio (38% P2O5): '  + (doseP/0.38).toFixed(2) + ' kg/ha\n';
  txt += '- Superfosfato Simples (16% P2O5): '+ (doseP/0.16).toFixed(2) + ' kg/ha';

  document.getElementById('recferti-adubacao').value = txt;
  document.getElementById('recferti-notas-rodape').style.display = 'block';
  document.getElementById('recferti-gerar-btn').style.display = 'block';
  _rfMostrarEtapa(3);
}

function gerarRecomendacaoCompleta(){
  var calagem  = document.getElementById('recferti-calagem').value;
  var adubacao = document.getElementById('recferti-adubacao').value;
  var cultura  = document.getElementById('recferti-cultura-select').value;
  if(!calagem && !adubacao){ alert('Calcule a Calagem e a Adubação primeiro.'); return; }
  window._recData = { calagem: calagem, adubacao: adubacao, cultura: cultura };
  abrirModalGerar();
}