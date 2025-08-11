import { createPanic, getPanicById } from '../src/services/panicService';
import { panicDb } from '../src/store/db';
import { cache } from '../src/store/cache';

describe('Panic Service', () => {
  beforeEach(() => {
    panicDb.clear();
    cache.clear();
  });

  it('should create a new panic with placeholder data', async () => {
    const panic = await createPanic({
      location: { lat: -33.9, lng: 18.4 },
      metadata: { triggerSource: 'mobile-app' }
    });

    expect(panic).toHaveProperty('id');
    expect(panic).toHaveProperty('timestamp');
    expect(panic.status).toBe('processing');
    expect(panic.location.lat).toBeCloseTo(-33.9);
  });

  it('should retrieve the panic from DB after cache expires', async () => {
    const panic = await createPanic({ location: { lat: 0, lng: 0 } });

    cache.delete(panic.id);

    const retrieved = await getPanicById(panic.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(panic.id);
  });

  it('should return null for non-existent panic ID', async () => {
    const result = await getPanicById('non-existent-id');
    expect(result).toBeNull();
  });
});
