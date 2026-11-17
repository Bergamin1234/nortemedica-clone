<?php
$pageTitle = "Distribuidora de Materiais e Equipamentos Médicos Hospitalares";
require_once __DIR__ . '/header.php';

// Filtro de categoria selecionada
$catSlug = $_GET['categoria'] ?? '';
$busca = trim($_GET['busca'] ?? '');
$marcaFiltro = $_GET['marca'] ?? '';

// Monta consulta SQL com filtros
$params = [];
$sql = "
    SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug, m.nome as marca_nome, m.slug as marca_slug
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN marcas m ON p.marca_id = m.id
    WHERE p.ativo = 1
";

if (!empty($catSlug)) {
    $sql .= " AND c.slug = ?";
    $params[] = $catSlug;
}

if (!empty($busca)) {
    $sql .= " AND (p.nome LIKE ? OR p.sku LIKE ? OR p.descricao_curta LIKE ?)";
    $buscaTerm = "%{$busca}%";
    $params[] = $buscaTerm;
    $params[] = $buscaTerm;
    $params[] = $buscaTerm;
}

if (!empty($marcaFiltro)) {
    $sql .= " AND m.slug = ?";
    $params[] = $marcaFiltro;
}

$sql .= " ORDER BY p.destaque DESC, p.id DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$produtos = $stmt->fetchAll();

// Busca todas as marcas para o filtro lateral
$stmtMarcas = $pdo->query("SELECT * FROM marcas ORDER BY nome ASC");
$todasMarcas = $stmtMarcas->fetchAll();

// Categoria atual caso esteja filtrado
$categoriaAtual = null;
if (!empty($catSlug)) {
    foreach ($menuCategorias as $cat) {
        if ($cat['slug'] === $catSlug) {
            $categoriaAtual = $cat;
            break;
        }
    }
}
?>

