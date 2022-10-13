export function respond(res, body) {
    res.status(body.statusCode).send(body);
}

export function ok(additionalFields = {}) {
    return Object.assign({ statusCode: 200, status: true, message: "Success." }, additionalFields);
}

export function itemCreated(additionalFields = {}) {
    return Object.assign({ statusCode: 201, status: true, message: "Created" }, additionalFields);
}

export function noContent(additionalFields = {}) {
    return Object.assign({ statusCode: 204, status: true, message: "No content." }, additionalFields);
}

export function badRequest(additionalFields = {}) {
    return Object.assign({ statusCode: 400, status: false, message: "Bad request." }, additionalFields);
}

export function unauthorized(additionalFields = {}) {
    return Object.assign({ statusCode: 401, status: false, message: "Unauthorized" }, additionalFields);
}

export function notFound(additionalFields = {}) {
    return Object.assign({ statusCode: 404, status: false, message: "Not found." }, additionalFields);
}

export function methodNotAllowed(additionalFields = {}) {
    return Object.assign({ statusCode: 405, status: false, message: "Method not allowed." }, additionalFields);
}

export function conflict(additionalFields = {}) {
    return Object.assign({ statusCode: 409, status: false, message: "Conflict." }, additionalFields);
}

export function internalServerError(additionalFields = {}) {
    return Object.assign({ statusCode: 500, status: false, message: "Internal server error." }, additionalFields);
}
