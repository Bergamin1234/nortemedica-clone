<?php
/**
 * Configuração Geral da Loja Norte Médica
 * Pronto para Hospedagem HostGator (Alligator) / cPanel
 */

// Evita avisos de timezone
date_default_timezone_set('America/Porto_Velho');

// Modo de banco de dados: 'auto' (tenta MySQL, cai para SQLite se falhar), 'mysql' ou 'sqlite'
define('DB_DRIVER', 'auto');

// Configurações do MySQL (Preencha com seus dados do cPanel da HostGator)
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'nortemedica_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// Caminho do arquivo SQLite (caso use SQLite ou fallback automático)
define('DB_SQLITE_PATH', __DIR__ . '/data/nortemedica.sqlite');

// Informações da Empresa (Norte Médica)
define('SITE_NOME', 'Norte Médica - Distribuidora Hospitalar & Cirúrgica');
define('SITE_SLOGAN', 'Produtos e Equipamentos Médicos, Hospitalares, Laboratório e Assistência Técnica');
define('SITE_CNPJ', '06.273.744/0001-40');
define('SITE_ENDERECO', 'Rua Guanabara, 1275 - Bairro Nossa Senhora das Graças, Porto Velho - RO');
define('SITE_TELEFONE', '(69) 3229-4500');
define('SITE_WHATSAPP', '5569999887766');
define('SITE_EMAIL', 'contato@nortemedica.com.br');
define('SITE_CHAVE_PIX', '06273744000140'); // CNPJ da Norte Médica para simulação

// Regras comerciais
define('DESCONTO_PIX_PERCENTUAL', 10); // 10% de desconto à vista no Pix
define('MAX_PARCELAS_CARTAO', 12);     // Até 12x no cartão
define('PARCELAS_SEM_JUROS', 6);       // Até 6x sem juros
define('VALOR_FRETE_GRATIS', 1500.00); // Frete grátis a partir de R$ 1.500,00

// Inicia sessão se não estiver iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
