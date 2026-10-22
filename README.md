# SkyBridge Store

## 1. Project Overview

SkyBridge Store is a full-stack e-commerce web application developed using the MERN stack. It provides customer registration and login, product browsing, shopping cart functionality, and administrative product management.

The project demonstrates full-stack application development, database integration, cloud deployment, and scalability using Microsoft Azure and Amazon Web Services (AWS).

## 2. Technology Stack

- **Frontend:** React.js and Vite
- **Backend:** Node.js and Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)
- **API:** RESTful API
- **Cloud Platforms:** Microsoft Azure and AWS
- **Version Control:** Git and GitHub

## 3. Project Structure

The project contains the following main folders and files:

- `client/` — React frontend, including `src/`, `public/`, `vite.config.js`, and frontend configuration.
- `server/` — Backend application, including `routes/`, `models/`, `middleware/`, `index.js`, `createAdmin.js`, and `seedProducts.js`.
- `database/` — Database-related files, including `products.json`.
- `evidence/` — Screenshots and supporting evidence collected for the assessment.
- `README.md` — Project documentation and setup instructions.

## 4. Prerequisites

Before running the application, install:

- Node.js and npm
- Visual Studio Code or another code editor
- Access to a configured MongoDB Atlas database

## 5. Installation Process

### Step 1: Obtain the source code

Extract the submitted project ZIP file into a folder named `SkyBridgeStore`.

Open the project folder in Visual Studio Code.

### Step 2: Install frontend dependencies

Open a terminal and run:

```bash
cd client
npm install
```

This installs the dependencies required by the React frontend.

### Step 3: Install backend dependencies

Open a separate terminal and run:

```bash
cd server
npm install
```

This installs the backend dependencies specified in `server/package.json`.

## 6. Environment Configuration

The backend requires environment variables for database connectivity, authentication, and server configuration.

Create a `.env` file inside the `server/` directory. Configure the required values using the variable names expected by the backend source code.

Example configuration:

```dotenv

MONGODB_URI=mongodb+srv://skybridge_app:pFOucBq4cPAIaTTl@cluster0.htboju8.mongodb.net/skybridge_store?retryWrites=true&w=majority

JWT_SECRET=222b65eb131c1cfb3769d9f3ea0d59ae34949d115f07116ab55b57a244c61659

CLIENT_URL=http://localhost:5173

PORT=5000

```

The actual database connection string and JWT secret must be configured locally. They are intentionally not included in this README.

Do not commit real database credentials or authentication secrets to a public repository.

## 7. Running the Application Locally

### Step 1: Start the backend

Open a terminal and run:

```bash
cd server
npm run dev
```

If the `dev` script is unavailable, use the start command defined in `server/package.json`.

The documented backend configuration uses port `5000`. Confirm the actual port in the source code and environment settings.

### Step 2: Start the frontend

Open another terminal and run:

```bash
cd client
npm run dev
```

Vite will display the local development URL in the terminal. Open that address in your browser. The default Vite port is commonly `5173`.

### Step 3: Configure frontend API connectivity

For local development, the frontend API base URL may be:

```text
http://localhost:5000/api
```

Confirm the API URL configuration in the frontend source code. The frontend and backend must both be running for the application to work locally.

## 8. Database Setup and Seed Data

SkyBridge Store uses MongoDB Atlas to store application data.

1. Access a configured MongoDB Atlas cluster.
2. Ensure a database user and appropriate network access are configured.
3. Add the database connection string to `server/.env`.
4. Start the backend and verify that the database connection succeeds.
5. Use the supplied database seed files to populate sample product records if required.

The project includes `database/products.json` and `server/seedProducts.js`. Inspect the seed script to confirm its expected data source and execution command before running it.

Avoid running seed scripts against an existing database without checking whether they insert, update, or replace records.

## 9. Administrator Login Credentials

Use the following existing administrator credentials for the assessment demonstration.

- **Admin Email:** `admin@skybridge.local`
- **Admin Password:** `RahulJoy123!`

To access the administrator functionality:

1. Start the frontend and backend, or open the available application deployment.
2. Navigate to the application's login page.
3. Enter the administrator email and password listed above.
4. Sign in to access the administrator functionality implemented in the application.

These credentials are provided for assessment and demonstration purposes. No new administrator account needs to be created if the existing account is already configured in the database.

**Note:** Successful login requires the existing administrator account to be present in the database used by the running application.

## 10. Application Features

### Customer Features

- Customer registration and login.
- Product browsing and product information.
- Shopping cart functionality.
- Communication with backend API endpoints.

### Administrator Features

- Administrator login.
- Product management functionality implemented in the application.
- Access to protected administrative operations.

## 11. Application Testing

The following areas can be tested:

- Customer registration and login.
- Administrator login.
- Product listing and product information.
- Shopping cart operations.
- Administrative product management.
- Backend API responses.
- MongoDB Atlas connectivity.
- Frontend-to-backend communication.

Refer to the screenshots in the `evidence/` folder for the relevant assessment demonstrations.

## 12. Cloud Deployment and Scalability

SkyBridge Store was deployed to Microsoft Azure and AWS during the assessment process.

The cloud activities included application deployment, configuration of frontend and backend connectivity, database integration, and demonstrations of manual and automatic scaling concepts.

The AWS resources used for the demonstration have since been removed as part of resource cleanup. Therefore, the AWS deployment should be treated as a completed demonstration rather than a currently running service.

Deployment screenshots and scaling evidence should be reviewed alongside the final assessment report. The report should describe the configurations and activities actually performed.

## 13. Security Considerations

- Keep database credentials and JWT secrets private.
- Exclude real `.env` files from public repositories and submission ZIP files.
- Use strong, unique passwords for administrator accounts.
- Restrict database access to appropriate sources.
- Protect administrative functionality with authentication and authorization.
- Use HTTPS and secure configuration for production deployments.

## 14. Conclusion

SkyBridge Store demonstrates full-stack e-commerce application development using React, Node.js, Express.js, and MongoDB Atlas. The project provides practical experience with frontend and backend integration, database connectivity, authentication, cloud deployment, and scalability concepts.
