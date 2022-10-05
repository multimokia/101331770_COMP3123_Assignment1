export function ok(res: any, options: object = {message: "Success."}): void {
    res.status(200).send({...{status: true}, ...options});
}

export function itemCreated(res: any, options: object = {message: "Created."}): void {
    res.status(201).send({...{status: true}, ...options});
}

export function noContent(res: any, options: object = {message: "No content."}): void {
    res.status(204).send({...{status: true}, ...options});
}

export function badRequest(res: any, options: object = {message: "Bad request."}): void {
    res.status(400).send({...{status: false}, ...options});
}

export function unauthorized(res: any, options: object = {message: "Unauthorized."}): void {
    res.status(401).send({...{status: false}, ...options});
}

export function notFound(res: any, options: object = {message: "Not found."}): void {
    res.status(404).send({...{status: false}, ...options});
}

export function methodNotAllowed(res: any, options: object = {message: "Method not allowed."}): void {
    res.status(405).send({...{status: false}, ...options});
}

export function alreadyExists(res: any, options: object = {message: "Item already exists."}): void {
    res.status(409).send({...{status: false}, ...options});
}

export function internalServerError(res: any, options: object = {message: "Item created."}): void {
    res.status(500).send({...{status: false}, ...options});
}
