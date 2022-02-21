
 -- drop existing tables
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;

-- new users table:
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    first           VARCHAR(255) NOT NULL CHECK (first != ''),
    last            VARCHAR(255) NOT NULL CHECK (last != ''),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- new signatures table:
CREATE TABLE signatures (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id),
    signature   TEXT NOT NULL CHECK (signature != '')
);


-- DROP TABLE IF EXISTS signatures;

-- CREATE TABLE signatures (
--      id SERIAL PRIMARY KEY,
--      first VARCHAR NOT NULL CHECK (first != ''),
--      last VARCHAR NOT NULL CHECK (last != ''),
--      signature VARCHAR NOT NULL CHECK (signature != '')
-- );