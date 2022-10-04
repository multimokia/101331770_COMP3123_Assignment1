import { json } from "express";
import { Router } from "express";
import { User } from "../database/schemas.js";
import { validateMissingProperties } from "../helpers/propertyvalidators.js";
import { API_SECRET } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.route("/signup")
    .post(json(), (req, res) => {
        const propertyValidationResult = validateMissingProperties(
            req.body,
            ["username", "password", "email"]
        );

        if (!propertyValidationResult.status) {
            res.status(400).send(propertyValidationResult);
        }

        // Now, see if we have an entry with this username already
        User.findOne({username: req.body.username})
            .then(user => {
                if (user !== null) {
                    res.status(400).send({status: false, message: "Username taken."});
                    return;
                }

                if (req.body.password.length > 50) {
                    res.status(400).send({status: false, message: "Password must be no longer than 50 characters."});
                    return;
                }

                // No user with that name found. Let's create one
                new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8)
                }).save()
                    .then(() => {
                        res.status(201).send({status: true, message: "User created successfully"});
                    })
                    .catch(err => res.status(500).send({status: false, message: err}));
            })
            .catch(err => res.status(500).send({status: false, message: err}));
    });

router.route("/login")
    .post(json(), (req, res) => {
        const propertyValidationResult = validateMissingProperties(
            req.body,
            ["username", "email", "password"]
        );

        if (!propertyValidationResult.status) {
            res.status(400).send(propertyValidationResult);
            return;
        }

        // TODO: Encrypt the password and secure this
        User.findOne({email: req.body.email})
            .then(user => {
                if (user === null) {
                    res.status(401).send({status: false, message: "Invalid username and/or password."});
                    return;
                }

                // compare pws
                const isPasswordValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!isPasswordValid) {
                    res.status(401).send({status: false, message: "Invalid password."});
                    return;
                }

                // Otherwise, we should sign a token
                const token = jwt.sign(
                    {id: user.id},
                    API_SECRET!,
                    {expiresIn: 86400}
                );

                res.status(200).send({
                    status: true,
                    username: user.username,
                    message: "User logged in successfully.",
                    jwt_token: token
                });
            })
            .catch(() => {
                // In the interest of security, we do not allow the requester to know if an account exists with this info
                res.status(401).send({status: false, message: "Invalid password."});
            });
    });

export { router };
