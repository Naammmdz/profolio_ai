-- Assign ADMIN role to tagiangnamttg@gmail.com
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'tagiangnamttg@gmail.com' AND r.name = 'ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;
