const inquirer = require('inquirer');
const Connection = require('mysql2/typings/mysql/lib/Connection');
const mysql = require('mysql2');
const cTable = require('console.table');

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      options: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a Role',
                'Add an employee',
                'Update an employee role',]   
    }
  ])
    .then((choice) => {
      const { options } = choice;

      if (options === 'View all departments') {
        viewDepartments();
      }

      if (options === 'View all roles') {
        viewRoles();
      }

      if (options === 'View all employees') {
        viewEmployees();
      }

      if (options === 'Add a department') {
        addDepartment();
      }

      if (options === 'Add a role') {
        addRole();
      }

      if (options === 'Add an employee') {
        addEmployee();
      }

      if (options === 'Update an employee role') {
        updateEmployeeRole();
      };
    });
};

viewDepartments = () => {
  const sql = `Select department.id AS id, department.name as department FROM department`;

  Connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  })
};

viewRoles = () => {
  const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

  Connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  })
};