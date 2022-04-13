const inquirer = require('inquirer');
const mysql = require('mysql');
const chalk = require('chalk');
const Connection = require('mysql2/typings/mysql/lib/Connection');
require('console.table');
const db = require('./db/connection');
const { ConnectionRefusedError } = require('sequelize/types');


function promptUser() {
  inquirer.prompt([
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
    .then((res) => {
      switch (res.options) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
      }
    });
}

const viewDepartments = () => {
  query = `SELECT department_name AS 'Departments' FROM departments`;
  Connection.query(query, (err, results) => {
    if (err) throw err;

    console.log('');
    console.table(chalk.blue('Viewing all departments'), results)
    promptUser();
  })
}

const viewRoles = () => {
  query = `SELECT title AS 'Title' FROM roles`;
  Connection.query(query, (err, results) => {
    if (err) throw err;

    console.log(' ');
    console.table(chalk.blue('Viewing all roles'), results);
    promptUser();
  })
}

const viewEmployees = () => {
  query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS role FROM employee 
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id`;

  Connection.query(query, (err, results) => {
    if (err) throw err;

    console.log(' ');
    console.table(chalk.blue('Viewing all employees'), results);
    promptUser();
  })
}

const addDepartment = () => {
  query = `SELECT department_name AS 'Departments' FROM departments`;
  Connection.query(query, (err, results) => {
    if (err) throw err;

    console.log(' ');
    console.table(chalk.blue('Departments'), results);
  
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDepartment',
      message: 'What is the name of the new department?'
    }
  ])
    .then(choice => {
      Connection.query(`INSERT INTO departments(department_name) VALUES( ? )`, choice.addDepartment)
      promptUser();
      })
    })
}

const addRole = () => {
  query = `SELECT * FROM roles; SELECT * FROM departments`
  Connection.query(query, (err, results) => {
    if (err) throw err;

    console.log(' ');
    console.table(chalk.blue('Roles'), results);
  
  inquirer.prompt([
    {
      type: 'input',
      name: 'role',
      message: 'What is the new role you want to add?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What salary does this role have?'
    },
    {
      type: 'list',
      name: 'dept',
      choices: function () {
        let choiceArray = results[1].map(choice => choice.department_name);
        return choiceArray;
      },
      message: 'Select department'
    }
  ])
    .then(choice => {
      Connection.query(`INSERT INTO roles(role, salary, department_id)
      VALUES
      ('${choice.role}', '${choice.salary}', (SELECT id FROM departments WHERE department_name = '${choice.dept}') );`
      )
      promptUser();
     });
   });
};

const addEmployee = () => {
  Connection.query(roleQuery, (err, results) => {
    if (err) throw err;
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee.'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee',
    },
  ])
    .then(choice => {
      Connection.query( `INSERT INTO employees(first_name, last_name) 
      VALUES ('${choice.firstName}', '${choice.lastName}');`
      ) 
      promptUser();
    });
});

const updateEmployeeRole = () => {
  const query = `SELECT * FROM employee`;

  Connection.query(query, (err, results) => {
    if (err) throw err;

  inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: 'Which employee are you updating',
      options: employees
    }
  ])
    .then(employeeOption => {
      const employee = employeeOption.name;
      const stats = [];
      stats.push(employee);

      const sqlRole = `SELECT * FROM role`;

      Connection.promise().query(sqlRole, (err, data) => {
        if (err) throw err;
        const role = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: 'What is the new role of the employee?',
            options: role
          }
        ])
          .then(roleOption => {
            const role = roleOption.role;
            stats.push(role);

            let employee = stats[0]
            stats[0] = role
            stats[1]= employee

            const sql = `UPDATE employee SET role_id =? WHERE id =?`;

            Connection.query(sql, stats, (err, result) => {
              if (err) throw err;
              console.log('Employee updated');
              viewEmployees();
            });
          });
      });
    });
  });
};
}
