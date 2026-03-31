<p align="center">
  <img src="frontend/src/app/icon.png" width="128" height="128">
</p>

<h1 align="center">VR Rookie Downloader</h1>

<p align="center">
  🌐 <a href="README-PT.md">Português</a> | <a href="README.md">English</a>
</p>

<p align="center">
  Sistema avançado e automatizado para catálogo, download e instalação (sideloading) de conteúdo VR a partir do Rutracker.
</p>

<p align="center">
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/></a>
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
</p>

## Aviso Legal (Disclaimer)

O **VR Rookie Downloader** é uma ferramenta de indexação técnica. É imperativo compreender a natureza do software:

- **Apenas Indexação:** Este sistema não hospeda, armazena ou distribui qualquer tipo de conteúdo protegido por direitos autorais. O software funciona exclusivamente como um rastreador (scraper) que organiza metadados de fontes de terceiros (Fórum Rutracker).
- **Isenção de Responsabilidade:** O projeto é fornecido "como está", sem garantias de qualquer tipo. O uso desta ferramenta para acessar ou baixar conteúdo é de inteira e exclusiva responsabilidade do usuário final.
- **Propriedade Intelectual:** Respeitamos os direitos de propriedade intelectual. Caso você seja proprietário de algum conteúdo e deseja que ele não seja acessível através dos meios de busca padrão, por favor, entre em contato com as fontes originais indexadas.
- **Desenvolvimento:** Este aplicativo foi construído com o auxílio de ferramentas de IA para otimização de código e design.
- **Finalidade:** O software foi desenhado para facilitar a organização de bibliotecas VR pessoais e estudos técnicos de automação de sistemas.

## TLDR; Jogos no seu VR em poucos passos

1. Abra o aplicativo e siga o **Assistente de Configuração Inicial (Setup Wizard)** para validar sua sessão, dependências (ADB/qBittorrent) e idioma.
2. Inicie o indexador para construir seu catálogo.
3. Escolha um jogo, baixe via qBitTorrent e instale no Quest via USB.

## Funcionalidades Dinâmicas

### Indexação de Links do Rutracker

**Captura automatizada de metadados diretamente do fórum original**

- Extração de **Gênero**, **Versão**, **Desenvolvedor** e estatísticas de **Seeds/Leechers**.
- **Sistema Multi-idioma:** Interface disponível em **Inglês (padrão)** e **Português**, com troca dinâmica nas configurações.
- **Tradução Flexível:** Escolha o idioma de destino para as traduções dos jogos (Inglês ou Português).
- **Interface Otimizada:** Botão para ocultar/mostrar a barra lateral de filtros para focar na visualização dos jogos.

### Gestão de Downloads

**Integração total com o qBitTorrent Web UI**

- Controle remoto de downloads.
- Monitoramento de progresso em tempo real diretamente na biblioteca.
- Sincronização automática entre arquivos físicos no HD e o banco de dados.

### Sideloading

**Instalação nativa via ADB (Android Debug Bridge)**

- Transferência automatizada de arquivos APK e pastas de dados (OBB).
- Suporte para múltiplos dispositivos detectados via USB.

## 🛠️ Instalação

> **Nota:** O projeto atualmente funciona melhor no Windows. O suporte para MacOS é experimental (o sideloading requer configuração manual do ADB).

