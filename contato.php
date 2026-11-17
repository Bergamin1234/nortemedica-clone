<?php
$pageTitle = "Contato e Cotações para Hospitais e Licitações";
require_once __DIR__ . '/header.php';

$enviado = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $enviado = true;
}
?>

<div class="bg-slate-100 border-b border-slate-200 py-3 text-xs">
    <div class="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
        <a href="index.php" class="hover:text-blue-950 font-medium">Início</a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <span class="text-slate-800 font-bold">Fale Conosco & Licitações</span>
    </div>
</div>

<main class="max-w-6xl mx-auto px-4 py-12 flex-1 space-y-10">
    
    <div class="text-center space-y-2 max-w-xl mx-auto">
        <h1 class="text-3xl font-black text-blue-950">Atendimento Especializado</h1>
        <p class="text-xs sm:text-sm text-slate-500">
            Fale diretamente com nosso setor de vendas corporativas, cotações para hospitais, clínicas e editais de licitação pública.
        </p>
    </div>

    <?php if ($enviado): ?>
        <div class="bg-emerald-50 border border-emerald-300 text-emerald-900 p-6 rounded-3xl text-center max-w-md mx-auto space-y-2">
            <i class="fa-solid fa-circle-check text-4xl text-emerald-600"></i>
            <h3 class="font-bold text-lg">Mensagem Recebida com Sucesso!</h3>
            <p class="text-xs">Nossa equipe comercial retornará o contato no seu e-mail ou WhatsApp nas próximas horas úteis.</p>
            <a href="index.php" class="inline-block mt-3 bg-blue-950 text-white font-bold text-xs px-4 py-2 rounded-xl">Voltar para a Loja</a>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Formulário de Cotação -->
            <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <h2 class="text-lg font-black text-blue-950 mb-1 flex items-center">
                    <i class="fa-solid fa-file-invoice text-emerald-600 mr-2"></i> Solicitar Cotação / Enviar Mensagem
                </h2>
                <p class="text-xs text-slate-400 mb-6">Preencha os dados abaixo para receber nossa proposta formal com faturamento e prazos.</p>

                <form method="POST" action="" class="space-y-4 text-xs">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-slate-700 mb-1">Nome / Razão Social *</label>
                            <input type="text" name="nome" required placeholder="Seu nome ou nome da instituição" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">CPF ou CNPJ *</label>
                            <input type="text" name="doc" required placeholder="00.000.000/0000-00" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">E-mail Comercial *</label>
                            <input type="email" name="email" required placeholder="compras@hospital.com.br" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div>
                            <label class="block font-bold text-slate-700 mb-1">WhatsApp / Telefone com DDD *</label>
                            <input type="text" name="tel" required placeholder="(69) 90000-0000" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800">
                        </div>

                        <div class="sm:col-span-2">
                            <label class="block font-bold text-slate-700 mb-1">Assunto / Tipo de Atendimento *</label>
                            <select name="assunto" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800 font-medium">
                                <option>Cotação para Clínica ou Hospital Privado</option>
                                <option>Pregão Público / Licitação Governamental</option>
                                <option>Assistência Técnica e Manutenção de Equipamentos</option>
                                <option>Dúvidas sobre Pedido ou Entrega</option>
                                <option>Outros Assuntos</option>
                            </select>
                        </div>

                        <div class="sm:col-span-2">
                            <label class="block font-bold text-slate-700 mb-1">Lista de Produtos de Interesse ou Mensagem *</label>
                            <textarea name="mensagem" rows="4" required placeholder="Descreva os equipamentos, quantidades e especificações desejadas..." class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-slate-800"></textarea>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-blue-950 hover:bg-blue-900 text-white font-extrabold py-3.5 px-6 rounded-xl transition shadow flex items-center justify-center space-x-2 text-xs uppercase tracking-wider">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>Enviar Solicitação de Cotação</span>
                    </button>
                </form>
            </div>

            <!-- Dados de Contato e Canais Diretos -->
            <div class="lg:col-span-5 space-y-6">
                
                <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
                    <h3 class="font-black text-blue-950 text-sm uppercase tracking-wider border-b pb-3">Canais Diretos de Atendimento</h3>
                    
                    <div class="space-y-3 text-slate-600">
                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-950 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-phone"></i>
                            </div>
                            <div>
                                <span class="block font-bold text-slate-900">Televendas e PABX:</span>
                                <span><?php echo SITE_TELEFONE; ?></span>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <i class="fa-brands fa-whatsapp text-base"></i>
                            </div>
                            <div>
                                <span class="block font-bold text-slate-900">WhatsApp Comercial:</span>
                                <span>Atendimento ágil para todo o Brasil</span>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                            <div>
                                <span class="block font-bold text-slate-900">E-mail Comercial:</span>
                                <span><?php echo SITE_EMAIL; ?></span>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-gavel"></i>
                            </div>
                            <div>
                                <span class="block font-bold text-slate-900">Setor de Licitações:</span>
                                <span>licita@nortemedica.com</span>
                            </div>
                        </div>

                        <div class="flex items-start space-x-3">
                            <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <div>
                                <span class="block font-bold text-slate-900">Endereço da Sede:</span>
                                <span><?php echo SITE_ENDERECO; ?></span>
                            </div>
                        </div>
                    </div>

                    <div class="pt-2">
                        <a href="https://wa.me/<?php echo SITE_WHATSAPP; ?>" target="_blank" class="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-center shadow transition flex items-center justify-center space-x-2">
                            <i class="fa-brands fa-whatsapp text-lg"></i>
                            <span>Abrir Conversa no WhatsApp</span>
                        </a>
                    </div>
                </div>

                <div class="bg-gradient-to-br from-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-sm text-xs space-y-2">
                    <span class="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Dados Cadastrais</span>
                    <h4 class="font-bold text-sm text-white">NORTEMÉDICA COMÉRCIO E REPRESENTAÇÕES LTDA</h4>
                    <p class="text-slate-300">CNPJ: 06.273.744/0001-40</p>
                    <p class="text-slate-300">Porto Velho - Rondônia - Brasil</p>
                </div>

            </div>

        </div>
    <?php endif; ?>

</main>

<?php require_once __DIR__ . '/footer.php'; ?>
