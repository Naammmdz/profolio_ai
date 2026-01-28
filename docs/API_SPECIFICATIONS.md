# API Specifications

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [RAG Service APIs](#rag-service-apis)
4. [CV Import Service APIs](#cv-import-service-apis)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## 1. Overview

All APIs follow RESTful conventions and use JSON for request/response bodies (except file uploads).

**Base URLs:**
- API Gateway: `http://localhost:8080/api`
- RAG Service: `http://localhost:8084/api/rag`
- CV Import Service: `http://localhost:8085/api/cv-import`

**Common Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept: application/json
```

---

## 2. Authentication

All endpoints (except public portfolio endpoints) require JWT authentication.

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

---

## 3. RAG Service APIs

### 3.1 Initialize RAG for Portfolio

**POST** `/api/rag/portfolios/{portfolioId}/initialize`

Initialize RAG system for a portfolio by creating chunks and embeddings.

**Path Parameters:**
- `portfolioId` (UUID, required): Portfolio ID

**Response:** `202 Accepted`
```json
{
  "portfolioId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "totalChunks": 0,
  "processedChunks": 0,
  "startedAt": "2025-01-27T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid portfolio ID
- `404 Not Found`: Portfolio not found
- `409 Conflict`: RAG already initialized

---

### 3.2 Chat with AI

**POST** `/api/rag/portfolios/{portfolioId}/chat`

Chat with AI using RAG retrieval.

**Path Parameters:**
- `portfolioId` (UUID, required): Portfolio ID

**Request Body:**
```json
{
  "question": "What are your skills?",
  "visitorId": "visitor_123",
  "sessionId": "session_456"
}
```

**Response:** `200 OK`
```json
{
  "response": "I have experience in Java, Spring Framework, PostgreSQL...",
  "sessionId": "session_456",
  "contextUsed": [
    {
      "chunkId": "skill_category_123",
      "type": "skill_category",
      "relevance": 0.95,
      "content": "Skills: Java, Spring..."
    }
  ],
  "tokensUsed": 150,
  "responseTimeMs": 1200
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request
- `404 Not Found`: Portfolio not found or RAG not initialized
- `429 Too Many Requests`: Rate limit exceeded

---

### 3.3 Get Initialization Status

**GET** `/api/rag/portfolios/{portfolioId}/status`

Get RAG initialization status for a portfolio.

**Path Parameters:**
- `portfolioId` (UUID, required): Portfolio ID

**Response:** `200 OK`
```json
{
  "portfolioId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "totalChunks": 15,
  "processedChunks": 15,
  "startedAt": "2025-01-27T10:00:00Z",
  "completedAt": "2025-01-27T10:05:00Z"
}
```

**Status Values:**
- `pending`: Not started
- `processing`: In progress
- `completed`: Successfully completed
- `failed`: Failed with error

---

### 3.4 Rebuild RAG Index

**POST** `/api/rag/portfolios/{portfolioId}/rebuild`

Rebuild RAG index for a portfolio (admin function).

**Path Parameters:**
- `portfolioId` (UUID, required): Portfolio ID

**Response:** `202 Accepted`
```json
{
  "portfolioId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "message": "RAG rebuild started"
}
```

---

### 3.5 Delete RAG Data

**DELETE** `/api/rag/portfolios/{portfolioId}`

Delete all RAG data for a portfolio.

**Path Parameters:**
- `portfolioId` (UUID, required): Portfolio ID

**Response:** `204 No Content`

---

## 4. CV Import Service APIs

### 4.1 Import CV

**POST** `/api/cv-import/portfolios/{portfolioId}/import`

Upload and import CV/Resume PDF.

**Path Parameters:**
- `portfolioId` (UUID, required): Portfolio ID

**Request:** `multipart/form-data`
```
file: <PDF file>
autoConfirm: true (optional, default: false)
```

**Response:** `202 Accepted`
```json
{
  "importId": "import_123",
  "portfolioId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "estimatedTimeSeconds": 30
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file or file too large
- `413 Payload Too Large`: File exceeds size limit
- `415 Unsupported Media Type`: File type not supported

---

### 4.2 Get Import Status

**GET** `/api/cv-import/imports/{importId}`

Get CV import status and extracted data.

**Path Parameters:**
- `importId` (UUID, required): Import ID

**Response:** `200 OK`
```json
{
  "importId": "import_123",
  "portfolioId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "extractedData": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, USA"
    },
    "projects": [
      {
        "title": "E-commerce Platform",
        "category": "WebApp",
        "description": "Built a full-stack e-commerce platform...",
        "date": "2023-2024",
        "tags": ["React", "Node.js", "PostgreSQL"]
      }
    ],
    "skills": [
      {
        "category": "Languages",
        "skills": ["Java", "JavaScript", "Python"]
      }
    ]
  },
  "confidenceScore": 0.92,
  "createdAt": "2025-01-27T10:00:00Z",
  "updatedAt": "2025-01-27T10:02:00Z"
}
```

**Status Values:**
- `processing`: Currently processing
- `completed`: Successfully completed
- `failed`: Failed with error
- `pending_review`: Waiting for user confirmation

---

### 4.3 Confirm Import

**POST** `/api/cv-import/imports/{importId}/confirm`

Confirm and apply extracted data to portfolio.

**Path Parameters:**
- `importId` (UUID, required): Import ID

**Request Body:**
```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "projects": [...],
  "skills": [...],
  "confirmAll": true
}
```

**Response:** `200 OK`
```json
{
  "status": "confirmed",
  "portfolioUpdated": true,
  "message": "Portfolio data updated successfully"
}
```

---

### 4.4 Cancel Import

**DELETE** `/api/cv-import/imports/{importId}`

Cancel and delete CV import.

**Path Parameters:**
- `importId` (UUID, required): Import ID

**Response:** `204 No Content`

---

## 5. Error Handling

### 5.1 Standard Error Response

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "timestamp": "2025-01-27T10:00:00Z",
  "path": "/api/rag/portfolios/123/chat",
  "details": {
    "field": "additional error details"
  }
}
```

### 5.2 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 202 | Accepted | Async operation started |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 413 | Payload Too Large | File too large |
| 415 | Unsupported Media Type | Invalid file type |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### 5.3 Validation Errors

**400 Bad Request** with validation details:

```json
{
  "error": "Validation Error",
  "message": "Request validation failed",
  "timestamp": "2025-01-27T10:00:00Z",
  "validationErrors": [
    {
      "field": "question",
      "message": "Question cannot be empty"
    }
  ]
}
```

---

## 6. Rate Limiting

### 6.1 Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Chat | 20 requests | 1 minute |
| Initialize RAG | 5 requests | 1 hour |
| Import CV | 10 requests | 1 hour |
| Other endpoints | 100 requests | 1 minute |

### 6.2 Rate Limit Headers

Response headers include rate limit information:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1706352000
```

### 6.3 Rate Limit Exceeded Response

**429 Too Many Requests:**
```json
{
  "error": "Rate Limit Exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## 7. WebSocket for Streaming (Future)

For real-time chat streaming, WebSocket endpoint:

**WS** `/api/rag/portfolios/{portfolioId}/chat/stream`

**Message Format:**
```json
{
  "type": "question",
  "data": {
    "question": "What are your skills?",
    "sessionId": "session_456"
  }
}
```

**Response Messages:**
```json
{
  "type": "chunk",
  "data": {
    "text": "I have experience in..."
  }
}
```

```json
{
  "type": "complete",
  "data": {
    "response": "Full response...",
    "tokensUsed": 150
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27
