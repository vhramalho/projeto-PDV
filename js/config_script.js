document.getElementById("resetar-app").addEventListener("click", () => {
    document.getElementById("modal-resetar").style.display = "flex";
});

document.getElementById("cancelar-reset").addEventListener("click", () => {
    document.getElementById("modal-resetar").style.display = "none";
});

document.getElementById("confirmar-reset").addEventListener("click", () => {
    localStorage.clear();
    //Define a data real do sistema como nova dataAtual
    const hoje = new Date().toISOString().split("T")[0]; //formato yyy-mm-dd
    localStorage.setItem("dataAtual", hoje);
    alert("Aplicativo resetado com sucesso!");
    window.location.href = "index.html"; // volta pra tela inicial
});