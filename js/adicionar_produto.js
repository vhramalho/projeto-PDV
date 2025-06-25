document.getElementById('confirmar').addEventListener('click', async () => {
    const nome = document.getElementById('nome').value.trim();
    const valor = parseFloat(document.getElementById('valor').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const fotoInput = document.getElementById('foto');

    if (!nome || isNaN(valor) || isNaN(quantidade)) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    let imagemBase64 = '';
    if (fotoInput.files.length > 0) {
        const file = fotoInput.files[0];
        imagemBase64 = await toBase64(file);
    }

    const novoProduto = {
        id: Date.now(),
        nome,
        valor,
        quantidade,
        imagem: imagemBase64
    };

    const produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtosSalvos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtosSalvos));

    alert("Produto adicionado com sucesso!");
    window.location.href = "estoque.html";
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}