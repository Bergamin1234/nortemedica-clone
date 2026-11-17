<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

if (!isset($_SESSION['admin_usuario'])) {
    header("Location: login.php");
    exit;
}

$pdo = getDbConnection();
$mensagem = '';
$tipoMensagem = '';

// Ação de Exclusão
if (isset($_GET['excluir'])) {
    $idExcluir = (int)$_GET['excluir'];
    $stmt = $pdo->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->execute([$idExcluir]);
    header("Location: produtos.php?msg=excluido");
    exit;
}

// Salvar Produto (Novo ou Edição)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['salvar_produto'])) {
    $id = (int)($_POST['id'] ?? 0);
    $nome = trim($_POST['nome'] ?? '');
    $categoria_id = (int)$_POST['categoria_id'];
    $marca_id = (int)$_POST['marca_id'];
    $sku = trim($_POST['sku'] ?? '');
    $preco_de = (float)str_replace(['.', ','], ['', '.'], $_POST['preco_de'] ?? '0');
    $preco_por = (float)str_replace(['.', ','], ['', '.'], $_POST['preco_por'] ?? '0');
    $estoque = (int)($_POST['estoque'] ?? 10);
    $imagem_url = trim($_POST['imagem_url'] ?? '');
    $desc_curta = trim($_POST['descricao_curta'] ?? '');
    $desc_longa = trim($_POST['descricao_longa'] ?? '');
    $especificacoes = trim($_POST['especificacoes'] ?? '');
    $destaque = isset($_POST['destaque']) ? 1 : 0;
    $lancamento = isset($_POST['lancamento']) ? 1 : 0;
    $ativo = isset($_POST['ativo']) ? 1 : 0;

    // Gera slug
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $nome), '-'));

    if (empty($nome) || $preco_por <= 0) {
        $mensagem = "Preencha o Nome e o Preço de Venda do produto.";
        $tipoMensagem = 'error';
    } else {
        if ($id > 0) {
            // Update
            $stmt = $pdo->prepare("
                UPDATE produtos SET 
                    categoria_id = ?, marca_id = ?, nome = ?, slug = ?, sku = ?, 
                    preco_de = ?, preco_por = ?, estoque = ?, imagem_url = ?, 
                    descricao_curta = ?, descricao_longa = ?, especificacoes = ?, 
                    destaque = ?, lancamento = ?, ativo = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $categoria_id, $marca_id, $nome, $slug, $sku, 
                $preco_de, $preco_por, $estoque, $imagem_url, 
                $desc_curta, $desc_longa, $especificacoes, 
                $destaque, $lancamento, $ativo, $id
            ]);
            $mensagem = "Produto atualizado com sucesso!";
        } else {
            // Insert
            $stmt = $pdo->prepare("
                INSERT INTO produtos 
                (categoria_id, marca_id, nome, slug, sku, preco_de, preco_por, estoque, imagem_url, descricao_curta, descricao_longa, especificacoes, destaque, lancamento, ativo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $categoria_id, $marca_id, $nome, $slug, $sku, 
                $preco_de, $preco_por, $estoque, $imagem_url, 
                $desc_curta, $desc_longa, $especificacoes, 
                $destaque, $lancamento, $ativo
            ]);
            $mensagem = "Produto cadastrado com sucesso!";
        }
        $tipoMensagem = 'success';
    }
}

// Carregar produto para edição se solicitado
$produtoEdit = null;
if (isset($_GET['editar'])) {
    $idEdit = (int)$_GET['editar'];
    $stmt = $pdo->prepare("SELECT * FROM produtos WHERE id = ?");
    $stmt->execute([$idEdit]);
    $produtoEdit = $stmt->fetch();
}

$modoEdicao = $produtoEdit !== null || isset($_GET['novo']);

