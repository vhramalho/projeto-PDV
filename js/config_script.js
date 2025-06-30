document.getElementById("resetar-app").addEventListener("click", () => {
document.getElementById("modal-resetar").style.display = "flex";
});

document.getElementById("cancelar-reset").addEventListener("click", () => {
document.getElementById("modal-resetar").style.display = "none";
});

document.getElementById("confirmar-reset").addEventListener("click", () => {
localStorage.clear();
alert("Aplicativo resetado com sucesso!");
window.location.href = "index.html"; // volta pra tela inicial
});