INSERT INTO department
(name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Marketing'),
('Operations');


INSERT INTO role
(title, salaray, department_id)
VALUES 
('software engineer', 134000, 2),
('project manager', 100000, 2),
('accountant', 130000, 3),
('marketing lead' 160000, 4),
('sales rep', 95000, 1);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES ('Janet', 'Jackson', 3, 2),
('Chris', 'Rock', 3, 1), 
('Steven', 'Roberts', 1, 2), 
('Joel', 'Richardson', 2, 1),
('Aaron', 'Hendrix', 4, 1);
