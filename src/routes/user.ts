import { json } from "express";
import { Router } from "express";
import { User } from "../database/schemas.js";

const router = Router();

router.route("/signup")
    .post(json(), (req, res) => {
        if (req.body.username === undefined) {
            res.status(400).send({status: false, message: "Username missing."});
            return;
        }

        else if (req.body.email === undefined) {
            res.status(400).send({status: false, message: "Email missing."});
            return;
        }

        else if (req.body.password === undefined) {
            res.status(400).send({status: false, message: "Password missing."});
            return;
        }

        // Now, see if we have an entry with this username already
        User.findOne({username: req.body.username})
            .then(user => {
                if (user !== null) {
                    res.status(400).send({status: false, message: "Username taken."});
                    return;
                }

                // No user with that name found. Let's create one
                new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
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
        if (req.body.username === undefined) {
            res.status(400).send({status: false, message: "Username missing."});
            return;
        }

        else if (req.body.password === undefined) {
            res.status(400).send({status: false, message: "Password missing."});
            return;
        }

        // TODO: Encrypt the password and secure this
        User.findOne({username: req.body.username, password: req.body.password})
            .then(user => {
                if (user === null) {
                    res.status(401).send({status: false, message: "Invalid username and/or password."});
                    return;
                }

                res.status(200).send({status: true, message: "Authentication successful"});
            })
            .catch(err => res.status(500).send({status: false, message: err}));
    });

export { router };
