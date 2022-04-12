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

viewEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS role FROM employee 
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id`;

  Connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  })
};

addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDepartment',
      message: 'What is the name of the new department?',
      validate: addDepartment => {
        if (addDepartment) {
          return true;
        } else {
          console.log('Please enter a department');
          return false;
        }
      }
    }
  ])
    .then(choice => {
      const sql = `INSERT INTO department (name)
                    VALUES (?)`;
      Connection.query(sql, choice.addDepartment, (err, result) => {
        if (err) throw err;
        console.log('New department' + choice.addDepartment + 'Added');

        viewDepartments();
      });
    });
};

addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: 'What is the new role you want to add?',
      validate: addRole => {
        if (addRole) {
          return true;
        } else {
          console.log('Please enter a role');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What salary does this role have?',
      validate: addSalary => {
        if (isNaN(addSalary)) {
          return true;
        } else {
          console.log('Please enter salary amount');
          return false;
        }
      }
    }
  ])
    .then(choice => {
      const stats = [choice.role, choice.salary];
      const sqlRole = `SELECT name, id FROM department`;

      Connection.promise().query(sqlRole, (err, data) => {
        if (err) throw err;

        const department = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'department',
            message: 'What department does this role belong to?',
            options: department
          }
        ])
          .then(departmentOption => {
            const dept = departmentOption.department;
            stats.push(department);

            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;

            Connection.query(sql, stats, (err, result) => {
              if (err) throw err;
              console.log('New role ' + choice.role + ' added');

              viewRoles();
            });
          });
      });
    });
};

addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee.',
      validate: addFn => {
        if (addFn) {
          return true;
        } else {
          console.log('Must enter first name');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee',
      validate: addLn => {
        if (addLn) {
          return true;
        } else {
          console.log('Must enter last name');
          return false;
        }
      }
    }
  ])
    .then(choice => {
      const stats = [choice.firstName, choice.lastName]
      const sqlRole = `SELECT role.id, role.title FROM role`;

      Connection.promise().query(sqlRole, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: 'Which role is this employee in?',
            options: roles
          }
        ])
          .then(roleOption => {
            const role = roleOption.role;
            stats.push(role);

            const sql = `INSERT INTO employee (title, salary, department_id)
            VALUES (?, ?, ?)`;

            Connection.query(sql, stats, (err, result) => {
              if (err) throw err;
              console.log('New employee added');

              viewEmployees();
          });
      });
    })
}