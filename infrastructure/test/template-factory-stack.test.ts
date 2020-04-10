import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { TemplateFactoryStack } from '../lib/template-factory-stack';

describe('TemplateFactoryStack', () => {
  const app = new App();

  it('contains Lambda function, REST API, and asset bucket', () => {
    // given
    const stack = new TemplateFactoryStack(app, 'TemplateFactoryStack');

    // then
    expectCDK(stack).to(
      haveResource('AWS::Lambda::Function', { MemorySize: 256 }).and(
        haveResource('AWS::ApiGateway::RestApi').and(haveResource('AWS::S3::Bucket'))
      )
    );
  });
});
