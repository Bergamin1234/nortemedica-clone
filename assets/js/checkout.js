/**
 * Scripts de Checkout, Validação e Máscaras
 * Norte Médica
 */

let checkoutState = {
    subtotal: 0,
    frete_valor: 0,
    frete_tipo: 'PAC',
    metodo_pagamento: 'PIX',
    desconto_pix: 0
};

document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
});

async function initCheckoutPage() {
    loadCheckoutCart();
    setupMasks();
    setupPaymentTabs();
    setupCepLookup();
    setupFormSubmit();
}

// Carrega os itens no resumo lateral do checkout
async function loadCheckoutCart() {
    try {
        const res = await fetch('api.php?action=get_cart');
        const data = await res.json();

        if (!data.success || data.itens.length === 0) {
            window.location.href = 'index.php';
            return;
        }

        checkoutState.subtotal = data.subtotal;
        checkoutState.desconto_pix = data.desconto_pix;

        const container = document.getElementById('checkout-items-list');
        if (container) {
            let html = '';
            data.itens.forEach(item => {
                html += `
                    <div class="flex items-center space-x-3 py-2 border-b border-slate-100 last:border-0">
                        <img src="${item.imagem}" alt="${item.nome}" class="w-12 h-12 object-cover rounded border">
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-semibold text-slate-800 truncate">${item.nome}</p>
                            <span class="text-[11px] text-slate-500">${item.quantidade}x R$ ${item.preco_formatado}</span>
                        </div>
                        <div class="text-xs font-bold text-slate-900">R$ ${item.subtotal_formatado}</div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }

        updateTotals();
    } catch (e) {
        console.error(e);
    }
}

function updateTotals() {
    const subtotalEl = document.getElementById('chk-subtotal');
    const freteEl = document.getElementById('chk-frete');
    const descontoEl = document.getElementById('chk-desconto');
    const descontoLinha = document.getElementById('chk-desconto-linha');
    const totalEl = document.getElementById('chk-total');

    if (subtotalEl) subtotalEl.textContent = 'R$ ' + checkoutState.subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    if (freteEl) {
        freteEl.textContent = checkoutState.frete_valor === 0 ? 'Grátis' : 'R$ ' + checkoutState.frete_valor.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    }

    let descontoAplicado = 0;
    if (checkoutState.metodo_pagamento === 'PIX') {
        descontoAplicado = checkoutState.desconto_pix;
        if (descontoLinha) descontoLinha.classList.remove('hidden');
        if (descontoEl) descontoEl.textContent = '- R$ ' + descontoAplicado.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    } else {
        if (descontoLinha) descontoLinha.classList.add('hidden');
    }

    const totalFinal = (checkoutState.subtotal - descontoAplicado) + checkoutState.frete_valor;
    if (totalEl) totalEl.textContent = 'R$ ' + totalFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2});

    // Atualiza opções de parcelamento se o cartão estiver selecionado
    updateInstallmentOptions(totalFinal);
}

function updateInstallmentOptions(total) {
    const select = document.getElementById('cartao_parcelas');
    if (!select) return;

    select.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
        const valorParcela = total / i;
        const semJuros = i <= 6 ? ' sem juros' : '';
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${i}x de R$ ${valorParcela.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}${semJuros}`;
        select.appendChild(opt);
    }
}

// Configuração das abas de pagamento
function setupPaymentTabs() {
    const tabs = document.querySelectorAll('.payment-tab-btn');
    const panels = document.querySelectorAll('.payment-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.getAttribute('data-method');
            checkoutState.metodo_pagamento = method;

            tabs.forEach(t => {
                t.classList.remove('border-blue-900', 'bg-blue-50/50', 'text-blue-900');
                t.classList.add('border-slate-200', 'text-slate-600');
            });
            tab.classList.add('border-blue-900', 'bg-blue-50/50', 'text-blue-900');

            panels.forEach(p => p.classList.add('hidden'));
            const activePanel = document.getElementById(`panel-${method.toLowerCase()}`);
            if (activePanel) activePanel.classList.remove('hidden');

            document.getElementById('input_metodo_pagamento').value = method;
            updateTotals();
        });
    });
}

// Consulta de CEP Automática via ViaCEP
function setupCepLookup() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return;

    cepInput.addEventListener('blur', async () => {
        const rawCep = cepInput.value.replace(/\D/g, '');
        if (rawCep.length === 8) {
            const cepFeedback = document.getElementById('cep-loading');
            if (cepFeedback) cepFeedback.classList.remove('hidden');

            try {
                // Consulta endereço
                const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
                const data = await res.json();

                if (!data.erro) {
                    document.getElementById('endereco').value = data.logradouro || '';
                    document.getElementById('bairro').value = data.bairro || '';
                    document.getElementById('cidade').value = data.localidade || '';
                    document.getElementById('estado').value = data.uf || '';
                    document.getElementById('numero').focus();
                }

                // Consulta opções de frete
                consultarFrete(rawCep);

            } catch (err) {
                console.error(err);
            } finally {
                if (cepFeedback) cepFeedback.classList.add('hidden');
            }
        }
    });
}