<!-- Banner Principal / Hero Carousel -->
<?php if (empty($catSlug) && empty($busca)): ?>
    <section class="relative bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white overflow-hidden py-12 md:py-20 border-b border-blue-900">
        <!-- Detalhes de fundo em SVG -->
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div class="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-7 space-y-6">
                <div class="inline-flex items-center space-x-2 bg-blue-800/80 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border border-blue-700 shadow-sm">
                    <i class="fa-solid fa-certificate text-emerald-400"></i>
                    <span>DISTRIBUIDOR AUTORIZADO DE MARCAS LÍDERES</span>
                </div>

                <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    Equipamentos e Insumos <br class="hidden sm:inline">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                        Médico-Hospitalares
                    </span>
                </h1>

                <p class="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                    Mais de 20 anos fornecendo alta tecnologia para UTIs, centros cirúrgicos, clínicas e hospitais em Rondônia e em todo o Brasil. Venda direta, pronta entrega e assistência técnica autorizada.
                </p>

                <!-- Ações do Banner -->
                <div class="flex flex-wrap gap-3 pt-2">
                    <a href="#catalogo-produtos" class="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs md:text-sm shadow-lg hover:shadow-red-600/30 transition flex items-center space-x-2">
                        <span>Ver Catálogo de Produtos</span>
                        <i class="fa-solid fa-arrow-down"></i>
                    </a>
                    <a href="https://wa.me/<?php echo SITE_WHATSAPP; ?>" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-xs md:text-sm shadow-lg hover:shadow-emerald-600/30 transition flex items-center space-x-2">
                        <i class="fa-brands fa-whatsapp text-base"></i>
                        <span>Cotação Imediata no WhatsApp</span>
                    </a>
                </div>

                <!-- Marcas em Destaque no Banner -->
                <div class="pt-6 border-t border-blue-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span class="font-bold text-white uppercase tracking-wider text-[11px]">Principais Fabricantes:</span>
                    <span class="font-bold text-slate-200 bg-blue-900/60 px-2.5 py-1 rounded">INSTRAMED</span>
                    <span class="font-bold text-slate-200 bg-blue-900/60 px-2.5 py-1 rounded">SERCON</span>
                    <span class="font-bold text-slate-200 bg-blue-900/60 px-2.5 py-1 rounded">MAGNAMED</span>
                    <span class="font-bold text-slate-200 bg-blue-900/60 px-2.5 py-1 rounded">PROTEC</span>
                    <span class="font-bold text-slate-200 bg-blue-900/60 px-2.5 py-1 rounded">WELMY</span>
                </div>
            </div>

            <!-- Imagem Destaque do Hero -->
            <div class="lg:col-span-5 relative flex justify-center">
                <div class="relative w-full max-w-md">
                    <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl blur-xl opacity-30"></div>
                    <div class="relative bg-white/10 backdrop-blur-md p-3 rounded-3xl border border-white/20 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80" 
                             alt="Equipamentos Hospitalares Norte Médica" 
                             class="w-full h-72 sm:h-80 object-cover rounded-2xl shadow-inner">
                        <div class="p-4 text-left">
                            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Equipamento em Destaque</span>
                            <h3 class="font-bold text-white text-base">Monitores Multiparâmetricos & UTIs</h3>
                            <p class="text-xs text-slate-300 mt-1">Homologados pela ANVISA com garantia total e calibração inicial.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- Barra de Vantagens E-Commerce -->
    <section class="bg-white border-b border-slate-200 py-6">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <i class="fa-solid fa-qrcode text-emerald-600 text-2xl"></i>
                <div class="text-xs">
                    <strong class="text-slate-800 block font-bold">10% de Desconto no PIX</strong>
                    <span class="text-slate-500">Economia real à vista</span>
                </div>
            </div>

            <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <i class="fa-solid fa-credit-card text-blue-900 text-2xl"></i>
                <div class="text-xs">
                    <strong class="text-slate-800 block font-bold">Até 12x no Cartão</strong>
                    <span class="text-slate-500">Até 6x sem juros</span>
                </div>
            </div>

            <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <i class="fa-solid fa-truck-ramp-box text-red-600 text-2xl"></i>
                <div class="text-xs">
                    <strong class="text-slate-800 block font-bold">Frete Grátis</strong>
                    <span class="text-slate-500">Em compras acima de R$ 1.500</span>
                </div>
            </div>

            <div class="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <i class="fa-solid fa-screwdriver-wrench text-amber-500 text-2xl"></i>
                <div class="text-xs">
                    <strong class="text-slate-800 block font-bold">Assistência Própria</strong>
                    <span class="text-slate-500">Peças e suporte em RO</span>
                </div>
            </div>

        </div>
    </section>

    <!-- Grid de Categorias Visuais -->
    <section class="max-w-7xl mx-auto px-4 py-12">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-xl md:text-2xl font-black text-blue-950">Departamentos Médicos</h2>
                <p class="text-xs md:text-sm text-slate-500 mt-0.5">Explore nossas linhas completas de suprimentos para saúde</p>
            </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <?php foreach ($menuCategorias as $cat): ?>
                <a href="index.php?categoria=<?php echo $cat['slug']; ?>" 
                   class="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-900 transition flex flex-col items-center text-center">
                    <div class="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-900 text-blue-950 group-hover:text-white flex items-center justify-center text-xl transition mb-2.5">
                        <i class="fa-solid <?php echo $cat['icone'] ?: 'fa-stethoscope'; ?>"></i>
                    </div>
                    <span class="text-xs font-bold text-slate-800 group-hover:text-blue-950 leading-tight">
                        <?php echo htmlspecialchars($cat['nome']); ?>
                    </span>
                </a>
            <?php endforeach; ?>
        </div>
    </section>
<?php endif; ?>

