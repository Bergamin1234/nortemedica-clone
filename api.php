<?php
/**
 * API Interna para Carrinho, Busca, Frete e Pedidos
 * Norte Médica - E-Commerce
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

// Inicializa carrinho na sessão se não existir
if (!isset($_SESSION['carrinho'])) {
    $_SESSION['carrinho'] = [];
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    $pdo = getDbConnection();

    switch ($action) {
        
        // -------------------------------------------------------------
        // BUSCA RÁPIDA DE PRODUTOS (AUTOCOMPLETE)
        // -------------------------------------------------------------
        case 'search':
            $q = trim($_GET['q'] ?? '');
            if (strlen($q) < 2) {
                echo json_encode([]);
                exit;
            }

            $stmt = $pdo->prepare("
                SELECT p.id, p.nome, p.slug, p.preco_por, p.preco_de, p.imagem_url, m.nome as marca_nome 
                FROM produtos p 
                LEFT JOIN marcas m ON p.marca_id = m.id 
                WHERE p.ativo = 1 AND (p.nome LIKE ? OR p.sku LIKE ? OR m.nome LIKE ?)
                LIMIT 8
            ");
            $searchTerm = "%{$q}%";
            $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
            $results = $stmt->fetchAll();

            echo json_encode($results);
            exit;

        // -------------------------------------------------------------
        // OBTER DADOS DO CARRINHO
        // -------------------------------------------------------------
        case 'get_cart':
            $itens = [];
            $subtotal = 0;
            $qtd_total = 0;

            if (!empty($_SESSION['carrinho'])) {
                $ids = array_keys($_SESSION['carrinho']);
                $in = implode(',', array_fill(0, count($ids), '?'));
                
                $stmt = $pdo->prepare("
                    SELECT p.id, p.nome, p.slug, p.preco_por, p.preco_de, p.imagem_url, p.estoque, m.nome as marca_nome
                    FROM produtos p
                    LEFT JOIN marcas m ON p.marca_id = m.id
                    WHERE p.id IN ($in)
                ");
                $stmt->execute($ids);
                $dbProducts = $stmt->fetchAll();

                foreach ($dbProducts as $prod) {
                    $qtd = $_SESSION['carrinho'][$prod['id']];
                    $itemTotal = $prod['preco_por'] * $qtd;
                    $subtotal += $itemTotal;
                    $qtd_total += $qtd;

                    $itens[] = [
                        'id' => $prod['id'],
                        'nome' => $prod['nome'],
                        'slug' => $prod['slug'],
                        'marca' => $prod['marca_nome'],
                        'preco' => (float)$prod['preco_por'],
                        'preco_formatado' => number_format($prod['preco_por'], 2, ',', '.'),
                        'imagem' => $prod['imagem_url'],
                        'quantidade' => $qtd,
                        'subtotal' => $itemTotal,
                        'subtotal_formatado' => number_format($itemTotal, 2, ',', '.')
                    ];
                }
            }

            $desconto_pix = ($subtotal * DESCONTO_PIX_PERCENTUAL) / 100;
            $total_pix = $subtotal - $desconto_pix;

            echo json_encode([
                'success' => true,
                'itens' => $itens,
                'qtd_total' => $qtd_total,
                'subtotal' => $subtotal,
                'subtotal_formatado' => number_format($subtotal, 2, ',', '.'),
                'desconto_pix' => $desconto_pix,
                'total_pix' => $total_pix,
                'total_pix_formatado' => number_format($total_pix, 2, ',', '.')
            ]);
            exit;

        // -------------------------------------------------------------
        // ADICIONAR PRODUTO AO CARRINHO
        // -------------------------------------------------------------
        case 'add_cart':
            $produto_id = (int)($_POST['produto_id'] ?? 0);
            $qtd = max(1, (int)($_POST['quantidade'] ?? 1));

            if ($produto_id <= 0) {
                echo json_encode(['success' => false, 'message' => 'Produto inválido']);
                exit;
            }

            // Verifica se produto existe e está ativo
            $stmt = $pdo->prepare("SELECT id, estoque, nome FROM produtos WHERE id = ? AND ativo = 1");
            $stmt->execute([$produto_id]);
            $produto = $stmt->fetch();

            if (!$produto) {
                echo json_encode(['success' => false, 'message' => 'Produto não encontrado']);
                exit;
            }

            if (isset($_SESSION['carrinho'][$produto_id])) {
                $_SESSION['carrinho'][$produto_id] += $qtd;
            } else {
                $_SESSION['carrinho'][$produto_id] = $qtd;
            }

            echo json_encode([
                'success' => true,
                'message' => 'Produto adicionado ao carrinho com sucesso!',
                'produto_nome' => $produto['nome'],
                'carrinho_count' => array_sum($_SESSION['carrinho'])
            ]);
            exit;

        // -------------------------------------------------------------
        // ATUALIZAR QUANTIDADE
        // -------------------------------------------------------------
        case 'update_cart':
            $produto_id = (int)($_POST['produto_id'] ?? 0);
            $qtd = (int)($_POST['quantidade'] ?? 1);

            if ($produto_id > 0) {
                if ($qtd <= 0) {
                    unset($_SESSION['carrinho'][$produto_id]);
                } else {
                    $_SESSION['carrinho'][$produto_id] = $qtd;
                }
            }

            echo json_encode(['success' => true, 'carrinho_count' => array_sum($_SESSION['carrinho'])]);
            exit;

        // -------------------------------------------------------------
        // REMOVER PRODUTO DO CARRINHO
        // -------------------------------------------------------------
        case 'remove_cart':
            $produto_id = (int)($_POST['produto_id'] ?? 0);
            if (isset($_SESSION['carrinho'][$produto_id])) {
                unset($_SESSION['carrinho'][$produto_id]);
            }

            echo json_encode(['success' => true, 'carrinho_count' => array_sum($_SESSION['carrinho'])]);
            exit;

        // -------------------------------------------------------------
        // CALCULAR FRETE POR CEP
        // -------------------------------------------------------------
        case 'calc_frete':
            $cep = preg_replace('/\D/', '', $_GET['cep'] ?? $_POST['cep'] ?? '');
            $subtotal = (float)($_GET['subtotal'] ?? $_POST['subtotal'] ?? 0);

            if (strlen($cep) !== 8) {
                echo json_encode(['success' => false, 'message' => 'CEP inválido. Digite 8 números.']);
                exit;
            }

            // Simulação de cálculo inteligente e regional (Região Norte x Resto do Brasil)
            $isRondonia = substr($cep, 0, 2) === '76';
            $isFreteGratis = $subtotal >= VALOR_FRETE_GRATIS;

            $opcoes = [
                [
                    'id' => 'pac',
                    'nome' => 'PAC - Encomenda Econômica',
                    'prazo' => $isRondonia ? '2 a 4 dias úteis' : '6 a 10 dias úteis',
                    'valor' => $isFreteGratis ? 0.00 : ($isRondonia ? 35.00 : 75.00),
                    'gratis' => $isFreteGratis
                ],
                [
                    'id' => 'sedex',
                    'nome' => 'SEDEX - Envio Expresso',
                    'prazo' => $isRondonia ? '1 a 2 dias úteis' : '3 a 5 dias úteis',
                    'valor' => $isRondonia ? 55.00 : 120.00,
                    'gratis' => false
                ],
                [
                    'id' => 'transportadora',
                    'nome' => 'Transportadora Especializada em Carga Médica',
                    'prazo' => $isRondonia ? '2 a 3 dias úteis' : '5 a 8 dias úteis',
                    'valor' => $isFreteGratis ? 0.00 : ($isRondonia ? 45.00 : 90.00),
                    'gratis' => $isFreteGratis
                ]
            ];

            foreach ($opcoes as &$op) {
                $op['valor_formatado'] = $op['valor'] == 0 ? 'GRÁTIS' : 'R$ ' . number_format($op['valor'], 2, ',', '.');
            }

            echo json_encode(['success' => true, 'cep' => $cep, 'opcoes' => $opcoes]);
            exit;

        // -------------------------------------------------------------
        // PROCESSAR E FINALIZAR PEDIDO (CHECKOUT)
        // -------------------------------------------------------------
        case 'checkout':
            if (empty($_SESSION['carrinho'])) {
                echo json_encode(['success' => false, 'message' => 'Seu carrinho está vazio']);
                exit;
            }

            // Recebe dados do formulário
            $tipo_cliente = $_POST['tipo_cliente'] ?? 'PF';
            $nome_cliente = trim($_POST['nome_cliente'] ?? '');
            $documento = trim($_POST['documento'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $telefone = trim($_POST['telefone'] ?? '');
            $cep = trim($_POST['cep'] ?? '');
            $endereco = trim($_POST['endereco'] ?? '');
            $numero = trim($_POST['numero'] ?? '');
            $complemento = trim($_POST['complemento'] ?? '');
            $bairro = trim($_POST['bairro'] ?? '');
            $cidade = trim($_POST['cidade'] ?? '');
            $estado = trim($_POST['estado'] ?? '');
            $metodo_pagamento = $_POST['metodo_pagamento'] ?? 'PIX';
            $frete_tipo = $_POST['frete_tipo'] ?? 'PAC';
            $frete_valor = (float)($_POST['frete_valor'] ?? 0);
            $observacoes = trim($_POST['observacoes'] ?? '');

            if (empty($nome_cliente) || empty($documento) || empty($email) || empty($telefone) || empty($endereco)) {
                echo json_encode(['success' => false, 'message' => 'Por favor, preencha todos os campos obrigatórios.']);
                exit;
            }

            // Busca os itens do banco para calcular o subtotal com segurança
            $ids = array_keys($_SESSION['carrinho']);
            $in = implode(',', array_fill(0, count($ids), '?'));
            $stmt = $pdo->prepare("SELECT id, nome, preco_por FROM produtos WHERE id IN ($in)");
            $stmt->execute($ids);
            $produtosDb = $stmt->fetchAll();

            $subtotal = 0;
            $itensGravar = [];

            foreach ($produtosDb as $p) {
                $qtd = $_SESSION['carrinho'][$p['id']];
                $itemSubtotal = $p['preco_por'] * $qtd;
                $subtotal += $itemSubtotal;
                $itensGravar[] = [
                    'produto_id' => $p['id'],
                    'nome' => $p['nome'],
                    'preco_unitario' => $p['preco_por'],
                    'quantidade' => $qtd,
                    'subtotal' => $itemSubtotal
                ];
            }

            // Calcula desconto caso seja PIX
            $desconto = 0;
            if ($metodo_pagamento === 'PIX') {
                $desconto = ($subtotal * DESCONTO_PIX_PERCENTUAL) / 100;
            }

            $total = ($subtotal - $desconto) + $frete_valor;
            $codigo_pedido = 'NM-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

            // Dados de pagamento específicos
            $dados_pagamento = [];
            if ($metodo_pagamento === 'PIX') {
                $dados_pagamento['chave_pix'] = SITE_CHAVE_PIX;
                $dados_pagamento['beneficiario'] = SITE_NOME;
                $dados_pagamento['cidade'] = 'PORTO VELHO';
                $dados_pagamento['txid'] = preg_replace('/[^A-Za-z0-9]/', '', $codigo_pedido);
                // Simulação da linha Pix Copia e Cola padrão BACEN EMV
                $dados_pagamento['copia_e_cola'] = "00020126580014BR.GOV.BCB.PIX0114" . SITE_CHAVE_PIX . "52040000530398654" . sprintf("%0.2f", $total) . "5802BR5925NORTEMEDICA COM E REP LTDA6011PORTO VELHO62070503***6304" . strtoupper(substr(md5($codigo_pedido), 0, 4));
            } elseif ($metodo_pagamento === 'CARTAO') {
                $parcelas = max(1, min(MAX_PARCELAS_CARTAO, (int)($_POST['cartao_parcelas'] ?? 1)));
                $dados_pagamento['parcelas'] = $parcelas;
                $dados_pagamento['valor_parcela'] = $total / $parcelas;
                $dados_pagamento['ultimos_digitos'] = substr(preg_replace('/\D/', '', $_POST['cartao_numero'] ?? '0000'), -4);
                $dados_pagamento['bandeira'] = $_POST['cartao_bandeira'] ?? 'Mastercard';
            } elseif ($metodo_pagamento === 'BOLETO') {
                $dados_pagamento['vencimento'] = date('d/m/Y', strtotime('+3 weekdays'));
                $dados_pagamento['linha_digitavel'] = "34191.79001 01043.510047 91020.150008 7 " . date('Ymd') . sprintf("%010d", round($total * 100));
            }

            // Inserir pedido no banco
            $stmt = $pdo->prepare("
                INSERT INTO pedidos 
                (codigo_pedido, tipo_cliente, nome_cliente, documento, email, telefone, cep, endereco, numero, complemento, bairro, cidade, estado, subtotal, frete_tipo, frete_valor, desconto, total, metodo_pagamento, status_pagamento, status_pedido, dados_pagamento, observacoes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $codigo_pedido,
                $tipo_cliente,
                $nome_cliente,
                $documento,
                $email,
                $telefone,
                $cep,
                $endereco,
                $numero,
                $complemento,
                $bairro,
                $cidade,
                $estado,
                $subtotal,
                $frete_tipo,
                $frete_valor,
                $desconto,
                $total,
                $metodo_pagamento,
                $metodo_pagamento === 'CARTAO' ? 'Aprovado' : 'Aguardando Pagamento',
                'Em Processamento',
                json_encode($dados_pagamento, JSON_UNESCAPED_UNICODE),
                $observacoes
            ]);

            $pedido_id = $pdo->lastInsertId();

            // Inserir itens do pedido
            $stmtItem = $pdo->prepare("
                INSERT INTO itens_pedido (pedido_id, produto_id, nome_produto, preco_unitario, quantidade, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            foreach ($itensGravar as $item) {
                $stmtItem->execute([
                    $pedido_id,
                    $item['produto_id'],
                    $item['nome'],
                    $item['preco_unitario'],
                    $item['quantidade'],
                    $item['subtotal']
                ]);
            }

            // Limpa o carrinho
            $_SESSION['carrinho'] = [];

            echo json_encode([
                'success' => true,
                'codigo_pedido' => $codigo_pedido,
                'redirect_url' => 'pedido-sucesso.php?codigo=' . $codigo_pedido
            ]);
            exit;

        default:
            echo json_encode(['error' => 'Ação não reconhecida']);
            exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno no servidor: ' . $e->getMessage()]);
    exit;
}
