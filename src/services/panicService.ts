import { v4 as uuidv4 } from 'uuid';
import { Panic } from '../models/panic';
import { panicDb } from '../store/db';
import { cache } from '../store/cache';
import { queue } from './queueService';
import { logger } from '../utils/logger';

const CACHE_TTL = 60_000; // 60 seconds

export async function createPanic(data: Partial<Panic>): Promise<Panic> {
  const id = uuidv4();

  const panic: Panic = {
    id,
    timestamp: Date.now(),
    location: data.location || { lat: 0, lng: 0 },
    metadata: data.metadata || {},
    status: 'processing'
  };

  panicDb.insert(panic);
  cache.set(id, panic, CACHE_TTL);

  queue.enqueue(panic);

  logger.info({ id }, 'Panic created and enqueued for processing');

  return panic;
}

export async function getPanicById(id: string): Promise<Panic | null> {
  const cached = cache.get<Panic>(id);
  if (cached) {
    logger.debug({ id }, 'Cache hit for panic');
    return cached;
  }

  const panic = panicDb.findById(id);
  if (panic) {
    logger.debug({ id }, 'DB hit for panic, caching result');
    cache.set(id, panic, CACHE_TTL);
  } else {
    logger.warn({ id }, 'Panic not found');
  }

  return panic || null;
}
