document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.produtos-grid');
    const resumoItens = document.querySelector('.resumo-venda span:nth-child(1)');
    const resumoTotal = document.querySelector('.resumo-venda span:nth-child(2)');

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let sacola = [];

    // Cria os cards dos produtos com base no estoque
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('item-produto');
        card.setAttribute('data-id', produto.id);
        card.setAttribute('data-estoque', produto.quantidade);

        card.innerHTML = `
<img src="${produto.imagem || 'img/placeholder.png'}" alt="${produto.nome}">
<p>R$${parseFloat(produto.valor).toFixed(2)}</p>
<div class="controle-quantidade">
<button class="menos">−</button>
<span class="quantidade">0</span>
<button class="mais">+</button>
</div>
`;

        container.appendChild(card);
    });

    // Lógica dos botões
    container.addEventListener('click', (event) => {
        const botao = event.target;
        const card = botao.closest('.item-produto');
        if (!card) return;

        const id = Number(card.getAttribute('data-id'));
        const estoque = Number(card.getAttribute('data-estoque'));
        const preco = produtos.find(p => p.id === id).valor;
        const nome = produtos.find(p => p.id === id).nome;
        const img = produtos.find(p => p.id === id).imagem;
        const quantidadeSpan = card.querySelector('.quantidade');
        let atual = Number(quantidadeSpan.textContent);
        

        if (botao.classList.contains('mais') && atual < estoque) {
            atual++;
        } else if (botao.classList.contains('menos') && atual > 0) {
            atual--;
        }

        quantidadeSpan.textContent = atual;

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

    function atualizarResumo() {
        const totalItens = sacola.reduce((soma, item) => soma + item.quantidade, 0);
        const totalValor = sacola.reduce((soma, item) => soma + item.quantidade * item.valor, 0);

        resumoItens.innerHTML = `<strong>Itens:</strong> ${totalItens}`;
        resumoTotal.innerHTML = `<strong>Total:</strong> R$${totalValor.toFixed(2)}`;

        localStorage.setItem('sacola', JSON.stringify(sacola));
    }
});