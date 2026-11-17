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
        $isNewDb = !file_exists(DB_SQLITE_PATH);
        
        $pdo = new PDO("sqlite:" . DB_SQLITE_PATH, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        
        if ($isNewDb) {
            initSqliteSchema($pdo);
        }
    }

    return $pdo;
}

function initSqliteSchema($pdo) {
    // Criação das tabelas no SQLite
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

    seedInitialData($pdo);
}

function seedInitialData($pdo) {
    // Inserir Admin inicial (admin / admin123)
    $stmt = $pdo->prepare("INSERT INTO usuarios_admin (usuario, senha_hash, nome, email) VALUES (?, ?, ?, ?)");
    $stmt->execute(['admin', password_hash('admin123', PASSWORD_DEFAULT), 'Administrador Norte Médica', 'admin@nortemedica.com.br']);

    // Inserir Categorias
    $categorias = [
        [1, 'Equipamentos Hospitalares & UTI', 'equipamentos-hospitalares', 'fa-heart-pulse', 'Monitores, ventiladores, desfibriladores e mesas cirúrgicas'],
        [2, 'Esterilização & Autoclaves', 'esterilizacao-autoclaves', 'fa-shield-virus', 'Autoclaves hospitalares horizontais, seladoras e peças de reposição'],
        [3, 'Cirúrgico & Eletrocirurgia', 'cirurgico-eletrocirurgia', 'fa-scalpel', 'Bisturis eletrônicos, pinças e instrumentais cirúrgicos'],
        [4, 'Oxigenoterapia & Oximetria', 'oxigenoterapia-oximetria', 'fa-lungs', 'Sensores de SpO2, umidificadores e reguladores de pressão'],
        [5, 'Resgate & Reabilitação', 'resgate-reabilitacao', 'fa-kit-medical', 'Pranchas de imobilização, esteiras ergométricas e cicloergômetros'],
        [6, 'Descartáveis & Consumo', 'descartaveis-consumo', 'fa-box-tissue', 'Compressas estéreis, eletrodos, luvas e descartáveis hospitalares'],
        [7, 'Laboratório & Diagnóstico', 'laboratorio-diagnostico', 'fa-microscope', 'Microscópios, centrífugas e analisadores bioquímicos']
    ];

    $stmt = $pdo->prepare("INSERT INTO categorias (id, nome, slug, icone, descricao, ordem) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($categorias as $c) {
        $stmt->execute([$c[0], $c[1], $c[2], $c[3], $c[4], $c[0]]);
    }

    // Inserir Marcas
    $marcas = [
        [1, 'INSTRAMED', 'instramed'],
        [2, 'SERCON', 'sercon'],
        [3, 'MAGNAMED', 'magnamed'],
        [4, 'PROTEC', 'protec'],
        [5, 'WELMY', 'welmy'],
        [6, 'INBRAMED', 'inbramed'],
        [7, 'SINNOWA', 'sinnowa'],
        [8, 'MEDTRONIC', 'medtronic']
    ];

    $stmt = $pdo->prepare("INSERT INTO marcas (id, nome, slug) VALUES (?, ?, ?)");
    foreach ($marcas as $m) {
        $stmt->execute([$m[0], $m[1], $m[2]]);
    }

    // Inserir Produtos Iniciais ricos e detalhados
    $produtos = [
        [
            'cat_id' => 1,
            'marca_id' => 1,
            'nome' => 'Monitor Multiparâmetrico CardioMax 12.1" com SpO2, PNI e ECG',
            'slug' => 'monitor-multiparametrico-cardiomax-12-polegadas',
            'sku' => 'NM-MON-001',
            'desc_curta' => 'Monitor hospitalar de alta precisão para UTI e centro cirúrgico com tela touchscreen de 12.1".',
            'desc_longa' => 'O Monitor Multiparâmetrico CardioMax é a solução ideal para monitoramento contínuo de pacientes críticos em UTI, Centro Cirúrgico e Pronto-Atendimento. Possui display LCD colorido de alta definição, memória de tendências gráficas e numéricas de 120 horas e bateria recarregável de lítio.',
            'specs' => "Tela: LCD TFT colorida de 12.1 polegadas\nParâmetros: ECG (7 derivações), Respiração, SpO2, PNI, 2 Canais de Temperatura\nAlarmes: Sonoros e visuais configuráveis\nBateria: Autonomia de até 4 horas contínuas\nConectividade: Saída de rede para central de monitoramento",
            'preco_de' => 18900.00,
            'preco_por' => 16500.00,
            'estoque' => 6,
            'img' => 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 1
        ],
        [
            'cat_id' => 1,
            'marca_id' => 1,
            'nome' => 'Cardioversor Desfibrilador Bifásico CardioMax com Marcapasso e DEA',
            'slug' => 'cardioversor-desfibrilador-bifasico-cardiomax-instramed',
            'sku' => 'NM-DES-002',
            'desc_curta' => 'Equipamento completo de ressuscitação com tecnologia de onda bifásica truncada e display colorido.',
            'desc_longa' => 'Desenvolvido para atender emergências com máxima agilidade e segurança. O CardioMax Instramed possui pás adulto e infantil integradas, marcapasso externo não-invasivo e função DEA automática com comandos por voz em português.',
            'specs' => "Tecnologia: Onda Bifásica Exponencial Truncada\nEnergia: Ajustável de 1 a 360 Joules\nTempo de Carga: Menor que 5 segundos a 360J\nModos: Manual, Sincronizado (Cardioversão), DEA e Marcapasso\nCertificação: ANVISA e Inmetro",
            'preco_de' => 29500.00,
            'preco_por' => 25800.00,
            'estoque' => 4,
            'img' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 0
        ],
        [
            'cat_id' => 2,
            'marca_id' => 2,
            'nome' => 'Autoclave Hospitalar Horizontal 21 Litros Inox Digital - SERCON',
            'slug' => 'autoclave-hospitalar-horizontal-21l-sercon',
            'sku' => 'NM-AUT-003',
            'desc_curta' => 'Autoclave digital em aço inoxidável com câmara horizontal para esterilização rápida e segura.',
            'desc_longa' => 'Equipamento líder de mercado com controle eletrônico microprocessado, múltiplos ciclos programáveis (instrumental embalado, desfalecido, líquidos e plásticos) e secagem com porta fechada a vácuo.',
            'specs' => "Capacidade: 21 Litros\nMaterial da Câmara: Aço Inoxidável AISI 316L\nPressão de Trabalho: 1,0 a 2,3 kgf/cm²\nTemperatura: 121°C a 134°C ajustável\nAlimentação: 220V / 60Hz",
            'preco_de' => 12400.00,
            'preco_por' => 10990.00,
            'estoque' => 8,
            'img' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 1
        ],
        [
            'cat_id' => 2,
            'marca_id' => 2,
            'nome' => 'Guarnição Silicone p/ Porta de Autoclave AHMC3 60 Shore - SERCON',
            'slug' => 'guarnicao-silicone-porta-autoclave-ahmc3-sercon',
            'sku' => 'NM-GUA-004',
            'desc_curta' => 'Peça original Sercon para vedação hermética da câmara de esterilização.',
            'desc_longa' => 'Guarnição de perfil especial fabricada em silicone grau médico 60 Shore A de alta resistência térmica e mecânica. Garante vedação absoluta sem ressecamento durante repetidos ciclos de calor e pressão.',
            'specs' => "Material: Silicone Cirúrgico Atóxico\nDureza: 60 Shore A\nCompatibilidade: Autoclaves Sercon série AHMC3 e similares\nResistência Térmica: até 200°C contínuos",
            'preco_de' => 310.00,
            'preco_por' => 250.00,
            'estoque' => 35,
            'img' => 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=800&q=80',
            'destaque' => 0,
            'lancamento' => 0
        ],
        [
            'cat_id' => 1,
            'marca_id' => 3,
            'nome' => 'Ventilador Pulmonar UTI Adulto, Pediátrico e Neonatal OxyMag - MAGNAMED',
            'slug' => 'ventilador-pulmonar-uti-oxymag-magnamed',
            'sku' => 'NM-VEN-005',
            'desc_curta' => 'Ventilador mecânico microprocessado de transporte e emergência/UTI de alta mobilidade.',
            'desc_longa' => 'O OxyMag é um ventilador pulmonar avançado, leve e versátil que atende desde pacientes neonatais com extremo baixo peso até adultos obesos. Ideal para UTIs, pronto-socorros e resgate terrestre/aéreo.',
            'specs' => "Pacientes: Neonatal, Pediátrico e Adulto (peso de 0,5 kg a 150 kg)\nModos Ventilatórios: VCV, PCV, PLV, V-SIMV, P-SIMV, CPAP/PSV, DuoLevel e Não-Invasiva (VNI)\nTela: Touch screen colorida de 5.7\"\nAutonomia da Bateria: Mais de 6,5 horas",
            'preco_de' => 45000.00,
            'preco_por' => 39900.00,
            'estoque' => 3,
            'img' => 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 1
        ],
        [
            'cat_id' => 5,
            'marca_id' => 4,
            'nome' => 'Prancha de Resgate e Transferência de Pacientes Rígida Adulto em Polietileno',
            'slug' => 'prancha-de-resgate-transferencia-polietileno-protec',
            'sku' => 'NM-PRA-006',
            'desc_curta' => 'Prancha de imobilização translúcida a Raio-X com 3 jogos de cintos de engate rápido.',
            'desc_longa' => 'Confeccionada em polietileno de alta densidade (PEAD) com tecnologia de rotomoldagem. 100% impermeável, de fácil higienização, flutuante em água e totalmente radiotransparente.',
            'specs' => "Capacidade de Carga: Suporta até 220 kg\nDimensões: 184 cm x 45 cm x 5 cm\nPeso do Produto: 7,5 kg\nAcessórios inclusos: 3 conjuntos de cintos de fixação reguláveis",
            'preco_de' => 490.00,
            'preco_por' => 380.00,
            'estoque' => 20,
            'img' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 0
        ],
        [
            'cat_id' => 4,
            'marca_id' => 4,
            'nome' => 'Sensor de Oximetria de Pulso Reutilizável SpO2 Clip Adulto Compatível Protec',
            'slug' => 'sensor-oximetria-pulso-spo2-clip-adulto',
            'sku' => 'NM-SPO-007',
            'desc_curta' => 'Cabo blindado de 3 metros com conector padrão e mola de alta durabilidade.',
            'desc_longa' => 'Sensor com fotodetectores de alta sensibilidade para medição instantânea da saturação periférica de oxigênio (SpO2) e frequência cardíaca. Silicone hipoalergênico que reduz o desconforto do paciente.',
            'specs' => "Comprimento: 3,0 metros\nTipo: Clip de dedo articulado Adulto\nCompatibilidade: Monitores Instramed, Dixtal, Mindray e compatíveis\nGarantia: 12 meses contra defeitos de fabricação",
            'preco_de' => 380.00,
            'preco_por' => 290.00,
            'estoque' => 50,
            'img' => 'https://images.unsplash.com/photo-1583912267885-3b18546b412d?auto=format&fit=crop&w=800&q=80',
            'destaque' => 0,
            'lancamento' => 0
        ],
        [
            'cat_id' => 3,
            'marca_id' => 8,
            'nome' => 'Bisturi Eletrônico Eletrocirúrgico Microprocessado 200 Watts Monopolar/Bipolar',
            'slug' => 'bisturi-eletronico-eletrocirurgico-200w',
            'sku' => 'NM-BIS-008',
            'desc_curta' => 'Gerador eletrocirúrgico digital com cortes puro, blend e coagulação precisa.',
            'desc_longa' => 'Equipamento cirúrgico de ponta indicado para procedimentos gerais, ginecológicos, dermatológicos e ortopédicos. Dispõe de sistema de monitoramento automático de placa de retorno e comandos no pedal e caneta.',
            'specs' => "Potência Máxima: 200W (Corte Puro), 150W (Blend 1 e 2), 100W (Coagulação)\nFrequência: 450 kHz\nControle: Ajuste digital display em LED\nAcompanha: Caneta acionamento manual, pedal duplo, placa neutra e cabos",
            'preco_de' => 14800.00,
            'preco_por' => 12900.00,
            'estoque' => 5,
            'img' => 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 1
        ],
        [
            'cat_id' => 1,
            'marca_id' => 5,
            'nome' => 'Balança Eletrônica Antropométrica Digital 200kg com Estadiômetro - Welmy',
            'slug' => 'balanca-antropometrica-digital-200kg-estadiometro-welmy',
            'sku' => 'NM-BAL-009',
            'desc_curta' => 'Balança médica hospitalar aferida pelo IPEM/INMETRO com régua antropométrica até 2,00m.',
            'desc_longa' => 'Estrutura robusta em chapa de aço carbono com acabamento esmaltado branco e piso emborrachado antiderrapante. Display LED indicador de peso e função tara.',
            'specs' => "Capacidade: 200 kg x Divisão 50g\nEstadiômetro: Régua retrátil em alumínio anodizado de 100 cm a 200 cm\nPlataforma: 40 cm x 40 cm reforçada\nHomologação: Selo do INMETRO e aferição inicial de fábrica",
            'preco_de' => 2200.00,
            'preco_por' => 1890.00,
            'estoque' => 14,
            'img' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 0
        ],
        [
            'cat_id' => 6,
            'marca_id' => 4,
            'nome' => 'Eletrodos Cardíacos Descartáveis Espuma SpO2 Adulto (Caixa c/ 1000 un)',
            'slug' => 'eletrodos-cardiacos-descartaveis-espuma-adulto-1000un',
            'sku' => 'NM-ELE-010',
            'desc_curta' => 'Eletrodos de gel sólido e dorso em espuma para monitorização ECG de curta e longa duração.',
            'desc_longa' => 'Aderência perfeita à pele mesmo em pacientes com sudorese. Sensor em prata/cloreto de prata (Ag/AgCl) que proporciona traçado eletrocardiográfico estável e sem artefatos.',
            'specs' => "Quantidade: 10 pacotes com 100 unidades cada (Total: 1.000 eletrodos)\nGel: Hidrogel sólido condutor atóxico\nFixação: Espuma hipoalergênica médica\nValidade: 2 anos a partir da data de fabricação",
            'preco_de' => 420.00,
            'preco_por' => 340.00,
            'estoque' => 80,
            'img' => 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80',
            'destaque' => 0,
            'lancamento' => 0
        ],
        [
            'cat_id' => 7,
            'marca_id' => 7,
            'nome' => 'Microscópio Biológico Binocular Óptica Infinita LED Profissional Sinnowa',
            'slug' => 'microscopio-biologico-binocular-optica-infinita-sinnowa',
            'sku' => 'NM-MIC-011',
            'desc_curta' => 'Óptica acromática corrigida ao infinito com aumento de até 1600x e iluminação Köhler.',
            'desc_longa' => 'Projetado para rotinas exigentes de laboratórios de patologia, hematologia, faculdades de medicina e centros de pesquisa. Tubo binocular ergonômico inclinado em 30° e revólver quádruplo.',
            'specs' => "Objetivas: Acromáticas Planas 4x, 10x, 40x (retrátil), 100x (óleo de imersão/retrátil)\nOculares: Campo amplo WF 10x/20mm e WF 16x\nCondensador: Abbe N.A. 1.25 com diafragma íris e suporte para filtro\nIluminação: LED 3W de alto brilho com ajuste contínuo de intensidade",
            'preco_de' => 7800.00,
            'preco_por' => 6790.00,
            'estoque' => 5,
            'img' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            'destaque' => 1,
            'lancamento' => 1
        ],
        [
            'cat_id' => 5,
            'marca_id' => 6,
            'nome' => 'Cicloergômetro Profissional para Reabilitação Fisioterapêutica - Inbramed',
            'slug' => 'cicloergometro-profissional-reabilitacao-inbramed',
            'sku' => 'NM-CIC-012',
            'desc_curta' => 'Equipamento ergométrico eletromagnético computadorizado para fisioterapia e reabilitação cardiovascular.',
            'desc_longa' => 'Controle computadorizado de carga com medição precisa em Watts. Ajuste anatômico de guidão e selim para pacientes em recuperação pós-operatória, atletas e idosos.',
            'specs' => "Sistema de Carga: Eletromagnético microprocessado (25 a 800 Watts)\nPainel: Monitor LCD com velocidade, distância, tempo, calorias e batimentos\nPeso Máximo do Usuário: 180 kg\nAlimentação: Bivolt automático 110/220V",
            'preco_de' => 16500.00,
            'preco_por' => 14200.00,
            'estoque' => 4,
            'img' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
            'destaque' => 0,
            'lancamento' => 1
        ]
    ];

    $stmt = $pdo->prepare("
        INSERT INTO produtos 
        (categoria_id, marca_id, nome, slug, sku, descricao_curta, descricao_longa, especificacoes, preco_de, preco_por, estoque, imagem_url, destaque, lancamento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    foreach ($produtos as $p) {
        $stmt->execute([
            $p['cat_id'],
            $p['marca_id'],
            $p['nome'],
            $p['slug'],
            $p['sku'],
            $p['desc_curta'],
            $p['desc_longa'],
            $p['specs'],
            $p['preco_de'],
            $p['preco_por'],
            $p['estoque'],
            $p['img'],
            $p['destaque'],
            $p['lancamento']
        ]);
    }
}
