# Debug dos Problemas do Player

## 🔍 Problemas Identificados:

### 1. **Filtro de Canais Corrigido:**
✅ Adicionado filtro para "ManoTV" e "Doações" (incluindo variações)
✅ Filtros: 'manotv', 'doações', 'doacoes', 'doacao', 'doação'

### 2. **Player não carrega streams - Possíveis causas:**

#### A. **Proxy Issues:**
- ✅ Adicionado conexão direta (sem proxy) como primeira opção
- ✅ Implementado fallback automático entre 4 proxies diferentes
- ✅ Timeout reduzido para 15s por tentativa

#### B. **CORS Restrictions:**
- Alguns streams podem bloquear requests cross-origin
- Solução: Proxies devem contornar isso

#### C. **Stream Format Issues:**
- Shaka Player pode não suportar todos os formatos
- Precisa verificar se os URLs são realmente streams válidos

## 🧪 Como Testar os Fixes:

### 1. **Console Logs para Debug:**
```javascript
// No browser console você verá:
"Initializing player for source: [URL]"
"Trying proxy 0: [proxied-URL]" 
"Successfully loaded with proxy X"
"Group 'Nome do Grupo': X channels"
"Total channels loaded: X"
```

### 2. **Verificar Filtros:**
- Canais com "ManoTV" ou "Doações" devem aparecer como:
  `"Ignored channel 'Nome' (reason: ManoTV or explicit no streaming source)"`

### 3. **Verificar Carregamento:**
- Player deve tentar 4 proxies diferentes automaticamente
- Se todos falharem, erro será mostrado

## 🔧 Alterações Feitas:

### `services/iptvService.ts:`
- ✅ Filtro melhorado para palavras-chave banidas
- ✅ Logs detalhados de grupos e contagem de canais

### `components/VideoPlayer.tsx:`
- ✅ Sistema de fallback automático entre proxies
- ✅ Timeout por tentativa (15s cada)
- ✅ Logs detalhados do processo de carregamento

### `config/proxyConfig.ts:`
- ✅ Conexão direta como primeira opção
- ✅ Proxy adicional (ThingProxy)
- ✅ 4 opções total de conexão

## 🚀 Próximos Passos:
1. Testar no browser com console aberto
2. Verificar logs de carregamento
3. Se ainda não funcionar, pode ser problema específico dos streams da playlist
