<?php
$pageTitle = "Finalizar Compra - Checkout Seguro";
require_once __DIR__ . '/header.php';
?>

<div class="bg-slate-100 border-b border-slate-200 py-3 text-xs">
    <div class="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
        <a href="index.php" class="hover:text-blue-950 font-medium">Início</a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <a href="carrinho.php" class="hover:text-blue-950 font-medium">Carrinho</a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <span class="text-slate-800 font-bold">Checkout Seguro</span>
    </div>
</div>

<main class="max-w-7xl mx-auto px-4 py-10 flex-1">
    
    <div class="flex items-center space-x-3 mb-8">
        <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow">
            <i class="fa-solid fa-lock"></i>
        </div>
        <div>
            <h1 class="text-2xl font-black text-blue-950">Finalização de Pedido</h1>
            <p class="text-xs text-slate-500">Preencha seus dados de entrega e faturamento com segurança criptografada</p>
        </div>
    </div>

    <form id="form-checkout">
        <input type="hidden" id="input_metodo_pagamento" name="metodo_pagamento" value="PIX">
        <input type="hidden" id="input_frete_tipo" name="frete_tipo" value="PAC">
        <input type="hidden" id="input_frete_valor" name="frete_valor" value="0">

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Coluna Principal do Formulário -->
            <div class="lg:col-span-8 space-y-6">
                
                <!-- 1. Dados Pessoais / Corporativos -->
                <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div class="flex items-center space-x-3">
                            <span class="w-7 h-7 rounded-full bg-blue-950 text-white font-bold text-xs flex items-center justify-center">1</span>
                            <h2 class="font-bold text-blue-950 text-base">Identificação do Comprador / Faturamento</h2>
                        </div>
                        
                        <!-- Toggle PF / PJ -->
                        <div class="flex bg-slate-100 p-1 rounded-xl text-xs">
                            <button type="button" id="btn-tipo-pf" onclick="setTipoCliente('PF')" class="px-3 py-1 rounded-lg font-bold bg-white text-blue-950 shadow-sm transition">
                                Pessoa Física
                            </button>
                            <button type="button" id="btn-tipo-pj" onclick="setTipoCliente('PJ')" class="px-3 py-1 rounded-lg font-bold text-slate-500 hover:text-slate-800 transition">
                                Pessoa Jurídica / Hospital
                            </button>
                        </div>
                    </div>

                    <input type="hidden" name="tipo_cliente" id="tipo_cliente" value="PF">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div class="md:col-span-2">
                            <label class="block font-bold text-slate-700 mb-1" id="lbl-nome">Nome Completo do Responsável *</label>
                            <input type="text" name="nome_cliente" required placeholder="Digite o nome completo" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1" id="lbl-documento">CPF *</label>
                            <input type="text" id="documento" name="documento" required placeholder="000.000.000-00" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Telefone / WhatsApp com DDD *</label>
                            <input type="text" id="telefone" name="telefone" required placeholder="(69) 90000-0000" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div class="md:col-span-2">
                            <label class="block font-bold text-slate-700 mb-1">E-mail para Recebimento da Nota Fiscal e Rastreio *</label>
                            <input type="email" name="email" required placeholder="exemplo@clinica.com.br" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>
                    </div>
                </div>

                <!-- 2. Endereço e Opções de Frete -->
                <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                    <div class="flex items-center space-x-3 border-b border-slate-100 pb-4">
                        <span class="w-7 h-7 rounded-full bg-blue-950 text-white font-bold text-xs flex items-center justify-center">2</span>
                        <h2 class="font-bold text-blue-950 text-base">Endereço de Entrega & Modalidade de Frete</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                                <span>CEP *</span>
                                <span id="cep-loading" class="text-[10px] text-blue-600 hidden"><i class="fa-solid fa-spinner fa-spin"></i> buscando...</span>
                            </label>
                            <input type="text" id="cep" name="cep" required placeholder="00000-000" maxlength="9" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono">
                        </div>

                        <div class="md:col-span-2">
                            <label class="block font-bold text-slate-700 mb-1">Logradouro (Rua, Avenida) *</label>
                            <input type="text" id="endereco" name="endereco" required placeholder="Ex: Rua Guanabara" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Número *</label>
                            <input type="text" id="numero" name="numero" required placeholder="Ex: 1275" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Complemento / Setor</label>
                            <input type="text" id="complemento" name="complemento" placeholder="Ex: Bloco B, Sala 4" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Bairro *</label>
                            <input type="text" id="bairro" name="bairro" required placeholder="Bairro" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div class="md:col-span-2">
                            <label class="block font-bold text-slate-700 mb-1">Cidade *</label>
                            <input type="text" id="cidade" name="cidade" required placeholder="Cidade" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Estado (UF) *</label>
                            <input type="text" id="estado" name="estado" required placeholder="RO" maxlength="2" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 uppercase">
                        </div>
                    </div>

                    <!-- Opções de Frete Dinâmicas -->
                    <div class="pt-4 border-t border-slate-100">
                        <label class="block font-bold text-xs text-slate-800 mb-2">Modalidade de Envio Selecionada:</label>
                        <div id="frete-options-container" class="space-y-2">
                            <p class="text-xs text-slate-400 italic">Digite seu CEP acima para listar as transportadoras e prazos de entrega.</p>
                        </div>
                    </div>
                </div>

                <!-- 3. Pagamento -->
                <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                    <div class="flex items-center space-x-3 border-b border-slate-100 pb-4">
                        <span class="w-7 h-7 rounded-full bg-blue-950 text-white font-bold text-xs flex items-center justify-center">3</span>
                        <h2 class="font-bold text-blue-950 text-base">Forma de Pagamento</h2>
                    </div>

                    <!-- Abas de Pagamento -->
                    <div class="grid grid-cols-3 gap-3 text-xs">
                        
                        <button type="button" data-method="PIX" class="payment-tab-btn p-3.5 rounded-2xl border-2 border-blue-900 bg-blue-50/50 text-blue-950 font-bold flex flex-col items-center justify-center space-y-1 transition text-center">
                            <i class="fa-brands fa-pix text-emerald-600 text-xl"></i>
                            <span>PIX</span>
                            <span class="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">10% OFF</span>
                        </button>

                        <button type="button" data-method="CARTAO" class="payment-tab-btn p-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold flex flex-col items-center justify-center space-y-1 transition text-center hover:bg-slate-50">
                            <i class="fa-solid fa-credit-card text-blue-900 text-xl"></i>
                            <span>Cartão de Crédito</span>
                            <span class="text-[10px] text-slate-500 font-semibold">Até 12x</span>
                        </button>

                        <button type="button" data-method="BOLETO" class="payment-tab-btn p-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold flex flex-col items-center justify-center space-y-1 transition text-center hover:bg-slate-50">
                            <i class="fa-solid fa-barcode text-slate-700 text-xl"></i>
                            <span>Boleto / PJ</span>
                            <span class="text-[10px] text-slate-500 font-semibold">À vista</span>
                        </button>

                    </div>

                    <!-- Painel 1: PIX -->
                    <div id="panel-pix" class="payment-panel p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-950">
                        <div class="flex items-center space-x-2 font-bold text-emerald-900 text-sm">
                            <i class="fa-brands fa-pix text-emerald-600 text-lg"></i>
                            <span>Pagamento Instantâneo com 10% de Desconto</span>
                        </div>
                        <p class="leading-relaxed text-emerald-900">
                            Ao clicar em "Finalizar Compra", você receberá imediatamente o <strong>QR Code</strong> e a chave <strong>Pix Copia e Cola</strong> com aprovação automática.
                        </p>
                        <ul class="list-disc list-inside space-y-1 text-emerald-800 text-[11px] pt-1">
                            <li>Confirmação imediata do pagamento 24 horas por dia;</li>
                            <li>Separação e envio priorizados na nossa expedição;</li>
                            <li>Maior economia para compras institucionais.</li>
                        </ul>
                    </div>

                    <!-- Painel 2: Cartão de Crédito -->
                    <div id="panel-cartao" class="payment-panel hidden space-y-4 text-xs pt-2">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                                <label class="block font-bold text-slate-700 mb-1">Número do Cartão de Crédito *</label>
                                <input type="text" id="cartao_numero" name="cartao_numero" placeholder="0000 0000 0000 0000" maxlength="19" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono">
                            </div>

                            <div>
                                <label class="block font-bold text-slate-700 mb-1">Nome Impresso no Cartão *</label>
                                <input type="text" name="cartao_nome" placeholder="Como consta no cartão" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 uppercase">
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block font-bold text-slate-700 mb-1">Validade (MM/AA) *</label>
                                    <input type="text" id="cartao_validade" name="cartao_validade" placeholder="MM/AA" maxlength="5" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono text-center">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-700 mb-1">CVV *</label>
                                    <input type="text" name="cartao_cvv" placeholder="123" maxlength="4" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono text-center">
                                </div>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block font-bold text-slate-700 mb-1">Parcelamento *</label>
                                <select id="cartao_parcelas" name="cartao_parcelas" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-bold">
                                    <option value="1">1x (à vista)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Painel 3: Boleto Bancário -->
                    <div id="panel-boleto" class="payment-panel hidden p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-700">
                        <div class="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                            <i class="fa-solid fa-barcode text-slate-700 text-lg"></i>
                            <span>Boleto Bancário / Faturamento Hospitalar PJ</span>
                        </div>
                        <p class="leading-relaxed">
                            O boleto bancário será emitido com vencimento para <strong>3 dias úteis</strong>. Para hospitais e órgãos públicos conveniados com faturamento a prazo (15/30/45 dias), nossa equipe entrará em contato para validação do pedido.
                        </p>
                    </div>

                    <!-- Observações Adicionais -->
                    <div class="pt-2">
                        <label class="block font-bold text-xs text-slate-700 mb-1">Observações do Pedido / Instruções de Entrega:</label>
                        <textarea name="observacoes" rows="2" placeholder="Ex: Entregar na portaria 2 da clínica ou horário específico de recebimento..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900"></textarea>
                    </div>

                </div>

            </div>

            <!-- Coluna Lateral de Resumo do Pedido -->
            <div class="lg:col-span-4 sticky top-24 space-y-6">
                
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 class="font-black text-blue-950 text-base border-b pb-3">Resumo da Compra</h3>
                    
                    <!-- Lista de Itens no Carrinho -->
                    <div id="checkout-items-list" class="max-h-60 overflow-y-auto space-y-2 pr-1">
                        <!-- Carregado via JS -->
                    </div>

                    <div class="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <div class="flex justify-between">
                            <span>Subtotal:</span>
                            <strong id="chk-subtotal" class="text-slate-800 text-sm">R$ 0,00</strong>
                        </div>

                        <div class="flex justify-between">
                            <span>Frete:</span>
                            <strong id="chk-frete" class="text-slate-800">Calcular</strong>
                        </div>

                        <div id="chk-desconto-linha" class="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                            <span>Desconto Pix (10%):</span>
                            <strong id="chk-desconto">- R$ 0,00</strong>
                        </div>

                        <div class="flex justify-between pt-3 border-t border-slate-200 text-slate-900 items-baseline">
                            <span class="font-black text-base">Total a Pagar:</span>
                            <strong id="chk-total" class="text-2xl font-black text-blue-950">R$ 0,00</strong>
                        </div>
                    </div>

                    <button type="submit" id="btn-finalizar-pedido" class="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-4 px-6 rounded-2xl text-center text-xs uppercase tracking-wider shadow-lg hover:shadow-red-600/30 transition flex items-center justify-center space-x-2">
                        <i class="fa-solid fa-lock"></i>
                        <span>Finalizar Compra Segura</span>
                    </button>

                    <div class="text-[11px] text-center text-slate-400 space-y-1 pt-1">
                        <p class="text-emerald-700 font-bold"><i class="fa-solid fa-shield-check mr-1"></i> Seus dados estão 100% protegidos</p>
                        <p>Ao finalizar, seu pedido será gerado imediatamente no sistema.</p>
                    </div>
                </div>

            </div>

        </div>
    </form>

