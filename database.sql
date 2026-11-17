-- =========================================================================
-- BANCO DE DADOS: NORTE MÉDICA - CLONE E-COMMERCE
-- Compatível com HostGator (Alligator) / cPanel / phpMyAdmin / MySQL 5.7+ e 8.0+
-- =========================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "-04:00";

-- Criação da Tabela de Usuários Administradores
CREATE TABLE IF NOT EXISTS `usuarios_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL UNIQUE,
  `senha_hash` varchar(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuário Admin Padrão (admin / admin123)
INSERT INTO `usuarios_admin` (`id`, `usuario`, `senha_hash`, `nome`, `email`) VALUES
(1, 'admin', '$2y$10$wN317W8l9wD9rN6d2H5l0OD5B.k2mJmI6FkEeg3C738f6bXo0Fm12', 'Administrador Norte Médica', 'admin@nortemedica.com.br')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Criação da Tabela de Categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL UNIQUE,
  `icone` varchar(50) DEFAULT 'fa-box',
  `descricao` text DEFAULT NULL,
  `ordem` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categorias` (`id`, `nome`, `slug`, `icone`, `descricao`, `ordem`) VALUES
(1, 'Equipamentos Hospitalares & UTI', 'equipamentos-hospitalares', 'fa-heart-pulse', 'Monitores, ventiladores, desfibriladores e mesas cirúrgicas', 1),
(2, 'Esterilização & Autoclaves', 'esterilizacao-autoclaves', 'fa-shield-virus', 'Autoclaves hospitalares horizontais, seladoras e peças de reposição', 2),
(3, 'Cirúrgico & Eletrocirurgia', 'cirurgico-eletrocirurgia', 'fa-scalpel', 'Bisturis eletrônicos, pinças e instrumentais cirúrgicos', 3),
(4, 'Oxigenoterapia & Oximetria', 'oxigenoterapia-oximetria', 'fa-lungs', 'Sensores de SpO2, umidificadores e reguladores de pressão', 4),
(5, 'Resgate & Reabilitação', 'resgate-reabilitacao', 'fa-kit-medical', 'Pranchas de imobilização, esteiras ergométricas e cicloergômetros', 5),
(6, 'Descartáveis & Consumo', 'descartaveis-consumo', 'fa-box-tissue', 'Compressas estéreis, eletrodos, luvas e descartáveis hospitalares', 6),
(7, 'Laboratório & Diagnóstico', 'laboratorio-diagnostico', 'fa-microscope', 'Microscópios, centrífugas e analisadores bioquímicos', 7);

-- Criação da Tabela de Marcas
CREATE TABLE IF NOT EXISTS `marcas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `marcas` (`id`, `nome`, `slug`) VALUES
(1, 'INSTRAMED', 'instramed'),
(2, 'SERCON', 'sercon'),
(3, 'MAGNAMED', 'magnamed'),
(4, 'PROTEC', 'protec'),
(5, 'WELMY', 'welmy'),
(6, 'INBRAMED', 'inbramed'),
(7, 'SINNOWA', 'sinnowa'),
(8, 'MEDTRONIC', 'medtronic');

-- Criação da Tabela de Produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoria_id` int(11) DEFAULT NULL,
  `marca_id` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `sku` varchar(50) DEFAULT NULL,
  `descricao_curta` text DEFAULT NULL,
  `descricao_longa` longtext DEFAULT NULL,
  `especificacoes` text DEFAULT NULL,
  `preco_de` decimal(10,2) DEFAULT 0.00,
  `preco_por` decimal(10,2) NOT NULL,
  `estoque` int(11) DEFAULT 10,
  `imagem_url` text DEFAULT NULL,
  `destaque` tinyint(1) DEFAULT 0,
  `lancamento` tinyint(1) DEFAULT 0,
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `marca_id` (`marca_id`),
  CONSTRAINT `fk_produtos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_produtos_marcas` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `produtos` (`id`, `categoria_id`, `marca_id`, `nome`, `slug`, `sku`, `descricao_curta`, `descricao_longa`, `especificacoes`, `preco_de`, `preco_por`, `estoque`, `imagem_url`, `destaque`, `lancamento`, `ativo`) VALUES
