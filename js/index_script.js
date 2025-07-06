// ⚠️ As funções exibirDataAtual, atualizarTelaInicial, abrirModal, fecharModal e proximoModal foram movidas para funcoes_utilitarias.js

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

    exibirDataAtual(dataCaixa);
    atualizarTelaInicial(valorCaixa, movimentacoesContainer, resumoEntrada, resumoSaida, caixaVisivel);

    // Alternar visibilidade do saldo
    botaoCaixa.addEventListener("click", () => {
        caixaVisivel = !caixaVisivel;
        atualizarTelaInicial(valorCaixa, movimentacoesContainer, resumoEntrada, resumoSaida, caixaVisivel);
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

        const movsComData = movimentacoes.map(mov => ({
            ...mov,
            data: dataFormatada
        }));

        const historicoAtualizado = [...historico, ...movsComData];
        localStorage.setItem("historico", JSON.stringify(historicoAtualizado));

        // Atualiza saldo acumulado
        let saldoAcumulado = parseFloat(localStorage.getItem("saldoAcumulado")) || 0;
        movimentacoes.forEach(mov => {
            if (mov.tipo === "entrada" || mov.tipo === "venda") {
                saldoAcumulado += mov.valor;
            } else if (mov.tipo === "saida") {
                saldoAcumulado -= mov.valor;
            }
        });
        localStorage.setItem("saldoAcumulado", saldoAcumulado.toFixed(2));

        // Limpa movimentações
        localStorage.removeItem("movimentacoes");

        // Avança o dia
        const novaData = new Date(dataAtual);
        novaData.setDate(novaData.getDate() + 1);
        const novaDataFormatada = novaData.toISOString().split("T")[0];
        localStorage.setItem("dataAtual", novaDataFormatada);



        setTimeout(() => {
            exibirDataAtual(dataCaixa);
            atualizarTelaInicial(valorCaixa, movimentacoesContainer, resumoEntrada, resumoSaida, caixaVisivel)
            location.reload(true);
        }, 100); // pequena pausa garante que o localStorage esteja atualizado
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
                    const nomeProduto = partes.slice(1).join(" ");
                    const produto = produtos.find(p => p.nome === nomeProduto);
                    if (produto) {
                        produto.quantidade += qtd;
                    }
                });
                localStorage.setItem("produtos", JSON.stringify(produtos));
            }

            localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
            atualizarTelaInicial(valorCaixa, movimentacoesContainer, resumoEntrada, resumoSaida, caixaVisivel);
        }

        document.getElementById("modal-excluir").style.display = "none";
        movimentoParaExcluir = null;
        window.location.reload();
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
});