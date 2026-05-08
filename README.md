# GitHub Automation Tests

Projeto de testes automatizados para validação de fluxo de autenticação, navegação e performance no GitHub, utilizando Cypress para testes E2E e K6 para testes de performance.

## Tecnologias Utilizadas

- **Node.js** (v18 ou superior)
- **Cypress** (v13.6.0) - Testes End-to-End
- **K6** - Testes de Performance
- **dotenv** - Gerenciamento de variáveis de ambiente

## Estrutura do Projeto

```
github-tests/
├── .github/
│   └── workflows/
│       └── test-automation.yml          # CI/CD GitHub Actions
├── cypress/
│   ├── e2e/
│   │   ├── github-authentication.cy.js  # Testes de autenticação
│   │   ├── github-repositories.cy.js    # Testes de repositórios
│   │   ├── github-logout.cy.js          # Testes de logout
│   │   ├── github-security.cy.js        # Testes de segurança
│   │   └── github-accessibility.cy.js   # Testes de acessibilidade
│   ├── support/
│   │   ├── commands.js                  # Comandos customizados
│   │   └── e2e.js                       # Configuração E2E
│   └── fixtures/                        # Dados de teste
├── k6-tests/
│   ├── login-performance.test.js        # Performance - Login
│   ├── repositories-performance.test.js # Performance - Repositórios
│   └── logout-performance.test.js       # Performance - Logout
├── docs/
│   ├── ARCHITECTURE.md                  # Documentação de arquitetura
│   ├── K6-INSTALLATION.md               # Guia de instalação K6
│   └── git-github-interview-guide.md    # 🎯 Guia de Entrevista Git/GitHub
├── cypress.config.js                    # Configuração do Cypress
├── package.json                         # Dependências
├── .env.example                         # Variáveis de ambiente
└── README.md                            # Este arquivo
```

## Pré-requisitos

### 1. Node.js e npm

Instale o Node.js (v18 ou superior) em: https://nodejs.org/

Verifique a instalação:
```bash
node --version
npm --version
```

### 2. K6

**Windows (PowerShell - Executar como Administrador):**
```powershell
winget install k6
```

**Download direto (recomendado para Windows):**
1. Baixe o instalador MSI: https://dl.k6.io/msi/k6-latest-amd64.msi
2. Execute o instalador
3. Verifique instalação: `k6 version`

**MacOS:**
```bash
brew install k6
```

**Linux:**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5A17DFBCA17AB24
sudo echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd github-tests
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas informações:

```env
GITHUB_EMAIL=seu-email@exemplo.com
GITHUB_PASSWORD=sua-senha-segura
GITHUB_USERNAME=seu-username
GITHUB_BASE_URL=https://github.com
CYPRESS_BASE_URL=https://github.com
```

**Importante:** Nunca commit o arquivo `.env` no repositório. Ele já está incluído no `.gitignore`.

## Executando os Testes

### Testes E2E com Cypress

#### Modo Interativo (GUI)

Abre a interface gráfica do Cypress para desenvolvimento e debugging:

```bash
npm run cypress:open
```

Na interface GUI:
- Selecione o teste desejado na lista
- Clique para executar individualmente
- Acompanhe execução em tempo real
- Use ferramentas de debug e inspeção

#### Modo Headless (Linha de comando)

Executa todos os testes em modo headless (ideal para CI/CD):

```bash
npm run cypress:run
```

#### Executar Teste Específico

Para executar um teste específico em modo headless:

```bash
npx cypress run --spec "cypress/e2e/github-authentication.cy.js"
npx cypress run --spec "cypress/e2e/github-repositories.cy.js"
npx cypress run --spec "cypress/e2e/github-logout.cy.js"
npx cypress run --spec "cypress/e2e/github-security.cy.js"
npx cypress run --spec "cypress/e2e/github-accessibility.cy.js"
```

#### Executar com Relatório HTML

Gera relatório detalhado em formato HTML:

```bash
npm run cypress:run:report
```

O relatório será salvo em `cypress/results/`

#### Consolidar Múltiplos Relatórios

Se executar testes separadamente, use este comando para consolidar relatórios:

```bash
npm run cypress:merge:reports
```

Isso cria um relatório unificado em `cypress/results/test-report.html`

### Testes de Performance com K6

#### Teste de Performance - Login

```bash
npm run k6:login
```

Ou diretamente:
```bash
k6 run k6-tests/login-performance.test.js
```

#### Teste de Performance - Repositórios

```bash
npm run k6:repos
```

Ou diretamente:
```bash
k6 run k6-tests/repositories-performance.test.js
```

#### Teste de Performance - Logout

```bash
npm run k6:logout
```

