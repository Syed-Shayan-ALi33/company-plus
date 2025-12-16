import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const defaultData = {
  users: [{ username: 'company11', password: 'company123' }],
  sessions: [],
  orders: [
    { id: '#ORD-9021', customer: 'Sarah Jenkins', phone: '+1 (555) 123-4567', amount: 245.99, status: 'Delivered', date: 'Just now', visibility: 'private', product: 'Wireless Handsfree' },
    { id: '#ORD-9020', customer: 'Michael Chen', phone: '+1 (555) 987-6543', amount: 89.5, status: 'Pending', date: '5 mins ago', visibility: 'public', product: 'Leather Handbag' },
    { id: '#ORD-9019', customer: 'Emma Wilson', amount: 120, status: 'Shipped', date: '1 hour ago', visibility: 'private', product: 'Smart Watch' },
    { id: '#ORD-9018', customer: 'James Rodriguez', amount: 450.25, status: 'Delivered', date: '2 hours ago', visibility: 'public', product: 'Sunglasses' },
    { id: '#ORD-9017', customer: 'Lisa Thompson', amount: 65, status: 'Pending', date: '3 hours ago', visibility: 'private', product: 'Wireless Handsfree' },
  ],
  chartData: [
    { name: 'Mon', conversations: 420, sales: 2400 },
    { name: 'Tue', conversations: 380, sales: 2100 },
    { name: 'Wed', conversations: 550, sales: 3200 },
    { name: 'Thu', conversations: 490, sales: 2800 },
    { name: 'Fri', conversations: 680, sales: 4100 },
    { name: 'Sat', conversations: 720, sales: 4500 },
    { name: 'Sun', conversations: 650, sales: 3900 },
  ],
};

const ensureDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(__dirname, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }
};

ensureDatabase();

const readDb = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const writeDb = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const calculateMetrics = (orders, chartData) => {
  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.amount || 0), 0);
  const activeUsers = 1 + Math.floor(Math.random() * 3);
  const leads = Math.max(orders.length + 10, 15);
  const conversionRate = leads > 0 ? (orders.length / leads) * 100 : 0;
  return { revenue, activeUsers, leads, conversionRate, chartData };
};

const tickLiveTraffic = (data) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const dayKey = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].find((d) => today.startsWith(d)) || 'Sun';

  data.chartData = data.chartData.map((day) => {
    if (day.name === dayKey) {
      return {
        ...day,
        conversations: day.conversations + Math.floor(Math.random() * 4) + 1,
        sales: day.sales + Math.floor(Math.random() * 80),
      };
    }
    return day;
  });
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const db = readDb();
  const user = db.users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = randomUUID();
  db.sessions.push({ token, username: user.username, createdAt: new Date().toISOString() });
  writeDb(db);

  res.json({ token, user: { username: user.username } });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '') || req.body?.token;
  if (!token) {
    return res.json({ success: true });
  }

  const db = readDb();
  const nextSessions = db.sessions.filter((session) => session.token !== token);
  db.sessions = nextSessions;
  writeDb(db);

  res.json({ success: true });
});

app.get('/api/auth/validate', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Missing session token' });
  }

  const db = readDb();
  const session = db.sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }

  res.json({ username: session.username });
});

app.get('/api/dashboard', (_req, res) => {
  const db = readDb();
  tickLiveTraffic(db);
  writeDb(db);
  const metrics = calculateMetrics(db.orders, db.chartData);
  res.json({
    orders: db.orders,
    chartData: db.chartData,
    metrics,
  });
});

app.post('/api/orders', (req, res) => {
  const db = readDb();
  const { customer, phone, product, amount, visibility } = req.body || {};
  if (!customer || !product || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newOrder = {
    id: `#ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customer,
    phone,
    product,
    amount: Number(amount),
    status: 'Pending',
    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    visibility: visibility === 'public' ? 'public' : 'private',
  };

  db.orders = [newOrder, ...db.orders];
  tickLiveTraffic(db);
  writeDb(db);

  res.status(201).json({ order: newOrder, metrics: calculateMetrics(db.orders, db.chartData) });
});

app.patch('/api/orders/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { status } = req.body || {};
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  if (status) {
    db.orders[idx].status = status;
  }
  tickLiveTraffic(db);
  writeDb(db);
  res.json({ order: db.orders[idx], metrics: calculateMetrics(db.orders, db.chartData) });
});

app.delete('/api/orders/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const toDelete = db.orders.find((o) => o.id === id);
  if (!toDelete) {
    return res.status(404).json({ message: 'Order not found' });
  }
  db.orders = db.orders.filter((o) => o.id !== id);
  tickLiveTraffic(db);
  writeDb(db);
  res.json({ success: true, metrics: calculateMetrics(db.orders, db.chartData) });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth backend running on http://localhost:${PORT}`);
});

