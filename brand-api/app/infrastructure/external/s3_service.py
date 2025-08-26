import boto3
from botocore.exceptions import ClientError

from app.core.config import get_settings

settings = get_settings()


import logging

logger = logging.getLogger(__name__)


class S3Service:
    def __init__(self):
        if (
            settings.aws_access_key_id
            and settings.aws_secret_access_key
            and settings.aws_region_name
            and settings.aws_s3_bucket_name
        ):
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.aws_access_key_id,
                aws_secret_access_key=settings.aws_secret_access_key,
                region_name=settings.aws_region_name,
            )
            self.bucket_name = settings.aws_s3_bucket_name
            logger.info("S3Service initialized successfully.")
        else:
            self.s3_client = None
            self.bucket_name = None
            logger.warning(
                "S3Service not initialized: Missing AWS credentials or bucket name in settings."
            )

    def upload_file(
        self, file_content: bytes, object_name: str, content_type: str
    ) -> str:
        if self.s3_client is None:
            logger.error("S3Service is not configured. Cannot upload file.")
            raise RuntimeError("S3 service is not configured.")
        try:
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=object_name,
                Body=file_content,
                ContentType=content_type,
            )
            file_url = (
                f"https://{self.bucket_name}.s3."
                f"{settings.aws_region_name}.amazonaws.com/{object_name}"
            )
            return file_url
        except ClientError as e:
            logger.error(f"Error uploading file to S3: {e}")
            raise

    def create_presigned_url(self, object_name: str, expiration: int = 3600):
        """Generate a presigned URL to share an S3 object"""
        if self.s3_client is None:
            logger.error("S3Service is not configured. Cannot create presigned URL.")
            raise RuntimeError("S3 service is not configured.")
        try:
            response = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": object_name},
                ExpiresIn=expiration,
            )
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {e}")
            raise
        return response
