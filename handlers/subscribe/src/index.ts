import { SQSEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler = ({ Records: records }: SQSEvent): void => {
  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    throw new Error('No table name specified');
  }

  const dynamoDb = new AWS.DynamoDB();

  records.forEach(async record => {
    const params: AWS.DynamoDB.PutItemInput = {
      TableName: tableName,
      Item: {
        id: {
          N: record.body
        }
      }
    };

    await dynamoDb.putItem(params).promise();
  });
};
