import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { config } from '../config';
import { Panic } from '../models/panic';
import { logger } from '../utils/logger';

type QueueCallback = (panic: Panic) => Promise<void> | void;

const client = new SQSClient({ region: config.awsRegion });
let subscribers: QueueCallback[] = [];
let polling = false;

export const queue = {
  async enqueue(panic: Panic): Promise<void> {
    await client.send(new SendMessageCommand({
      QueueUrl: config.sqs.queueUrl,
      MessageBody: JSON.stringify(panic)
    }));
  },

  subscribe(callback: QueueCallback): void {
    subscribers.push(callback);
  },

  startPolling(intervalMs: number = 1000): void {
    if (polling) return;
    polling = true;

    const loop = async () => {
      try {
        const resp = await client.send(new ReceiveMessageCommand({
          QueueUrl: config.sqs.queueUrl,
          MaxNumberOfMessages: 5,
          WaitTimeSeconds: config.sqs.waitTimeSeconds,
          VisibilityTimeout: config.sqs.visibilityTimeout
        }));

        if (resp.Messages && resp.Messages.length > 0) {
          for (const m of resp.Messages) {
            try {
              const panic = JSON.parse(m.Body || '{}') as Panic;
              for (const cb of subscribers) {
                await cb(panic);
              }
              if (m.ReceiptHandle) {
                await client.send(new DeleteMessageCommand({
                  QueueUrl: config.sqs.queueUrl,
                  ReceiptHandle: m.ReceiptHandle
                }));
              }
            } catch (err) {
              logger.error({ err }, 'Error processing SQS message');
              // Let it time out / go to DLQ via redrive policy
            }
          }
        }
      } catch (err) {
        logger.error({ err }, 'SQS polling error');
      } finally {
        setTimeout(loop, intervalMs);
      }
    };

    loop();
  }
};
