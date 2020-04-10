import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function as LambdaFunction, LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Queue } from '@aws-cdk/aws-sqs';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { TemplateProps } from '../index';

export class RandomNumberStack extends Stack {
  constructor(scope: App, id: string, { maximum }: TemplateProps, stackProps?: StackProps) {
    super(scope, id, stackProps);

    const queue = new Queue(this, 'queue', {
      queueName: `random-number-queue-${maximum}`
    });

    const assetBucket = Bucket.fromBucketName(this, 'assetBucket', 'template-factory-asset-bucket');

    const publishLambda = new LambdaFunction(this, 'publishLambda', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromBucket(assetBucket, 'publish/deployment.zip'),
      layers: [
        new LayerVersion(this, 'publishLayer', {
          code: Code.fromBucket(assetBucket, 'publish/dependencies.zip')
        })
      ],
      handler: 'index.handler',
      environment: {
        QUEUE_URL: queue.queueUrl,
        MAXIMUM: maximum.toString()
      }
    });

    queue.grantSendMessages(publishLambda);

    new LambdaRestApi(this, 'publishEndpoint', {
      handler: publishLambda
    });

    const table = new Table(this, 'random-number-table', {
      partitionKey: { name: 'id', type: AttributeType.NUMBER },
      removalPolicy: RemovalPolicy.DESTROY
    });

    const subscribeLambda = new LambdaFunction(this, 'subscribeLambda', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromBucket(assetBucket, 'subscribe/deployment.zip'),
      layers: [
        new LayerVersion(this, 'subscribeLayer', {
          code: Code.fromBucket(assetBucket, 'subscribe/dependencies.zip')
        })
      ],
      handler: 'index.handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    subscribeLambda.addEventSource(new SqsEventSource(queue));

    table.grantWriteData(subscribeLambda);
  }
}
