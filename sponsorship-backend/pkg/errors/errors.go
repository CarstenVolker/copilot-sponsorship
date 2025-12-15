package errors

import "fmt"

// AppError represents a structured application error
type AppError struct {
	Code       string
	Message    string
	StatusCode int
	Details    interface{}
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

// Common errors
var (
	ErrInvalidCredentials = &AppError{
		Code:       "INVALID_CREDENTIALS",
		Message:    "Invalid email or password",
		StatusCode: 401,
	}
	ErrUnauthorized = &AppError{
		Code:       "UNAUTHORIZED",
		Message:    "Unauthorized access",
		StatusCode: 401,
	}
	ErrForbidden = &AppError{
		Code:       "FORBIDDEN",
		Message:    "Access forbidden",
		StatusCode: 403,
	}
	ErrNotFound = &AppError{
		Code:       "NOT_FOUND",
		Message:    "Resource not found",
		StatusCode: 404,
	}
	ErrConflict = &AppError{
		Code:       "CONFLICT",
		Message:    "Resource already exists",
		StatusCode: 409,
	}
	ErrInvalidRequest = &AppError{
		Code:       "INVALID_REQUEST",
		Message:    "Invalid request",
		StatusCode: 400,
	}
	ErrValidationError = &AppError{
		Code:       "VALIDATION_ERROR",
		Message:    "Validation failed",
		StatusCode: 400,
	}
	ErrInternalError = &AppError{
		Code:       "INTERNAL_ERROR",
		Message:    "Internal server error",
		StatusCode: 500,
	}
)

// New creates a new AppError
func New(code, message string, statusCode int) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
	}
}

// WithDetails adds details to an error
func (e *AppError) WithDetails(details interface{}) *AppError {
	e.Details = details
	return e
}
