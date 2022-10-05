import { json } from "express";
import { Router } from "express";
import { Employee } from "../database/schemas.js";
import { validateMissingProperties } from "../helpers/propertyvalidators.js";
import { badRequest, itemCreated, ok, internalServerError, notFound, methodNotAllowed, noContent } from "../helpers/responses.js";

const router = Router();

router.route("/")
    .get((req, res) => {
        Employee.find({})
            .then(results => {
                ok(res, {content: results});
            })
            .catch(err => internalServerError(res, {message: err}));
    })
    .post(json(), (req, res) => {
        const propValidationResult = validateMissingProperties(
            req.body,
            ["first_name", "last_name", "email", "salary"]
        );

        if (!propValidationResult.status) {
            badRequest(res, propValidationResult);
            return;
        }

        // Now, see if we have an entry with this email already (since email addresses are unique)
        Employee.findOne({email: req.body.email})
            .then(user => {
                if (user !== null) {
                    badRequest(res, {message: "An employee using this email already exists."});
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
                        itemCreated(res, {message: "Employee created successfully"});
                    })
                    .catch(err => internalServerError(res, {message: err}));
            })
            .catch(err => internalServerError(res, {message: err}));
    });

router.route("/:id")
    .get((req, res) => {
        Employee.findOne({_id: req.params.id})
            .then(employee => {
                if (employee === null) {
                    notFound(res, {message: `Employee with id ${req.params.id} not found.`});
                    return;
                }

                // Otherwise send data
                ok(res, {content: employee});
            })
            .catch(err => internalServerError(res, {message: err}));
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
                        methodNotAllowed(res, {message: "Employee could not be updated."});
                    }
                    else {
                        notFound(res, {status: false, message: `Employee with id ${req.params.id} not found.`});
                    }

                    return;
                }

                ok({message: `Employee ${req.params.id} updated.`});
            })
            .catch(err => internalServerError(res, {message: err}));
    })
    .delete((req, res) => {
        Employee.deleteOne({_id: req.params.id})
            .then(result => {
                if (result.deletedCount === 0) {
                    notFound(res, {message: `Employee with id ${req.params.id} not found.`});
                    return;
                }

                // Id existed, and has been deleted
                noContent(res, {message: `Employee ${req.params.id} has been deleted.`});
            })
            .catch(err => internalServerError(res, {message: err}));
    });

export { router };
