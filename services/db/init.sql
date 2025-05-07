CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "hashedPassword" TEXT NOT NULL
);

INSERT INTO "User" (email, "hashedPassword") VALUES ('maniek', '$2a$10$LHBfgxKc4AM7p2bl0/Djpeb6Yyq4IBb2MmUEkeCrIIX.NopiPQLt.');

CREATE TABLE IF NOT EXISTS "Order" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "User"(id),
  description TEXT
);

INSERT INTO "Order" (user_id, description) VALUES (1, 'Sample order from SQL');
