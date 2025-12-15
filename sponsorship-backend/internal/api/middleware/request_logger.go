package middleware

import (
	"fmt"
	"net/http"
	"time"

	"sponsorship-backend/pkg/logger"
)

// ResponseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
	written    bool
}

func (rw *responseWriter) WriteHeader(code int) {
	if !rw.written {
		rw.statusCode = code
		rw.written = true
		rw.ResponseWriter.WriteHeader(code)
	}
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	if !rw.written {
		rw.statusCode = http.StatusOK
		rw.written = true
	}
	return rw.ResponseWriter.Write(b)
}

// RequestLoggingMiddleware logs HTTP requests and responses
func RequestLoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Wrap response writer to capture status code
		wrapped := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		// Log request
		logger.Info("HTTP %s %s from %s", r.Method, r.RequestURI, r.RemoteAddr)

		// Call next handler
		next.ServeHTTP(wrapped, r)

		// Log response
		duration := time.Since(start).Milliseconds()
		statusCode := wrapped.statusCode

		logger.WithFields(map[string]interface{}{
			"method":   r.Method,
			"path":     r.RequestURI,
			"status":   statusCode,
			"duration": fmt.Sprintf("%dms", duration),
			"ip":       r.RemoteAddr,
		}).Info("%s %s %d", r.Method, r.RequestURI, statusCode)
	})
}
