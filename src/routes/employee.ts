import { json } from "express";
import { Router } from "express";
import { Employee } from "../database/schemas.js";
import { validateMissingProperties } from "../helpers/propertyvalidators.js";

const router = Router();

router.route("/")
    .get((req, res) => {
        Employee.find({})
            .then(results => {
                res.status(200).send(results);
            })
            .catch(err => res.status(500).send({status: false, message: err}));
    })
    .post(json(), (req, res) => {
        const propValidationResult = validateMissingProperties(
            req.body,
            ["first_name", "last_name", "email", "salary"]
        );

        if (!propValidationResult.status) {
            res.status(400).send(propValidationResult);
            return;
        }

        // Now, see if we have an entry with this email already (since email addresses are unique)
        Employee.findOne({email: req.body.email})
            .then(user => {
                if (user !== null) {
                    res.status(400).send({status: false, message: "An employee using this email already exists."});
                    return;
                }

                // No user with that name found. Let's create one
                new Employee({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    salary: req.body.salary,
                    gender: req.body.gender ?? null
                }).save()
                    .then(() => {
                        res.status(201).send({status: true, message: "Employee created successfully"});
                    })
                    .catch(err => res.status(500).send({status: false, message: err}));
            })
            .catch(err => res.status(500).send({status: false, message: err}));
    });

router.route("/:id")
    .get((req, res) => {
        Employee.findOne({_id: req.params.id})
            .then(employee => {
                if (employee === null) {
                    res.status(404).send({status: false, message: `Employee with id ${req.params.id} not found.`});
                    return;
                }

                // Otherwise send data
                res.status(200).send(employee);
            })
            .catch(err => res.status(500).send({status: false, message: err}));
    })
    .put(json(), (req, res) => {
        // NOTE: we explicitly pass an object for update as a means of
        // Ensuring no additional properties get added
        Employee.updateOne(
            {_id: req.params.id},
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                salary: req.body.salary,
                gender: req.body.gender ?? null
            }
        )
            .then(result => {
                if (result.modifiedCount === 0) {
                    if (result.matchedCount > 0) {
                        res.status(405).send({status: false, message: "Employee could not be updated."});
                    }
                    else {
                        res.status(404).send({status: false, message: `Employee with id ${req.params.id} not found.`});
                    }

                    return;
                }

                res.status(200).send({status: true, message: `Employee ${req.params.id} updated.`});
            })
            .catch(err => res.status(500).send({status: false, message: err}));
    })
    .delete((req, res) => {
        Employee.deleteOne({_id: req.params.id})
            .then(result => {
                if (result.deletedCount === 0) {
                    res.status(404).send({status: false, message: `Employee with id ${req.params.id} not found.`});
                    return;
                }

                // Id existed, and has been deleted
                res.status(204).send({status: true, message: `Employee ${req.params.id} has been deleted.`});
            })
            .catch(err => res.status(500).send({status: false, message: err}));
    });

export { router };
