# NodeJS Backend Project

## Overview

This project is a Node.js backend application that provides a RESTful API for managing car data. It uses Express.js for handling HTTP requests and PostgreSQL as the database. The application is structured to handle CRUD operations for car entities.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete car records.
- **Database Integration**: Uses PostgreSQL for data storage.
- **Environment Configuration**: Utilizes `dotenv` for environment variable management.
- **Development Tools**: Includes ESLint for code linting and Nodemon for automatic server restarts during development.

## Project Structure

- **`src/controllers`**: Contains the logic for handling requests and interacting with the database.
- **`src/routes`**: Defines the API endpoints and maps them to controller functions.
- **`src/config`**: Contains the database configuration and connection setup.
- **`index.js`**: The main entry point of the application.

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your database configuration:

   ```
   DB_USER=<your-database-username>
   DB_PASS=<your-database-password>
   DB_NAME=<your-database-name>
   DB_HOST=<your-database-host>
   DB_PORT=<your-database-port>
   ```

4. **Run the application**:
   - For development:
     ```bash
     yarn dev
     ```
   - For production:
     ```bash
     yarn start
     ```

## API Endpoints

- **GET /api/v1/cars**: Retrieve all cars.
- **POST /api/v1/cars**: Create a new car.
- **GET /api/v1/cars/:id**: Retrieve a car by ID.
- **PUT /api/v1/cars/:id**: Update a car by ID.
- **DELETE /api/v1/cars/:id**: Delete a car by ID.

## Development

- **Linting**: Run ESLint to check for code quality issues.
  ```bash
  yarn lint
  ```

## Dependencies

- **Express**: Web framework for Node.js.
- **pg**: PostgreSQL client for Node.js.
- **dotenv**: Loads environment variables from a `.env` file.
- **Nodemon**: Automatically restarts the server during development.
- **ESLint**: Linting utility for JavaScript.

## License

This project is licensed under the MIT License.
