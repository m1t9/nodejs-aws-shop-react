import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdn from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export const PREFIX = 'NodeJsAWSShopReact';
export const BUCKET_NAME = 'm1t9-nodejs-aws-shop-react';

export interface StaticSiteProps extends cdk.StackProps {
  sitePath: string;
}

export class StaticSite extends Construct {
  public readonly url: string;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    const cloudFrontOAI = new cdn.OriginAccessIdentity(this, `${PREFIX}OAI`);

    const bucket = new s3.Bucket(this, `${PREFIX}Bucket`, {
      bucketName: `${BUCKET_NAME}-${cdk.Stack.of(this).account}-${cdk.Stack.of(this).region}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [bucket.arnForObjects('*')],
      principals: [
        new iam.CanonicalUserPrincipal(
          cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
        ),
      ],
    }));

    const distribution = new cdn.Distribution(this, `${PREFIX}Distribution`, {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
          originAccessIdentity: cloudFrontOAI,
        }),
        viewerProtocolPolicy: cdn.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
    });

    new s3Deploy.BucketDeployment(this, `${PREFIX}Deployment`, {
      sources: [s3Deploy.Source.asset(props.sitePath)],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    this.url = `https://${distribution.domainName}`;
  }
}