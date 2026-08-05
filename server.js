import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'data', 'products.json');

const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Public routes
app.get('/api/products', (req, res) => {
  res.json(readDB());
});

// Admin Auth
const ADMIN_SECRET = 'kalavathi-devi-secret';
const PASSWORD = 'kalavathi devi';

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true, token: ADMIN_SECRET });
  } else {
    res.status(401).json({ success: false, message: 'Wrong password' });
  }
});

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token === ADMIN_SECRET) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

app.get('/api/admin/products', adminAuth, (req, res) => {
  res.json(readDB());
});

app.post('/api/admin/products', adminAuth, (req, res) => {
  const products = readDB();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  writeDB(products);
  res.status(201).json(newProduct);
});

app.delete('/api/admin/products/:id', adminAuth, (req, res) => {
  let products = readDB();
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  writeDB(products);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});