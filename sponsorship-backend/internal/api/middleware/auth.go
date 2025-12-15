package middleware

import (
	"net/http"
	"strings"

	"sponsorship-backend/internal/api"
	"sponsorship-backend/pkg/errors"
	"sponsorship-backend/pkg/jwt"
	"sponsorship-backend/pkg/logger"
)

type AuthMiddleware struct {
	tokenManager *jwt.TokenManager
}

func NewAuthMiddleware(tokenManager *jwt.TokenManager) *AuthMiddleware {
	return &AuthMiddleware{
		tokenManager: tokenManager,
	}
}

// Middleware returns a middleware function for JWT authentication
func (am *AuthMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract token from "Bearer <token>"
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			logger.Warn("Authentication failed: missing authorization token from %s", r.RemoteAddr)
			api.WriteError(w, &errors.AppError{
				StatusCode: 401,
				Message:    "Missing authorization token",
				Code:       "MISSING_TOKEN",
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			logger.Warn("Authentication failed: invalid token format from %s", r.RemoteAddr)
			api.WriteError(w, &errors.AppError{
				StatusCode: 401,
				Message:    "Invalid token format",
				Code:       "INVALID_TOKEN_FORMAT",
			})
			return
		}

		claims, err := am.tokenManager.VerifyToken(parts[1])
		if err != nil {
			logger.Warn("Authentication failed: invalid or expired token from %s - %v", r.RemoteAddr, err)
			api.WriteError(w, &errors.AppError{
				StatusCode: 401,
				Message:    "Invalid or expired token",
				Code:       "INVALID_TOKEN",
			})
			return
		}

		logger.Debug("Authentication successful for user %s from %s", claims.Email, r.RemoteAddr)

		// Store claims in context for use in handlers
		// In production, use context.WithValue
		r.Header.Set("X-User-ID", claims.UserID)
		r.Header.Set("X-Creator-ID", claims.CreatorID)
		r.Header.Set("X-Email", claims.Email)

		next.ServeHTTP(w, r)
	})
}
