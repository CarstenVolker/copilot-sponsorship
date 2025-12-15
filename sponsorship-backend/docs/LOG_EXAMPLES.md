# Example Log Output

This document shows what log output looks like from the sponsorship backend with the new logging system.

## Application Startup

```
[2025-12-13 10:15:30.123] INFO  Starting Sponsorship Backend Application
[2025-12-13 10:15:30.124] INFO  Environment: development | LogLevel: debug
[2025-12-13 10:15:30.125] INFO  Initializing database connection to localhost:5432
[2025-12-13 10:15:30.234] DEBUG Database connection pool configured: MaxOpenConns=25, MaxIdleConns=5
[2025-12-13 10:15:30.235] INFO  Database connection established successfully
[2025-12-13 10:15:30.236] DEBUG Creating router and registering handlers
[2025-12-13 10:15:30.237] INFO  Starting HTTP server on :8080
```

## User Authentication Flow

### Successful Login
```
[2025-12-13 10:16:00.100] INFO  HTTP POST /api/auth/login from 192.168.1.100
[2025-12-13 10:16:00.101] DEBUG Login attempt for email: creator@example.com
[2025-12-13 10:16:00.150] DEBUG Authentication successful for user creator@example.com from 192.168.1.100
[2025-12-13 10:16:00.151] INFO  User logged in successfully: creator@example.com
[2025-12-13 10:16:00.152] INFO  HTTP POST /api/auth/login 200 {method=POST path=/api/auth/login status=200 duration=52ms ip=192.168.1.100}
```

### Failed Login - Invalid Credentials
```
[2025-12-13 10:16:15.100] INFO  HTTP POST /api/auth/login from 192.168.1.100
[2025-12-13 10:16:15.101] DEBUG Login attempt for email: creator@example.com
[2025-12-13 10:16:15.120] WARN  Login failed: invalid password for email creator@example.com
[2025-12-13 10:16:15.121] INFO  HTTP POST /api/auth/login 401 {method=POST path=/api/auth/login status=401 duration=21ms ip=192.168.1.100}
```

### Failed Login - User Not Found
```
[2025-12-13 10:16:30.100] INFO  HTTP POST /api/auth/login from 192.168.1.100
[2025-12-13 10:16:30.101] DEBUG Login attempt for email: invalid@example.com
[2025-12-13 10:16:30.115] WARN  Login failed: user not found for email invalid@example.com
[2025-12-13 10:16:30.116] INFO  HTTP POST /api/auth/login 401 {method=POST path=/api/auth/login status=401 duration=16ms ip=192.168.1.100}
```

### User Registration
```
[2025-12-13 10:17:00.100] INFO  HTTP POST /api/auth/register from 192.168.1.100
[2025-12-13 10:17:00.101] DEBUG Registration attempt for email: newuser@example.com
[2025-12-13 10:17:00.200] INFO  New user registered successfully: newuser@example.com
[2025-12-13 10:17:00.201] INFO  HTTP POST /api/auth/register 201 {method=POST path=/api/auth/register status=201 duration=101ms ip=192.168.1.100}
```

## Sponsorship Operations

### Creating a Sponsorship
```
[2025-12-13 10:18:00.100] INFO  HTTP POST /api/sponsorships from 192.168.1.100
[2025-12-13 10:18:00.101] DEBUG Creating sponsorship: ID=550e8400-e29b-41d4-a716-446655440000, Brand=Nike, Amount=10000.00, Creator=creator-123
[2025-12-13 10:18:00.250] INFO  Sponsorship created successfully: ID=550e8400-e29b-41d4-a716-446655440000, Brand=Nike, Creator=creator-123
[2025-12-13 10:18:00.251] INFO  HTTP POST /api/sponsorships 201 {method=POST path=/api/sponsorships status=201 duration=151ms ip=192.168.1.100}
```

### Listing Sponsorships
```
[2025-12-13 10:18:30.100] INFO  HTTP GET /api/sponsorships?page=1 from 192.168.1.100
[2025-12-13 10:18:30.101] DEBUG Fetching sponsorships for creator creator-123 (page 1, limit 20)
[2025-12-13 10:18:30.120] DEBUG Successfully retrieved 5 sponsorships out of 5 total for creator creator-123
[2025-12-13 10:18:30.121] INFO  HTTP GET /api/sponsorships?page=1 200 {method=GET path=/api/sponsorships?page=1 status=200 duration=21ms ip=192.168.1.100}
```

