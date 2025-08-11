import { Router } from 'express';
import { createPanic, getPanicById } from '../../services/panicService';

export const panicRouter = Router();

panicRouter.post('/', async (req, res) => {
  try {
    const panic = await createPanic(req.body);
    res.status(202).json(panic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create panic' });
  }
});

panicRouter.get('/:id', async (req, res) => {
  try {
    const panic = await getPanicById(req.params.id);
    if (!panic) {
      return res.status(404).json({ error: 'Panic not found' });
    }
    res.status(200).json(panic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve panic' });
  }
});
