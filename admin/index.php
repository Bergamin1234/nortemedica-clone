<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

if (!isset($_SESSION['admin_usuario'])) {
    header("Location: login.php");
    exit;
}

$pdo = getDbConnection();

// Métricas de Vendas e Pedidos
$totalVendas = $pdo->query("SELECT SUM(total) FROM pedidos WHERE status_pedido != 'Cancelado'")->fetchColumn() ?: 0;
$totalPedidos = $pdo->query("SELECT COUNT(*) FROM pedidos")->fetchColumn() ?: 0;
$totalProdutos = $pdo->query("SELECT COUNT(*) FROM produtos WHERE ativo = 1")->fetchColumn() ?: 0;
$pedidosPendentes = $pdo->query("SELECT COUNT(*) FROM pedidos WHERE status_pagamento = 'Aguardando Pagamento'")->fetchColumn() ?: 0;

// Últimos Pedidos
$stmtRecentes = $pdo->query("SELECT * FROM pedidos ORDER BY id DESC LIMIT 10");
$pedidosRecentes = $stmtRecentes->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Administrativo - Norte Médica</title>
    <link rel="icon" type="image/png" href="../assets/img/favicon.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-100 min-h-screen text-slate-800 flex flex-col justify-between">

    <!-- Header do Painel -->
    <header class="bg-blue-950 text-white shadow-md border-b-2 border-emerald-500 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <a href="index.php" class="flex items-center space-x-2">
                    <img src="../assets/img/logo-white.png" alt="Norte Médica Admin" class="h-8 w-auto object-contain">
                    <span class="text-xs bg-emerald-500 text-blue-950 font-black px-2 py-0.5 rounded uppercase">Admin</span>
                </a>
            </div>

            <!-- Navegação Admin -->
            <nav class="hidden md:flex items-center space-x-6 text-xs font-semibold">
                <a href="index.php" class="text-emerald-400 flex items-center space-x-1.5"><i class="fa-solid fa-chart-line"></i><span>Dashboard</span></a>
                <a href="produtos.php" class="text-slate-300 hover:text-white flex items-center space-x-1.5"><i class="fa-solid fa-boxes-stacked"></i><span>Gerenciar Produtos</span></a>
                <a href="pedidos.php" class="text-slate-300 hover:text-white flex items-center space-x-1.5"><i class="fa-solid fa-file-invoice-dollar"></i><span>Pedidos (<?php echo $totalPedidos; ?>)</span></a>
            </nav>

            <div class="flex items-center space-x-4 text-xs">
                <a href="../index.php" target="_blank" class="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 transition">
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>Ver Loja</span>
                </a>
                <span class="text-slate-400">|</span>
                <span class="text-slate-300 font-bold hidden sm:inline"><?php echo htmlspecialchars($_SESSION['admin_nome']); ?></span>
                <a href="logout.php" class="text-red-400 hover:text-red-300 font-bold flex items-center space-x-1" title="Sair do Sistema">
                    <i class="fa-solid fa-power-off"></i>
                    <span class="hidden sm:inline">Sair</span>
                </a>
            </div>
        </div>
    </header>

    <!-- Conteúdo Principal do Painel -->
    <main class="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        
        <!-- Título e Boas-Vindas -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-2xl font-black text-blue-950">Visão Geral de Vendas</h1>
                <p class="text-xs text-slate-500">Acompanhe métricas, pedidos e produtos da sua distribuidora médica</p>
            </div>
            <div class="flex space-x-3">
                <a href="produtos.php?novo=1" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center space-x-2">
                    <i class="fa-solid fa-plus"></i>
                    <span>Novo Produto</span>
                </a>
                <a href="pedidos.php" class="bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center space-x-2">
                    <i class="fa-solid fa-receipt"></i>
                    <span>Todos os Pedidos</span>
                </a>
            </div>
        </div>

        <!-- Cards de Estatísticas / Métricas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Faturamento Total</span>
                    <strong class="text-2xl font-black text-slate-900 mt-1 block">
                        R$ <?php echo number_format($totalVendas, 2, ',', '.'); ?>
                    </strong>
                    <span class="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
                        <i class="fa-solid fa-arrow-trend-up mr-1"></i> Vendas registradas
                    </span>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-wallet"></i>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total de Pedidos</span>
                    <strong class="text-2xl font-black text-slate-900 mt-1 block"><?php echo $totalPedidos; ?></strong>
                    <span class="text-[11px] text-blue-900 font-semibold flex items-center mt-1">
                        <i class="fa-solid fa-cart-check mr-1"></i> Transações
                    </span>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-file-invoice"></i>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Produtos Ativos</span>
                    <strong class="text-2xl font-black text-slate-900 mt-1 block"><?php echo $totalProdutos; ?></strong>
                    <span class="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
                        <i class="fa-solid fa-check mr-1"></i> Catálogo online
                    </span>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-stethoscope"></i>
                </div>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Aguardando Pagamento</span>
                    <strong class="text-2xl font-black text-amber-600 mt-1 block"><?php echo $pedidosPendentes; ?></strong>
                    <span class="text-[11px] text-amber-600 font-semibold flex items-center mt-1">
                        <i class="fa-solid fa-clock mr-1"></i> Pix / Boletos pendentes
                    </span>
                </div>
                <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                    <i class="fa-solid fa-hourglass-half"></i>
                </div>
            </div>

        </div>

        <!-- Tabela de Pedidos Recentes -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 class="text-base font-black text-blue-950">Pedidos Recentes</h2>
                    <p class="text-xs text-slate-500">Últimas compras realizadas na loja virtual</p>
                </div>
                <a href="pedidos.php" class="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center space-x-1">
                    <span>Ver todos</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                        <tr>
                            <th class="py-3 px-4">Código</th>
                            <th class="py-3 px-4">Cliente / Entidade</th>
                            <th class="py-3 px-4">Data</th>
                            <th class="py-3 px-4">Pagamento</th>
                            <th class="py-3 px-4">Total</th>
                            <th class="py-3 px-4">Status</th>
                            <th class="py-3 px-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php if (empty($pedidosRecentes)): ?>
                            <tr>
                                <td colspan="7" class="py-8 text-center text-slate-400">Nenhum pedido registrado até o momento.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($pedidosRecentes as $ped): ?>
                                <tr class="hover:bg-slate-50 transition">
                                    <td class="py-3.5 px-4 font-mono font-bold text-blue-950">
                                        <?php echo htmlspecialchars($ped['codigo_pedido']); ?>
                                    </td>
                                    <td class="py-3.5 px-4">
                                        <strong class="font-bold text-slate-800 block"><?php echo htmlspecialchars($ped['nome_cliente']); ?></strong>
                                        <span class="text-slate-400 text-[11px]"><?php echo htmlspecialchars($ped['cidade'] . ' - ' . $ped['estado']); ?></span>
                                    </td>
                                    <td class="py-3.5 px-4 text-slate-500">
                                        <?php echo date('d/m/Y H:i', strtotime($ped['created_at'])); ?>
                                    </td>
                                    <td class="py-3.5 px-4">
                                        <span class="font-bold text-[11px] uppercase <?php echo $ped['metodo_pagamento'] === 'PIX' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' : 'text-slate-700'; ?>">
                                            <?php echo htmlspecialchars($ped['metodo_pagamento']); ?>
                                        </span>
                                    </td>
                                    <td class="py-3.5 px-4 font-black text-slate-900">
                                        R$ <?php echo number_format($ped['total'], 2, ',', '.'); ?>
                                    </td>
                                    <td class="py-3.5 px-4">
                                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold 
                                            <?php 
                                            if ($ped['status_pagamento'] === 'Aprovado' || $ped['status_pedido'] === 'Concluído') {
                                                echo 'bg-emerald-100 text-emerald-800';
                                            } elseif ($ped['status_pagamento'] === 'Aguardando Pagamento') {
                                                echo 'bg-amber-100 text-amber-800';
                                            } else {
                                                echo 'bg-blue-100 text-blue-800';
                                            }
                                            ?>">
                                            <?php echo htmlspecialchars($ped['status_pedido']); ?>
                                        </span>
                                    </td>
                                    <td class="py-3.5 px-4 text-right">
                                        <a href="pedidos.php?id=<?php echo $ped['id']; ?>" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition">
                                            Detalhes
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </main>

    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        &copy; <?php echo date('Y'); ?> Norte Médica - Painel de Controle Administrativo.
    </footer>

</body>
</html>
