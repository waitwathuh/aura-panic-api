import { config } from '../config';

export const cache = config.mode === 'aws'
  ? require('./cache.redis').cache
  : require('./cache').cache;
