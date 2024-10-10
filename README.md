# tiny-todo-nestjs

This repository contains the source code for a NestJS-based application that manages users, authentication, todo tasks, and roles. The project consists of four main modules:

- **User Module**
- **Auth Module**
- **Todo Module**
- **Roles Module**

Each module is responsible for specific business logic, such as user management, task handling, role-based access control, and authentication.

## **Modules**

### **1. User Module**

This module manages operations related to users, including creating, updating, and deleting user accounts, as well as retrieving user data.

#### **Endpoints:**
- **Get User Information**: Fetch a user by username.  
  `GET /users/:username/`  
  Command: `bash cmd/users-getOne.sh`

- **Get All Users (Admin Only)**: Retrieve a list of all users.  
  `GET /users/`  
  Command: `bash cmd/users-getAll.sh`

- **Create User**: Add a new user.  
  `POST /users/`  
  Command: `bash cmd/users-create.sh`

- **Update User**: Update user details by their ID.  
  `PUT /users/:id`  
  Command: `bash cmd/users-update.sh`

- **Update User Role (Admin Only)**: Modify a user's role by role ID.  
  `PUT /users/role/:roleId`  
  Command: `bash cmd/users-updateRole.sh`

- **Delete User**: Remove a user account by their ID.  
  `DELETE /users/`  
  Command: `bash cmd/users-delete.sh`

#### **Key Components**:
- **Controller**: Manages user-related API routes.
- **Service**: Handles business logic for user operations, such as fetching and updating user data.
- **Entity**: The `User` entity is mapped to the `users` table in the database.

---

### **2. Todo Module**

This module manages todo items that users can create, update, and delete. Each todo item is associated with a specific user.

#### **Endpoints:**
- **Create Todo**: Add a new todo item for the authenticated user.  
  `POST /todos`  
  Command: `bash cmd/todos-create.sh`

- **Fetch a Todo**: Retrieve a specific todo item by its ID.  
  `GET /todos/:id`  
  Command: `bash cmd/todos-getOne.sh`

- **Fetch All Todos for a User**: Get all todo items for the authenticated user.  
  `GET /todos`  
  Command: `bash cmd/todos-getAll.sh`

- **Update Todo**: Modify the details of a todo item (title, description, status) by its ID.  
  `PUT /todos/:id`  
  Command: `bash cmd/todos-update.sh`

- **Delete Todo**: Remove a specific todo item by its ID.  
  `DELETE /todos/:id`  
  Command: `bash cmd/todos-delete.sh`

#### **Key Components**:
- **Controller**: Manages todo-related API routes.
- **Service**: Contains business logic for todo operations such as creation, updating, and deletion.
- **Entity**: The `Todo` entity is mapped to the `todos` table in the database.

---

### **3. Auth Module**

This module handles user authentication, including user registration, login, and token-based authentication using JWT. It also implements role-based authorization for restricted routes.

#### **Endpoints:**
- **User Registration (Sign Up)**: Create a new user with a default role of "user".  
  `POST /auth/register`  
  Command: `bash cmd/register.sh`

- **User Login**: Log in a user and issue a JWT token.  
  `POST /auth/login`  
  Command: `bash cmd/login.sh`

- **JWT-based Authentication**: Protect routes and ensure only authenticated users can access them by using JWT tokens in the request headers.

#### **Key Components**:
- **JWT Guard**: Secures routes and ensures only authenticated users can access them.
- **Roles Guard**: Restricts access to APIs based on user roles.

---

### **4. Roles Module**

This module manages user roles and handles role-based access control. Each user is assigned a role, such as "admin" or "user", which determines their access to certain features.

#### **Key Components**:
- **Controller**: Manages role-related API routes.
- **Entity**: The `Role` entity is mapped to the `roles` table in the database.

---

## **Workflow Example: Creating a Todo**

1. **User Registration**: A user registers using the `/auth/register` endpoint.  
   Command: `bash cmd/register.sh`
   
   The user's data is saved in the `users` table, and the user is assigned a default role of "user".

2. **User Login**: The user logs in via the `/auth/login` endpoint and receives a JWT token.  
   Command: `bash cmd/login.sh`

3. **Create a Todo**: The authenticated user creates a new todo item by sending a `POST` request to `/todos` with their JWT token.  
   Command: `bash cmd/todos-create.sh`

   The todo item is linked to the user's ID and stored in the `todos` table.

4. **Fetch Todos**: The user retrieves their todo items by sending a `GET /todos` request.  
   Command: `bash cmd/todos-getAll.sh`

5. **Update/Delete Todos**: The user can update or delete their todos using the corresponding `PUT /todos/:id` and `DELETE /todos/:id` endpoints.  
   Commands:  
   `bash cmd/todos-update.sh`  
   `bash cmd/todos-delete.sh`

---
