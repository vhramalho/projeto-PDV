document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.estoque');
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let idParaExcluir = null;

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        produtoDiv.addEventListener('click', function () {
            const opcoes = this.querySelector('.opcoes');
            opcoes.style.display = opcoes.style.display === 'flex' ? 'none' : 'flex';
        });

        const img = document.createElement('img');
        img.src = produto.imagem || 'img/placeholder.png';
        img.alt = produto.nome;

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
        infoDiv.innerHTML = `<strong>${produto.nome}</strong><p>Qtd: ${produto.quantidade}<br>R$${parseFloat(produto.valor).toFixed(2)}</p>`;

        const opcoesDiv = document.createElement('div');
        opcoesDiv.classList.add('opcoes');
        opcoesDiv.style.display = 'none';

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('editar');
        btnEditar.textContent = '📝';

        btnEditar.addEventListener('click', (event) => {
event.stopPropagation();
const id = produto.id;
window.location.href = `adicionar_produto.html?id=${id}`;
});

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('excluir');
        btnExcluir.textContent = '🗑️';
        btnExcluir.setAttribute('data-id', produto.id);

        btnExcluir.addEventListener('click', (event) => {
            event.stopPropagation();
            idParaExcluir = produto.id;
            document.getElementById('modal-confirmacao').style.display = 'flex';
        });

        opcoesDiv.appendChild(btnEditar);
        opcoesDiv.appendChild(btnExcluir);

        produtoDiv.appendChild(img);
        produtoDiv.appendChild(infoDiv);
        produtoDiv.appendChild(opcoesDiv);

        container.appendChild(produtoDiv);
    });

    // Botões do modal de confirmação
    document.getElementById('cancelar-exclusao').addEventListener('click', () => {
        document.getElementById('modal-confirmacao').style.display = 'none';
        idParaExcluir = null;
    });

    document.getElementById('confirmar-exclusao').addEventListener('click', () => {
        if (idParaExcluir) {
            excluirProduto(idParaExcluir);
            document.getElementById('modal-confirmacao').style.display = 'none';
        }
    });
});

function excluirProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const novosProdutos = produtos.filter(produto => produto.id !== Number(id));
    localStorage.setItem('produtos', JSON.stringify(novosProdutos));
    location.reload();
}