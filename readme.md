# Task Management

Task Management is a Node.js project that provides an API for managing tasks. It includes user authentication, token-based authentication, and endpoints for task management and user management.

## API Endpoints

### Signup

- Endpoint: `/api/v1/user/signup`
- Method: `POST`
- Description: Create a new user account.
- Request Body:
  - `name`: User's name (string)
  - `email`: User's email address (string)
  - `password`: User's password (string)

### Login

- Endpoint: `/api/v1/user/login`
- Method: `POST`
- Description: Authenticate user and obtain access token.
- Request Body:
  - `email`: User's email address (string)
  - `password`: User's password (string)
- Response:
  - `user`: matched user
  - `accessToken`: Access token for API authentication
  - `refreshToken`: Refresh token for obtaining new access tokens

### Refresh Token

- Endpoint: `/api/v1/user/replace-token`
- Method: `POST`
- Description: Obtain a new access token using a refresh token.
- Request Body:
  - `refreshToken`: Refresh token (string)
- Response:
  - `accessToken`: New access token for API authentication

### Get All Users

- Endpoint: `api/v1/user`
- Method: `GET`
- Description: Retrieve all users.
- Authentication: Requires a valid access token.
- Response: Array of user objects with the following properties:
  - `id`: User ID (string)
  - `name`: User's name (string)
  - `email`: User's email address (string)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/amanullha/Task-Management
2. Visit API Documentation:
   ```bash
   visit https://documenter.getpostman.com/view/22890389/2s93sabZRc
