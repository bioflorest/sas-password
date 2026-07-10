function _getClientes(){
  return JSON.parse(_safeStorage.getItem('sas_clientes') || '[]');
}
function _setClientes(arr){
  _safeStorage.setItem('sas_clientes', JSON.stringify(arr));
}

function _atualizarSelectClientes(){
  var sel = document.getElementById('sas-cliente');
  var valorAtual = sel.value;
  while(sel.options.length > 1) sel.remove(1);
  var clientes = _getClientes();
  clientes.forEach(function(c, i){
    var o = document.createElement('option');
    o.value = String(i);
    o.textContent = c.nome;
    sel.appendChild(o);
  });
  // Restaura seleção se ainda existir
  if(valorAtual) sel.value = valorAtual;
}

function preencherCliente(sel){
  var v = sel.value;
  var nomeEl = document.getElementById('sas-nome');
  var cpfEl  = document.getElementById('sas-cpf');
  document.getElementById('sas-opcoes').style.display='none';
  if(v !== ''){
    var clientes = _getClientes();
    var c = clientes[parseInt(v)];
    if(c){
      nomeEl.value = c.nome;
      cpfEl.value  = c.cpf || '';
      nomeEl.readOnly = true; cpfEl.readOnly = true;
      nomeEl.style.background='#f0f0f0'; nomeEl.style.color='#666';
      cpfEl.style.background='#f0f0f0';  cpfEl.style.color='#666';
      return;
    }
  }
  nomeEl.value=''; cpfEl.value='';
  nomeEl.readOnly=false; cpfEl.readOnly=false;
  nomeEl.style.background=''; nomeEl.style.color='';
  cpfEl.style.background='';  cpfEl.style.color='';
}

function limparCampos(){
  document.getElementById('sas-cliente').value='';
  var nome=document.getElementById('sas-nome');
  var cpf=document.getElementById('sas-cpf');
  nome.value=''; nome.readOnly=false; nome.style.background=''; nome.style.color='';
  cpf.value='';  cpf.readOnly=false;  cpf.style.background=''; cpf.style.color='';
  document.getElementById('sas-opcoes').style.display='none';
}

function confirmarCliente(){
  var nome=document.getElementById('sas-nome').value.trim();
  if(!nome){alert('Por favor, selecione ou informe um cliente.');return;}
  document.getElementById('sas-opcoes').style.display='block';
}

function escolherOpcao(tipo){
  if(tipo==='com'){
    abrirRecFerti();
  } else {
    abrirRecSemSolo();
  }
}

/* ══ REC SEM SOLO ══ */
var _ssTipoCultura = '';

function abrirRecSemSolo(){
  _ssTipoCultura = '';
  ['ss-cult-panel','ss-entradas-panel','ss-resultados','ss-gerar-btn'].forEach(function(id){
    document.getElementById(id).style.display = 'none';
  });
  ['ss-result-ha','ss-result-total','ss-result-formulas','ss-result-obs'].forEach(function(id){
    document.getElementById(id).value = '';
  });
  document.getElementById('ss-btn-temp').style.outline = 'none';
  document.getElementById('ss-btn-perm').style.outline = 'none';
  document.getElementById('modal-sem-solo').style.display = 'flex';
}

function fecharRecSemSolo(){
  document.getElementById('modal-sem-solo').style.display = 'none';
}