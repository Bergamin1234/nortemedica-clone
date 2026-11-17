# 🐊 Guia Definitivo: Como Hospedar na HostGator ("Alligator") com Facilidade (Só Inserir)

Este projeto foi construído sob medida com arquitetura **Zero-Config** para rodar nativamente em qualquer plano da **HostGator** (Compartilhada P, M, Turbo, Plus, Resenda ou VPS com cPanel), sem precisar de Node.js, compilações ou comandos de terminal.

---

## ⚡ Método 1: Modo Instantâneo ("Só Inserir e Rodar")

Neste modo, você **não precisa criar banco de dados no cPanel nem mexer em senhas**. A loja utiliza um motor de banco embutido ultrarrápido (SQLite) com todos os produtos médicos, categorias e painel admin já configurados de fábrica!

1. **Acesse o cPanel da HostGator**:
   - Entre no painel da HostGator e clique em **cPanel**.
2. **Abra o Gerenciador de Arquivos**:
   - Vá na pasta **`public_html`** (que é a raiz do seu site).
3. **Faça o Upload dos Arquivos**:
   - Compacte a pasta do projeto em formato `.zip`.
   - Clique em **Carregar (Upload)** no topo do cPanel e envie o arquivo `.zip`.
   - Após o upload, clique com o botão direito no `.zip` e selecione **Extrair (Extract)** direto na pasta `public_html`.
4. **Pronto! Acesse seu Domínio**:
   - Abra seu site no navegador (ex: `https://seusite.com.br`).
   - A loja já estará no ar, com carrinho, fotos em alta resolução, vitrine de produtos hospitalares e checkout funcionando!

---

## 🚀 Método 2: Conectando com MySQL do cPanel (1-Clique via Instalador Web)

Se você preferir usar o banco MySQL tradicional da HostGator gerenciado pelo phpMyAdmin:

1. **No cPanel da HostGator**:
   - Vá em **"Assistente de Banco de Dados MySQL"**.
   - Crie um banco (exemplo: `seuusuario_nortemedica`).
   - Crie um usuário e senha (exemplo: `seuusuario_admin`).
   - Marque a caixinha **"Todos os Privilégios"** e salve.
2. **Acesse o Instalador Web**:
   - No seu navegador, acesse: `https://seusite.com.br/install.php`
   - O instalador verificará automaticamente a compatibilidade do servidor.
   - Digite o nome do banco, usuário e senha que você acabou de criar.
   - Clique no botão **"Conectar e Criar Tabelas MySQL"**.
3. **Sucesso Imediato**:
   - O instalador cria todas as tabelas (`produtos`, `pedidos`, `categorias`, etc.), insere os produtos de exemplo e atualiza o arquivo `config.php` sozinho.

---

## 🔐 Acesso ao Painel Administrativo

Para gerenciar seus produtos, preços, estoque e ver os pedidos recebidos:

- **Link de Acesso**: `https://seusite.com.br/admin/login.php`
- **Usuário Padrão**: `admin`
- **Senha Padrão**: `admin123`

---

## ⚙️ Como Alterar WhatsApp, Chave Pix e Dados da Loja

Você pode alterar os dados de contato a qualquer momento diretamente no arquivo **`config.php`**:

1. No cPanel da HostGator, vá no **Gerenciador de Arquivos**.
2. Clique com o botão direito em **`config.php`** e selecione **Edit (Editar)**.
3. Modifique as linhas desejadas:
   ```php
   define('SITE_NOME', 'Sua Loja Médica');
   define('SITE_TELEFONE', '(69) 3229-4500');
   define('SITE_WHATSAPP', '5569999887766'); // Número com DDD para onde irão os pedidos
   define('SITE_CHAVE_PIX', 'seu-cnpj-ou-chave-pix');
   define('DESCONTO_PIX_PERCENTUAL', 10); // 10% de desconto
   define('VALOR_FRETE_GRATIS', 1500.00); // Frete grátis acima de R$ 1.500
   ```
4. Clique em **Salvar Alterações**. Pronto!

---

## 🛡️ Dúvidas Frequentes da HostGator

- **O SSL (HTTPS) é automático?**
  Sim! A HostGator oferece certificado SSL Grátis (Let's Encrypt). Basta ativar no cPanel em "Status do SSL/TLS". O arquivo `.htaccess` incluso já redireciona todo o tráfego com segurança.
- **Funciona com PHP 8.x?**
  Sim, 100% testado e compatível com PHP 7.4, 8.0, 8.1, 8.2 e 8.3 da HostGator.
- **Preciso rodar comandos via SSH?**
  Não! Nenhum comando via terminal é necessário. É literalmente só inserir os arquivos na HostGator.
