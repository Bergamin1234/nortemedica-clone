<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$codigo = $_GET['codigo'] ?? '';

if (empty($codigo)) {
    header("Location: index.php");
    exit;
}

$pdo = getDbConnection();

// Busca o pedido
$stmt = $pdo->prepare("SELECT * FROM pedidos WHERE codigo_pedido = ?");
$stmt->execute([$codigo]);
$pedido = $stmt->fetch();

if (!$pedido) {
    header("Location: index.php");
    exit;
}

// Busca os itens do pedido
$stmtItens = $pdo->prepare("SELECT * FROM itens_pedido WHERE pedido_id = ?");
$stmtItens->execute([$pedido['id']]);
$itens = $stmtItens->fetchAll();

$dadosPagamento = json_decode($pedido['dados_pagamento'], true) ?: [];

$pageTitle = "Pedido " . $pedido['codigo_pedido'] . " Confirmado";
require_once __DIR__ . '/header.php';
?>

<main class="max-w-4xl mx-auto px-4 py-12 flex-1">
    
    <!-- Card de Confirmação Principal -->
    <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-8">
        
        <!-- Header do Sucesso -->
        <div class="text-center space-y-3">
            <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-sm">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pedido Gerado com Sucesso!
            </span>
            <h1 class="text-2xl md:text-3xl font-black text-blue-950">
                Obrigado pela sua compra!
            </h1>
            <p class="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
                Seu pedido foi registrado em nossa central de distribuição e assistência técnica.
            </p>
            <div class="inline-block bg-slate-100 px-4 py-2 rounded-xl text-slate-800 font-mono font-bold text-sm border">
                Número do Pedido: <span class="text-blue-950 font-black"><?php echo htmlspecialchars($pedido['codigo_pedido']); ?></span>
            </div>
        </div>

        <!-- Seção de Pagamento Específica -->
        <?php if ($pedido['metodo_pagamento'] === 'PIX'): ?>
            <div class="bg-emerald-50/80 border-2 border-emerald-200 rounded-3xl p-6 md:p-8 space-y-6 text-center">
                <div class="space-y-1">
                    <span class="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center justify-center">
                        <i class="fa-brands fa-pix text-emerald-600 mr-1.5 text-base"></i> Pague com Pix e Economize 10%
                    </span>
                    <h3 class="text-xl font-black text-emerald-950">
                        Total a Pagar: R$ <?php echo number_format($pedido['total'], 2, ',', '.'); ?>
                    </h3>
                    <p class="text-xs text-emerald-800">Escaneie o QR Code abaixo no app do seu banco ou use a chave Copia e Cola:</p>
                </div>

                <!-- QR Code Dinâmico -->
                <div class="flex justify-center">
                    <div class="bg-white p-4 rounded-2xl shadow-md border border-emerald-200 inline-block">
                        <?php 
                        $pixPayload = $dadosPagamento['copia_e_cola'] ?? 'CHAVE-PIX-NORTEMEDICA';
                        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" . urlencode($pixPayload);
                        ?>
                        <img src="<?php echo $qrCodeUrl; ?>" alt="QR Code Pix" class="w-48 h-48 mx-auto">
                        <span class="block text-[10px] text-slate-400 mt-2 font-mono">Válido por 24 horas</span>
                    </div>
                </div>

                <!-- Campo Copia e Cola -->
                <div class="max-w-lg mx-auto space-y-2">
                    <label class="block text-xs font-bold text-emerald-900 text-left">Código Pix Copia e Cola:</label>
                    <div class="flex space-x-2">
                        <input type="text" id="pix-copia-cola" readonly value="<?php echo htmlspecialchars($pixPayload); ?>" 
                               class="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate">
                        <button type="button" onclick="copiarPix()" id="btn-copiar-pix" 
                                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center space-x-1 shrink-0">
                            <i class="fa-solid fa-copy"></i>
                            <span>Copiar Pix</span>
                        </button>
                    </div>
                </div>
            </div>

        <?php elseif ($pedido['metodo_pagamento'] === 'CARTAO'): ?>
            <div class="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-center space-y-2">
                <i class="fa-solid fa-credit-card text-blue-900 text-3xl"></i>
                <h3 class="font-bold text-blue-950 text-base">Pagamento em Processamento no Cartão</h3>
                <p class="text-xs text-slate-600 max-w-md mx-auto">
                    Transação enviada para autorização da operadora em <strong><?php echo $dadosPagamento['parcelas'] ?? 1; ?>x</strong> de <strong>R$ <?php echo number_format($dadosPagamento['valor_parcela'] ?? $pedido['total'], 2, ',', '.'); ?></strong>.
                </p>
            </div>

        <?php elseif ($pedido['metodo_pagamento'] === 'BOLETO'): ?>
            <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                <div class="flex items-center space-x-3 text-slate-800">
                    <i class="fa-solid fa-barcode text-2xl text-blue-950"></i>
                    <div>
                        <h3 class="font-bold text-sm">Boleto Bancário / Faturamento PJ</h3>
                        <p class="text-xs text-slate-500">Vencimento em: <strong><?php echo $dadosPagamento['vencimento'] ?? date('d/m/Y', strtotime('+3 days')); ?></strong></p>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Linha Digitável:</label>
                    <div class="flex space-x-2">
                        <input type="text" id="linha-boleto" readonly value="<?php echo htmlspecialchars($dadosPagamento['linha_digitavel'] ?? ''); ?>" 
                               class="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 truncate">
                        <button type="button" onclick="copiarBoleto()" id="btn-copiar-boleto" class="bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
                            Copiar
                        </button>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Detalhes do Pedido e Entrega -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 pt-4 border-t border-slate-100">
            
            <div class="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 class="font-bold text-blue-950 text-sm uppercase tracking-wider mb-2 flex items-center">
                    <i class="fa-solid fa-location-dot text-red-500 mr-1.5"></i> Endereço de Entrega
                </h4>
                <p><strong>Destinatário:</strong> <?php echo htmlspecialchars($pedido['nome_cliente']); ?></p>
                <p><strong>Documento:</strong> <?php echo htmlspecialchars($pedido['documento']); ?></p>
                <p><strong>Endereço:</strong> <?php echo htmlspecialchars($pedido['endereco'] . ', ' . $pedido['numero']); ?> <?php echo !empty($pedido['complemento']) ? ' - ' . htmlspecialchars($pedido['complemento']) : ''; ?></p>
                <p><strong>Bairro / Cidade:</strong> <?php echo htmlspecialchars($pedido['bairro'] . ' - ' . $pedido['cidade'] . ' / ' . $pedido['estado']); ?></p>
                <p><strong>CEP:</strong> <?php echo htmlspecialchars($pedido['cep']); ?></p>
                <p><strong>Transporte:</strong> <span class="font-bold text-blue-900"><?php echo htmlspecialchars($pedido['frete_tipo']); ?></span></p>
            </div>

            <div class="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 class="font-bold text-blue-950 text-sm uppercase tracking-wider mb-2 flex items-center">
                    <i class="fa-solid fa-receipt text-blue-900 mr-1.5"></i> Resumo Financeiro
                </h4>
                <div class="flex justify-between py-1 border-b border-slate-200">
                    <span>Subtotal dos Itens:</span>
                    <strong>R$ <?php echo number_format($pedido['subtotal'], 2, ',', '.'); ?></strong>
                </div>
                <div class="flex justify-between py-1 border-b border-slate-200">
                    <span>Frete:</span>
                    <strong><?php echo $pedido['frete_valor'] == 0 ? 'Grátis' : 'R$ ' . number_format($pedido['frete_valor'], 2, ',', '.'); ?></strong>
                </div>
                <?php if ($pedido['desconto'] > 0): ?>
                    <div class="flex justify-between py-1 border-b border-slate-200 text-emerald-700 font-bold">
                        <span>Desconto Aplicado (Pix 10%):</span>
                        <strong>- R$ <?php echo number_format($pedido['desconto'], 2, ',', '.'); ?></strong>
                    </div>
                <?php endif; ?>
                <div class="flex justify-between py-2 text-sm font-black text-blue-950">
                    <span>Total Final:</span>
                    <span class="text-base text-emerald-600">R$ <?php echo number_format($pedido['total'], 2, ',', '.'); ?></span>
                </div>
                <div class="pt-1">
                    <span class="text-slate-500">Status Atual:</span>
                    <span class="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full text-[10px]">
                        <?php echo htmlspecialchars($pedido['status_pedido']); ?>
                    </span>
                </div>
            </div>

        </div>

        <!-- Tabela de Itens Comprados -->
        <div>
            <h4 class="font-bold text-blue-950 text-sm mb-3">Itens Inclusos no Pedido</h4>
            <div class="overflow-x-auto border border-slate-200 rounded-2xl">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                        <tr>
                            <th class="py-2.5 px-4">Item / Produto</th>
                            <th class="py-2.5 px-4">Preço Unitário</th>
                            <th class="py-2.5 px-4">Qtd</th>
                            <th class="py-2.5 px-4 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($itens as $it): ?>
                            <tr>
                                <td class="py-3 px-4 font-semibold text-slate-800"><?php echo htmlspecialchars($it['nome_produto']); ?></td>
                                <td class="py-3 px-4 text-slate-600">R$ <?php echo number_format($it['preco_unitario'], 2, ',', '.'); ?></td>
                                <td class="py-3 px-4 font-bold text-slate-800"><?php echo $it['quantidade']; ?></td>
                                <td class="py-3 px-4 font-bold text-slate-900 text-right">R$ <?php echo number_format($it['subtotal'], 2, ',', '.'); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Ações do Pedido: WhatsApp e Impressão -->
        <div class="flex flex-wrap gap-4 pt-4 border-t border-slate-100 justify-between items-center">
            <?php 
            $msgWhats = "Olá! Acabei de realizar o pedido " . $pedido['codigo_pedido'] . " na Norte Médica no valor de R$ " . number_format($pedido['total'], 2, ',', '.') . " e gostaria de confirmar o status.";
            $whatsUrl = "https://wa.me/" . SITE_WHATSAPP . "?text=" . urlencode($msgWhats);
            ?>
            <a href="<?php echo $whatsUrl; ?>" target="_blank" 
               class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow flex items-center space-x-2">
                <i class="fa-brands fa-whatsapp text-lg"></i>
                <span>Enviar Comprovante no WhatsApp</span>
            </a>

            <div class="flex space-x-3">
                <button onclick="window.print()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-xl text-xs transition flex items-center space-x-1">
                    <i class="fa-solid fa-print"></i>
                    <span>Imprimir Pedido</span>
                </button>

                <a href="index.php" class="bg-blue-950 hover:bg-blue-900 text-white font-bold px-5 py-3 rounded-xl text-xs transition shadow flex items-center space-x-1">
                    <i class="fa-solid fa-store"></i>
                    <span>Voltar à Loja</span>
                </a>
            </div>
        </div>

    </div>

</main>

<script>
function copiarPix() {
    const input = document.getElementById('pix-copia-cola');
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
    
    const btn = document.getElementById('btn-copiar-pix');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copiado!</span>';
    btn.classList.add('bg-emerald-800');
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-emerald-800');
    }, 2500);
}

function copiarBoleto() {
    const input = document.getElementById('linha-boleto');
    input.select();
    navigator.clipboard.writeText(input.value);
    const btn = document.getElementById('btn-copiar-boleto');
    btn.textContent = 'Copiado!';
    setTimeout(() => btn.textContent = 'Copiar', 2000);
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
