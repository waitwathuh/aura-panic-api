import { Panic } from '../models/panic';
import { panicDb } from '../store/db';
import { cache } from '../store/cache';
import { queue } from './queueService';
import { logger } from '../utils/logger';

const PROCESSING_DELAY = 2000; // Simulated async delay

function processPanic(panic: Panic): void {
  logger.info({ id: panic.id }, 'Worker started processing panic');

  setTimeout(() => {
    const updated: Panic = {
      ...panic,
      status: 'active',
      metadata: {
        ...panic.metadata,
        responder: 'unit-42',
        dispatchedAt: Date.now()
      }
    };

    panicDb.update(updated);
    cache.set(updated.id, updated);

    logger.info({ id: updated.id }, 'Worker finished processing panic');
  }, PROCESSING_DELAY);
}

export function startWorker(): void {
  queue.subscribe(processPanic);
  queue.startPolling();
}