Ou diretamente:
```bash
k6 run k6-tests/logout-performance.test.js
```

#### Executar todos os testes K6

```bash
npm run k6:all
```

#### Executar teste combinado (recomendado)

```bash
k6 run k6-tests/all-performance-tests.js
```

Este script executa todos os 3 testes de performance em uma única execução:
- Login Performance
- Repositories Performance  
- Logout Performance

Duração: ~20 segundos para todos os testes combinados

## Cenários de Teste

### Testes E2E (Cypress)

#### 1. Autenticação e Navegação (`github-authentication.cy.js`)
- Abertura do navegador e acesso à homepage do GitHub
- Acesso à página de login
- Preenchimento de credenciais
- Autenticação bem-sucedida
- Validação de redirecionamento para dashboard
- Validação do nome do usuário abaixo da foto de perfil

#### 2. Interação com Repositórios (`github-repositories.cy.js`)
- Navegação até a aba Repositories
- Acesso a um repositório aleatório do perfil
- Navegação até a aba Pull Requests
- Criação de novo repositório utilizando XPath
- Acesso à tela do repositório criado

#### 3. Logout e Finalização (`github-logout.cy.js`)
- Deslogar da conta
- Validação de logout bem-sucedido
- Encerramento do teste

### Testes de Performance (K6)

#### 1. Login Performance (`login-performance.test.js`)
- Verificação do tempo de requisição ao acessar página de login
- Thresholds: p(95) < 3 segundos
- Taxa de sucesso > 95%

#### 2. Repositórios Performance (`repositories-performance.test.js`)
- Verificação do tempo de requisição ao acessar aba de repositórios
- Thresholds: p(95) < 3 segundos
- Taxa de sucesso > 95%

#### 3. Logout Performance (`logout-performance.test.js`)
- Verificação do tempo de requisição ao realizar logout
- Thresholds: p(95) < 2 segundos
- Taxa de sucesso > 95%

### Testes de Segurança (Cypress)

#### 4. Validações de Segurança (`github-security.cy.js`)
- Validação de conexão segura (HTTPS)
- Verificação de headers de segurança
- Validação de não exposição de dados sensíveis
- Verificação de atributos secure/httpOnly em cookies

### Testes de Acessibilidade (Cypress)

#### 5. Compliance de Acessibilidade (`github-accessibility.cy.js`)
- Validação de estrutura de formulários (labels associadas)
- Verificação de atributos ARIA
- Validação de indicadores de foco
- Verificação de mensagens de erro acessíveis

## Fluxo Completo de Execução

### 1. Configuração Inicial
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais GitHub
```

### 2. Executar Testes E2E (Cypress)

#### Desenvolvimento e Debug
```bash
npm run cypress:open
```

#### Testes Automatizados
```bash
# Todos os testes
npm run cypress:run

# Teste específico
npx cypress run --spec "cypress/e2e/github-authentication.cy.js"

# Com relatório HTML
npm run cypress:run:report
```

### 3. Executar Testes de Performance (K6)

#### Individual
```bash
npm run k6:login
npm run k6:repos
npm run k6:logout
```

#### Combinado (Recomendado)
```bash
k6 run k6-tests/all-performance-tests.js
```

### 4. Relatórios e Resultados

- **Cypress:** `cypress/results/` (relatórios HTML)
- **K6:** Saída no terminal com métricas detalhadas

## Scripts NPM Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run cypress:open` | Abre Cypress em modo interativo |
| `npm run cypress:run` | Executa Cypress em modo headless |
| `npm run cypress:run:report` | Executa com relatório HTML (mochawesome) |
| `npm run cypress:merge:reports` | Consolida relatórios em único arquivo |
| `npm run k6:login` | Executa teste de performance de login |
| `npm run k6:repos` | Executa teste de performance de repositórios |
| `npm run k6:logout` | Executa teste de performance de logout |
| `npm run k6:all` | Executa todos os testes K6 individualmente |

## Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `GITHUB_EMAIL` | Email da conta GitHub | Sim |
| `GITHUB_PASSWORD` | Senha da conta GitHub | Sim |
| `GITHUB_USERNAME` | Nome de usuário do GitHub | Sim |
| `GITHUB_BASE_URL` | URL base do GitHub | Não (default: https://github.com) |
| `CYPRESS_BASE_URL` | URL base para Cypress | Não (default: https://github.com) |

## CI/CD com GitHub Actions

O projeto inclui workflow automatizado em `.github/workflows/test-automation.yml`:

### Triggers
- Push para branches `main` e `develop`
- Pull requests para `main`
- Schedule semanal (segundas-feiras às 8h)

### Jobs
1. **Cypress E2E Tests**: Executa em Ubuntu com Chrome
2. **K6 Performance Tests**: Executa testes de carga

### Configuração de Secrets
Adicione os secrets no repositório GitHub:
- `GITHUB_EMAIL`
- `GITHUB_PASSWORD`
- `GITHUB_USERNAME`

## Governança de Dados e Compliance

### Para Empresas de Dados Sensíveis (Advocacia/Imobiliário)

| Aspecto | Implementação | Justificativa |
|---------|---------------|---------------|
| Criptografia em Trânsito | HTTPS obrigatório | Proteção de credenciais |
| Criptografia em Repouso | `.env` local + GitHub Secrets | LGPD/Compliance |
| Logging Seguro | `{ log: false }` em credenciais | Prevenção de vazamento |
| Isolamento de Sessão | `cy.session()` com cache | Prevenção de cross-contamination |
| Validação de Headers | Testes de segurança | Proteção contra ataques |
| Acessibilidade | Testes a11y | LGPD/Inclusão digital |
| Retenção de Dados | 30 dias (artefatos) | GDPR/LGPD |

## Requisitos e Clean Code

O projeto segue estritamente os requisitos de Clean Code:
- **NÃO incluir comentários explicativos** no código
- Código deve ser autoexplicativo e claro
- Nomenclatura descritiva e semântica
- Funções pequenas e focadas em única responsabilidade
- Estrutura organizada e padrões consistentes
- Seletores específicos e manuteníveis

## Troubleshooting

### Erro de autenticação no GitHub
- Verifique se as credenciais no arquivo `.env` estão corretas
- Certifique-se de que a conta não possui 2FA habilitada ou use um token de acesso

### K6 não encontrado
- Verifique se o K6 está instalado: `k6 version`
- Adicione o K6 ao PATH do sistema
- **Windows:** Se `k6 version` falhar, use o instalador MSI direto

### Erro "timeout" no K6
- Remova `timeout: 'Xs'` das opções de exportação
- Use timeout nas requisições individuais se necessário

### Alta taxa de falha nos testes K6
- Verifique conectividade com o GitHub: `ping github.com`
- Ajuste thresholds para expectativas realistas
- Use `discardResponseBodies: false` para melhor depuração

### Cypress não abre
- Execute `npx cypress install` para reinstalar o binário
- Verifique se o Node.js está atualizado

### Erro de variáveis de ambiente não carregadas
- Verifique se o arquivo `.env` existe na raiz do projeto
- Certifique-se de que o dotenv está instalado: `npm list dotenv`

## Considerações de Segurança

- Nunca armazene credenciais reais em arquivos de código
- Use sempre o arquivo `.env` para variáveis sensíveis
- O `.env` está incluso no `.gitignore` para evitar commit acidental
- Considere usar GitHub Secrets para CI/CD

## Status do Projeto

### ✅ Testes Funcionando

**Cypress E2E Tests:**
- ✅ Accessibility Tests: 4/4 passing
- ✅ Security Tests: 4/4 passing  
- ✅ Authentication Tests: Prontos para execução
- ✅ Repository Tests: Prontos para execução
- ✅ Logout Tests: Prontos para execução

**K6 Performance Tests:**
- ✅ Login Performance: 100% sucesso
- ✅ Repositories Performance: 100% sucesso
- ✅ Logout Performance: 100% sucesso
- ✅ Combined Performance Test: 100% sucesso

### 📊 Métricas de Performance

| Teste | Taxa Sucesso | Tempo Médio | Threshold |
|-------|--------------|-------------|-----------|
| Login K6 | 100% | 76ms | p(95)<3000ms |
| Repositories K6 | 100% | 232ms | p(95)<3000ms |
| Logout K6 | 100% | 284ms | p(95)<2000ms |

---

## 🎯 Guia de Entrevista Git/GitHub

### ✅ **Perguntas de Entrevista Respondidas**

Documentação completa com respostas detalhadas para perguntas de entrevista sobre Git e GitHub focadas em qualidade e desenvolvimento.

**📋 Tópicos Cobertos:**
- ✅ Workflow de desenvolvimento (branch, commit, push)
- ✅ Resolução de conflitos de merge
- ✅ Investigação de bugs com git bisect
- ✅ Validação de branches (develop/beta/main)
- ✅ Análise de código vs deploy
- ✅ Troubleshooting de pipeline
- ✅ Critérios de bloqueio para produção
- ✅ Interface GitHub e Pull Requests

**🔗 Acesso Direto:**
➡️ **[Ver Guia Completo](github-tests/docs/git-github-interview-guide.md)**

**⭐ Destaques:**
- Comandos seguros e melhores práticas
- Foco em processo e evidências
- Interface GitHub e pipeline

---

## Licença

MIT

## Autor

QA Analyst - Diego Alcântara
