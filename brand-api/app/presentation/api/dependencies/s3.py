from app.infrastructure.external.s3_service import S3Service


def get_s3_service() -> S3Service:
    return S3Service()
