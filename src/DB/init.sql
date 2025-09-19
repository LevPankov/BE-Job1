CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    login  VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL,
    age SMALLINT NOT NULL,
    description TEXT
);