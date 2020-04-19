# cloud-app-factory

_Cloud App Factory_ is a tutorial of how to deploy Cloud infrastructure at the click of a web app button.

![generate-template-success](media/generate-template-success.png#75p)

## Cloud Use Cases for Everyone

As Cloud architects and DevOps engineers we might ask: how can we bridge the gap between users of Cloud services—data engineers, data scientists, BI developers—and the particulars of our organization's Cloud infrastructure even more? For example:

- Learning how to upload a file into a Cloud storage container may seem easy but what if I have a whole database to migrate? How can we enable data stewards to easily run dynamic and serverless ETL jobs without requiring them to learn PySpark and Cloud ETL tools such as [AWS Glue](https://aws.amazon.com/glue/)?
- Starting a virtual machine in the Cloud to train a machine learning model can be learned. But what if a data scientist has additional requirements like integrating a model into a pipeline or combining raw computational power with Spark distributed computing?

Instead of reinventing the wheel one user and script at a time, we can modularize our Cloud applications and give them parameters to make them reusable. For example, we may write a PySpark script to perform a simple database migration task that has input parameters for a JDBC URL, user credentials, database, schema, and table names. We could then share this script with others but still they would have to learn how to run it in the Cloud.

As a second step we could make our Cloud infrastructure reusable as well: tools such as Terraform allow us to spin up or power down all Cloud services required by our use case on the command line level. Still, we are not fully satisfied because now we need to run Terraform _for_ our users instead of them doing it themselves since the hurdle to learn Terraform is often too high.

So in a last iteration we create a user interface such as a web app which runs our infrastructure code based on some very simple user input received through a form on a page. That's what this tutorial is about: showing how to deploy Cloud infrastructure at the click of a button.

## Tutorial

In this tutorial we will build a web app that collects some input via a form. This input will be sent to an [AWS Lambda](https://aws.amazon.com/lambda/) function which dynamically generates for us the infrastructure code to deploy an application in the Cloud which we will call "cloud app" for short.

The cloud app used for this tutorial looks as follows:

![random-number-app](media/random-number-app.jpg?raw=true 'Random Number App')

A user arrives at an API gateway which generates a random number between 1 and some maximum `x`. The random number is sent to a queue by a Lambda function where it is picked up by another Lambda function and stored in a database (DynamoDB).

Users of the web app will be able to specify a parameter `x` before deploying the cloud app to their own AWS account. That means they can deploy one copy of the cloud app per choice of `x` which is why the current project is called _Cloud App Factory_.

To get started, please make sure the following libraries are installed globally on your system:

- [yarn package manager](https://yarnpkg.com/)
- [AWS Amplify CLI](https://aws-amplify.github.io/docs/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)

In addition, please [sign up for an AWS account](https://portal.aws.amazon.com/billing/signup?redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation). Free tier is sufficient.

## Step-by-Step

### 1. Cloning and initial setup

Start by cloning this repository.

Using HTTPS:

```bash
git clone https://github.com/mstykow/cloud-app-factory.git
```

Using SSH:

```bash
git clone git@github.com:mstykow/cloud-app-factory.git
```

Having done so, navigate to the root directory and execute the following command to install required dependencies and build all packages we need to deploy in the coming steps.

```bash
yarn && yarn build
```

### 2. Introducing the Web App Infrastructure

We are next going to deploy the backend infrastructure needed for the web app that creates the cloud app. This means:

- an API gateway wth a Lambda function on which we run the AWS CDK to generate infrastructure templates
- a bucket in which we store assets needed by the Cloud app on deployment

We are using the AWS CDK because

- it is easy to set up on a Lambda function: it's just another NPM library
- it generates templates for us that we can then use to interact with the AWS CloudFormation SDK
- it can be executed programmatically from within the Lambda function code instead of having to run a subprocess (Terraform)
- the AWS CDK can be used with your general purpose language of choice instead of forcing you into learning a domain specific language with limited logic and ecosystem (Terraform uses HCL2)

Have a look at the Lambda handler which runs the CDK in `/handlers/factory/index.ts`:

![cdk-lambda](media/cdk-lambda.png#75p)

We are receiving props specific to our use case (remember: that's the largest random number `x`) in line 23. But the real magic happens in line 57: the `.synth` method is how you can generate a CloudFormation template programmatically.

To deploy this Lambda function, we are again using the CDK. It's a bit of a mind-bender: we're using CDK to deploy another CDK application. It's like a dream within a dream ([Inception](https://en.wikipedia.org/wiki/Inception))!

### 3. Deploying the Web App Infrastructure

To run the CDK locally as a subprocess, we need to make sure that we have the AWS CLI installed and our default profile set up as the CDK will use the same credentials. After installing the AWS CLI, you can configure it with the following command:

```bash
aws configure
```

Also check out [this page](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html) for details about configuring your AWS CLI credentials.

You can test that everything works expectedly by running the following command which prints out a list of all S3 buckets that currently exist in your AWS account:

```bash
aws s3 ls
```

With the AWS CLI working, go to the `/infrastructure` directory and run

```bash
cdk deploy
```

You should see the following table of changes to be applied to your AWS account:

![cdk-deploy](media/cdk-deploy.png#75p)

After confirming and waiting some 5 minutes you should see the following output:

![cdk-output](media/cdk-output.png#75p)

This is the URL you can use to invoke the API gateway on which we run the CDK. We can already interact with it! Try the following command which sends an input parameter of 10 for `x` using cURL and returns a CloudFormation template:

```bash
curl --data "{\"maximum\":10}" INSERT_YOUR_OUTPUT_URL_HERE > template.yaml
```

This should generate a template file similar to the one you can find at `/infrastructure/template.yaml`. We could now go to CloudFormation in our AWS Console and deploy this template. However, in the next step we will also start setting up the web app that does this for us.

Before we go on, please copy the invoke URL to the correct place inside `app/src/config.ts`. You'll find a note there about where it goes.

### 4. Setting up a User Pool for the Web App

The quickest way for our web app to obtain AWS credentials similar to how we just obtained credentials for the AWS CLI is to use AWS Amplify. Amplify comes with a CLI that deploys all the necessary Cloud infrastructure to manage user pools that can log into our app. It also provides our React app with a higher order component called `withAuthenticator` that wraps our app in a convenient login mask.

We begin by setting up the Amplify backend. Go to `/app` and execute

```bash
amplify init
```

You should use parameters similar to the following:

![amplify-init](media/amplify-init.png#75p)

Note that in the last step we were able to specify an AWS profile known to the AWS CLI of which we are using credentials to deploy the Amplify backend in our account.

Next, we add the actual authentication backend:

```bash
amplify add auth
```

![amplify-add-auth](media/amplify-add-auth.png#75p)

and then

```bash
amplify push
```

### 5. Starting the App

Either going back to the root directory or still in `/app` execute

```bash
yarn start
```

to start the web app locally. You should be greeted by the following screen (our your localized version of it):

![web-auth](media/web-auth.png#75p)

After registering for an account, you will be greeted by the (highly-sophisticated) interface:

![select-random-number](media/select-random-number.png#75p)

### 6. Running the App

Open the developer console of your browser (Ctrl-Shift-I on Chrome) and click on the "REQUEST TEMPLATE" button. In the network tab under "preview" you will see that the template has been received successfully:

![generate-template-success](media/generate-template-success.png#75p)

When you try to build the template you'll get an error:

![build-stack-error](media/build-stack-error.png#75p)

This is because the Cognito auth role we are using while logged into the application does not yet have the correct grants to interact with CloudFormation. To fix this, log into your AWS account, navigate to IAM and search for the auth role:

![iam-auth-role](media/iam-auth-role.png#75p)

Choose the first entry and attach the administrator access policy:

![administrator-access](media/administrator-access.png#75p)

Note: in real life you should choose a more fine-granular access policy that allows precisely for the interaction with CloudFormation as well as the create calls of your particular application.

Now go back to the app and try to build the stack again:

![build-stack-success](media/build-stack-success.png#75p)

Head over to CloudFormation and you'll see your stacks in creation:

![creating-templates](media/creating-templates.png#75p)

Note how there are other stacks with different values for the max random number. Each stack has it's own invoke URL which when called generates a random number for you:

![stack-output](media/stack-output.png#75p)

![generate-random-number](media/generate-random-number.png#75p)

![dynamo-db](media/dynamo-db.png#75p)

The last screenshot is from DynamoDB where you can verify for yourself that the random number we just generated was successfully persisted by the cloud app.

And that's it! You've successfully deployed Infrastructure-as-Code from a web app.

### Cleanup

When you're done playing with the app, don't forget to clean up, i.e. delete, all the infrastructure we just created by...

... going to CloudFormation and hitting DELETE on all stacks we deployed from the app. You could implement the DELETE logic as part of a full CRUD functionality as part of the web app, too, which could be a good next task if you want to get your hands dirty and see how exactly the web app works.

... going to the `infrastructure/` directory and executing `cdk destroy`

... going to the `app/` directory and executing `amplify delete`. Before doing this step, you need to manually detach the administrator policy we added a few steps back.

## Summary of Useful Commands

### Project Root

The present project is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) written entirely in TypeScript, both frontend and backend.

To more efficiently manage the dependencies, the project is bootstrapped with [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). In the project root you can run the following commands:

#### `yarn install`

Install dependencies for the React app and CDK stack. Dependencies for the backends are maintained separately to allow for easier packaging into [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html).

#### `yarn upgrade`

Upgrade dependencies of React app and CDK stack.

#### `yarn build`

Prepares all Lambda handlers for deployment with CDK. One of the Lambda handlers, `factory`, is the backend of the web app whereas `publish` and `subscribe` are the backends of the cloud app. They are uploaded and stored inside an S3 bucket of the AWS account deploying the web app until needed to build the cloud app.

#### `yarn start`

Runs the web app in development mode and opens [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### `yarn lint`

Runs the linter (ESLint) through the entire project.

#### `yarn format`

Runs the formatter (prettier) through the entire project.

### Infrastructure

The infrastructure required for the backend of the web app is managed with [AWS CDK](https://docs.aws.amazon.com/cdk/index.html). Some commands you can run in directory `infrastructure`:

#### `cdk deploy`

Deploy the backend to your default AWS account/region.

#### `cdk diff`

Compare deployed stack with local state.

#### `cdk synth`

Emit a CloudFormation template corresponding to the local state.

#### `yarn test`

Runs unit tests.

### Web App

The web app was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [AWS Amplify](https://aws-amplify.github.io/).

After deploying the infrastructure you need to adjust the `TEMPLATE_FACTORY_INVOKE_URL` in `src/config.ts` and give the Amplify auth role used by your Cognito users CloudFormation permissions.

In the `app` directory, you can run:

#### `yarn test`

Runs unit tests.

#### `amplify status`

Shows the status of all cloud resources deployed by Amplify.

#### `amplify add auth`

Add authentication backend which frontend needs to obtain credentials to communicate with AWS.

#### `amplify remove auth`

Remove authentication backend.

#### `amplify delete`

Deletes all Cloud resources associated by Amplify with the current project.
