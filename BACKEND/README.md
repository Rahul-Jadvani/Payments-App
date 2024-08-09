# Payment App

This is a full-stack payment application built using Node.js, Express.js, React, and MongoDB. The app is designed to provide secure financial transactions with a user-friendly interface.

## Key Features
- **Authentication:** Secure sign-up and sign-in with JWT (JSON Web Token) authentication, ensuring data protection and secure sessions.
- **User Dashboard:** Upon logging in, users can view their current balance and see a list of all registered users.
- **Transaction Page:** Allows users to send money to other registered users, with real-time balance updates.

## Tech Stack
- **Node.js & Express.js:** Backend services, RESTful APIs, and authentication.
- **React:** Frontend development with dynamic, component-based UI.
- **MongoDB:** NoSQL database for efficient data storage and retrieval.
- **JWT:** Secure user authentication and session management.

## Getting Started

### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/payment-app.git
    ```
2. **Install dependencies:**
    - For the backend:
        ```bash
        cd payment-app/backend
        npm install
        ```
    - For the frontend:
        ```bash
        cd ../frontend
        npm install
        ```
3. **Start MongoDB:**
    ```bash
    mongod
    ```
4. **Run the backend server:**
    ```bash
    cd ../backend
    npm start
    ```
5. **Run the frontend app:**
    ```bash
    cd ../frontend
    npm start
    ```

## Usage
- Sign up and log in to access your dashboard.
- View your balance and all registered users.
- Use the transaction page to send money to other users.
