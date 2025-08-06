# AURA Panic API Documentation

## Base URL

```
/api
```

---

## POST /panic

Initiates a new panic event.

### Request

- **Method:** POST  
- **URL:** `/panic`
- **Content-Type:** `application/json`

### Request Body

```
{
  "userId": "string",          // Unique identifier of the user
  "location": {
    "lat": number,             // Latitude
    "lng": number              // Longitude
  },
  "timestamp": "ISO8601"       // Time of panic creation
}
```

### Example

```json
{
  "userId": "user-123",
  "location": { "lat": -33.9249, "lng": 18.4241 },
  "timestamp": "2025-08-06T08:00:00Z"
}
```

### Responses

| Status Code | Description                |
|-------------|----------------------------|
| 202         | Panic accepted for processing |
| 400         | Invalid request payload     |
| 500         | Internal server error       |

---

## GET /panic/:id

Retrieves the status or metadata of a panic event.

### Request

- **Method:** GET  
- **URL:** `/panic/:id`

### Path Parameters

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `id`      | string | Unique ID of the panic    |

### Example

```
GET /panic/abc123
```

### Responses

#### 200 OK

```json
{
  "panicId": "abc123",
  "userId": "user-123",
  "location": { "lat": -33.9249, "lng": 18.4241 },
  "status": "processing",      // or "active", "resolved"
  "createdAt": "2025-08-06T08:00:00Z",
  "updatedAt": "2025-08-06T08:00:05Z"
}
```

#### 404 Not Found

```json
{
  "error": "Panic not found"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Unexpected server error"
}
```

---

## Error Format

All errors follow a standard structure:

```json
{
  "error": "Description of the error"
}
```

---

## Notes

- The `GET /panic/:id` endpoint supports **eventual consistency** — newly created panics may return partial placeholder data if full processing is not complete.
- Latency targets: P95 < 500ms for GET requests under nominal load.
- POST requests are accepted immediately and processed asynchronously.
