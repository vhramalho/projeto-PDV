document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.estoque');

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    produtos.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        const img = document.createElement('img');
        img.src = produto.imagem || 'img/placeholder.png';
        img.alt = produto.nome;

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
        infoDiv.innerHTML = `<strong>${produto.nome}</strong><p>Qtd: ${produto.quantidade}<br>R$${parseFloat(produto.valor).toFixed(2)}</p>`;

        const opcoesDiv = document.createElement('div');
        opcoesDiv.classList.add('opcoes');

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('editar');
        btnEditar.textContent = '📝';

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('excluir');
        btnExcluir.textContent = '🗑️';

        opcoesDiv.appendChild(btnEditar);
        opcoesDiv.appendChild(btnExcluir);

        produtoDiv.appendChild(img);
        produtoDiv.appendChild(infoDiv);
        produtoDiv.appendChild(opcoesDiv);

        container.appendChild(produtoDiv);
    });
});
