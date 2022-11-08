import { S3 } from 'aws-sdk'
import { v4 } from 'uuid'

const s3Client = new S3()

const handler = async (event: any, context: any) => {
  const buckets = await s3Client.listBuckets().promise()

  console.log('Event triggered')
  console.log(event)

  return {
    statusCode: 200,
    body:
      'Here are the list of your S3 Buckets ' + JSON.stringify(buckets.Buckets),
  }
}
export { handler }
