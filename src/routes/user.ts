import { json } from "express";
import { Router } from "express";
import { User } from "../database/schemas.js";
import { validateMissingProperties } from "../helpers/propertyvalidators.js";
import { API_SECRET } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    alreadyExists,
    badRequest,
    internalServerError,
    itemCreated,
    ok,
    unauthorized
} from "../helpers/responses.js";

const router = Router();

router.route("/signup")
    .post(json(), (req, res) => {
        const propertyValidationResult = validateMissingProperties(
            req.body,
            ["username", "password", "email"]
        );

        if (!propertyValidationResult.status) {
            badRequest(res, propertyValidationResult);
        }

        // Now, see if we have an entry with this username already
        User.findOne({username: req.body.username})
            .then(user => {
                if (user !== null) {
                    return alreadyExists(res, {message: "User already exists."});
                }

                if (req.body.password.length > 50) {
                    badRequest(res, {message: "Password must be no longer than 50 characters."});
                    return;
                }

                // No user with that name found. Let's create one
                new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8)
                }).save()
                    .then(() => {
                        itemCreated(res, {message: "User created successfully"});
                    })
                    .catch(err => internalServerError(res, {message: err}));
            })
            .catch(err => internalServerError(res, {message: err}));
    });

router.route("/login")
    .post(json(), (req, res) => {
        const propertyValidationResult = validateMissingProperties(
            req.body,
            ["username", "password"]
        );

        if (!propertyValidationResult.status) {
            return badRequest(res, propertyValidationResult);
        }

        User.findOne({username: req.body.username})
            .then(user => {
                if (user === null) {
                    return unauthorized(res);
                }

                // compare pws
                const isPasswordValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!isPasswordValid) {
                    return unauthorized(res, {message: "Invalid password."});
                }

                // Otherwise, we should sign a token
                const token = jwt.sign(
                    {id: user.id},
                    API_SECRET!,
                    {expiresIn: 86400}
                );

                return ok(res, {
                    username: user.username,
                    message: "User logged in successfully.",
                    jwt_token: token
                });
            })
            .catch(() => {
                // In the interest of security, we do not allow the requester to know if an account exists with this info
                return unauthorized(res, {message: "Invalid password."});
            });
    });

export { router };
