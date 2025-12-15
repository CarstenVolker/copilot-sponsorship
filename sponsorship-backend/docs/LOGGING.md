# Logging System

The sponsorship backend now includes a comprehensive logging system for debugging, monitoring, and troubleshooting.

## Features

- **Multi-level logging**: DEBUG, INFO, WARN, ERROR, FATAL
- **Console and file output**: Logs to both stdout and file
- **Structured logging**: Support for contextual fields
- **Request/Response logging**: Automatic HTTP request/response logging
- **Caller information**: File and line number in development mode
- **Configurable**: Log level and file path via environment variables

## Configuration

Set the following environment variables in your `.env` file:

```env
LOG_LEVEL=info        # Options: DEBUG, INFO, WARN, ERROR, FATAL
ENVIRONMENT=development  # development or production (affects caller info)
```

## Log Levels

- **DEBUG**: Detailed diagnostic information (development)
- **INFO**: General informational messages (important events)
- **WARN**: Warning messages (potential issues)
- **ERROR**: Error messages (recoverable errors)
- **FATAL**: Fatal errors (application will exit)

## Usage

### Basic Logging

```go
import "sponsorship-backend/pkg/logger"

// Simple logging
logger.Info("User logged in successfully: %s", email)
logger.Warn("Retry attempt %d for operation", attempt)
logger.Error("Database connection failed: %v", err)

// Debug logging (only shown when LOG_LEVEL=debug)
logger.Debug("Processing request for creator: %s", creatorID)
```

### Contextual Logging

```go
// Log with contextual fields
logger.WithFields(map[string]interface{}{
    "method":     "POST",
    "path":       "/api/sponsorships",
    "status":     201,
    "duration":   "45ms",
}).Info("HTTP request completed")
```

## Log Output

Logs are written to:
1. **Console (stdout)** - Always
2. **File** - `logs/app.log` (created automatically)

### Log Format

```
[YYYY-MM-DD HH:MM:SS.mmm] LEVEL message [file.go:line]
```

Example:
```
[2025-12-13 10:30:45.123] INFO  User logged in successfully: user@example.com [auth_handler.go:67]
[2025-12-13 10:30:45.456] DEBUG HTTP GET /api/sponsorships from 127.0.0.1
[2025-12-13 10:30:45.789] INFO  HTTP GET /api/sponsorships 200 {method=GET path=/api/sponsorships status=200 duration=333ms ip=127.0.0.1}
```

## Middleware Logging

### Request Logging

The `RequestLoggingMiddleware` automatically logs all HTTP requests and responses:

```go
// Enabled in routes.go
r.Use(middleware.RequestLoggingMiddleware)
```

Logs include:
- HTTP method
- Request path
- Client IP address
- Response status code
- Response duration

## Key Logging Points

The system logs events at these key points:

### Authentication
- Login attempts (including email)
- Login success/failure
- Registration attempts
- Token generation

### Sponsorships
- Create sponsorship
- Update sponsorship
- Delete sponsorship
- Fetch sponsorship list
- Dashboard stats retrieval

### Database
- Connection initialization
- Connection pool configuration
- Query errors

### HTTP Middleware
- All incoming requests
- Response status codes
- Response duration

## Development vs Production

In **development mode** (`ENVIRONMENT=development`):
- Caller file and line number are included
- More DEBUG level messages are logged
- Helpful for debugging

In **production mode**:
- Cleaner logs without file/line info
- Focus on important events and errors
- Lighter performance overhead

## Monitoring and Debugging

### View Real-time Logs

```bash
# View stdout logs
tail -f logs/app.log

# Follow logs with color (if using grep)
tail -f logs/app.log | grep "ERROR"

# Count log entries by level
grep -c "\[INFO\]" logs/app.log
grep -c "\[ERROR\]" logs/app.log
```

### Filter Logs by Level

```bash
# Show only errors
grep "ERROR" logs/app.log

# Show errors and warnings
grep -E "ERROR|WARN" logs/app.log

# Show info and above
grep -E "INFO|WARN|ERROR" logs/app.log
```

### Track Specific Operations

```bash
# Track sponsorship creation
grep "Creating sponsorship\|Sponsorship created" logs/app.log

# Track user authentication
grep -E "Login attempt|logged in|registration" logs/app.log
```

## Performance Considerations

- Logging is optimized for production use
- File I/O is buffered
- Contextual logging adds minimal overhead
- Request logging captures timing information

## Best Practices

1. **Use appropriate log levels**:
   - DEBUG for detailed diagnostic info
   - INFO for important business events
   - WARN for recoverable errors
   - ERROR for recoverable system errors
   - FATAL for unrecoverable errors

2. **Include context** in log messages:
   ```go
   logger.Info("User action: CreatorID=%s, SponsorshipID=%s, Action=update", creatorID, sponsorshipID)
   ```

3. **Never log sensitive data** (passwords, tokens, full credit cards):
   ```go
   // Good
   logger.Info("User logged in: %s", email)
   
   // Bad
   logger.Info("User logged in with token: %s", token)
   ```

4. **Use structured logging** for complex data:
   ```go
   logger.WithFields(map[string]interface{}{
       "user_id": userID,
       "action": "delete",
       "resource": "sponsorship",
   }).Info("Action performed")
   ```
