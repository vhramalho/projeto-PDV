// utils: funções auxiliares reutilizáveis

// Exibe a data atual no topo da tela
function exibirDataAtual() {
    const dataCaixa = document.getElementById("data-caixa"); // agora funciona mesmo fora do index_script.js
    let dataAtual = localStorage.getItem("dataAtual");

    if (!dataAtual) {
        const hoje = new Date();
        const [dia, mes, ano] = hoje.toLocaleDateString("pt-BR").split("/");
        dataAtual = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
        localStorage.setItem("dataAtual", dataAtual);
    }

    const [ano, mes, dia] = dataAtual.split("-");
    const dataObj = new Date(ano, mes - 1, dia);

    const diasDaSemana = [
        "Domingo", "Segunda-feira", "Terça-feira",
        "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
    ];

    const nomeDia = diasDaSemana[dataObj.getDay()];
    const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long"
    });

    dataCaixa.innerHTML = `<h2>${nomeDia}<br>${dataFormatada}</h2>`;
}

// Atualiza o saldo e a lista de movimentações
function atualizarTelaInicial() {
    const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
    const movimentacoesContainer = document.querySelector(".movimentacoes");
    const valorCaixa = document.getElementById("valor-caixa");
    const resumoEntrada = document.querySelector(".resumo-entrada");
    const resumoSaida = document.querySelector(".resumo-saida");

    movimentacoesContainer.innerHTML = "<h3>Movimentações</h3>";

    let saldo = parseFloat(localStorage.getItem("saldoAcumulado")) || 0;
    let totalEntrada = 0;
    let totalSaida = 0;

    movimentacoes.forEach((mov, index) => {
        const div = document.createElement("div");
        div.classList.add("movimento", mov.tipo);
        div.setAttribute("data-index", index);
        div.setAttribute("onclick", "toggleOpcoes(this)");

        const cor = mov.tipo === "entrada" ? "cor-azul" :
            mov.tipo === "saida" ? "cor-vermelha" : "cor-verde";
        const corValor = mov.tipo === "saida" ? "vermelho" : "verde";

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

    const caixaVisivel = window.caixaVisivel !== false; // default true
    valorCaixa.textContent = caixaVisivel ? `R$${saldo.toFixed(2)}` : "••••••";
    resumoEntrada.textContent = "+" + totalEntrada.toFixed(2);
    resumoSaida.textContent = "-" + totalSaida.toFixed(2);
}

// Abre modal por número
function abrirModal(numero) {
    const modal = document.getElementById("modal" + numero);
    modal.style.display = "flex";

    if (numero === 2) {
        const estoque = JSON.parse(localStorage.getItem("produtos")) || [];
        const container = modal.querySelector(".estoque-simulacao");
        container.innerHTML = estoque.map(p => `<p>${p.nome}: ${p.quantidade} un</p>`).join("");
    }

    if (numero === 3) {
        const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
        const saldoDia = movimentacoes.reduce((total, mov) => {
            if (mov.tipo === "entrada" || mov.tipo === "venda") return total + mov.valor;
            if (mov.tipo === "saida") return total - mov.valor;
            return total;
        }, 0);
        const saldoAcumulado = parseFloat(localStorage.getItem("saldoAcumulado")) || 0;
        modal.querySelector("strong").textContent = "R$ " + (saldoAcumulado + saldoDia).toFixed(2);
    }
}

// Fecha modal pelo número
function fecharModal(numero) {
    document.getElementById("modal" + numero).style.display = "none";
}

// Vai para próximo modal
function proximoModal(numero) {
    fecharModal(numero - 1);
    abrirModal(numero);
}