package api

import (
	"encoding/json"
	"net/http"
	"time"

	"sponsorship-backend/pkg/errors"
)

type Response struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Error     *ErrorBody  `json:"error,omitempty"`
	Timestamp string      `json:"timestamp"`
}

type ErrorBody struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

type PaginationMeta struct {
	Total   int  `json:"total"`
	Page    int  `json:"page"`
	Size    int  `json:"size"`
	HasMore bool `json:"hasMore"`
}

type PaginatedResponse struct {
	Success    bool           `json:"success"`
	Data       interface{}    `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
	Timestamp  string         `json:"timestamp"`
}

// WriteJSON writes a JSON response
func WriteJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

// WriteSuccess writes a successful response
func WriteSuccess(w http.ResponseWriter, statusCode int, data interface{}) {
	response := Response{
		Success:   true,
		Data:      data,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	WriteJSON(w, statusCode, response)
}

// WriteError writes an error response
func WriteError(w http.ResponseWriter, appErr *errors.AppError) {
	response := Response{
		Success: false,
		Error: &ErrorBody{
			Code:    appErr.Code,
			Message: appErr.Message,
			Details: appErr.Details,
		},
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	WriteJSON(w, appErr.StatusCode, response)
}

// WritePaginatedSuccess writes a paginated success response
func WritePaginatedSuccess(w http.ResponseWriter, statusCode int, data interface{}, pagination PaginationMeta) {
	response := PaginatedResponse{
		Success:    true,
		Data:       data,
		Pagination: pagination,
		Timestamp:  time.Now().UTC().Format(time.RFC3339),
	}
	WriteJSON(w, statusCode, response)
}
