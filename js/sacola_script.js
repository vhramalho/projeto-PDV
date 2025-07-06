document.addEventListener('DOMContentLoaded', function () {
    // Elemento onde os produtos da sacola serão exibidos
    const sacolaLista = document.querySelector('.sacola-lista');

    // Elementos do resumo (quantidade total de itens e valor total)
    const resumoItens = document.querySelector('.resumo-venda span:nth-child(1)');
    const resumoTotal = document.querySelector('.resumo-venda span:nth-child(2)');

    // Recupera a sacola armazenada no localStorage
    let sacola = JSON.parse(localStorage.getItem('sacola')) || [];

    // Atualiza o resumo de itens e total
    function atualizarResumo() {
        const totalItens = sacola.reduce((soma, item) => soma + item.quantidade, 0);
        const totalValor = sacola.reduce((soma, item) => soma + (item.valor * item.quantidade), 0);
        resumoItens.innerHTML = `<strong>Itens:</strong> ${totalItens}`;
        resumoTotal.innerHTML = `<strong>Total:</strong> R$${totalValor.toFixed(2)}`;
    }

    // Salva a sacola no localStorage e atualiza o resumo
    function salvarESincronizar() {
        localStorage.setItem('sacola', JSON.stringify(sacola));
        atualizarResumo();
    }

    // Cria o HTML de um item da sacola e adiciona eventos de +, − e excluir
    function criarItemSacola(item, index) {
        const div = document.createElement('div');
        div.classList.add('item-sacola');

        div.innerHTML = `
<img src="${item.imagem || 'img/placeholder.png'}" alt="${item.nome}">
<div class="info">
<strong>${item.nome}</strong>
<p>R$${item.valor.toFixed(2)}</p>
</div>
<div class="controle">
<button class="menos">−</button>
<span class="quantidade">${item.quantidade}</span>
<button class="mais">+</button>
<button class="excluir">🗑️</button>
</div>
`;

        // Aumentar quantidade
        div.querySelector('.mais').addEventListener('click', () => {
            if (item.quantidade < item.estoque) {
                item.quantidade++;
                div.querySelector('.quantidade').textContent = item.quantidade;
                salvarESincronizar();
            }
        });

        // Diminuir quantidade
        div.querySelector('.menos').addEventListener('click', () => {
            if (item.quantidade > 1) {
                item.quantidade--;
                div.querySelector('.quantidade').textContent = item.quantidade;
                salvarESincronizar();
            }
        });

        // Excluir item
        div.querySelector('.excluir').addEventListener('click', () => {
            sacola.splice(index, 1);
            localStorage.setItem('sacola', JSON.stringify(sacola));
            location.reload(); // Recarrega para refletir as mudanças
        });

        return div;
    }

    // Monta visualmente todos os itens da sacola
    sacola.forEach((item, index) => {
        const elemento = criarItemSacola(item, index);
        sacolaLista.appendChild(elemento);
    });

    // Atualiza o resumo ao carregar a página
    atualizarResumo();

    // Botão "Finalizar Venda"
    document.querySelector('.botao-ver-sacola').addEventListener('click', () => {
        const nomeCliente = document.getElementById('cliente').value.trim();
        if (sacola.length === 0) return alert("Sacola vazia.");

        // Atualiza o estoque dos produtos
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        sacola.forEach(itemSacola => {
            const produto = produtos.find(p => p.id === itemSacola.id);
            if (produto) {
                produto.quantidade -= itemSacola.quantidade;
            }
        });
        localStorage.setItem("produtos", JSON.stringify(produtos));

        // Cria a movimentação da venda
        const descricao = sacola.map(item => `${item.quantidade} ${item.nome}`).join("<br>");
        const total = sacola.reduce((soma, item) => soma + item.valor * item.quantidade, 0);

        const dataIso = localStorage.getItem("dataAtual");
        const [ano, mes, dia] = dataIso.split("-");
        const dataAtual = `${dia}/${mes}/${ano}`; // Formato: dd/mm/yyyy

        const novaMov = {
            tipo: "venda",
            nome: nomeCliente || "Venda",
            descricao,
            valor: total,
            data: dataAtual
        };

        // Salva a movimentação
        const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
        movimentacoes.push(novaMov);
        localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));

        // Limpa a sacola e retorna à tela inicial
        localStorage.removeItem("sacola");
        window.location.href = "index.html";
    });
});