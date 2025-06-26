document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.estoque');

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        // 🔥 Aqui adiciona o comportamento de clique
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
        opcoesDiv.style.display = 'none'; // 🔒 começa escondido

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('editar');
        btnEditar.textContent = '📝';

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('excluir');
        btnExcluir.textContent = '🗑️';

        btnExcluir.setAttribute('data-id', produto.id);

        btnExcluir.addEventListener('click', (event) => {
            event.stopPropagation(); // impede o clique de abrir o menu de opções
            const id = event.target.getAttribute('data-id');
            excluirProduto(id);
        });

        opcoesDiv.appendChild(btnEditar);
        opcoesDiv.appendChild(btnExcluir);

        produtoDiv.appendChild(img);
        produtoDiv.appendChild(infoDiv);
        produtoDiv.appendChild(opcoesDiv);

        container.appendChild(produtoDiv);
    });
});

function excluirProduto(id) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const novosProdutos = produtos.filter(produto => produto.id !== Number(id));
    localStorage.setItem('produtos', JSON.stringify(novosProdutos));
    location.reload(); // recarrega a página para atualizar a lista
}