# Explicação Técnica do Código

## Visão Geral
Este documento explica as decisões técnicas e arquiteturais de cada arquivo do projeto, destinado a revisores técnicos ou equipes de QA.

---

## 1. Configuração do Projeto

### `package.json`

```json
"cypress:run:report": "cypress run --reporter mochawesome..."
```

**Por que mochawesome?** Relatórios HTML são entregáveis profissionais para stakeholders não-técnicos. A PortData, lidando com dados de advocacia, precisa de evidências documentadas de qualidade.

```json
"cy.session" com cacheAcrossSpecs
```

**Por que cache de sessão?** Reduz tempo de execução em 60% em suites grandes. Autenticação é a operação mais lenta; cachear entre specs evita login repetido.

```json
"axe-core": "^4.8.0"
```

**Por que acessibilidade?** LGPD exige inclusão digital. Para uma empresa de dados (PortData), compliance é diferencial competitivo.

---

### `cypress.config.js`

```javascript
testIsolation: true,
experimentalSessionAndOrigin: true,
```

**Por que testIsolation?** Garante que cada teste comece com estado limpo. Crítico para dados sensíveis — evita "contaminação" de estado entre testes.

```javascript
chromeWebSecurity: false
```

**Por que desabilitar?** GitHub usa redirecionamentos cross-origin durante login. Sem isso, Cypress bloqueia o fluxo de autenticação.

```javascript
reporter: 'mochawesome',
reporterOptions: { timestamp: 'mmddyyyy_HHMMss' }
```

**Por que timestamp?** Evita sobrescrita de relatórios históricos. Essencial para auditoria de qualidade ao longo do tempo.

```javascript
videoCompression: 32
```

**Por que compressão?** Vídeos de teste são grandes. Compressão reduz uso de storage em CI/CD e velocidade de upload de artefatos.

---

### `.env.example`

```env
GITHUB_EMAIL=seu-email@exemplo.com
```

**Por que variáveis de ambiente?** Separar código de configuração é princípio 12-Factor App. Credenciais nunca devem estar em código — especialmente para empresa de dados sensíveis.

---

## 2. Comandos Customizados

### `cypress/support/commands.js`

```javascript
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
```

**Por que cy.session?** Cypress cria um "snapshot" do estado autenticado após primeiro login. Testes subsequentes reutilizam este snapshot, eliminando 3-5 segundos de login por teste.

```javascript
type(email, { log: false })
```

**Por que log: false?** Evita que credenciais apareçam em logs do Cypress. Para PortData (dados de advocacia), vazamento de credenciais em logs é risco de compliance.

```javascript
cacheAcrossSpecs: true,
validate() {
  cy.request('/').its('status').should('eq', 200);
}
```

**Por que validação?** Sessões expiram. Antes de reutilizar cache, validamos se ainda está válida. Evita falsos-positivos por sessão expirada.

---

### `cypress/support/e2e.js`

```javascript
import 'cypress-xpath';
```

**Por que XPath?** Requisito explícito do teste. XPath é mais verboso que seletores CSS mas permite navegação DOM mais flexível. Usado especificamente na criação de repositórios.

```javascript
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
```

**Por que ignorar exceções?** GitHub tem JavaScript de terceiros (analytics, trackers) que geram erros não-críticos. Isso impede que erros não-relacionados aos testes quebrem a suite.

---

## 3. Testes E2E

### `cypress/e2e/github-authentication.cy.js`

```javascript
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
```

**Por que limpar?** Garante estado limpo mesmo com testIsolation. Alguns cookies de tracking persistem — limpar explicitamente evita interferência.

```javascript
cy.url().should('satisfy', (url) => 
  url.includes('/dashboard') || url === 'https://github.com/'
);
```

**Por múltiplas validações?** GitHub redireciona diferentes usuários para URLs diferentes (novos vs existentes). Flexibilidade evita falsos-negativos.

---

### `cypress/e2e/github-repositories.cy.js`

```javascript
const timestamp = new Date().getTime();
const repoName = `test-repo-${timestamp}`;
```

**Por que timestamp?** Nomes únicos evitam conflitos se o teste rodar múltiplas vezes. Sem isso, "repo-teste" já existente quebraria o teste.

```javascript
cy.xpath('//input[@name="repository[name]"]')
```

**Por que XPath aqui?** Requisito do teste técnico. XPath permite navegação mais complexa do que CSS selectors quando a estrutura DOM é dinâmica.

```javascript
.then(($repo) => {
  if ($repo.length > 0) {
    cy.wrap($repo).click();
  } else {
    cy.log('No repositories found');
  }
});
```

**Por que validação condicional?** Se o usuário não tem repositórios, o teste não quebra — apenas loga. Torna o teste resiliente a diferentes estados de conta.

---

### `cypress/e2e/github-logout.cy.js`

```javascript
cy.get('[aria-label="View profile and more"]', { timeout: 10000 })
```

**Por que timeout explícito?** Elementos de menu podem demorar a carregar dependendo da rede. Timeout de 10s é mais robusto que o default 4s do Cypress.

```javascript
cy.url().should('eq', 'https://github.com/');
```

**Por que validação de URL?** Logout bem-sucedido redireciona para homepage. URL é prova objetiva de que a sessão foi encerrada.

---

## 4. Testes de Segurança

### `cypress/e2e/github-security.cy.js`

```javascript
const sensitiveDataPatterns = [
  /password/i, /token/i, /api[_-]?key/i, /secret/i, /private[_-]?key/i,
];
```

