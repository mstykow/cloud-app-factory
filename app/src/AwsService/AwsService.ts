import * as AWS from 'aws-sdk';
import CloudFormation from 'aws-sdk/clients/cloudformation';

type Credentials = Pick<AWS.Credentials, 'accessKeyId' | 'secretAccessKey' | 'sessionToken'>;

class AwsService {
  private cloudFormation: CloudFormation | null;

  constructor() {
    this.cloudFormation = null;
  }

  public init(credentials: Credentials, region: string) {
    this.setCredentials(credentials);
    this.setRegion(region);
  }

  public setCredentials(credentials: Credentials) {
    AWS.config.credentials = credentials;
  }

  public unsetCredentials() {
    AWS.config.credentials = null;
  }

  public setRegion(region: string) {
    this.cloudFormation = new CloudFormation({ region });
  }

  public createStackFromTemplate(stackName: string, template: string): Promise<string> {
    const params: CloudFormation.CreateStackInput = {
      StackName: stackName,
      TemplateBody: template,
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
    };

    return new Promise((resolve, reject) => {
      this.cloudFormation!.createStack(params, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data.StackId);
      });
    });
  }
}

export default new AwsService();
