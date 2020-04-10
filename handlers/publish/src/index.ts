import * as AWS from 'aws-sdk';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { random } from 'lodash';

export const handler = async ({ path }: Partial<APIGatewayEvent>): Promise<APIGatewayProxyResult> => {
  const queueUrl = process.env.QUEUE_URL;
  if (!queueUrl) {
    return {
      statusCode: 500,
      body: 'No queue to publish to.'
    };
  }

  const maximum = process.env.MAXIMUM;
  const upperBound = (maximum && parseInt(maximum)) || 10000;
  const randomInt = random(upperBound).toString();

  const sqs = new AWS.SQS();

  await sqs
    .sendMessage({
      QueueUrl: queueUrl,
      MessageBody: randomInt
    })
    .promise();

  return {
    statusCode: 200,
    body: `You've hit ${path}. Successfully pushed message ${randomInt} to queue.`
  };
};
