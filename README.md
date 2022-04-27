drop database if exists project;
create database project;
use project;
drop table if exists users;
create table users(
username varchar(64) primary key not null, 
password CHAR(60) not null, 
email varchar(64) not null,
firstname varchar(35) not null, 
lastname varchar(35) not null
);
insert into users values("admin", "admin", "admin", "admin", "admin");
drop table if exists list;
create table list (
	username varchar(64) not null,
    name varchar(128) not null,
    poster varchar(256) not null
);
