import express from "express";
const routes = express.Router();

import {
    getEmployees,
    findEmployeeById,
    postAddEmployee,
    putUpdateEmployee,
    deleleEmployee,
    checkDuplicate,
    searchEmployees,
} from "../../api/v1/employee/employee.controller";

routes.get("/employees", getEmployees);
routes.get("/employees/check", checkDuplicate);
routes.get("/employees/search", searchEmployees);
routes.get("/employees/:id", findEmployeeById);

routes.post("/employees", postAddEmployee);
routes.put("/employees/:id", putUpdateEmployee);
routes.delete("/employees/:id", deleleEmployee);

module.exports = routes;
