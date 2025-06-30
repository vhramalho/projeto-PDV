// saida.js
document.getElementById("confirmar").addEventListener("click", () => {
    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const valor = parseFloat(document.getElementById("valor").value);

    if (!nome || !descricao || isNaN(valor) || valor <= 0) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const dataIso = localStorage.getItem("dataAtual");
    const [ano, mes, dia] = dataIso.split("-");
    const dataAtual = `${dia}/${mes}/${ano}`; // "30/06/2025"

    const novaMovimentacao = {
        id: Date.now(),
        tipo: "saida",
        nome,
        descricao,
        valor,
        data: dataAtual
    };

    const movs = JSON.parse(localStorage.getItem("movimentacoes")) || [];
    movs.push(novaMovimentacao);
    localStorage.setItem("movimentacoes", JSON.stringify(movs));

    window.location.href = "index.html";
});