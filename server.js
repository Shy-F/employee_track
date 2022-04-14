const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
const db = require('./db/connection');


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
                'Update an employee role',
                'Exit',],
    },
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
        case 'Exit':
          exit();
        default:
          exit();
      }
    });
}

const addRolePrompt = [
  {
    type: 'input',
    name: 'role',
    message: 'What is the new job title',
  },
  {
    type: 'input',
    name: 'salary',
    message: 'What is the salary for this role?'
  },
  {
    type: 'input',
    name: 'dept',
    message: 'Select department for this role',
  }
];

const addEmployeePrompt = [
  {
    type: 'input',
    name: 'fn',
    message: 'What is employee first name?'
  },
  {
    type: 'input',
    name: 'ln',
    message: 'What is employee last name?'
  }
];

function viewDepartments() {
  const query = 'SECLECT * FROM departments';
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

function viewRoles() {
  const query = 'SELECT * FROM roles';
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

function viewEmployees() {
  const query = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, dept_name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager from employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments dept on roles.department_id = dept.id LEFT JOIN employees manager on manager.id = employees.manager_id';
db.query(query, (err, res) => {
  if (err) throw err;
  console.table(res);
  promptUser();
});
}

function addDepartment() {
  const query = 'INSERT INTO departments (dept_name) VALUES (?)';
  inquirer.prompt(
    {
      type: 'input',
      name: 'addDepartment',
      message: 'What is the name of the new department?'
    })
    .then((res) => {
     db.query(query, res.addDepartment, (err, res) => {
       if (err) throw err;
       console.log('New department added');
      promptUser();
      });
    });
}

function addRole() {
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
