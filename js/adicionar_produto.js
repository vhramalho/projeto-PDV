document.addEventListener('DOMContentLoaded', async () => {
const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get('id');

const nomeInput = document.getElementById('nome');
const valorInput = document.getElementById('valor');
const quantidadeInput = document.getElementById('quantidade');
const fotoInput = document.getElementById('foto');
const btnConfirmar = document.getElementById('confirmar');

let produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];

if (idParam) {
const produtoEditar = produtosSalvos.find(p => p.id === Number(idParam));
if (produtoEditar) {
nomeInput.value = produtoEditar.nome;
valorInput.value = produtoEditar.valor;
quantidadeInput.value = produtoEditar.quantidade;

// não dá pra preencher o input file por segurança, mas podemos guardar a imagem antiga
fotoInput.setAttribute('data-img', produtoEditar.imagem || '');
}
}

btnConfirmar.addEventListener('click', async () => {
const nome = nomeInput.value.trim();
const valor = parseFloat(valorInput.value);
const quantidade = parseInt(quantidadeInput.value);
const imagemAntiga = fotoInput.getAttribute('data-img');

if (!nome || isNaN(valor) || isNaN(quantidade)) {
alert("Preencha todos os campos corretamente.");
return;
}

let imagemBase64 = imagemAntiga;
if (fotoInput.files.length > 0) {
const file = fotoInput.files[0];
imagemBase64 = await toBase64(file);
}

if (idParam) {
// Editando
const index = produtosSalvos.findIndex(p => p.id === Number(idParam));
if (index !== -1) {
produtosSalvos[index] = {
id: Number(idParam),
nome,
valor,
quantidade,
imagem: imagemBase64
};
}
} else {
// Novo
produtosSalvos.push({
id: Date.now(),
nome,
valor,
quantidade,
imagem: imagemBase64
});
}

localStorage.setItem('produtos', JSON.stringify(produtosSalvos));

// Mostrar modal
const modal = document.querySelector('.modal');
modal.style.display = 'flex';

document.querySelector('.botao-confirmar').addEventListener('click', () => {
window.location.href = "estoque.html";
});
});
});

function toBase64(file) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = () => resolve(reader.result);
reader.onerror = error => reject(error);
reader.readAsDataURL(file);
});
}