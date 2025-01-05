# Express.js + MySQL API Testing

This repository contains a set of tests to verify the functionality of an Express.js API. The tests cover various HTTP routes such as GET, POST, PUT, and DELETE.

## Prerequisites

Before running the tests, ensure that the following dependencies are installed:

- Node.js
- npm (Node Package Manager)

## Clone the Repository

1. Open Visual Studio Code (VSCode) on your local machine.

2. Click on the "Source Control" icon in the left sidebar (the icon looks like a branch).

3. Click on the "Clone Repository" button.

4. In the repository URL input field, enter `https://github.com/ST0503-BED/your-repository-name.git`.

5. Choose a local directory where you want to clone the repository.

6. Click on the "Clone" button to start the cloning process.

## Setting Up Environment Variables

This repository provides instructions for setting up environment variables using a `.env` file in an Express.js application. The environment variables will be used in the `db.js` file located in the `src/services` directory.

### Setup

To set up environment variables for your Express.js application, follow these steps:

1. Create a file named `.env` in the root directory of your project.
2. Open the `.env` file and add the following lines:

   ```
   DB_HOST=<your_database_host>
   DB_USER=<your_database_user>
   DB_PASSWORD=<your_database_password>
   DB_DATABASE=<your_database_name>
   ```

   Replace `<your_database_host>`, `<your_database_user>`, `<your_database_password>`, and `<your_database_name>` with the appropriate values for your database connection.

   For example:

   ```
   DB_HOST=localhost
   DB_USER=myuser
   DB_PASSWORD=mypassword
   DB_DATABASE=pokemon
   ```

   Note: Make sure there are no spaces around the equal sign (=) in each line.

3. Save the `.env` file.

### Usage

The `db.js` file in the `src/services` directory uses the `dotenv` package to read the `.env` file and set the environment variables. Here's an example of how the `db.js` file should look:

```javascript
require('dotenv').config(); // Read .env file and set environment variables

const mysql = require('mysql2');

const setting = {
    connectionLimit: 10, // Set limit to 10 connections
    host: process.env.DB_HOST, // Get host from environment variable
    user: process.env.DB_USER, // Get user from environment variable
    password: process.env.DB_PASSWORD, // Get password from environment variable
    database: process.env.DB_DATABASE, // Get database from environment variable
    multipleStatements: true, // Allow multiple SQL statements
    dateStrings: true // Return date as string instead of Date object
}

const pool = mysql.createPool(setting);

module.exports = pool;
```

The `dotenv` package is used to load the environment variables from the `.env` file, and `process.env` is used to access these variables in your code.

Make sure to include the `require('dotenv').config();` line at the beginning of your file to load the environment variables from the `.env` file.

## Important Note

Ensure that the `.env` file is included in your `.gitignore` file to prevent sensitive information (such as database credentials) from being exposed in your version control system.

That's it! You have successfully set up environment variables using a `.env` file in your Express.js application. These variables can now be accessed in the `db.js` file or any other part of your application where needed.

Now you can move on to next part below.

## Install Dependencies

