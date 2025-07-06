document.addEventListener('DOMContentLoaded', async () => {
    // Obtém o ID da URL, se estiver em modo de edição
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    // Seletores de input
    const nomeInput = document.getElementById('nome');
    const valorInput = document.getElementById('valor');
    const quantidadeInput = document.getElementById('quantidade');
    const fotoInput = document.getElementById('foto');
    const btnConfirmar = document.getElementById('confirmar');

    // Carrega produtos existentes do localStorage
    let produtosSalvos = JSON.parse(localStorage.getItem('produtos')) || [];

    // Se estiver em modo de edição, preenche os campos com os dados existentes
    if (idParam) {
        const produtoEditar = produtosSalvos.find(p => p.id === Number(idParam));
        if (produtoEditar) {
            nomeInput.value = produtoEditar.nome;
            valorInput.value = produtoEditar.valor;
            quantidadeInput.value = produtoEditar.quantidade;
            // Não dá pra preencher o input file, então salva a imagem antiga como atributo
            fotoInput.setAttribute('data-img', produtoEditar.imagem || '');
        }
    }

    // Ao clicar em Confirmar
    btnConfirmar.addEventListener('click', async () => {
        const nome = nomeInput.value.trim();
        const valor = parseFloat(valorInput.value);
        const quantidade = parseInt(quantidadeInput.value);
        const imagemAntiga = fotoInput.getAttribute('data-img');

        if (!nome || isNaN(valor) || isNaN(quantidade)) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        // Converte nova imagem para base64, se houver
        let imagemBase64 = imagemAntiga;
        if (fotoInput.files.length > 0) {
            const file = fotoInput.files[0];
            imagemBase64 = await toBase64(file);
        }

        if (idParam) {
            // Editando produto existente
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
            // Adicionando novo produto
            produtosSalvos.push({
                id: Date.now(),
                nome,
                valor,
                quantidade,
                imagem: imagemBase64
            });
        }

        // Salva no localStorage
        localStorage.setItem('produtos', JSON.stringify(produtosSalvos));

        // Mostra modal de sucesso
        const modal = document.querySelector('.modal');
        modal.style.display = 'flex';

        document.querySelector('.botao-confirmar').addEventListener('click', () => {
            window.location.href = "estoque.html";
        });
    });
});

// Função utilitária para converter imagem em base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}