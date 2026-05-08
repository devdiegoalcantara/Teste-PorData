# Guia de Instalação do K6 - Windows

## Opção 1: Instalação via Winget (Recomendado)

Execute o PowerShell como Administrador:

```powershell
winget install k6
```

Verifique a instalação:
```powershell
k6 version
```

## Opção 2: Instalação via Chocolatey

Se você tiver o Chocolatey instalado:

```powershell
choco install k6
```

## Opção 3: Download Direto

1. Acesse: https://github.com/grafana/k6/releases
2. Baixe o arquivo `k6-vX.X.X-windows-amd64.zip`
3. Extraia para `C:\k6`
4. Adicione `C:\k6` ao PATH do sistema:
   - Abra as Propriedades do Sistema
   - Clique em "Variáveis de Ambiente"
   - Em "Path", adicione `C:\k6`

## Verificação

Após a instalação, execute:

```powershell
k6 version
```

Saída esperada:
```
k6 v0.XX.X (go1.XX.X, windows/amd64)
```

## Primeiro Teste

Teste com um script simples:

```powershell
k6 run --vus 1 --duration 10s https://test.k6.io/
```

## Troubleshooting

### "k6" não é reconhecido como comando
- Reinicie o terminal PowerShell após a instalação
- Verifique se o K6 está no PATH: `$env:PATH`

### Erro de permissão no Winget
- Execute o PowerShell como Administrador

### Instalação corporativa (proxy)
```powershell
winget install k6 --source winget --accept-source-agreements
```
