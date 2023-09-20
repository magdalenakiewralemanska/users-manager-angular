# Users Manager project - frontend part:

It is a simple application for registering and managing registered users with the ability to view the user's profile account and edit data. The project assumes the possibility of different levels of access to the data contained in the database and different levels of user access to individual functions. The project includes the possibility of blocking and deactivating a user account. In addition to typical personal data, the application also stores entries regarding registration and login dates for individual users. 
This application consists of two basic parts: frontend and backend. This repository contains the backend part written in Java using the Spring framework. The basic functions that the application performs are: 
1. user registration in the database,
2. editing user data, 
3. deleting a user, 
4. logging in and logging out of a registered user. 
Additional functionalities included in the project include printing the user profile view and user table, as well as the ability to save data to a file.

# Frontend part:

The frontend part of the application consists primarily of creating a user interface, with the option of logging in and creating a new account. The user can also view basic data about other users, without the possibility of editing them, unless he or she has a special role (administrator, moderator). Each user can freely modify their personal data, but they cannot change the role assigned to them or unblock/block the account. Only the administrator user has such permissions. The administrator can also, as the only user, delete an existing user account. Basic views include a tabular view of all users (with the ability to view individual user data) and views for logging in, registering and editing user data.
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.3.
