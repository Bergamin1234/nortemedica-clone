<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();

$slug = $_GET['slug'] ?? '';
$id = (int)($_GET['id'] ?? 0);

if (!empty($slug)) {
    $stmt = $pdo->prepare("
        SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug, m.nome as marca_nome, m.slug as marca_slug
        FROM produtos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.slug = ? AND p.ativo = 1
    ");
    $stmt->execute([$slug]);
    $produto = $stmt->fetch();
} elseif ($id > 0) {
    $stmt = $pdo->prepare("
        SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug, m.nome as marca_nome, m.slug as marca_slug
        FROM produtos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        WHERE p.id = ? AND p.ativo = 1
    ");
    $stmt->execute([$id]);
    $produto = $stmt->fetch();
} else {
    $produto = null;
}

if (!$produto) {
    header("Location: index.php");
    exit;
}

$pageTitle = $produto['nome'];
require_once __DIR__ . '/header.php';

$precoPor = (float)$produto['preco_por'];
$precoDe = (float)$produto['preco_de'];
$precoPix = $precoPor * (1 - (DESCONTO_PIX_PERCENTUAL / 100));
$parcelaValor = $precoPor / MAX_PARCELAS_CARTAO;

// Busca produtos relacionados
$stmtRel = $pdo->prepare("
    SELECT id, nome, slug, preco_por, preco_de, imagem_url, m.nome as marca_nome
    FROM produtos p
    LEFT JOIN marcas m ON p.marca_id = m.id
    WHERE p.categoria_id = ? AND p.id != ? AND p.ativo = 1
    LIMIT 4
");
$stmtRel->execute([$produto['categoria_id'], $produto['id']]);
$relacionados = $stmtRel->fetchAll();
?>

<!-- Breadcrumbs -->
<div class="bg-slate-100 border-b border-slate-200 py-3 text-xs">
    <div class="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500 overflow-x-auto whitespace-nowrap">
        <a href="index.php" class="hover:text-blue-950 font-medium">Início</a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <a href="index.php?categoria=<?php echo $produto['categoria_slug']; ?>" class="hover:text-blue-950 font-medium">
            <?php echo htmlspecialchars($produto['categoria_nome']); ?>
        </a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <span class="text-slate-800 font-bold truncate max-w-xs md:max-w-md"><?php echo htmlspecialchars($produto['nome']); ?></span>
    </div>
</div>

<main class="max-w-7xl mx-auto px-4 py-10 flex-1">
    
    <!-- Bloco Superior do Produto -->
    <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Galeria / Imagem Principal -->
        <div class="lg:col-span-6 flex flex-col items-center justify-center">
            <div class="relative w-full h-80 sm:h-96 md:h-[450px] bg-slate-50 rounded-2xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
                <?php if ($precoDe > $precoPor): ?>
                    <span class="absolute top-4 left-4 badge-discount text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        Oferta Especial
                    </span>
                <?php endif; ?>
                <span class="absolute top-4 right-4 badge-pix text-white font-black text-xs px-3 py-1 rounded-full shadow">
                    10% OFF no PIX
                </span>
                <img id="main-product-image" 
                     src="<?php echo htmlspecialchars($produto['imagem_url']); ?>" 
                     alt="<?php echo htmlspecialchars($produto['nome']); ?>" 
                     class="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300">
            </div>

            <!-- Mini Garantia -->
            <div class="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                <span class="flex items-center"><i class="fa-solid fa-certificate text-blue-900 mr-1.5"></i> Registro ANVISA</span>
                <span class="flex items-center"><i class="fa-solid fa-shield-check text-emerald-600 mr-1.5"></i> Garantia 12 Meses</span>
                <span class="flex items-center"><i class="fa-solid fa-receipt text-amber-500 mr-1.5"></i> Nota Fiscal Eletrônica</span>
            </div>
        </div>

        <!-- Informações e Compra -->
        <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div class="space-y-3">
                <!-- Marca e SKU -->
                <div class="flex items-center space-x-3 text-xs">
                    <span class="bg-blue-950 text-white font-extrabold px-3 py-1 rounded-md uppercase tracking-wider text-[11px]">
                        <?php echo htmlspecialchars($produto['marca_nome'] ?: 'Norte Médica'); ?>
                    </span>
                    <span class="text-slate-400 font-mono">Código: <?php echo htmlspecialchars($produto['sku']); ?></span>
                    <span class="text-emerald-700 bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center">
                        <i class="fa-solid fa-circle-check text-[10px] mr-1"></i> Em Estoque
                    </span>
                </div>

                <!-- Título -->
                <h1 class="text-2xl sm:text-3xl font-black text-blue-950 leading-tight">
                    <?php echo htmlspecialchars($produto['nome']); ?>
                </h1>

                <!-- Descrição Curta -->
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <?php echo htmlspecialchars($produto['descricao_curta']); ?>
                </p>
            </div>

            <!-- Caixa de Preços -->
            <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <?php if ($precoDe > $precoPor): ?>
                    <span class="text-xs text-slate-400 line-through block">
                        De R$ <?php echo number_format($precoDe, 2, ',', '.'); ?>
                    </span>
                <?php endif; ?>

                <!-- Preço PIX Destaque -->
                <div class="flex items-baseline space-x-2">
                    <span class="text-sm font-semibold text-emerald-700">Por</span>
                    <span class="text-3xl sm:text-4xl font-black text-emerald-600">
                        R$ <?php echo number_format($precoPix, 2, ',', '.'); ?>
                    </span>
                    <span class="text-xs font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                        à vista no Pix (10% OFF)
                    </span>
                </div>

                <!-- Cartão Parcelado -->
                <div class="text-xs text-slate-600">
                    ou em até <strong>12x de R$ <?php echo number_format($parcelaValor, 2, ',', '.'); ?></strong> (até 6x sem juros de R$ <?php echo number_format($precoPor / 6, 2, ',', '.'); ?>) no cartão.
                </div>
            </div>

            <!-- Quantidade e Botões de Compra -->
            <div class="space-y-4">
                <div class="flex items-center space-x-4">
                    <label class="text-xs font-bold text-slate-700 uppercase">Quantidade:</label>
                    <div class="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                        <button type="button" onclick="changeProductQty(-1)" class="w-10 h-10 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm">-</button>
                        <input type="number" id="prod_qtd" value="1" min="1" max="50" class="w-12 h-10 text-center font-bold text-sm border-0 focus:ring-0 text-slate-800">
                        <button type="button" onclick="changeProductQty(1)" class="w-10 h-10 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm">+</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onclick="comprarAgora(<?php echo $produto['id']; ?>)" 
                            class="bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-red-600/30 transition flex items-center justify-center space-x-2 text-sm uppercase tracking-wider">
                        <i class="fa-solid fa-bolt text-yellow-300"></i>
                        <span>Comprar Agora</span>
                    </button>
                    
                    <button onclick="adicionarCarrinhoDetalhe(<?php echo $produto['id']; ?>)" 
                            class="bg-blue-950 hover:bg-blue-900 text-white font-bold py-3.5 px-6 rounded-2xl shadow transition flex items-center justify-center space-x-2 text-sm">
                        <i class="fa-solid fa-cart-plus text-emerald-400"></i>
                        <span>Adicionar ao Carrinho</span>
                    </button>
                </div>

                <!-- Botão Cotação WhatsApp PJ -->
                <a href="https://wa.me/<?php echo SITE_WHATSAPP; ?>?text=<?php echo urlencode('Olá, gostaria de solicitar uma cotação para o produto: ' . $produto['nome'] . ' (Código: ' . $produto['sku'] . ')'); ?>" 
                   target="_blank" 
                   class="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition flex items-center justify-center space-x-2">
                    <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
                    <span>Solicitar Cotação para Clínica / Hospital no WhatsApp</span>
                </a>
            </div>

            <!-- Simulador de Frete por CEP -->
            <div class="border-t border-slate-200 pt-5">
                <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
                    <i class="fa-solid fa-truck text-blue-900 mr-1.5"></i> Simular Frete e Prazo de Entrega:
                </label>
                <div class="flex space-x-2 max-w-sm">
                    <input type="text" id="simular_cep" placeholder="00000-000" maxlength="9" 
                           class="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900">
                    <button type="button" onclick="simularFreteProduto(<?php echo $precoPor; ?>)" 
                            class="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition">
                        Calcular
                    </button>
                </div>
                <div id="resultado_frete_produto" class="mt-3 text-xs space-y-1.5 hidden"></div>
            </div>

        </div>

    </div>

    <!-- Abas de Especificações e Detalhes Técnicos -->
    <div class="mt-12 bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm">
        <div class="border-b border-slate-200 pb-4 mb-6">
            <h2 class="text-xl font-black text-blue-950 flex items-center">
                <i class="fa-solid fa-list-check text-emerald-600 mr-2.5"></i>
                Especificações Técnicas e Descrição do Produto
            </h2>
        </div>

        <div class="space-y-8 text-sm text-slate-700 leading-relaxed">
            <div>
                <h3 class="font-bold text-slate-900 text-base mb-2">Visão Geral</h3>
                <p><?php echo nl2br(htmlspecialchars($produto['descricao_longa'])); ?></p>
            </div>

            <?php if (!empty($produto['especificacoes'])): ?>
                <div>
                    <h3 class="font-bold text-slate-900 text-base mb-3">Ficha Técnica e Parâmetros</h3>
                    <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 font-mono text-xs whitespace-pre-line text-slate-800 leading-relaxed">
<?php echo htmlspecialchars($produto['especificacoes']); ?>
                    </div>
                </div>
            <?php endif; ?>

            <div>
                <h3 class="font-bold text-slate-900 text-base mb-2">Garantia e Assistência Técnica Norte Médica</h3>
                <p>
                    Todos os equipamentos comercializados pela Norte Médica acompanham Certificado de Garantia oficial de fábrica (mínimo de 12 meses), manual em português e nota fiscal eletrônica em nome do comprador ou instituição. Contamos com laboratório próprio de Engenharia Clínica em Porto Velho/RO para suporte e calibração.
                </p>
            </div>
        </div>
    </div>

    <!-- Produtos Relacionados -->
    <?php if (!empty($relacionados)): ?>
        <div class="mt-16">
            <h2 class="text-xl font-black text-blue-950 mb-6">Equipamentos e Acessórios Relacionados</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <?php foreach ($relacionados as $rel): 
                    $relPix = $rel['preco_por'] * 0.90;
                ?>
                    <a href="produto.php?slug=<?php echo $rel['slug']; ?>" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                        <div class="h-40 bg-slate-50 rounded-xl p-3 flex items-center justify-center mb-3">
                            <img src="<?php echo htmlspecialchars($rel['imagem_url']); ?>" alt="<?php echo htmlspecialchars($rel['nome']); ?>" class="max-h-full max-w-full object-contain group-hover:scale-105 transition">
                        </div>
                        <div>
                            <span class="text-[10px] font-bold text-blue-900 uppercase block"><?php echo htmlspecialchars($rel['marca_nome']); ?></span>
                            <h4 class="text-xs font-bold text-slate-800 line-clamp-2 mt-0.5"><?php echo htmlspecialchars($rel['nome']); ?></h4>
                            <div class="text-sm font-black text-emerald-600 mt-2">
                                R$ <?php echo number_format($relPix, 2, ',', '.'); ?> <span class="text-[10px] font-normal text-slate-500">no Pix</span>
                            </div>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endif; ?>

</main>

<script>
function changeProductQty(delta) {
    const input = document.getElementById('prod_qtd');
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(50, val + delta));
    input.value = val;
}

function adicionarCarrinhoDetalhe(id) {
    const qtd = parseInt(document.getElementById('prod_qtd').value) || 1;
    addToCart(id, qtd);
}

async function comprarAgora(id) {
    const qtd = parseInt(document.getElementById('prod_qtd').value) || 1;
    try {
        const formData = new FormData();
        formData.append('action', 'add_cart');
        formData.append('produto_id', id);
        formData.append('quantidade', qtd);

        const res = await fetch('api.php', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            window.location.href = 'checkout.php';
        }
    } catch (e) {
        console.error(e);
    }
}

async function simularFreteProduto(subtotal) {
    const cepInput = document.getElementById('simular_cep');
    const rawCep = cepInput.value.replace(/\D/g, '');
    const container = document.getElementById('resultado_frete_produto');

    if (rawCep.length !== 8) {
        alert('Digite um CEP válido com 8 dígitos.');
        return;
    }

    container.classList.remove('hidden');
    container.innerHTML = '<span class="text-slate-400"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Calculando...</span>';

    try {
        const res = await fetch(`api.php?action=calc_frete&cep=${rawCep}&subtotal=${subtotal}`);
        const data = await res.json();

        if (data.success && data.opcoes) {
            let html = '';
            data.opcoes.forEach(op => {
                html += `
                    <div class="flex justify-between p-2 bg-slate-100 rounded-lg">
                        <span><strong>${op.nome}</strong> (${op.prazo})</span>
                        <span class="font-bold text-emerald-700">${op.valor_formatado}</span>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    } catch (e) {
        container.innerHTML = '<span class="text-red-500">Erro ao calcular frete.</span>';
    }
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
