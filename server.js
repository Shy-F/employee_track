const inquirer = require('inquirer');

const conTable = require('console.table');
const Connection = require('mysql2/typings/mysql/lib/Connection');

require('dotenv').config()

const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View departments', 'View roles', 'View employees', 'Add department', 'Add role', 'Add employee', 'Update employee role', 'Update manager', 'View employees by department', 'Delete role', 'Delete department', 'Delete employee', 'Exit']
        }
    ])

    .then((options) => {
        const {choices} = options;

        if (choices === 'View departments') {
            viewDepartments();
        }

        if (choices === 'View roles') {
            viewRoles();
        }

        if (choices === 'View employees') {
            viewEmployees();
        }

        if (choices === 'Add department') {
            addDepartment();
        }

        if (choices === 'Add role') {
            addRole();
        }

        if (choices === 'Add employee') {
            addEmployee();
        }

        if (choices === 'Update employee role') {
            updateEmployee();
        }

        if (choices === 'Update manager') {
            updateManager();
        }

        if (choices === 'View employees by department') {
            employeeDepartment();
        }

        if (choices === 'Delete role') {
            deleteRole();
        }

        if (choices === 'Delete department') {
            deleteDepartment();
        }

        if (choices === 'Delete employee') {
            deleteEmployee();
        }

        if (choices === 'Exit') {
            conncection.end()
        };
    });
};

viewDepartments = () => {
    console.log('Viewing departments');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    conncection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser;
    });
};

viewRoles = () => {
    console.log('Viewing roles');
    const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

    conncection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser;
    });
};

viewEmployees = () => {
    console.log('Viewing employees');
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    conncection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser;
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department'
            message: 'What department are you adding?',
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                }else {
                    console.log('Must enter Department name');
                    return false;
                }
            }
        }
    ])

    .then(options => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        Connection.query(sql, options.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + options.addDepartment);

            viewDepartments();
        });
    });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'Role'
            message: 'What role are you adding?',
            validate: addRole => {
                if (addRole) {
                    return true;
                }else {
                    console.log('Must enter role name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Insert salary for this role',
        }
    ])

    .then(options => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        Connection.query(sql, options.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + options.addDepartment);

            viewDepartments();
        });
    });
};