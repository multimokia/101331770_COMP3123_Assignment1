import { json } from "express";
import { Router } from "express";
import { validateMissingProperties } from "../helpers/propertyvalidators.js";
import {
    badRequest,
    respond
} from "../helpers/responses.js";
import { loginUser, registerUser } from "../services/userserviceprovider.js";

const router = Router();

router.route("/signup")
    .post(json(), (req, res) => {
        const propertyValidationResult = validateMissingProperties(
            req.body,
            ["username", "password", "email"]
        );

        if (!propertyValidationResult.status) {
            return respond(res, badRequest(propertyValidationResult));
        }

        // Now, see if we have an entry with this username already
        registerUser(req.body)
            .then(payload => respond(res, payload))
            .catch(payload => respond(res, payload));
    });

router.route("/login")
    .post(json(), (req, res) => {
        const propertyValidationResult = validateMissingProperties(
            req.body,
            ["username", "password"]
        );

        if (!propertyValidationResult.status) {
            return respond(res, badRequest(propertyValidationResult));
        }

        loginUser(req.body.username, req.body.password)
            .then(payload => respond(res, payload))
            .catch(payload => respond(res, payload));
    });

export { router };
