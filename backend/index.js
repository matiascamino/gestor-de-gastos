require('dotenv').config();


const express = require('express');
const cors = require('cors');


const app = express();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const movementsRoutes = require('./movements/movementsRoutes');
app.use('/api/movements', movementsRoutes);

const categoriesRoutes = require('./categories/categoriesRoutes');
app.use('/api/categories', categoriesRoutes);

const dashboardRoutes = require('./dashboard/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const authRoutes = require('./auth/authRoutes');
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

