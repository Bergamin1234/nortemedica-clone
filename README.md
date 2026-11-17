# 🏥 Norte Médica - Clone E-Commerce Médico-Hospitalar

Clone completo e modernizado da plataforma da **Norte Médica** (Comércio e Representações Ltda. - Porto Velho/RO), focado na distribuição e comércio atacadista/varejista de equipamentos e suprimentos médico-hospitalares, cirúrgicos e laboratoriais.

Construído com tecnologia leve, ultra-rápida e **100% compatível com Hospedagem HostGator (Alligator) / cPanel**, pronto para rodar sem etapas complexas de compilação: **é só inserir os arquivos e usar**.

---

## 🌟 Principais Recursos e Funcionalidades

### 🛒 Loja Virtual & Catálogo de Produtos
- **Catálogo Completo com TODOS os 190 Produtos Reais da Norte Médica**:
  - Extração completa de 100% dos produtos do site oficial com fotos em alta resolução no CDN CloudFront original.
  - 13 Departamentos Médicos / Cirúrgicos e 79 Marcas Fabricantes (Instramed, Sercon, Magnamed, Protec, Welmy, Baumer, Riester, Mindray, Yuwell, Deltronix, etc.).
  - Monitores Multiparâmetricos de UTI, Desfibriladores Bifásicos, Autoclaves Sercon, Ventiladores Pulmonares, Pranchas de Imobilização, Bisturis Eletrônicos, Balanças Welmy, Otoscópios, Centrífugas Clínicas, Sensores de Oximetria SpO2, Traqueias de Silicone, Seladoras, Filtros HMEF e Descartáveis.
- **Busca Instantânea Inteligente**: Busca com autocomplete dinâmico por nome, SKU ou marca fabricante.
- **Filtros por Categorias e Marcas**: Navegação por departamentos (Hospitalar, Cirúrgico, Esterilização, Oxigenoterapia, Resgate, Laboratório).
- **Página de Detalhes do Produto**:
  - Zoom na foto do produto e selos ANVISA / Garantia
  - Ficha técnica e especificações completas
  - Simulador de frete por CEP em tempo real (PAC, SEDEX e Transportadora Especializada)
  - Cálculo de parcelamento em até 12x (até 6x sem juros)
  - Desconto exclusivo de 10% à vista no Pix
  - Botão de Cotação Rápida para Clínicas e Hospitais no WhatsApp

### 💳 Sistema Completo de Compra e Venda
- **Carrinho Dinâmico**: Gaveta lateral flutuante (Drawer) e página completa de carrinho, com atualização instantânea de quantidades, valores e cálculo de subtotal.
- **Checkout Seguro**:
  - Suporte a **Pessoa Física (CPF)** e **Pessoa Jurídica / Hospital (CNPJ / Razão Social / IE)**
  - Preenchimento automático do endereço ao digitar o CEP via API ViaCEP
  - **Pagamento com PIX**: Gera QR Code dinâmico + Código Pix "Copia e Cola" com 10% de desconto
  - **Pagamento com Cartão de Crédito**: Aceita as principais bandeiras com cálculo de parcelas em até 12x
  - **Boleto Bancário / Faturamento Hospitalar**: Geração de linha digitável e instruções de pagamento
  - Tela de Pedido Concluído (`pedido-sucesso.php`) com resumo completo, número do pedido e botão de envio do comprovante direto para o WhatsApp da loja

### 🛠️ Painel Administrativo Completo (`/admin`)
- **Dashboard de Métricas**: Faturamento total em R$, quantidade de pedidos, pedidos pendentes e total de produtos.
- **Gerenciador de Produtos**:
  - Criar novos produtos, editar preços "De/Por", estoque, imagem e fichas técnicas
  - Ativar/Desativar produtos e definir itens em destaque ou lançamentos
  - Exclusão com confirmação
- **Gestão de Pedidos**:
  - Listagem de todas as vendas realizadas com filtros de status
  - Visualização dos dados do cliente, itens comprados, endereço de entrega e valores
  - Atualização do status do pedido (*Em Processamento*, *Separando Estoque*, *Enviado*, *Concluído*, *Cancelado*)
  - Acesso direto ao WhatsApp do cliente com 1 clique

---

## 🐊 Compatibilidade HostGator ("Alligator")

O sistema possui motor dual de banco de dados:
1. **Modo Instantâneo (SQLite)**: Se você apenas enviar a pasta para a `public_html` da HostGator, o sistema detecta e ativa o banco de dados local com todos os produtos e o admin pré-carregados!
2. **Modo MySQL cPanel**: Inclui o instalador visual `install.php` para conectar ao MySQL da HostGator com 1 clique, além do script `database.sql` para importação direta no phpMyAdmin.

> 📖 **Consulte o arquivo [GUIA_HOSTGATOR.md](file:///C:/Users/02555331280/.gemini/antigravity/scratch/nortemedica-clone/GUIA_HOSTGATOR.md) para o passo a passo ilustrado de como hospedar em menos de 3 minutos!**

---

## 📂 Estrutura de Arquivos

```
nortemedica-clone/
├── .htaccess              # Regras Apache, gzip e URLs amigáveis para cPanel
├── config.php             # Configuração da loja, chaves e banco de dados
├── db.php                 # Conexão PDO com auto-detecção MySQL/SQLite
├── install.php            # Instalador visual 1-clique para HostGator
├── index.php              # Página inicial da loja (vitrine e banners)
├── produto.php            # Página de detalhes e cálculo de frete
├── carrinho.php           # Página do carrinho de compras
├── checkout.php           # Finalização da compra (PIX, Cartão, Boleto)
├── pedido-sucesso.php     # Confirmação do pedido com QR Code Pix
├── sobre.php              # Quem Somos e Assistência Técnica
├── contato.php            # Cotações para Hospitais e Licitações
├── api.php                # API AJAX interna para carrinho, busca e frete
├── database.sql           # Script SQL completo para phpMyAdmin
├── GUIA_HOSTGATOR.md      # Manual de hospedagem na HostGator
├── README.md              # Documentação oficial
├── admin/                 # Painel Administrativo
│   ├── index.php          # Dashboard de métricas e pedidos recentes
│   ├── login.php          # Tela de login segura
│   ├── logout.php         # Encerramento de sessão
│   ├── produtos.php       # Cadastro e edição de produtos
│   └── pedidos.php        # Gestão de pedidos e alteração de status
└── assets/
    ├── css/custom.css     # Estilos e paleta de cores Norte Médica
    └── js/
        ├── app.js         # Carrinho dinâmico, busca rápida e notificações
        └── checkout.js    # Máscaras de CPF/CNPJ/CEP e checkout
```

---

## 🔑 Credenciais Padrão do Painel Admin

- **URL**: `https://seusite.com.br/admin/login.php`
- **Usuário**: `admin`
- **Senha**: `admin123`

*(A senha e os dados da loja podem ser alterados nas configurações ou diretamente no banco de dados).*

---

## 💻 Teste Local com PHP Embutido

Caso deseje rodar localmente no seu computador antes de enviar para a HostGator, abra o terminal na pasta do projeto e execute:

```bash
php -S localhost:8000
```

E acesse `http://localhost:8000` no seu navegador.
