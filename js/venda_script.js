document.addEventListener('DOMContentLoaded', function () {
    // Elementos principais da interface
    const container = document.querySelector('.produtos-grid');
    const resumoItens = document.querySelector('.resumo-venda span:nth-child(1)');
    const resumoTotal = document.querySelector('.resumo-venda span:nth-child(2)');

    // Dados do localStorage
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    // Cria os cards dos produtos com base no estoque
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('item-produto');
        card.setAttribute('data-id', produto.id);
        card.setAttribute('data-estoque', produto.quantidade);

        // Verifica se esse produto já estava na sacola
        const produtoNaSacola = sacola.find(item => item.id === produto.id);
        const quantidadeAtual = produtoNaSacola ? produtoNaSacola.quantidade : 0;

        card.innerHTML = `
<img src="${produto.imagem || 'img/placeholder.png'}" alt="${produto.nome}">
<p>R$${parseFloat(produto.valor).toFixed(2)}</p>
<div class="controle-quantidade">
<button class="menos">−</button>
<span class="quantidade">${quantidadeAtual}</span>
<button class="mais">+</button>
</div>
`;

        container.appendChild(card);
    });

    // Evento para controlar clique nos botões de + e -
    container.addEventListener('click', (event) => {
        const botao = event.target;
        const card = botao.closest('.item-produto');
        if (!card) return;

        const id = Number(card.getAttribute('data-id'));
        const estoque = Number(card.getAttribute('data-estoque'));

        // Busca os dados do produto
        const produto = produtos.find(p => p.id === id);
        const preco = produto.valor;
        const nome = produto.nome;
        const img = produto.imagem;
        const quantidadeSpan = card.querySelector('.quantidade');
        let atual = Number(quantidadeSpan.textContent);

        // Aumenta ou diminui a quantidade conforme botão clicado
        if (botao.classList.contains('mais') && atual < estoque) {
            atual++;
        } else if (botao.classList.contains('menos') && atual > 0) {
            atual--;
        }

        quantidadeSpan.textContent = atual;

        // Atualiza ou remove da sacola
        const existente = sacola.find(item => item.id === id);
        if (existente) {
            if (atual === 0) {
                sacola = sacola.filter(item => item.id !== id);
            } else {
                existente.quantidade = atual;
            }
        } else if (atual > 0) {
            sacola.push({ id, nome, valor: preco, imagem: img, quantidade: atual, estoque });
        }

        atualizarResumo();
    });

    // Atualiza o resumo da sacola (quantidade total e valor)
    function atualizarResumo() {
        const totalItens = sacola.reduce((soma, item) => soma + item.quantidade, 0);
        const totalValor = sacola.reduce((soma, item) => soma + item.quantidade * item.valor, 0);

        resumoItens.innerHTML = `<strong>Itens:</strong> ${totalItens}`;
        resumoTotal.innerHTML = `<strong>Total:</strong> R$${totalValor.toFixed(2)}`;

        localStorage.setItem('sacola', JSON.stringify(sacola));
    }

    // Inicializa a tela com os valores atuais
    atualizarResumo();

    // Botão "voltar para início" limpa a sacola antes de voltar
    document.getElementById('voltar-para-inicio').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('sacola');
        window.location.href = 'index.html';
    });
});