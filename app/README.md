# Useful commands

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and [AWS Amplify](https://aws-amplify.github.io/).

In the project directory, you can run:

## `yarn start`

Runs the app in the development mode and opens [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

## `yarn lint`

Runs the linter (ESLint).

## `yarn format`

Runs the formatter (prettier).

## `yarn test`

Runs unit tests.

## `amplify status`

Shows the status of all cloud resources deployed by Amplify.

## `amplify add auth`

Add authentication backend which frontend needs to obtain credentials to communicate with AWS.

One manual step is required: you must give the Amplify auth role used by the Cognito user pool CloudFormation permissions.

## `amplify remove auth`

Remove authentication backend.
