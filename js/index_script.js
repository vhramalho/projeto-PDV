document.addEventListener("DOMContentLoaded", () => {
    // Exibe a data atual no topo
    const dataCaixa = document.getElementById("data-caixa");

    function exibirDataAtual() {
        let dataAtual = localStorage.getItem("dataAtual");

        if (!dataAtual) {
            // Se for a primeira vez, pega a data local do Brasil
            const hoje = new Date();
            const [dia, mes, ano] = hoje.toLocaleDateString("pt-BR").split("/");
            dataAtual = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`; // formato YYYY-MM-DD
            localStorage.setItem("dataAtual", dataAtual);
        }

        const [ano, mes, dia] = dataAtual.split("-");
        const dataFormatada = new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long"
        });

        dataCaixa.innerHTML = `<h2>${dataFormatada}</h2>`;
    }

    exibirDataAtual();
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

        // Pega saldo acumulado e soma com movimentações do dia
        let saldo = parseFloat(localStorage.getItem("saldoAcumulado")) || 0;
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
        const modal = document.getElementById("modal" + numero);
        modal.style.display = "flex";

        // Modal 2: Mostrar estoque real
        if (numero === 2) {
            const estoque = JSON.parse(localStorage.getItem("produtos")) || [];
            const container = modal.querySelector(".estoque-simulacao");
            container.innerHTML = estoque.map(p => `<p>${p.nome}: ${p.quantidade} un</p>`).join("");
        }

        // Modal 3: Mostrar saldo real (acumulado)
        if (numero === 3) {
            const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
            const saldoDia = movimentacoes.reduce((total, mov) => {
                if (mov.tipo === "entrada" || mov.tipo === "venda") return total + mov.valor;
                if (mov.tipo === "saida") return total - mov.valor;
                return total;
            }, 0);

            const saldoAcumulado = parseFloat(localStorage.getItem("saldoAcumulado")) || 0;
            const saldoTotal = saldoAcumulado + saldoDia;

            const container = modal.querySelector("strong");
            container.textContent = "R$ " + saldoTotal.toFixed(2);
        }
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

        const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
        const historico = JSON.parse(localStorage.getItem("historico")) || [];

        const dataAtual = localStorage.getItem("dataAtual");
        const [ano, mes, dia] = dataAtual.split("-");
        const dataFormatada = `${dia}/${mes}/${ano}`;

        // Adiciona data a cada movimentação antes de enviar ao histórico
        const movsComData = movimentacoes.map(mov => ({
            ...mov,
            data: dataFormatada
        }));

        // Adiciona ao histórico
        const historicoAtualizado = [...historico, ...movsComData];
        localStorage.setItem("historico", JSON.stringify(historicoAtualizado));

        // 👉 Atualiza saldo acumulado ANTES de limpar as movimentações
        let saldoAcumulado = parseFloat(localStorage.getItem("saldoAcumulado")) || 0;
        movimentacoes.forEach(mov => {
            if (mov.tipo === "entrada" || mov.tipo === "venda") {
                saldoAcumulado += mov.valor;
            } else if (mov.tipo === "saida") {
                saldoAcumulado -= mov.valor;
            }
        });
        localStorage.setItem("saldoAcumulado", saldoAcumulado.toFixed(2));

        // Agora sim: limpa movimentações do dia
        localStorage.removeItem("movimentacoes");

        // Avança o dia +1
        const novaData = new Date(dataAtual);
        novaData.setDate(novaData.getDate() + 1);
        const novaDataFormatada = novaData.toISOString().split("T")[0];
        localStorage.setItem("dataAtual", novaDataFormatada);

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

            // Se for venda, devolve ao estoque
            if (removida?.tipo === "venda") {
                let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

                // descricao vem como "3 batata<br>2 shampoo", separa e processa
                const linhas = removida.descricao.split("<br>");
                linhas.forEach(linha => {
                    const partes = linha.trim().split(" ");
                    const qtd = parseInt(partes[0]);
                    const nomeProduto = partes.slice(1).join(" ");
                    const produto = produtos.find(p => p.nome === nomeProduto);
                    if (produto) {
                        produto.quantidade += qtd;
                    }
                });

                localStorage.setItem("produtos", JSON.stringify(produtos));
            }

            // Salva as movimentações atualizadas
            localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
            atualizarTelaInicial();
        }

        document.getElementById("modal-excluir").style.display = "none";
        movimentoParaExcluir = null;

        window.location.reload();
    });

    document.getElementById("cancelar-exclusao").addEventListener("click", () => {
        document.getElementById("modal-excluir").style.display = "none";
        movimentoParaExcluir = null;
    });

    atualizarTelaInicial();

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
});