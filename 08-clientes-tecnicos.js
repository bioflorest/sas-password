/* ══ PERSISTÊNCIA NO SUPABASE (clientes + equipe) ══
   Cada objeto local guarda o 'id' devolvido pelo banco, usado na exclusão. */
async function _supaInsertCliente(c){
  if(!window.supa) return;
  try{
    var r = await supa.from('clientes')
      .insert({ nome:c.nome, cpf:c.cpf, tel:c.tel, email:c.email })
      .select('id').single();
    if(r.error){ console.warn('Supabase (salvar cliente):', r.error.message); return; }
    if(r.data && r.data.id){ c.id = r.data.id; _setClientes(_getClientes()); }
  }catch(e){ console.warn('Supabase (salvar cliente):', e); }
}
async function _supaDeleteCliente(c){
  if(!window.supa || !c || !c.id) return;
  try{
    var r = await supa.from('clientes').delete().eq('id', c.id);
    if(r.error) console.warn('Supabase (excluir cliente):', r.error.message);
  }catch(e){ console.warn('Supabase (excluir cliente):', e); }
}
async function _supaInsertTecnico(t){
  if(!window.supa) return;
  try{
    var r = await supa.from('equipe')
      .insert({ nome:t.nome, titulo:t.titulo, registro:t.registro })
      .select('id').single();
    if(r.error){ console.warn('Supabase (salvar técnico):', r.error.message); return; }
    if(r.data && r.data.id){ t.id = r.data.id; _salvarTecnicosLS(); }
  }catch(e){ console.warn('Supabase (salvar técnico):', e); }
}
async function _supaDeleteTecnico(t){
  if(!window.supa || !t || !t.id) return;
  try{
    var r = await supa.from('equipe').delete().eq('id', t.id);
    if(r.error) console.warn('Supabase (excluir técnico):', r.error.message);
  }catch(e){ console.warn('Supabase (excluir técnico):', e); }
}

function abrirModalCliente(){
  document.getElementById('modal-cliente').classList.add('open');
}
function fecharModalCliente(){
  document.getElementById('modal-cliente').classList.remove('open');
}
function salvarCliente(){
  var nome  = document.getElementById('mc-nome').value.trim();
  var cpf   = document.getElementById('mc-cpf').value.trim();
  var tel   = document.getElementById('mc-tel').value.trim();
  var email = document.getElementById('mc-email').value.trim();
  if(!nome){ alert('Informe o nome do cliente.'); return; }
  var clientes = _getClientes();
  var novoCli = { nome:nome, cpf:cpf, tel:tel, email:email };
  clientes.push(novoCli);
  _setClientes(clientes);
  _atualizarSelectClientes();
  renderListaClientes();
  _supaInsertCliente(novoCli);
  document.getElementById('mc-nome').value='';
  document.getElementById('mc-cpf').value='';
  document.getElementById('mc-tel').value='';
  document.getElementById('mc-email').value='';
  fecharModalCliente();
  alert('Cliente "'+nome+'" cadastrado com sucesso!');
}

/* ══ RECFERT ══ */
var recfertFormulacoes = [
  {n:4,  p:14, k:8,  nome:'NPK 04-14-08'},
  {n:5,  p:25, k:15, nome:'NPK 05-25-15'},
  {n:8,  p:20, k:20, nome:'NPK 08-20-20'},
  {n:10, p:10, k:10, nome:'NPK 10-10-10'},
  {n:12, p:24, k:12, nome:'NPK 12-24-12'},
  {n:14, p:14, k:14, nome:'NPK 14-14-14'},
  {n:15, p:15, k:15, nome:'NPK 15-15-15'},
  {n:16, p:16, k:16, nome:'NPK 16-16-16'},
  {n:20, p:0,  k:20, nome:'NPK 20-00-20'},
  {n:20, p:5,  k:20, nome:'NPK 20-05-20'},
  {n:20, p:10, k:10, nome:'NPK 20-10-10'},
  {n:20, p:20, k:20, nome:'NPK 20-20-20'},
  {n:25, p:5,  k:20, nome:'NPK 25-05-20'},
  {n:30, p:10, k:10, nome:'NPK 30-10-10'},
  {n:2,  p:20, k:20, nome:'NPK 02-20-20'},
  {n:6,  p:30, k:6,  nome:'NPK 06-30-06'},
  {n:18, p:18, k:18, nome:'NPK 18-18-18'},
  {n:4,  p:30, k:10, nome:'NPK 04-30-10'},
];
var recfertIdx = 0;

function recfertAtualizar(){
  var f = recfertFormulacoes[recfertIdx];
  document.getElementById('recfert-num').value  = recfertIdx + 1;
  document.getElementById('recfert-n').textContent = f.n;
  document.getElementById('recfert-p').textContent = f.p;
  document.getElementById('recfert-k').textContent = f.k;
  document.getElementById('recfert-nome').textContent = f.nome;
}

function recfertNav(dir){
  var total = recfertFormulacoes.length;
  if(dir === 0)    recfertIdx = 0;
  else if(dir === 999) recfertIdx = total - 1;
  else recfertIdx = Math.max(0, Math.min(total - 1, recfertIdx + dir));
  recfertAtualizar();
}

function abrirModalRecfert(){
  recfertIdx = 0;
  recfertAtualizar();
  document.getElementById('modal-recfert').style.display = 'flex';
}

function fecharModalRecfert(){
  document.getElementById('modal-recfert').style.display = 'none';
}