</main>

<script src="assets/js/checkout.js"></script>
<script>
function setTipoCliente(tipo) {
    document.getElementById('tipo_cliente').value = tipo;
    const btnPf = document.getElementById('btn-tipo-pf');
    const btnPj = document.getElementById('btn-tipo-pj');
    const lblNome = document.getElementById('lbl-nome');
    const lblDoc = document.getElementById('lbl-documento');
    const inputDoc = document.getElementById('documento');

    if (tipo === 'PJ') {
        btnPj.classList.add('bg-white', 'text-blue-950', 'shadow-sm');
        btnPj.classList.remove('text-slate-500');
        btnPf.classList.remove('bg-white', 'text-blue-950', 'shadow-sm');
        btnPf.classList.add('text-slate-500');

        lblNome.textContent = "Razão Social / Nome da Clínica ou Hospital *";
        lblDoc.textContent = "CNPJ *";
        inputDoc.placeholder = "00.000.000/0000-00";
    } else {
        btnPf.classList.add('bg-white', 'text-blue-950', 'shadow-sm');
        btnPf.classList.remove('text-slate-500');
        btnPj.classList.remove('bg-white', 'text-blue-950', 'shadow-sm');
        btnPj.classList.add('text-slate-500');

        lblNome.textContent = "Nome Completo do Responsável *";
        lblDoc.textContent = "CPF *";
        inputDoc.placeholder = "000.000.000-00";
    }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
