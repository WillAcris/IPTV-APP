# Sistema de Chat em Tempo Real - IPTV Player

## 🚀 Deploy no Render

O sistema foi otimizado para funcionar no Render com chat em tempo real.

### Características do Chat

- ✅ **100 mensagens por canal** - Armazena até 100 mensagens por canal
- ✅ **FIFO (First In, First Out)** - Mensagens antigas são removidas automaticamente
- ✅ **Tempo real** - Atualização automática a cada 3 segundos
- ✅ **Independente por canal** - Cada canal tem seu próprio chat
- ✅ **Nome de usuário** - Sistema de identificação de usuários
- ✅ **Persistência em memória** - Funciona sem banco de dados

### Arquitetura

```
┌─────────────────┐
│   Frontend      │
│   (React +      │
│   Vite)         │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   (Express.js)  │
│                 │
│  /api/messages  │
│  /:channelId    │
│                 │
│  In-Memory      │
│  Storage        │
│  (até 100 msgs) │
└─────────────────┘
```

### Como funciona

1. **Frontend** - React app servido como arquivos estáticos
2. **Backend** - Express server que:
   - Serve os arquivos estáticos do frontend
   - Fornece API REST para mensagens
   - Armazena mensagens em memória (até 100 por canal)

### Endpoints da API

#### GET `/api/messages/:channelId`
Retorna as mensagens de um canal específico.

**Resposta:**
```json
[
  {
    "id": 1234567890,
    "author": "João",
    "text": "Olá!",
    "timestamp": "2025-11-16T10:30:00.000Z"
  }
]
```

#### POST `/api/messages/:channelId`
Adiciona uma nova mensagem ao canal.

**Body:**
```json
{
  "author": "João",
  "text": "Olá!"
}
```

**Resposta:**
```json
{
  "id": 1234567890,
  "author": "João",
  "text": "Olá!",
  "timestamp": "2025-11-16T10:30:00.000Z"
}
```

### Passos para Deploy

1. **Commit e Push para o GitHub**
   ```bash
   git add .
   git commit -m "Add chat system with backend"
   git push origin main
   ```

2. **No Render Dashboard:**
   - Vá para https://dashboard.render.com/
   - Conecte seu repositório GitHub
   - O Render detectará automaticamente o `render.yaml`
   - Clique em "Apply" para criar o serviço

3. **Variáveis de Ambiente (já configuradas):**
   - `NODE_ENV=production` - Define o ambiente como produção
   - `PORT` - Definido automaticamente pelo Render

4. **Build e Deploy:**
   - Build: `npm ci && npm run build`
   - Start: `npm start`

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Desenvolvimento (apenas frontend)
npm run dev

# Build do frontend
npm run build

# Executar servidor completo (frontend + backend)
npm run server
```

### Melhorias Futuras

- [ ] WebSockets para atualização instantânea
- [ ] Banco de dados para persistência
- [ ] Autenticação de usuários
- [ ] Moderação de mensagens
- [ ] Emojis e reações
- [ ] Upload de imagens
- [ ] Notificações

### Observações

- ⚠️ **Mensagens são armazenadas em memória** - Se o servidor reiniciar, as mensagens são perdidas
- ⚠️ **Limite de 100 mensagens por canal** - Mensagens antigas são removidas automaticamente
- ⚠️ **Polling a cada 3 segundos** - Para melhor performance, considere usar WebSockets no futuro

### Troubleshooting

Se o chat não estiver funcionando:

1. Verifique se o servidor está rodando
2. Abra o console do navegador (F12) e veja se há erros
3. Verifique se a URL da API está correta
4. Confirme que as requisições estão sendo feitas para `/api/messages/...`

### Estrutura de Arquivos

```
├── server.js              # Servidor Express (backend + frontend)
├── components/
│   └── LiveChat.tsx       # Componente de chat
├── package.json           # Dependências e scripts
├── render.yaml            # Configuração do Render
└── CHAT_README.md         # Este arquivo
```
