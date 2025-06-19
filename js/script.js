// Alternar visibilidade do valor do caixa
const botaoCaixa = document.getElementById('toggle-caixa');
const valorCaixa = document.getElementById('valor-caixa');
let caixaVisivel = true;

botaoCaixa.addEventListener('click', () => {
  caixaVisivel = !caixaVisivel;
  valorCaixa.textContent = caixaVisivel ? 'R$100,00' : '••••••';
});

// Alternar botões flutuantes
const botaoToggle = document.getElementById('toggle-botoes');
const botoesFlutuantes = document.getElementById('botoes-flutuantes');
let botoesVisiveis = false;

botaoToggle.addEventListener('click', () => {
  botoesVisiveis = !botoesVisiveis;
  botoesFlutuantes.style.display = botoesVisiveis ? 'block' : 'none';
});
function toggleOpcoes(elemento) {
  elemento.classList.toggle('ativo');
}
// Abrir o primeiro modal ao clicar no botão de cadeado
document.getElementById("botao-cadeado").addEventListener("click", () => {
  abrirModal(1);
});

// Abre o modal com ID correspondente
function abrirModal(numero) {
  document.getElementById(`modal${numero}`).style.display = "flex";
}

// Fecha o modal atual
function fecharModal(numero) {
  document.getElementById(`modal${numero}`).style.display = "none";
}

// Fecha o modal atual e abre o próximo
function proximoModal(numero) {
  fecharModal(numero - 1);
  abrirModal(numero);
}

// Finaliza o fechamento do caixa (reseta tela visualmente)
function finalizarFechamento() {
  fecharModal(4);

  // Aqui é só visual por enquanto:
  // Zera os valores exibidos (exemplo)
  function finalizarFechamento() {
    fecharModal(4);

    // ❌ NÃO zera o valor do caixa — ele deve manter o saldo final

    // ✅ Zera os valores de entrada e saída
    const resumoEntrada = document.querySelector(".resumo-entrada");
    const resumoSaida = document.querySelector(".resumo-saida");
    if (resumoEntrada) resumoEntrada.textContent = "+0,00";
    if (resumoSaida) resumoSaida.textContent = "-0,00";

    // ✅ Remove as movimentações da tela
    const container = document.querySelector(".movimentacoes");
    if (container) container.innerHTML = "<h3>Movimentações</h3>";
  }

  const resumoEntrada = document.querySelector(".resumo-entrada");
  const resumoSaida = document.querySelector(".resumo-saida");
  if (resumoEntrada) resumoEntrada.textContent = "+0,00";
  if (resumoSaida) resumoSaida.textContent = "-0,00";

  // Se quiser apagar as movimentações da lista, pode usar:
  const container = document.querySelector(".movimentacoes");
  if (container) container.innerHTML = "<h3>Movimentações</h3>";

  //Atualiza a data após fechar o caixa
  document.getElementById("data-caixa").innerHTML = '<h2>11 de julho</h2>';
}
let movimentoParaExcluir = null;

// Detecta clique em qualquer botão .excluir dentro de .movimento
document.querySelectorAll('.movimento').forEach(mov => {
  mov.addEventListener('click', (e) => {
    const botao = e.target;
    if (botao.classList.contains('excluir')) {
      e.stopPropagation(); // impede de abrir ou fechar outras divs
      movimentoParaExcluir = botao.closest('.movimento');
      document.getElementById('modal-excluir').style.display = 'flex';
    }
  });
});

// Quando clicar em "Sim"
document.getElementById("confirmar-exclusao").addEventListener("click", () => {
  if (movimentoParaExcluir) {
    movimentoParaExcluir.remove();
    movimentoParaExcluir = null;
  }
  document.getElementById("modal-excluir").style.display = "none";
});

// Quando clicar em "Não"
document.getElementById("cancelar-exclusao").addEventListener("click", () => {
  movimentoParaExcluir = null;
  document.getElementById("modal-excluir").style.display = "none";
});
