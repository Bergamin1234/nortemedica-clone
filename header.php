<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();

// Busca categorias para o menu
$stmtCat = $pdo->query("SELECT id, nome, slug, icone FROM categorias ORDER BY ordem ASC");
$menuCategorias = $stmtCat->fetchAll();

// Quantidade no carrinho
$carrinhoCount = isset($_SESSION['carrinho']) ? array_sum($_SESSION['carrinho']) : 0;
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? htmlspecialchars($pageTitle) . ' | ' . SITE_NOME : SITE_NOME . ' - Hospitalar, Cirúrgico e Laboratorial'; ?></title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/img/favicon.png">
    <link rel="apple-touch-icon" href="assets/img/icon.png">
    
    <!-- Metas SEO -->
    <meta name="description" content="Produtos e equipamentos médicos, hospitalares e laboratoriais em Rondônia e todo o Brasil. Venda e assistência técnica autorizada.">
    <meta name="keywords" content="equipamentos hospitalares, autoclave, monitor multiparametrico, desfibrilador, porto velho, rondonia, norte medica, produtos medicos">
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NMQ5ZSDTFH"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-NMQ5ZSDTFH');
    </script>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        nmBlue: {
                            light: '#1a4373',
                            DEFAULT: '#0b2545',
                            dark: '#07192f'
                        },
                        nmRed: {
                            DEFAULT: '#c52228',
                            dark: '#991b1b'
                        }
                    }
                }
            }
        }
    </script>
    
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- CSS Customizado -->
    <link rel="stylesheet" href="assets/css/custom.css">