// ══ MODAL PARÂMETROS DE CULTURA ══
var culturasDB = [
  {nome:'ABACATE',      cientifico:'Persea americana',          prod:2500, ph:6.0, sat:65, arn:2, med:3, arg:4, n:250,p:80, k:300,ca:100,mg:40,s:20,b:2,  zn:3,  cu:0.8,mn:2,fe:3, fontes:'- EMBRAPA Mandioca e Fruticultura. Sistema de produção do abacate.<br>- SBCS. Manual de adubação e calagem do Brasil – 5ª edição.<br>- CEPLAC/EMBRAPA. Recomendação de adubação para frutíferas tropicais.'},
  {nome:'ABACAXI',      cientifico:'Ananas comosus',             prod:50000,ph:5.5,sat:60, arn:1,med:2, arg:3, n:300,p:120,k:400,ca:80, mg:30,s:20,b:2,  zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Mandioca e Fruticultura. Cultivo do abacaxizeiro.<br>- SBCS. Manual de adubação e calagem – 5ª edição.'},
  {nome:'ACEROLA',      cientifico:'Malpighia emarginata',       prod:15000,ph:5.5,sat:50, arn:2,med:3, arg:4, n:200,p:80, k:250,ca:80, mg:30,s:15,b:1.5,zn:2.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.327 (Cap.3). V2=50%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'ALFACE',       cientifico:'Lactuca sativa',             prod:25000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:120,p:300, k:120,ca:80, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo da alface.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'ALHO',         cientifico:'Allium sativum',             prod:8000, ph:6.0,sat:70, arn:2,med:3, arg:4, n:120,p:100,k:120,ca:80, mg:30,s:25,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do alho.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'AMENDOIM',     cientifico:'Arachis hypogaea',           prod:3500, ph:6.0,sat:70, arn:1,med:2, arg:3, n:20, p:90, k:60, ca:100,mg:30,s:20,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Algodão. Sistema de produção do amendoim.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'ARROZ',        cientifico:'Oryza sativa',               prod:5000, ph:5.5,sat:50, arn:1,med:2, arg:3, n:50, p:80, k:60, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Arroz e Feijão. Cultivo do arroz.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'BANANA',       cientifico:'Musa spp.',                  prod:25000,ph:6.0,sat:60, arn:2,med:3, arg:4, n:200,p:80, k:400,ca:60, mg:30,s:15,b:2,  zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.331 (Cap.4). V2=60%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'BATATA-INGLESA',cientifico:'Solanum tuberosum',         prod:30000,ph:5.5,sat:60, arn:2,med:3, arg:4, n:150,p:120,k:200,ca:60, mg:30,s:20,b:1,  zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo da batata.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CAFÉ ARÁBICA',  cientifico:'Coffea arabica',            prod:2000, ph:6.0,sat:65, arn:3,med:4, arg:5, n:200,p:80, k:200,ca:100,mg:40,s:20,b:2,  zn:3,  cu:0.8,mn:3,fe:3, fontes:'- EMBRAPA Café. Cultivo do cafeeiro arábica.<br>- SBCS. Manual de adubação – 5ª edição.<br>- MAPA. Boas práticas agrícolas para o café.'},
  {nome:'CAFÉ CONILON',  cientifico:'Coffea canephora',          prod:3000, ph:6.0,sat:60, arn:3,med:4, arg:5, n:200,p:30, k:100,ca:100,mg:40,s:20,b:2,  zn:3,  cu:0.8,mn:3,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.267 (Cap.1). V2=60%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CANA-DE-AÇÚCAR',cientifico:'Saccharum officinarum',     prod:80000,ph:6.0,sat:70, arn:2,med:3, arg:4, n:120,p:80, k:150,ca:60, mg:30,s:20,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Agroenergia. Cana-de-açúcar.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CENOURA',      cientifico:'Daucus carota',              prod:30000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:80, p:100,k:100,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo da cenoura.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CEBOLA',       cientifico:'Allium cepa',                prod:35000,ph:6.0,sat:70, arn:2,med:3, arg:4, n:120,p:100,k:120,ca:80, mg:30,s:25,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo da cebola.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'COCO-DA-BAÍA',  cientifico:'Cocos nucifera',            prod:14000,ph:6.0,sat:65, arn:3,med:4, arg:5, n:200,p:80, k:350,ca:80, mg:40,s:20,b:2,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Tabuleiros Costeiros. Cultivo do coqueiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'EUCALIPTO',    cientifico:'Eucalyptus spp.',            prod:40000,ph:5.5,sat:50, arn:2,med:3, arg:4, n:60, p:60, k:80, ca:40, mg:20,s:15,b:1.5,zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Florestas. Cultivo do eucalipto.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'FEIJÃO',       cientifico:'Phaseolus vulgaris',         prod:2500, ph:6.0,sat:70, arn:1,med:2, arg:3, n:20, p:80, k:60, ca:60, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Arroz e Feijão. Cultivo do feijoeiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'GOIABA',       cientifico:'Psidium guajava',            prod:25000,ph:6.0,sat:70, arn:2,med:3, arg:4, n:150,p:80, k:200,ca:60, mg:30,s:15,b:1.5,zn:2.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.353 (Cap.10). V2=70%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'LARANJA',      cientifico:'Citrus sinensis',            prod:30000,ph:6.0,sat:70, arn:3,med:4, arg:5, n:150,p:60, k:180,ca:60, mg:30,s:15,b:2,  zn:3,  cu:1,  mn:3,fe:4, fontes:'- EMBRAPA Mandioca e Fruticultura. Cultivo dos citros.<br>- SBCS. Manual de adubação – 5ª edição.<br>- Fundecitrus. Boas práticas no cultivo de citros.'},
  {nome:'LIMÃO',        cientifico:'Citrus limon',               prod:25000,ph:6.0,sat:70, arn:3,med:4, arg:5, n:140,p:60, k:160,ca:60, mg:30,s:15,b:2,  zn:3,  cu:1,  mn:3,fe:4, fontes:'- EMBRAPA Mandioca e Fruticultura. Cultivo dos citros.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MAMÃO',        cientifico:'Carica papaya',              prod:60000,ph:6.0,sat:70, arn:2,med:3, arg:4, n:180,p:100,k:300,ca:80, mg:40,s:20,b:2,  zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.357 (Cap.12). V2=70%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MANGA',        cientifico:'Mangifera indica',           prod:15000,ph:6.0,sat:65, arn:2,med:3, arg:4, n:200,p:80, k:250,ca:80, mg:40,s:20,b:2,  zn:3,  cu:0.8,mn:2,fe:3, fontes:'- EMBRAPA Semiárido. Cultivo da mangueira.<br>- SBCS. Manual de adubação – 5ª edição.<br>- CEPLAC/EMBRAPA. Recomendação para frutíferas tropicais.'},
  /* MANDIOCA – Embrapa Pará 2020 (p.253): N=40kg/ha cobertura; P2O5 variável por textura/teor; K2O=120kg/ha; V=50%; prod média Pará=14.920t/ha */
  {nome:'MANDIOCA',     cientifico:'Manihot esculenta',          prod:30000,ph:5.5,sat:50, arn:1,med:2, arg:3, n:40, p:100,k:120,ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.253.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MARACUJÁ',     cientifico:'Passiflora edulis',          prod:20000,ph:5.5,sat:70, arn:2,med:3, arg:4, n:180,p:80, k:200,ca:60, mg:30,s:20,b:2,  zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.363 (Cap.14). V2=70%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MELANCIA',     cientifico:'Citrullus lanatus',          prod:35000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:90,p:90, k:130,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Semiárido. Cultivo da melancia.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MELÃO',        cientifico:'Cucumis melo',               prod:30000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:100,p:80, k:150,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Semiárido. Cultivo do meloeiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MILHO',        cientifico:'Zea mays',                   prod:8000, ph:6.0,sat:60, arn:2,med:3, arg:4, n:110,p:90, k:70,ca:60, mg:25,s:20,b:1,  zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.255 (Cap.7). V2=60%; N=110-130kg/ha.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MORANGO',      cientifico:'Fragaria x ananassa',        prod:35000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:120,p:100,k:180,ca:80, mg:30,s:20,b:1.5,zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Clima Temperado. Cultivo do morangueiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'PEPINO',       cientifico:'Cucumis sativus',            prod:50000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:120,p:80, k:150,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do pepino.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'PIMENTÃO',     cientifico:'Capsicum annuum',            prod:40000,ph:6.0,sat:70, arn:2,med:3, arg:4, n:150,p:100,k:180,ca:80, mg:30,s:20,b:1.5,zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do pimentão.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'SOJA',         cientifico:'Glycine max',                prod:3500, ph:6.0,sat:60, arn:2,med:3, arg:4, n:0,  p:100, k:90,ca:80, mg:30,s:20,b:1,  zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.259 (Cap.8). V2=60%; N≤20kg/ha (FBN).<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'SORGO',        cientifico:'Sorghum bicolor',            prod:5000, ph:5.5,sat:60, arn:1,med:2, arg:3, n:100,p:60, k:60, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Milho e Sorgo. Cultivo do sorgo.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'TANGERINA',    cientifico:'Citrus reticulata',          prod:20000,ph:6.0,sat:70, arn:3,med:4, arg:5, n:140,p:60, k:160,ca:60, mg:30,s:15,b:2,  zn:3,  cu:1,  mn:3,fe:4, fontes:'- EMBRAPA Mandioca e Fruticultura. Cultivo dos citros.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'TOMATE',       cientifico:'Solanum lycopersicum',       prod:80000,ph:6.0,sat:70, arn:2,med:3, arg:4, n:200,p:150,k:300,ca:100,mg:40,s:25,b:2,  zn:3,  cu:0.8,mn:3,fe:4, fontes:'- EMBRAPA Hortaliças. Cultivo do tomateiro.<br>- SBCS. Manual de adubação – 5ª edição.<br>- APTA/IAC. Recomendações técnicas para o tomate.'},
  {nome:'TRIGO',        cientifico:'Triticum aestivum',          prod:3000, ph:6.0,sat:70, arn:2,med:3, arg:4, n:120,p:80, k:60, ca:60, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Trigo. Cultivo do trigo.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'UVA',          cientifico:'Vitis vinifera',             prod:15000,ph:6.0,sat:65, arn:3,med:4, arg:5, n:120,p:80, k:180,ca:80, mg:40,s:20,b:2,  zn:3,  cu:1,  mn:3,fe:3, fontes:'- EMBRAPA Uva e Vinho. Cultivo da videira.<br>- SBCS. Manual de adubação – 5ª edição.<br>- Uvibra. Boas práticas no cultivo da uva.'},
  /* AÇAÍ – Embrapa Pará 2020 (p.324): 5º ano N=120g/touceira; P2O5=250g(P solo 0-10); K2O=300g(K solo 0-40); V=60% */
  {nome:'AÇAÍ',         cientifico:'Euterpe oleracea',           prod:10000,ph:5.5,sat:60, arn:2,med:3, arg:4, n:120,p:100,k:150,ca:60, mg:30,s:15,b:1.5,zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.324.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'ALGODÃO',      cientifico:'Gossypium hirsutum',         prod:3000, ph:6.0,sat:55, arn:2,med:3, arg:4, n:100, p:90, k:60, ca:80, mg:30,s:20,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.231 (Cap.1). V2=55%; N=100kg/ha.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'BATATA-DOCE',  cientifico:'Ipomoea batatas',            prod:20000,ph:5.8,sat:60, arn:1,med:2, arg:3, n:80, p:80, k:120,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo da batata-doce.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'BETERRABA',    cientifico:'Beta vulgaris',               prod:40000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:100,p:100,k:150,ca:60, mg:25,s:20,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo da beterraba.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'BRACHIARIA',   cientifico:'Urochloa brizantha',         prod:15000,ph:5.5,sat:50, arn:1,med:2, arg:3, n:100,p:50, k:80, ca:40, mg:20,s:15,b:0.5,zn:1.5,cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Gado de Corte. Brachiaria brizantha.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'BRÓCOLIS',     cientifico:'Brassica oleracea var. italica',prod:15000,ph:6.0,sat:70,arn:1,med:2,arg:3, n:150,p:100,k:150,ca:80, mg:30,s:20,b:2,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do brócolis.<br>- SBCS. Manual de adubação – 5ª edição.'},
  /* CACAU – Embrapa Pará 2020 (p.338 Tab3 polo Transamazônica): N=130kg/ha; P2O5=120kg(P 0-10); K2O=140kg(K 0-60); V=60%; pH=5,5 */
  {nome:'CACAU',        cientifico:'Theobroma cacao',            prod:2000, ph:5.5,sat:60, arn:2,med:3, arg:4, n:130,p:120,k:140,ca:80, mg:40,s:20,b:2,  zn:2,  cu:0.8,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.338.<br>- CEPLAC/EMBRAPA. Polo cacaueiro da Transamazônica.'},
  {nome:'CAJU',         cientifico:'Anacardium occidentale',     prod:8000, ph:5.5,sat:55, arn:1,med:2, arg:3, n:80, p:50, k:100,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Agroindústria Tropical. Cultivo do cajueiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CAMU-CAMU',    cientifico:'Myrciaria dubia',            prod:8000, ph:5.5,sat:50, arn:2,med:3, arg:4, n:100,p:60, k:120,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Ocidental. Cultivo do camu-camu.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CASTANHA-DO-PARÁ',cientifico:'Bertholletia excelsa',   prod:1500, ph:5.5,sat:45, arn:2,med:3, arg:4, n:80, p:50, k:100,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Cultivo da castanheira.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CITROS',       cientifico:'Citrus sinensis',            prod:30000,ph:6.0,sat:60, arn:3,med:4, arg:5, n:150,p:60, k:180,ca:60, mg:30,s:15,b:2,  zn:3,  cu:1,  mn:3,fe:4, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.347 (Cap.7). V2=60%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'COENTRO',      cientifico:'Coriandrum sativum',         prod:10000,ph:6.0,sat:65, arn:1,med:2, arg:3, n:60, p:60, k:60, ca:40, mg:15,s:10,b:0.5,zn:1,  cu:0.3,mn:1,fe:2, fontes:'- EMBRAPA Hortaliças. Cultivo do coentro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'COUVE',        cientifico:'Brassica oleracea var. acephala',prod:20000,ph:6.0,sat:70,arn:1,med:2,arg:3,n:120,p:80,k:120,ca:80,mg:30,s:20,b:1.5,zn:2,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo da couve.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'CUPUAÇU',      cientifico:'Theobroma grandiflorum',     prod:10000,ph:5.5,sat:55, arn:2,med:3, arg:4, n:120,p:60, k:150,ca:60, mg:30,s:15,b:1.5,zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Cultivo do cupuaçuzeiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'DENDÊ',        cientifico:'Elaeis guineensis',          prod:20000,ph:5.5,sat:60, arn:2,med:3, arg:4, n:150,p:80, k:200,ca:60, mg:40,s:20,b:2,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.279 (Cap.4). V2=60%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'GIRASSOL',     cientifico:'Helianthus annuus',          prod:2500, ph:6.0,sat:65, arn:1,med:2, arg:3, n:80, p:60, k:80, ca:60, mg:20,s:15,b:2,  zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Soja. Cultivo do girassol.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'GRAVIOLA',     cientifico:'Annona muricata',            prod:15000,ph:6.0,sat:50, arn:2,med:3, arg:4, n:120,p:60, k:150,ca:60, mg:30,s:15,b:1.5,zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.355 (Cap.11). V2=50%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'GUARANÁ',      cientifico:'Paullinia cupana',           prod:500,  ph:5.5,sat:50, arn:2,med:3, arg:4, n:60, p:40, k:80, ca:30, mg:15,s:10,b:1,  zn:1.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Ocidental. Cultivo do guaranazeiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'JILÓ',         cientifico:'Solanum gilo',               prod:15000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:100,p:80, k:120,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do jiló.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MAMONA',       cientifico:'Ricinus communis',           prod:2000, ph:6.0,sat:65, arn:1,med:2, arg:3, n:60, p:60, k:60, ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Algodão. Cultivo da mamoneira.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MAXIXE',       cientifico:'Cucumis melo',               prod:12000,ph:6.0,sat:65, arn:1,med:2, arg:3, n:80, p:60, k:100,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do maxixe.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MOGNO AFRICANO',cientifico:'Khaya ivorensis',           prod:10000,ph:6.0,sat:60, arn:2,med:3, arg:4, n:80, p:50, k:80, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Florestas. Mogno africano.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'MURUCI',       cientifico:'Byrsonima crassifolia',      prod:5000, ph:5.5,sat:45, arn:1,med:2, arg:3, n:60, p:40, k:80, ca:30, mg:15,s:10,b:1,  zn:1.5,cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Fruteiras nativas da Amazônia.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'NEEM',         cientifico:'Azadirachta indica',         prod:8000, ph:6.0,sat:60, arn:1,med:2, arg:3, n:60, p:40, k:80, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Florestas. Cultivo do neem.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'PARICÁ',       cientifico:'Schizolobium amazonicum',    prod:20000,ph:5.5,sat:50, arn:2,med:3, arg:4, n:80, p:50, k:80, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Cultivo do paricá.<br>- SBCS. Manual de adubação – 5ª edição.'},
  /* CUPUAÇU – Embrapa Pará 2020 (p.352): 7º ano N=190g/pl, P2O5=190g, K2O=260g; V=50%; 180pl/ha ≈ kg/ha */
  {nome:'CUPUAÇU',     cientifico:'Theobroma grandiflorum',     prod:8000, ph:5.5,sat:50, arn:2,med:3, arg:4, n:190,p:190,k:260,ca:60, mg:30,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.352.<br>- SBCS. Manual de adubação – 5ª edição.'},
  /* PIMENTA-DO-REINO – Embrapa Pará 2020 (p.285): prod N=200g/pl, P solo 0-10→90g P2O5, K solo 0-40→290g K2O; V=60%; 1666pl/ha */
  {nome:'PIMENTA-DO-REINO',cientifico:'Piper nigrum',           prod:2500, ph:5.5,sat:60, arn:2,med:3, arg:4, n:200,p:90, k:290,ca:80, mg:40,s:20,b:2,  zn:2,  cu:0.8,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.285.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'PUPUNHA-PALMITO',cientifico:'Bactris gasipaes',        prod:20000,ph:5.5,sat:60, arn:2,med:3, arg:4, n:120,p:60, k:150,ca:50, mg:25,s:15,b:1.5,zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.289 (Cap.7). V2=60%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'PUPUNHA-FRUTO',  cientifico:'Bactris gasipaes',        prod:20000,ph:5.5,sat:50, arn:2,med:3, arg:4, n:120,p:60, k:150,ca:50, mg:25,s:15,b:1.5,zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.372 (Cap.15). V2=50%.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'QUIABO',       cientifico:'Abelmoschus esculentus',     prod:12000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:100,p:80, k:120,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do quiabeiro.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'REPOLHO',      cientifico:'Brassica oleracea var. capitata',prod:60000,ph:6.0,sat:70,arn:1,med:2,arg:3,n:150,p:100,k:150,ca:80,mg:30,s:20,b:2,zn:2,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Hortaliças. Cultivo do repolho.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'SERINGUEIRA',  cientifico:'Hevea brasiliensis',         prod:1500, ph:5.5,sat:50, arn:2,med:3, arg:4, n:80, p:50, k:100,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Cultivo da seringueira.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'TAPEREBÁ',     cientifico:'Spondias mombin',            prod:8000, ph:5.5,sat:50, arn:1,med:2, arg:3, n:60, p:40, k:80, ca:30, mg:15,s:10,b:1,  zn:1.5,cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Fruteiras nativas.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'TECA',         cientifico:'Tectona grandis',            prod:15000,ph:6.0,sat:60, arn:2,med:3, arg:4, n:80, p:50, k:80, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Florestas. Cultivo da teca.<br>- SBCS. Manual de adubação – 5ª edição.'},
  {nome:'TUCUMÃ',       cientifico:'Astrocaryum vulgare',        prod:6000, ph:5.5,sat:45, arn:1,med:2, arg:3, n:60, p:40, k:80, ca:30, mg:15,s:10,b:1,  zn:1.5,cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Fruteiras nativas da Amazônia.<br>- SBCS. Manual de adubação – 5ª edição.'},
,
{nome:'FEIJÃO-CAUPI',  cientifico:'Vigna unguiculata',           prod:1500, ph:6.0,sat:50, arn:1,med:2, arg:3, n:20, p:80, k:90, ca:60, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.247 (Cap.5). N=20kg/ha cobertura (áreas novas/arenosas); P2O5=80kg/ha (solo baixo); K2O=90kg/ha (solo baixo); V2=50%.'},
  {nome:'MANGOSTANZEIRO',cientifico:'Garcinia mangostana',           prod:8000, ph:5.5,sat:50, arn:2,med:3, arg:4, n:80, p:50, k:100,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.361 (Cap.13). V2=50%.'},
  {nome:'URUCUZEIRO',    cientifico:'Bixa orellana',                prod:800,  ph:5.5,sat:60, arn:2,med:3, arg:4, n:80, p:60, k:100,ca:40, mg:20,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.293 (Cap.9). V2=60%.'},

  {nome:'FEIJÃO-VAGEM',  cientifico:'Phaseolus vulgaris L. var. vulgaris', prod:8000, ph:6.0,sat:70, arn:1,med:2, arg:3, n:150,p:180,k:150,ca:80,mg:30,s:15,b:1,zn:2,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.301 (Cap.2). N=150kg/ha; P2O5=180kg/ha (solo baixo); K2O=150kg/ha (solo baixo); V2=70%.'},
  {nome:'PIMENTEIRAS LOCAIS',cientifico:'Capsicum chinense / frutescens',   prod:5000, ph:6.0,sat:70, arn:2,med:3, arg:4, n:150,p:200,k:150,ca:80,mg:30,s:20,b:1,zn:2,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.313 (Cap.6). N=150kg/ha; P2O5=200kg/ha (solo baixo textura média); K2O=150kg/ha (solo baixo); V2=70%. Inclui pimenta-de-cheiro, murupi e malagueta.'},

  /* ── CULTURAS ADICIONADAS DO PDF (16 FALTANTES) ── */
  /* ARROZ TERRAS ALTAS – Embrapa Pará 2020 (p.235): N=40-60kg/ha; P2O5=80kg/ha (P 0-5, textura argilosa); K2O=60kg/ha (K 0-40); V2=50%; SAD-Al=20% */
  {nome:'ARROZ TERRAS ALTAS',cientifico:'Oryza sativa (sequeiro)',        prod:3000, ph:5.5,sat:50, arn:1,med:2, arg:3, n:50, p:80, k:60, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.235 (Cap.2). N=40–60kg/ha (2 coberturas); P2O5=80kg/ha (P baixo 0–5 mg/dm3, solo argiloso); K2O=60kg/ha (K baixo 0–40 mg/dm3); V2=50% (SAD-Al=20%). Produtividade alvo 2–4 t/ha. FTE BR-12: 30kg/ha se deficiência de micronutrientes.'},

  /* ABÓBORA – Embrapa Pará 2020 (p.303): mesma tabela de Melancia; N=90+100+- ; P2O5=90(P 0-10); K2O=130+- (K 0-40); V2=70%; espaç. 3x3m */
  {nome:'ABÓBORA',          cientifico:'Cucurbita moschata / maxima',     prod:15000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:90, p:90, k:130,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.303 (Cap.3). N total=90kg/ha (plantio+2 coberturas); P2O5=90kg/ha (P 0-10 mg/dm3, plantio); K2O=130kg/ha (K 0-40 mg/dm3, 2 coberturas); V2=70% (SAD-Al=5%). Tabela compartilhada com Melancia. Espaçamento: 3,0×3,0m, 2.222 pl/ha.'},

  /* PASTAGEM CULTIVADA – Embrapa Pará 2020 (p.383): médio nível tecnológico; N=100kg/ha implantação; P2O5=80kg/ha(P baixo,argila>60%); K2O=40kg/ha(K baixo); manutenção: P2O5=30, K2O=40 */
  {nome:'PASTAGEM CULTIVADA',cientifico:'Brachiaria / Panicum / Cynodon spp.',prod:0,ph:5.5,sat:50, arn:1,med:2, arg:3, n:100,p:80, k:40, ca:40, mg:20,s:15,b:0.5,zn:1.5,cu:0.3,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.383 (Cap.1). Implantação (médio nível tecnológico): N=100kg/ha; P2O5=80kg/ha (P baixo, argila>60%); K2O=40kg/ha (K baixo). Manutenção: P2O5=30kg/ha; K2O=40kg/ha; N=60kg/ha/ano. Calagem apenas se Ca+Mg<0,9 cmolc/dm3 ou saturação Al>20%; V2=50–60% (sistemas intensivos).'},

  /* ARROZ IRRIGADO – Embrapa Pará 2020 (p.239): N=90kg/ha (MO<2,5%); P2O5=60kg/ha (P 0-3 mg/dm3); K2O=80kg/ha (K 0-30 mg/dm3); V2=50%; solo várzea */
  {nome:'ARROZ IRRIGADO',  cientifico:'Oryza sativa (várzea)',          prod:5000, ph:5.5,sat:50, arn:1,med:2, arg:3, n:90, p:60, k:80, ca:40, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.239 (Cap.3). N=90kg/ha (MO muito baixo); P2O5=60kg/ha (P baixo 0-3 mg/dm3); K2O=80kg/ha (K baixo 0-30 mg/dm3); V2=50% (saturação por bases). Solo de várzea geralmente dispensa calagem.'},

  /* SORGO GRANÍFERO E FORRAGEIRO – Embrapa Pará 2020 (p.263): N plantio=20+cobertura=50; P2O5=80 (P 0-10); K2O=60 (K 0-40); V2=60% */
  {nome:'SORGO GRANÍFERO', cientifico:'Sorghum bicolor (granífero)',     prod:6000, ph:5.5,sat:60, arn:1,med:2, arg:3, n:70, p:80, k:60, ca:45, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.263 (Cap.9). N=20kg/ha plantio + 50kg/ha cobertura; P2O5=80kg/ha (P 0-10 mg/dm3); K2O=60kg/ha (K 0-40 mg/dm3); V2=60%. Produtividade alvo 4–6 t/ha.'},
  {nome:'SORGO FORRAGEIRO', cientifico:'Sorghum bicolor (forrageiro)',   prod:8000, ph:5.5,sat:60, arn:1,med:2, arg:3, n:100,p:100,k:80, ca:45, mg:20,s:15,b:0.5,zn:2,  cu:0.3,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.263 (Cap.9). N=30kg/ha plantio + 70kg/ha cobertura; P2O5=100kg/ha (P 0-10 mg/dm3); K2O=80kg/ha (K 0-40 mg/dm3); V2=60%. Produtividade alvo 6–8 t/ha.'},

  /* MELÃO – Embrapa Pará 2020 (p.307): Plantio + 2 coberturas; N total=70+140+200=~200; P2O5=200(plantio,P 0-10); K2O=130+270=400(K 0-40); V2=70% */
  {nome:'MELÃO (EMBRAPA-PA)',cientifico:'Cucumis melo',                  prod:25000,ph:6.0,sat:70, arn:1,med:2, arg:3, n:200,p:200,k:400,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.307 (Cap.4). N total=200kg/ha (3 parcelas); P2O5=200kg/ha (P 0-10 mg/dm3, plantio); K2O=400kg/ha (K 0-40 mg/dm3, 2 coberturas); V2=70%. Micronutrientes: 30kg/ha FTE BR-12.'},

  /* TOMATE RASTEIRO – Embrapa Pará 2020 (p.317): doses por planta; espaç 0,20x1,00m=50.000pl/ha; 1ºano N=30g/pl=1500kg/ha; P2O5=45g/pl(P 0-10)=2250; K2O=60g/pl=3000. Valores em kg/ha para 50000pl */
  {nome:'TOMATE RASTEIRO',  cientifico:'Solanum lycopersicum (rasteiro)', prod:60000,ph:6.0,sat:75, arn:2,med:3, arg:4, n:150,p:225,k:300,ca:80, mg:30,s:20,b:2,  zn:3,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.317 (Cap.7). Doses por planta (1ºano): N=30g, P2O5=45g (P 0-10 mg/dm3), K2O=60g (K 0-40 mg/dm3). V2=70–80%. Convertido para 50.000 pl/ha. Micronutrientes: B 2–3 kg/ha, Zn 4 kg/ha em solos pobres.'},

  /* COQUEIRO – Embrapa Pará 2020 (p.347): adubação baseada em análise foliar; Tabela 1 plantio+anos iniciais por planta; Tabela 2 produção por análise foliar. Valores Tabela 1 (solo baixo), 3ºano, 142pl/ha (gigante) convertido */
  {nome:'COQUEIRO',         cientifico:'Cocos nucifera',                 prod:12000,ph:6.0,sat:50, arn:3,med:4, arg:5, n:225,p:100,k:900,ca:80, mg:60,s:20,b:3,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.347 (Cap.8). V2=50%. Adubação de produção baseada em análise foliar (Tabela 2). Valores representativos 3ºano, 142 pl/ha (coqueiro gigante): N=225g/pl; P2O5=100g/pl (P<15 mg/dm3); K2O=600–900g/pl (análise foliar); Mg=90g/pl; B=1,5–2,0g/pl. Fonte de P: superfosfato simples.'},

  /* PARAPARÁ – Embrapa Pará 2020 (p.409/413): N plantio=50kg/ha; P2O5=80kg/ha (P 0-5); K2O=20kg/ha (K 0-30); V2=50% */
  {nome:'PARAPARÁ',         cientifico:'Jacaranda copaia',               prod:15000,ph:5.5,sat:50, arn:2,med:3, arg:4, n:50, p:80, k:20, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.409 (Cap.3). N plantio=50kg/ha; P2O5=80kg/ha (P 0-5 mg/dm3); K2O=20kg/ha (K 0-30 mg/dm3); V2=50%. Parcelar N e K em 3 aplicações a partir do 1ºano. Micronutrientes: FTE BR-12 30g/planta no plantio.'},

  /* PARICÁ – Embrapa Pará 2020 (p.413): igual ao parapará: N=50; P2O5=80(P 0-5); K2O=20(K 0-30); V2=50% */
  {nome:'PARICÁ',           cientifico:'Schizolobium parahyba var. amazonicum', prod:20000,ph:5.5,sat:50, arn:2,med:3, arg:4, n:50, p:80, k:20, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.413 (Cap.4). N plantio=50kg/ha; P2O5=80kg/ha (P 0-5 mg/dm3); K2O=20kg/ha (K 0-30 mg/dm3); V2=50% (método saturação por bases). Parcelar N e K em 3 aplicações por ano.'},

  /* CURAUÁ – Embrapa Pará 2020 (p.273): sem tabela NPK direto; recomendação baseada em calagem V2=60% e adubação orgânica. Valores estimados por analogia à abacaxi/fibras */
  {nome:'CURAUÁ',           cientifico:'Ananas erectifolius',            prod:3000, ph:5.5,sat:60, arn:1,med:2, arg:3, n:60, p:60, k:80, ca:40, mg:20,s:15,b:1,  zn:1.5,cu:0.3,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.273 (Cap.2). V2=60%. Nota: o livro não apresenta tabela NPK explícita para curauá; valores estimados por analogia com abacaxizeiro e culturas de fibra regionais. Recomenda-se adubação orgânica complementar e análise periódica de solo.'},

  /* PIMENTEIRA-LONGA – Embrapa Pará 2020 (p.287): V2=50%; adubação por tabela referenciada; N+K parcelados */
  {nome:'PIMENTEIRA-LONGA', cientifico:'Piper longum',                   prod:3000, ph:5.5,sat:50, arn:2,med:3, arg:4, n:100,p:80, k:120,ca:60, mg:30,s:15,b:1,  zn:2,  cu:0.5,mn:2,fe:3, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.287 (Cap.5). V2=50%. N e K parcelados em 3 aplicações; P total no plantio. Espaçamento: linhas simples 70×40cm (35.700pl/ha) ou linhas duplas (33.333pl/ha). Micronutrientes: FTE BR-12 30g/cova se deficiência detectada.'},

  /* GRAMADOS ORNAMENTAIS – Embrapa Pará 2020 (p.391): N=50; P2O5=140(P 0-10); K2O=100(K 0-40); V2=60% */
  {nome:'GRAMADOS ORNAMENTAIS',cientifico:'Zoysia japonica / Cynodon spp.',prod:0, ph:6.0,sat:60, arn:1,med:2, arg:3, n:50, p:140,k:100,ca:50, mg:20,s:15,b:0.5,zn:1.5,cu:0.3,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.391 (Cap.2). N=50kg/ha; P2O5=140kg/ha (P 0-10 mg/dm3); K2O=100kg/ha (K 0-40 mg/dm3); V2=60%. Adubação dividida em 2 parcelas; 1ª 30 dias após calagem, 2ª 60–90 dias depois.'},

  /* GRAMADO ESPORTIVO – Embrapa Pará 2020 (p.391/394): formação N=300-400; P2O5=137-229; K2O=180-240 kg/ha */
  {nome:'GRAMADO ESPORTIVO', cientifico:'Zoysia japonica / Cynodon dactylon',prod:0,ph:6.0,sat:60, arn:1,med:2, arg:3, n:350,p:180,k:210,ca:50, mg:20,s:15,b:0.5,zn:1.5,cu:0.3,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.393 (Cap.3). Fase formação: N=300–400 kg/ha (3–4 parcelas); P2O5=137–229 kg/ha (dose única); K2O=180–240 kg/ha (3–4 parcelas). Manutenção baseada em análise foliar ou clorofilômetro (SPAD).'},

  /* ALPÍNIA – Embrapa Pará 2020 (p.373): N=180g/touceira (1ºano); P2O5=70g(P 0-10); K2O=250g(K 0-40); V2=60%. 2222pl/ha → kg/ha */
  {nome:'ALPÍNIA',           cientifico:'Alpinia purpurata',              prod:0,    ph:6.0,sat:60, arn:2,med:3, arg:4, n:400,p:155,k:555,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.373 (Cap.1). Doses por touceira (1ºano, 2222 pl/ha): N=180g → 400kg/ha; P2O5=70g (P 0-10 mg/dm3) → 155kg/ha; K2O=250g (K 0-40 mg/dm3) → 555kg/ha; V2=60%. Adubação orgânica: 10L cama de frango ou 15L esterco curral por touceira.'},

  /* BASTÃO-DO-IMPERADOR – Embrapa Pará 2020 (p.375): N=100g/touc(1ºano); P2O5=70g; K2O=300g(K 0-40); V2=60%. 1111pl/ha */
  {nome:'BASTÃO-DO-IMPERADOR',cientifico:'Etlingera elatior',            prod:0,    ph:6.0,sat:60, arn:2,med:3, arg:4, n:111,p:78, k:333,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.375 (Cap.2). Doses por touceira (1ºano, 1111 pl/ha): N=100g → 111kg/ha; P2O5=70g (P 0-10 mg/dm3) → 78kg/ha; K2O=300g (K 0-40 mg/dm3) → 333kg/ha; V2=60%. Adubação orgânica: 10L cama de frango ou 15L esterco curral por touceira.'},

  /* HELICÔNIA PORTE ALTO – Embrapa Pará 2020 (p.377): N=180g/touc(1ºano); P2O5=70g; K2O=300g(K 0-40); V2=60%. 625pl/ha */
  {nome:'HELICÔNIA PORTE ALTO',cientifico:'Heliconia spp. (porte alto)', prod:0,    ph:6.0,sat:60, arn:2,med:3, arg:4, n:113,p:44, k:188,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.377 (Cap.3). Doses por touceira (1ºano, 625 pl/ha): N=180g → 113kg/ha; P2O5=70g (P 0-10 mg/dm3) → 44kg/ha; K2O=300g (K 0-40 mg/dm3) → 188kg/ha; V2=60%. Espaçamento: 4,0×4,0m. Adubação orgânica: 10L cama de frango ou 20L esterco curral por touceira.'},

  /* HELICÔNIA PORTE BAIXO/MÉDIO – Embrapa Pará 2020 (p.379): N=150g/touc(1ºano); P2O5=70g; K2O=200g(K 0-40); sem calagem para cv. Golden Torch (porte baixo). 10000pl/ha(baixo) */
  {nome:'HELICÔNIA PORTE BAIXO/MÉDIO',cientifico:'Heliconia psittacorum e outros',prod:0,ph:6.0,sat:60,arn:2,med:3,arg:4,n:1500,p:700,k:2000,ca:60,mg:25,s:15,b:1,zn:2,cu:0.5,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.379 (Cap.4). Doses por touceira (1ºano): N=150g; P2O5=70g (P 0-10 mg/dm3); K2O=200g (K 0-40 mg/dm3); V2=60% (porte médio; porte baixo cv. Golden Torch não respondeu à calagem). Valores convertidos para 10.000 pl/ha (porte baixo: 1,0×1,0m).'},

  /* GENGIBRE ORNAMENTAL – Embrapa Pará 2020 (p.381): N=150g/touc(1ºano); P2O5=70g; K2O=300g(K 0-40); V2=60%. 1667pl/ha */
  {nome:'GENGIBRE ORNAMENTAL',cientifico:'Zingiber spectabile',           prod:0,    ph:6.0,sat:60, arn:2,med:3, arg:4, n:250,p:117,k:500,ca:60, mg:25,s:15,b:1,  zn:2,  cu:0.5,mn:1,fe:2, fontes:'- EMBRAPA Amazônia Oriental. Recomendações de calagem e adubação para o estado do Pará – 2ª ed. 2020, p.381 (Cap.5). Doses por touceira (1ºano, 1667 pl/ha): N=150g → 250kg/ha; P2O5=70g (P 0-10 mg/dm3) → 117kg/ha; K2O=300g (K 0-40 mg/dm3) → 500kg/ha; V2=60%. Adubação orgânica: 10L cama de frango ou 15L esterco curral por touceira.'},
];

culturasDB.sort(function(a,b){return a.nome.localeCompare(b.nome);});

var _culturaIdx = 0;

function _mpPreencher(c){
  document.getElementById('mp-cultura').value   = c.nome;
  document.getElementById('mp-cientifico').value = c.cientifico;
  document.getElementById('mp-prod').value       = c.prod;
  document.getElementById('mp-ph').value         = c.ph;
  document.getElementById('mp-sat').value        = c.sat;
  document.getElementById('mp-arenoso').value    = c.arn;
  document.getElementById('mp-medio').value      = c.med;
  document.getElementById('mp-argiloso').value   = c.arg;
  document.getElementById('mp-n').value          = c.n;
  document.getElementById('mp-p').value          = c.p;
  document.getElementById('mp-k').value          = c.k;
  document.getElementById('mp-ca').value         = c.ca;
  document.getElementById('mp-mg').value         = c.mg;
  document.getElementById('mp-s').value          = c.s;
  document.getElementById('mp-b').value          = c.b;
  document.getElementById('mp-zn').value         = c.zn;
  document.getElementById('mp-cu').value         = c.cu;
  document.getElementById('mp-mn').value         = c.mn;
  document.getElementById('mp-fe').value         = c.fe;
  document.getElementById('mp-fontes').innerHTML = c.fontes;
}

function abrirModalParametros(){
  _culturaIdx = 0;
  _mpPreencher(culturasDB[_culturaIdx]);
  document.getElementById('mp-busca-wrap').style.display = 'none';
  document.getElementById('mp-busca-input').value = '';
  document.getElementById('mp-busca-lista').style.display = 'none';
  document.getElementById('modal-parametros').style.display = 'flex';
}

function fecharModalParametros(){
  document.getElementById('modal-parametros').style.display = 'none';
}

function navCultura(dir){
  var total = culturasDB.length;
  if(dir === 0)    _culturaIdx = 0;
  else if(dir >= 9999) _culturaIdx = total - 1;
  else _culturaIdx = Math.max(0, Math.min(total - 1, _culturaIdx + dir));
  _mpPreencher(culturasDB[_culturaIdx]);
  document.getElementById('mp-busca-wrap').style.display = 'none';
}

function abrirBuscaCultura(){
  var wrap = document.getElementById('mp-busca-wrap');
  wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
  if(wrap.style.display === 'block'){
    document.getElementById('mp-busca-input').focus();
    filtrarCulturaModal();
  }
}

function filtrarCulturaModal(){
  var q = document.getElementById('mp-busca-input').value.trim().toLowerCase();
  var lista = document.getElementById('mp-busca-lista');
  lista.innerHTML = '';
  if(!q){ lista.style.display = 'none'; return; }
  var resultados = culturasDB.filter(function(c){ return c.nome.toLowerCase().includes(q); });
  if(resultados.length === 0){ lista.style.display = 'none'; return; }
  lista.style.display = 'block';
  resultados.forEach(function(c){
    var item = document.createElement('div');
    item.textContent = c.nome + ' (' + c.cientifico + ')';
    item.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:.84rem;border-bottom:1px solid #e8edda;';
    item.onmouseover = function(){ this.style.background='#e8edda'; };
    item.onmouseout  = function(){ this.style.background=''; };
    item.onclick     = function(){
      _culturaIdx = culturasDB.indexOf(c);
      _mpPreencher(c);
      document.getElementById('mp-busca-wrap').style.display = 'none';
      document.getElementById('mp-busca-input').value = '';
      lista.style.display = 'none';
    };
    lista.appendChild(item);
  });
}

function salvarParametrosCultura(){
  var c = culturasDB[_culturaIdx];
  c.prod = parseFloat(document.getElementById('mp-prod').value)    || c.prod;
  c.ph   = parseFloat(document.getElementById('mp-ph').value)      || c.ph;
  c.sat  = parseFloat(document.getElementById('mp-sat').value)     || c.sat;
  c.arn  = parseFloat(document.getElementById('mp-arenoso').value) || c.arn;
  c.med  = parseFloat(document.getElementById('mp-medio').value)   || c.med;
  c.arg  = parseFloat(document.getElementById('mp-argiloso').value)|| c.arg;
  c.n    = parseFloat(document.getElementById('mp-n').value)       || c.n;
  c.p    = parseFloat(document.getElementById('mp-p').value)       || c.p;
  c.k    = parseFloat(document.getElementById('mp-k').value)       || c.k;
  c.ca   = parseFloat(document.getElementById('mp-ca').value)      || c.ca;
  c.mg   = parseFloat(document.getElementById('mp-mg').value)      || c.mg;
  c.s    = parseFloat(document.getElementById('mp-s').value)       || c.s;
  c.b    = parseFloat(document.getElementById('mp-b').value)       || c.b;
  c.zn   = parseFloat(document.getElementById('mp-zn').value)      || c.zn;
  c.cu   = parseFloat(document.getElementById('mp-cu').value)      || c.cu;
  c.mn   = parseFloat(document.getElementById('mp-mn').value)      || c.mn;
  c.fe   = parseFloat(document.getElementById('mp-fe').value)      || c.fe;
  alert('Parâmetros de "' + c.nome + '" salvos com sucesso!');
}

window.addEventListener('DOMContentLoaded', function(){
  var mp = document.getElementById('modal-parametros');
  if(mp) mp.addEventListener('click', function(e){ if(e.target===this) fecharModalParametros(); });

  var mr = document.getElementById('modal-recfert');
  if(mr) mr.addEventListener('click', function(e){ if(e.target===this) fecharModalRecfert(); });

  var mc = document.getElementById('modal-cliente');
  if(mc) mc.addEventListener('click', function(e){ if(e.target===this) fecharModalCliente(); });
});

// ══ PÁGINA CLIENTES: funções ══

function mascaraCpf(el){
  var v=el.value.replace(/\D/g,'');
  if(v.length>11)v=v.slice(0,11);
  v=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  el.value=v;
}
function mascaraTel(el){
  var v=el.value.replace(/\D/g,'');
  if(v.length>11)v=v.slice(0,11);
  if(v.length<=10) v=v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3');
  else              v=v.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
  el.value=v;
}

function limparFormCliente(){
  ['cli-nome','cli-cpf','cli-tel','cli-email'].forEach(function(id){
    document.getElementById(id).value='';
  });
  var erro=document.getElementById('cli-erro');
  erro.style.display='none';
}

function salvarClientePagina(){
  var nome  = document.getElementById('cli-nome').value.trim();
  var cpf   = document.getElementById('cli-cpf').value.trim();
  var tel   = document.getElementById('cli-tel').value.trim();
  var email = document.getElementById('cli-email').value.trim();
  var erro  = document.getElementById('cli-erro');

  if(!nome || !cpf){
    erro.textContent = 'Preencha os campos obrigatórios: Nome e CPF (*)';
    erro.style.cssText = 'display:block;background:rgba(231,76,60,.13);border:1px solid rgba(231,76,60,.4);border-radius:6px;padding:8px 12px;color:#c0392b;font-size:.82rem;margin:6px 0 10px;';
    return;
  }
  // Verifica CPF duplicado
  var clientes = _getClientes();
  var cpfLimpo = cpf.replace(/\D/g,'');
  if(cpfLimpo.length === 11){
    var dup = clientes.find(function(c){ return c.cpf.replace(/\D/g,'') === cpfLimpo; });
    if(dup){
      erro.textContent = 'Já existe um cliente cadastrado com este CPF: ' + dup.nome;
      erro.style.cssText = 'display:block;background:rgba(231,76,60,.13);border:1px solid rgba(231,76,60,.4);border-radius:6px;padding:8px 12px;color:#c0392b;font-size:.82rem;margin:6px 0 10px;';
      return;
    }
  }

  var novoClienteP = { nome:nome, cpf:cpf, tel:tel, email:email };
  clientes.push(novoClienteP);
  _setClientes(clientes);
  _atualizarSelectClientes();
  renderListaClientes();
  limparFormCliente();
  _supaInsertCliente(novoClienteP);

  erro.textContent = '✅ Cliente "' + nome + '" cadastrado com sucesso!';
  erro.style.cssText = 'display:block;background:rgba(39,174,96,.12);border:1px solid rgba(39,174,96,.4);border-radius:6px;padding:8px 12px;color:#1a7a3c;font-size:.82rem;margin:6px 0 10px;';
  setTimeout(function(){ erro.style.display='none'; }, 2800);
}

function excluirClientePagina(idx){
  var clientes = _getClientes();
  if(!confirm('Excluir o cliente "' + clientes[idx].nome + '"?')) return;
  var removidoCli = clientes[idx];
  clientes.splice(idx, 1);
  _setClientes(clientes);
  _atualizarSelectClientes();
  renderListaClientes();
  _supaDeleteCliente(removidoCli);
}

function renderListaClientes(filtro){
  var clientes = _getClientes();
  var lista    = document.getElementById('cli-lista');
  var vazia    = document.getElementById('cli-lista-vazia');
  if(!lista) return;
  lista.innerHTML = '';

  var exibir = filtro
    ? clientes.filter(function(c){
        var q = filtro.toLowerCase();
        return c.nome.toLowerCase().includes(q) || (c.cpf||'').includes(q);
      })
    : clientes;

  if(exibir.length === 0){
    vazia.style.display = 'block';
    return;
  }
  vazia.style.display = 'none';

  exibir.forEach(function(c, i){
    // índice real no array original
    var realIdx = clientes.indexOf(c);
    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;border:1px solid #b8c9a8;border-radius:8px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;';
    card.innerHTML =
      '<div style="flex:1;min-width:180px;">' +
        '<div style="font-weight:700;font-size:.9rem;color:#1a5c38;">' + c.nome + '</div>' +
        '<div style="font-size:.78rem;color:#666;margin-top:2px;">' +
          'CPF: ' + (c.cpf||'—') +
          (c.tel ? ' &nbsp;·&nbsp; Tel: ' + c.tel : '') +
          (c.email ? '<br>' + c.email : '') +
        '</div>' +
      '</div>' +
      '<button onclick="excluirClientePagina(' + realIdx + ')" ' +
        'style="background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:7px 14px;font-family:Nunito,sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;white-space:nowrap;">Excluir</button>';
    lista.appendChild(card);
  });
}

function filtrarClientes(){
  var q = document.getElementById('cli-busca').value.trim();
  renderListaClientes(q || null);
}

// Inicializa ao carregar
window.addEventListener('DOMContentLoaded', function(){
  _atualizarSelectClientes();
  renderListaClientes();
});

/* ===== FINAL ===== */
// ══ CADASTRO RESPONSÁVEL TÉCNICO ══
var _tecnicos = JSON.parse(_safeStorage.getItem('sas_tecnicos') || '[]');

function _salvarTecnicosLS(){
  _safeStorage.setItem('sas_tecnicos', JSON.stringify(_tecnicos));
}

function _atualizarSelectTecnicos(){
  var sel = document.getElementById('mg-tecnico-sel');
  // Mantém a primeira opção padrão e as originais fixas (índice 0 e 1)
  // Remove opções dinâmicas anteriores (a partir do índice 2)
  while(sel.options.length > 2) sel.remove(2);
  _tecnicos.forEach(function(t){
    var o = document.createElement('option');
    o.value = t.nome + '|' + t.titulo + '|' + t.registro;
    o.textContent = t.nome;
    sel.appendChild(o);
  });
}

function _renderListaTecnicos(){
  var wrap = document.getElementById('cad-tec-lista-wrap');
  var lista = document.getElementById('cad-tec-lista');
  var todos = _tecnicos;
  if(todos.length === 0){ wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  lista.innerHTML = '';
  todos.forEach(function(t, i){
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-bottom:1px solid #e0e7d0;font-size:.82rem;';
    row.innerHTML =
      '<span><strong>' + t.nome + '</strong> — ' + t.titulo + ' — Reg: ' + t.registro + '</span>' +
      '<button onclick="excluirTecnico(' + i + ')" style="background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:3px 9px;font-size:.75rem;cursor:pointer;font-family:\'Nunito\',sans-serif;">Excluir</button>';
    lista.appendChild(row);
  });
}

function abrirModalCadastroTecnico(){
  document.getElementById('cad-tec-nome').value = '';
  document.getElementById('cad-tec-titulo').value = '';
  document.getElementById('cad-tec-registro').value = '';
  document.getElementById('cad-tec-erro').style.display = 'none';
  _renderListaTecnicos();
  document.getElementById('modal-cad-tecnico').style.display = 'flex';
}

function fecharModalCadTecnico(){
  document.getElementById('modal-cad-tecnico').style.display = 'none';
}

function salvarTecnico(){
  var nome     = document.getElementById('cad-tec-nome').value.trim();
  var titulo   = document.getElementById('cad-tec-titulo').value.trim();
  var registro = document.getElementById('cad-tec-registro').value.trim();
  var erro     = document.getElementById('cad-tec-erro');

  if(!nome || !titulo || !registro){
    erro.textContent = 'Preencha todos os campos obrigatórios (*)';
    erro.style.display = 'block';
    return;
  }
  erro.style.display = 'none';

  var novoTec = { nome: nome, titulo: titulo, registro: registro };
  _tecnicos.push(novoTec);
  _salvarTecnicosLS();
  _atualizarSelectTecnicos();
  _renderListaTecnicos();
  _supaInsertTecnico(novoTec);

  // Limpa campos após salvar
  document.getElementById('cad-tec-nome').value = '';
  document.getElementById('cad-tec-titulo').value = '';
  document.getElementById('cad-tec-registro').value = '';

  // Feedback visual
  erro.style.cssText = 'display:block;background:rgba(39,174,96,.15);border:1px solid rgba(39,174,96,.4);border-radius:6px;padding:8px 12px;color:#1a7a3c;font-size:.82rem;margin-bottom:12px;';
  erro.textContent = '✅ Técnico cadastrado com sucesso!';
  setTimeout(function(){ erro.style.display='none'; erro.style.cssText=''; }, 2500);
}

function excluirTecnico(idx){
  if(!confirm('Excluir o técnico "' + _tecnicos[idx].nome + '"?')) return;
  var removidoTec = _tecnicos[idx];
  _tecnicos.splice(idx, 1);
  _salvarTecnicosLS();
  _atualizarSelectTecnicos();
  _renderListaTecnicos();
  tecRender();
  _supaDeleteTecnico(removidoTec);
}

// ══ PAGE TÉCNICOS: funções da aba Téc. Responsável ══
function tecLimpar(){
  ['tec-nome','tec-titulo','tec-registro'].forEach(function(id){
    document.getElementById(id).value='';
  });
  var e=document.getElementById('tec-erro');
  e.style.cssText='';
  e.style.display='none';
}

function tecSalvar(){
  var nome     = document.getElementById('tec-nome').value.trim();
  var titulo   = document.getElementById('tec-titulo').value.trim();
  var registro = document.getElementById('tec-registro').value.trim();
  var erro     = document.getElementById('tec-erro');

  if(!nome || !titulo || !registro){
    erro.textContent = 'Preencha todos os campos obrigatórios (*)';
    erro.style.cssText = 'display:block;background:rgba(231,76,60,.13);border:1px solid rgba(231,76,60,.4);border-radius:6px;padding:8px 12px;color:#c0392b;font-size:.82rem;margin:6px 0 10px;';
    return;
  }
  // Verifica duplicado por nome
  var dup = _tecnicos.find(function(t){ return t.nome.toUpperCase() === nome.toUpperCase(); });
  if(dup){
    erro.textContent = 'Já existe um técnico cadastrado com este nome.';
    erro.style.cssText = 'display:block;background:rgba(231,76,60,.13);border:1px solid rgba(231,76,60,.4);border-radius:6px;padding:8px 12px;color:#c0392b;font-size:.82rem;margin:6px 0 10px;';
    return;
  }

  var novoTecP = { nome: nome, titulo: titulo, registro: registro };
  _tecnicos.push(novoTecP);
  _salvarTecnicosLS();
  _atualizarSelectTecnicos();
  tecRender();
  tecLimpar();
  _supaInsertTecnico(novoTecP);

  erro.textContent = '✅ Técnico "' + nome + '" cadastrado com sucesso!';
  erro.style.cssText = 'display:block;background:rgba(39,174,96,.12);border:1px solid rgba(39,174,96,.4);border-radius:6px;padding:8px 12px;color:#1a7a3c;font-size:.82rem;margin:6px 0 10px;';
  setTimeout(function(){ erro.style.display='none'; }, 2800);
}

function tecExcluir(idx){
  if(!confirm('Excluir o técnico "' + _tecnicos[idx].nome + '"?')) return;
  var removidoTecP = _tecnicos[idx];
  _tecnicos.splice(idx, 1);
  _salvarTecnicosLS();
  _atualizarSelectTecnicos();
  _renderListaTecnicos();
  tecRender();
  _supaDeleteTecnico(removidoTecP);
}

function tecRender(filtro){
  var lista = document.getElementById('tec-lista');
  var vazia = document.getElementById('tec-lista-vazia');
  if(!lista) return;
  lista.innerHTML = '';

  var exibir = filtro
    ? _tecnicos.filter(function(t){ return t.nome.toLowerCase().includes(filtro.toLowerCase()); })
    : _tecnicos;

  if(exibir.length === 0){ vazia.style.display='block'; return; }
  vazia.style.display = 'none';

  exibir.forEach(function(t){
    var realIdx = _tecnicos.indexOf(t);
    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;border:1px solid #b8c9a8;border-radius:8px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;';
    card.innerHTML =
      '<div style="flex:1;min-width:180px;">' +
        '<div style="font-weight:700;font-size:.9rem;color:#1a5c38;">' + t.nome + '</div>' +
        '<div style="font-size:.78rem;color:#666;margin-top:2px;">' +
          t.titulo + ' &nbsp;·&nbsp; Reg: ' + t.registro +
        '</div>' +
      '</div>' +
      '<button onclick="tecExcluir(' + realIdx + ')" ' +
        'style="background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:7px 14px;font-family:Nunito,sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;white-space:nowrap;">Excluir</button>';
    lista.appendChild(card);
  });
}

function tecFiltrar(){
  var q = document.getElementById('tec-busca').value.trim();
  tecRender(q || null);
}

// Inicializa o select e a lista ao carregar a página
window.addEventListener('DOMContentLoaded', function(){ _atualizarSelectTecnicos(); tecRender(); });