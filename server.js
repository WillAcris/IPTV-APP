import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
  'https://iptv-app-7x3r.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json({ limit: '10kb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// In-memory storage for messages (até 100 mensagens por canal)
const channelMessages = {};
const MAX_CHANNELS = 200;

// Função para sanitizar texto
function sanitizeText(text) {
  return text
    .replace(/[<>"']/g, '')
    .substring(0, 500)
    .trim();
}

// Rate limiting simples por IP
const messageTimestamps = new Map();
const RATE_LIMIT_MS = 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const lastMessage = messageTimestamps.get(ip);
  
  if (lastMessage && now - lastMessage < RATE_LIMIT_MS) {
    return false;
  }
  
  messageTimestamps.set(ip, now);
  return true;
}

// API Endpoints para o chat
app.get('/api/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const messages = channelMessages[channelId] || [];
  res.json(messages);
});

app.post('/api/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const { author, text } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  // Rate limiting
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait.' });
  }

  // Validação de entrada
  if (!author || !text) {
    return res.status(400).json({ error: 'Author and text are required' });
  }

  if (typeof author !== 'string' || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid data type' });
  }

  if (author.length > 20 || text.length > 500) {
    return res.status(400).json({ error: 'Author or text too long' });
  }

  // Limitar número de canais
  if (!channelMessages[channelId] && Object.keys(channelMessages).length >= MAX_CHANNELS) {
    return res.status(507).json({ error: 'Channel limit reached' });
  }

  if (!channelMessages[channelId]) {
    channelMessages[channelId] = [];
  }

  // Sanitizar dados
  const newMessage = {
    id: Date.now(),
    author: sanitizeText(author),
    text: sanitizeText(text),
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