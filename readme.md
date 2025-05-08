Task Management System
A full-stack task management application where users can create, update, assign, and track tasks in a team. It allows filtering by status, priority, and due date, with real-time updates and a clean, responsive UI.

Table of Contents

Setup Instructions
Approach Explanation
Assumptions and Trade-offs

Setup Instructions
Prerequisites
Node.js (version >= 14.x)

MongoDB instance (you can use MongoDB Atlas for cloud hosting)

Vercel account for deployment

Frontend Setup (Next.js)
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/task-management-system.git
cd task-management-system
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables:

Create a .env.local file in the root directory.

Add the following variables:

bash
Copy
Edit
NEXT_PUBLIC_BACKEND_URL=<backend-api-url>
Run the Next.js development server:

bash
Copy
Edit
npm run dev
Open the browser and go to http://localhost:3000.

Backend Setup (Node.js with Express)
Navigate to the backend directory:

bash
Copy
Edit
cd backend
Install dependencies:

bash
Copy
Edit
npm install
Set up environment variables:

Create a .env file in the root directory.

Add the following variables:
MONGO_URI=<your-mongodb-uri>

Run the server:
npm run start
The API should be available at http://localhost:5000.

Deployment
Frontend Deployment: Vercel (https://vercel.com) - Deploy the Next.js app using Vercel's automatic deployment flow.

Backend Deployment: Vercel (as a serverless function) or any cloud platform (Heroku, AWS, etc.).

MongoDB
Ensure that your MongoDB URI is correct in your environment variables and that you have access to the database.

Approach Explanation
Frontend (Next.js):

Built using React and Next.js for server-side rendering and static site generation.

Task management functionalities are implemented as React hooks with states to manage tasks, filters, and forms.

Framer Motion is used for smooth UI animations and transitions.

Backend (Node.js/Express):

Used Express.js to create a REST API with routes for task management and user authentication.

MongoDB is used as the database to store user and task data.

Mongoose handles MongoDB schema and model creation for users and tasks.

JWT Authentication is implemented for user login and access control.

CORS:

CORS middleware is used in the backend to allow the frontend to communicate with the backend, allowing cross-origin requests.

In production, we may restrict CORS to specific domains for security.

Authentication:

JWT is used for user authentication to protect routes and provide secure access to tasks. The JWT token is stored in local storage on the client-side and included in request headers for protected API routes.

Task Filtering:

Tasks are filtered on the frontend by status, priority, and due date, using dynamic state management.

Assumptions and Trade-offs
Assumptions:
Database: The app assumes that MongoDB will be used as the database for simplicity and scalability.

JWT: Authentication relies on JWT tokens to manage user sessions. This assumes that the user will be logged out when the token expires or is manually revoked.

Real-time: There is no real-time collaboration feature in this version. Tasks are updated in real-time only upon reload or after a successful task modification.

Task Ownership: Each task is assigned to a single user, and only users can update tasks they own or are assigned to.

Trade-offs:
Performance: Using MongoDB may be less performant compared to relational databases (e.g., PostgreSQL) in complex query scenarios or when relationships between tasks, users, and other data points become more complex.

Real-time updates: While real-time updates are useful in task management systems, implementing features like websockets for full real-time functionality (such as notifications) is not included in this version due to the complexity involved.

Security: Authentication relies on JWT tokens. If tokens are not stored securely or are mishandled, they could be exploited. Further improvements could include refresh tokens or securing tokens better with HttpOnly cookies.

Error handling: The app has basic error handling, but more robust error management can be implemented, such as retry mechanisms or user-friendly error messages.