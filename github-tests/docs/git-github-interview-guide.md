# Guia de Entrevista: Git e GitHub para QA

## Descrição
Guia completo com respostas para perguntas de entrevista sobre Git e GitHub focadas em qualidade e desenvolvimento.

---

## Pergunta 1: Iniciar Desenvolvimento

**Pergunta:** Qual sequência de comandos você executa desde atualizar o projeto até começar a desenvolver?

**Resposta:**

```bash
# 1. Atualizar branch principal
git checkout main
git pull origin main

# 2. Criar branch para feature (nomenclatura padrão)
git checkout -b feature/nome-da-feature
# ou
git checkout -b bugfix/descrição-do-bug

# 3. Verificar status e arquivos
git status
git log --oneline -10

# 4. Iniciar desenvolvimento
# (começar a codificar/testar)
```

**Melhores Práticas:**
- Sempre atualizar da branch principal antes de criar nova branch
- Usar nomenclatura padrão: `feature/`, `bugfix/`, `hotfix/`
- Verificar se não há arquivos não commitados antes de trocar de branch

---

## Pergunta 2: Resolver Conflitos de Merge

**Pergunta:** Como você identifica os arquivos com conflito? Qual o processo que você segue para resolver?

**Resposta:**

### Identificação de Conflitos:
```bash
# Durante merge ou rebase:
git merge develop
# ou
git rebase develop

# Git mostra automaticamente os arquivos em conflito
git status  # Lista arquivos com "both modified"
```

### Processo de Resolução:

1. **Analisar os Conflitos:**
```bash
# Ver arquivos em conflito
git status

# Ver diferenças detalhadas
git diff --name-only --diff-filter=U
```

2. **Editar os Arquivos:**
```bash
# Abrir arquivo em editor de código
# Procurar por marcadores:
# <<<<<<< HEAD
# código atual
# =======
# código incoming
# >>>>>>> branch-name

# Manter código correto e remover marcadores
```

3. **Validar e Finalizar:**
```bash
# Adicionar arquivos resolvidos
git add arquivo-resolvido.js

# Verificar status
git status

# Continuar merge/rebase
git merge --continue
# ou
git rebase --continue

# Se necessário abortar
git merge --abort
# ou
git rebase --abort
```

**Estratégias de Resolução:**
- Comunicar com outro desenvolvedor se houver dúvidas
- Testar localmente após resolver conflitos
- Manter histórico limpo

---

## Pergunta 3: Enviar Código para Review

**Pergunta:** Quais comandos você executa para enviar seu código?

**Resposta:**

```bash
# 1. Verificar alterações
git status
git diff

# 2. Adicionar arquivos modificados
git add .
# Nota: Para alterações críticas, prefiro adicionar arquivos seletivamente para evitar commits acidentais e manter controle de evidências
# ou seletivo:
# git add src/arquivo.js tests/teste.js

# 3. Commit com mensagem padrão
git commit -m "feat: adicionar nova funcionalidade de login"

# 4. Push para branch remota
git push origin feature/nome-da-feature

# 5. Criar Pull Request no GitHub
# (interface web ou GitHub CLI)
gh pr create --title "Nova Feature Login" --body "Descrição das mudanças"
```

**Padrão de Commit Messages:**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `test:` testes
- `refactor:` refatoração

---

## Pergunta 4: Investigar Bug em Produção

**Pergunta:** Como você encontra em qual commit o problema começou?

**Resposta:**

### Método 1: Git Bisect
```bash
# Iniciar bisect
git bisect start

# Marcar commit atual como ruim
git bisect bad

# Marcar commit conhecido como bom
git bisect good v1.0.0

# Git vai pulando entre commits
# Testar cada versão
git bisect bad  # se problema existe
git bisect good # se não existe

# Bisect encontra o commit exato
git bisect reset
```

### Método 2: Análise Manual
```bash
# Ver histórico recente
git log --oneline --grep="palavra-chave"

# Ver mudanças em arquivo específico
git log --oneline -- arquivo.js

# Ver diff entre versões
git diff v1.0.0 HEAD -- arquivo.js

# Blame para encontrar quem modificou
git blame arquivo.js
```

### Método 3: Tags e Releases
```bash
# Ver tags disponíveis
git tag --list

# Comparar com stable
git diff stable HEAD

# Ver changelog
git log v1.0.0..HEAD --oneline
```

