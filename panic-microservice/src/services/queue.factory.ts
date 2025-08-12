import { config } from '../config';

export const queue = config.mode === 'aws'
  ? require('./queue.sqs').queue
  : require('./queueService').queue;
