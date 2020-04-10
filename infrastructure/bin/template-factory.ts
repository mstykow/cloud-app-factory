#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { TemplateFactoryStack } from '../lib/template-factory-stack';

const app = new cdk.App();
new TemplateFactoryStack(app, 'TemplateFactoryStack');
