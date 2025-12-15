# Quick Start: Using the Logging System

## Configuration

1. Update your `.env` file:
```env
LOG_LEVEL=debug        # or info, warn, error in production
ENVIRONMENT=development  # development or production
```

2. The application will automatically:
   - Initialize the logger on startup
   - Create the `logs/` directory if it doesn't exist
   - Write logs to both console and `logs/app.log`

## Viewing Logs

### Real-time Console Output
```bash
# Run the server
go run main.go

# Logs appear in console automatically
```

### View Log File
```bash
# Read entire log file
cat logs/app.log

# Follow logs in real-time
tail -f logs/app.log

# Last 50 lines
tail -n 50 logs/app.log
```

## Common Log Operations

### Check for Errors
```bash
grep "ERROR" logs/app.log
```

### Track User Actions
```bash
grep "user@example.com" logs/app.log
```

### Monitor API Response Times
```bash
grep "HTTP" logs/app.log | grep -E "duration|status"
```

### Debug Auth Issues
```bash
grep -E "Authentication|Login|Register" logs/app.log
```

### Filter by Time Range
```bash
grep "10:18" logs/app.log  # All logs at 10:18
```

## Log Levels Explained

| Level | When to Use | Example |
|-------|-------------|---------|
| **DEBUG** | Detailed diagnostic info | Variable values, function entry/exit |
| **INFO** | Important events | User logins, resource creation |
| **WARN** | Potential issues | Validation failures, retries |
| **ERROR** | Recoverable errors | DB connection lost, API timeouts |
| **FATAL** | Unrecoverable errors | Server won't start |

## Development Tips

1. **Set DEBUG level during development**:
   ```env
   LOG_LEVEL=debug
   ENVIRONMENT=development
   ```
   This will show:
   - All log messages
   - File and line numbers for each log
   - Detailed operation tracking

2. **Use INFO level for testing**:
   ```env
   LOG_LEVEL=info
   ENVIRONMENT=development
   ```
   This will show:
   - Important events only
   - Still includes file/line info
   - Cleaner output

3. **Use INFO level in production**:
   ```env
   LOG_LEVEL=info
   ENVIRONMENT=production
   ```
   This will show:
   - Important events only
   - No file/line info (performance)
   - Cleaner, production-ready format

## Example Log Analysis

### Track a Sponsorship Creation
```bash
# Find creation logs
grep "Creating sponsorship" logs/app.log

# See the full flow (request to response)
grep "Nike" logs/app.log  # If brand is Nike
```

Output example:
```
[2025-12-13 10:18:00.101] DEBUG Creating sponsorship: ID=abc123, Brand=Nike, Amount=10000.00, Creator=creator-123
[2025-12-13 10:18:00.250] INFO  Sponsorship created successfully: ID=abc123, Brand=Nike, Creator=creator-123
```

### Track User Login
```bash
grep "creator@example.com" logs/app.log
```

Output example:
```
[2025-12-13 10:16:00.101] DEBUG Login attempt for email: creator@example.com
[2025-12-13 10:16:00.151] INFO  User logged in successfully: creator@example.com
```

### Find Slow Requests
```bash
grep "HTTP" logs/app.log | grep -oE "duration=\d+ms" | sort -t= -k2 -rn | head -10
```

## Troubleshooting

### Logs not appearing in file?
1. Check that `logs/` directory is writable: `ls -la logs/`
2. Verify `LOG_LEVEL` is set correctly in `.env`
3. Check server console for initialization message

### File permissions issue?
```bash
# Fix if needed
chmod 755 logs/
chmod 644 logs/app.log
```

### Log file growing too large?
```bash
# Archive old logs
mv logs/app.log logs/app.log.$(date +%Y%m%d)
gzip logs/app.log.*.gz

# Clear current log (server keeps running)
> logs/app.log
```

## Integration in Your Code

### Add logging to new functions
```go
import "sponsorship-backend/pkg/logger"

func MyFunction(userID string) error {
    logger.Debug("Processing user: %s", userID)
    
    // Do work...
    
    if err != nil {
        logger.Error("Failed to process user %s: %v", userID, err)
        return err
    }
    
    logger.Info("Successfully processed user: %s", userID)
    return nil
}
```

### Use contextual logging
```go
logger.WithFields(map[string]interface{}{
    "user_id": userID,
    "action": "update",
    "resource": "sponsorship",
}).Info("Action performed")
```

## Performance Notes

- ✓ Logging has minimal performance impact
- ✓ DEBUG level is more verbose but safe for development
- ✓ INFO level recommended for production
- ✓ No external dependencies (pure Go stdlib)
- ✓ Thread-safe across goroutines

## Next Steps

1. Start the server and check `logs/app.log`
2. Make some API calls and observe the logs
3. Adjust LOG_LEVEL based on your needs
4. Use logs for debugging and monitoring

For detailed documentation, see:
- `docs/LOGGING.md` - Complete logging guide
- `docs/LOG_EXAMPLES.md` - Real-world examples
- `LOGGING_IMPLEMENTATION.md` - Implementation details
