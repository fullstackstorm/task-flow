-- SQLite
SELECT id, title, description, due_date, status, project_id, user_id
FROM tasks;

DELETE FROM tasks
WHERE id = 2;