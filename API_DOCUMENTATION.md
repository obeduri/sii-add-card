# API Documentation

## Overview
This API provides CRUD operations for Users and Credit Cards using Prisma ORM with PostgreSQL.

## Base URL
```
http://localhost:3000/api
```

---

## Users API

### Get All Users
**GET** `/api/users`

Query Parameters:
- `include` (optional): Set to `cards` or `true` to include user's credit cards

**Response:** `200 OK`
```json
[
  {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creditCards": []
  }
]
```

### Create User
**POST** `/api/users`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"  // optional
}
```

**Response:** `201 Created`
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creditCards": []
}
```

**Errors:**
- `400`: Email is required
- `409`: User with this email already exists

### Get User by ID
**GET** `/api/users/[id]`

Query Parameters:
- `include` (optional): Set to `cards` or `true` to include user's credit cards

**Response:** `200 OK`
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creditCards": []
}
```

**Errors:**
- `404`: User not found

### Update User
**PUT** `/api/users/[id]`

**Request Body:**
```json
{
  "email": "newemail@example.com",  // optional
  "name": "Jane Doe"                // optional
}
```

**Response:** `200 OK`
```json
{
  "id": "clxxx...",
  "email": "newemail@example.com",
  "name": "Jane Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creditCards": []
}
```

**Errors:**
- `404`: User not found
- `409`: Email already in use

### Delete User
**DELETE** `/api/users/[id]`

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully",
  "id": "clxxx..."
}
```

**Errors:**
- `404`: User not found

**Note:** Deleting a user will cascade delete all associated credit cards.

---

## Credit Cards API

### Get All Credit Cards
**GET** `/api/cards`

Query Parameters:
- `userId` (optional): Filter cards by user ID
- `include` (optional): Set to `user` or `true` to include user information

**Response:** `200 OK`
```json
[
  {
    "id": "clxxx...",
    "cardNumber": "4111111111111111",
    "cardHolder": "JOHN DOE",
    "expiryDate": "12/25",
    "cvv": "123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userId": "clxxx...",
    "user": null
  }
]
```

### Create Credit Card
**POST** `/api/cards`

**Request Body:**
```json
{
  "cardNumber": "4111111111111111",
  "cardHolder": "JOHN DOE",
  "expiryDate": "12/25",  // Format: MM/YY
  "cvv": "123",
  "userId": "clxxx..."    // optional
}
```

**Response:** `201 Created`
```json
{
  "id": "clxxx...",
  "cardNumber": "4111111111111111",
  "cardHolder": "JOHN DOE",
  "expiryDate": "12/25",
  "cvv": "123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "clxxx...",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `400`: Missing required fields or invalid expiry date format
- `404`: User not found (if userId provided)

### Get Credit Card by ID
**GET** `/api/cards/[id]`

Query Parameters:
- `include` (optional): Set to `user` or `true` to include user information

**Response:** `200 OK`
```json
{
  "id": "clxxx...",
  "cardNumber": "4111111111111111",
  "cardHolder": "JOHN DOE",
  "expiryDate": "12/25",
  "cvv": "123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "clxxx...",
  "user": null
}
```

**Errors:**
- `404`: Credit card not found

### Update Credit Card
**PUT** `/api/cards/[id]`

**Request Body:**
```json
{
  "cardNumber": "4111111111111111",  // optional
  "cardHolder": "JANE DOE",          // optional
  "expiryDate": "12/26",             // optional, Format: MM/YY
  "cvv": "456",                      // optional
  "userId": "clxxx..."               // optional, set to null to unassign
}
```

**Response:** `200 OK`
```json
{
  "id": "clxxx...",
  "cardNumber": "4111111111111111",
  "cardHolder": "JANE DOE",
  "expiryDate": "12/26",
  "cvv": "456",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "clxxx...",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- `404`: Credit card not found or User not found (if userId provided)
- `400`: Invalid expiry date format

### Delete Credit Card
**DELETE** `/api/cards/[id]`

**Response:** `200 OK`
```json
{
  "message": "Credit card deleted successfully",
  "id": "clxxx..."
}
```

**Errors:**
- `404`: Credit card not found

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method GET Not Allowed"
}
```

### 409 Conflict
```json
{
  "error": "Resource conflict message"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Detailed error message"
}
```

---

## Setup Instructions

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

3. **Generate Prisma Client:**
   ```bash
   pnpm prisma:generate
   ```

4. **Run migrations:**
   ```bash
   pnpm prisma:migrate
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

---

## Security Notes

⚠️ **Important:** The current implementation stores credit card data in plain text. For production use:

1. Encrypt sensitive fields (`cardNumber`, `cvv`) before storing
2. Implement authentication and authorization
3. Use HTTPS for all API requests
4. Add rate limiting
5. Implement input validation and sanitization
6. Consider PCI DSS compliance requirements