1. Open the terminal in VSCode by going to `View` > `Terminal` or using the shortcut `Ctrl + ``.

2. Navigate to the project root directory.

3. Install the required dependencies using npm:

   ```
   npm install
   ```

## Database Initialization

1. Make sure you have a MySQL database available for the mock test. Update the database configuration details in the `.env` file.

## Commit and Sync Changes

1. Open the Source Control view in VSCode by clicking on the "Source Control" icon in the left sidebar.

2. Review the changes you made to the files.

3. Enter a commit message summarizing your changes in the input field at the top of the Source Control view.

4. Click on "Commit" to commit the changes.

5. Click on "Sync" to push your changes to the remote repository.

   Note: Make sure you have the necessary permissions to push changes to the repository.

## Submission

Once you have completed the practical and synchronized your changes, check the autograde of your submission.

**You may read the Test Cases below**

## Test Cases

The test cases cover different aspects of the Express.js API, including the following:

- Testing GET routes
- Testing POST routes
- Testing PUT routes
- Testing DELETE routes
- Validating package.json contents
- Performing basic read operations on the database

Each test case make HTTP requests to the API routes and validate the responses against expected values.



### Basic GET Routes

- `GET /user`:
  - Validates that the endpoint returns a 200 status code.
  - Checks the length of the response body array to ensure it matches the expected value.

-`GET /challenges`:
 -return 200 success and show the list of challenges

`GET /challenges/:id`:
-return return 200 success and show the list of user that complete the challenge 


`GET /challenges/:id`: > No one participate
-return return 404 error 

`GET /pets : > No one participate`
-return 200 Success

`GET /pets/trainer/:id`: > Invalid ID 
-return 404 error

`GET /pets/trainer/:id`: > 
-return 200 success 

`GET /pets/battles/trainer/:id`: > 
-return  200 success 

`GET /friendship/list/:id`: > 
-return  200 success and the list of friends of id 2

`GET /pets/battles/trainer/:id`: > 
-return  404 error 

`GET /message/conversation/:id`: > 
-return 200 Success 

`GET /message/conversation/:id`: > No Fields
-return 400 Error

`GET /message/conversation/:id`: > missing friend_id and user_id
-return 500 Error

### Basic POST Routes

- `POST /user > No Body`:
  - Verifies that sending an empty body to the endpoint results in a 400 status code.

- `POST /user > With Body`:
  - Sends a valid request body to the endpoint and expects a 201 status code.

- `GET /user/ > After POST`:
  - Retrieves the users.


- `POST /challenges > No Body or any missing field`
- Show error 409 

- `POST /challenges > With Body`
- Show 201 Created 


`POST  /challenges/:id`:
-return return 201 success 

`POST  /challenges/:id`: > Missing creation_id
-return return 400 error 

`POST /challenges/:id`: body : False
-+ 5 skillpoints

`POST /challenges/:id`: body : True 
-+ given skillpoints

`POST /challenges/:id`: doesnt exist challenge_id and user_id
-Show Error 404


`POST /pets`: > With Body
-return  201 success 

`POST /pets`: > With No Body
-return  400 Error 

`POST /pets/battle`: > With Body
-return  200 success 

`POST /pets/pet_id/train`: >
-return  400 Error 

`POST /pets/pet_id/train`: >
-return  200 Success 

`POST /friendship/add`: >
-return  201 Success 

`POST /friendship/add`: > already friends
-return  409 Error 

`POST /friendship/add`: > Invalid ID
-return  500 Error 

`POST /message/send`: > Invalid ID
-return 201 success

`POST /message/send`: > Missing message_text
-return 400 Error

`POST /message/send`: > Send to not your friend 
-return 403 Error



### Basic PUT Routes

- `PUT /user/:id > User Not Exist`:
  - Attempts to update a user that does not exist and expects a 404 status code.

- `PUT /user/:id > User Exist`:
  - Updates an existing user and verifies that the response has a 200 status code.

- `PUT /user/:id > Username Taken`:
  - Show Error code 409.

  `POST /pets/pet_id/name`: >
-return return 200 Success and change name 


- `PUT /challenges/:id > With Body`:
Show 200 success

`PUT /challenge/:id > With No body or missing field`:
Show Error 400

`PUT /challenge/:id > No valid Challenges`:
Show Error 404

`PUT /challenge/:id > not same creator:id`:
Show Error 403

- 

### Basic DELETE Routes

- `DELETE /challenges/:id`:
  - Deletes a challenge and expect a 204 status code.

- `DELETE /challenges/:id > Invalid ID`:
  - Show Error 404

  - `DELETE /friendship/remove/:id > `
  - Show 200 Success

  - `DELETE /friendship/remove/:id >  Not Friends `
  - Show 404 Error 

  `DELETE /friendship/remove/:id > Invalid User_id`
  - Show 500 Error

## Additional Information

- The tests assume the presence of a MySQL database and use the `mysql2` package for database interactions. Make sure to configure the database connection details in your Express.js application.
- The tests also assume the usage of the `pool` object from `src/services/db.js` for database operations.

## Test Execution

When you commit and push your changes, the GitHub Actions workflow will automatically run the unit tests. The test results will be displayed in the issues section of your GitHub repository.

The workflow includes a step that creates a new issue with the test results. The issue will include the following metrics:

| Metric           | Value        |
| ---------------- | ------------ |
| Total Pass       | \<pass count\>    |
| Total Failed     | \<fail count\>    |
| Total Tests      | \<total count\>   |
| Pass Percentage  | \<pass percentage\>% |

This allows you to easily track the test results and investigate any failures.

Please note that the result is generated based on the structure and format of your unit tests. Make sure your tests produce the necessary output for the issue creation step to work correctly.