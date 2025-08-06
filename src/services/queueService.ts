import { Panic } from '../models/panic';

type QueueCallback = (panic: Panic) => void;

const internalQueue: Panic[] = [];
let subscribers: QueueCallback[] = [];

export const queue = {
  enqueue(panic: Panic): void {
    internalQueue.push(panic);
  },

  subscribe(callback: QueueCallback): void {
    subscribers.push(callback);
  },

  startPolling(intervalMs: number = 1000): void {
    setInterval(() => {
      if (internalQueue.length === 0) return;

      const panic = internalQueue.shift();
      if (!panic) return;

      for (const cb of subscribers) {
        cb(panic);
      }
    }, intervalMs);
  }
};
