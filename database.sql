-- =========================================================================
-- BANCO DE DADOS: NORTE MÉDICA - CATÁLOGO COMPLETO EXTRAÍDO
-- Total de Produtos: 190 | Marcas: 79 | Categorias: 13
-- Compatível com HostGator (Alligator) / cPanel / phpMyAdmin / MySQL 5.7+ e 8.0+
-- =========================================================================

SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
START TRANSACTION;
SET time_zone = '-04:00';

CREATE TABLE IF NOT EXISTS `usuarios_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL UNIQUE,
  `senha_hash` varchar(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `usuarios_admin` (`id`, `usuario`, `senha_hash`, `nome`, `email`) VALUES
(1, 'admin', '$2y$10$wN317W8l9wD9rN6d2H5l0OD5B.k2mJmI6FkEeg3C738f6bXo0Fm12', 'Administrador Norte Médica', 'admin@nortemedica.com.br')
ON DUPLICATE KEY UPDATE `id`=`id`;

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
(1, 'Equipamentos & Suprimentos Hospitalares', 'equipamentos-suprimentos-hospitalares', 'fa-kit-medical', 'Equipamentos & Suprimentos Hospitalares', 1),
(2, 'Esterilização & Autoclaves', 'esteriliza-o-autoclaves', 'fa-shield-virus', 'Esterilização & Autoclaves', 2),
(3, 'Tubos & Conexões em Silicone', 'tubos-conex-es-em-silicone', 'fa-arrows-turn-to-dots', 'Tubos & Conexões em Silicone', 3),
(4, 'Cirúrgico & Eletrocirurgia', 'cir-rgico-eletrocirurgia', 'fa-scalpel', 'Cirúrgico & Eletrocirurgia', 4),
(5, 'UTI Neonatal & Pediátrica', 'uti-neonatal-pedi-trica', 'fa-baby', 'UTI Neonatal & Pediátrica', 5),
(6, 'Eletrocardiografia & Diagnóstico', 'eletrocardiografia-diagn-stico', 'fa-wave-square', 'Eletrocardiografia & Diagnóstico', 6),
(7, 'Desfibriladores & Cardioversores', 'desfibriladores-cardioversores', 'fa-bolt', 'Desfibriladores & Cardioversores', 7),
(8, 'Oxigenoterapia & Ventilação', 'oxigenoterapia-ventila-o', 'fa-lungs', 'Oxigenoterapia & Ventilação', 8),
(9, 'Tratamento de Água & Osmose Reversa', 'tratamento-de-gua-osmose-reversa', 'fa-droplet', 'Tratamento de Água & Osmose Reversa', 9),
(10, 'Mobiliário Hospitalar & Conforto', 'mobili-rio-hospitalar-conforto', 'fa-bed-pulse', 'Mobiliário Hospitalar & Conforto', 10),
(11, 'Diagnóstico Clínico & Otoscópios', 'diagn-stico-cl-nico-otosc-pios', 'fa-ear-listen', 'Diagnóstico Clínico & Otoscópios', 11),
(12, 'Instrumentais Cirúrgicos & Odonto', 'instrumentais-cir-rgicos-odonto', 'fa-scissors', 'Instrumentais Cirúrgicos & Odonto', 12),
(13, 'Laboratório & Centrífugas', 'laborat-rio-centr-fugas', 'fa-microscope', 'Laboratório & Centrífugas', 13);

CREATE TABLE IF NOT EXISTS `marcas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `marcas` (`id`, `nome`, `slug`) VALUES
(1, 'NEVONI', 'nevoni'),
(2, 'NORTE', 'norte'),
(3, 'MHL', 'mhl'),
(4, 'NORTE MDICA', 'norte-mdica'),
(5, 'NORTE MÉDICA', 'norte-m-dica'),
(6, 'EMAIL', 'email'),
(7, 'GIGANTE RECEM NASCIDO', 'gigante-recem-nascido'),
(8, 'TECNOPRINT', 'tecnoprint'),
(9, 'MJV', 'mjv'),
(10, 'PHOENIX', 'phoenix'),
(11, 'BAUMER', 'baumer'),
(12, 'SERCON', 'sercon'),
(13, 'DIVERSAS', 'diversas'),
(14, 'DELTRONIX', 'deltronix'),
(15, 'BAX500', 'bax500'),
(16, 'GLOBAL TEC MD E MEDMAX', 'global-tec-md-e-medmax'),
(17, 'SCAV', 'scav'),
(18, 'TAKAOKA', 'takaoka'),
(19, 'VEPEX', 'vepex'),
(20, 'TECNOVENT', 'tecnovent'),
(21, 'DIXTAL', 'dixtal'),
(22, 'RD MEDIQ M', 'rd-mediq-m'),
(23, 'ICOS', 'icos'),
(24, 'NEW TEC', 'new-tec'),
(25, 'TEKNA', 'tekna'),
(26, 'H2M', 'h2m'),
(27, 'CAM MEDICAL', 'cam-medical'),
(28, 'BBI', 'bbi'),
(29, 'PROTEC', 'protec'),
(30, 'WELMY', 'welmy'),
(31, 'GASLIVE', 'gaslive'),
(32, 'HOFFMANLAB', 'hoffmanlab'),
(33, 'INBRAS', 'inbras'),
(34, 'BIOLAND', 'bioland'),
(35, 'BLENTA', 'blenta'),
(36, 'MAMUTE', 'mamute'),
(37, 'MEDMAX', 'medmax'),
(38, 'INSTRAMED', 'instramed'),
(39, 'BRASMEDICAL', 'brasmedical'),
(40, 'BIC', 'bic'),
(41, 'BBS COMPONENTES ELETRONICOS', 'bbs-componentes-eletronicos'),
(42, 'RDMEDIQ', 'rdmediq'),
(43, 'KACIL', 'kacil'),
(44, 'EPEX', 'epex'),
(45, '3M', '3m'),
(46, 'CENTRILAB', 'centrilab'),
(47, 'MINDRAY', 'mindray'),
(48, 'APK TECHNOLOGY CO', 'apk-technology-co'),
(49, 'ASPIRAMAX', 'aspiramax'),
(50, 'MJV - GUARNIO 1400 X 1500 VERM', 'mjv-guarnio-1400-x-1500-verm'),
(51, 'CLEAN UP', 'clean-up'),
(52, 'DIVISO LATEX', 'diviso-latex'),
(53, 'PHILIPS', 'philips'),
(54, 'MAGNAMED', 'magnamed'),
(55, 'LAVANDERIA HOSPITALAR', 'lavanderia-hospitalar'),
(56, 'RIESTER', 'riester'),
(57, 'LINHA AUTOCLAVE HS 364L', 'linha-autoclave-hs-364l'),
(58, 'RESPIRATORY', 'respiratory'),
(59, 'EROTEC', 'erotec'),
(60, 'MEDMAX GLOBALTEC', 'medmax-globaltec'),
(61, 'ERWIN GUTH', 'erwin-guth'),
(62, 'H2M RUBBER', 'h2m-rubber'),
(63, 'BFILTERS', 'bfilters'),
(64, 'SCHILLER', 'schiller'),
(65, 'SOLARIS', 'solaris'),
(66, 'SYNCROFLEX', 'syncroflex'),
(67, 'AQUALGICA  LITER', 'aqualgica-liter'),
(68, 'MULTIMARCA', 'multimarca'),
(69, 'SINNOWA', 'sinnowa'),
(70, 'G-TECH', 'g-tech'),
(71, 'SPIRIT', 'spirit'),
(72, 'PREO ESPECIAL PARA ESTE LOTE', 'preo-especial-para-este-lote'),
(73, 'SIMILAR  COMPATVEL', 'similar-compatvel'),
(74, 'LINHA AUTOCLAVE HS 724L', 'linha-autoclave-hs-724l'),
(75, 'OXIGEL', 'oxigel'),
(76, 'YUWELL', 'yuwell'),
(77, 'BSZ CIRURGICA', 'bsz-cirurgica'),
(78, 'KSS', 'kss'),
(79, 'UNITEC', 'unitec');

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
  KEY `marca_id` (`marca_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `produtos` (`id`, `categoria_id`, `marca_id`, `nome`, `slug`, `sku`, `descricao_curta`, `descricao_longa`, `especificacoes`, `preco_de`, `preco_por`, `estoque`, `imagem_url`, `destaque`, `lancamento`, `ativo`) VALUES
(1, 1, 1, 'FRASCO PLASTICO 5 LITROS COM TAMPA  NEVONI - PARA ASPIRADORES CIRÚRGICOS', 'frasco_plastico_5_litros_com_tampa_nevoni_para_aspiradores_cirurgicos', '6522698', 'FRASCO EM MATERIAL PLASTICO 5 LITROS COM TAMPA - MACRA NEVONI', 'FRASCO EM MATERIAL PLASTICO 5 LITROS COM TAMPA - MACRA NEVONI', 'Código Referência: 6522698
Marca/Fabricante: NEVONI
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35759900/G/rotated_image.jpg', 1, 1, 1),
(2, 2, 2, 'SELADORA  AUTOMÁTICA PARA GRAU CIRÚRGICO', 'seladora_automatica_para_grau_cirurgico_', '4273057', 'SELADORA AUTOMÁTICA PARA GRAU CIRÚRGICO  Possibilita a selagem de grau cirúrgico com diferentes temperaturas de selagem programada pelo operador. Conforme', 'SELADORA AUTOMÁTICA PARA GRAU CIRÚRGICO  Possibilita a selagem de grau cirúrgico com diferentes temperaturas de selagem programada pelo operador. Conforme', 'Código Referência: 4273057
Marca/Fabricante: NORTE
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/18975752/G/seladora_para_site.jpg', 1, 0, 1),
(3, 1, 3, 'ANALISADOR DE BIOQUÍMICA SEMI- AUTOMÁTICO SX 3000M', 'analisador_de_bioquimica_semiautomatico_sx_3000m', '2585857', 'ANALISADOR DE BIOQUÍMICA SEMI- AUTOMÁTICO SX 3000 M', 'ANALISADOR DE BIOQUÍMICA SEMI- AUTOMÁTICO SX 3000 M', 'Código Referência: 2585857
Marca/Fabricante: MHL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 11500.0, 10000.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/14028133/G/features_produtos_sx_3000_m_04.jpg', 1, 0, 1),
(4, 1, 4, 'Medidor universal de Cuff Portátil', 'medidor_universal_de_cuff_portatil_', '7745593', 'Cufômetro Universal - Medidor De Cuff', 'Cufômetro Universal - Medidor De Cuff', 'Código Referência: 7745593
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 3450.0, 3000.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31549639/G/whatsapp_image_2022_05_06_at_18.01.26.jpeg', 1, 0, 1),
(5, 3, 5, 'BANHO MARIA DIGITAL 105 TUBOS', 'banho_maria_digital_105_tubos', '2181011', 'BANHO MARIA DIGITAL KACIL', 'BANHO MARIA DIGITAL KACIL', 'Código Referência: 2181011
Marca/Fabricante: NORTE MÉDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1024.0, 960.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/4504810/G/bm02_a.jpg', 1, 0, 1),
(6, 4, 6, 'CANETA DESC.  P/ BISTURI ELETRICO - COMANDO  MANUALL', 'caneta_desc_p_bisturi_eletrico_comando_manuall_', '5063024', 'CANETA DESC.  P/ BISTURI ELETRICO - COMANDO  MANUALL', 'CANETA DESC.  P/ BISTURI ELETRICO - COMANDO  MANUALL', 'Código Referência: 5063024
Marca/Fabricante: EMAIL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 549.99, 300.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17435899/G/dal01.jpg', 1, 0, 1),
(7, 5, 7, 'INCUBADORA NEONATAL ESTACIONARIA', 'incubadora_neonatal_estacionaria_', '9248549', 'INCUBADORA NEONATAL GRN MODELO', 'INCUBADORA NEONATAL GRN MODELO', 'Código Referência: 9248549
Marca/Fabricante: GIGANTE RECEM NASCIDO
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2875.0, 2500.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31060366/G/incubadora_millennium_com_acessorios.jpg', 1, 1, 1),
(8, 6, 8, 'CABO PACIENTE 10 VIAS PARA ECG BIONET', 'cabo_paciente_10_vias_para_ecg_bionet', '5292879', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO (ECG ) - PARA O  BIONET', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO (ECG ) - PARA O  BIONET', 'Código Referência: 5292879
Marca/Fabricante: TECNOPRINT
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 828.0, 720.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17374257/G/8a71cf6bfa.jpg', 1, 0, 1),
(9, 1, 9, 'BALÃO DE SILICONE 3 LITROS  - BOLSA RESPIRATORIA', 'balao_de_silicone_3_litros_bolsa_respiratoria', '4558385', 'BALÃO DE SILICONE 3 LITROS  - BOLSA RESPIRATORIA', 'BALÃO DE SILICONE 3 LITROS  - BOLSA RESPIRATORIA', 'Código Referência: 4558385
Marca/Fabricante: MJV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 259.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/14800563/G/balao_silicone_hospitalar_01.jpg', 1, 0, 1),
(10, 1, 9, 'BALÃO DE SILICONE 1 LITROS  - BOLSA RESPIRATORIA,', 'balao_de_silicone_1_litros_bolsa_respiratoria_', '4558372', 'BALÃO DE SILICONE 1 LITROS  - BOLSA RESPIRATORIA,', 'BALÃO DE SILICONE 1 LITROS  - BOLSA RESPIRATORIA,', 'Código Referência: 4558372
Marca/Fabricante: MJV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 229.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/14800432/G/balao_silicone_hospitalar_01.jpg', 1, 0, 1),
(11, 7, 4, 'DEA - DESFIBRILADOR EXTERNO AUTOMÁTICO -  Toth 5800', '_dea_desfibrilador_externo_automatico_toth_5800', '2167846', 'DEA - DESFIBRILADOR EXTERNO AUTOMÁTICO -  Toth 5800', 'DEA - DESFIBRILADOR EXTERNO AUTOMÁTICO -  Toth 5800', 'Código Referência: 2167846
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 38000.0, 8000.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36232549/G/d_nq_np_2x_690245_mla81822867884_012025_f.jpg', 1, 0, 1),
(12, 2, 10, 'GUARNIÇÃO 1.615 X 15,5 MM SILICONE PARA PORTA DE AUTOCLAVE BAUME B100', 'guarnicao_1615_x_155_mm_silicone_para_porta_de_autoclave_baume_b100', '5257291', 'GUARNIÇÃO 1.615 X 15,5 MM SILICONE PARA PORTA DE AUTOCLAVE BAUME B100', 'GUARNIÇÃO 1.615 X 15,5 MM SILICONE PARA PORTA DE AUTOCLAVE BAUME B100', 'Código Referência: 5257291
Marca/Fabricante: PHOENIX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1999.99, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17218155/G/img_20180129_wa0099.jpg', 1, 0, 1),
(13, 2, 11, 'Guarnição Tubular de Vedação para Autoclave Baumer 15,5 × 5,0 mm – 2.160 mm – Azul', 'guarnicao_tubular_de_vedacao_para_autoclave_baumer_15550_mm2160_mmazul', '8798750', 'Guarnição tubular de vedação para autoclave Baumer, com perfil de 15,5 × 5,0 mm, comprimento de 2.160 mm e acabamento na cor azul. Consulte a compatibilidade com o modelo da autocl...', 'Guarnição tubular de vedação para autoclave Baumer, com perfil de 15,5 × 5,0 mm, comprimento de 2.160 mm e acabamento na cor azul. Consulte a compatibilidade com o modelo da autoclave.', 'Código Referência: 8798750
Marca/Fabricante: BAUMER
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 900.0, 350.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36350893/G/guarnicao_tubu_1550_x_0500___2160mm_a___azul_cl_baumer_1.jpg', 1, 1, 1),
(14, 2, 12, 'GUARNIÇÃO SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVE SERCON 2640 MM P PORTA 560 X 760 PARA AUTOCLAVE SERCON MODE 724 LITROS', 'guarnicao_silicone_p_vedacao_de_porta_de_autoclave_sercon_2640_mm_p_porta_560_x_', '10755210', 'GUARNIÇÃO SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVE SERCON 2640 MM P PORTA 560 X 760 PARA AUTOCLAVE SERCON MODE 724 LITROS', 'GUARNIÇÃO SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVE SERCON 2640 MM P PORTA 560 X 760 PARA AUTOCLAVE SERCON MODE 724 LITROS', 'Código Referência: 10755210
Marca/Fabricante: SERCON
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1999.99, 600.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36031398/G/2.jpg', 1, 0, 1),
(15, 1, 4, 'Circuito Respiratório Neonatal para Ventilação Mecânica com 4 Traqueias, Conector Y e Drenos – NEO', 'circuito_respiratorio_neonatal_para_ventilacao_mecanica_com_4_traqueias_conector', '10856685', 'Circuito respiratório neonatal para ventilação mecânica, composto por 4 traqueias de silicone de 12 mm × 600 mm, 1 conector tipo Y e 2 drenos. Modelo NEO, marca MJV. Consulte a com...', 'Circuito respiratório neonatal para ventilação mecânica, composto por 4 traqueias de silicone de 12 mm × 600 mm, 1 conector tipo Y e 2 drenos. Modelo NEO, marca MJV. Consulte a compatibilidade com o equipamento antes da compra.', 'Código Referência: 10856685
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 920.0, 800.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36329339/G/whatsapp_image_2026_09_15_at_09.50.57.jpeg', 1, 0, 1),
(16, 8, 13, 'Valvula Reguladora Oxigênio Medicinal c/ Fluxômetro tipo Click embutido', 'valvula_reguladora_oxigenio_medicinal_c_fluxometro_tipo_click_embutido', '8002662', 'Valvula Reguladora Oxigênio Medicinal c/ Fluxômetro tipo Click embutido', 'Valvula Reguladora Oxigênio Medicinal c/ Fluxômetro tipo Click embutido', 'Código Referência: 8002662
Marca/Fabricante: DIVERSAS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2999.9, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25412352/G/images_7.jpeg', 1, 0, 1),
(17, 1, 14, 'ELETRODO P/ BISTURI POTA TIPO FACA RETA  EM16   1,6mm x 70mm', 'eletrodo_p_bisturi_pota_tipo_faca_reta_em16_16mm_x_70mm_', '4797404', 'ELETRODO P/ BISTURI POTA TIPO FACA RETA  1,6mm x 80,5mm  (P/ CANETA BISTURI ELETRÔNICO)', 'ELETRODO P/ BISTURI POTA TIPO FACA RETA  1,6mm x 80,5mm  (P/ CANETA BISTURI ELETRÔNICO)', 'Código Referência: 4797404
Marca/Fabricante: DELTRONIX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 107.52, 93.5, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15700584/G/ponta_faca_80.jpg', 1, 0, 1),
(18, 1, 15, 'BOMBAS PARA APARELHOS DE OSMOSE REVERSA 50 GPD 24V 1,5A', 'bombas_para_aparelhos_de_osmose_reversa_50_gpd_24v_15a', '3778744', 'BOMBAS PARA APARELHOS DE OSMOSE REVERSA', 'BOMBAS PARA APARELHOS DE OSMOSE REVERSA', 'Código Referência: 3778744
Marca/Fabricante: BAX500
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1000.0, 400.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35770956/G/bomba_50_gpd.jpg', 1, 0, 1),
(19, 1, 16, 'Braçadeira para MAPA com Argola Metálica e Fechamento em Velcro – Divisão Latex', 'bracadeira_para_mapa_com_argola_metalica_e_fechamento_em_velcrodivisao_latex', '10871044', 'Braçadeira para MAPA com Argola Metálica e Fechamento em Velcro – Divisão Latex', 'Braçadeira para MAPA com Argola Metálica e Fechamento em Velcro – Divisão Latex', 'Código Referência: 10871044
Marca/Fabricante: GLOBAL TEC MD E MEDMAX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 322.0, 280.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36362216/G/2_d_latex.png', 1, 1, 1),
(20, 1, 17, 'BARAKA 3L ADULTO- TRAQUEIA SILICONE', 'baraka_3l_adultotraqueia_silicone_', '2586072', 'BARAKA 3L COM TRAQUEIA DE SILICONE', 'BARAKA 3L COM TRAQUEIA DE SILICONE', 'Código Referência: 2586072
Marca/Fabricante: SCAV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 234.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/6129914/G/baraka_3_l_traqueia_silicone_adulto.jpg', 1, 0, 1),
(21, 1, 18, 'SENSOR DE FLUXO ADULTO GRAVADO TAKAOKA', 'sensor_de_fluxo_adulto_gravado_takaoka', '8127686', 'SENSOR DE FLUXO ADULTO GRAVADO TAKAOKA', 'SENSOR DE FLUXO ADULTO GRAVADO TAKAOKA', 'Código Referência: 8127686
Marca/Fabricante: TAKAOKA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35048965/G/sensor.jpg', 1, 0, 1),
(22, 6, 19, 'Papel termosensível contínuo 216 x 280  Eletrocardiógrafo 1000folhas', 'papel_termosensivel_continuo_216_x_280_eletrocardiografo_1000folhas', '9292760', 'Papel termosensível 216x280  Eletrocardiógrafo 1000folhas', 'Papel termosensível 216x280  Eletrocardiógrafo 1000folhas', 'Código Referência: 9292760
Marca/Fabricante: VEPEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 238.05, 207.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31165503/G/papel_ecg_210x280.jpg', 1, 0, 1),
(23, 1, 4, 'ASPIRADOR  DE SECREÇÃO VENTURI REDE AR COMPRIMIDO FRASCO DE PLÁSTICOS 500ML.', 'aspirador_de_secrecao_venturi_rede_ar_comprimido_frasco_de_plasticos_500ml', '8127698', 'ASPIRADOR  DE SECREÇÃO VENTURI REDE AR COMPRIMIDO FRASCO DE PLÁSTICOS 500ML', 'ASPIRADOR  DE SECREÇÃO VENTURI REDE AR COMPRIMIDO FRASCO DE PLÁSTICOS 500ML', 'Código Referência: 8127698
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25966735/G/images.jpg', 1, 0, 1),
(24, 1, 20, 'CONECTOR TIPO Y 22MM COM 1 FURO PARA CIRCUITO PACIENTE', 'conector_tipo_y_22mm_com_1_furo_para_circuito_paciente', '6933043', 'CONECTOR TIPO Y 22MM PARA CIRCUITO PACIENTE', 'CONECTOR TIPO Y 22MM PARA CIRCUITO PACIENTE', 'Código Referência: 6933043
Marca/Fabricante: TECNOVENT
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 57.5, 50.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/21380079/G/1_100_0015_ypsilon_para_traqueia_22_mm_500x500.jpg', 1, 0, 1),
(25, 2, 4, 'RESISTENCIA AUTOCLAVE 8000W -230 C/ PÇO P/ TERM 60CM', 'resistencia_autoclave_8000w230_c_pco_p_term_60cm', '4025994', 'RESISTENCIA AUTOCLAVE 8000W -230 C/ PÇO P/ TERM 60CM', 'RESISTENCIA AUTOCLAVE 8000W -230 C/ PÇO P/ TERM 60CM', 'Código Referência: 4025994
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1092.5, 950.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/12919823/G/resistencia_tipo_b_para_autoclaves_horizontais_1414497759.jpg', 0, 1, 1),
(26, 6, 21, 'CABO PACIENTE 10 VIAS PARA ECG DIXTAL', 'cabo_paciente_10_vias_para_ecg_dixtal', '5296807', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO ( ECG ) - PARA DIXTAL', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO ( ECG ) - PARA DIXTAL', 'Código Referência: 5296807
Marca/Fabricante: DIXTAL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 9900.0, 670.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17395899/G/epx_c1020_bs___ep_12_03.jpg', 0, 0, 1),
(27, 1, 22, 'TRAQUEIA DESC. PARA FILTRO UMIDIFICADOR HMEF', 'traqueia_desc_para_filtro_umidificador_hmef_', '3563002', 'Traqueia descartável para conexão de filtro HME', 'Traqueia descartável para conexão de filtro HME', 'Código Referência: 3563002
Marca/Fabricante: RD MEDIQ M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 841.0, 40.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/11363402/G/traquea.jpg', 0, 0, 1),
(28, 1, 23, 'Osmose Reversa  4 estágio 30L/HORAS', 'osmose_reversa_4_estagio_30lhoras_', '3054945', 'OSMOSE REVERSA 4 ESTAGIO 20L/H', 'OSMOSE REVERSA 4 ESTAGIO 20L/H', 'Código Referência: 3054945
Marca/Fabricante: ICOS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5750.0, 5000.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/30662248/G/4400bbe2_0a03_4b55_aa66_7c721758ff47_1.jpg', 0, 0, 1),
(29, 1, 24, 'BALÃO DE SILICONE 1/2L  - BOLSA RESPIRATORIA', 'balao_de_silicone_12l_bolsa_respiratoria', '4558364', 'BALAO DE SILICONE 1/2 LITROS  - TRANSLUCIDA', 'BALAO DE SILICONE 1/2 LITROS  - TRANSLUCIDA', 'Código Referência: 4558364
Marca/Fabricante: NEW TEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 199.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/14800369/G/balao_silicone_hospitalar_01.jpg', 0, 0, 1),
(30, 1, 25, 'COMPRESSOR DE AR ISENTO DE ÓLEO', 'compressor_de_ar_isento_de_oleo', '6426231', 'Compressor de Ar CPS60  Com um motor silencioso e com potência de 1,5 HP, tem alta performance e desempenho.  • Isento de Óleo • Pés de Borracha • Motor Silencioso', 'Compressor de Ar CPS60  Com um motor silencioso e com potência de 1,5 HP, tem alta performance e desempenho.  • Isento de Óleo • Pés de Borracha • Motor Silencioso', 'Código Referência: 6426231
Marca/Fabricante: TEKNA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1150.0, 1000.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35179803/G/cps60_04_1.png', 0, 0, 1),
(31, 1, 12, 'NORTEMEDICA COMERCIO E REPRESENTAÇÕES LTDA.', 'caneta_p_bisturi_eletrico_comando_pedal_autoclavavel_', '5063013', 'Produtos e Equipamentos Médicos Hospitalar e Laboratorial e Assistência Técnica', 'Produtos e Equipamentos Médicos Hospitalar e Laboratorial e Assistência Técnica', 'Código Referência: 5063013
Marca/Fabricante: SERCON
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 371.0, 250.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/4498014/G/logo_nova_.jpeg', 0, 1, 1),
(32, 1, 26, 'TUBO DE SILICONE 202 (10,0 x 5,0 MM) 1 MTRO', 'tubodesilicone202100x50mm1mtro', '3006238', 'TUBO DE SILICONE - COD. 202 (10,0 x 5,0 MM) 1 MTRO', 'TUBO DE SILICONE - COD. 202 (10,0 x 5,0 MM) 1 MTRO', 'Código Referência: 3006238
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 40.25, 35.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8386067/G/tubo_de_silicone.jpg', 0, 0, 1),
(33, 7, 27, 'Descritivo genérico - Desfibrilador Cardioversor Bifásico com Dea e Marcapass om Automático Externo (DEA) e Marcapasso Transcutâneo.', 'descritivo_generico_desfibrilador_cardioversor_bifasico_com_dea_e_marcapass_om', '10744006', 'Desfibrilador Cardioversor de tecnologia de Onda Bifásica, com Automático Externo (DEA) e Marcapasso Transcutâneo.', 'Desfibrilador Cardioversor de tecnologia de Onda Bifásica, com Automático Externo (DEA) e Marcapasso Transcutâneo.', 'Código Referência: 10744006
Marca/Fabricante: CAM MEDICAL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 13000.0, 2500.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35991974/G/cardio.jpeg', 0, 0, 1),
(34, 2, 28, 'BOMBA D AGUA INOX PARA AUTOCLAVE 0,5 HP  / 50 L/MIM BIVOLT', 'bomba_d_agua_inox_para_autoclave_05_hp50_lmim_bivolt', '7971121', 'Bomba Autoaspirante BAX500 – 0,5 HP', 'Bomba Autoaspirante BAX500 – 0,5 HP', 'Código Referência: 7971121
Marca/Fabricante: BBI
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1035.0, 900.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36036587/G/bax1000_foto_1_principal.jpg', 0, 0, 1),
(35, 8, 29, 'Fluxômetro de oxigênio (O2) com escala de 0-15/min', 'fluxometro_de_oxigenio_o2_com_escala_de_0_15min', '8127716', 'Fluxômetro de oxigênio (O2) com escala de 0-15 ?/min', 'Fluxômetro de oxigênio (O2) com escala de 0-15 ?/min', 'Código Referência: 8127716
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2999.9, 90.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25966866/G/rwr_gasoterapia_fluxometro.jpg', 0, 0, 1),
(36, 6, 8, 'ELETRODO PRE CORDIAL ECG INFANTIL', 'ELETRODO_PRE_CORDIAL_ECG_INFANTIL', '3010453', 'ELETRODO PRE CORDIAL PARA ECG INFANTIL', 'ELETRODO PRE CORDIAL PARA ECG INFANTIL', 'Código Referência: 3010453
Marca/Fabricante: TECNOPRINT
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 34.5, 30.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8409492/G/eletrodos_04_large.jpg', 0, 0, 1),
(37, 1, 30, 'BALANÇA PEDIÁTRICA 15 KG ELETRÔNICA ANTROPOMÉTRICA  - WELMY', 'balanca_pediatrica_15_kg_eletronica_antropometrica_welmy', '4296852', 'BALANÇA ELETRÔNICA ANTROPOMETRICA  PEDIÁTRICA 15 KG', 'BALANÇA ELETRÔNICA ANTROPOMETRICA  PEDIÁTRICA 15 KG', 'Código Referência: 4296852
Marca/Fabricante: WELMY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1253.5, 1090.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15218226/G/balanca_ped.jpg', 0, 1, 1),
(38, 8, 31, 'FLUXÔMETRO  0 A 15 L/MIN PARA AR COMPRIMIDO', 'fluxometro_0_a_15_lmin_para_ar_comprimido', '8127733', 'FLUXÔMETRO  0 A 15 L/MIN PARA AR COMPRIMIDO', 'FLUXÔMETRO  0 A 15 L/MIN PARA AR COMPRIMIDO', 'Código Referência: 8127733
Marca/Fabricante: GASLIVE
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 500.0, 90.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25966916/G/fluxometros_0_a_15_l_min_para_ar_comprimido_engate_rapido_ohmeda_1.jpg', 0, 0, 1),
(39, 1, 32, 'HOMOGENEIZADOR HEMATOLOGICO 28 TBS BIVOLT', 'homogeneizador_hematologico_28_tbs_bivolt', '2181091', 'HOMOGENEIZADOR HEMATOLOGICO 28 TBS BIVOLT', 'HOMOGENEIZADOR HEMATOLOGICO 28 TBS BIVOLT', 'Código Referência: 2181091
Marca/Fabricante: HOFFMANLAB
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 11500.0, 10000.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/13927604/G/homogeneizador_alb260h_011_940x450.jpg', 0, 0, 1),
(40, 1, 33, 'OTOSCÓPIO PEN-SCOPE LAMPADA XENON 2,5V', 'otoscopio_pen_scope_lampada_xenon_25v', '7741867', 'OTOSCÓPIO PEN -SCOPE RIESTER 	 •	Lâmpada xenon 2,5V 	 •	Fabricado em fibra de vidro reforçado', 'OTOSCÓPIO PEN -SCOPE RIESTER 	 •	Lâmpada xenon 2,5V 	 •	Fabricado em fibra de vidro reforçado', 'Código Referência: 7741867
Marca/Fabricante: INBRAS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1024.0, 960.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/24726079/G/image.png', 0, 0, 1),
(41, 1, 4, 'ATA DE REGISTRO DE PREÇO EM LISTAS  - RELAÇÃO DE ATAS DE REGISTRO DE PREÇO', 'ata_de_registro_de_preco_em_listas_relacao_de_atas_de_registro_de_preco', '7207448', 'RELAÇÃO DE ATAS DE REGISTRO DE PREÇOS — PRODUTOS E SERVIÇOS HOMOLOGADOS (ÂMBITO ESTADUAL E MUNICIPAL)', 'RELAÇÃO DE ATAS DE REGISTRO DE PREÇOS — PRODUTOS E SERVIÇOS HOMOLOGADOS (ÂMBITO ESTADUAL E MUNICIPAL)', 'Código Referência: 7207448
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 460.0, 400.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/22459684/G/images.jpg', 0, 0, 1),
(42, 1, 5, 'Reanimador Manual de Silicone MD com Reservatório Pediátric', 'reanimador_manual_de_silicone_md_com_reservatorio_pediatric', '5200895', 'Reanimador Manual Reutilizável Pediátrico', 'Reanimador Manual Reutilizável Pediátrico', 'Código Referência: 5200895
Marca/Fabricante: NORTE MÉDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17124113/G/reanimador_manual_de_silicone_ambu_peditrico_md_21693.jpg', 0, 0, 1),
(43, 1, 5, 'Reanimador Manual de Silicone MD com Reservatório Adulto', 'reanimador_manual_de_silicone_md_com_reservatorio_adulto_', '5200888', 'Reanimador Manual de Silicone MD com Reservatório Adulto', 'Reanimador Manual de Silicone MD com Reservatório Adulto', 'Código Referência: 5200888
Marca/Fabricante: NORTE MÉDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17124087/G/5434.jpg', 0, 1, 1),
(44, 2, 26, 'GUARNIÇÃO 9 X 11 MM, X 1650 MM EM SILICONE P AUTOCLAVES  DE 75 A 201 LITROS', 'guarnicao_9_x_11_mm_x_1650_mm_em_silicone_p_autoclaves_de_75_a_201_litros', '3006335', 'GUARNIÇÃO 9 X 11 MM, EM SILICONE P AUTOCLAVES  DE 75 A 201 LITROS', 'GUARNIÇÃO 9 X 11 MM, EM SILICONE P AUTOCLAVES  DE 75 A 201 LITROS', 'Código Referência: 3006335
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1200.0, 258.6, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17156997/G/132609534.jpg', 0, 0, 1),
(45, 1, 4, 'TUBO DE SILICONE  201 - 8,00 x 4,00', 'tubo_de_silicone_201_800_x_400_', '3006054', 'TUBO DE SILICONE N 201 - 8,00 x 4,00', 'TUBO DE SILICONE N 201 - 8,00 x 4,00', 'Código Referência: 3006054
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 28.75, 25.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8386084/G/tubo_de_silicone.jpg', 0, 0, 1),
(46, 1, 34, 'GLICOSIMENTRO Medidor de Glicose - Modelo G-425-3 Marca: Bioland', 'glicosimentro_medidor_de_glicose_modelo_g_425_3_marca_bioland', '3004908', 'Monitor de Glicose Bioland G425-3', 'Monitor de Glicose Bioland G425-3', 'Código Referência: 3004908
Marca/Fabricante: BIOLAND
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 70.0, 45.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36244510/G/12.jpg', 0, 0, 1),
(47, 8, 29, 'Kit Cilindro de Alumínio 5 litros para Oxigênio com Válvula, Fluxômetro, umidificador e Carrinho para transporte (Acompanha máscara de alta concentração de oxigênio e cateter).', 'kit_cilindro_de_aluminio_5_litros_para_oxigenio_com_valvula_fluxometro_umidifica', '8545622', 'Kit Cilindro de Alumínio 5 para Oxigênio', 'Kit Cilindro de Alumínio 5 para Oxigênio', 'Código Referência: 8545622
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2645.0, 2300.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/27912289/G/20210225_150930.jpg', 0, 0, 1),
(48, 1, 18, 'SENSOR DE FLUXO INFANTIL GRAVADO TAKAOKA', 'sensor_de_fluxo_infantil_gravado_takaoka', '8799024', 'SENSOR DE FLUXO INFANTIL GRAVADO TAKAOKA', 'SENSOR DE FLUXO INFANTIL GRAVADO TAKAOKA', 'Código Referência: 8799024
Marca/Fabricante: TAKAOKA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 380.0, 320.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35049092/G/inf_.jpg', 0, 0, 1),
(49, 5, 35, 'BERÇO AQUECIDO MODELO NEOSOLUTION', 'berco_aquecido_modelo_neosolution', '9248559', 'BERÇO AQUECIDO MODELO NEOSOLUTION', 'BERÇO AQUECIDO MODELO NEOSOLUTION', 'Código Referência: 9248559
Marca/Fabricante: BLENTA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2875.0, 2500.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31060438/G/berco_aquecido_leito_com_acessorios.jpg', 0, 1, 1),
(50, 1, 36, 'LAVADORA EXTRATORA FIXA COM BARREIRA', 'lavadora_extratora_fixa_com_barreira', '2209574', 'LAVADORA DE ROUPA  EXTRATORA FIXA COM BARREIRA LEH-60FA - 62 KG', 'LAVADORA DE ROUPA  EXTRATORA FIXA COM BARREIRA LEH-60FA - 62 KG', 'Código Referência: 2209574
Marca/Fabricante: MAMUTE
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/34156280/G/439804d3_55b2_4f20_80b6_d977b08f6f2c.png', 0, 0, 1),
(51, 6, 37, 'CABO PACIENTE 5 VIAS PARA ECG', 'cabo_paciente_5_vias_para_ecg_', '3010365', 'CABO PACIENTE 5 VIAS PARA ELETROCARDIOGRAFO (ECG )', 'CABO PACIENTE 5 VIAS PARA ELETROCARDIOGRAFO (ECG )', 'Código Referência: 3010365
Marca/Fabricante: MEDMAX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 688.82, 480.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/13887756/G/wp_20160708_16_57_41_pro.jpg', 0, 0, 1),
(52, 1, 38, 'Linha de amostragem Traqueal adulto para capnografia Instramed Inmax', 'linha_de_amostragem_traqueal_adulto_para_capnografia_instramed_inmax', '3237216', 'Linha de amostra infantil para capnografia Instrame Inmax', 'Linha de amostra infantil para capnografia Instrame Inmax', 'Código Referência: 3237216
Marca/Fabricante: INSTRAMED
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 350.0, 320.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/9812133/G/sensor_larana.jpg', 0, 0, 1),
(53, 1, 4, 'TRAQUEIA 1,20 SILICONIZADA INFANTIL COM BOCAL 15MM', 'traqueia_120_siliconizada_infantil_com_bocal_15mm', '2586134', 'TRAQUEIA INFANTIL SILICONIZADA 1,20', 'TRAQUEIA INFANTIL SILICONIZADA 1,20', 'Código Referência: 2586134
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 520.0, 120.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/6130366/G/traqueia_um_metro_e_meio_siliconizada_unitec.jpg', 0, 0, 1),
(54, 1, 21, 'Sensor de Oximetria adulto Para Monitor Dixtal', 'sensor_de_oximetria_neo_para_monitor_dixtal', '6485042', 'Sensor de Oximetria Adulto Para Monitor Dixtal', 'Sensor de Oximetria Adulto Para Monitor Dixtal', 'Código Referência: 6485042
Marca/Fabricante: DIXTAL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 483.0, 420.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19662697/G/dixtal.jpg', 0, 0, 1),
(55, 1, 26, 'TUBO DE SILICONE  203 (10,0 x 6,0 MM)', 'tubo_de_silicone_203_100_x_60_mm', '3006243', 'TUBO DE SILICONE – COD. 203 (10,0 x 6,0 MM) 1 MTRO', 'TUBO DE SILICONE – COD. 203 (10,0 x 6,0 MM) 1 MTRO', 'Código Referência: 3006243
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 34.5, 30.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8386065/G/tubo_de_silicone.jpg', 0, 1, 1),
(56, 2, 39, 'CORREIA DENTADA P/ SELADORA SA800/FR900 - 410X5X4MM', 'correia_dentada_p_seladora_sa800fr900_410x5x4mm', '6914692', 'CORREIA DENTADA P/ SELADORA SA800/FR900 - 410X5X4MM', 'CORREIA DENTADA P/ SELADORA SA800/FR900 - 410X5X4MM', 'Código Referência: 6914692
Marca/Fabricante: BRASMEDICAL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/21296139/G/p_20190709_104034.jpg', 0, 0, 1),
(57, 1, 22, 'OXIMETRO DE PULSO PORTÁTIL – HANDY SAT TCR', 'oximetro_de_pulso_portatilhandy_sat_tcr', '4418360', 'Certificado do Teste do Coraçãozinho - Ao finalizar o Teste do Coraçãozinho, é possível emitir um certificado contendo o resultado do exame, além da foto do recém-nascido. O docume...', 'Certificado do Teste do Coraçãozinho - Ao finalizar o Teste do Coraçãozinho, é possível emitir um certificado contendo o resultado do exame, além da foto do recém-nascido. O documento pode incluir informações como nome do bebê, data de nascimento, sexo, nome da mãe, número do prontuário hospitalar,', 'Código Referência: 4418360
Marca/Fabricante: RD MEDIQ M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5750.0, 5000.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36233254/G/poxi0112_01.webp', 0, 0, 1),
(58, 1, 4, 'Concentrador de Oxigênio com Nebulização Mercury 5LPM', 'concentrador_de_oxigenio_com_nebulizacao_mercury_5lpm', '7219556', 'O Concentrador de Oxigênio com Nebulização Mercury 5LPM  é ideal para quem busca o melhor custo benefício e qualidade de vida, o Mercury é uma solução de alta tecnologia e precisão...', 'O Concentrador de Oxigênio com Nebulização Mercury 5LPM  é ideal para quem busca o melhor custo benefício e qualidade de vida, o Mercury é uma solução de alta tecnologia e precisão que oferece o melhor desempenho em concentrador de oxigênio medicinal', 'Código Referência: 7219556
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5462.5, 4750.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/34844650/G/concentador_mercury_lumiar.jpg', 0, 0, 1),
(59, 1, 5, 'Reanimador Manual de Silicone MD com Reservatório Neonatal', 'reanimador_manual_de_silicone_md_com_reservatorio_neonatal_', '5200873', 'Reanimador Manual de Silicone MD com Reservatório Neonatal HS83111I-0U', 'Reanimador Manual de Silicone MD com Reservatório Neonatal HS83111I-0U', 'Código Referência: 5200873
Marca/Fabricante: NORTE MÉDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17124039/G/reanimador_manual_neonatal_1_g.jpg', 0, 0, 1),
(60, 6, 40, 'PAPEL TERMOSSENSÍVEL PARA ECG  80 MM  X 30 Metro', 'papel_termossensivel_para_ecg_80_mm_x_30_metro_', '6546760', 'PAPEL TERMOSSENSÍVEL PARA ECG  80 MM  X 30 Metro', 'PAPEL TERMOSSENSÍVEL PARA ECG  80 MM  X 30 Metro', 'Código Referência: 6546760
Marca/Fabricante: BIC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 40.0, 19.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19925801/G/58x30.jpg', 0, 0, 1),
(61, 1, 41, 'TOMADA PARA BISTURI 3 PINOS TB 3G (TRIPOLAR)', 'tomada_para_bisturi_3_pinos_tb_3g_tripolar', '4716093', 'TOMADA PARA BISTURI 3 PINOS TB 3G', 'TOMADA PARA BISTURI 3 PINOS TB 3G', 'Código Referência: 4716093
Marca/Fabricante: BBS COMPONENTES ELETRONICOS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 63.25, 55.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15402191/G/tb3g_g.gif', 0, 1, 1),
(62, 8, 29, 'BICO DE SAÍDA OXIGÊNIO', 'bico_de_saida_oxigenio', '8845948', 'BICO DE SAÍDA OXIGÊNIO', 'BICO DE SAÍDA OXIGÊNIO', 'Código Referência: 8845948
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 500.0, 39.9, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/29329471/G/bico_o2_1.jpg', 0, 0, 1),
(63, 1, 42, 'SENSOR PARA OXIMETRO DE PULSO ADULTO', 'sensor_para_oximetro_de_pulso_adulto_', '4260507', 'SENSOR PARA OXIMETRIA ADULTO', 'SENSOR PARA OXIMETRIA ADULTO', 'Código Referência: 4260507
Marca/Fabricante: RDMEDIQ
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 688.82, 500.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/13862555/G/wp_20160704_16_33_58_pro.jpg', 0, 0, 1),
(64, 9, 23, 'MEMBRANA PARA OSMOSE REVERSA 15 A  20 LTS/H', 'membrana_para_osmose_reversa_15_a_20_ltsh_', '5169795', 'MEMBRANA PARA OSMOSE REVERSA 2012- 100GPD  20 LTS/H', 'MEMBRANA PARA OSMOSE REVERSA 2012- 100GPD  20 LTS/H', 'Código Referência: 5169795
Marca/Fabricante: ICOS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5200.0, 190.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/16979588/G/mambra_20_l_h.jpg', 0, 0, 1),
(65, 8, 29, 'ASPIRADOR VENTURI P/ REDE DE OXIGÊNIO FRASCO DE VIDRO 500ML', 'aspirador_venturi_p_rede_de_oxigenio_frasco_de_vidro_500ml', '8127674', 'Aspirador Venturi oxigênio PROTEC (Frasco em Vidro)', 'Aspirador Venturi oxigênio PROTEC (Frasco em Vidro)', 'Código Referência: 8127674
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 500.0, 90.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25966623/G/rwr_gasoterapia_aspirador_de_secrecao_1.jpg', 0, 0, 1),
(66, 1, 43, 'Lavadora Ultrassônica BR 5 LC', 'lavadora_ultrassonica_br_5_lc', '2167086', 'LAVADORA ULTRA-SÔNICA PARA INSTRUMENTOS CIRÚRGICOS E CANULADOS  EM CME ESPECIAL PARA OFTAMO', 'LAVADORA ULTRA-SÔNICA PARA INSTRUMENTOS CIRÚRGICOS E CANULADOS  EM CME ESPECIAL PARA OFTAMO', 'Código Referência: 2167086
Marca/Fabricante: KACIL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 575.0, 500.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/18988743/G/zoom_lavadora_br_5_lc_.png', 0, 0, 1),
(67, 10, 4, 'Cama Fowler Manual com Elevação', 'cama_fowler_manual_com_elevacao', '10366499', 'Cama Fowler Manual com Elevação', 'Cama Fowler Manual com Elevação', 'Código Referência: 10366499
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 690.0, 600.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36307128/G/a6515f3f_a019_4a2b_ac7f_42ea26fbc4d4_1.jpg', 0, 1, 1),
(68, 1, 5, 'CPAP - Equipamento tipo CPAP', 'cpap_equipamento_tipo_cpap_', '8793376', 'Equipamento tipo CPAP SleepLive LT é uma solução avançada para o tratamento da apneia obstrutiva do sono', 'Equipamento tipo CPAP SleepLive LT é uma solução avançada para o tratamento da apneia obstrutiva do sono', 'Código Referência: 8793376
Marca/Fabricante: NORTE MÉDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 4945.0, 4300.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35425171/G/cpap_sleeplive_lt___01.png', 0, 0, 1),
(69, 1, 44, 'SERRA ELÉTRICA PARA CORTAR GESSO', 'serra_eletrica_para_cortar_gesso', '6736710', 'SERRA ELÉTRICA PARA CORTAR GESSO', 'SERRA ELÉTRICA PARA CORTAR GESSO', 'Código Referência: 6736710
Marca/Fabricante: EPEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2909.5, 2530.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/33888681/G/serra_eletrica_110v.jpg', 0, 0, 1),
(70, 1, 45, 'SENSOR OXÍMETRO PULSO ADULTO 9 PINOS  3MTS', 'sensor_oximetro_pulso_adulto_9_pinos_3mts', '4784649', 'SENSOR OXÍMETRO PULSO ADULTO 9 PINOS TIPO BCI  CB 3MTS', 'SENSOR OXÍMETRO PULSO ADULTO 9 PINOS TIPO BCI  CB 3MTS', 'Código Referência: 4784649
Marca/Fabricante: 3M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 569.25, 495.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15644260/G/sensor.jpg', 0, 0, 1),
(71, 10, 4, 'Cama Elétrica Suíte Master', 'cama_eletrica_suite_master', '8795726', 'Cama Elétrica Suíte Master', 'Cama Elétrica Suíte Master', 'Código Referência: 8795726
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 690.0, 600.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36307154/G/79f35166_d6fc_48af_b9c7_44125be4cd14.png', 0, 0, 1),
(72, 5, 4, 'PRANCHA DE TRANSFERÊNCIA DE PACIENTES', 'prancha_de_transferencia_de_pacientes', '2181157', 'PRANCHA DE TRANSFERÊNCIA DE PACIENTES EASYTRANSFER®', 'PRANCHA DE TRANSFERÊNCIA DE PACIENTES EASYTRANSFER®', 'Código Referência: 2181157
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2875.0, 2500.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36368257/G/easytransfer_home.png', 0, 0, 1),
(73, 1, 4, 'Linha de amostragem de gases GLOBALTEC', 'linha_de_amostragem_de_gases_globaltec', '6585170', 'Linha de amostragem de gases Globaltec adulto', 'Linha de amostragem de gases Globaltec adulto', 'Código Referência: 6585170
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 350.0, 190.89, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/20102911/G/linha_de_amosragem.png', 0, 1, 1),
(74, 1, 4, 'TRAQUEIA EM SILICONE 2000MM X COM BOCAL 22MM P/ VENTILADOR MECÂNICO E CARRINHO DE ANESTESIA', 'traqueia_em_silicone_2000mm_x_com_bocal_22mm_p_ventilador_mecanico_e_carrinho_de', '6859052', 'TRAQUEIA EM SILICONE 2000MM X COM BOCAL 22MM P/ VENTILADOR MECÂNICO E CARRINHO DE ANESTESIA', 'TRAQUEIA EM SILICONE 2000MM X COM BOCAL 22MM P/ VENTILADOR MECÂNICO E CARRINHO DE ANESTESIA', 'Código Referência: 6859052
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 287.5, 250.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/21150171/G/traqueia_1_2o_com_bocal.jpg', 0, 0, 1),
(75, 2, 4, 'GUARNIÇÃO SILICONE P/ PORTA DA  AUTOCLAVE AHMC3  60 SHORE', 'guarnicao_silicone_p_porta_da_autoclave_ahmc3_60_shore', '8809716', 'GUARNIÇÃO DE SILICONE PARA PORTA DE AUTOCLAVE', 'GUARNIÇÃO DE SILICONE PARA PORTA DE AUTOCLAVE', 'Código Referência: 8809716
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 250.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36031406/G/5.jpg', 0, 0, 1),
(76, 9, 28, 'FILTRO (CARTUCHO)  CARVÃO ATIVADO  P ÁGUA 10', 'filtro_cartucho_carvao_ativado_p_agua_10x_212_5_micrasosmose_reserva', '5061630', 'COCARTUCHO FILTRO (CARTUCHO)  CARVÃO P ÁGUA 10', 'COCARTUCHO FILTRO (CARTUCHO)  CARVÃO P ÁGUA 10', 'Código Referência: 5061630
Marca/Fabricante: BBI
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5200.0, 850.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/16495211/G/cartucho_carvao.jpeg', 0, 0, 1),
(77, 1, 46, 'CENTRÍFUGA MACRO P 28 TUBS DE 10 A 15ML  -  MODHCL-4', 'centrifuga_macro_p_28_tubs_de_10_a_15ml_modhcl_4', '2181053', 'CENTRÍFUGA MICROPROCESSADA CLÍNICA 28 TBS 12 e 15ML', 'CENTRÍFUGA MICROPROCESSADA CLÍNICA 28 TBS 12 e 15ML', 'Código Referência: 2181053
Marca/Fabricante: CENTRILAB
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 11500.0, 10000.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/28327406/G/centrifuga.jpg', 0, 0, 1),
(78, 1, 4, 'SENSOR DE TEMPERATURA 3 FIOS PT 100  3/4\'', 'sensor_de_temperatura_3_fios_pt_100_34', '2181172', 'SENSOR TEMPERATURA PT 100 3 FIAOS 3/4', 'SENSOR TEMPERATURA PT 100 3 FIAOS 3/4', 'Código Referência: 2181172
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31785474/G/img_20220606_170811.jpg', 0, 0, 1),
(79, 1, 47, 'SENSOR DE OXIMETRIA MINDRAY ADULTO', 'sensor_de_oximetria_mindray_adulto', '6377058', 'SENSOR DE OXIMETRIA MINDRAY ADULTO', 'SENSOR DE OXIMETRIA MINDRAY ADULTO', 'Código Referência: 6377058
Marca/Fabricante: MINDRAY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 517.5, 450.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19184060/G/sensor_imec10_e295.jpg', 0, 1, 1),
(80, 1, 25, 'COMPRESSOR ISENTO DE ÓLEO  - RESERVATÓRIO  DE AR 35 LITROS', 'compressor_isento_de_oleo_reservatorio_de_ar_35_litros_', '6378052', 'Compressor de Ar CPSD7040 - 2 possui motor elétrico com 1,2 HP de potência, um reservatório de ar de 35 litros, que alcança pressão de operação máxima de 116 lbf/pol².  • Silencios...', 'Compressor de Ar CPSD7040 - 2 possui motor elétrico com 1,2 HP de potência, um reservatório de ar de 35 litros, que alcança pressão de operação máxima de 116 lbf/pol².  • Silencioso • Pressostato com acionamento automático • Motor isento de óleo', 'Código Referência: 6378052
Marca/Fabricante: TEKNA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2875.0, 2500.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35181764/G/cpsd7040_2.jpg', 0, 0, 1),
(81, 1, 9, 'TRAQUEIA EM SILICONE 1500MM X COM BOCAL 22MM P/ VENTILADOR MECÂNICO E CARRINHO DE ANESTESIA', 'traqueia_em_silicone_1500mm_x_com_bocal_22mm_p_ventilador_mecanico_e_carrinho_de', '5552999', 'TRAQUEIA EM SILICONE 1500MM X COM BOCAL 22MM P/ VENTILADOR MECÂNICO E CARRINHO DE ANESTESIA', 'TRAQUEIA EM SILICONE 1500MM X COM BOCAL 22MM P/ VENTILADOR MECÂNICO E CARRINHO DE ANESTESIA', 'Código Referência: 5552999
Marca/Fabricante: MJV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 168.8, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/21149862/G/traqueia_1_2o_com_bocal.jpg', 0, 0, 1),
(82, 1, 48, 'APARELHO DE PRESSÃO ARTERIAL  ANERÓIDE ADULTO', 'aparelho_de_pressao_arterial_aneroide_adulto_', '6445162', 'ESFIGMOMANÔMETRO  - MEDIDOR  PRESSÃO ARTERIAL  ANERÓIDE ADULTO -  DURASHOCK FLEXPORT ADULTO   – WELCH ALLYN', 'ESFIGMOMANÔMETRO  - MEDIDOR  PRESSÃO ARTERIAL  ANERÓIDE ADULTO -  DURASHOCK FLEXPORT ADULTO   – WELCH ALLYN', 'Código Referência: 6445162
Marca/Fabricante: APK TECHNOLOGY CO
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 747.5, 650.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19489358/G/ds442.png', 0, 0, 1),
(83, 1, 29, 'MÁSCARA EM SILICONE PARA ANESTESIA n 4', 'mascara_em_silicone_para_anestesia_n_4', '9332588', 'MÁSCARA EM SILICONE PARA NVI/ ANESTESIA/ CPAP ( PREÇO PARA OS TAMANHOS 4 OU 5)', 'MÁSCARA EM SILICONE PARA NVI/ ANESTESIA/ CPAP ( PREÇO PARA OS TAMANHOS 4 OU 5)', 'Código Referência: 9332588
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 200.0, 88.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31356010/G/mascara_vni_silicone_.jpg', 0, 0, 1),
(84, 1, 49, 'ASPIRADOR CIRURGICO ELETRICO ISENTO DE OLEO 220V', 'aspirador_cirurgico_eletrico_isento_de_oleo_220v_', '3774724', 'ASPIRADOR CIRURGICO ELETRICO ISENTO DE OLEO 220V', 'ASPIRADOR CIRURGICO ELETRICO ISENTO DE OLEO 220V', 'Código Referência: 3774724
Marca/Fabricante: ASPIRAMAX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 9199.99, 7999.99, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/12286435/G/aspirador_1.jpg', 0, 0, 1),
(85, 1, 3, 'Correia sincronizadora Syncroflex T 2,5/380', 'correia_sincronizadora_syncroflex_t_25380_', '3365803', 'Correias Syncroflex T 2,5 / 380', 'Correias Syncroflex T 2,5 / 380', 'Código Referência: 3365803
Marca/Fabricante: MHL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1024.0, 960.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/10559618/G/correira.jpg', 0, 1, 1),
(86, 2, 50, 'GUARNIÇÃO 14 X 19 MM EM SILICONE PARA VEDAÇÕES DE PORTAS DE AUTOCLAVES 432LITROS', 'guarnicao_14_x_19_mm_em_silicone_para_vedacoes_de_portas_de_autoclaves_432litros', '3006280', 'GUARNIÇÃO 11 X 14 MM EM SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVES', 'GUARNIÇÃO 11 X 14 MM EM SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVES', 'Código Referência: 3006280
Marca/Fabricante: MJV - GUARNIO 1400 X 1500 VERM
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 655.5, 570.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17157087/G/132609534.jpg', 0, 0, 1),
(87, 1, 5, 'DETECTOR FETAL Doppler Portátil Digital FD-200B MD®', 'detector_fetal_doppler_portatil_digital_fd_200b_md', '3496195', 'Doppler Fetal Portátil Digital FD-200B MD®', 'Doppler Fetal Portátil Digital FD-200B MD®', 'Código Referência: 3496195
Marca/Fabricante: NORTE MÉDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1024.0, 780.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/11304230/G/timthumb_2_1.jpg', 0, 0, 1),
(88, 1, 26, 'TUBO DE SILICONE 204 (12,0 x 6,0 MM) 1 MTRO', 'tubo_de_silicone_204_120_x_60_mm_1_mtro', '3006263', 'TUBO DE SILICONE – COD. 204 (12,0 x 6,0 MM) 1 MTRO', 'TUBO DE SILICONE – COD. 204 (12,0 x 6,0 MM) 1 MTRO', 'Código Referência: 3006263
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 46.0, 40.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8385966/G/tubo_de_silicone.jpg', 0, 0, 1),
(89, 7, 47, 'DEA Mindray BeneHeart C1A – Desfibrilador Externo Automático', 'dea_mindray_beneheart_c1adesfibrilador_externo_automatico', '10828131', 'DEA Mindray BeneHeart C1A – Desfibrilador Externo Automático', 'DEA Mindray BeneHeart C1A – Desfibrilador Externo Automático', 'Código Referência: 10828131
Marca/Fabricante: MINDRAY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 38000.0, 9000.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36224774/G/dea_____c1a__aberto.jpg', 0, 0, 1),
(90, 2, 50, 'GUARNIÇÃO 11 X 14 MM EM SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVE 364 LTROS', 'guarnicao_11_x_14_mm_em_silicone_p_vedacao_de_porta_de_autoclave_364_ltros', '3006341', 'GUARNIÇÃO 11 X 14 MM EM SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVES', 'GUARNIÇÃO 11 X 14 MM EM SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVES', 'Código Referência: 3006341
Marca/Fabricante: MJV - GUARNIO 1400 X 1500 VERM
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1200.0, 325.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17157068/G/132609534.jpg', 0, 0, 1),
(91, 1, 51, 'Bobina de Papel Grau Cirúrgico 25CM X 100 METROS', 'bobina_de_papel_grau_cirurgico_25cm_x_100_metros_', '2590202', 'Bobina de Papel Grau Cirúrgico  termosselante para embalagem esterilização', 'Bobina de Papel Grau Cirúrgico  termosselante para embalagem esterilização', 'Código Referência: 2590202
Marca/Fabricante: CLEAN UP
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 184.0, 160.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/32590751/G/bowie_e_dick_3.webp', 0, 1, 1),
(92, 1, 14, 'PLACA AÇO INOX FLEXÍVEL INFANTIL', 'placa_ao_inox_flexvel_adulto_pn01_210x150mm_', '4716061', 'PLACA AÇO INOX FLEXÍVEL P BISTURI INFANTIL', 'PLACA AÇO INOX FLEXÍVEL P BISTURI INFANTIL', 'Código Referência: 4716061
Marca/Fabricante: DELTRONIX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 312.98, 272.16, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15402071/G/pn01.jpg', 0, 0, 1),
(93, 1, 52, 'BRAÇADEIRA COM MANGUITO 1 E 2 VIA P/ PANI ADULTO/PEDIATRICO/NEO', 'bracadeira_com_manguito_1_e_2_via_p_pani_adultopediatriconeo', '4266572', 'Braçadeira com Manguito1 vias para Munitor de  PNI  Adulto Pediátrico ou Neonatal', 'Braçadeira com Manguito1 vias para Munitor de  PNI  Adulto Pediátrico ou Neonatal', 'Código Referência: 4266572
Marca/Fabricante: DIVISO LATEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 371.0, 120.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/13887544/G/wp_20160708_16_37_26_pro.jpg', 0, 0, 1),
(94, 1, 53, 'LAMPADA 5.8V - 6.38W - 157 - 1.10A E10 - GE', 'lampada_58v_638w_157_110a_e10_ge', '9723110', 'Lâmpada Para Fotóforo Missouri Ge157 - GE', 'Lâmpada Para Fotóforo Missouri Ge157 - GE', 'Código Referência: 9723110
Marca/Fabricante: PHILIPS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 92.0, 80.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/33192492/G/1o.webp', 0, 0, 1),
(95, 1, 4, 'BICO DE SAÍDA AR COMPRIMIDO', 'bico_de_saida_ar_comprimido', '8845942', 'BICO DE SAÍDA AR COMPRIMIDO', 'BICO DE SAÍDA AR COMPRIMIDO', 'Código Referência: 8845942
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 45.88, 39.9, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/29329425/G/bico_ar_1.jpg', 0, 0, 1),
(96, 8, 29, 'FLUXÔMETRO OXIGÊNIO 0 A 30 L/MIN', 'fluxometro_oxigenio_0_a_30_lmin', '8845895', 'FLUXÔMETRO OXIGÊNIO 0 A 30 L/MIN', 'FLUXÔMETRO OXIGÊNIO 0 A 30 L/MIN', 'Código Referência: 8845895
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 500.0, 129.9, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/29329224/G/fluxometro_0_30_lpm_femea_o2_004050_600x600.jpg', 0, 0, 1),
(97, 5, 54, 'RADIÔMETRO MODELO GRN', 'radiometro_modelo_grn', '2166942', 'RADIÔMETRO MODELO GRN', 'RADIÔMETRO MODELO GRN', 'Código Referência: 2166942
Marca/Fabricante: MAGNAMED
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31060896/G/radiometro.jpg', 0, 1, 1),
(98, 1, 14, 'TOMADA PARA BISTURI 2 PINOS TB 2P (BIPOLAR)', 'tomada_para_bisturi_2_pinos_tb_2p_bipolar', '4716086', 'TOMADA PARA BISTURI 2 PINOS TB 2P', 'TOMADA PARA BISTURI 2 PINOS TB 2P', 'Código Referência: 4716086
Marca/Fabricante: DELTRONIX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 55.2, 48.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15402176/G/tb2p_g.gif', 0, 0, 1),
(99, 1, 9, 'CIRCUITO VENTILATORIO PACIENTE ADULTO 1200MM x 22MM  UNIVERSAL REUTILIZÁVEL', 'circuito_ventilatorio_paciente_adulto_1200mm_x_22mm_universal_reutilizavel', '2586830', 'CIRCUITO VENTILATORIO PACIENTE ADULTO 1200MM x 22MM  UNIVERSAL REUTILIZÁVEL', 'CIRCUITO VENTILATORIO PACIENTE ADULTO 1200MM x 22MM  UNIVERSAL REUTILIZÁVEL', 'Código Referência: 2586830
Marca/Fabricante: MJV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 399.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25474650/G/1.jpg', 0, 0, 1),
(100, 1, 55, 'SECADORES INDUSTRIAIS e HOSPITALAR', 'secadores_industriais_e_hospitalar_', '3619837', 'Secador Automático 60 kg - Aquecimento Elétrico', 'Secador Automático 60 kg - Aquecimento Elétrico', 'Código Referência: 3619837
Marca/Fabricante: LAVANDERIA HOSPITALAR
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/34173984/G/secadora_mamute.png', 0, 0, 1),
(101, 1, 4, 'PAPEL TERMOSSENSÍVEL PARA ECG  216MM  X 30 Metro (BOBINA )', 'papel_termossensivel_para_ecg_216mm_x_30_metro_bobina_', '4797393', 'PAPEL TERMOSSENSÍVEL PARA ECG TITB 216 X 30 LT (UNIDADE BOBINA)', 'PAPEL TERMOSSENSÍVEL PARA ECG TITB 216 X 30 LT (UNIDADE BOBINA)', 'Código Referência: 4797393
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 41.39, 35.99, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15700516/G/papel_ecg.jpg', 0, 0, 1),
(102, 1, 6, 'CANETA AUTOCLAVAVEL CMD 110S COMANDO MANUAL', 'caneta_autoclavavel_cmd_110s_comando_manual_', '5063001', 'CANETA P/ BISTURI ELÉTRICO COMANDO MANUAL - AUTOCLAVÁVEL', 'CANETA P/ BISTURI ELÉTRICO COMANDO MANUAL - AUTOCLAVÁVEL', 'Código Referência: 5063001
Marca/Fabricante: EMAIL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 557.63, 484.9, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/32459273/G/caneta_cmd.webp', 0, 0, 1),
(103, 11, 56, 'Mini Otoscópio Fibra óptica - Omni 3000', 'mini_otoscopio_fibra_optica_omni_3000', '3017604', 'Mini Otoscópio Fibra óptica - Omni 3000', 'Mini Otoscópio Fibra óptica - Omni 3000', 'Código Referência: 3017604
Marca/Fabricante: RIESTER
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8457245/G/otoscopio1_thumb.jpg', 0, 1, 1),
(104, 2, 57, 'Guarnição para Porta de Autoclave  -  ( PREÇO POR METRO )', 'guarnicao_para_porta_de_autoclavepreco_por_metro_', '7994945', 'GUARNIÇÃO DE SILICONE 14,00 X 15,00 VERMELHA P/ ORTOSSINTESE', 'GUARNIÇÃO DE SILICONE 14,00 X 15,00 VERMELHA P/ ORTOSSINTESE', 'Código Referência: 7994945
Marca/Fabricante: LINHA AUTOCLAVE HS 364L
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1200.0, 150.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25388037/G/guarnicao_4.jpg', 0, 0, 1),
(105, 8, 29, 'FLUXÔMETRO AR COMPRIMIDO 0 A 30 L/MIN', 'fluxometro_ar_comprimido_0_a_30_lmin', '8845891', 'FLUXÔMETRO AR COMPRIMIDO 0 A 30 L/MIN', 'FLUXÔMETRO AR COMPRIMIDO 0 A 30 L/MIN', 'Código Referência: 8845891
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2999.9, 129.9, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/29329188/G/fluxometro_0_30_lpm_femea_ar_004054_600x600.jpg', 0, 0, 1),
(106, 6, 58, 'BOBINA DE PAPE  PARA ELETROCARDIÓGRAFO  110 MM  X 30 Metro (BOBINA )', 'bobina_de_pape_para_eletrocardiografo_110_mm_x_30_metro_bobina_', '6546747', 'PAPEL TERMOSSENSÍVEL PARA ELETROCARDIOGRAFO ( ECG)', 'PAPEL TERMOSSENSÍVEL PARA ELETROCARDIOGRAFO ( ECG)', 'Código Referência: 6546747
Marca/Fabricante: RESPIRATORY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 34.5, 30.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19925733/G/produto_01.jpg', 0, 0, 1),
(107, 1, 9, 'BALÃO DE SILICONE 2 LITROS  - BOLSA RESPIRATORIA', 'balao_de_silicone_2_litros_bolsa_respiratoria', '4558376', 'BALÃO DE SILICONE 2 LITROS  - BOLSA RESPIRATORIA', 'BALÃO DE SILICONE 2 LITROS  - BOLSA RESPIRATORIA', 'Código Referência: 4558376
Marca/Fabricante: MJV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 274.85, 239.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/14800473/G/balao_silicone_hospitalar_01.jpg', 0, 0, 1),
(108, 1, 38, 'BARAKA 2L COM TRAQUEIA DE SILICONE', 'baraka_2l_com_traqueia_de_silicone', '2586127', 'BARAKA 2 LITROS OXIGEL', 'BARAKA 2 LITROS OXIGEL', 'Código Referência: 2586127
Marca/Fabricante: INSTRAMED
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5200.0, 237.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/6130312/G/baraka_de_2_l.jpg', 0, 0, 1),
(109, 9, 59, 'Sensor de Nível LA26M-40 - Sensor de Nível de Produtos Químicos', 'sensor_de_nivel_la26m_40_sensor_de_nivel_de_produtos_quimicos', '3010317', 'Sensor de Nível LA26M-40 - Sensor de Nível de Produtos Químicos', 'Sensor de Nível LA26M-40 - Sensor de Nível de Produtos Químicos', 'Código Referência: 3010317
Marca/Fabricante: EROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 390.0, 155.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8408660/G/chave_de_nivel_icos_la26m40.jpg', 0, 1, 1),
(110, 7, 47, 'CARDIOVERSOR E DESFIBRILADOR 4 em 1 CARDIOPRO BÁSICO', 'cardioversor_e_desfibrilador_4_em_1_cardiopro_basico', '2167726', 'Cardioversor/Desfibrilador Básico com Monitorização de ECG, DEA (Desfibrilador Externo Automático), Marcapasso Transcutâneo e Impressora Integrada.', 'Cardioversor/Desfibrilador Básico com Monitorização de ECG, DEA (Desfibrilador Externo Automático), Marcapasso Transcutâneo e Impressora Integrada.', 'Código Referência: 2167726
Marca/Fabricante: MINDRAY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 36800.0, 32000.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36233029/G/cardioversor_bifasico.jpg', 0, 0, 1),
(111, 6, 60, 'ELETROCARDIÓGRAFO ECG1200G – 12 CANAIS', 'eletrocardiografo_ecg1200g12_canais', '6914770', 'ELETROCARDIÓGRAFO ECG1200G – 12 CANAIS', 'ELETROCARDIÓGRAFO ECG1200G – 12 CANAIS', 'Código Referência: 6914770
Marca/Fabricante: MEDMAX GLOBALTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 10350.0, 9000.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36254854/G/1_1024x1024.png', 0, 0, 1),
(112, 12, 61, 'KIT INSTRUMENTAIL  CIRURG. P/CASTRAÇÃO COM 19 PEÇAS', 'kit_instrumentail_cirurg_pcastracao_com_19_pecas', '2167834', 'KIT INSTRUMENTAL P/CASTRAÇÃO COM 19 PEÇAS', 'KIT INSTRUMENTAL P/CASTRAÇÃO COM 19 PEÇAS', 'Código Referência: 2167834
Marca/Fabricante: ERWIN GUTH
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1002.31, 871.57, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31546792/G/kit_para_castracao.jpeg', 0, 0, 1),
(113, 2, 12, 'GUARNIÇÃO SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVE SERCON 2640MM P/ PORTA 660 X 660 PARA 523 A 724 LITROS', 'guarniosiliconepvedaodeportadeautoclavesercon2640mmpporta660x660para523a724litro', '10755212', 'GUARNIÇÃO VULCANIZADA 2640MM P/ PORTA 660 X 660 PARA 523 A 724 LITROS', 'GUARNIÇÃO VULCANIZADA 2640MM P/ PORTA 660 X 660 PARA 523 A 724 LITROS', 'Código Referência: 10755212
Marca/Fabricante: SERCON
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 920.0, 800.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36031397/G/4.jpg', 0, 0, 1),
(114, 1, 45, 'EXTENSÃO PARA PANI ADULTO PEDIÁTRICO 2 VIAS/3MTS', 'extensao_para_pani_adulto_pediatrico_2_vias3mts_', '4738179', 'EXTENSÃO PARA PANI ADULTO PEDIÁTRICO 2 VIAS 3 MTS', 'EXTENSÃO PARA PANI ADULTO PEDIÁTRICO 2 VIAS 3 MTS', 'Código Referência: 4738179
Marca/Fabricante: 3M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 327.75, 285.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15479515/G/pani.jpg', 0, 0, 1),
(115, 1, 62, 'FILTRO  BACTERIOLÓGICO PARA ASPIRADOR CIRÚRGICO  PCT C/ 5 UNIDADE', 'filtro_bacteriologico_para_aspirador_cirurgico_pct_c_5_unidade', '4874576', 'FILTRO  BACTERIOLÓGICO PARA ASPIRADOR CIRÚRGICO - CONEXÃO 8MM  ---- PCT COM 5 UNIDADE', 'FILTRO  BACTERIOLÓGICO PARA ASPIRADOR CIRÚRGICO - CONEXÃO 8MM  ---- PCT COM 5 UNIDADE', 'Código Referência: 4874576
Marca/Fabricante: H2M RUBBER
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15845947/G/filtro.jpg', 0, 1, 1),
(116, 5, 7, 'VENTILADOR MECÂNICO  PULMONAR  PARA U.T.I. -  FLEXIMAG MAX', 'ventilador_mecanico_pulmonar_para_uti_fleximag_max', '3619841', 'Por ser um equipamento completo, o FlexiMag Max vai além nos detalhes, atendendo a todos os tipos de serviços dentro de uma Unidade de Tratamento Intensivo.”', 'Por ser um equipamento completo, o FlexiMag Max vai além nos detalhes, atendendo a todos os tipos de serviços dentro de uma Unidade de Tratamento Intensivo.”', 'Código Referência: 3619841
Marca/Fabricante: GIGANTE RECEM NASCIDO
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/33922054/G/flexmax.png', 0, 0, 1),
(117, 1, 63, 'FILTRO BACTERIOLÓGICO ULPACAP', 'filtro_bacteriologico_ulpacap', '9574816', 'FILTRO BACTERIOLÓGICO ULPACAP', 'FILTRO BACTERIOLÓGICO ULPACAP', 'Código Referência: 9574816
Marca/Fabricante: BFILTERS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5200.0, 1900.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/32505210/G/filtro.webp', 0, 0, 1),
(118, 1, 29, 'BARAKA 1L , TRAQUEIA DE SILICONE', 'baraka_1ltraqueia_de_silicone_', '2586107', 'CIRCUITO ANESTÉSICO / BARAKA 1L INFANTIL', 'CIRCUITO ANESTÉSICO / BARAKA 1L INFANTIL', 'Código Referência: 2586107
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 520.0, 133.39, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/6130146/G/baraka_3_l_traqueia_silicone_adulto.jpg', 0, 0, 1),
(119, 1, 4, 'COLCHÃO PNEUMÁTICO  - SISTEMA DE ALIVIO DE PRESSÃO ALTERNADO 127V', 'colchao_pneumatico_sistema_de_alivio_de_pressao_alternado_127v_', '7292786', 'SISTEMA DE ALÍVIO DE PRESSÃO ALTERNADA', 'SISTEMA DE ALÍVIO DE PRESSÃO ALTERNADA', 'Código Referência: 7292786
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 401.34, 348.99, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25367164/G/986905_colchao_antiescaras_montserrat_mod_pl_7520_c_bomba_de_pressao_alternada_110v_9843_z1_636941335696039738.jpg', 0, 0, 1),
(120, 9, 59, 'MEMBRANA PARA OSMOSE REVERSA 40 A  50 LTS/H', 'membrana_para_osmose_reversa_40_a_50_ltsh', '5169832', 'MEMBRANA PARA OSMOSE REVERSA 3012- 300GPD 45 LTS/H', 'MEMBRANA PARA OSMOSE REVERSA 3012- 300GPD 45 LTS/H', 'Código Referência: 5169832
Marca/Fabricante: EROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 584.2, 508.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/16979762/G/membra.jpg', 0, 0, 1),
(121, 7, 47, 'Gabinete para DEA Desfibrilador Externo Automático – INFUSOMED Multimarcas', 'gabinete_para_dea_desfibrilador_externo_automaticoinfusomed_multimarcas', '3999067', 'Gabinete porta DEA Compativel com DEA de Marcas: INSTRAMED, CMOS DRAKE, PHILPS, ZOLL e outras marcas', 'Gabinete porta DEA Compativel com DEA de Marcas: INSTRAMED, CMOS DRAKE, PHILPS, ZOLL e outras marcas', 'Código Referência: 3999067
Marca/Fabricante: MINDRAY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 12000.0, 2800.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/33284617/G/img_20230222_wa0289.jpg', 0, 1, 1),
(122, 1, 9, 'PRESILHA (FIXADOR CEFÁLICO) EM SILICONE ADULTO  P/ MASCARA VNI - pct com 5 undade', 'presilha_fixador_cefalico_em_silicone_adulto_p_mascara_vni_pct_com_5_undade', '3409320', 'PRESILHA (FIXADOR CEFÁLICO) EM SILICONE ADULTO  P/ MASCARA VNI - pct com 5 undade', 'PRESILHA (FIXADOR CEFÁLICO) EM SILICONE ADULTO  P/ MASCARA VNI - pct com 5 undade', 'Código Referência: 3409320
Marca/Fabricante: MJV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 4800.0, 250.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/10829884/G/presilhasiliconemascara.jpg', 0, 0, 1),
(123, 1, 12, 'NORTEMEDICA COMERCIO E REPRESENTAÇÕES LTDA.', 'estesiometro_', '2593279', 'Produtos e Equipamentos Médicos Hospitalar e Laboratorial e Assistência Técnica', 'Produtos e Equipamentos Médicos Hospitalar e Laboratorial e Assistência Técnica', 'Código Referência: 2593279
Marca/Fabricante: SERCON
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 371.0, 250.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/4498014/G/logo_nova_.jpeg', 0, 0, 1),
(124, 1, 52, 'BRAÇADEIRA 2 VIAS PARA MONITOR DE  PRESSÃO NÃO INVASIVA PNI, ADULTO, PEDIÁTRICO OU NEONATAL', 'bracadeira_2_vias_para_monitor_de_pressao_nao_invasiva_pni_adulto_pediatrico_ou_', '3010394', 'BRAÇADEIRA PARA MONITOR DE  PRESSÃO NÃO INVASIVA PNI ADULTO, PEDIÁTRICO OU NEONATAL', 'BRAÇADEIRA PARA MONITOR DE  PRESSÃO NÃO INVASIVA PNI ADULTO, PEDIÁTRICO OU NEONATAL', 'Código Referência: 3010394
Marca/Fabricante: DIVISO LATEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 371.0, 145.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/13887331/G/wp_20160708_15_51_09_pro.jpg', 0, 0, 1),
(125, 1, 38, 'KIT SENSOR DE FLUXO ADULTO GRAVADO TAKAOKA', 'kit_sensor_de_fluxo_adulto_gravado_takaoka', '8154841', 'KIT SENSOR DE FLUXO ADULTO GRAVADO TAKAOKA', 'KIT SENSOR DE FLUXO ADULTO GRAVADO TAKAOKA', 'Código Referência: 8154841
Marca/Fabricante: INSTRAMED
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 642.85, 559.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/26064579/G/img_20200903_172055411.jpg', 0, 0, 1),
(126, 2, 4, 'Autoclave Clinica modelo Flex 30 Litros', 'autoclave_clinica_modelo_flex_30_litros_', '4797443', 'Autoclave Clinica modelo Flex 30 Litros', 'Autoclave Clinica modelo Flex 30 Litros', 'Código Referência: 4797443
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 11382.93, 9898.2, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35145247/G/11.jpg', 0, 0, 1),
(127, 6, 64, 'CABO PACIENTE 10 VIAS PARA ECG SCHILLER AT1 E EDAN', 'cabo_paciente_10_vias_para_ecg_schiller_at1_e_edan', '4841477', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO (ECG) ,', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO (ECG) ,', 'Código Referência: 4841477
Marca/Fabricante: SCHILLER
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 800.0, 670.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15713411/G/cabo_ecg.jpg', 0, 1, 1),
(128, 1, 65, 'MONITOR MULTIPARAMETRICO DE SINAIS VITAIS   RD12', 'monitor_multiparametrico_de_sinais_vitais_rd12', '2167822', 'MONITOR MULTIPARAMETRICO DE SINAIS VITAIS   RD12 R&D MEDIQ', 'MONITOR MULTIPARAMETRICO DE SINAIS VITAIS   RD12 R&D MEDIQ', 'Código Referência: 2167822
Marca/Fabricante: SOLARIS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 4800.0, 660.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35643254/G/imagem1.jpg', 0, 0, 1),
(129, 1, 1, 'FRASCO PLASTICO 3.250 LITROS COM TAMPA  NEVONI - PARA ASPIRADORES CIRÚRGICOS', 'copiadefrasco_plastico_5_litros_com_tampa_nevoni_para_aspiradores_cirurgicos', '7048525', 'FRASCO EM MATERIAL PLASTICO 3.250 LITROS COM TAMPA - MACRA NEVONI', 'FRASCO EM MATERIAL PLASTICO 3.250 LITROS COM TAMPA - MACRA NEVONI', 'Código Referência: 7048525
Marca/Fabricante: NEVONI
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 310.5, 270.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/21877039/G/aspirador.jpg', 0, 0, 1),
(130, 6, 8, 'ELETRODO CARDIOCLIP IFANTIL PARA ECG C/ 4 UNID', 'eletrodo_cardioclip_ifantil_para_ecg_c_4_unid', '6190267', 'CARDIOCLIP INFANTIL ECG COM 4 UNID', 'CARDIOCLIP INFANTIL ECG COM 4 UNID', 'Código Referência: 6190267
Marca/Fabricante: TECNOPRINT
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 230.0, 200.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/18416632/G/cardioclipe_infantial.jpg', 0, 0, 1),
(131, 6, 19, 'PERA PARA ECG PRECORDIAL INFANTIL (UNIDADE)', 'pera_para_ecg_precordial_infantil_unidade', '4797460', 'PERA PARA ECG PRECORDIAL INFANTIL', 'PERA PARA ECG PRECORDIAL INFANTIL', 'Código Referência: 4797460
Marca/Fabricante: VEPEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 228.85, 199.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15700756/G/pera_ele.jpg', 0, 0, 1),
(132, 1, 9, 'TRAQUEIA EM SILICONE CORRUGADO 1200 MM  COM BOCAL 22MM ADULTO', 'traqueia_em_silicone_corrugado_1200_mm_com_bocal_22mm_adulto', '2586936', 'TRAQUEIA 1,20 COM BOCAL ADULTO PARA ANESTESIA E VM', 'TRAQUEIA 1,20 COM BOCAL ADULTO PARA ANESTESIA E VM', 'Código Referência: 2586936
Marca/Fabricante: MJV
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 145.0, 120.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/6135950/G/traqueia_1_2o_com_bocal.jpg', 0, 0, 1),
(133, 6, 58, 'ELETRODO CARDIOCLIP  ECG ADULTO COM 4 UND.', 'eletrodo_cardioclip_ecg_adulto_com_4_und', '6190241', 'CARDIOCLIP ADULTO C/ 04 UND', 'CARDIOCLIP ADULTO C/ 04 UND', 'Código Referência: 6190241
Marca/Fabricante: RESPIRATORY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 228.85, 199.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/18416487/G/eletrodo_cardioclip.gif', 0, 1, 1),
(134, 13, 66, 'BORRACHA  P/ CRUZETA  MICRO CENTRÍFUGA', 'borracha_p_cruzeta_micro_centrifuga', '3246563', 'GUARNIÇAO P/ MICRO CENTRIFUGA 05MM X 02MM POR COP DE ATE 735MM', 'GUARNIÇAO P/ MICRO CENTRIFUGA 05MM X 02MM POR COP DE ATE 735MM', 'Código Referência: 3246563
Marca/Fabricante: SYNCROFLEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 80.5, 70.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/33182523/G/1673881289973.jpg', 0, 0, 1),
(135, 1, 26, 'TUBO DE SILICONE - COD. 178 (3,18 x 1,90 MM) 1 MTRO', 'tubo_de_silicone_cod_178_318_x_190_mm_1_mtro', '3006332', 'TUBO DE SILICONE - COD. 178 (3,18 x 1,90 MM) 1 MTRO', 'TUBO DE SILICONE - COD. 178 (3,18 x 1,90 MM) 1 MTRO', 'Código Referência: 3006332
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 23.0, 20.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8385817/G/tubo_de_silicone.jpg', 0, 0, 1),
(136, 9, 67, 'PURIFICADOR DE AGUA TRIPLO BRANCO C/ SUPORTE E CHAVE', 'purificador_de_agua_triplo_branco_c_suporte_e_chave', '2181071', 'PURIFICADOR DE AGUA TRIPLO BRANCO C/ SUPORTE E CHAVE', 'PURIFICADOR DE AGUA TRIPLO BRANCO C/ SUPORTE E CHAVE', 'Código Referência: 2181071
Marca/Fabricante: AQUALGICA  LITER
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 977.5, 850.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35110178/G/genn_purificador_tri.jpg.jpg', 0, 0, 1),
(137, 7, 4, 'CARDIOVERSOR E DESFIBRILADOR CardioPRO FULL 4 em 1', 'cardioversor_e_desfibrilador_cardiopro_full_4_em_1_', '3383799', 'MONITOR CARDIOVERSOR E DESFIBRILADOR CardioPRO Full 4 em 1 – Protec', 'MONITOR CARDIOVERSOR E DESFIBRILADOR CardioPRO Full 4 em 1 – Protec', 'Código Referência: 3383799
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 51750.0, 45000.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36352026/G/cardioversor_bifasico.jpg', 0, 0, 1),
(138, 1, 4, 'TUBO DE SILICONE – MED.: 3,16 x 1,80 MM - 1 MTRO', 'tubo_de_siliconemed_316_x_180_mm_1_mtro', '3006306', 'TUBO DE SILICONE – MED.: 3,16 x 1,80 MM - 1 MTRO', 'TUBO DE SILICONE – MED.: 3,16 x 1,80 MM - 1 MTRO', 'Código Referência: 3006306
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 23.0, 20.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8385925/G/tubo_de_silicone.jpg', 0, 0, 1),
(139, 1, 68, 'BOWIE E DICK PACOTE PRONTO 134-137° 3,5 MIN - CX COM 24 PCT', 'bowie_e_dick_pacote_pronto_134_137_35_min_cx_com_24_pct', '9138883', 'BOWIE & DICK TEST - CX  24 COM  PACOTE PRONTO P USO', 'BOWIE & DICK TEST - CX  24 COM  PACOTE PRONTO P USO', 'Código Referência: 9138883
Marca/Fabricante: MULTIMARCA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 414.0, 360.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36312785/G/bowie_dick_pacote_pronto__folhas_s_1.png', 0, 1, 1),
(140, 3, 32, 'CENTRÍFUGA MACRO PARA 12 TUBOS 15 ML', 'centrfuga_macro_para_12_tubos_15_ml', '2181031', 'Centrífuga Centrilab 80-2B-15ml, é um equipamento utilizado em laboratório de analise clinica', 'Centrífuga Centrilab 80-2B-15ml, é um equipamento utilizado em laboratório de analise clinica', 'Código Referência: 2181031
Marca/Fabricante: HOFFMANLAB
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 11500.0, 10000.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/18987749/G/80_b2.jpg', 0, 0, 1),
(141, 1, 26, 'TUBO DE SILICONE 200 (5,0 X 3,0 - 1MTRO -', 'tubo_de_silicone_200_50_x_30_1mtro_', '3006218', 'TUBO DE SILICONE N 200 - 5,00 x 3,00 MM - 1MTRO -', 'TUBO DE SILICONE N 200 - 5,00 x 3,00 MM - 1MTRO -', 'Código Referência: 3006218
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 28.75, 25.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8386078/G/tubo_de_silicone.jpg', 0, 0, 1),
(142, 13, 46, 'POLTRONA PARA COLETA DE SANGUE: MHL110-010', 'poltrona_para_coleta_de_sangue_mhl110_010_', '3017653', 'POLTRONA PARA COLETA DE SANGUE: MHL110-010', 'POLTRONA PARA COLETA DE SANGUE: MHL110-010', 'Código Referência: 3017653
Marca/Fabricante: CENTRILAB
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 632.5, 550.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8457691/G/imagem.jpg', 0, 0, 1),
(143, 3, 32, 'CENTRÍFUGA CLÍNICA MICRO HEMATÓCRITO 24 TUBOS', 'centrfuga_clnica_micro_hematcrito_24_tubos_', '2622667', 'Centrífuga Microhematócrito Digital Motor de indução 24 Tubos Capilares', 'Centrífuga Microhematócrito Digital Motor de indução 24 Tubos Capilares', 'Código Referência: 2622667
Marca/Fabricante: HOFFMANLAB
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 11500.0, 10000.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19070315/G/centr_fuga_clinica___microhemat_crito_digital_motor_de_indu_o_2.jpg', 0, 0, 1),
(144, 1, 38, 'SENSOR ADULTO 9 PINOS P/ OXÍMETRO PULSO P  INSTRAMED', 'sensor_adulto_9_pinos_p_oximetro_pulso_p_instramed', '5167889', 'SENSOR OXIMETRIA PULSO ADULTO 9 PINOS INSTRAMED', 'SENSOR OXIMETRIA PULSO ADULTO 9 PINOS INSTRAMED', 'Código Referência: 5167889
Marca/Fabricante: INSTRAMED
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 759.0, 660.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/24718120/G/nhbc1725_2.gif', 0, 0, 1),
(145, 1, 44, 'TUBO DE SILICONE 208 (14,6 X 9,5 VENDA POR METRO)', 'tubo_de_silicone_208_146_x_95_venda_por_metro', '4874657', 'TUBO DE SILICONE N°208', 'TUBO DE SILICONE N°208', 'Código Referência: 4874657
Marca/Fabricante: EPEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 49.99, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15846432/G/tubo_silicone_208_03.jpg', 0, 1, 1),
(146, 6, 44, 'PERA C/ ELETRODO C/ 6 PRE CORDIAL  ADULTO AZUL', 'pera_c_eletrodo_c_6_pre_cordial_adulto_azul', '6183695', 'ELETRODO PRE CORDIAL  ADULTO COM PERA C/ 6 UND.', 'ELETRODO PRE CORDIAL  ADULTO COM PERA C/ 6 UND.', 'Código Referência: 6183695
Marca/Fabricante: EPEX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 345.0, 300.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/18394071/G/pera_p_ecg.jpg', 0, 0, 1),
(147, 1, 53, 'Lâmpada Halogena 6v 30w - Type 5761 - Philips', 'lampada_halogena_6v_30w_type_5761_philips', '6387123', 'Lâmpada Halogena 6v 30w - Type 5761 - Philips', 'Lâmpada Halogena 6v 30w - Type 5761 - Philips', 'Código Referência: 6387123
Marca/Fabricante: PHILIPS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 120.75, 105.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19233357/G/lampada_philips.jpg', 0, 0, 1),
(148, 1, 30, 'BALANÇA  DIGITAL ADULTO ANTROPOMÉTRICA 200  kg - WELMY', 'balanca_digital_adulto_antropometrica_200_kg_welmy', '4295756', 'BALANÇA  DIGITAL ADULTO ANTOPOLMÉTRICA', 'BALANÇA  DIGITAL ADULTO ANTOPOLMÉTRICA', 'Código Referência: 4295756
Marca/Fabricante: WELMY
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2875.0, 2500.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15218657/G/balanca_1.jpg', 0, 0, 1),
(149, 8, 13, 'VALVULA REDUTORA DE PRESSAO COM FLUXOMETRO (OXIGENIO)', 'valvula_redutora_de_pressao_com_fluxometro_oxigenio', '10871038', 'Válvula Redutora de Pressão com Fluxômetro para Cilindro de Oxigênio – Protec', 'Válvula Redutora de Pressão com Fluxômetro para Cilindro de Oxigênio – Protec', 'Código Referência: 10871038
Marca/Fabricante: DIVERSAS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2999.9, 461.6, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36362145/G/1_valv.jpg', 0, 0, 1),
(150, 10, 69, 'Cadeira de Banho Higiênica D40', 'cadeira_de_banho_higienica_d40', '2209564', 'CADEIRA DE HIGIENIZAÇÃO D40', 'CADEIRA DE HIGIENIZAÇÃO D40', 'Código Referência: 2209564
Marca/Fabricante: SINNOWA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 9500.0, 550.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/32590906/G/cadeira.webp', 0, 0, 1),
(151, 1, 29, 'BARAKA 1,20 TRAQUEIA DE SILICONE', 'baraka_120_traqueia_de_silicone', '2586122', 'BARAKA 1,20 COM TRAQUEIA DE SILICONE', 'BARAKA 1,20 COM TRAQUEIA DE SILICONE', 'Código Referência: 2586122
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 141.45, 123.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/6130272/G/baraka_3_l_traqueia_silicone_adulto.jpg', 0, 1, 1),
(152, 1, 70, 'Aparelho de Pressão Digital Automático G-Tech Master BP3AA1-1', 'aparelho_de_pressao_digital_automatico_g_tech_master_bp3aa1_1', '3586573', 'Aparelho de Pressão Digital Automático G-Tech Master BP3AA1-1', 'Aparelho de Pressão Digital Automático G-Tech Master BP3AA1-1', 'Código Referência: 3586573
Marca/Fabricante: G-TECH
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 700.0, 160.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/11446018/G/54b3367f706ae42228f1b538c7b1539e.jpg', 0, 0, 1),
(153, 1, 4, 'BOLSA INFUSORA DE PRESSÃO INFUSE IT  COM INDICADOR 500ML', 'bolsa_infusora_de_pressao_infuse_it_com_indicador_500ml', '8795754', 'BOLSA INFUSORA DE PRESSÃO INFUSE IT BOLSA INFUSORA DE PRESSÃO INFUSE IT', 'BOLSA INFUSORA DE PRESSÃO INFUSE IT BOLSA INFUSORA DE PRESSÃO INFUSE IT', 'Código Referência: 8795754
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 638.25, 555.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/29059557/G/bolsa_pressurizadora.png', 0, 0, 1),
(154, 1, 71, 'ESTETOSCÓPIO PROFISSIONAL: Spirit® Master Pro', '_estetoscopio_profissional_spirit_master_pro', '3496068', 'ESTETOSCÓPIO PROFISSIONAL: Spirit® Master Pro', 'ESTETOSCÓPIO PROFISSIONAL: Spirit® Master Pro', 'Código Referência: 3496068
Marca/Fabricante: SPIRIT
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 197.0, 160.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/11303658/G/auscultador_master_pro.jpg', 0, 0, 1),
(155, 1, 72, 'TRAQUEIA EM SILICONE CORRUGADO 1,20 MM COM BOCAL 15MM INFANTIL', 'traqueia_em_silicone_corrugado_120_mm_com_bocal_15mm_infantil', '2586941', 'TRAQUEIA 1,20 COM BOCAL INFANTIL', 'TRAQUEIA 1,20 COM BOCAL INFANTIL', 'Código Referência: 2586941
Marca/Fabricante: PREO ESPECIAL PARA ESTE LOTE
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 432.0, 120.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/6135962/G/traqueia_um_e_vinte_com_bocal_infantil.jpg', 0, 0, 1),
(156, 5, 27, 'CATETER PICC DUPLO LUMEN POLIURETANO 2.0FR - 30CM', 'cateter_picc_duplo_lumen_poliuretano_20fr_30cm', '10042862', 'O Cateter Picc Duplo Lúmen é 100% poliuretano radiopaco e grau médico.', 'O Cateter Picc Duplo Lúmen é 100% poliuretano radiopaco e grau médico.', 'Código Referência: 10042862
Marca/Fabricante: CAM MEDICAL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2875.0, 2500.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/34118416/G/cateter_picc_duplo_lumen_2_0fr_30cm_poliuretano_2167_1_4993f55217d6dead432e80af62407da0.webp', 0, 0, 1),
(157, 1, 73, 'Caneta Eletrocirúrgica Bluepad  descart - BP20', 'caneta_eletrocirurgica_bluepad_descart_bp20', '10044900', 'Caneta Eletrocirúrgica Descartável - Design ergonômico fino e leve à prova de derrapagem, com interruptor e botões projetados para ativação suave.', 'Caneta Eletrocirúrgica Descartável - Design ergonômico fino e leve à prova de derrapagem, com interruptor e botões projetados para ativação suave.', 'Código Referência: 10044900
Marca/Fabricante: SIMILAR  COMPATVEL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 549.99, 25.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/34124775/G/canete_bisturi_bp20.jpg', 0, 1, 1),
(158, 1, 4, 'descritivo genérico - Ventilador pulmonar mecânico de emergência para transporte, Microprocessado, portátil', 'descritivo_generico_ventilador_pulmonar_mecanico_de_emergencia_para_transporte', '10744004', 'Ventilador pulmonar mecânico: Ventilador de emergência para transporte, Microprocessado, portátil,', 'Ventilador pulmonar mecânico: Ventilador de emergência para transporte, Microprocessado, portátil,', 'Código Referência: 10744004
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 520.0, 399.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35991960/G/esque_vm.png', 0, 0, 1),
(159, 1, 33, 'DETECTOR FETAL  Doppler Portátil Digital FD-200C MD®', 'detector_fetal_doppler_portatil_digital_fd_200c_md', '3496156', 'DETECTOR FETAL  Doppler Portátil Digital FD-200C MD®', 'DETECTOR FETAL  Doppler Portátil Digital FD-200C MD®', 'Código Referência: 3496156
Marca/Fabricante: INBRAS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 1104.0, 960.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/11303991/G/timthumb.jpg', 0, 0, 1),
(160, 2, 74, 'GUARNIÇÃO EM SILICONE 10,0 X 10,0MM X 2METROS - VERMELHA', 'guarnicao_em_silicone_100_x_100mm_x_2metros_vermelha', '9724077', 'BORRACHA EM SILICONE PARA VEDAÇÃO DE VAPOR OU AGUA DE ALTA TEMPERATURA', 'BORRACHA EM SILICONE PARA VEDAÇÃO DE VAPOR OU AGUA DE ALTA TEMPERATURA', 'Código Referência: 9724077
Marca/Fabricante: LINHA AUTOCLAVE HS 724L
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 900.0, 150.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/33195150/G/shopping.png', 0, 0, 1),
(161, 1, 26, 'TUBO DE SILICONE  206 12,80 x 8,00MM - 1 MTRO', 'tubo_de_silicone_206_1280_x_800mm_1_mtro_', '3006271', 'TUBO DE SILICONE – COD. 206 12,80 x 8,00MM - 1 MTRO', 'TUBO DE SILICONE – COD. 206 12,80 x 8,00MM - 1 MTRO', 'Código Referência: 3006271
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 51.75, 45.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/8385938/G/tubo_de_silicone.jpg', 0, 0, 1),
(162, 7, 75, 'Eletrodo Pas Adesivo Desfribilador Cardiomax/ Dea Isis Adulto ou infantil', 'eletrodo_pas_adesivo_desfribilador_cardiomax_dea_isis_adulto_ou_infantil', '8867004', 'Eletrodo Adesivo Desfribilador Cardiomax/ Dea Isis Adulto ou infantil', 'Eletrodo Adesivo Desfribilador Cardiomax/ Dea Isis Adulto ou infantil', 'Código Referência: 8867004
Marca/Fabricante: OXIGEL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 272.55, 237.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/29433883/G/paadesiva.jpg', 0, 0, 1),
(163, 1, 4, 'Oxímetro Digital Portátil com Gráfico de Curva de Batimentos e Alarme Sonoro da Dellamed', 'oximetro_digital_portatil_com_grafico_de_curva_de_batimentos_e_alarme_sonoro_da_', '3319657', 'Oxímetro de Pulso Compacto Adulto com Alarme', 'Oxímetro de Pulso Compacto Adulto com Alarme', 'Código Referência: 3319657
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 841.0, 199.99, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36025630/G/08.jpg', 0, 1, 1),
(164, 1, 73, 'Cabo para Pinça Bipolar - Conector Universal', 'cabo_para_pinca_bipolar_conector_universal_', '9457372', 'Cabo para pinça bipolar  confeccionado em silicone autoclavável de alta resistência', 'Cabo para pinça bipolar  confeccionado em silicone autoclavável de alta resistência', 'Código Referência: 9457372
Marca/Fabricante: SIMILAR  COMPATVEL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 549.99, 300.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31909936/G/1.jpg', 0, 0, 1),
(165, 1, 76, 'Máscara Nasal Cpap Bipap Yn-03 Sem Apoio Testa - Yuwell', 'mascara_nasal_cpap_bipap_yn_03_sem_apoio_testa_yuwell', '10713698', 'Máscara Nasal Cpap Bipap Yn-03 Sem Apoio Testa - Yuwell', 'Máscara Nasal Cpap Bipap Yn-03 Sem Apoio Testa - Yuwell', 'Código Referência: 10713698
Marca/Fabricante: YUWELL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 632.5, 550.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35869135/G/masc1.jpg', 0, 0, 1),
(166, 1, 29, 'MÁSCARA  ALTA CONCENTRAÇÃO DE OXIGÊNIO ADULTO', 'mascara_alta_concentracao_de_oxigenio_adulto', '5403176', 'MÁSCARA VNI ALTA CONCENTRAÇÃO DE OXIGÊNIO ADULTO', 'MÁSCARA VNI ALTA CONCENTRAÇÃO DE OXIGÊNIO ADULTO', 'Código Referência: 5403176
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 44.99, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/17793082/G/mascara_alta_concentracao_1.jpg', 0, 0, 1),
(167, 2, 4, 'RESERVATÓRIO COMPLETO EM CO-POLÍMERO', 'reservatriocompletoemco_polmero', '8375050', 'RESERVATÓRIO COMPLETO EM CO-POLÍMERO', 'RESERVATÓRIO COMPLETO EM CO-POLÍMERO', 'Código Referência: 8375050
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 578.58, 503.11, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/27093029/G/reservat.jpg', 0, 0, 1),
(168, 1, 72, 'TRAQUEIA EM SILICONE COM BOCAL 450MM  X  22MM', 'traqueia_em_silicone_com_bocal_450mm_x_22mm_', '6689928', 'TRAQUEIA DE SILICONE CORRUGADO 45 CM 22MM', 'TRAQUEIA DE SILICONE CORRUGADO 45 CM 22MM', 'Código Referência: 6689928
Marca/Fabricante: PREO ESPECIAL PARA ESTE LOTE
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 432.0, 250.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/20462850/G/raqueia.jpg', 0, 0, 1),
(169, 1, 75, 'DRENO P/ CIRCUITO PACIENTE  22 MM', 'dreno_p_circuito_paciente_22_mm', '6689799', 'DRENO P/ CIRCUITO PACIENTE  22 MM', 'DRENO P/ CIRCUITO PACIENTE  22 MM', 'Código Referência: 6689799
Marca/Fabricante: OXIGEL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 83.03, 72.2, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/20462833/G/dreno.jpg', 0, 1, 1),
(170, 1, 22, 'Mascara para VNI / ANESTESIA - Conjunto Máscara e Fixador cefálico para VNI nº 05', 'mascara_para_vnianestesia_conjunto_mascara_e_fixador_cefalico_para_vni_n_05', '8649009', 'Conjunto (Máscara e presilha) para VNI -', 'Conjunto (Máscara e presilha) para VNI -', 'Código Referência: 8649009
Marca/Fabricante: RD MEDIQ M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 400.0, 80.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/28363525/G/whatsapp_image_2021_03_31_at_12.03.59_1.jpeg', 0, 0, 1),
(171, 2, 26, 'MEMBRANA BORRACHA VERMELHA DIAM. 56MM', 'membrana_borracha_vermelha_diam_56mm_', '3365865', 'DIAFRAGMA (MEMBRANA) DE BORRACHA VERMELHA, Ø 56 MM,', 'DIAFRAGMA (MEMBRANA) DE BORRACHA VERMELHA, Ø 56 MM,', 'Código Referência: 3365865
Marca/Fabricante: H2M
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 253.0, 220.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36350916/G/borracha.webp', 0, 0, 1),
(172, 1, 56, 'LOCAÇÃO  - ALUGUEL DE EQUIPAMENTOS MEDICAOS  HOSPITALR', 'locacao_aluguel_de_equipamentos_medicaos_hospitalr_', '5150976', 'LOCAÇÃO DE EQUIPAMENTO MÉDICOS HOSPITALAR', 'LOCAÇÃO DE EQUIPAMENTO MÉDICOS HOSPITALAR', 'Código Referência: 5150976
Marca/Fabricante: RIESTER
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 517.5, 450.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/16895803/G/cardioversor_cardiomax_instramed_01_635848351473785509.jpg', 0, 0, 1),
(173, 1, 12, 'NORTEMEDICA COMERCIO E REPRESENTAÇÕES LTDA.', 'cabo_cp11_para_placa_bisturi_placa_neltra_', '4716076', 'Produtos e Equipamentos Médicos Hospitalar e Laboratorial e Assistência Técnica', 'Produtos e Equipamentos Médicos Hospitalar e Laboratorial e Assistência Técnica', 'Código Referência: 4716076
Marca/Fabricante: SERCON
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 371.0, 250.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/4498014/G/logo_nova_.jpeg', 0, 0, 1),
(174, 9, 28, 'FILTRO (CARTUCHO)', 'filtro_cartucho_pp_p_agua_10x_2_12_5_micras_osmose_reserva', '5061625', 'FILTRO (CARTUCHO) P/ ÁGUA EM POLIPROPILENO  10', 'FILTRO (CARTUCHO) P/ ÁGUA EM POLIPROPILENO  10', 'Código Referência: 5061625
Marca/Fabricante: BBI
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 5200.0, 850.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/16495174/G/cartucho_agua.jpeg', 0, 0, 1),
(175, 1, 38, 'Linha de  amostragem Adulto nasal para Capnografia Instramed  ( inmax)', '_linha_de_amostragem_adulto_nasal_para_capnografia_instramedinmax', '3237173', 'linha de  amostragempara capnografia instramed', 'linha de  amostragempara capnografia instramed', 'Código Referência: 3237173
Marca/Fabricante: INSTRAMED
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 380.0, 190.89, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/9811955/G/nasal.jpg', 0, 1, 1),
(176, 12, 77, 'BOTICÃO ADULTO N.º 18 L - P/ MOLARES SUPERIORES ESQUERDO', 'boticao_adulto_n_18_l_p_molares_superiores_esquerdo', '7219542', 'BOTICÃO ADULTO N.º 18 L - PARA MOLARES SUPERIORES ESQUERDO', 'BOTICÃO ADULTO N.º 18 L - PARA MOLARES SUPERIORES ESQUERDO', 'Código Referência: 7219542
Marca/Fabricante: BSZ CIRURGICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 115.0, 100.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/31825073/G/bot1.jpg', 0, 0, 1),
(177, 8, 29, 'ASPIRADOR VENTURI P/ REDE DE AR COMPRIMIDO FRASCO DE VIDRO 500ML', 'aspirador_venturi_p_rede_de_ar_comprimido_frasco_de_vidro_500ml', '8127653', 'Aspirador Venturi Ar Comprimido RWR (Frasco em Vidro)', 'Aspirador Venturi Ar Comprimido RWR (Frasco em Vidro)', 'Código Referência: 8127653
Marca/Fabricante: PROTEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2999.9, 120.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/25966506/G/rwr_gasoterapia_aspirador_de_secrecao.jpg', 0, 0, 1),
(178, 1, 38, 'Linha de  amostragem traqueal  infantil para Capnografia Instramed Inmax', 'linha_de_amostragem_traqueal_infantil_para_capnografia_instramed_inmax', '3237257', 'Linha de  amostragem Adulto para Capnografia Instramed Inmax', 'Linha de  amostragem Adulto para Capnografia Instramed Inmax', 'Código Referência: 3237257
Marca/Fabricante: INSTRAMED
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 350.0, 329.9, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/9812386/G/infantil.jpg', 0, 0, 1),
(179, 7, 68, 'LOCAÇÃO DE DESFIBRILADOR  CARDIOVERSOR BASICO', 'locacao_de_desfibrilador_cardioversor_basico_', '10755282', 'Cardioversor Bifásico – Disponível para Pronta Entrega', 'Cardioversor Bifásico – Disponível para Pronta Entrega', 'Código Referência: 10755282
Marca/Fabricante: MULTIMARCA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 402.5, 350.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36031408/G/cardioversor_cardiomax_.jpg', 0, 0, 1),
(180, 1, 34, 'Fita para Medição de Glicose  - G-423S - CODE Free -  para o   G500 Bioland', 'fita_para_mediao_de_glicose_g_423s_code_free_para_o_g500_bioland', '2182494', 'FITAS PARA MEDIR GLICOSE', 'FITAS PARA MEDIR GLICOSE', 'Código Referência: 2182494
Marca/Fabricante: BIOLAND
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 90.0, 42.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/18642046/G/2017_08_01_06_29_50.png', 0, 0, 1),
(181, 6, 21, 'CABO PACIENTE 10 VIAS PARA ECG DIXTAL', 'cabo_paciente_10_vias_para_ecg_dixtal-1', '4266631', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAMA (ECG)', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAMA (ECG)', 'Código Referência: 4266631
Marca/Fabricante: DIXTAL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 688.82, 600.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/13887737/G/wp_20160708_16_56_05_pro.jpg', 0, 1, 1),
(182, 1, 42, 'ASPIRADOR DE SANGUE E SECREÇÃO', 'aspirador_de_sangue_e_secrecao', '3496010', 'Aspirador Cirúrgico Aspiramax MA-520 Omron', 'Aspirador Cirúrgico Aspiramax MA-520 Omron', 'Código Referência: 3496010
Marca/Fabricante: RDMEDIQ
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 793.5, 690.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35492968/G/aspirador_cirurgico_aspiramax_ma520_omron_3.webp', 0, 0, 1),
(183, 1, 24, 'Cal sodada  acondicionada em caixa C/ 2 GALÕES  de 4,3 kg cada.', 'cal_sodada_acondicionada_em_caixa_c_2_galoes_de_43_kg_cada', '3220775', 'Cal Sodada – Absorvedora de CO2  Indicada para absorção de dióxido de carbono (CO2) em sistemas respiratórios e aplicações médico-hospitalares, garantindo maior segurança e eficiên...', 'Cal Sodada – Absorvedora de CO2  Indicada para absorção de dióxido de carbono (CO2) em sistemas respiratórios e aplicações médico-hospitalares, garantindo maior segurança e eficiência no uso de equipamentos de anestesia e ventilação.  Apresentação:  Caixa com 02 galões de 4,3 kg cada  Preço:  Valor', 'Código Referência: 3220775
Marca/Fabricante: NEW TEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 575.0, 500.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19472907/G/cal_sodada_4_3kg_atra_sorb.jpg', 0, 0, 1),
(184, 1, 14, 'Cabo Para Placa Neutra Bisturi 2 Pinos Cp 07 Deltronix', 'cabo_para_placa_neutra_bisturi_2_pinos_cp_07_deltronix', '6425482', 'Cabo Para Placa Neutra Bisturi 2 Pinos Cp 07 DELTRONIX', 'Cabo Para Placa Neutra Bisturi 2 Pinos Cp 07 DELTRONIX', 'Código Referência: 6425482
Marca/Fabricante: DELTRONIX
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 312.98, 272.16, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/19397119/G/cp_07.jpg', 0, 0, 1),
(185, 1, 4, 'VALVULA DIRECIONAL 5/2 VIAS DUPLO SOLENOIDE BOBINA 220 VCA ROSCA 1/8- SERIE SY', 'valvula_direcional_52_vias_duplo_solenoide_bobina_220_vca_rosca_18serie_sy', '4857815', 'VALVULA DIRECIONAL 5/2 VIAS DUPLO SOLENOIDE BOBINA 220 VCA ROSCA 1/8- SERIE SY  SY5220-4DZ-01', 'VALVULA DIRECIONAL 5/2 VIAS DUPLO SOLENOIDE BOBINA 220 VCA ROSCA 1/8- SERIE SY  SY5220-4DZ-01', 'Código Referência: 4857815
Marca/Fabricante: NORTE MDICA
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 2070.0, 1800.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/35024884/G/valvula.png', 0, 0, 1),
(186, 1, 78, 'Colchão Hospitalar D28 Revestido em Napa Azul – 188 × 88 × 12 cm', 'colchao_hospitalar_d28_revestido_em_napa_azul1888812_cm', '2593304', 'Colchão hospitalar D28 com revestimento em napa azul, nas dimensões de 188 × 88 × 12 cm. Indicado para camas e leitos compatíveis. Consulte as características, as condições de entr...', 'Colchão hospitalar D28 com revestimento em napa azul, nas dimensões de 188 × 88 × 12 cm. Indicado para camas e leitos compatíveis. Consulte as características, as condições de entrega e a disponibilidade.', 'Código Referência: 2593304
Marca/Fabricante: KSS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 841.0, 600.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36354571/G/colchao_de_uso_hospitalar_e_domiciliar_d28_dellamed_994_1_906a0a70fea7947ed63a7fdb2130db89.webp', 0, 0, 1),
(187, 1, 79, 'CIRCUITO PACIENTE INFANTIL/ NEON P/ VENTILADOR E CARRINHO DE ANESTESIA  1,20MM COM BOCAL E \'Y\' 15MM', 'circuito_paciente_infantil_neon_p_ventilador_e_carrinho_de_anestesia_120mm_com_b', '4289800', 'CIRCUITO PACIENTE INFANTIL/ NEON PARA CARRINHO DE ANESTESIA  1,20MM COM BOCAL E \'Y\' 15MM', 'CIRCUITO PACIENTE INFANTIL/ NEON PARA CARRINHO DE ANESTESIA  1,20MM COM BOCAL E \'Y\' 15MM', 'Código Referência: 4289800
Marca/Fabricante: UNITEC
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 368.0, 320.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/13974129/G/circuitos_respiratorios___anestesia_haoxi_ii_em_silicone_.jpg', 0, 1, 1),
(188, 2, 12, 'GUARNIÇÃO SILICONE P VEDAÇÃO DE PORTA DE AUTOCLAVE SERCON 301 a 364 LTROS', 'guarnicao_silicone_p_vedacao_de_porta_de_autoclave_sercon_301_a_364_ltros', '10755200', 'GUARNICAO VULCANIZADA 2148 MM P PORTA 460 X 660   301 a 364 LTROS', 'GUARNICAO VULCANIZADA 2148 MM P PORTA 460 X 660   301 a 364 LTROS', 'Código Referência: 10755200
Marca/Fabricante: SERCON
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 900.0, 800.0, 15, 'https://d5gag3xtge2og.cloudfront.net/producao/36031402/G/1.jpg', 0, 0, 1),
(189, 6, 53, 'CABO PACIENTE 10 VIAS PARA ECG - PARA PHILIPS E HP', 'cabo_paciente_10_vias_para_ecg_para_philips_e_hp', '4841492', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO (ECG )- PARA PHILIPS E HP', 'CABO PACIENTE 10 VIAS PARA ELETROCARDIOGRAFO (ECG )- PARA PHILIPS E HP', 'Código Referência: 4841492
Marca/Fabricante: PHILIPS
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 800.0, 670.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/15713453/G/cabo_ecg.jpg', 0, 0, 1),
(190, 1, 75, 'FILTRO HMEF ADULTO  COM TRAQUEIA - UMIDIFICA E TROCADOR DE CALOR', 'filtro_hmef_adulto_com_traqueia_umidifica_e_trocador_de_calor_', '3013836', 'FILTRO HMEF - UMIDIFICA TROCADOR DE CALOR -  Filtro Bacteriano HME – ZF001', 'FILTRO HMEF - UMIDIFICA TROCADOR DE CALOR -  Filtro Bacteriano HME – ZF001', 'Código Referência: 3013836
Marca/Fabricante: OXIGEL
Distribuição: Norte Médica Comércio e Representações
Registro ANVISA: Homologado / Conforme RDC
Origem: Nacional / Alta Precisão', 272.55, 237.0, 15, 'https://dw0jruhdg6fis.cloudfront.net/producao/26637866/G/filtro.jpg', 0, 0, 1);

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

CREATE TABLE IF NOT EXISTS `itens_pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `produto_id` int(11) NOT NULL,
  `nome_produto` varchar(255) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
