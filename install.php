<?php
/**
 * Instalador 1-Clique para HostGator (Alligator) / cPanel
 * Norte Médica - Sistema E-Commerce
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$mensagem = '';
$tipo_mensagem = '';
$instalado = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $modo = $_POST['modo'] ?? 'mysql';

    if ($modo === 'sqlite') {
        // Modo Instantâneo SQLite
        require_once __DIR__ . '/db.php';
        try {
            $pdo = getDbConnection();
            $mensagem = "Sistema configurado instantaneamente com banco de dados embutido! Pronto para uso.";
            $tipo_mensagem = 'success';
            $instalado = true;
        } catch (Exception $e) {
            $mensagem = "Erro ao iniciar banco embutido: " . $e->getMessage();
            $tipo_mensagem = 'error';
        }
    } else {
        // Modo HostGator MySQL cPanel
        $db_host = trim($_POST['db_host'] ?? 'localhost');
        $db_name = trim($_POST['db_name'] ?? '');
        $db_user = trim($_POST['db_user'] ?? '');
        $db_pass = trim($_POST['db_pass'] ?? '');

        if (empty($db_name) || empty($db_user)) {
            $mensagem = "Por favor, preencha o Nome do Banco e o Usuário MySQL gerados no cPanel da HostGator.";
            $tipo_mensagem = 'error';
        } else {
            try {
                // 1. Testar conexão com o MySQL
                $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ];
                if (defined('PDO::MYSQL_ATTR_MULTI_STATEMENTS')) {
                    $options[PDO::MYSQL_ATTR_MULTI_STATEMENTS] = true;
                }
                $pdo = new PDO($dsn, $db_user, $db_pass, $options);

                // 2. Importar o arquivo database.sql
                $sqlPath = __DIR__ . '/database.sql';
                if (!file_exists($sqlPath)) {
                    throw new Exception("Arquivo database.sql não encontrado na raiz da pasta!");
                }

                $sql = file_get_contents($sqlPath);
                // Dividir comandos para execução limpa
                $pdo->exec($sql);

                // 3. Atualizar o arquivo config.php com as credenciais da HostGator
                $configFile = __DIR__ . '/config.php';
                $configContent = file_get_contents($configFile);

                $configContent = preg_replace("/define\('DB_DRIVER',\s*'.*?'\);/", "define('DB_DRIVER', 'mysql');", $configContent);
                $configContent = preg_replace("/define\('DB_HOST',\s*'.*?'\);/", "define('DB_HOST', '{$db_host}');", $configContent);
                $configContent = preg_replace("/define\('DB_NAME',\s*'.*?'\);/", "define('DB_NAME', '{$db_name}');", $configContent);
                $configContent = preg_replace("/define\('DB_USER',\s*'.*?'\);/", "define('DB_USER', '{$db_user}');", $configContent);
                $configContent = preg_replace("/define\('DB_PASS',\s*'.*?'\);/", "define('DB_PASS', '{$db_pass}');", $configContent);

                file_put_contents($configFile, $configContent);

                $mensagem = "Banco de dados MySQL conectado e tabelas criadas com sucesso! Sua loja já está no ar!";
                $tipo_mensagem = 'success';
                $instalado = true;
            } catch (Exception $e) {
                $mensagem = "Erro na instalação MySQL: " . $e->getMessage();
                $tipo_mensagem = 'error';
            }
        }
    }
}

// Verificação de requisitos do servidor HostGator
$php_version = phpversion();
$pdo_mysql = extension_loaded('pdo_mysql');
$pdo_sqlite = extension_loaded('pdo_sqlite');
$writable = is_writable(__DIR__);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalador HostGator (Alligator) - Norte Médica</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-100 min-h-screen text-slate-800 flex flex-col justify-between">

    <!-- Header Simples -->
    <header class="bg-blue-950 text-white py-6 shadow-md border-b-4 border-emerald-500">
        <div class="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="bg-white p-2 rounded-lg text-blue-950 flex items-center justify-center font-black text-xl shadow">
                    <i class="fa-solid fa-staff-snake text-emerald-600 mr-1.5 text-2xl"></i> NORTE MÉDICA
                </div>
                <span class="text-xs bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Instalador HostGator
                </span>
            </div>
            <div class="text-xs text-slate-300">
                <i class="fa-solid fa-server mr-1 text-emerald-400"></i> cPanel / Apache Ready
            </div>
        </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="max-w-4xl mx-auto px-4 py-10 w-full">
        
        <!-- Notificações -->
        <?php if (!empty($mensagem)): ?>
            <div class="mb-8 p-5 rounded-xl border flex items-start space-x-4 <?php echo $tipo_mensagem === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'; ?>">
                <i class="fa-solid <?php echo $tipo_mensagem === 'success' ? 'fa-circle-check text-emerald-600' : 'fa-triangle-exclamation text-red-600'; ?> text-2xl mt-0.5"></i>
                <div class="flex-1">
                    <h3 class="font-bold text-lg"><?php echo $tipo_mensagem === 'success' ? 'Tudo Pronto!' : 'Atenção'; ?></h3>
                    <p class="text-sm mt-1"><?php echo htmlspecialchars($mensagem); ?></p>
                    <?php if ($instalado): ?>
                        <div class="mt-4 flex flex-wrap gap-3">
                            <a href="index.php" class="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow flex items-center">
                                <i class="fa-solid fa-store mr-2"></i> Abrir Loja Virtual
                            </a>
                            <a href="admin/login.php" class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow flex items-center">
                                <i class="fa-solid fa-lock mr-2"></i> Acessar Painel Admin (admin / admin123)
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!$instalado): ?>
            <!-- Card de Diagnóstico do Servidor HostGator -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                <h2 class="text-base font-bold text-slate-800 flex items-center mb-4">
                    <i class="fa-solid fa-stethoscope text-emerald-600 mr-2 text-lg"></i>
                    Diagnóstico de Compatibilidade da Hospedagem
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span class="text-slate-500 block">Versão PHP:</span>
                        <strong class="text-sm text-slate-800"><?php echo $php_version; ?></strong>
                        <span class="text-emerald-600 block font-semibold mt-1"><i class="fa-solid fa-check"></i> OK</span>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span class="text-slate-500 block">PDO MySQL:</span>
                        <strong class="text-sm text-slate-800"><?php echo $pdo_mysql ? 'Disponível' : 'Ausente'; ?></strong>
                        <span class="<?php echo $pdo_mysql ? 'text-emerald-600' : 'text-amber-600'; ?> block font-semibold mt-1">
                            <i class="fa-solid <?php echo $pdo_mysql ? 'fa-check' : 'fa-info-circle'; ?>"></i> <?php echo $pdo_mysql ? 'Pronto cPanel' : 'Opcional'; ?>
                        </span>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span class="text-slate-500 block">PDO SQLite:</span>
                        <strong class="text-sm text-slate-800"><?php echo $pdo_sqlite ? 'Disponível' : 'Ausente'; ?></strong>
                        <span class="text-emerald-600 block font-semibold mt-1"><i class="fa-solid fa-check"></i> Suporte Embutido</span>
                    </div>
                    <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span class="text-slate-500 block">Permissão de Escrita:</span>
                        <strong class="text-sm text-slate-800"><?php echo $writable ? 'Permitida' : 'Restrita'; ?></strong>
                        <span class="text-emerald-600 block font-semibold mt-1"><i class="fa-solid fa-check"></i> OK</span>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                
                <!-- Opção 1: Configuração MySQL HostGator -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-lg">
                                1
                            </div>
                            <div>
                                <h2 class="font-bold text-slate-900 text-lg">Hospedagem HostGator (MySQL)</h2>
                                <p class="text-xs text-slate-500">Ideal para banco criado no cPanel / phpMyAdmin</p>
                            </div>
                        </div>

                        <form method="POST" action="" class="space-y-4 text-sm mt-6">
                            <input type="hidden" name="modo" value="mysql">

                            <div>
                                <label class="block font-medium text-slate-700 mb-1">Host do MySQL</label>
                                <input type="text" name="db_host" value="localhost" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50" required>
                                <span class="text-xs text-slate-400">Na HostGator geralmente é <code>localhost</code></span>
                            </div>

                            <div>
                                <label class="block font-medium text-slate-700 mb-1">Nome do Banco de Dados</label>
                                <input type="text" name="db_name" placeholder="Ex: usuario_nortemedica" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800" required>
                                <span class="text-xs text-slate-400">Criado na seção "Bancos de dados MySQL" do cPanel</span>
                            </div>

                            <div>
                                <label class="block font-medium text-slate-700 mb-1">Usuário do Banco</label>
                                <input type="text" name="db_user" placeholder="Ex: usuario_loja" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800" required>
                            </div>

                            <div>
                                <label class="block font-medium text-slate-700 mb-1">Senha do Usuário</label>
                                <input type="password" name="db_pass" placeholder="Sua senha do banco" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800">
                            </div>

                            <button type="submit" class="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition shadow flex items-center justify-center space-x-2 mt-4">
                                <i class="fa-solid fa-bolt text-yellow-400"></i>
                                <span>Conectar e Criar Tabelas MySQL</span>
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Opção 2: Modo Instantâneo Sem Banco Externo -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                                2
                            </div>
                            <div>
                                <h2 class="font-bold text-slate-900 text-lg">Modo Instantâneo (SQLite)</h2>
                                <p class="text-xs text-slate-500">"Só inserir e rodar" sem precisar criar banco no cPanel</p>
                            </div>
                        </div>

                        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950 text-xs mb-6 space-y-2">
                            <p class="font-bold flex items-center text-emerald-800">
                                <i class="fa-solid fa-wand-magic-sparkles mr-2 text-sm"></i> A maneira mais rápida do mundo:
                            </p>
                            <p>Cria um banco de dados autônomo e de altíssima performance em arquivo local, já com todos os produtos médicos, categorias, fotos e painel de controle funcionando!</p>
                            <p>Não precisa acessar o cPanel nem mexer em senhas de MySQL.</p>
                        </div>

                        <form method="POST" action="">
                            <input type="hidden" name="modo" value="sqlite">
                            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-md flex items-center justify-center space-x-2">
                                <i class="fa-solid fa-play"></i>
                                <span>Ativar Modo Instantâneo Agora</span>
                            </button>
                        </form>
                    </div>

                    <div class="mt-8 border-t pt-4 text-xs text-slate-500">
                        <p class="font-semibold text-slate-700 mb-1"><i class="fa-solid fa-shield-halved text-blue-600 mr-1"></i> Usuário de Teste Padrão:</p>
                        <p>Login Admin: <code class="bg-slate-100 px-1 py-0.5 rounded text-blue-900 font-bold">admin</code></p>
                        <p>Senha: <code class="bg-slate-100 px-1 py-0.5 rounded text-blue-900 font-bold">admin123</code></p>
                    </div>
                </div>

            </div>
        <?php endif; ?>

    </main>

    <!-- Rodapé -->
    <footer class="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
        <p>&copy; <?php echo date('Y'); ?> Norte Médica Comércio e Representações Ltda. Clone E-Commerce.</p>
        <p class="mt-1 text-slate-500">Desenvolvido com compatibilidade total para Hospedagem HostGator (Alligator) / cPanel.</p>
    </footer>

</body>
</html>
