export function ok(res, options = { message: "Success." }) {
    res.status(200).send(Object.assign({ status: true }, options));
}

export function itemCreated(res, options = { message: "Created." }) {
    res.status(201).send(Object.assign({ status: true }, options));
}

export function noContent(res, options = { message: "No content." }) {
    res.status(204).send(Object.assign({ status: true }, options));
}

export function badRequest(res, options = { message: "Bad request." }) {
    res.status(400).send(Object.assign({ status: false }, options));
}

export function unauthorized(res, options = { message: "Unauthorized." }) {
    res.status(401).send(Object.assign({ status: false }, options));
}

export function notFound(res, options = { message: "Not found." }) {
    res.status(404).send(Object.assign({ status: false }, options));
}

export function methodNotAllowed(res, options = { message: "Method not allowed." }) {
    res.status(405).send(Object.assign({ status: false }, options));
}

export function alreadyExists(res, options = { message: "Item already exists." }) {
    res.status(409).send(Object.assign({ status: false }, options));
}

export function internalServerError(res, options = { message: "Item created." }) {
    res.status(500).send(Object.assign({ status: false }, options));
}
