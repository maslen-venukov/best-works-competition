DROP DATABASE IF EXISTS work_marks;
CREATE DATABASE work_marks CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE nominations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE organizations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  surname VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  patronymic VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'USER',
  organization INT,
  nomination INT,
  position VARCHAR(255),
  academic_rank VARCHAR(255),
  academic_degree VARCHAR(255),
  FOREIGN KEY (organization) REFERENCES organizations(id),
  FOREIGN KEY (nomination) REFERENCES nominations(id)
);