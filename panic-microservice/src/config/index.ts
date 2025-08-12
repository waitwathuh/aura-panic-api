export type RuntimeMode = 'local' | 'aws';

export const config = {
  mode: (process.env.RUNTIME_MODE as RuntimeMode) || 'local',
  awsRegion: process.env.AWS_REGION || 'eu-west-1',

  db: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT || 5432),
    database: process.env.PG_DATABASE || 'aura',
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: process.env.PG_SSL === 'true'
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
  },

  sqs: {
    queueUrl: process.env.SQS_QUEUE_URL || '',
    waitTimeSeconds: Number(process.env.SQS_WAIT_TIME_SECONDS || 10),
    visibilityTimeout: Number(process.env.SQS_VISIBILITY_TIMEOUT || 30)
  }
};