### Updating a Sponsorship
```
[2025-12-13 10:19:00.100] INFO  HTTP PUT /api/sponsorships/550e8400-e29b-41d4-a716-446655440000 from 192.168.1.100
[2025-12-13 10:19:00.101] DEBUG Updating sponsorship: ID=550e8400-e29b-41d4-a716-446655440000, Creator=creator-123
[2025-12-13 10:19:00.250] INFO  Sponsorship updated successfully: ID=550e8400-e29b-41d4-a716-446655440000, Brand=Nike, Creator=creator-123
[2025-12-13 10:19:00.251] INFO  HTTP PUT /api/sponsorships/550e8400-e29b-41d4-a716-446655440000 200 {method=PUT path=/api/sponsorships/550e8400-e29b-41d4-a716-446655440000 status=200 duration=151ms ip=192.168.1.100}
```

### Deleting a Sponsorship
```
[2025-12-13 10:19:30.100] INFO  HTTP DELETE /api/sponsorships/550e8400-e29b-41d4-a716-446655440000 from 192.168.1.100
[2025-12-13 10:19:30.101] DEBUG Deleting sponsorship: ID=550e8400-e29b-41d4-a716-446655440000, Creator=creator-123
[2025-12-13 10:19:30.120] INFO  Sponsorship deleted successfully: ID=550e8400-e29b-41d4-a716-446655440000, Creator=creator-123
[2025-12-13 10:19:30.121] INFO  HTTP DELETE /api/sponsorships/550e8400-e29b-41d4-a716-446655440000 200 {method=DELETE path=/api/sponsorships/550e8400-e29b-41d4-a716-446655440000 status=200 duration=21ms ip=192.168.1.100}
```

### Getting Dashboard Stats
```
[2025-12-13 10:20:00.100] INFO  HTTP GET /api/dashboard/stats from 192.168.1.100
[2025-12-13 10:20:00.101] DEBUG Fetching dashboard stats for creator: creator-123
[2025-12-13 10:20:00.125] INFO  HTTP GET /api/dashboard/stats 200 {method=GET path=/api/dashboard/stats status=200 duration=25ms ip=192.168.1.100}
```

## Error Scenarios

### Database Connection Error
```
[2025-12-13 10:21:00.100] ERROR Failed to open database connection: connection refused
[2025-12-13 10:21:00.101] FATAL Failed to initialize database: connection refused
```

### Invalid Request Body
```
[2025-12-13 10:21:30.100] INFO  HTTP POST /api/sponsorships from 192.168.1.100
[2025-12-13 10:21:30.101] ERROR Failed to decode create sponsorship request: invalid character '}' looking for beginning of value
[2025-12-13 10:21:30.102] INFO  HTTP POST /api/sponsorships 400 {method=POST path=/api/sponsorships status=400 duration=2ms ip=192.168.1.100}
```

### Validation Error
```
[2025-12-13 10:22:00.100] INFO  HTTP POST /api/sponsorships from 192.168.1.100
[2025-12-13 10:22:00.101] DEBUG Creating sponsorship: ID=550e8400-e29b-41d4-a716-446655440001, Brand=, Amount=0, Creator=creator-123
[2025-12-13 10:22:00.102] WARN  Create sponsorship validation failed: invalid brand name or deal amount
[2025-12-13 10:22:00.103] INFO  HTTP POST /api/sponsorships 400 {method=POST path=/api/sponsorships status=400 duration=3ms ip=192.168.1.100}
```

### Missing Authorization Token
```
[2025-12-13 10:22:30.100] INFO  HTTP GET /api/sponsorships from 192.168.1.100
[2025-12-13 10:22:30.101] WARN  Authentication failed: missing authorization token from 192.168.1.100
[2025-12-13 10:22:30.102] INFO  HTTP GET /api/sponsorships 401 {method=GET path=/api/sponsorships status=401 duration=2ms ip=192.168.1.100}
```

### Expired Token
```
[2025-12-13 10:23:00.100] INFO  HTTP GET /api/sponsorships from 192.168.1.100
[2025-12-13 10:23:00.101] WARN  Authentication failed: invalid or expired token from 192.168.1.100 - token is expired
[2025-12-13 10:23:00.102] INFO  HTTP GET /api/sponsorships 401 {method=GET path=/api/sponsorships status=401 duration=2ms ip=192.168.1.100}
```

## Log Analysis Tips

### Find All Errors
```bash
grep "ERROR" logs/app.log
```

### Track User Activity
```bash
grep "creator@example.com" logs/app.log
```

### Monitor API Performance
```bash
grep "HTTP" logs/app.log | grep "duration"
```

### Find Failed Operations
```bash
grep -E "WARN|ERROR" logs/app.log
```

### Get Specific Time Window
```bash
grep "2025-12-13 10:18" logs/app.log
```

### Count Requests by Status
```bash
grep "HTTP" logs/app.log | grep "200" | wc -l  # Success
grep "HTTP" logs/app.log | grep "401" | wc -l  # Unauthorized
grep "HTTP" logs/app.log | grep "500" | wc -l  # Server errors
```