// Listagem de produtos
$stmtProd = $pdo->query("
    SELECT p.*, c.nome as categoria_nome, m.nome as marca_nome 
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN marcas m ON p.marca_id = m.id
    ORDER BY p.id DESC
");
$produtos = $stmtProd->fetchAll();

// Listas para selects
$categorias = $pdo->query("SELECT * FROM categorias ORDER BY nome ASC")->fetchAll();
$marcas = $pdo->query("SELECT * FROM marcas ORDER BY nome ASC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciador de Produtos - Norte Médica</title>
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
                <a href="produtos.php" class="text-emerald-400 flex items-center space-x-1.5"><i class="fa-solid fa-boxes-stacked"></i><span>Gerenciar Produtos</span></a>
                <a href="pedidos.php" class="text-slate-300 hover:text-white flex items-center space-x-1.5"><i class="fa-solid fa-file-invoice-dollar"></i><span>Pedidos</span></a>
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
            <div class="p-4 rounded-xl border text-xs font-bold <?php echo $tipoMensagem === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'; ?>">
                <?php echo htmlspecialchars($mensagem); ?>
            </div>
        <?php endif; ?>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-2xl font-black text-blue-950">Catálogo de Produtos Hospitalares</h1>
                <p class="text-xs text-slate-500">Cadastre, edite preços, estoque e especificações dos equipamentos</p>
            </div>
            <div>
                <?php if ($modoEdicao): ?>
                    <a href="produtos.php" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Voltar para Lista</span>
                    </a>
                <?php else: ?>
                    <a href="produtos.php?novo=1" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center space-x-2">
                        <i class="fa-solid fa-plus"></i>
                        <span>Cadastrar Novo Produto</span>
                    </a>
                <?php endif; ?>
            </div>
        </div>

        <?php if ($modoEdicao): ?>
            <!-- Formulário de Criação / Edição -->
            <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <h2 class="text-lg font-black text-blue-950 mb-6 pb-3 border-b">
                    <?php echo $produtoEdit ? 'Editar Produto: ' . htmlspecialchars($produtoEdit['nome']) : 'Cadastrar Novo Equipamento'; ?>
                </h2>

                <form method="POST" action="produtos.php" class="space-y-6 text-xs">
                    <input type="hidden" name="salvar_produto" value="1">
                    <input type="hidden" name="id" value="<?php echo $produtoEdit['id'] ?? 0; ?>">

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="md:col-span-2">
                            <label class="block font-bold text-slate-700 mb-1">Nome do Produto *</label>
                            <input type="text" name="nome" value="<?php echo htmlspecialchars($produtoEdit['nome'] ?? ''); ?>" required placeholder="Ex: Autoclave Hospitalar Horizontal 21L" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-medium">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Código / SKU *</label>
                            <input type="text" name="sku" value="<?php echo htmlspecialchars($produtoEdit['sku'] ?? ''); ?>" required placeholder="NM-AUT-001" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Categoria *</label>
                            <select name="categoria_id" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                                <?php foreach ($categorias as $c): ?>
                                    <option value="<?php echo $c['id']; ?>" <?php echo ($produtoEdit && $produtoEdit['categoria_id'] == $c['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($c['nome']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Marca / Fabricante *</label>
                            <select name="marca_id" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                                <?php foreach ($marcas as $m): ?>
                                    <option value="<?php echo $m['id']; ?>" <?php echo ($produtoEdit && $produtoEdit['marca_id'] == $m['id']) ? 'selected' : ''; ?>>
                                        <?php echo htmlspecialchars($m['nome']); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Estoque Disponível *</label>
                            <input type="number" name="estoque" value="<?php echo $produtoEdit['estoque'] ?? 10; ?>" min="0" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Preço Original ("De R$")</label>
                            <input type="text" name="preco_de" value="<?php echo isset($produtoEdit['preco_de']) ? number_format($produtoEdit['preco_de'], 2, ',', '.') : '0,00'; ?>" placeholder="0,00" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Preço de Venda ("Por R$") *</label>
                            <input type="text" name="preco_por" value="<?php echo isset($produtoEdit['preco_por']) ? number_format($produtoEdit['preco_por'], 2, ',', '.') : '0,00'; ?>" required placeholder="0,00" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono font-bold">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">URL da Imagem *</label>
                            <input type="url" name="imagem_url" value="<?php echo htmlspecialchars($produtoEdit['imagem_url'] ?? ''); ?>" placeholder="https://..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div class="md:col-span-3">
                            <label class="block font-bold text-slate-700 mb-1">Descrição Curta (para a vitrine)</label>
                            <input type="text" name="descricao_curta" value="<?php echo htmlspecialchars($produtoEdit['descricao_curta'] ?? ''); ?>" placeholder="Resumo de 1 frase" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div class="md:col-span-3">
                            <label class="block font-bold text-slate-700 mb-1">Descrição Detalhada do Produto</label>
                            <textarea name="descricao_longa" rows="4" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"><?php echo htmlspecialchars($produtoEdit['descricao_longa'] ?? ''); ?></textarea>
                        </div>

                        <div class="md:col-span-3">
                            <label class="block font-bold text-slate-700 mb-1">Especificações Técnicas (1 por linha: Parâmetro: Valor)</label>
                            <textarea name="especificacoes" rows="4" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-mono"><?php echo htmlspecialchars($produtoEdit['especificacoes'] ?? ''); ?></textarea>
                        </div>

                        <div class="md:col-span-3 flex flex-wrap gap-6 pt-2">
                            <label class="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
                                <input type="checkbox" name="destaque" value="1" <?php echo ($produtoEdit && $produtoEdit['destaque']) ? 'checked' : ''; ?> class="rounded text-blue-900 focus:ring-blue-900">
                                <span>Destacar na Página Inicial</span>
                            </label>

                            <label class="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
                                <input type="checkbox" name="lancamento" value="1" <?php echo ($produtoEdit && $produtoEdit['lancamento']) ? 'checked' : ''; ?> class="rounded text-blue-900 focus:ring-blue-900">
                                <span>Tag de Lançamento</span>
                            </label>

                            <label class="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
                                <input type="checkbox" name="ativo" value="1" <?php echo (!$produtoEdit || $produtoEdit['ativo']) ? 'checked' : ''; ?> class="rounded text-blue-900 focus:ring-blue-900">
                                <span>Produto Ativo (Visível na Loja)</span>
                            </label>
                        </div>
                    </div>

                    <div class="pt-4 border-t flex justify-end space-x-3">
                        <a href="produtos.php" class="bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl">Cancelar</a>
                        <button type="submit" class="bg-blue-950 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl shadow">
                            Salvar Produto
                        </button>
                    </div>
                </form>
            </div>
        <?php else: ?>
            <!-- Tabela de Produtos Cadastrados -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                            <tr>
                                <th class="py-3 px-4">Foto</th>
                                <th class="py-3 px-4">Nome / SKU</th>
                                <th class="py-3 px-4">Categoria / Marca</th>
                                <th class="py-3 px-4">Preço De / Por</th>
                                <th class="py-3 px-4">Estoque</th>
                                <th class="py-3 px-4">Status</th>
                                <th class="py-3 px-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <?php foreach ($produtos as $p): ?>
                                <tr class="hover:bg-slate-50 transition">
                                    <td class="py-3 px-4">
                                        <img src="<?php echo htmlspecialchars($p['imagem_url']); ?>" alt="" class="w-12 h-12 object-contain rounded-lg border bg-slate-50 p-1">
                                    </td>
                                    <td class="py-3 px-4">
                                        <strong class="font-bold text-slate-800 text-sm block"><?php echo htmlspecialchars($p['nome']); ?></strong>
                                        <span class="text-slate-400 font-mono text-[11px]"><?php echo htmlspecialchars($p['sku']); ?></span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="block text-slate-700 font-semibold"><?php echo htmlspecialchars($p['categoria_nome']); ?></span>
                                        <span class="text-[10px] uppercase font-bold text-blue-900"><?php echo htmlspecialchars($p['marca_nome']); ?></span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <?php if ($p['preco_de'] > $p['preco_por']): ?>
                                            <span class="line-through text-slate-400 text-[11px] block">R$ <?php echo number_format($p['preco_de'], 2, ',', '.'); ?></span>
                                        <?php endif; ?>
                                        <strong class="font-black text-emerald-600 text-sm">R$ <?php echo number_format($p['preco_por'], 2, ',', '.'); ?></strong>
                                    </td>
                                    <td class="py-3 px-4 font-bold <?php echo $p['estoque'] > 0 ? 'text-slate-700' : 'text-red-500'; ?>">
                                        <?php echo $p['estoque']; ?> un
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold <?php echo $p['ativo'] ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'; ?>">
                                            <?php echo $p['ativo'] ? 'Ativo' : 'Inativo'; ?>
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-right space-x-2">
                                        <a href="produtos.php?editar=<?php echo $p['id']; ?>" class="bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold px-2.5 py-1 rounded-lg text-xs transition">
                                            Editar
                                        </a>
                                        <a href="produtos.php?excluir=<?php echo $p['id']; ?>" onclick="return confirm('Deseja realmente excluir este produto?')" class="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-2.5 py-1 rounded-lg text-xs transition">
                                            Excluir
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>

    </main>

    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        &copy; <?php echo date('Y'); ?> Norte Médica - Gerenciamento de Produtos.
    </footer>

</body>
</html>
