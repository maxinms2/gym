console.log('🔥🔥🔥 INDEX REAL EJECUTÁNDOSE 🔥🔥🔥');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercise');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// RUTAS
app.use('/auth', authRoutes);
app.use('/exercises', exerciseRoutes);

// TEST
app.get('/', (req, res) => {
  res.send('API OK');
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 API running on port ${PORT}`);
});
