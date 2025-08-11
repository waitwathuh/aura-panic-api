import { Panic } from '../models/panic';

const db = new Map<string, Panic>();

export const panicDb = {
  insert(panic: Panic): void {
    db.set(panic.id, panic);
  },

  update(panic: Panic): void {
    db.set(panic.id, panic);
  },

  findById(id: string): Panic | undefined {
    return db.get(id);
  },

  clear(): void {
    db.clear();
  }
};
