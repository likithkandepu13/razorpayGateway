// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();

// // Enable CORS for your frontend origin
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from this origin
//   methods: ['GET', 'POST'], // Allow these HTTP methods
//   allowedHeaders: ['Content-Type'], // Allow these headers
// }));

// // Parse JSON bodies
// app.use(express.json());

// // Routes
// app.use('/api/payment', require('./routes/paymentRoutes'));

// // Start server
// app.listen(5000, () => console.log('Server running on port 5000'));



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// Routes
app.use('/api/payment', require('./routes/paymentRoutes'));

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));