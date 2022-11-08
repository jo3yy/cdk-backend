import { join } from 'path'
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Code, Function as LambdaFn, Runtime } from 'aws-cdk-lib/aws-lambda'
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

import { GenericTable } from './GenericTable'

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceApi')

  private spacesTable = new GenericTable('SpacesTable', 'spaceId', this)

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const helloLambda = new LambdaFn(this, 'hello-world-lambda', {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(join(__dirname, '..', 'services', 'hello-world')),
      handler: 'helloWorld.main',
    })

    const helloLambdaNode = new NodejsFunction(this, 'helloLambdaNode', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    })

    //hello api lambda integration
    const lambdaIntegration = new LambdaIntegration(helloLambda)
    const helloLambdaResource = this.api.root.addResource('hello')
    helloLambdaResource.addMethod('GET', lambdaIntegration)
  }
}