---

## Pergunta 5: Testar Branch Develop

**Pergunta:** O time entregou uma feature na branch develop. O que você faz antes de iniciar os testes nessa branch? Como você garante que sua base local está atualizada?

**Resposta:**

### Antes de Iniciar Testes:

```bash
# 1. Salvar trabalho atual se existir
git stash

# 2. Atualizar branch develop
git checkout develop
git fetch origin
git pull origin develop
# ou dependendo do padrão do time:
# git pull --rebase origin develop

# 3. Verificar status
git status
git log --oneline -5

# 4. Instalar dependências se necessário
npm install

# 5. Restaurar trabalho se necessário
git stash pop
# Nota: Uso stash apenas quando necessário, pois pode gerar conflitos ao reaplicar dependendo das mudanças da branch
```

### Verificação de Ambiente:

```bash
# Verificar branches locais vs remotas
git branch -vv

# Verificar se está atualizado
git log --oneline origin/develop..HEAD

# Verificar arquivos não trackeados
git status --porcelain

# Limpeza apenas se necessário e com cuidado
git clean -fd  # apenas em ambiente de desenvolvimento
```

**Validação Adicional:**
- Verificar no GitHub se a branch está atualizada
- Confirmar que a última build da pipeline passou
- Validar variáveis de ambiente no deploy

---

## Pergunta 6: Investigar Diferença Beta vs Develop

**Pergunta:** Como você investiga se é problema de código ou de deploy? Quais evidências você coleta?

**Resposta:**

### Análise de Código vs Deploy:

**Investigação completa:**
1. **Verificar no GitHub:**
   - Confirmar se o commit da develop foi realmente promovido para beta
   - Analisar os checks da pipeline (build, test, deploy)
   - Verificar se há branch protection rules bloqueando

2. **Comparar branches localmente:**
```bash
git log origin/beta --oneline -10
git log origin/develop --oneline -10
git diff origin/beta..origin/develop --name-only
```

3. **Validar versão deployada:**
   - Verificar hash do commit em produção
   - Confirmar artifact da pipeline
   - Analisar logs de deploy

4. **Comparar ambiente:**
   - Variáveis de ambiente (.env vs production)
   - Configurações de CDN/cache
   - Versões de dependências

### Evidências a Coletar:

**1. Evidências de Código:**
```bash
# Verificar diferenças específicas
git diff origin/beta..origin/develop -- src/

# Verificar configurações
git diff origin/beta..origin/develop -- config/

# Verificar migrations
git diff origin/beta..origin/develop -- migrations/
```

**2. Evidências de Deploy:**
```bash
# Verificar data do último deploy
git log --pretty=format:"%h %ad %s" --date=short origin/beta -5

# Verificar se há commits não deployados
git log --oneline origin/develop ^origin/beta

# Verificar tags de deploy
git tag --list | grep beta
```

**3. Evidências de Ambiente:**
- Versões de dependências (`package.json`, `requirements.txt`)
- Configurações de ambiente (`.env`, `config files`)
- Logs de deploy da CI/CD
- Health checks da aplicação

---

## Pergunta 7: Deploy Falhou na Pipeline

**Pergunta:** O que você analisa primeiro? Você consegue identificar em qual etapa falhou (build, teste, deploy)? Qual sua ação após identificar a falha?

**Resposta:**

### Análise Inicial:

**1. Logs da Pipeline:**
```bash
# Se tiver acesso aos logs
# Verificar onde exatamente falhou:
# - Build stage (compilação)
# - Test stage (testes)
# - Deploy stage (deploy)
```

**2. Análise por Etapa:**

**Build Stage:**
```bash
# Verificar se build local funciona
npm run build
# ou
mvn clean compile

# Verificar dependências
npm ls
# ou
pip check
```

**Test Stage:**
```bash
# Rodar testes localmente
npm test
# ou
pytest

# Verificar cobertura
npm run test:coverage
```

**Deploy Stage:**
```bash
# Verificar configurações de deploy
# Verificar credenciais
# Verificar ambiente alvo
```

### Ações Pós-Falha:

**1. Reprodução Local:**
```bash
# Tentar reproduzir erro localmente
git checkout commit-falho
npm install
npm run build
npm test
```

