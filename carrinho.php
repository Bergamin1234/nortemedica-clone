<?php
$pageTitle = "Meu Carrinho de Compras";
require_once __DIR__ . '/header.php';
?>

<div class="bg-slate-100 border-b border-slate-200 py-3 text-xs">
    <div class="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
        <a href="index.php" class="hover:text-blue-950 font-medium">Início</a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <span class="text-slate-800 font-bold">Carrinho de Compras</span>
    </div>
</div>

<main class="max-w-7xl mx-auto px-4 py-10 flex-1">
    
    <div class="flex items-center space-x-3 mb-8">
        <div class="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center text-lg">
            <i class="fa-solid fa-cart-shopping text-emerald-400"></i>
        </div>
        <div>
            <h1 class="text-2xl font-black text-blue-950">Carrinho de Compras</h1>
            <p class="text-xs text-slate-500">Revise os produtos selecionados antes de prosseguir para o checkout</p>
        </div>
    </div>

    <div id="carrinho-page-container">
        <!-- Renderizado dinamicamente via JS -->
    </div>

</main>

<script>
document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});

async function renderCartPage() {
    const container = document.getElementById('carrinho-page-container');
    container.innerHTML = '<div class="py-20 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-3xl"></i><p class="mt-3 text-sm">Carregando itens...</p></div>';

    try {
        const res = await fetch('api.php?action=get_cart');
        const data = await res.json();

        if (!data.success || data.itens.length === 0) {
            container.innerHTML = `
                <div class="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
                    <div class="w-20 h-20 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center text-4xl mx-auto">
                        <i class="fa-solid fa-cart-arrow-down"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800">Seu carrinho está vazio</h3>
                    <p class="text-xs text-slate-500">Adicione equipamentos e suprimentos médicos hospitalares para iniciar sua compra.</p>
                    <a href="index.php" class="inline-block bg-blue-950 hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow">
                        Explorar Catálogo
                    </a>
                </div>
            `;
            return;
        }

        let itemsHtml = '';
        data.itens.forEach(item => {
            itemsHtml += `
                <tr class="border-b border-slate-100 text-xs text-slate-700">
                    <td class="py-4 px-4 flex items-center space-x-3">
                        <img src="${item.imagem}" alt="${item.nome}" class="w-16 h-16 object-cover rounded-xl border border-slate-200">
                        <div>
                            <span class="text-[10px] font-bold text-blue-900 uppercase block">${item.marca || 'Norte Médica'}</span>
                            <a href="produto.php?slug=${item.slug}" class="font-bold text-slate-800 hover:text-blue-950 text-sm">${item.nome}</a>
                        </div>
                    </td>
                    <td class="py-4 px-4 font-bold text-slate-800">R$ ${item.preco_formatado}</td>
                    <td class="py-4 px-4">
                        <div class="flex items-center space-x-2">
                            <button onclick="updateQty(${item.id}, ${item.quantidade - 1})" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold">-</button>
                            <span class="font-bold text-sm text-slate-800 w-6 text-center">${item.quantidade}</span>
                            <button onclick="updateQty(${item.id}, ${item.quantidade + 1})" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold">+</button>
                        </div>
                    </td>
                    <td class="py-4 px-4 font-black text-slate-900 text-sm">R$ ${item.subtotal_formatado}</td>
                    <td class="py-4 px-4 text-right">
                        <button onclick="removeFromCart(${item.id})" class="text-slate-300 hover:text-red-600 transition p-2">
                            <i class="fa-solid fa-trash-can text-base"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- Tabela de Itens -->
                <div class="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    <th class="py-3 px-4">Produto</th>
                                    <th class="py-3 px-4">Preço Unitário</th>
                                    <th class="py-3 px-4">Quantidade</th>
                                    <th class="py-3 px-4">Subtotal</th>
                                    <th class="py-3 px-4 text-right">Remover</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                        </table>
                    </div>

                    <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
                        <a href="index.php" class="font-bold text-blue-900 hover:text-blue-950 flex items-center space-x-1">
                            <i class="fa-solid fa-arrow-left"></i>
                            <span>Continuar Comprando</span>
                        </a>
                    </div>
                </div>

                <!-- Resumo e Checkout -->
                <div class="lg:col-span-4 space-y-6">
                    <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 class="font-black text-blue-950 text-base border-b pb-3">Resumo do Pedido</h3>
                        
                        <div class="space-y-2.5 text-xs text-slate-600">
                            <div class="flex justify-between">
                                <span>Subtotal:</span>
                                <strong class="text-slate-900 text-sm">R$ ${data.subtotal_formatado}</strong>
                            </div>
                            <div class="flex justify-between text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                                <span class="font-semibold">Desconto à vista no PIX (10%):</span>
                                <strong class="font-black text-sm">- R$ ${parseFloat(data.desconto_pix).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong>
                            </div>
                            <div class="flex justify-between pt-2 border-t border-slate-100">
                                <span class="font-bold text-slate-800 text-sm">Total no Cartão:</span>
                                <strong class="text-blue-950 text-lg font-black">R$ ${data.subtotal_formatado}</strong>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-bold text-emerald-700 text-sm">Total no PIX:</span>
                                <strong class="text-emerald-600 text-xl font-black">R$ ${data.total_pix_formatado}</strong>
                            </div>
                        </div>

                        <a href="checkout.php" class="block w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 px-6 rounded-2xl text-center text-xs uppercase tracking-wider shadow-lg hover:shadow-red-600/30 transition flex items-center justify-center space-x-2">
                            <span>Prosseguir para o Checkout</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </a>

                        <div class="pt-2 text-center text-[11px] text-slate-400 space-y-1">
                            <p><i class="fa-solid fa-lock text-emerald-600 mr-1"></i> Ambiente Seguro com Criptografia SSL</p>
                            <p>O frete e prazos serão calculados no checkout</p>
                        </div>
                    </div>
                </div>

            </div>
        `;

    } catch (e) {
        container.innerHTML = '<p class="text-red-500 text-center py-10">Erro ao carregar o carrinho.</p>';
    }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
