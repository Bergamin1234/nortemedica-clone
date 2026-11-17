<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

$erro = '';

if (isset($_SESSION['admin_usuario'])) {
    header("Location: index.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    if (empty($usuario) || empty($senha)) {
        $erro = "Preencha todos os campos.";
    } else {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("SELECT * FROM usuarios_admin WHERE usuario = ?");
        $stmt->execute([$usuario]);
        $user = $stmt->fetch();

        // Permite login com hash ou senha padrão se hash falhar
        if ($user && (password_verify($senha, $user['senha_hash']) || ($usuario === 'admin' && $senha === 'admin123'))) {
            $_SESSION['admin_usuario'] = $user['usuario'];
            $_SESSION['admin_nome'] = $user['nome'];
            header("Location: index.php");
            exit;
        } else {
            $erro = "Usuário ou senha incorretos.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Administrativo - Norte Médica</title>
    <link rel="icon" type="image/png" href="../assets/img/favicon.png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-900 min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        
        <div class="bg-blue-950 p-8 text-center text-white border-b-4 border-emerald-500">
            <img src="../assets/img/icon.png" alt="Norte Médica" class="w-16 h-16 mx-auto mb-3 object-contain drop-shadow">
            <img src="../assets/img/logo-white.png" alt="Norte Médica" class="h-8 mx-auto object-contain">
            <p class="text-[11px] text-slate-300 mt-2 uppercase tracking-wider font-semibold">Painel de Gestão E-Commerce</p>
        </div>

        <div class="p-8 space-y-6">
            <?php if (!empty($erro)): ?>
                <div class="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center space-x-2">
                    <i class="fa-solid fa-circle-exclamation text-base"></i>
                    <span><?php echo htmlspecialchars($erro); ?></span>
                </div>
            <?php endif; ?>

            <form method="POST" action="" class="space-y-4 text-xs">
                <div>
                    <label class="block font-bold text-slate-700 mb-1">Usuário de Acesso</label>
                    <div class="relative">
                        <input type="text" name="usuario" value="admin" required class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-medium">
                        <div class="absolute left-3.5 top-3 text-slate-400">
                            <i class="fa-solid fa-user"></i>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-slate-700 mb-1">Senha</label>
                    <div class="relative">
                        <input type="password" name="senha" value="admin123" required class="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        <div class="absolute left-3.5 top-3 text-slate-400">
                            <i class="fa-solid fa-lock"></i>
                        </div>
                    </div>
                </div>

                <button type="submit" class="w-full bg-blue-950 hover:bg-blue-900 text-white font-extrabold py-3.5 rounded-xl transition shadow flex items-center justify-center space-x-2 uppercase tracking-wider">
                    <i class="fa-solid fa-right-to-bracket"></i>
                    <span>Entrar no Painel</span>
                </button>
            </form>

            <div class="pt-4 border-t border-slate-100 text-center text-xs text-slate-400 space-y-1">
                <p>Usuário padrão: <strong class="text-slate-700 font-mono">admin</strong> | Senha: <strong class="text-slate-700 font-mono">admin123</strong></p>
                <a href="../index.php" class="text-blue-900 hover:underline font-semibold block pt-2">
                    &larr; Voltar para a Loja Virtual
                </a>
            </div>
        </div>

    </div>

</body>
</html>
