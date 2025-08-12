import { config } from '../config';

export const panicDb = config.mode === 'aws'
  ? require('./db.postgres').panicDb
  : require('./db').panicDb;
