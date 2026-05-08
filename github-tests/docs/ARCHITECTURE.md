# Arquitetura de Testes Automatizados

## Visão Geral

Este projeto implementa uma arquitetura de testes em camadas para garantir qualidade, segurança e performance da plataforma GitHub.

```
┌─────────────────────────────────────────────────────────┐
│                    CAMADA DE E2E                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐  │
│  │  Autenticação   │  │  Repositórios   │  │  Logout  │  │
│  └─────────────────┘  └─────────────────┘  └──────────┘  │
├─────────────────────────────────────────────────────────┤
│                  CAMADA DE SEGURANÇA                     │
│         Headers │ Cookies │ Dados Sensíveis              │
├─────────────────────────────────────────────────────────┤
│                 CAMADA DE PERFORMANCE                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐  │
│  │  Login Load     │  │  Repos Load     │  │  Logout  │  │
│  └─────────────────┘  └─────────────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Princípios de Design

### 1. Separação de Responsabilidades
- **Page Objects Implícitos**: Seletores centralizados em comandos customizados
- **Test Data**: Variáveis de ambiente para dados sensíveis
- **Utils**: Comandos reutilizáveis em `support/commands.js`

### 2. Segurança por Design
- Criptografia de credenciais em logs (`{ log: false }`)
- Validação de headers de segurança
- Sanitização de dados sensíveis em relatórios
- Isolamento de sessões entre testes

### 3. Performance
- Cache de sessão com `cy.session()`
- Timeouts configuráveis por ambiente
- Testes de carga com K6 em pipeline

## Fluxo de Execução

```
CI/CD Trigger
      │
      ▼
┌─────────────┐
│  Checkout   │
│   Code      │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Cypress    │────▶│  Relatório  │
│    E2E      │     │   HTML      │
└─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│     K6      │────▶│   Métricas  │
│ Performance │     │   JSON      │
└─────────────┘     └─────────────┘
```

## Governança de Dados

Conforme requisitos de compliance para dados sensíveis:

| Aspecto | Implementação |
|---------|--------------|
| Criptografia | HTTPS obrigatório |
| Logging | Dados mascarados |
| Armazenamento | `.env` local only |
| CI/CD | GitHub Secrets |
| Retenção | Artefatos por 30 dias |

## Estratégia de Testes

### Pirâmide de Testes

```
       /\
      /  \
     / E2E \           ← Cypress (UI/Fluxos)
    /─────────\
   /  Segurança  \      ← Cypress (Headers/Cookies)
  /─────────────────\
 /    Performance    \  ← K6 (Load/Stress)
/─────────────────────────\
```

### Critérios de Aceite

| Tipo | Cobertura | Threshold |
|------|-----------|-----------|
| E2E | 100% fluxos críticos | Pass rate > 95% |
| Segurança | Headers + Cookies | 100% conformidade |
| Performance | p(95) < 3s | Taxa erro < 5% |
