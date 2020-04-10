import { App, Aws } from '@aws-cdk/core';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import YAML from 'yaml';
import { RandomNumberStack } from './template/RandomNumberStack';

export interface TemplateProps {
  maximum: number;
}

export const handler = async (event: Partial<APIGatewayEvent>): Promise<APIGatewayProxyResult> => {
  console.log('Event received: ', event);

  if (!event.body) {
    console.log('Missing request body');
    return {
      statusCode: 400,
      body: 'Missing request body'
    };
  }

  let template: string | undefined;
  try {
    const templateProps: TemplateProps = JSON.parse(event.body);
    template = generateTemplate(templateProps);
    console.log('Template generated: ', template);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: `Internal server error: ${error.toString()}`
    };
  }

  return {
    statusCode: 200,
    body: template, // This is a YAML string. Convert to JSON if needed. CloudFormation accepts both.
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,Host,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'
    }
  };
};

const generateTemplate = (templateProps: TemplateProps) => {
  const cdkApp = new App();
  const stackName = 'randomNumberStack';

  new RandomNumberStack(cdkApp, stackName, templateProps, {
    env: {
      account: Aws.ACCOUNT_ID,
      region: 'us-east-1'
    }
  });

  const assembly = cdkApp.synth();

  return YAML.stringify(assembly.getStack(stackName).template);
};
