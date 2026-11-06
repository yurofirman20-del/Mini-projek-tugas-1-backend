import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsMiddleware } from './middleware/cors.js';
import destinationRoutes from './routes/destinations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// API Routes
app.use('/api/destinations', destinationRoutes);

// Serve frontend static files
const frontendPath = path.resolve(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`API Destinasi: http://localhost:${PORT}/api/destinations`);
});

