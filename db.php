<?php
/**
 * Conexão com o Banco de Dados com Suporte a MySQL e Fallback SQLite
 * Otimizado para Hospedagem HostGator (Alligator) / cPanel
 */

require_once __DIR__ . '/config.php';

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $driver = DB_DRIVER;
    $connected = false;

    // Tentar MySQL se configurado
    if ($driver === 'mysql' || $driver === 'auto') {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 3
            ]);
            $connected = true;
        } catch (PDOException $e) {
            if ($driver === 'mysql') {
                die("Erro de conexão MySQL: " . $e->getMessage() . "<br><a href='install.php'>Clique aqui para rodar o Instalador</a>");
            }
            // Em modo 'auto', cai silenciosamente para SQLite
            $connected = false;
        }
    }

    // Fallback para SQLite (Ideal para testar instantaneamente ou antes de configurar o MySQL no cPanel)
    if (!$connected) {
        $sqliteDir = dirname(DB_SQLITE_PATH);
        if (!is_dir($sqliteDir)) {
            @mkdir($sqliteDir, 0777, true);
        }
        
        $pdo = new PDO("sqlite:" . DB_SQLITE_PATH, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        
        // Verifica se a tabela de produtos existe, caso contrário cria
        $check = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='produtos'")->fetch();
        if (!$check) {
            initSqliteSchema($pdo);
        }
    }

    return $pdo;
}

function initSqliteSchema($pdo) {
    // Criação das tabelas
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            icone TEXT,
            descricao TEXT,
            ordem INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS marcas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria_id INTEGER,
            marca_id INTEGER,
            nome TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            sku TEXT,
            descricao_curta TEXT,
            descricao_longa TEXT,
            especificacoes TEXT,
            preco_de REAL DEFAULT 0,
            preco_por REAL NOT NULL,
            estoque INTEGER DEFAULT 10,
            imagem_url TEXT,
            destaque INTEGER DEFAULT 0,
            lancamento INTEGER DEFAULT 0,
            ativo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_pedido TEXT UNIQUE NOT NULL,
            tipo_cliente TEXT DEFAULT 'PF',
            nome_cliente TEXT NOT NULL,
            documento TEXT NOT NULL,
            email TEXT NOT NULL,
            telefone TEXT NOT NULL,
            cep TEXT NOT NULL,
            endereco TEXT NOT NULL,
            numero TEXT NOT NULL,
            complemento TEXT,
            bairro TEXT NOT NULL,
            cidade TEXT NOT NULL,
            estado TEXT NOT NULL,
            subtotal REAL NOT NULL,
            frete_tipo TEXT NOT NULL,
            frete_valor REAL NOT NULL,
            desconto REAL DEFAULT 0,
            total REAL NOT NULL,
            metodo_pagamento TEXT NOT NULL,
            status_pagamento TEXT DEFAULT 'Aguardando Pagamento',
            status_pedido TEXT DEFAULT 'Em Processamento',
            dados_pagamento TEXT,
            observacoes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS itens_pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            nome_produto TEXT NOT NULL,
            preco_unitario REAL NOT NULL,
            quantidade INTEGER NOT NULL,
            subtotal REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS usuarios_admin (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Inserir Admin inicial (admin / admin123)
    $stmt = $pdo->prepare("INSERT INTO usuarios_admin (usuario, senha_hash, nome, email) VALUES (?, ?, ?, ?)");
    $stmt->execute(['admin', '$2y$10$wN317W8l9wD9rN6d2H5l0OD5B.k2mJmI6FkEeg3C738f6bXo0Fm12', 'Administrador Norte Médica', 'admin@nortemedica.com.br']);
}
