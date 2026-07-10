
function ssSelecionarTipo(tipo){
  _ssTipoCultura = tipo;
  document.getElementById('ss-btn-temp').style.outline = tipo === 'temporaria' ? '3px solid #00e676' : 'none';
  document.getElementById('ss-btn-perm').style.outline = tipo === 'permanente'  ? '3px solid #00e676' : 'none';
  document.getElementById('ss-tipo-label').textContent  = tipo === 'temporaria' ? 'Cultura Temporária' : 'Cultura Permanente';

  // Reutiliza a mesma lista de culturas do recFerti (definida abaixo)
  var sel   = document.getElementById('ss-cultura-select');
  var lista = recfertiCulturas[tipo].slice().sort();
  sel.innerHTML = '<option value="">-- Selecione a cultura --</option>';
  lista.forEach(function(c){
    var opt = document.createElement('option');
    opt.value = c; opt.textContent = c; sel.appendChild(opt);
  });

  document.getElementById('ss-cult-panel').style.display     = 'flex';
  document.getElementById('ss-entradas-panel').style.display  = 'none';
  document.getElementById('ss-resultados').style.display      = 'none';
}

function ssConfirmarCultura(){
  var val = document.getElementById('ss-cultura-select').value;
  document.getElementById('ss-entradas-panel').style.display = val ? 'flex' : 'none';
  document.getElementById('ss-resultados').style.display     = 'none';
  document.getElementById('ss-gerar-btn').style.display      = 'none';
}

