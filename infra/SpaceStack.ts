import { join } from 'path'
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

import { GenericTable } from './GenericTable'

export class SpaceStack extends Stack {
  //api gateway
  private api = new RestApi(this, 'SpaceApi')

  //table for dynamodb
  private spacesTable = new GenericTable('SpacesTable', 'spaceId', this)

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const helloLambdaNode = new NodejsFunction(this, 'helloLambdaNode', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    })

    //allowing the lambda to list S3 buckets
    const s3ListPolicy = new PolicyStatement()
    s3ListPolicy.addActions('s3:ListAllMyBuckets')
    s3ListPolicy.addResources('*') //bad practice i know - only used for testing. Will fix in future
    helloLambdaNode.addToRolePolicy(s3ListPolicy)

    //hello api lambda integration to api gateway
    const lambdaIntegration = new LambdaIntegration(helloLambdaNode)
    const helloLambdaResource = this.api.root.addResource('hello')
    helloLambdaResource.addMethod('GET', lambdaIntegration)
  }
}
