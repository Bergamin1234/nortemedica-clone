/**
 * Norte Médica - Scripts Globais de E-Commerce
 */

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    loadCartCount();
});

// Toast Notificações Modernas
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    toast.className = `transform transition-all duration-300 ease-out translate-y-4 opacity-0 pointer-events-auto px-4 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-sm text-white ${isSuccess ? 'bg-emerald-600' : 'bg-red-600'}`;
    toast.innerHTML = `
        <i class="fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation'} text-lg"></i>
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Adicionar ao Carrinho via AJAX
async function addToCart(produtoId, qtd = 1, e = null) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    try {
        const formData = new FormData();
        formData.append('action', 'add_cart');
        formData.append('produto_id', produtoId);
        formData.append('quantidade', qtd);

        const res = await fetch('api.php', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            updateCartBadge(data.carrinho_count);
            showToast(`${data.produto_nome || 'Produto'} adicionado ao carrinho!`);
            openCartDrawer();
        } else {
            showToast(data.message || 'Erro ao adicionar item.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Erro de comunicação com o servidor.', 'error');
    }
}

// Atualizar Contador do Carrinho
function updateCartBadge(count) {
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
        b.textContent = count;
        if (count > 0) {
            b.classList.remove('hidden');
        } else {
            b.classList.add('hidden');
        }
    });
}

async function loadCartCount() {
    try {
        const res = await fetch('api.php?action=get_cart');
        const data = await res.json();
        if (data.success) {
            updateCartBadge(data.qtd_total);
        }
    } catch (e) {
        // Silencioso
    }
}

// Drawer / Gaveta Lateral do Carrinho
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            drawer.classList.remove('translate-x-full');
        }, 10);
        renderCartDrawer();
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

async function renderCartDrawer() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const totalPixEl = document.getElementById('cart-drawer-total-pix');
    if (!container) return;

    container.innerHTML = '<div class="py-12 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-2xl"></i><p class="mt-2 text-xs">Carregando carrinho...</p></div>';

    try {
        const res = await fetch('api.php?action=get_cart');
        const data = await res.json();

        if (!data.success || data.itens.length === 0) {
            container.innerHTML = `
                <div class="py-16 text-center text-slate-400">
                    <i class="fa-solid fa-cart-shopping text-4xl mb-3 text-slate-300"></i>
                    <p class="font-semibold text-slate-600">Seu carrinho está vazio</p>
                    <p class="text-xs text-slate-400 mt-1">Navegue pelas categorias e adicione produtos.</p>
                </div>
            `;
            if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
            if (totalPixEl) totalPixEl.textContent = 'R$ 0,00';
            const btnCheckout = document.getElementById('btn-drawer-checkout');
            if (btnCheckout) btnCheckout.classList.add('opacity-50', 'pointer-events-none');
            return;
        }

        const btnCheckout = document.getElementById('btn-drawer-checkout');
        if (btnCheckout) btnCheckout.classList.remove('opacity-50', 'pointer-events-none');

        let html = '';
        data.itens.forEach(item => {
            html += `
                <div class="flex items-center space-x-3 py-3 border-b border-slate-100">
                    <img src="${item.imagem}" alt="${item.nome}" class="w-16 h-16 object-cover rounded-lg border border-slate-200">
                    <div class="flex-1 min-w-0">
                        <span class="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">${item.marca || 'Norte Médica'}</span>
                        <h4 class="text-xs font-semibold text-slate-800 truncate">${item.nome}</h4>
                        <div class="text-xs text-slate-900 font-bold mt-1">R$ ${item.preco_formatado}</div>
                        <div class="flex items-center space-x-2 mt-1.5">
                            <button onclick="updateQty(${item.id}, ${item.quantidade - 1})" class="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">-</button>
                            <span class="text-xs font-bold text-slate-700 w-5 text-center">${item.quantidade}</span>
                            <button onclick="updateQty(${item.id}, ${item.quantidade + 1})" class="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-slate-300 hover:text-red-500 p-1 text-sm transition">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
        if (subtotalEl) subtotalEl.textContent = `R$ ${data.subtotal_formatado}`;
        if (totalPixEl) totalPixEl.textContent = `R$ ${data.total_pix_formatado}`;

    } catch (e) {
        container.innerHTML = '<p class="text-xs text-red-500 text-center py-4">Erro ao carregar itens do carrinho.</p>';
    }
}

async function updateQty(produtoId, novaQtd) {
    try {
        const formData = new FormData();
        formData.append('action', 'update_cart');
        formData.append('produto_id', produtoId);
        formData.append('quantidade', novaQtd);

        const res = await fetch('api.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            updateCartBadge(data.carrinho_count);
            renderCartDrawer();
            if (typeof renderCartPage === 'function') renderCartPage();
        }
    } catch (e) {
        console.error(e);
    }
}

async function removeFromCart(produtoId) {
    try {
        const formData = new FormData();
        formData.append('action', 'remove_cart');
        formData.append('produto_id', produtoId);

        const res = await fetch('api.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            updateCartBadge(data.carrinho_count);
            renderCartDrawer();
            if (typeof renderCartPage === 'function') renderCartPage();
            showToast('Item removido do carrinho.');
        }
    } catch (e) {
        console.error(e);
    }
}

// Busca Instantânea / Autocomplete
function initSearch() {
    const searchInputs = document.querySelectorAll('.input-busca-produtos');
    searchInputs.forEach(input => {
        let debounceTimer;
        const dropdown = input.parentElement.querySelector('.search-autocomplete-dropdown');

        input.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const val = e.target.value.trim();

            if (val.length < 2) {
                if (dropdown) dropdown.classList.add('hidden');
                return;
            }

            debounceTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`api.php?action=search&q=${encodeURIComponent(val)}`);
                    const items = await res.json();

                    if (!dropdown) return;

                    if (items.length === 0) {
                        dropdown.innerHTML = '<div class="p-4 text-xs text-slate-500 text-center">Nenhum produto hospitalar encontrado.</div>';
                        dropdown.classList.remove('hidden');
                        return;
                    }

                    let html = '<div class="p-2 border-b text-[11px] font-bold text-slate-400 uppercase tracking-wider">Produtos encontrados</div>';
                    items.forEach(p => {
                        html += `
                            <a href="produto.php?slug=${p.slug}" class="flex items-center space-x-3 p-2.5 hover:bg-slate-50 transition border-b border-slate-50 last:border-0">
                                <img src="${p.imagem_url}" alt="${p.nome}" class="w-10 h-10 object-cover rounded border border-slate-200">
                                <div class="flex-1 min-w-0">
                                    <div class="text-[10px] text-blue-900 font-bold uppercase">${p.marca_nome || 'Norte Médica'}</div>
                                    <div class="text-xs font-medium text-slate-800 truncate">${p.nome}</div>
                                    <div class="text-xs font-bold text-emerald-600">R$ ${parseFloat(p.preco_por).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                                </div>
                            </a>
                        `;
                    });

                    dropdown.innerHTML = html;
                    dropdown.classList.remove('hidden');
                } catch (err) {
                    console.error(err);
                }
            }, 250);
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    });
}