</head>
<body class="bg-slate-50 min-h-screen flex flex-col justify-between text-slate-800">

    <!-- Top Bar Institucional -->
    <div class="bg-blue-950 text-slate-300 text-xs py-2 border-b border-blue-900">
        <div class="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
            <div class="flex items-center space-x-4">
                <span class="flex items-center"><i class="fa-solid fa-phone text-emerald-400 mr-1.5"></i> <?php echo SITE_TELEFONE; ?></span>
                <span class="hidden md:flex items-center"><i class="fa-brands fa-whatsapp text-emerald-400 mr-1.5"></i> Televendas & Cotações</span>
                <span class="hidden lg:flex items-center text-slate-400"><i class="fa-solid fa-location-dot text-red-400 mr-1.5"></i> Porto Velho - RO / Atendimento Nacional</span>
            </div>
            <div class="flex items-center space-x-4">
                <a href="https://wa.me/<?php echo SITE_WHATSAPP; ?>" target="_blank" class="hover:text-white flex items-center text-emerald-400 font-semibold">
                    <i class="fa-brands fa-whatsapp mr-1 text-sm"></i> WhatsApp Comercial
                </a>
                <span class="text-slate-600">|</span>
                <a href="sobre.php" class="hover:text-white transition">Quem Somos</a>
                <a href="contato.php" class="hover:text-white transition">Licitações & Contato</a>
                <a href="admin/login.php" class="hover:text-emerald-400 transition font-medium flex items-center">
                    <i class="fa-solid fa-user-shield mr-1"></i> Admin
                </a>
            </div>
        </div>
    </div>

    <!-- Header Principal -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-3 md:py-4">
            <div class="flex items-center justify-between gap-4 md:gap-8">
                
                <!-- Logo Norte Médica Oficial -->
                <a href="index.php" class="flex items-center group shrink-0 py-1">
                    <img src="assets/img/logo.png" alt="Norte Médica" class="h-9 sm:h-11 md:h-12 w-auto object-contain group-hover:opacity-95 transition">
                </a>

                <!-- Campo de Busca em Tempo Real -->
                <div class="flex-1 max-w-2xl relative hidden sm:block">
                    <div class="relative">
                        <input type="text" placeholder="Buscar por produto, marca ou código hospitalar (ex: monitor, autoclave, DEA)..." 
                               class="input-busca-produtos w-full pl-11 pr-24 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-full text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition">
                        <div class="absolute left-4 top-3 text-slate-400">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <button class="absolute right-1.5 top-1.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition shadow-sm">
                            Buscar
                        </button>
                    </div>
                    <!-- Dropdown de Autocomplete -->
                    <div class="search-autocomplete-dropdown hidden absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto"></div>
                </div>

                <!-- Ações do Topo: Atendimento e Carrinho -->
                <div class="flex items-center space-x-3 md:space-x-6 shrink-0">
                    
                    <!-- Faturamento / Cotação PJ -->
                    <a href="contato.php" class="hidden xl:flex items-center space-x-2 text-left group">
                        <div class="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 text-blue-900 flex items-center justify-center text-sm transition">
                            <i class="fa-solid fa-file-invoice-dollar"></i>
                        </div>
                        <div class="text-xs">
                            <span class="text-slate-400 block leading-tight">Faturamento PJ</span>
                            <strong class="text-slate-800 group-hover:text-blue-900">Solicitar Cotação</strong>
                        </div>
                    </a>

                    <!-- Botão Carrinho com Drawer -->
                    <button onclick="openCartDrawer()" class="relative flex items-center space-x-2.5 bg-slate-100 hover:bg-blue-50 text-blue-950 px-3.5 py-2 md:py-2.5 rounded-xl border border-slate-200 transition group">
                        <div class="relative">
                            <i class="fa-solid fa-cart-shopping text-base md:text-lg text-blue-950 group-hover:text-red-600 transition"></i>
                            <span class="cart-count-badge <?php echo $carrinhoCount > 0 ? '' : 'hidden'; ?> absolute -top-2.5 -right-2.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                                <?php echo $carrinhoCount; ?>
                            </span>
                        </div>
                        <span class="hidden md:inline font-bold text-xs uppercase tracking-wider text-slate-700">Meu Carrinho</span>
                    </button>

                </div>

            </div>

            <!-- Busca Mobile -->
            <div class="mt-3 relative sm:hidden">
                <input type="text" placeholder="Buscar produtos médicos..." 
                       class="input-busca-produtos w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900">
                <div class="absolute left-3 top-2.5 text-slate-400 text-xs">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <div class="search-autocomplete-dropdown hidden absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto"></div>
            </div>

        </div>

        <!-- Barra de Navegação e Categorias -->
        <nav class="bg-blue-950 text-white">
            <div class="max-w-7xl mx-auto px-4 flex items-center justify-between">
                
                <!-- Menu Todos os Departamentos (Dropdown) -->
                <div class="relative nav-dropdown py-3 pr-6 border-r border-blue-900">
                    <button class="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-emerald-400 hover:text-emerald-300">
                        <i class="fa-solid fa-bars-staggered text-sm"></i>
                        <span>Departamentos</span>
                        <i class="fa-solid fa-chevron-down text-[10px] ml-1"></i>
                    </button>
                    <!-- Menu Flutuante -->
                    <div class="dropdown-menu hidden absolute left-0 top-full w-72 bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-slate-200 py-2 z-50">
                        <?php foreach ($menuCategorias as $cat): ?>
                            <a href="index.php?categoria=<?php echo $cat['slug']; ?>" class="flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 text-xs font-medium text-slate-700 hover:text-blue-950">
                                <i class="fa-solid <?php echo $cat['icone'] ?: 'fa-box'; ?> text-blue-900 text-sm w-4 text-center"></i>
                                <span><?php echo htmlspecialchars($cat['nome']); ?></span>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Links Rápidos de Categorias no Header -->
                <div class="hidden lg:flex items-center space-x-6 text-xs font-medium overflow-x-auto py-3">
                    <?php 
                    $destaqueMenu = array_slice($menuCategorias, 0, 5);
                    foreach ($destaqueMenu as $mCat): 
                    ?>
                        <a href="index.php?categoria=<?php echo $mCat['slug']; ?>" class="text-slate-200 hover:text-emerald-400 whitespace-nowrap transition flex items-center">
                            <?php echo htmlspecialchars($mCat['nome']); ?>
                        </a>
                    <?php endforeach; ?>
                </div>

                <!-- Vantagens Rápidas na barra -->
                <div class="hidden md:flex items-center space-x-3 text-xs text-slate-300">
                    <span class="flex items-center text-emerald-400 font-semibold">
                        <i class="fa-solid fa-shield-check mr-1"></i> Compra 100% Segura
                    </span>
                    <span class="text-slate-600">|</span>
                    <span class="flex items-center text-yellow-400 font-semibold">
                        <i class="fa-solid fa-percent mr-1"></i> 10% OFF no Pix
                    </span>
                </div>

            </div>
        </nav>
    </header>

    <!-- Overlay e Drawer Lateral do Carrinho -->
    <div id="cart-overlay" onclick="closeCartDrawer()" class="hidden fixed inset-0 bg-slate-950/60 z-50 transition-opacity duration-300 opacity-0"></div>
    <div id="cart-drawer" class="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between">
        
        <!-- Header do Drawer -->
        <div class="p-4 bg-blue-950 text-white flex items-center justify-between border-b border-blue-900">
            <div class="flex items-center space-x-2">
                <i class="fa-solid fa-cart-shopping text-emerald-400"></i>
                <h3 class="font-bold text-sm tracking-wide uppercase">Meu Carrinho</h3>
            </div>
            <button onclick="closeCartDrawer()" class="w-8 h-8 rounded-full bg-blue-900 hover:bg-blue-800 text-white flex items-center justify-center transition">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <!-- Lista de Itens do Carrinho -->
        <div id="cart-drawer-items" class="p-4 flex-1 overflow-y-auto">
            <!-- Renderizado via JavaScript -->
        </div>

        <!-- Rodapé do Drawer com Totais e Botão Finalizar -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div class="flex justify-between items-center text-xs text-slate-500">
                <span>Subtotal:</span>
                <strong id="cart-drawer-subtotal" class="text-slate-800 text-sm">R$ 0,00</strong>
            </div>
            <div class="flex justify-between items-center text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span>Total com Desconto no Pix:</span>
                <strong id="cart-drawer-total-pix" class="text-sm font-black">R$ 0,00</strong>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1">
                <a href="carrinho.php" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-center text-xs transition">
                    Ver Carrinho
                </a>
                <a id="btn-drawer-checkout" href="checkout.php" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-center text-xs transition shadow flex items-center justify-center space-x-1">
                    <span>Finalizar Compra</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
            </div>
        </div>

    </div>
