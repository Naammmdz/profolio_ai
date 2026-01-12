-- Insert initial roles
INSERT INTO roles (id, name) VALUES
                                 (1, 'ADMIN'),
                                 (2, 'DOCTOR'),
                                 (3, 'LAB_TECHNICIAN');

-- Insert initial users with BCrypt-hashed passwords
INSERT INTO users (id, email, password) VALUES
                                            (1, 'admin@example.com', '$2b$12$7BzGx9lRRpsn.BDTqMhj/.Lpx.4oWHuvWqF1ncj2PE91ikypyOZ.i'),
                                            (2, 'doctor@example.com', '$2b$12$2dNuvZf9eyTSg4giXXs52OWZm3JsaT4msCloxR29.DaSUkCTh1.wC'),
                                            (3, 'lab@example.com', '$2b$12$LXigeNENZjdsXG2bnU7RaeCTr21Vn0S6.WvR58MNNWhEM89WLZBbS');

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES
                                              (1, 1),
                                              (2, 2),
                                              (3, 3);