### 1. Pré-requisitos
- **[Node.js](https://nodejs.org/)** (v18.x ou superior)
- **[Git](https://git-scm.com/)**

### 2. Configuração Automática (Windows)
Clone o repositório e execute o script de instalação. O script verificará automaticamente o Node.js, instalará as dependências do projeto e baixará/configurará opcionalmente o **ADB** e o **qBitTorrent** para você!

```powershell
git clone https://github.com/yGuilhermy/VRRookieDownloader.git
cd VRRookieDownloader
.\setup.bat
```
*(Durante a instalação, você será questionado se deseja instalar o qBitTorrent automaticamente caso ele não seja encontrado no seu sistema.)*

### 3. Configuração do qBitTorrent
Caso você tenha instalado o qBitTorrent manualmente ou queira verificar a instalação automática, você **DEVE** ativar a Web UI:
1. Abra o qBitTorrent e vá em `Ferramentas` -> `Opções` -> `Web UI`.
2. Marque a caixa **Interface de Usuário da Web (Controle Remoto)**.
3. Endereço IP: `127.0.0.1` | Porta: `8080` (Padrão).
4. Autenticação: Usuário `admin` | Senha `adminadmin`. *(Se você alterar a senha, deverá atualizar a função `loginQbit` no arquivo `backend/src/index.ts`)*.
5. *(Opcional)* Marque **Ignorar autenticação para clientes no host local** para simplificar a conexão e melhorar a estabilidade.

### 4. Executando o App
```powershell
.\start.bat
```
_Execute como Administrador se desejar utilizar o domínio local `http://vrrookie.local` para acessá-lo a partir de outros dispositivos na sua rede._

## 🎮 Guia de Uso

### 1. Assistente de Configuração (Setup Wizard)
Ao abrir pela primeira vez, o **Setup Wizard** receberá você. Ele valida automaticamente o ambiente:
- Verifica se o **ADB** está disponível globalmente para o sideloading.
- Testa a conexão com a **Web UI do qBitTorrent**.
- Valida a sessão do **RuTracker** (resolvendo captchas e login em segundo plano).
- Define e constrói a sua **Pasta Global de Jogos**.

### 2. Navegação e Downloads
- Use a **Barra Lateral de Filtros** para pesquisar por gêneros, desenvolvedores ou texto. Você pode ocultar a barra para uma visão mais focada.
- Clique no card de um jogo para ver os detalhes completos e informações traduzidas.
- Clique em **Baixar no Servidor** para enviar o link magnético diretamente para o qBitTorrent. A interface mostrará o progresso em tempo real.

### 3. Sideloading para o Quest
- Assim que o download atingir 100%, o botão do jogo mudará para **Instalar no Quest**.
- Conecte o seu Meta Quest via cabo USB (certifique-se de que o Modo Desenvolvedor e a Depuração USB estejam ativos).
- Clique no botão de instalar ou navegue até a guia **Sideloading** para gerenciar múltiplos APKs/OBBs locais de uma vez. O app transferirá e configurará os arquivos `.apk` e `.obb` no headset automaticamente.

### 4. Utilizando um Cliente Torrent Externo (Opcional)
Se você optar por não utilizar o qBitTorrent integrado, é possível baixar os arquivos com qualquer outro cliente padrão (ex: uTorrent, Vuze):
1. Na página do jogo, clique em **Baixar** (no texto abaixo do botão principal) para abrir o magnet link no seu aplicativo torrent padrão.
2. Após o término e seed do download, **copie ou mova a pasta final do jogo** para a sua **Pasta Global de Jogos** (configurada no app).
3. Vá até a aba de **Meus Jogos (Sideloading)** e ative o botão para **atualizar / mostrar pastas locais**.
4. Encontre a pasta adicionada na lista de pastas não-indexadas, clique nela e mande **Indexar o Jogo** de forma manual. Pronto, a opção de instalar ficará habilitada!

## ☑️ To-Do (Lista de Tarefas)

- [ ] Criar um `.exe` compilado para execução com apenas 1 clique (Release).
- [ ] Adicionar suporte a múltiplas fontes de indexação além do RuTracker.
- [ ] Implementar scripts de instalação nativos para MacOS/Linux (`setup.sh`).
- [ ] Configurar a WebUI do qBitTorrent automaticamente via alteração nos arquivos de configuração do PC.
- [x] Quebra de captcha do RuTracker completamente em segundo plano.
- [x] Suporte multi-idioma global (Inglês/Português).

## Stack Técnica

| Camada           | Tecnologia                                       |
| :--------------- | :----------------------------------------------- |
| **Frontend**     | Next.js 15 (App Router), Tailwind CSS, Shadcn UI |
| **Backend**      | Node.js, Express, TypeScript                     |
| **Persistência** | SQLite (Better-SQLite3)                          |
| **Automação**    | Puppeteer Stealth, Cheerio, ADB Tools            |
| **Comunicação**  | Socket.io, React Query, Zustand                  |

---

_Gerencie sua biblioteca VR local com eficiência e automação._
