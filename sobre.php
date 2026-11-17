<?php
$pageTitle = "Quem Somos - História e Assistência Técnica";
require_once __DIR__ . '/header.php';
?>

<div class="bg-slate-100 border-b border-slate-200 py-3 text-xs">
    <div class="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-slate-500">
        <a href="index.php" class="hover:text-blue-950 font-medium">Início</a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
        <span class="text-slate-800 font-bold">Quem Somos</span>
    </div>
</div>

<main class="max-w-5xl mx-auto px-4 py-12 flex-1 space-y-12">
    
    <!-- Hero Sobre -->
    <div class="text-center space-y-4">
        <span class="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            Desde Maio de 2004 em Porto Velho - RO
        </span>
        <h1 class="text-3xl md:text-5xl font-black text-blue-950 tracking-tight">
            Norte Médica Comércio e Representações
        </h1>
        <p class="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Especialistas no fornecimento de equipamentos médico-hospitalares, insumos cirúrgicos e laboratoriais de alta precisão para a Região Norte e todo o território nacional.
        </p>
    </div>

    <!-- Foto / Banner -->
    <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative h-72 sm:h-96">
        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80" 
             alt="Hospital e Centro Cirúrgico" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent flex items-end p-8">
            <div class="text-white">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Excelência na Saúde</span>
                <h3 class="text-xl md:text-2xl font-black">Tecnologia Médica para Salvar Vidas</h3>
            </div>
        </div>
    </div>

    <!-- Valores e Pilares -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl">
                <i class="fa-solid fa-bullseye"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-base">Nossa Missão</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
                Fornecer tecnologias e equipamentos de suporte à vida e diagnóstico com confiabilidade absoluta, atendendo hospitais, clínicas e profissionais de saúde com agilidade e ética.
            </p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl">
                <i class="fa-solid fa-eye"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-base">Nossa Visão</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
                Consolidar a liderança como o maior hub distribuidor médico e polo de assistência técnica de engenharia clínica da Amazônia Ocidental e do Brasil.
            </p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
                <i class="fa-solid fa-shield-heart"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-base">Nossos Valores</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
                Rigor técnico nas homologações ANVISA, integridade nas contratações públicas e privadas, pronta entrega e compromisso inegociável com a vida.
            </p>
        </div>
    </div>

    <!-- Assistência Técnica Autorizada -->
    <div id="assistencia" class="bg-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="space-y-4">
            <span class="text-xs font-bold uppercase tracking-widest text-emerald-400">Engenharia Clínica Especializada</span>
            <h2 class="text-2xl md:text-3xl font-black">Assistência Técnica Autorizada</h2>
            <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Além do fornecimento comercial, a Norte Médica dispõe de corpo técnico especializado para manutenções preventivas, corretivas e calibrações com padrões rastreáveis RBC/INMETRO.
            </p>
            <ul class="space-y-2 text-xs text-slate-300">
                <li class="flex items-center"><i class="fa-solid fa-check text-emerald-400 mr-2"></i> Peças de reposição 100% originais de fábrica</li>
                <li class="flex items-center"><i class="fa-solid fa-check text-emerald-400 mr-2"></i> Laudos e certificados de calibração para fiscalização</li>
                <li class="flex items-center"><i class="fa-solid fa-check text-emerald-400 mr-2"></i> Atendimento emergencial para UTIs e centros cirúrgicos</li>
            </ul>
            <div class="pt-2">
                <a href="https://wa.me/<?php echo SITE_WHATSAPP; ?>" target="_blank" class="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow">
                    <i class="fa-brands fa-whatsapp text-base"></i>
                    <span>Falar com Engenharia Clínica</span>
                </a>
            </div>
        </div>

        <div class="bg-blue-900/60 border border-blue-800 rounded-2xl p-6 space-y-4 text-xs">
            <h4 class="font-bold text-white text-sm uppercase tracking-wider">Principais Marcas Atendidas</h4>
            <div class="grid grid-cols-2 gap-3 font-semibold text-slate-200">
                <div class="bg-blue-950 p-2.5 rounded-lg border border-blue-800 text-center">INSTRAMED</div>
                <div class="bg-blue-950 p-2.5 rounded-lg border border-blue-800 text-center">SERCON</div>
                <div class="bg-blue-950 p-2.5 rounded-lg border border-blue-800 text-center">MAGNAMED</div>
                <div class="bg-blue-950 p-2.5 rounded-lg border border-blue-800 text-center">PROTEC</div>
                <div class="bg-blue-950 p-2.5 rounded-lg border border-blue-800 text-center">SINNOWA</div>
                <div class="bg-blue-950 p-2.5 rounded-lg border border-blue-800 text-center">INBRAMED</div>
            </div>
            <p class="text-slate-400 text-[11px] text-center pt-2">
                Sede própria na Rua Guanabara, 1275 - Bairro Nossa Senhora das Graças, Porto Velho - RO.
            </p>
        </div>
    </div>

</main>

<?php require_once __DIR__ . '/footer.php'; ?>
