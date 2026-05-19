import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const BUCKET = 'patient-photos'
const PRESIGN_EXPIRES = 300 // 5 minutes to complete the upload

let client: S3Client | null = null

function getClient(): S3Client {
  if (client) return client

  const endpoint = process.env.MINIO_ENDPOINT
  const accessKey = process.env.MINIO_ACCESS_KEY
  const secretKey = process.env.MINIO_SECRET_KEY

  if (!endpoint || !accessKey || !secretKey) {
    throw new Error('MinIO env vars not set (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY)')
  }

  client = new S3Client({
    endpoint,
    region: 'us-east-1',
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  })

  return client
}

export async function ensurePhotosBucket() {
  const s3 = getClient()
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET }))
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET }))
  }
}

/**
 * Generate a presigned PUT URL so the browser uploads directly to MinIO.
 * Returns { uploadUrl, objectKey, publicUrl }
 */
export async function createPhotoUploadUrl({
  orgId,
  patientId,
  photoId,
  contentType,
}: {
  orgId: string
  patientId: string
  photoId: string
  contentType: string
}): Promise<{ uploadUrl: string; objectKey: string; publicUrl: string }> {
  await ensurePhotosBucket()

  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
  const objectKey = `${orgId}/${patientId}/${photoId}.${ext}`

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: objectKey,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn: PRESIGN_EXPIRES })
  const endpoint = process.env.MINIO_ENDPOINT!
  const publicUrl = `${endpoint}/${BUCKET}/${objectKey}`

  return { uploadUrl, objectKey, publicUrl }
}

/**
 * Delete a photo from MinIO by its object key.
 */
export async function deletePhoto(objectKey: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({ Bucket: BUCKET, Key: objectKey })
  )
}
