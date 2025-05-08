# Task Management System

A full-stack task management application where users can create, update, assign, and track tasks within a team. It allows filtering by status, priority, and due date, with real-time updates and a clean, responsive UI.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
   - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
   - [Backend Setup (Node.js with Express)](#backend-setup-nodejs-with-express)
   - [Deployment](#deployment)
   - [MongoDB](#mongodb)
2. [Approach Explanation](#approach-explanation)
3. [Assumptions and Trade-offs](#assumptions-and-trade-offs)
4. [License](#license)

---

## Setup Instructions

### Prerequisites
Before starting, ensure you have the following:

- **Node.js** (version >= 14.x)
- **MongoDB** instance (you can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosting)
- **Vercel** account for frontend deployment

### Frontend Setup (Next.js)

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/task-management-system.git
    cd task-management-system
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    - Create a `.env.local` file in the root directory.
    - Add the following variables:

    ```bash
    NEXT_PUBLIC_BACKEND_URL=<backend-api-url>
    ```

4. **Run the Next.js development server**:

    ```bash
    npm run dev
    ```

    Open your browser and go to [http://localhost:3000](http://localhost:3000).

### Backend Setup (Node.js with Express)

1. **Navigate to the backend directory**:

    ```bash
    cd backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    - Create a `.env` file in the root directory.
    - Add the following variables:

    ```bash
    MONGO_URI=<your-mongodb-uri>
    ```

4. **Run the server**:

    ```bash
    npm run start
    ```

    The API should be available at [http://localhost:5000](http://localhost:5000).

---

## Deployment

### Frontend Deployment:

- Deploy the Next.js app using [Vercel](https://vercel.com) through their automatic deployment flow.

### Backend Deployment:

- Deploy as a serverless function using [Vercel](https://vercel.com) or on any other cloud platform such as **Heroku**, **AWS**, etc.

### MongoDB:

- Ensure that your MongoDB URI is correct in your environment variables.
- Make sure you have access to the database (if using MongoDB Atlas, ensure network access is configured correctly).

---

## Approach Explanation

### Frontend (Next.js)
- Built using **React** and **Next.js** for server-side rendering and static site generation.
- Task management functionalities are implemented as React hooks with states to manage tasks, filters, and forms.
- **Framer Motion** is used for smooth UI animations and transitions.

### Backend (Node.js/Express)
- **Express.js** is used to create a REST API with routes for task management and user authentication.
- **MongoDB** is used as the database to store user and task data.
- **Mongoose** is used to handle MongoDB schema and model creation for users and tasks.
- **JWT Authentication** is implemented for user login and access control.

### CORS
- **CORS middleware** is used in the backend to allow the frontend to communicate with the backend, enabling cross-origin requests.
- In production, it’s advised to restrict CORS to specific domains for security.

### Authentication
- **JWT (JSON Web Token)** is used for user authentication to protect routes and provide secure access to tasks.
- The JWT token is stored in **local storage** on the client-side and is included in the request headers for protected API routes.

### Task Filtering
- Tasks can be filtered by status, priority, and due date on the frontend.
- The filtering functionality is implemented using **React state** and dynamic updates based on user input.

---

## Assumptions and Trade-offs

### Assumptions:

- **Database**: The app assumes that **MongoDB** will be used for simplicity and scalability. It is a NoSQL database, making it flexible for storing tasks and users.
- **Authentication**: **JWT tokens** are used for managing user sessions. This assumes that the token will either expire or be revoked when needed.
- **Real-time**: The app does not support **real-time collaboration** features (e.g., websockets). It updates the tasks only after reloading or upon successful task modification.
- **Task Ownership**: Each task is assigned to a single user, and tasks can only be updated by the user who owns or is assigned to the task.

### Trade-offs:

- **Performance**: Using **MongoDB** might not be the most performant option when dealing with complex queries, especially in relational data (like tasks with many dependencies or relationships).
  
- **Real-time Updates**: While **real-time updates** can greatly improve task management, implementing WebSockets for full real-time functionality (such as notifications or live task updates) is complex and wasn't included in this version.
  
- **Security**: The application relies on **JWT tokens** for authentication. If tokens are not stored securely or mishandled, they could be exploited. Additional security measures could include **refresh tokens** or securing tokens using **HttpOnly cookies**.

- **Error Handling**: The application includes basic **error handling**, but it could benefit from more robust error management, including retry mechanisms, user-friendly error messages, and automatic error reporting.

---

## License

This project is licensed under the **MIT License**.