**2. Análise do Commit:**
```bash
# Verificar mudanças no commit
git show --name-only commit-falho
git show commit-falho

# Verificar se há merge conflicts
git log --oneline -5
```

**3. Correção e Re-deploy:**
```bash
# Criar branch de hotfix
git checkout -b hotfix/corrigir-deploy-fail

# Fazer correções
git add .
git commit -m "fix: corrigir falha de deploy"

# Testar novamente
npm run build
npm test

# Push e re-deploy
git push origin hotfix/corrigir-deploy-fail
```

---

## Pergunta 8: Fluxo Develop > Beta > Master

**Pergunta:** Em qual momento você bloqueia uma subida para produção? O que define que uma entrega está pronta para produção?

**Resposta:**

### Momentos de Bloqueio para Produção:

**1. Critérios de Qualidade:**
```bash
# Verificar cobertura de testes
npm run test:coverage

# Verificar linting
npm run lint

# Verificar type checking
npm run type-check

# Verificar security scan
npm audit
```

**2. Testes Automatizados:**
```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Testes de performance
npm run test:performance
```

**3. Verificações de Branch:**
```bash
# Verificar se está sincronizado
git log --oneline origin/main..HEAD

# Validar possíveis conflitos e divergências antes da promoção
git fetch origin
git diff origin/main

# Verificar changelog
git log --oneline origin/beta..origin/main
```

### Critérios para Produção:

**1. Checklist Técnico:**
- ✅ Todos os testes passando
- ✅ Cobertura de testes dentro do padrão definido pelo time/projeto
- ✅ Sem vulnerabilidades críticas
- ✅ Performance dentro dos limites
- ✅ Documentação atualizada

**2. Checklist de Processo:**
- ✅ Code review aprovado
- ✅ Testes manuais executados
- ✅ UAT aprovado pelo product owner
- ✅ Documentação de release atualizada
- ✅ Plano de rollback documentado

**3. Checklist de Deploy:**
- ✅ Backup atualizado
- ✅ Health checks passando
- ✅ Monitoramento configurado
- ✅ Notificações de deploy configuradas

### Comandos de Validação Final:

```bash
# Validação final antes de production
git checkout main
git pull origin main
git merge origin/develop --no-ff -m "release: versão X.X.X"

# Push para production (geralmente automatizado)
git push origin main
```

**Nota:** Tags e releases geralmente são criados por DevOps/release manager. QA foca em:
- Validação dos critérios de aceite
- Análise de impacto e risco
- Aprovação baseada em evidências
- Documentação de release
- Plano de rollback

---

## Resumo: Comandos Essenciais

### Workflow Diário:
```bash
# Início do dia
git checkout main && git pull origin main
git checkout -b feature/nova-feature

# Durante desenvolvimento
git add .
git commit -m "feat: implementar funcionalidade"
git push origin feature/nova-feature

# Final do dia
git status
git log --oneline -5
```

### Resolução de Problemas:
```bash
# Conflitos
git merge --continue
git merge --abort

# Debug
git bisect start
git bisect bad
git bisect good v1.0.0

# Sincronização segura
git fetch origin
git pull origin main
# ou com rebase (dependendo do padrão do time):
# git pull --rebase origin main
```

### Validação:
```bash
# Status geral
git status
git log --oneline -10
git branch -vv

# Comparações
git diff origin/beta..origin/develop
git log --oneline origin/beta..origin/main
```

---

## Interface GitHub e Pipeline

### Pull Request e Review:
- **Criar PR:** Interface web ou `gh pr create`
- **Validar checks:** Verificar se todos os testes passaram
- **Code review:** Analisar comentários e sugestões
- **Approvals:** Confirmar aprovações necessárias
- **Merge strategy:** Squash merge, merge commit, ou rebase

### Branch Protection:
- Verificar rules que bloqueiam merge direto
- Confirmar required status checks
- Validar required reviewers

### GitHub Actions/CI:
- Analisar workflow runs
- Verificar artifacts gerados
- Confirmar environment protections
- Validar secrets e variáveis

### Histórico e Rastreabilidade:
- **Comparar branches:** Interface visual do GitHub
- **Blame:** Identificar autor de mudanças
- **Revert PR:** Reverter merge problemático
- **Cherry-pick:** Selecionar commits específicos