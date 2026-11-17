<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

if (!isset($_SESSION['admin_usuario'])) {
    header("Location: login.php");
    exit;
}

$pdo = getDbConnection();
$mensagem = '';

// Atualizar Status do Pedido
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['atualizar_status'])) {
    $pedidoId = (int)$_POST['pedido_id'];
    $novoStatusPedido = $_POST['status_pedido'];
    $novoStatusPagamento = $_POST['status_pagamento'];

    $stmt = $pdo->prepare("UPDATE pedidos SET status_pedido = ?, status_pagamento = ? WHERE id = ?");
    $stmt->execute([$novoStatusPedido, $novoStatusPagamento, $pedidoId]);
    $mensagem = "Status do pedido atualizado com sucesso!";
}

// Visualizar detalhes de um pedido específico
$pedidoDetalhe = null;
$itensDetalhe = [];
if (isset($_GET['id'])) {
    $idPed = (int)$_GET['id'];
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE id = ?");
    $stmt->execute([$idPed]);
    $pedidoDetalhe = $stmt->fetch();

    if ($pedidoDetalhe) {
        $stmtItens = $pdo->prepare("SELECT * FROM itens_pedido WHERE pedido_id = ?");
        $stmtItens->execute([$idPed]);
        $itensDetalhe = $stmtItens->fetchAll();
    }
}

