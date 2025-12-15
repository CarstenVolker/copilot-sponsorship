package jwt

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID    string `json:"userId"`
	Email     string `json:"email"`
	CreatorID string `json:"creatorId"`
	jwt.RegisteredClaims
}

type TokenManager struct {
	secret     string
	expiration time.Duration
}

func NewTokenManager(secret string, expiration time.Duration) *TokenManager {
	return &TokenManager{
		secret:     secret,
		expiration: expiration,
	}
}

// GenerateToken creates a new JWT token
func (tm *TokenManager) GenerateToken(userID, email, creatorID string) (string, error) {
	claims := Claims{
		UserID:    userID,
		Email:     email,
		CreatorID: creatorID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tm.expiration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(tm.secret))
}

// VerifyToken validates and parses a JWT token
func (tm *TokenManager) VerifyToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(tm.secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}
