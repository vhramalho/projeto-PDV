// ==============================
// ENTRADA - Registrar movimentação de entrada
// ==============================

// Quando o botão "Confirmar" for clicado...
document.getElementById("confirmar").addEventListener("click", () => {

    // Captura os valores dos campos
    const nome = document.getElementById("nome").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const valor = parseFloat(document.getElementById("valor").value);

    // Validação dos campos
    if (!nome || !descricao || isNaN(valor) || valor <= 0) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    // Pega a data atual no formato salvo no localStorage
    const dataIso = localStorage.getItem("dataAtual"); // formato YYYY-MM-DD
    const [ano, mes, dia] = dataIso.split("-");
    const dataAtual = `${dia}/${mes}/${ano}`; // transforma para DD/MM/YYYY

    // Cria a nova movimentação de entrada
    const novaMovimentacao = {
        id: Date.now(), // identificador único
        tipo: "entrada", // tipo da movimentação
        nome,
        descricao,
        valor,
        data: dataAtual // data formatada
    };

    // Puxa movimentações existentes e adiciona a nova
    const movs = JSON.parse(localStorage.getItem("movimentacoes")) || [];
    movs.push(novaMovimentacao);
    localStorage.setItem("movimentacoes", JSON.stringify(movs));

    // Redireciona para a página principal
    window.location.href = "index.html";
});