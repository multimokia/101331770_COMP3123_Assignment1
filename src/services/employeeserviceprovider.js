import { Employee } from "../database/schemas.js";
import { badRequest, conflict, internalServerError, itemCreated, methodNotAllowed, noContent, notFound, ok } from "../helpers/responses.js";

export async function getEmployee(id) {
    return new Promise((resolve, reject) => {
        Employee.findOne({_id: id})
            .then(employee => {
                if (employee === null) {
                    return reject(notFound({message: `Employee with id ${id} not found.`}));
                }

                // Otherwise send data
                resolve(ok({content: employee}));
            })
            // For security, we don't let API users get hints from errors
            .catch(() => reject(notFound()));
    });
}

export async function getAllEmployees() {
    return new Promise((resolve, reject) => {
        Employee.find({})
            .then(employees => resolve(ok({content: employees})))
            .catch(err => { reject(badRequest({err: err.message}));});
    });
}

export async function createEmployee(employeeData) {
    return new Promise((resolve, reject) => {
        Employee.findOne({email: employeeData.email})
            .then(employee => {
                if (employee !== null) {
                    return reject(conflict({message: "An employee using this email already exists."}));
                }

                // No employee with that name found. Let's create one
                const emp = new Employee({
                    first_name: employeeData.first_name,
                    last_name: employeeData.last_name,
                    email: employeeData.email,
                    salary: employeeData.salary,
                    gender: employeeData.gender ?? null
                });

                emp.save()
                    .then(() => resolve(itemCreated({message: "Employee created successfully"})))
                    .catch((err) => reject(internalServerError({message: err.message}))) ;
            })
            .catch((err) => reject(internalServerError({message: err.message})));
    });
}

export async function updateEmployee(id, employeeData) {
    return new Promise((resolve, reject) => {
        Employee.updateOne(
            {_id: id},
            {
                first_name: employeeData.first_name,
                last_name: employeeData.last_name,
                email: employeeData.email,
                salary: employeeData.salary,
                gender: employeeData.gender ?? null
            }
        )
            .then(result => {
                if (result.modifiedCount === 0) {
                    if (result.matchedCount > 0) {
                        return reject(methodNotAllowed({message: "Employee could not be updated."}));
                    }
                    return reject(notFound({message: `Employee with id ${id} not found.`}));
                }
                resolve(ok({message: `Employee ${id} updated.`}));
            })
            .catch(err => reject(internalServerError({message: err.message})));
    });
}

export async function deleteEmployee(id) {
    return new Promise((resolve, reject) => {
        Employee.deleteOne({_id: id})
            .then(result => {
                if (result.deletedCount === 0) {
                    return reject(notFound({message: `Employee with id ${id} not found.`}));
                }

                // Id existed, and has been deleted
                resolve(noContent({message: `Employee ${id} has been deleted.`}));
            })
            .catch(err => reject(internalServerError({message: err.message})));
    });
}