/* ── Tabela de parâmetros médios por cultura (kg/ha) ─────────────────
   Fontes: EMBRAPA, SBCS Manual 5ª ed., UFV/UFLA.
   Fator de textura e tecnologia são aplicados no cálculo.
──────────────────────────────────────────────────────────────────── */
var _ssTabela = {
  /* ── CEREAIS ── */
  'ARROZ'            :{n:100,p:70, k:70, ca:40, mg:20,s:15,b:0.5,zn:3,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  'AVEIA'            :{n:90, p:60, k:60, ca:40, mg:18,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  'CEVADA'           :{n:100,p:65, k:60, ca:45, mg:20,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  'MILHO'            :{n:110,p:90, k:70, ca:60, mg:25,s:20,b:1.5,zn:3,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},  /* Embrapa Pará 2020 p.257-258: N=30plant+80-100cob; P2O5=90(Baixo); K2O=70(K<40mg); V2=60%; SAD-Al=10% */
  'MILHETO'          :{n:100,p:60, k:60, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  'SORGO'            :{n:120,p:65, k:70, ca:45, mg:20,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  'TRIGO'            :{n:120,p:70, k:60, ca:50, mg:20,s:20,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'TRITICALE'        :{n:110,p:65, k:60, ca:45, mg:18,s:18,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  /* ── LEGUMINOSAS / OLEAGINOSAS ── */
  'AMENDOIM'         :{n:20, p:90, k:60, ca:80, mg:25,s:20,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},  /* Embrapa Pará 2020 p.244-245: n=20 (sem inoculação), p=90, k=60 */
  'CANOLA'           :{n:120,p:80, k:80, ca:50, mg:25,s:30,b:2,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'ERVILHA'          :{n:30, p:80, k:60, ca:60, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'FEIJÃO'           :{n:20, p:80, k:60, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},  /* Embrapa Pará 2020 p.247-249 Feijão-Caupi: N=20kg/ha cobr; P2O5=80(Baixo); K2O=60; V2=50% */
  'FEIJÃO-VAGEM'     :{n:150,p:180,k:150,ca:80, mg:30,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},  /* Embrapa Pará 2020 p.301 */
  'PIMENTEIRAS LOCAIS':{n:150,p:200,k:150,ca:80,mg:30,s:20,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},  /* Embrapa Pará 2020 p.313 */
  'GIRASSOL'         :{n:80, p:80, k:120,ca:60, mg:25,s:20,b:2,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'MAMONA'           :{n:80, p:70, k:80, ca:50, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'SOJA'             :{n:0,  p:100,k:90, ca:80, mg:30,s:25,b:1.5,zn:3,  cu:0.5,mn:1.5,fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},  /* Embrapa Pará 2020 p.260-261: FBN N≤20kg/ha; P2O5=100(Baixo); K2O=90(K<40); V2=60%; SAD-Al=10% */
  /* ── TUBÉRCULOS / RAÍZES ── */
  'BATATA-DOCE'      :{n:80, p:80, k:120,ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'BATATA-INGLESA'   :{n:150,p:150,k:200,ca:60, mg:25,s:20,b:0.5,zn:3,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'CENOURA'          :{n:80, p:100,k:100,ca:50, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  /* MANDIOCA – Embrapa Pará 2020 (p.253): N=40kg/ha cobertura, P2O5=100kg/ha(solo baixo), K2O=120kg/ha; V=50%; SAD-Al=25% */
  'MANDIOCA'         :{n:40,  p:100,k:120,ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* ── HORTALIÇAS ── */
  'ALFACE'           :{n:100,p:100,k:100,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'CEBOLA'           :{n:120,p:100,k:120,ca:60, mg:25,s:20,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'PEPINO'           :{n:100,p:100,k:120,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'PIMENTÃO'         :{n:150,p:120,k:150,ca:80, mg:30,s:20,b:1.5,zn:3,  cu:1,  mn:1.5,fe:1.5,calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'REPOLHO'          :{n:150,p:100,k:120,ca:80, mg:30,s:20,b:2,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'TOMATE'           :{n:200,p:120,k:200,ca:100,mg:40,s:25,b:2,  zn:3,  cu:1,  mn:2,  fe:2,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  /* ── INDUSTRIAIS / FIBRAS ── */
  'ALGODÃO HERBÁCEO' :{n:120,p:80, k:100,ca:60, mg:25,s:20,b:2,  zn:3,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'CANA-DE-AÇÚCAR'   :{n:120,p:70, k:120,ca:60, mg:25,s:30,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  /* ── FORRAGEIRAS ── */
  'BRAQUIÁRIA'       :{n:80, p:60, k:60, ca:40, mg:15,s:15,b:0.5,zn:1.5,cu:0.5,mn:0.5,fe:0.5,calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  'CAPIM-ELEFANTE'   :{n:200,p:60, k:120,ca:50, mg:20,s:20,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,  argiloso:2.5}},
  /* ── FRUTÍFERAS CICLO CURTO ── */
  'MELANCIA'         :{n:100,p:100,k:120,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'MELÃO'            :{n:100,p:100,k:120,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'MORANGO'          :{n:100,p:100,k:120,ca:80, mg:30,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  /* ── FRUTÍFERAS PERMANENTES ── */
  'ABACATE'          :{n:250,p:80, k:300,ca:100,mg:40,s:20,b:2,  zn:3,  cu:0.8,mn:2,  fe:3,  calcario:{arenoso:2,  medio:3,   argiloso:4}},
  'ACEROLA'          :{n:120,p:80, k:120,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'BANANA'           :{n:180,p:60, k:300,ca:60, mg:30,s:20,b:1,  zn:2,  cu:1,  mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  'CAFÉ ARÁBICA'     :{n:200,p:80, k:180,ca:80, mg:40,s:20,b:1.5,zn:3,  cu:1,  mn:2,  fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'CAFÉ CONILON'     :{n:220,p:90, k:200,ca:80, mg:40,s:20,b:1.5,zn:3,  cu:1,  mn:2,  fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'CAJU'             :{n:100,p:80, k:100,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'COCO-DA-BAÍA'     :{n:150,p:80, k:250,ca:60, mg:30,s:20,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'GOIABA'           :{n:120,p:80, k:140,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'LARANJA'          :{n:200,p:80, k:200,ca:80, mg:40,s:20,b:1.5,zn:3,  cu:1,  mn:2,  fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'LIMÃO'            :{n:180,p:80, k:180,ca:80, mg:35,s:20,b:1.5,zn:3,  cu:1,  mn:2,  fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'MANGA'            :{n:150,p:80, k:150,ca:80, mg:40,s:20,b:1.5,zn:3,  cu:1,  mn:1.5,fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'MAMÃO'            :{n:180,p:100,k:200,ca:80, mg:35,s:20,b:1.5,zn:3,  cu:1,  mn:1.5,fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'MARACUJÁ'         :{n:150,p:80, k:180,ca:60, mg:30,s:20,b:1.5,zn:3,  cu:1,  mn:1.5,fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'UVA'              :{n:120,p:80, k:150,ca:80, mg:35,s:20,b:1.5,zn:3,  cu:1,  mn:2,  fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* ── CAFÉ / BEBIDAS ── */
  /* CACAU – Embrapa Pará 2020 (p.338): fase produção N=130kg/ha, P2O5=120kg/ha, K2O=140kg/ha; V=60%; pH 5,5 */
  'CACAU'            :{n:130,p:120,k:140,ca:80, mg:40,s:20,b:1,  zn:3,  cu:1,  mn:1.5,fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'ERVA-MATE'        :{n:80, p:60, k:80, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* ── OLEAGINOSAS / FRUTÍFERAS AMAZÔNICAS ── */
  /* AÇAÍ – Embrapa Pará 2020 (p.324): 5º ano N=120g/touceira, P2O5~250g, K2O~300g; V=60%; Mehlich 1 */
  'AÇAÍ'             :{n:120,p:100,k:150,ca:60, mg:30,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'DENDÊ'            :{n:150,p:80, k:200,ca:60, mg:30,s:20,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* PIMENTA-DO-REINO – Embrapa Pará 2020 (p.285): prod N=200g/pl, P2O5=90g/pl, K2O=290g/pl; V=60% */
  'PIMENTA-DO-REINO' :{n:200,p:90, k:290,ca:80, mg:40,s:20,b:1.5,zn:3,  cu:1,  mn:2,  fe:2,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* CUPUAÇU – Embrapa Pará 2020 (p.352): 7º ano+ N=190g/pl, P2O5=190g/pl, K2O=260g/pl; V=50% */
  'CUPUAÇU'          :{n:190,p:190,k:260,ca:60, mg:30,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* MANDIOCA – Embrapa Pará 2020 (p.253): N=40kg/ha, P2O5=100kg/ha(baixo P), K2O=120kg/ha; V=50% */
  'MANDIOCA'         :{n:40,  p:100,k:120,ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* ── CULTURAS ADICIONADAS DO PDF (16 FALTANTES) ── */
  /* ARROZ TERRAS ALTAS – Embrapa Pará 2020 (p.235): N=50, P2O5=80(P 0-5,argiloso), K2O=60(K 0-40); V2=50% */
  'ARROZ TERRAS ALTAS'        :{n:50, p:80, k:60, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},  /* Embrapa Pará 2020 p.235-237: N=40-60kg/ha; P2O5=80(Baixo argiloso 0-5mg); K2O=60(K<40); V2=50%; SAD-Al=20% */
  /* ABÓBORA – Embrapa Pará 2020 (p.303): mesma tabela de melancia; N=90, P2O5=90(P 0-10), K2O=130(K 0-40); V2=70% */
  'ABÓBORA'                   :{n:90, p:90, k:130,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  /* PASTAGEM CULTIVADA – Embrapa Pará 2020 (p.383): médio nível; N=100, P2O5=80(P baixo,argiloso), K2O=40(K baixo); V2=50-60% intensivo */
  'PASTAGEM CULTIVADA'        :{n:100,p:80, k:40, ca:40, mg:20,s:15,b:0.5,zn:1.5,cu:0.3,mn:0.5,fe:0.5,calcario:{arenoso:1,  medio:1.5, argiloso:2}},
  /* ARROZ IRRIGADO – Embrapa Pará 2020 (p.239): N=90, P2O5=60(P 0-3), K2O=80(K 0-30); V2=50% */
  'ARROZ IRRIGADO'            :{n:90, p:60, k:80, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},  /* Embrapa Pará 2020 p.239-241: N=90kg/ha; P2O5=60(P<3mg); K2O=80(K<30); V2=50%; várzea geral. disp. calagem */
  /* SORGO – Embrapa Pará 2020 (p.263): granífero N total=70, P2O5=80(P 0-10), K2O=60(K 0-40); V2=60% */
  'SORGO GRANÍFERO'           :{n:70, p:80, k:60, ca:45, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'SORGO FORRAGEIRO'          :{n:100,p:100,k:80, ca:45, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* MELÃO (EMBRAPA-PA) – Embrapa Pará 2020 (p.307): N=200, P2O5=200(P 0-10), K2O=400(K 0-40); V2=70% */
  'MELÃO (EMBRAPA-PA)'        :{n:200,p:200,k:400,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  /* TOMATE RASTEIRO – Embrapa Pará 2020 (p.317): doses por planta; V2=70-80% */
  'TOMATE RASTEIRO'           :{n:150,p:225,k:300,ca:80, mg:30,s:20,b:2,  zn:3,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:2,  medio:2.5, argiloso:3}},
  /* COQUEIRO – Embrapa Pará 2020 (p.347): V2=50%; adubação foliar */
  'COQUEIRO'                  :{n:225,p:100,k:900,ca:80, mg:60,s:20,b:3,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* PARAPARÁ – Embrapa Pará 2020 (p.409): V2=50% */
  'PARAPARÁ'                  :{n:50, p:80, k:20, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* PARICÁ – Embrapa Pará 2020 (p.413): V2=50% */
  'PARICÁ'                    :{n:50, p:80, k:20, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* CURAUÁ – Embrapa Pará 2020 (p.273): V2=60%; estimado */
  'CURAUÁ'                    :{n:60, p:60, k:80, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.3,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* PIMENTEIRA-LONGA – Embrapa Pará 2020 (p.287): V2=50% */
  'PIMENTEIRA-LONGA'          :{n:100,p:80, k:120,ca:60, mg:30,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* GRAMADOS ORNAMENTAIS – Embrapa Pará 2020 (p.391): V2=60% */
  'GRAMADOS ORNAMENTAIS'      :{n:50, p:140,k:100,ca:50, mg:20,s:15,b:0.5,zn:1.5,cu:0.3,mn:0.5,fe:0.5,calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* GRAMADO ESPORTIVO – Embrapa Pará 2020 (p.393): formação */
  'GRAMADO ESPORTIVO'         :{n:350,p:180,k:210,ca:50, mg:20,s:15,b:0.5,zn:1.5,cu:0.3,mn:0.5,fe:0.5,calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  /* ORNAMENTAIS TROPICAIS – Embrapa Pará 2020 (p.373-382): V2=60%; doses convertidas para kg/ha */
  'ALPÍNIA'                   :{n:400,p:155,k:555,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'BASTÃO-DO-IMPERADOR'       :{n:111,p:78, k:333,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'HELICÔNIA PORTE ALTO'      :{n:113,p:44, k:188,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'HELICÔNIA PORTE BAIXO/MÉDIO':{n:1500,p:700,k:2000,ca:60,mg:25,s:15,b:1,zn:2, cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
  'GENGIBRE ORNAMENTAL'       :{n:250,p:117,k:500,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,  fe:1,  calcario:{arenoso:1.5,medio:2,   argiloso:2.5}},
};

/* Parâmetros padrão para culturas não mapeadas */
var _ssDefault = {n:100,p:80,k:80,ca:60,mg:25,s:15,b:1,zn:2,cu:0.5,mn:1,fe:1,
  calcario:{arenoso:2,medio:2.5,argiloso:3}};

function _ssGetParams(cultura){
  var p = _ssTabela[cultura.toUpperCase()] || _ssDefault;
  /* Garante que prodRef esteja disponível para o fator de produtividade */
  if(!p.prodRef && _rfSoloRef[cultura.toUpperCase()]){
    p = Object.assign({prodRef: _rfSoloRef[cultura.toUpperCase()].prod}, p);
  }
  return p;
}

function ssCalcular(){
  var cultura    = document.getElementById('ss-cultura-select').value;
  var textura    = document.getElementById('ss-textura').value;
  var tecnologia = document.getElementById('ss-tecnologia').value;
  var prod       = parseFloat(document.getElementById('ss-prod').value);
  var area       = parseFloat(document.getElementById('ss-area').value);

  if(!cultura)           { alert('Selecione uma cultura.');            return; }
  if(!prod || prod <= 0) { alert('Informe a produtividade esperada.'); return; }
  if(!area || area <= 0) { alert('Informe a área em hectares.');       return; }

  var p = _ssGetParams(cultura);

  /* ── Fator tecnologia ── */
  var fatTec = tecnologia === 'alta' ? 1.25 : tecnologia === 'baixa' ? 0.75 : 1.0;

  /* ── Fator textura (afeta P e K) ── */
  var fatTexPK = textura === 'arenosa' ? 1.15 : (textura === 'argilosa' || textura === 'muito_argilosa') ? 0.90 : 1.0;

  /* ── Fator produtividade sobre N — usa prodRef da tabela da cultura ── */
  var prodRef = (p && p.prodRef) ? p.prodRef : (p && p.prod ? p.prod : 5000);
  if(!prodRef || prodRef <= 0) prodRef = 5000;
  var fatProd  = Math.max(0.5, Math.min(2.0, prod / prodRef));

  /* ── Doses calculadas (kg/ha) ── */
  var doseN  = Math.round(p.n  * fatTec * fatProd);
  var doseP  = Math.round(p.p  * fatTec * fatTexPK);
  var doseK  = Math.round(p.k  * fatTec * fatTexPK);
  var doseCa = Math.round(p.ca * fatTec);
  var doseMg = Math.round(p.mg * fatTec);
  var doseS  = Math.round(p.s  * fatTec);
  var doseB  = p.b;
  var doseZn = p.zn;
  var doseCu = p.cu;
  var doseMn = p.mn;
  var doseFe = p.fe;

  /* ── Calcário ── */
  var texKey  = textura === 'arenosa' ? 'arenoso' : (textura === 'argilosa' || textura === 'muito_argilosa') ? 'argiloso' : 'medio';
  var calcHa  = p.calcario[texKey];
  var calcTotal = (calcHa * area).toFixed(2);

  /* ── SAÍDA 1: NPK por hectare ── */
  var txtHa  = '====  RECOMENDAÇÃO – ' + cultura + '  ====\n';
  txtHa += 'Tecnologia: ' + (tecnologia === 'alta' ? 'Alta' : tecnologia === 'baixa' ? 'Baixa' : 'Média') + '   |   ';
  txtHa += 'Textura: ' + (textura === 'arenosa' ? 'Arenosa' : textura === 'media' ? 'Média' : textura === 'argilosa' ? 'Argilosa' : 'Muito Argilosa') + '\n';
  txtHa += 'Produtividade esperada: ' + prod.toLocaleString('pt-BR') + ' kg/ha\n\n';
  txtHa += 'Macronutrientes Primários:\n';
  txtHa += '  Nitrogênio  (N)   : ' + doseN  + ' kg/ha\n';
  txtHa += '  Fósforo     (P2O5): ' + doseP  + ' kg/ha\n';
  txtHa += '  Potássio    (K2O) : ' + doseK  + ' kg/ha\n';
  txtHa += '\nMacronutrientes Secundários:\n';
  txtHa += '  Cálcio      (Ca)  : ' + doseCa + ' kg/ha\n';
  txtHa += '  Magnésio    (Mg)  : ' + doseMg + ' kg/ha\n';
  txtHa += '  Enxofre     (S)   : ' + doseS  + ' kg/ha\n';
  txtHa += '\nMicronutrientes:\n';
  txtHa += '  Boro        (B)   : ' + doseB  + ' kg/ha\n';
  txtHa += '  Zinco       (Zn)  : ' + doseZn + ' kg/ha\n';
  txtHa += '  Cobre       (Cu)  : ' + doseCu + ' kg/ha\n';
  txtHa += '  Manganês    (Mn)  : ' + doseMn + ' kg/ha\n';
  txtHa += '  Ferro       (Fe)  : ' + doseFe + ' kg/ha\n';
  txtHa += '\nCalagem:\n';
  txtHa += '  Calcário Dolomítico: ' + calcHa + ' t/ha';

  /* ── SAÍDA 2: Total da área ── */
  var txtTotal  = '====  TOTAL PARA ' + area.toLocaleString('pt-BR') + ' ha  ====\n\n';
  txtTotal += 'Nitrogênio  (N)   : ' + (doseN  * area).toFixed(1) + ' kg\n';
  txtTotal += 'Fósforo     (P2O5): ' + (doseP  * area).toFixed(1) + ' kg\n';
  txtTotal += 'Potássio    (K2O) : ' + (doseK  * area).toFixed(1) + ' kg\n';
  txtTotal += 'Cálcio      (Ca)  : ' + (doseCa * area).toFixed(1) + ' kg\n';
  txtTotal += 'Magnésio    (Mg)  : ' + (doseMg * area).toFixed(1) + ' kg\n';
  txtTotal += 'Enxofre     (S)   : ' + (doseS  * area).toFixed(1) + ' kg\n';
  txtTotal += 'Boro        (B)   : ' + (doseB  * area).toFixed(1) + ' kg\n';
  txtTotal += 'Zinco       (Zn)  : ' + (doseZn * area).toFixed(1) + ' kg\n';
  txtTotal += 'Calcário Dolomítico: ' + calcTotal + ' t';

  /* ── SAÍDA 3: Fórmulas comerciais ── */
  var txtForm  = '====  FERTILIZANTES COMERCIAIS (por ha)  ====\n\n';
  txtForm += 'Fontes de Nitrogênio (N = ' + doseN + ' kg/ha):\n';
  txtForm += '  Ureia           (44% N) : ' + (doseN/0.44).toFixed(1) + ' kg/ha\n';
  txtForm += '  Sulfato de Amônio(20% N): ' + (doseN/0.20).toFixed(1) + ' kg/ha\n';
  txtForm += '  Nitrato de Cálcio(15% N): ' + (doseN/0.15).toFixed(1) + ' kg/ha\n';
  txtForm += '\nFontes de Fósforo (P2O5 = ' + doseP + ' kg/ha):\n';
  txtForm += '  MAP             (50%P2O5): ' + (doseP/0.50).toFixed(1) + ' kg/ha\n';
  txtForm += '  Superf. Simples (16%P2O5): ' + (doseP/0.16).toFixed(1) + ' kg/ha\n';
  txtForm += '  Superf. Triplo  (45%P2O5): ' + (doseP/0.45).toFixed(1) + ' kg/ha\n';
  txtForm += '\nFontes de Potássio (K2O = ' + doseK + ' kg/ha):\n';
  txtForm += '  KCl – Cloreto Pot.(58%K2O): ' + (doseK/0.58).toFixed(1) + ' kg/ha\n';
  txtForm += '  Sulfato de Pot.  (48%K2O): '  + (doseK/0.48).toFixed(1) + ' kg/ha';

  /* ── SAÍDA 4: Observações técnicas ── */
  var nomeTipo = _ssTipoCultura === 'permanente' ? 'cultura perene' : 'cultura anual';
  var nomeTec  = tecnologia === 'alta' ? 'alta tecnologia (irrigado/tecnificado)' : tecnologia === 'baixa' ? 'baixa tecnologia (subsistência)' : 'média tecnologia (semi-tecnificado)';
  var nomeTex  = textura === 'arenosa' ? 'solo arenoso' : textura === 'media' ? 'solo de textura média' : textura === 'argilosa' ? 'solo argiloso' : 'solo muito argiloso';
  var txtObs  = 'IMPORTANTE: Esta recomendação foi gerada SEM análise de solo,\n';
  txtObs += 'baseada em parâmetros médios para ' + nomeTipo + ',\n';
  txtObs += nomeTex + ' e nível de ' + nomeTec + '.\n\n';
  txtObs += '• Aplicar calcário a lanço 30–60 dias antes do plantio;\n';
  txtObs += '• Parcelar N: 1/3 no plantio + 2/3 em cobertura;\n';
  txtObs += '• Micronutrientes: aplicar via foliar ou sulco conforme disponibilidade;\n';
  txtObs += '• Recomenda-se análise de solo para maior precisão;\n';
  txtObs += '• Fontes: EMBRAPA / SBCS Manual 5ª Ed. / UFV / UFLA.';

  /* ── Exibe resultados ── */
  document.getElementById('ss-result-ha').value       = txtHa;
  document.getElementById('ss-result-total').value    = txtTotal;
  document.getElementById('ss-result-formulas').value = txtForm;
  document.getElementById('ss-result-obs').value      = txtObs;
  document.getElementById('ss-resultados').style.display = 'flex';
  document.getElementById('ss-gerar-btn').style.display  = 'block';
  document.getElementById('ss-resultados').scrollIntoView({behavior:'smooth'});

  /* Guarda para geração de documento */
  window._ssRecData = {
    cultura: cultura, area: area, prod: prod,
    textura: textura, tecnologia: tecnologia, tipo: _ssTipoCultura,
    ha: txtHa, total: txtTotal, formulas: txtForm, obs: txtObs
  };
}

function ssGerarRecomendacao(){
  if(!window._ssRecData){ alert('Calcule a adubação primeiro.'); return; }
  var d = window._ssRecData;
  /* Empacota no formato esperado pelo modal-gerar existente */
  window._recData = {
    cultura:  d.cultura,
    calagem:  'Calcário Dolomítico conforme detalhado na recomendação abaixo.',
    adubacao: d.ha + '\n\n' + d.total + '\n\n' + d.formulas + '\n\n' + d.obs
  };
  abrirModalGerar();
}

/* ══ RECFERTI ══ */
var recfertiTipoCultura = '';

var recfertiCulturas = {
  temporaria: [
    /* Cereais */
    'ARROZ','ARROZ IRRIGADO','ARROZ TERRAS ALTAS','AVEIA','CENTEIO','CEVADA','MILHO','MILHETO','SORGO','SORGO GRANÍFERO','SORGO FORRAGEIRO','TRIGO','TRITICALE',
    /* Leguminosas e Oleaginosas */
    'AMENDOIM','CANOLA','ERVILHA','FEIJÃO','FEIJÃO-CAUPI','FAVA','GERGELIM','GIRASSOL','GRÃO-DE-BICO','LENTILHA','MAMONA','SOJA',
    /* Tubérculos e Raízes */
    'BATATA-DOCE','BATATA-INGLESA','BETERRABA','CARÁ','CENOURA','GENGIBRE','INHAME','MANDIOCA','MANDIOQUINHA-SALSA','NABO','RABANETE',
    /* Hortaliças */
    'ABÓBORA','ABOBRINHA','ACELGA','AGRIÃO','ALFACE','FEIJÃO-VAGEM','PIMENTEIRAS LOCAIS','ALHO','ALMEIRÃO','BERINJELA','BRÓCOLIS','CEBOLA','CEBOLINHA','CHICÓRIA','CHUCHU','COENTRO','COUVE','COUVE-FLOR','ESPINAFRE','JILÓ','MAXIXE','PEPINO','PIMENTA','PIMENTÃO','QUIABO','REPOLHO','RÚCULA','SALSA','SALSÃO','TOMATE','TOMATE RASTEIRO','VAGEM',
    /* Fibras e Industriais */
    'ALGODÃO HERBÁCEO','CANA-DE-AÇÚCAR','CURAUÁ','FUMO','JUTA','LINHO','RAMI','SISAL',
    /* Forrageiras, Cobertura e Gramados */
    'BRAQUIÁRIA','CAPIM-ELEFANTE','CAPIM-MOMBAÇA','CAPIM-TANZÂNIA','CROTALÁRIA','FEIJÃO-GUANDU','GRAMADOS ORNAMENTAIS','GRAMADO ESPORTIVO','MUCUNA','PASTAGEM CULTIVADA',
    /* Frutíferas de Ciclo Curto */
    'MELANCIA','MELÃO','MELÃO (EMBRAPA-PA)','MORANGO',
    /* Medicinais, Aromáticas e Condimentares */
    'CAMOMILA','ERVA-DOCE','HORTELÃ','MANJERICÃO','ORÉGANO','PIMENTEIRA-LONGA',
    /* Ornamentais e Flores Tropicais */
    'ALPÍNIA','BASTÃO-DO-IMPERADOR','GENGIBRE ORNAMENTAL','HELICÔNIA PORTE ALTO','HELICÔNIA PORTE BAIXO/MÉDIO',
    /* Outras */
    'ABACAXÍ','AMARANTO','PAINÇO','QUINOA','TREMOÇO'
  ],
  permanente: [
    /* Frutíferas */
    'ABACATE','ABACAXI','ACEROLA','ATEMOIA','BANANA','CACAU','CAJÁ','CAJU','CAQUI','CARAMBOLA',
    'COCO-DA-BAÍA','COQUEIRO','CUPUAÇU','FIGO','FRAMBOESA','GOIABA','GRAVIOLA','JABUTICABA','JACA','KIWI',
    'LARANJA','LIMÃO','MAÇÃ','MAMÃO','MANGA','MANGOSTÃO','MANGOSTANZEIRO','MARACUJÁ','MARMELO','NECTARINA',
    'NOZ-PECÃ','PERA','PÊSSEGO','PHYSALIS','PITANGA','ROMÃ','TANGERINA','UVA',
    /* Café e Bebidas */
    'CAFÉ ARÁBICA','CAFÉ CONILON','CHÁ-DA-ÍNDIA','ERVA-MATE',
    /* Oleaginosas */
    'AÇAÍ','CUPUAÇU','DENDÊ','MACADÂMIA','OLIVEIRA','PUPUNHA','PUPUNHA-PALMITO','PUPUNHA-FRUTO',
    /* Especiarias */
    'BAUNILHA','CANELA','CARDAMOMO','CRAVO-DA-ÍNDIA','NOZ-MOSCADA','PIMENTA-DO-REINO',
    /* Industriais */
    'BORRACHA (SERINGUEIRA)','PALMEIRA-REAL','PINUS','EUCALIPTO','BAMBU','URUCUZEIRO',
    /* Florestais */
    'ACÁCIA','MOGNO AFRICANO','PARAPARÁ','TECA','CEDRO AUSTRALIANO','PARICÁ',
    /* Medicinais */
    'ALECRIM','BABOSA','CAPIM-LIMÃO','CITRONELA','LAVANDA','LOURO','MELISSA','SÁLVIA'
  ]
};

var _rfEtapaAtual = 0;
