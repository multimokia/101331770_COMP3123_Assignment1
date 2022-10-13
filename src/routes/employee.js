import { json } from "express";
import { Router } from "express";
import { validateMissingProperties } from "../helpers/propertyvalidators.js";
import { badRequest, respond } from "../helpers/responses.js";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployee, updateEmployee } from "../services/employeeserviceprovider.js";

const router = Router();

router.route("/")
    .get((req, res) => {
        getAllEmployees()
            .then(payload => respond(res, payload))
            .catch(payload => respond(res, payload));
    })
    .post(json(), (req, res) => {
        const propValidationResult = validateMissingProperties(
            req.body,
            ["first_name", "last_name", "email", "salary"]
        );

        if (!propValidationResult.status) {
            return respond(res, badRequest(propValidationResult));
        }

        // Now, see if we have an entry with this email already (since email addresses are unique)
        createEmployee({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            salary: req.body.salary,
            gender: req.body.gender ?? null
        })
            .then(payload => respond(res, payload))
            .catch(payload => respond(res, payload));
    });

router.route("/:id")
    .get((req, res) => {
        getEmployee(req.params.id)
            .then(payload => respond(res, payload))
            .catch(payload => respond(res, payload));
    })
    .put(json(), (req, res) => {
        const propValidationResult = validateMissingProperties(
            req.body,
            ["first_name", "last_name", "email", "salary"]
        );

        if (!propValidationResult.status) {
            return respond(res, badRequest(propValidationResult));
        }

        // NOTE: we explicitly pass an object for update as a means of
        // Ensuring no additional properties get added
        updateEmployee(req.params.id, req.body)
            .then(payload => respond(res, payload))
            .catch(payload => respond(res, payload));
    })
    .delete((req, res) => {
        deleteEmployee(req.params.id)
            .then(payload => respond(res, payload))
            .catch(payload => respond(res, payload));
    });

export { router };
