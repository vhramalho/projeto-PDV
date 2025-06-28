document.addEventListener("DOMContentLoaded", () => {
const valorCaixa = document.getElementById("valor-caixa");
const botaoCaixa = document.getElementById("toggle-caixa");
const botaoToggle = document.getElementById("toggle-botoes");
const botoesFlutuantes = document.getElementById("botoes-flutuantes");
const movimentacoesContainer = document.querySelector(".movimentacoes");
const resumoEntrada = document.querySelector(".resumo-entrada");
const resumoSaida = document.querySelector(".resumo-saida");

let caixaVisivel = true;
let botoesVisiveis = false;
let movimentoParaExcluir = null;

// Exibe o saldo e movimentações reais
function atualizarTelaInicial() {
const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];

// Reset visual
movimentacoesContainer.innerHTML = "<h3>Movimentações</h3>";
let saldo = 0;
let totalEntrada = 0;
let totalSaida = 0;

movimentacoes.forEach((mov, index) => {
const div = document.createElement("div");
div.classList.add("movimento", mov.tipo);
div.setAttribute("data-index", index);
div.setAttribute("onclick", "toggleOpcoes(this)");

const cor = mov.tipo === "entrada" ? "cor-azul" : mov.tipo === "saida" ? "cor-vermelha" : "cor-verde";
const corValor = mov.tipo === "saida" ? "vermelho" : "verde";
const sinal = mov.tipo === "saida" ? "-" : "+";

div.innerHTML = `
<div class="barra ${cor}"></div>
<div class="info">
<strong>${mov.nome}</strong>
<p>${mov.descricao || ""}</p>
</div>
<span class="valor ${corValor}">R$${parseFloat(mov.valor).toFixed(2)}</span>
<div class="opcoes">
<button class="editar">📝</button>
<button class="excluir">🗑️</button>
</div>
`;
movimentacoesContainer.appendChild(div);

if (mov.tipo === "entrada") {
saldo += mov.valor;
totalEntrada += mov.valor;
} else if (mov.tipo === "saida") {
saldo -= mov.valor;
totalSaida += mov.valor;
} else if (mov.tipo === "venda") {
saldo += mov.valor;
totalEntrada += mov.valor;
}
});

valorCaixa.textContent = caixaVisivel ? "R$" + saldo.toFixed(2) : "••••••";
resumoEntrada.textContent = "+" + totalEntrada.toFixed(2);
resumoSaida.textContent = "-" + totalSaida.toFixed(2);
}

// Alternar visibilidade do saldo
botaoCaixa.addEventListener("click", () => {
caixaVisivel = !caixaVisivel;
atualizarTelaInicial();
});

// Mostrar/ocultar botões flutuantes
botaoToggle.addEventListener("click", () => {
botoesVisiveis = !botoesVisiveis;
botoesFlutuantes.style.display = botoesVisiveis ? "block" : "none";
});

// Ativar/desativar opções da movimentação
window.toggleOpcoes = function (elemento) {
elemento.classList.toggle("ativo");
};

// Botão de cadeado abre o modal de fechamento
document.getElementById("botao-cadeado").addEventListener("click", () => {
abrirModal(1);
});

function abrirModal(numero) {
document.getElementById("modal" + numero).style.display = "flex";
}

function fecharModal(numero) {
document.getElementById("modal" + numero).style.display = "none";
}

function proximoModal(numero) {
fecharModal(numero - 1);
abrirModal(numero);
}

window.fecharModal = fecharModal;
window.proximoModal = proximoModal;

// Botão confirmar fechamento do caixa
window.finalizarFechamento = () => {
fecharModal(4);
localStorage.removeItem("movimentacoes");
atualizarTelaInicial();
document.getElementById("data-caixa").innerHTML = `<h2>${new Date().toLocaleDateString("pt-BR")}</h2>`;
};

// Exclusão de movimentação
document.addEventListener("click", (e) => {
if (e.target.classList.contains("excluir")) {
e.stopPropagation();
movimentoParaExcluir = e.target.closest(".movimento");
document.getElementById("modal-excluir").style.display = "flex";
}
});

document.getElementById("confirmar-exclusao").addEventListener("click", () => {
const index = movimentoParaExcluir?.getAttribute("data-index");
if (index !== null) {
const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
movimentacoes.splice(index, 1);
localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
atualizarTelaInicial();
}
document.getElementById("modal-excluir").style.display = "none";
movimentoParaExcluir = null;
});

document.getElementById("cancelar-exclusao").addEventListener("click", () => {
document.getElementById("modal-excluir").style.display = "none";
movimentoParaExcluir = null;
});

atualizarTelaInicial();
});