async function consultarFrete(rawCep) {
    const freteContainer = document.getElementById('frete-options-container');
    if (!freteContainer) return;

    freteContainer.innerHTML = '<div class="p-3 text-xs text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Calculando frete e prazos para sua região...</div>';

    try {
        const res = await fetch(`api.php?action=calc_frete&cep=${rawCep}&subtotal=${checkoutState.subtotal}`);
        const data = await res.json();

        if (data.success && data.opcoes) {
            let html = '';
            data.opcoes.forEach((op, idx) => {
                const checked = idx === 0 ? 'checked' : '';
                if (idx === 0) {
                    checkoutState.frete_valor = op.valor;
                    checkoutState.frete_tipo = op.nome;
                }

                html += `
                    <label class="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition mb-2">
                        <div class="flex items-center space-x-3">
                            <input type="radio" name="opcao_frete" value="${op.valor}" data-nome="${op.nome}" ${checked} onchange="selectShipping(this)" class="text-blue-900 focus:ring-blue-500">
                            <div>
                                <span class="font-bold text-xs text-slate-800 block">${op.nome}</span>
                                <span class="text-[11px] text-slate-500">Prazo estimado: ${op.prazo}</span>
                            </div>
                        </div>
                        <span class="text-xs font-bold ${op.valor === 0 ? 'text-emerald-600' : 'text-slate-900'}">${op.valor_formatado}</span>
                    </label>
                `;
            });
            freteContainer.innerHTML = html;
            updateTotals();
        }
    } catch (e) {
        freteContainer.innerHTML = '<p class="text-xs text-red-500">Erro ao cotar frete.</p>';
    }
}

function selectShipping(radio) {
    checkoutState.frete_valor = parseFloat(radio.value);
    checkoutState.frete_tipo = radio.getAttribute('data-nome');
    document.getElementById('input_frete_tipo').value = checkoutState.frete_tipo;
    document.getElementById('input_frete_valor').value = checkoutState.frete_valor;
    updateTotals();
}

// Máscaras de entrada (CPF/CNPJ, Telefone, Cartão, CEP)
function setupMasks() {
    const cep = document.getElementById('cep');
    if (cep) {
        cep.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
            e.target.value = v;
        });
    }

    const doc = document.getElementById('documento');
    if (doc) {
        doc.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length <= 11) {
                // CPF
                v = v.replace(/(\d{3})(\d)/, '$1.$2');
                v = v.replace(/(\d{3})(\d)/, '$1.$2');
                v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                // CNPJ
                v = v.substring(0, 14);
                v = v.replace(/^(\d{2})(\d)/, '$1.$2');
                v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
                v = v.replace(/(\d{4})(\d)/, '$1-$2');
            }
            e.target.value = v;
        });
    }

    const tel = document.getElementById('telefone');
    if (tel) {
        tel.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 10) {
                v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else {
                v = v.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            e.target.value = v;
        });
    }

    const cartaoNum = document.getElementById('cartao_numero');
    if (cartaoNum) {
        cartaoNum.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 16);
            v = v.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = v;
        });
    }

    const cartaoVal = document.getElementById('cartao_validade');
    if (cartaoVal) {
        cartaoVal.addEventListener('input', e => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
            e.target.value = v;
        });
    }
}

// Submissão do Formulário de Checkout
function setupFormSubmit() {
    const form = document.getElementById('form-checkout');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnSubmit = document.getElementById('btn-finalizar-pedido');
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Processando seu pedido...';
        }

        try {
            const formData = new FormData(form);
            formData.append('action', 'checkout');
            formData.append('frete_tipo', checkoutState.frete_tipo);
            formData.append('frete_valor', checkoutState.frete_valor);
            formData.append('metodo_pagamento', checkoutState.metodo_pagamento);

            const res = await fetch('api.php', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (data.success && data.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                alert(data.message || 'Erro ao concluir pedido. Por favor, verifique os dados.');
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = '<i class="fa-solid fa-lock mr-2"></i> Finalizar Compra Segura';
                }
            }
        } catch (err) {
            console.error(err);
            alert('Falha na comunicação com o servidor. Tente novamente.');
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<i class="fa-solid fa-lock mr-2"></i> Finalizar Compra Segura';
            }
        }
    });
}
