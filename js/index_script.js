document.addEventListener("DOMContentLoaded", () => {
    // Elementos principais da tela
    const dataCaixa = document.getElementById("data-caixa");
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

    // Função que exibe a data atual formatada
    function exibirDataAtual() {
        let dataAtual = localStorage.getItem("dataAtual");
        if (!dataAtual) {
            const hoje = new Date();
            const [dia, mes, ano] = hoje.toLocaleDateString("pt-BR").split("/");
            dataAtual = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
            localStorage.setItem("dataAtual", dataAtual);
        }

        const [ano, mes, dia] = dataAtual.split("-");
        const dataFormatada = new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "long"
        });
        dataCaixa.innerHTML = `<h2>${dataFormatada}</h2>`;
    }

    exibirDataAtual();

    // Atualiza saldo e movimentações na tela
    function atualizarTelaInicial() {
        const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];

        // Evita duplicação visual
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

        valorCaixa.textContent = caixaVisivel ? `R$${saldo.toFixed(2)}` : "••••••";
        resumoEntrada.textContent = "+" + totalEntrada.toFixed(2);
        resumoSaida.textContent = "-" + totalSaida.toFixed(2);
    }

    botaoCaixa.addEventListener("click", () => {
        caixaVisivel = !caixaVisivel;
        atualizarTelaInicial(); // agora sem duplicação
    });

    botaoToggle.addEventListener("click", () => {
        botoesVisiveis = !botoesVisiveis;
        botoesFlutuantes.style.display = botoesVisiveis ? "block" : "none";
    });

    window.toggleOpcoes = function (el) {
        el.classList.toggle("ativo");
    };

    document.getElementById("botao-cadeado").addEventListener("click", () => abrirModal(1));

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

    function fecharModal(num) {
        document.getElementById("modal" + num).style.display = "none";
    }

    function proximoModal(num) {
        fecharModal(num - 1);
        abrirModal(num);
    }

    window.fecharModal = fecharModal;
    window.proximoModal = proximoModal;

    // Fechamento de caixa
    window.finalizarFechamento = () => {
        fecharModal(4);

        const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
        const historico = JSON.parse(localStorage.getItem("historico")) || [];

        const dataAtual = localStorage.getItem("dataAtual");
        const [ano, mes, dia] = dataAtual.split("-");
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const movsComData = movimentacoes.map(mov => ({
            ...mov, data: dataFormatada
        }));

        localStorage.setItem("historico", JSON.stringify([...historico, ...movsComData]));

        let saldoAcumulado = parseFloat(localStorage.getItem("saldoAcumulado")) || 0;
        movimentacoes.forEach(mov => {
            if (mov.tipo === "entrada" || mov.tipo === "venda") saldoAcumulado += mov.valor;
            else if (mov.tipo === "saida") saldoAcumulado -= mov.valor;
        });
        localStorage.setItem("saldoAcumulado", saldoAcumulado.toFixed(2));
        localStorage.removeItem("movimentacoes");

        const novaData = new Date(dataAtual);
        novaData.setDate(novaData.getDate() + 1);
        localStorage.setItem("dataAtual", novaData.toISOString().split("T")[0]);

        exibirDataAtual();
        atualizarTelaInicial();
        window.location.reload();
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
            const removida = movimentacoes.splice(index, 1)[0];

            if (removida?.tipo === "venda") {
                let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
                const linhas = removida.descricao.split("<br>");
                linhas.forEach(linha => {
                    const partes = linha.trim().split(" ");
                    const qtd = parseInt(partes[0]);
                    const nome = partes.slice(1).join(" ");
                    const prod = produtos.find(p => p.nome === nome);
                    if (prod) prod.quantidade += qtd;
                });
                localStorage.setItem("produtos", JSON.stringify(produtos));
            }

            localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
            atualizarTelaInicial();
            document.getElementById("modal-excluir").style.display = "none";
            movimentoParaExcluir = null;
            window.location.reload();
        }
    });

    document.getElementById("cancelar-exclusao").addEventListener("click", () => {
        document.getElementById("modal-excluir").style.display = "none";
        movimentoParaExcluir = null;
    });

    // Menu lateral
    const botaoMenu = document.getElementById("botao-menu");
    const menuLateral = document.getElementById("menu-lateral");
    const fundoEscuro = document.getElementById("fundo-escuro");

    botaoMenu.addEventListener("click", () => {
        menuLateral.classList.add("aberto");
        fundoEscuro.classList.add("ativo");
    });

    fundoEscuro.addEventListener("click", () => {
        menuLateral.classList.remove("aberto");
        fundoEscuro.classList.remove("ativo");
    });

    atualizarTelaInicial(); // chamada única, fora dos eventos
});