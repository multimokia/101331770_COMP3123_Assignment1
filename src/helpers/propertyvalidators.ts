interface Indexable {
    [key: string]: object | string | number | []
}

export function validateMissingProperties(obj: Indexable, required_keys: string[]): {status: boolean, message: string} {
    const rv = {
        status: true
    };
    const missing_keys = [];

    for (const required_key of required_keys) {
        if (obj[required_key] === undefined) {
            rv.status = false;
            missing_keys.push(required_key);
        }
    }

    return {
        status: missing_keys.length === 0,
        message: `Key(s): ${missing_keys.join(", ")} are missing.`
    };
}
