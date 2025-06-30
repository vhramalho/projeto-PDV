document.addEventListener("DOMContentLoaded", () => {
    const dataAtualStr = localStorage.getItem("dataAtual"); // formato: yyyy-mm-dd
    if (!dataAtualStr) return;

    const [anoAtual, mesAtual, diaAtual] = dataAtualStr.split("-").map(Number);
    const dataAtual = new Date(anoAtual, mesAtual - 1, diaAtual);

    const historico = JSON.parse(localStorage.getItem("historico")) || [];

    // Data do dia anterior
    const diaAnterior = new Date(dataAtual);
    diaAnterior.setDate(diaAnterior.getDate() - 1);
    const diaAnteriorStr = diaAnterior.toLocaleDateString("pt-BR");

    // Intervalo da semana (domingo a sábado)
    const primeiroDiaSemana = new Date(dataAtual);
    primeiroDiaSemana.setDate(dataAtual.getDate() - dataAtual.getDay());

    const ultimoDiaSemana = new Date(dataAtual);
    ultimoDiaSemana.setDate(dataAtual.getDate() + (6 - dataAtual.getDay()));

    // Função para filtrar por condição de data
    function filtrarPorPeriodo(filtroFn) {
        return historico.filter(mov => {
            const [dia, mes, ano] = mov.data.split("/").map(Number);
            const dataMov = new Date(ano, mes - 1, dia);
            return filtroFn(dataMov);
        });
    }

    // Função para somar entradas e saídas
    function calcularValores(movs) {
        let entrada = 0;
        let saida = 0;

        movs.forEach(mov => {
            if (mov.tipo === "entrada" || mov.tipo === "venda") {
                entrada += mov.valor;
            } else if (mov.tipo === "saida") {
                saida += mov.valor;
            }
        });

        return {
            entrada: entrada.toFixed(2),
            saida: saida.toFixed(2),
            saldo: (entrada - saida).toFixed(2)
        };
    }

    // Função para preencher os blocos
    function preencherBloco(id, valores) {
        const bloco = document.querySelector(id);
        if (!bloco) return;
        bloco.querySelector(".entrada").textContent = `R$${valores.entrada}`;
        bloco.querySelector(".saida").textContent = `R$${valores.saida}`;
        bloco.querySelector(".saldo").textContent = `R$${valores.saldo}`;
    }

    // Preencher cada bloco
    preencherBloco("#bloco-dia", calcularValores(filtrarPorPeriodo(d =>
        d.toLocaleDateString("pt-BR") === diaAnteriorStr
    )));

    preencherBloco("#bloco-semana", calcularValores(filtrarPorPeriodo(d =>
        d >= primeiroDiaSemana && d <= ultimoDiaSemana
    )));

    preencherBloco("#bloco-mes", calcularValores(filtrarPorPeriodo(d =>
        d.getMonth() === dataAtual.getMonth() &&
        d.getFullYear() === dataAtual.getFullYear()
    )));

    preencherBloco("#bloco-ano", calcularValores(filtrarPorPeriodo(d =>
        d.getFullYear() === dataAtual.getFullYear()
    )));

    // Atualizar título do bloco "Mês" com nome do mês atual
    const nomeMes = dataAtual.toLocaleDateString("pt-BR", { month: "long" });
    const tituloMes = document.querySelector('#bloco-mes h4');
    if (tituloMes) tituloMes.textContent = `Mês (${nomeMes})`;

    // Atualizar título do bloco "Ano" com ano atual
    const tituloAno = document.querySelector('#bloco-ano h4');
    if (tituloAno) tituloAno.textContent = `Ano (${dataAtual.getFullYear()})`;
});