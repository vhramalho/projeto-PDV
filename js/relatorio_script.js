// ================================
// RELATORIO_SCRIPT.JS
// Script responsável por carregar os valores do relatório geral (dia, semana, mês, ano)
// ================================

document.addEventListener("DOMContentLoaded", () => {

    // 📅 Pega a data atual salva no sistema
    const dataAtualStr = localStorage.getItem("dataAtual"); // formato: yyyy-mm-dd
    if (!dataAtualStr) return;

    const [anoAtual, mesAtual, diaAtual] = dataAtualStr.split("-").map(Number);
    const dataAtual = new Date(anoAtual, mesAtual - 1, diaAtual);

    // 📚 Histórico completo de movimentações
    const historico = JSON.parse(localStorage.getItem("historico")) || [];

    // 🔁 Dia anterior
    const diaAnterior = new Date(dataAtual);
    diaAnterior.setDate(diaAnterior.getDate() - 1);
    const diaAnteriorStr = diaAnterior.toLocaleDateString("pt-BR");

    // 📆 Semana atual (domingo a sábado)
    const primeiroDiaSemana = new Date(dataAtual);
    primeiroDiaSemana.setDate(dataAtual.getDate() - dataAtual.getDay());

    const ultimoDiaSemana = new Date(dataAtual);
    ultimoDiaSemana.setDate(dataAtual.getDate() + (6 - dataAtual.getDay()));

    // 🔎 Função que filtra o histórico com base em um critério (dia, semana, mês, ano)
    function filtrarPorPeriodo(filtroFn) {
        return historico.filter(mov => {
            const [dia, mes, ano] = mov.data.split("/").map(Number);
            const dataMov = new Date(ano, mes - 1, dia);
            return filtroFn(dataMov);
        });
    }

    // 💰 Função que calcula entradas, saídas e saldo
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

    // 🧩 Preenche um bloco do HTML com os valores
    function preencherBloco(id, valores) {
        const bloco = document.querySelector(id);
        if (!bloco) return;
        bloco.querySelector(".entrada").textContent = `R$${valores.entrada}`;
        bloco.querySelector(".saida").textContent = `R$${valores.saida}`;
        bloco.querySelector(".saldo").textContent = `R$${valores.saldo}`;
    }

    // 📊 Preencher todos os blocos com os dados filtrados
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
});