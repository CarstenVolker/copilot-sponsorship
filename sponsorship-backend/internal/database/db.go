package database

import (
	"database/sql"
	"fmt"

	"sponsorship-backend/pkg/logger"

	_ "github.com/lib/pq"
)

func NewDB(dbURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		logger.Error("Failed to open database connection: %v", err)
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		logger.Error("Failed to ping database: %v", err)
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	logger.Debug("Database connection pool configured: MaxOpenConns=25, MaxIdleConns=5")

	return db, nil
}
