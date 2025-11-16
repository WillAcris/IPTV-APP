import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for messages (até 100 mensagens por canal)
const channelMessages = {};

// API Endpoints para o chat
app.get('/api/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const messages = channelMessages[channelId] || [];
  res.json(messages);
});

app.post('/api/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const { author, text } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: 'Author and text are required' });
  }

  if (!channelMessages[channelId]) {
    channelMessages[channelId] = [];
  }

  const newMessage = {
    id: Date.now(),
    author,
    text,
    timestamp: new Date().toISOString(),
  };

  channelMessages[channelId].push(newMessage);

  // Manter apenas as últimas 100 mensagens
  if (channelMessages[channelId].length > 100) {
    channelMessages[channelId].shift();
  }

  res.status(201).json(newMessage);
});

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    // Não redirecionar rotas da API
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});