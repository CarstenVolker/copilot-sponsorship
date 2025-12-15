package logger

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

// LogLevel represents the severity level of a log message
type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARN
	ERROR
	FATAL
)

var levelNames = map[LogLevel]string{
	DEBUG: "DEBUG",
	INFO:  "INFO",
	WARN:  "WARN",
	ERROR: "ERROR",
	FATAL: "FATAL",
}

// Logger is the main logging interface
type Logger struct {
	level   LogLevel
	mu      sync.Mutex
	outputs []io.Writer
	logger  *log.Logger
	isDev   bool
}

var (
	globalLogger *Logger
	once         sync.Once
)

// Init initializes the global logger
func Init(level string, isDev bool, logFilePath string) error {
	var err error
	once.Do(func() {
		logLevel := parseLogLevel(level)
		globalLogger = &Logger{
			level:   logLevel,
			isDev:   isDev,
			outputs: []io.Writer{os.Stdout},
		}

		// Add file output if specified
		if logFilePath != "" {
			// Ensure directory exists
			dir := filepath.Dir(logFilePath)
			if err := os.MkdirAll(dir, 0755); err != nil {
				fmt.Fprintf(os.Stderr, "Failed to create log directory: %v\n", err)
			}

			file, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to open log file: %v\n", err)
			} else {
				globalLogger.outputs = append(globalLogger.outputs, file)
			}
		}

		// Create multi-writer for all outputs
		multiWriter := io.MultiWriter(globalLogger.outputs...)
		globalLogger.logger = log.New(multiWriter, "", 0)
	})
	return err
}

// parseLogLevel converts string to LogLevel
func parseLogLevel(level string) LogLevel {
	switch strings.ToUpper(level) {
	case "DEBUG":
		return DEBUG
	case "INFO":
		return INFO
	case "WARN":
		return WARN
	case "ERROR":
		return ERROR
	case "FATAL":
		return FATAL
	default:
		return INFO
	}
}

// formatMessage formats the log message with timestamp and caller info
func (l *Logger) formatMessage(level LogLevel, msg string, args ...interface{}) string {
	timestamp := time.Now().Format("2006-01-02 15:04:05.000")

	// Get caller info
	var caller string
	if l.isDev {
		_, file, line, ok := runtime.Caller(3)
		if ok {
			file = filepath.Base(file)
			caller = fmt.Sprintf(" [%s:%d]", file, line)
		}
	}

	levelStr := levelNames[level]
	message := fmt.Sprintf(msg, args...)
	return fmt.Sprintf("[%s] %-5s %s%s", timestamp, levelStr, message, caller)
}

// log is the internal logging function
func (l *Logger) log(level LogLevel, msg string, args ...interface{}) {
	if level < l.level {
		return
	}

	l.mu.Lock()
	defer l.mu.Unlock()

	formatted := l.formatMessage(level, msg, args...)
	l.logger.Println(formatted)

	// Fatal logs should exit
	if level == FATAL {
		os.Exit(1)
	}
}

// Debug logs a debug message
func Debug(msg string, args ...interface{}) {
	if globalLogger != nil {
		globalLogger.log(DEBUG, msg, args...)
	}
}

// Info logs an info message
func Info(msg string, args ...interface{}) {
	if globalLogger != nil {
		globalLogger.log(INFO, msg, args...)
	}
}

// Warn logs a warning message
func Warn(msg string, args ...interface{}) {
	if globalLogger != nil {
		globalLogger.log(WARN, msg, args...)
	}
}

// Error logs an error message
func Error(msg string, args ...interface{}) {
	if globalLogger != nil {
		globalLogger.log(ERROR, msg, args...)
	}
}

// Fatal logs a fatal message and exits
func Fatal(msg string, args ...interface{}) {
	if globalLogger != nil {
		globalLogger.log(FATAL, msg, args...)
	} else {
		log.Fatalf(msg, args...)
	}
}

// WithFields creates a contextual logger with additional fields
func WithFields(fields map[string]interface{}) *ContextLogger {
	return &ContextLogger{
		fields: fields,
	}
}

// ContextLogger adds contextual information to log messages
type ContextLogger struct {
	fields map[string]interface{}
}

// formatFields converts fields map to string
func (cl *ContextLogger) formatFields() string {
	if len(cl.fields) == 0 {
		return ""
	}

	var parts []string
	for k, v := range cl.fields {
		parts = append(parts, fmt.Sprintf("%s=%v", k, v))
	}
	return fmt.Sprintf(" {%s}", strings.Join(parts, " "))
}

// Debug logs a debug message with context
func (cl *ContextLogger) Debug(msg string, args ...interface{}) {
	if globalLogger != nil {
		fullMsg := msg + cl.formatFields()
		globalLogger.log(DEBUG, fullMsg, args...)
	}
}

// Info logs an info message with context
func (cl *ContextLogger) Info(msg string, args ...interface{}) {
	if globalLogger != nil {
		fullMsg := msg + cl.formatFields()
		globalLogger.log(INFO, fullMsg, args...)
	}
}

// Warn logs a warning message with context
func (cl *ContextLogger) Warn(msg string, args ...interface{}) {
	if globalLogger != nil {
		fullMsg := msg + cl.formatFields()
		globalLogger.log(WARN, fullMsg, args...)
	}
}

// Error logs an error message with context
func (cl *ContextLogger) Error(msg string, args ...interface{}) {
	if globalLogger != nil {
		fullMsg := msg + cl.formatFields()
		globalLogger.log(ERROR, fullMsg, args...)
	}
}

// Fatal logs a fatal message with context and exits
func (cl *ContextLogger) Fatal(msg string, args ...interface{}) {
	if globalLogger != nil {
		fullMsg := msg + cl.formatFields()
		globalLogger.log(FATAL, fullMsg, args...)
	} else {
		log.Fatalf(msg, args...)
	}
}