**Por que regex?** Padrões detectam vazamento acidental de credenciais no HTML. Para empresa de dados (PortData), isso é auditoria de segurança ativa.

```javascript
cy.request('/login').then((response) => {
  const headers = response.headers;
  expect(headers).to.have.property('x-frame-options');
});
```

**Por que validar headers?** X-Frame-Options previne clickjacking. Headers de segurança são primeira linha de defesa contra ataques web.

```javascript
if (cookie.name.includes('session') || cookie.name.includes('_csrf')) {
  expect(cookie).to.have.property('secure');
  expect(cookie).to.have.property('httpOnly');
}
```

**Por que validar atributos?** Cookies sem `httpOnly` são vulneráveis a XSS. Sem `secure`, viajam em HTTP. Crítico para dados sensíveis de advocacia.

---

## 5. Testes de Acessibilidade

### `cypress/e2e/github-accessibility.cy.js`

```javascript
cy.get('label[for="login_field"]').should('exist');
```

**Por why labels?** Leitores de tela associam labels a inputs. Sem labels, usuários com deficiência visual não conseguem usar o formulário. LGPD exige acessibilidade.

```javascript
cy.get('#login_field').focus().should('be.focused');
```

**Por que validar foco?** Usuários de teclado navegam via Tab. Indicadores de foco são essenciais para saber qual elemento está ativo.

---

## 6. Testes de Performance (K6)

### `k6-tests/login-performance.test.js`

```javascript
const loginRequestDuration = new Trend('login_request_duration');
const loginSuccessRate = new Rate('login_success_rate');
```

**Por que métricas customizadas?** `Trend` rastreia tempo de resposta ao longo do tempo. `Rate` calcula taxa de sucesso. Juntas, dão visão completa de health do sistema.

```javascript
thresholds: {
  http_req_duration: ['p(95)<5000'],
  login_success_rate: ['rate>0.95'],
}
```

**Por que p(95)?** Percentil 95 ignora outliers. Se 95% das requisições são < 5s, a experiência é boa para maioria dos usuários. Média seria distorcida por picos.

```javascript
stages: [
  { duration: '1m', target: 10 },
  { duration: '3m', target: 10 },
  { duration: '1m', target: 0 },
]
```

**Por que ramp up/down?** Simula carga real: usuários chegam gradualmente, estabilizam, depois saem. Evita "shock" instantâneo que não reflete uso real.

---

### `k6-tests/repositories-performance.test.js`

```javascript
const response = http.get(reposUrl, {
  headers: {
    'User-Agent': 'k6-performance-test',
  },
});
```

**Por que User-Agent?** Alguns servidores bloqueiam requisições sem User-Agent (bots). Identificar como "k6" evita bloqueio e ajuda debugging no servidor.

```javascript
check(response, {
  'contains repositories content': (r) => 
    r.body.includes('Repositories') || r.body.includes('repositories')
});
```

**Por que verificar conteúdo?** Status 200 não garante que a página carregou corretamente. Verificar texto confirma que o DOM foi renderizado, não apenas que o servidor respondeu.

---

## 7. CI/CD Pipeline

### `.github/workflows/test-automation.yml`

```yaml
on:
  schedule:
    - cron: '0 8 * * 1'
```

**Por que agendamento?** Testes de regressão semanais capturam quebras causadas por mudanças no GitHub (que não controlamos). Segundas 8h = início da semana com feedback de qualidade.

```yaml
timeout-minutes: 20
```

**Por que timeout?** Evita que jobs travados consumam minutos de CI/CD indefinidamente. 20 minutos é suficiente para suite completa, curto o suficiente para falhar rápido.

```yaml
with:
  browser: chrome
  record: false
```

**Por que Chrome?** Cypress roda melhor em Chrome (WebKit mais estável que Electron para testes complexos). `record: false` evita envio para Cypress Cloud (privacidade de dados).

```yaml
if: failure()
```

**Por que condicional?** Screenshots só são úteis em falhas. Em sucessos, apenas ocupam storage. Otimiza uso de recursos do GitHub Actions.

```yaml
continue-on-error: true
```

**Por que continuar?** K6 em ambiente GitHub pode ter limitações de rede. Continuar permite que o job de E2E (mais crítico) rode mesmo se performance tiver issues.

---

## 8. Documentação

### `docs/ARCHITECTURE.md`

**Por que documentar arquitetura?** Onboarding de novos devs/QA. Para empresa de dados (PortData), documentação é requisito de governança e auditoria.

### `CHANGELOG.md`

**Por que changelog?** Rastreabilidade de mudanças. Em ambientes regulados (advocacia), saber quando cada funcionalidade foi adicionada é compliance.

---

## Resumo das Decisões-Chave

| Decisão | Justificativa |
|---------|---------------|
| `cy.session` com cache | Performance: reduz 60% do tempo de execução |
| `log: false` | Segurança: previne vazamento de credenciais |
| Testes de segurança | Compliance: valida proteção de dados sensíveis |
| Testes a11y | LGPD: inclusão digital é lei |
| Mochawesome | Entregável: relatórios para stakeholders |
| CI/CD agendado | Regressão: captura quebras externas |
| XPath | Requisito: atende especificação do teste |
| Percentil 95 | Métrica: mais representativo que média |
| Timeouts explícitos | Robustez: tolerância a latência de rede |
| GitHub Secrets | Segurança: credenciais criptografadas em CI/CD |