(1, 1, 1, 'Monitor Multiparâmetrico CardioMax 12.1\" com SpO2, PNI e ECG', 'monitor-multiparametrico-cardiomax-12-polegadas', 'NM-MON-001', 'Monitor hospitalar de alta precisão para UTI e centro cirúrgico com tela touchscreen de 12.1\".', 'O Monitor Multiparâmetrico CardioMax é a solução ideal para monitoramento contínuo de pacientes críticos em UTI, Centro Cirúrgico e Pronto-Atendimento. Possui display LCD colorido de alta definição, memória de tendências gráficas e numéricas de 120 horas e bateria recarregável de lítio.', 'Tela: LCD TFT colorida de 12.1 polegadas\nParâmetros: ECG (7 derivações), Respiração, SpO2, PNI, 2 Canais de Temperatura\nAlarmes: Sonoros e visuais configuráveis\nBateria: Autonomia de até 4 horas contínuas\nConectividade: Saída de rede para central de monitoramento', 18900.00, 16500.00, 6, 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
(2, 1, 1, 'Cardioversor Desfibrilador Bifásico CardioMax com Marcapasso e DEA', 'cardioversor-desfibrilador-bifasico-cardiomax-instramed', 'NM-DES-002', 'Equipamento completo de ressuscitação com tecnologia de onda bifásica truncada e display colorido.', 'Desenvolvido para atender emergências com máxima agilidade e segurança. O CardioMax Instramed possui pás adulto e infantil integradas, marcapasso externo não-invasivo e função DEA automática com comandos por voz em português.', 'Tecnologia: Onda Bifásica Exponencial Truncada\nEnergia: Ajustável de 1 a 360 Joules\nTempo de Carga: Menor que 5 segundos a 360J\nModos: Manual, Sincronizado (Cardioversão), DEA e Marcapasso\nCertificação: ANVISA e Inmetro', 29500.00, 25800.00, 4, 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80', 1, 0, 1),
(3, 2, 2, 'Autoclave Hospitalar Horizontal 21 Litros Inox Digital - SERCON', 'autoclave-hospitalar-horizontal-21l-sercon', 'NM-AUT-003', 'Autoclave digital em aço inoxidável com câmara horizontal para esterilização rápida e segura.', 'Equipamento líder de mercado com controle eletrônico microprocessado, múltiplos ciclos programáveis (instrumental embalado, desfalecido, líquidos e plásticos) e secagem com porta fechada a vácuo.', 'Capacidade: 21 Litros\nMaterial da Câmara: Aço Inoxidável AISI 316L\nPressão de Trabalho: 1,0 a 2,3 kgf/cm²\nTemperatura: 121°C a 134°C ajustável\nAlimentação: 220V / 60Hz', 12400.00, 10990.00, 8, 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
(4, 2, 2, 'Guarnição Silicone p/ Porta de Autoclave AHMC3 60 Shore - SERCON', 'guarnicao-silicone-porta-autoclave-ahmc3-sercon', 'NM-GUA-004', 'Peça original Sercon para vedação hermética da câmara de esterilização.', 'Guarnição de perfil especial fabricada em silicone grau médico 60 Shore A de alta resistência térmica e mecânica. Garante vedação absoluta sem ressecamento durante repetidos ciclos de calor e pressão.', 'Material: Silicone Cirúrgico Atóxico\nDureza: 60 Shore A\nCompatibilidade: Autoclaves Sercon série AHMC3 e similares\nResistência Térmica: até 200°C contínuos', 310.00, 250.00, 35, 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=800&q=80', 0, 0, 1),
(5, 1, 3, 'Ventilador Pulmonar UTI Adulto, Pediátrico e Neonatal OxyMag - MAGNAMED', 'ventilador-pulmonar-uti-oxymag-magnamed', 'NM-VEN-005', 'Ventilador mecânico microprocessado de transporte e emergência/UTI de alta mobilidade.', 'O OxyMag é um ventilador pulmonar avançado, leve e versátil que atende desde pacientes neonatais com extremo baixo peso até adultos obesos. Ideal para UTIs, pronto-socorros e resgate terrestre/aéreo.', 'Pacientes: Neonatal, Pediátrico e Adulto (peso de 0,5 kg a 150 kg)\nModos Ventilatórios: VCV, PCV, PLV, V-SIMV, P-SIMV, CPAP/PSV, DuoLevel e Não-Invasiva (VNI)\nTela: Touch screen colorida de 5.7\"\nAutonomia da Bateria: Mais de 6,5 horas', 45000.00, 39900.00, 3, 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
(6, 5, 4, 'Prancha de Resgate e Transferência de Pacientes Rígida Adulto em Polietileno', 'prancha-de-resgate-transferencia-polietileno-protec', 'NM-PRA-006', 'Prancha de imobilização translúcida a Raio-X com 3 jogos de cintos de engate rápido.', 'Confeccionada em polietileno de alta densidade (PEAD) com tecnologia de rotomoldagem. 100% impermeável, de fácil higienização, flutuante em água e totalmente radiotransparente.', 'Capacidade de Carga: Suporta até 220 kg\nDimensões: 184 cm x 45 cm x 5 cm\nPeso do Produto: 7,5 kg\nAcessórios inclusos: 3 conjuntos de cintos de fixação reguláveis', 490.00, 380.00, 20, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 1, 0, 1),
(7, 4, 4, 'Sensor de Oximetria de Pulso Reutilizável SpO2 Clip Adulto Compatível Protec', 'sensor-oximetria-pulso-spo2-clip-adulto', 'NM-SPO-007', 'Cabo blindado de 3 metros com conector padrão e mola de alta durabilidade.', 'Sensor com fotodetectores de alta sensibilidade para medição instantânea da saturação periférica de oxigênio (SpO2) e frequência cardíaca. Silicone hipoalergênico que reduz o desconforto do paciente.', 'Comprimento: 3,0 metros\nTipo: Clip de dedo articulado Adulto\nCompatibilidade: Monitores Instramed, Dixtal, Mindray e compatíveis\nGarantia: 12 meses contra defeitos de fabricação', 380.00, 290.00, 50, 'https://images.unsplash.com/photo-1583912267885-3b18546b412d?auto=format&fit=crop&w=800&q=80', 0, 0, 1),
(8, 3, 8, 'Bisturi Eletrônico Eletrocirúrgico Microprocessado 200 Watts Monopolar/Bipolar', 'bisturi-eletronico-eletrocirurgico-200w', 'NM-BIS-008', 'Gerador eletrocirúrgico digital com cortes puro, blend e coagulação precisa.', 'Equipamento cirúrgico de ponta indicado para procedimentos gerais, ginecológicos, dermatológicos e ortopédicos. Dispõe de sistema de monitoramento automático de placa de retorno e comandos no pedal e caneta.', 'Potência Máxima: 200W (Corte Puro), 150W (Blend 1 e 2), 100W (Coagulação)\nFrequência: 450 kHz\nControle: Ajuste digital display em LED\nAcompanha: Caneta acionamento manual, pedal duplo, placa neutra e cabos', 14800.00, 12900.00, 5, 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
(9, 1, 5, 'Balança Eletrônica Antropométrica Digital 200kg com Estadiômetro - Welmy', 'balanca-antropometrica-digital-200kg-estadiometro-welmy', 'NM-BAL-009', 'Balança médica hospitalar aferida pelo IPEM/INMETRO com régua antropométrica até 2,00m.', 'Estrutura robusta em chapa de aço carbono com acabamento esmaltado branco e piso emborrachado antiderrapante. Display LED indicador de peso e função tara.', 'Capacidade: 200 kg x Divisão 50g\nEstadiômetro: Régua retrátil em alumínio anodizado de 100 cm a 200 cm\nPlataforma: 40 cm x 40 cm reforçada\nHomologação: Selo do INMETRO e aferição inicial de fábrica', 2200.00, 1890.00, 14, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80', 1, 0, 1),
(10, 6, 4, 'Eletrodos Cardíacos Descartáveis Espuma SpO2 Adulto (Caixa c/ 1000 un)', 'eletrodos-cardiacos-descartaveis-espuma-adulto-1000un', 'NM-ELE-010', 'Eletrodos de gel sólido e dorso em espuma para monitorização ECG de curta e longa duração.', 'Aderência perfeita à pele mesmo em pacientes com sudorese. Sensor em prata/cloreto de prata (Ag/AgCl) que proporciona traçado eletrocardiográfico estável e sem artefatos.', 'Quantidade: 10 pacotes com 100 unidades cada (Total: 1.000 eletrodos)\nGel: Hidrogel sólido condutor atóxico\nFixação: Espuma hipoalergênica médica\nValidade: 2 anos a partir da data de fabricação', 420.00, 340.00, 80, 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80', 0, 0, 1),
(11, 7, 7, 'Microscópio Biológico Binocular Óptica Infinita LED Profissional Sinnowa', 'microscopio-biologico-binocular-optica-infinita-sinnowa', 'NM-MIC-011', 'Óptica acromática corrigida ao infinito com aumento de até 1600x e iluminação Köhler.', 'Projetado para rotinas exigentes de laboratórios de patologia, hematologia, faculdades de medicina e centros de pesquisa. Tubo binocular ergonômico inclinado em 30° e revólver quádruplo.', 'Objetivas: Acromáticas Planas 4x, 10x, 40x (retrátil), 100x (óleo de imersão/retrátil)\nOculares: Campo amplo WF 10x/20mm e WF 16x\nCondensador: Abbe N.A. 1.25 com diafragma íris e suporte para filtro\nIluminação: LED 3W de alto brilho com ajuste contínuo de intensidade', 7800.00, 6790.00, 5, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 1, 1, 1),
(12, 5, 6, 'Cicloergômetro Profissional para Reabilitação Fisioterapêutica - Inbramed', 'cicloergometro-profissional-reabilitacao-inbramed', 'NM-CIC-012', 'Equipamento ergométrico eletromagnético computadorizado para fisioterapia e reabilitação cardiovascular.', 'Controle computadorizado de carga com medição precisa em Watts. Ajuste anatômico de guidão e selim para pacientes em recuperação pós-operatória, atletas e idosos.', 'Sistema de Carga: Eletromagnético microprocessado (25 a 800 Watts)\nPainel: Monitor LCD com velocidade, distância, tempo, calorias e batimentos\nPeso Máximo do Usuário: 180 kg\nAlimentação: Bivolt automático 110/220V', 16500.00, 14200.00, 4, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 0, 1, 1);

-- Criação da Tabela de Pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo_pedido` varchar(30) NOT NULL UNIQUE,
  `tipo_cliente` varchar(5) DEFAULT 'PF',
  `nome_cliente` varchar(150) NOT NULL,
  `documento` varchar(30) NOT NULL,
  `email` varchar(120) NOT NULL,
  `telefone` varchar(30) NOT NULL,
  `cep` varchar(15) NOT NULL,
  `endereco` varchar(200) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `frete_tipo` varchar(50) NOT NULL,
  `frete_valor` decimal(10,2) NOT NULL,
  `desconto` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `metodo_pagamento` varchar(50) NOT NULL,
  `status_pagamento` varchar(50) DEFAULT 'Aguardando Pagamento',
  `status_pedido` varchar(50) DEFAULT 'Em Processamento',
  `dados_pagamento` text DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Criação da Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS `itens_pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `produto_id` int(11) NOT NULL,
  `nome_produto` varchar(255) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  CONSTRAINT `fk_itens_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
