import time
import uuid

from fastapi import Request


async def logging_and_timing_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()

    response = await call_next(request)

    process_time = (time.time() - start_time) * 1000
    formatted_process_time = f"{process_time:.2f}"

    response.headers["X-Request-ID"] = request_id

    log_message = (
        f"RequestID: {request_id} | "
        f"Method: {request.method} | "
        f"Path: {request.url.path} | "
        f"StatusCode: {response.status_code} | "
        f"RquestTimeLatency: {formatted_process_time}ms"
    )
    print(log_message)

    return response
