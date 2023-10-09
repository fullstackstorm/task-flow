-- SQLite
SELECT t.*
FROM teams t
INNER JOIN team_membership tm ON t.id = tm.team_id
WHERE tm.user_id = 11;

