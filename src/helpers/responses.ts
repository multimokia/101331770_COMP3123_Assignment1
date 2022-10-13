export interface BaseResponse {
    statusCode: number,
    status: boolean
    message?: string,
    content?: object
}

export function respond(res: any, body: BaseResponse): void {
    res.status(body.statusCode).send(body);
}

export function ok(additionalFields: object = {}): BaseResponse {
    return {statusCode: 200, status: true, message: "Success.", ...additionalFields};
}

export function itemCreated(additionalFields: object = {}): BaseResponse {
    return {statusCode: 201, status: true, message: "Created", ...additionalFields};
}

export function noContent(additionalFields: object = {}): BaseResponse {
    return {statusCode: 204, status: true, message: "No content.", ...additionalFields};
}

export function badRequest(additionalFields: object = {}): BaseResponse {
    return {statusCode: 400, status: false, message: "Bad request.", ...additionalFields};
}

export function unauthorized(additionalFields: object = {}): BaseResponse {
    return {statusCode: 401, status: false, message: "Unauthorized", ...additionalFields};
}

export function notFound(additionalFields: object = {}): BaseResponse {
    return {statusCode: 404, status: false, message: "Not found.", ...additionalFields};
}

export function methodNotAllowed(additionalFields: object = {}): BaseResponse {
    return {statusCode: 405, status: false, message: "Method not allowed.", ...additionalFields};
}

export function conflict(additionalFields: object = {}): BaseResponse {
    return {statusCode: 409, status: false, message: "Conflict.", ...additionalFields};
}

export function internalServerError(additionalFields: object = {}): BaseResponse {
    return {statusCode: 500, status: false, message: "Internal server error.", ...additionalFields};
}
