# cloud-app-factory

_Cloud App Factory_ is a proof of concept of how to integrate infrastructure as code into a web app.

## Use Case

As DevOps engineers we might ask: how can we give our users deeper access to cloud services and infrastructure without needing to burden them with the particulars of our tech stack? For example:

- How can we enable data stewards to easily run dynamic and serverless ETL jobs without forcing them to learn PySpark and AWS Glue?
- How can we enable data scientist to launch custom configured AWS EMR clusters or SageMaker notebooks at the click of a button?

The answer provided by this proof of concept is this:

1. Collect user input via a form on a website.
1. Send this input to a Lambda function running AWS CDK to generate a custom CloudFormation template.
1. Return the template to the web application and CRUD the required infrastructure through the AWS CloudFormation SDK. Credentials to do so can be obtained via a custom user pool or, not implemented here, a federated login.

## Proof of Concept

Introducing some terminology, we will refer to the actual use case application about to be described as "cloud app" whereas the application building the cloud app will be referred to as "web app".

So consider the following cloud app:

![random-number-app](random-number-app.jpg?raw=true 'Random Number App')

A user arrives at an API gateway which generates a random number between 1 and some maximum `x`. The random number is sent to a queue by a Lambda function where it is picked up by another Lambda function and stored in a database (DynamoDB).

Users of the web app will be able to specify `x` before deploying the cloud app to their own AWS account. That means they can deploy one copy of the cloud app per choice of `x` which is why the current project is called _Cloud App Factory_.

## Project Root

The present project is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) written entirely in TypeScript, both frontend and backend.

To more efficiently manage the dependencies, the project is bootstrapped with [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). In the project root you can run the following commands:

### `yarn install`

Install dependencies for the React app and CDK stack. Dependencies for the backends are maintained separately to allow for easier packaging into [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html).

### `yarn upgrade`

Upgrade dependencies of React app and CDK stack.

### `yarn build`

Prepares all Lambda handlers for deployment with CDK. One of the Lambda handlers, `factory`, is the backend of the web app whereas `publish` and `subscribe` are the backends of the cloud app. They are uploaded and stored inside an S3 bucket of the AWS account deploying the web app until needed to build the cloud app.

### `yarn start`

Runs the web app in development mode and opens [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn lint`

Runs the linter (ESLint) through the entire project.

### `yarn format`

Runs the formatter (prettier) through the entire project.

## Infrastructure

The infrastructure required for the backend of the web app is managed with [AWS CDK](https://docs.aws.amazon.com/cdk/index.html). Some commands you can run in directory `infrastructure`:

### `cdk deploy`

Deploy the backend to your default AWS account/region.

### `cdk diff`

Compare deployed stack with local state.

### `cdk synth`

Emit a CloudFormation template corresponding to the local state.

### `yarn test`

Runs unit tests.

## Web App

The web app was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [AWS Amplify](https://aws-amplify.github.io/).

After deploying the infrastructure you need to adjust the `TEMPLATE_FACTORY_INVOKE_URL` in `src/config.ts` and give the Amplify auth role used by your Cognito users CloudFormation permissions.

In the `app` directory, you can run:

### `yarn test`

Runs unit tests.

### `amplify status`

Shows the status of all cloud resources deployed by Amplify.

### `amplify add auth`

Add authentication backend which frontend needs to obtain credentials to communicate with AWS.

### `amplify remove auth`

Remove authentication backend.
