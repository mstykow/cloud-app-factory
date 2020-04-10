import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Code, Function as LambdaFunction, LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';

export class TemplateFactoryStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const assetBucket = new AutoDeleteBucket(this, 'assetBucket', {
      bucketName: 'template-factory-asset-bucket',
    });

    new BucketDeployment(this, 'publishPackage', {
      destinationBucket: assetBucket,
      sources: [Source.asset('../handlers/publish/packaged')],
      destinationKeyPrefix: 'publish',
    });

    new BucketDeployment(this, 'subscribePackage', {
      destinationBucket: assetBucket,
      sources: [Source.asset('../handlers/subscribe/packaged')],
      destinationKeyPrefix: 'subscribe',
    });

    const factoryLambda = new LambdaFunction(this, 'factoryLambda', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('../handlers/factory/packaged/deployment.zip'),
      layers: [
        new LayerVersion(this, 'factoryLayer', {
          code: Code.fromAsset('../handlers/factory/packaged/dependencies.zip'),
        }),
      ],
      handler: 'index.handler',
      memorySize: 256,
    });

    new LambdaRestApi(this, 'factoryEndpoint', {
      handler: factoryLambda,
    });
  }
}
