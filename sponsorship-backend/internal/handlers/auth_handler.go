package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"

	"sponsorship-backend/internal/api"

	"sponsorship-backend/internal/models"
	"sponsorship-backend/internal/repositories"
	apierrors "sponsorship-backend/pkg/errors"
	"sponsorship-backend/pkg/jwt"
	"sponsorship-backend/pkg/logger"

	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo     *repositories.UserRepository
	tokenManager *jwt.TokenManager
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	UserID    string    `json:"userId"`
	Email     string    `json:"email"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
}

func NewAuthHandler(userRepo *repositories.UserRepository, tokenManager *jwt.TokenManager) *AuthHandler {
	return &AuthHandler{
		userRepo:     userRepo,
		tokenManager: tokenManager,
	}
}

// Login handles user login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode login request: %v", err)
		api.WriteError(w, apierrors.ErrInvalidRequest)
		return
	}

	logger.Debug("Login attempt for email: %s", req.Email)

	// Validate input
	if req.Email == "" || req.Password == "" {
		logger.Warn("Login validation failed: missing email or password")
		api.WriteError(w, apierrors.ErrValidationError.WithDetails(map[string]string{
			"email":    "email is required",
			"password": "password is required",
		}))
		return
	}

	// Get user by email
	user, err := h.userRepo.GetUserByEmail(req.Email)
	if err != nil {
		logger.Warn("Login failed: user not found for email %s", req.Email)
		api.WriteError(w, apierrors.ErrInvalidCredentials)
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		logger.Warn("Login failed: invalid password for email %s", req.Email)
		api.WriteError(w, apierrors.ErrInvalidCredentials)
		return
	}

	// Generate token
	token, err := h.tokenManager.GenerateToken(user.ID, user.Email, user.ID)
	if err != nil {
		logger.Error("Failed to generate token for user %s: %v", user.ID, err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	response := AuthResponse{
		UserID:    user.ID,
		Email:     user.Email,
		Token:     token,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	logger.Info("User logged in successfully: %s", user.Email)
	api.WriteSuccess(w, http.StatusOK, response)
}

// Register handles user registration
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode register request: %v", err)
		api.WriteError(w, apierrors.ErrInvalidRequest)
		return
	}

	logger.Debug("Registration attempt for email: %s and username: %s", req.Email, req.Username)

	// Validate input
	if req.Username == "" || req.Email == "" || req.Password == "" {
		logger.Warn("Registration validation failed: missing required fields")
		api.WriteError(w, apierrors.ErrValidationError.WithDetails(map[string]string{
			"username": "username is required",
			"email":    "email is required",
			"password": "password is required",
		}))
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("Failed to hash password: %v", err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	// Create user
	user := &models.User{
		ID:        uuid.New().String(),
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := h.userRepo.CreateUser(user); err != nil {
		logger.Warn("Failed to create user for email %s: %v", req.Email, err)
		if err.Error() == "email already exists" {
			api.WriteError(w, apierrors.ErrConflict.WithDetails("Email already registered"))
		} else {
			api.WriteError(w, apierrors.ErrInternalError)
		}
		return
	}

	// Generate token
	token, err := h.tokenManager.GenerateToken(user.ID, user.Email, user.ID)
	if err != nil {
		logger.Error("Failed to generate token for new user %s: %v", user.ID, err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	response := AuthResponse{
		UserID:    user.ID,
		Email:     user.Email,
		Token:     token,
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}

	logger.Info("New user registered successfully: %s", user.Email)
	api.WriteSuccess(w, http.StatusCreated, response)
}
