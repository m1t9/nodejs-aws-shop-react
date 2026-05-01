import * as cdk from 'aws-cdk-lib/core';
import { StaticSite } from '../lib/deployment-stack';

class MyStaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new StaticSite(this, 'JSCSSStaticWebsite', {
      sitePath: '../dist',
    });
  }
}

const app = new cdk.App();
new MyStaticSiteStack(app, 'DeploymentStack');
app.synth();