package main

import (
	"fmt"
	"net/http"

	"sponsorship-backend/config"
	"sponsorship-backend/internal/database"
	"sponsorship-backend/internal/routes"
	"sponsorship-backend/pkg/logger"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found, using environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize logger
	isDev := cfg.Environment == "development"
	if err := logger.Init(cfg.LogLevel, isDev, "logs/app.log"); err != nil {
		fmt.Printf("Failed to initialize logger: %v\n", err)
	}

	logger.Info("Starting Sponsorship Backend Application")
	logger.Info("Environment: %s | LogLevel: %s", cfg.Environment, cfg.LogLevel)

	// Initialize database
	logger.Info("Initializing database connection to %s:%d", cfg.DBHost, cfg.DBPort)
	db, err := database.NewDB(cfg.GetDatabaseURL())
	if err != nil {
		logger.Fatal("Failed to initialize database: %v", err)
	}
	defer db.Close()
	logger.Info("Database connection established successfully")

	// Create router
	logger.Debug("Creating router and registering handlers")
	router := routes.NewRouter(cfg, db)

	// Start server
	addr := fmt.Sprintf(":%d", cfg.ServerPort)
	logger.Info("Starting HTTP server on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		logger.Fatal("Server failed: %v", err)
	}
}