<!-- Área Principal do Catálogo com Filtros -->
<main id="catalogo-produtos" class="max-w-7xl mx-auto px-4 py-10 flex-1">
    
    <!-- Cabeçalho do Catálogo / Breadcrumb -->
    <div class="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <a href="index.php" class="hover:text-blue-950 font-medium">Início</a>
                <i class="fa-solid fa-chevron-right text-[9px]"></i>
                <span class="text-slate-700 font-bold">
                    <?php 
                    if (!empty($categoriaAtual)) {
                        echo htmlspecialchars($categoriaAtual['nome']);
                    } elseif (!empty($busca)) {
                        echo 'Resultados para "' . htmlspecialchars($busca) . '"';
                    } elseif (!empty($marcaFiltro)) {
                        echo 'Marca: ' . htmlspecialchars(strtoupper($marcaFiltro));
                    } else {
                        echo 'Catálogo Completo';
                    }
                    ?>
                </span>
            </div>
            <h2 class="text-xl md:text-2xl font-black text-blue-950">
                <?php 
                if (!empty($categoriaAtual)) {
                    echo htmlspecialchars($categoriaAtual['nome']);
                } elseif (!empty($busca)) {
                    echo 'Busca: ' . htmlspecialchars($busca);
                } else {
                    echo 'Produtos e Equipamentos em Destaque';
                }
                ?>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
                Exibindo <strong><?php echo count($produtos); ?></strong> produtos com garantia de fábrica e nota fiscal
            </p>
        </div>

        <?php if (!empty($catSlug) || !empty($busca) || !empty($marcaFiltro)): ?>
            <a href="index.php" class="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                <i class="fa-solid fa-xmark"></i>
                <span>Limpar Filtros</span>
            </a>
        <?php endif; ?>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Barra Lateral de Filtros (Categorias e Marcas) -->
        <aside class="space-y-6">
            
            <!-- Filtro de Categorias -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="font-bold text-sm text-blue-950 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Categorias</span>
                    <i class="fa-solid fa-folder-tree text-slate-400 text-xs"></i>
                </h3>
                <ul class="space-y-1 text-xs">
                    <li>
                        <a href="index.php" class="flex items-center justify-between py-1.5 px-2 rounded-lg font-medium <?php echo empty($catSlug) ? 'bg-blue-950 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'; ?>">
                            <span>Todos os Departamentos</span>
                            <i class="fa-solid fa-chevron-right text-[9px] opacity-60"></i>
                        </a>
                    </li>
                    <?php foreach ($menuCategorias as $cat): ?>
                        <li>
                            <a href="index.php?categoria=<?php echo $cat['slug']; ?>" 
                               class="flex items-center justify-between py-1.5 px-2 rounded-lg font-medium <?php echo $catSlug === $cat['slug'] ? 'bg-blue-950 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'; ?>">
                                <span class="truncate"><?php echo htmlspecialchars($cat['nome']); ?></span>
                                <i class="fa-solid fa-chevron-right text-[9px] opacity-60"></i>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- Filtro de Marcas -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="font-bold text-sm text-blue-950 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>Marcas Fabricantes</span>
                    <i class="fa-solid fa-tags text-slate-400 text-xs"></i>
                </h3>
                <ul class="space-y-1 text-xs">
                    <?php foreach ($todasMarcas as $m): ?>
                        <li>
                            <a href="index.php?marca=<?php echo $m['slug']; ?><?php echo !empty($catSlug) ? '&categoria=' . $catSlug : ''; ?>" 
                               class="flex items-center justify-between py-1.5 px-2 rounded-lg font-medium <?php echo $marcaFiltro === $m['slug'] ? 'bg-blue-950 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'; ?>">
                                <span><?php echo htmlspecialchars($m['nome']); ?></span>
                                <i class="fa-solid fa-chevron-right text-[9px] opacity-60"></i>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- Card de Assistência e Cotação -->
            <div class="bg-gradient-to-br from-blue-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm text-xs space-y-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
                    <i class="fa-solid fa-headset"></i>
                </div>
                <h4 class="font-bold text-sm text-white">Precisa de cotação para edital ou clínica?</h4>
                <p class="text-slate-300 leading-relaxed">
                    Nossa equipe técnica prepara orçamentos personalizados com faturamento direto e prazos compatíveis com a sua instituição.
                </p>
                <a href="https://wa.me/<?php echo SITE_WHATSAPP; ?>" target="_blank" class="block bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl text-center shadow transition">
                    <i class="fa-brands fa-whatsapp mr-1"></i> Falar com Especialista
                </a>
            </div>

        </aside>

        <!-- Vitrine de Produtos (Grid) -->
        <div class="lg:col-span-3">
            
            <?php if (empty($produtos)): ?>
                <div class="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
                    <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mx-auto">
                        <i class="fa-solid fa-box-open"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800">Nenhum produto encontrado</h3>
                    <p class="text-xs text-slate-500 max-w-sm mx-auto">
                        Não encontramos nenhum item correspondente aos filtros selecionados. Tente buscar com outros termos.
                    </p>
                    <a href="index.php" class="inline-block bg-blue-950 text-white text-xs font-bold px-4 py-2 rounded-xl">
                        Ver Todos os Produtos
                    </a>
                </div>
            <?php else: ?>
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    <?php foreach ($produtos as $prod): 
                        $precoPor = (float)$prod['preco_por'];
                        $precoDe = (float)$prod['preco_de'];
                        $precoPix = $precoPor * (1 - (DESCONTO_PIX_PERCENTUAL / 100));
                        $parcelaValor = $precoPor / 12;
                    ?>
                        <div class="product-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm relative group">
                            
                            <!-- Imagem e Badges -->
                            <div class="relative bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-center h-56 overflow-hidden">
                                
                                <!-- Badges Flutuantes -->
                                <div class="absolute top-3 left-3 flex flex-col gap-1 z-10">
                                    <?php if ($prod['lancamento']): ?>
                                        <span class="bg-blue-950 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                                            Lançamento
                                        </span>
                                    <?php endif; ?>
                                    <?php if ($precoDe > $precoPor): ?>
                                        <span class="badge-discount text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Oferta
                                        </span>
                                    <?php endif; ?>
                                </div>

                                <div class="absolute top-3 right-3 z-10">
                                    <span class="badge-pix text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow">
                                        10% OFF PIX
                                    </span>
                                </div>

                                <a href="produto.php?slug=<?php echo $prod['slug']; ?>" class="block w-full h-full flex items-center justify-center">
                                    <img src="<?php echo htmlspecialchars($prod['imagem_url']); ?>" 
                                         alt="<?php echo htmlspecialchars($prod['nome']); ?>" 
                                         class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300">
                                </a>
                            </div>

                            <!-- Informações do Produto -->
                            <div class="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <!-- Marca e SKU -->
                                    <div class="flex items-center justify-between text-[11px] mb-1.5">
                                        <span class="font-extrabold text-blue-950 uppercase tracking-wider">
                                            <?php echo htmlspecialchars($prod['marca_nome'] ?: 'Norte Médica'); ?>
                                        </span>
                                        <span class="text-slate-400 font-mono">
                                            <?php echo htmlspecialchars($prod['sku']); ?>
                                        </span>
                                    </div>

                                    <!-- Nome do Produto -->
                                    <h3 class="font-bold text-slate-800 text-sm leading-snug line-clamp-2 hover:text-blue-950 transition">
                                        <a href="produto.php?slug=<?php echo $prod['slug']; ?>">
                                            <?php echo htmlspecialchars($prod['nome']); ?>
                                        </a>
                                    </h3>

                                    <!-- Descrição Curta -->
                                    <p class="text-xs text-slate-500 mt-1 line-clamp-2">
                                        <?php echo htmlspecialchars($prod['descricao_curta']); ?>
                                    </p>
                                </div>

                                <!-- Preços e Parcelamento -->
                                <div class="mt-4 pt-3 border-t border-slate-100">
                                    <?php if ($precoDe > $precoPor): ?>
                                        <span class="text-slate-400 line-through text-xs block">
                                            De R$ <?php echo number_format($precoDe, 2, ',', '.'); ?>
                                        </span>
                                    <?php endif; ?>

                                    <!-- Preço com Desconto no PIX -->
                                    <div class="flex items-baseline space-x-1.5">
                                        <span class="text-xs font-semibold text-emerald-700">Por</span>
                                        <span class="text-xl font-black text-emerald-600">
                                            R$ <?php echo number_format($precoPix, 2, ',', '.'); ?>
                                        </span>
                                        <span class="text-[10px] font-bold text-emerald-700 uppercase">no Pix</span>
                                    </div>

                                    <!-- Preço Cartão e Parcelas -->
                                    <div class="text-[11px] text-slate-600 mt-0.5">
                                        ou <strong>R$ <?php echo number_format($precoPor, 2, ',', '.'); ?></strong> em até <strong>12x de R$ <?php echo number_format($parcelaValor, 2, ',', '.'); ?></strong>
                                    </div>

                                    <!-- Botão Comprar -->
                                    <div class="mt-4 flex gap-2">
                                        <button onclick="addToCart(<?php echo $prod['id']; ?>, 1, event)" 
                                                class="btn-nm-buy flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm">
                                            <i class="fa-solid fa-cart-shopping"></i>
                                            <span>Comprar</span>
                                        </button>
                                        <a href="produto.php?slug=<?php echo $prod['slug']; ?>" 
                                           class="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl text-xs flex items-center justify-center transition" title="Ver Detalhes">
                                            <i class="fa-solid fa-eye"></i>
                                        </a>
                                    </div>
                                </div>

                            </div>

                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

        </div>

    </div>

</main>

<?php require_once __DIR__ . '/footer.php'; ?>
