import { Router } from 'express';
import { destinations } from '../data/destinations.js';

const router = Router();

// GET /api/destinations
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server saat memuat data destinasi.'
    });
  }
});

// GET /api/destinations/:id
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const destination = destinations.find(item => item.id === id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server.'
    });
  }
});

export default router;