// Filtro de status na listagem
$filtroStatus = $_GET['status'] ?? '';
$sql = "SELECT * FROM pedidos";
$params = [];
if (!empty($filtroStatus)) {
    $sql .= " WHERE status_pedido = ?";
    $params[] = $filtroStatus;
}
$sql .= " ORDER BY id DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$pedidos = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestão de Pedidos - Norte Médica</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-100 min-h-screen text-slate-800 flex flex-col justify-between">

    <!-- Header do Painel -->
    <header class="bg-blue-950 text-white shadow-md border-b-2 border-emerald-500 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="index.php" class="flex items-center space-x-2 font-black text-lg">
                <span class="w-8 h-8 rounded-lg bg-emerald-500 text-blue-950 flex items-center justify-center font-black">
                    <i class="fa-solid fa-heart-pulse text-sm"></i>
                </span>
                <span>NORTE<span class="text-red-500">MÉDICA</span> ADMIN</span>
            </a>

            <nav class="hidden md:flex items-center space-x-6 text-xs font-semibold">
                <a href="index.php" class="text-slate-300 hover:text-white flex items-center space-x-1.5"><i class="fa-solid fa-chart-line"></i><span>Dashboard</span></a>
                <a href="produtos.php" class="text-slate-300 hover:text-white flex items-center space-x-1.5"><i class="fa-solid fa-boxes-stacked"></i><span>Gerenciar Produtos</span></a>
                <a href="pedidos.php" class="text-emerald-400 flex items-center space-x-1.5"><i class="fa-solid fa-file-invoice-dollar"></i><span>Pedidos</span></a>
            </nav>

            <div class="flex items-center space-x-4 text-xs">
                <a href="../index.php" target="_blank" class="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 transition">
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>Ver Loja</span>
                </a>
                <a href="logout.php" class="text-red-400 hover:text-red-300 font-bold"><i class="fa-solid fa-power-off"></i></a>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        
        <?php if (!empty($mensagem)): ?>
            <div class="p-4 rounded-xl border text-xs font-bold bg-emerald-50 border-emerald-300 text-emerald-800">
                <?php echo htmlspecialchars($mensagem); ?>
            </div>
        <?php endif; ?>

        <?php if ($pedidoDetalhe): ?>
            <!-- Detalhe do Pedido Selecionado -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                    <div>
                        <div class="flex items-center space-x-2">
                            <a href="pedidos.php" class="text-xs font-bold text-blue-900 hover:underline">&larr; Voltar à Lista</a>
                            <span class="text-slate-300">|</span>
                            <span class="text-xs font-mono font-bold text-slate-500"><?php echo date('d/m/Y H:i', strtotime($pedidoDetalhe['created_at'])); ?></span>
                        </div>
                        <h2 class="text-2xl font-black text-blue-950 mt-1">
                            Pedido <?php echo htmlspecialchars($pedidoDetalhe['codigo_pedido']); ?>
                        </h2>
                    </div>

                    <!-- Formulário de Atualização de Status -->
                    <form method="POST" action="" class="flex flex-wrap items-center gap-2 text-xs">
                        <input type="hidden" name="atualizar_status" value="1">
                        <input type="hidden" name="pedido_id" value="<?php echo $pedidoDetalhe['id']; ?>">

                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase">Status Pedido</label>
                            <select name="status_pedido" class="px-3 py-1.5 border rounded-lg bg-slate-50 font-bold">
                                <?php 
                                $statusList = ['Em Processamento', 'Separando Estoque', 'Enviado / Em Transporte', 'Concluído', 'Cancelado'];
                                foreach ($statusList as $st): ?>
                                    <option value="<?php echo $st; ?>" <?php echo $pedidoDetalhe['status_pedido'] === $st ? 'selected' : ''; ?>><?php echo $st; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-slate-500 uppercase">Status Pagamento</label>
                            <select name="status_pagamento" class="px-3 py-1.5 border rounded-lg bg-slate-50 font-bold">
                                <?php 
                                $pagList = ['Aguardando Pagamento', 'Aprovado', 'Recusado', 'Estornado'];
                                foreach ($pagList as $pg): ?>
                                    <option value="<?php echo $pg; ?>" <?php echo $pedidoDetalhe['status_pagamento'] === $pg ? 'selected' : ''; ?>><?php echo $pg; ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div class="pt-3">
                            <button type="submit" class="bg-blue-950 hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-lg transition shadow">
                                Atualizar Status
                            </button>
                        </div>
                    </form>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                    <div class="bg-slate-50 p-5 rounded-2xl border space-y-2">
                        <h3 class="font-bold text-blue-950 text-sm mb-3">Dados do Cliente / Entidade</h3>
                        <p><strong>Tipo:</strong> <?php echo htmlspecialchars($pedidoDetalhe['tipo_cliente']); ?></p>
                        <p><strong>Nome / Razão Social:</strong> <?php echo htmlspecialchars($pedidoDetalhe['nome_cliente']); ?></p>
                        <p><strong>Documento:</strong> <?php echo htmlspecialchars($pedidoDetalhe['documento']); ?></p>
                        <p><strong>E-mail:</strong> <?php echo htmlspecialchars($pedidoDetalhe['email']); ?></p>
                        <p class="flex items-center space-x-2">
                            <strong>Telefone:</strong> 
                            <span><?php echo htmlspecialchars($pedidoDetalhe['telefone']); ?></span>
                            <?php 
                            $telClean = preg_replace('/\D/', '', $pedidoDetalhe['telefone']);
                            ?>
                            <a href="https://wa.me/55<?php echo $telClean; ?>" target="_blank" class="text-emerald-700 font-bold hover:underline">
                                <i class="fa-brands fa-whatsapp"></i> Chamar no WhatsApp
                            </a>
                        </p>
                        <?php if (!empty($pedidoDetalhe['observacoes'])): ?>
                            <p class="pt-2 border-t"><strong>Observações:</strong> <?php echo htmlspecialchars($pedidoDetalhe['observacoes']); ?></p>
                        <?php endif; ?>
                    </div>

                    <div class="bg-slate-50 p-5 rounded-2xl border space-y-2">
                        <h3 class="font-bold text-blue-950 text-sm mb-3">Endereço de Entrega & Logística</h3>
                        <p><strong>Endereço:</strong> <?php echo htmlspecialchars($pedidoDetalhe['endereco'] . ', ' . $pedidoDetalhe['numero']); ?> <?php echo htmlspecialchars($pedidoDetalhe['complemento'] ?? ''); ?></p>
                        <p><strong>Bairro:</strong> <?php echo htmlspecialchars($pedidoDetalhe['bairro']); ?></p>
                        <p><strong>Cidade/UF:</strong> <?php echo htmlspecialchars($pedidoDetalhe['cidade'] . ' - ' . $pedidoDetalhe['estado']); ?></p>
                        <p><strong>CEP:</strong> <?php echo htmlspecialchars($pedidoDetalhe['cep']); ?></p>
                        <p><strong>Tipo de Envio:</strong> <?php echo htmlspecialchars($pedidoDetalhe['frete_tipo']); ?> (R$ <?php echo number_format($pedidoDetalhe['frete_valor'], 2, ',', '.'); ?>)</p>
                        <p><strong>Forma de Pagamento:</strong> <span class="font-bold text-blue-900"><?php echo htmlspecialchars($pedidoDetalhe['metodo_pagamento']); ?></span></p>
                    </div>
                </div>

                <!-- Itens Comprados -->
                <div class="border border-slate-200 rounded-2xl overflow-hidden">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                            <tr>
                                <th class="py-3 px-4">Produto</th>
                                <th class="py-3 px-4">Preço Unitário</th>
                                <th class="py-3 px-4">Quantidade</th>
                                <th class="py-3 px-4 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($itensDetalhe as $it): ?>
                                <tr>
                                    <td class="py-3 px-4 font-bold text-slate-800"><?php echo htmlspecialchars($it['nome_produto']); ?></td>
                                    <td class="py-3 px-4">R$ <?php echo number_format($it['preco_unitario'], 2, ',', '.'); ?></td>
                                    <td class="py-3 px-4 font-bold"><?php echo $it['quantidade']; ?></td>
                                    <td class="py-3 px-4 font-bold text-right text-slate-900">R$ <?php echo number_format($it['subtotal'], 2, ',', '.'); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                        <tfoot class="bg-slate-50 border-t border-slate-200 font-bold text-xs text-slate-800">
                            <tr>
                                <td colspan="3" class="py-2.5 px-4 text-right">Subtotal:</td>
                                <td class="py-2.5 px-4 text-right">R$ <?php echo number_format($pedidoDetalhe['subtotal'], 2, ',', '.'); ?></td>
                            </tr>
                            <tr>
                                <td colspan="3" class="py-2.5 px-4 text-right">Frete:</td>
                                <td class="py-2.5 px-4 text-right">R$ <?php echo number_format($pedidoDetalhe['frete_valor'], 2, ',', '.'); ?></td>
                            </tr>
                            <?php if ($pedidoDetalhe['desconto'] > 0): ?>
                                <tr class="text-emerald-700">
                                    <td colspan="3" class="py-2.5 px-4 text-right">Desconto Pix (10%):</td>
                                    <td class="py-2.5 px-4 text-right">- R$ <?php echo number_format($pedidoDetalhe['desconto'], 2, ',', '.'); ?></td>
                                </tr>
                            <?php endif; ?>
                            <tr class="text-sm font-black text-blue-950 bg-slate-100">
                                <td colspan="3" class="py-3 px-4 text-right">TOTAL DO PEDIDO:</td>
                                <td class="py-3 px-4 text-right text-emerald-600">R$ <?php echo number_format($pedidoDetalhe['total'], 2, ',', '.'); ?></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        <?php else: ?>
            <!-- Lista Geral de Pedidos -->
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-black text-blue-950">Gestão de Pedidos</h1>
                <div class="flex space-x-2 text-xs">
                    <a href="pedidos.php" class="px-3 py-1.5 rounded-lg font-bold <?php echo empty($filtroStatus) ? 'bg-blue-950 text-white' : 'bg-white border text-slate-600'; ?>">Todos</a>
                    <a href="pedidos.php?status=Em+Processamento" class="px-3 py-1.5 rounded-lg font-bold <?php echo $filtroStatus === 'Em Processamento' ? 'bg-blue-950 text-white' : 'bg-white border text-slate-600'; ?>">Em Processamento</a>
                    <a href="pedidos.php?status=Concluído" class="px-3 py-1.5 rounded-lg font-bold <?php echo $filtroStatus === 'Concluído' ? 'bg-blue-950 text-white' : 'bg-white border text-slate-600'; ?>">Concluídos</a>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                            <tr>
                                <th class="py-3 px-4">Código</th>
                                <th class="py-3 px-4">Cliente / Entidade</th>
                                <th class="py-3 px-4">Data</th>
                                <th class="py-3 px-4">Pagamento</th>
                                <th class="py-3 px-4">Total</th>
                                <th class="py-3 px-4">Status Pedido</th>
                                <th class="py-3 px-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php if (empty($pedidos)): ?>
                                <tr>
                                    <td colspan="7" class="py-8 text-center text-slate-400">Nenhum pedido encontrado.</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($pedidos as $p): ?>
                                    <tr class="hover:bg-slate-50 transition">
                                        <td class="py-3 px-4 font-mono font-bold text-blue-950"><?php echo htmlspecialchars($p['codigo_pedido']); ?></td>
                                        <td class="py-3 px-4">
                                            <strong class="font-bold text-slate-800 block"><?php echo htmlspecialchars($p['nome_cliente']); ?></strong>
                                            <span class="text-slate-400 text-[11px]"><?php echo htmlspecialchars($p['cidade'] . ' - ' . $p['estado']); ?></span>
                                        </td>
                                        <td class="py-3 px-4 text-slate-500"><?php echo date('d/m/Y H:i', strtotime($p['created_at'])); ?></td>
                                        <td class="py-3 px-4">
                                            <span class="font-bold text-[11px] <?php echo $p['metodo_pagamento'] === 'PIX' ? 'text-emerald-700' : 'text-slate-700'; ?>">
                                                <?php echo htmlspecialchars($p['metodo_pagamento']); ?>
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 font-black text-slate-900">R$ <?php echo number_format($p['total'], 2, ',', '.'); ?></td>
                                        <td class="py-3 px-4">
                                            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold 
                                                <?php 
                                                if ($p['status_pedido'] === 'Concluído') {
                                                    echo 'bg-emerald-100 text-emerald-800';
                                                } elseif ($p['status_pedido'] === 'Cancelado') {
                                                    echo 'bg-red-100 text-red-800';
                                                } else {
                                                    echo 'bg-blue-100 text-blue-800';
                                                }
                                                ?>">
                                                <?php echo htmlspecialchars($p['status_pedido']); ?>
                                            </span>
                                        </td>
                                        <td class="py-3 px-4 text-right">
                                            <a href="pedidos.php?id=<?php echo $p['id']; ?>" class="bg-blue-950 hover:bg-blue-900 text-white font-bold px-3 py-1.5 rounded-lg transition text-xs">
                                                Visualizar
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>

    </main>

    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        &copy; <?php echo date('Y'); ?> Norte Médica - Gestão de Pedidos e Vendas.
    </footer>

</body>
</html>
