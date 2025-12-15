package routes

import (
	"database/sql"
	"net/http"

	"sponsorship-backend/config"
	"sponsorship-backend/internal/api/middleware"
	"sponsorship-backend/internal/handlers"
	"sponsorship-backend/internal/repositories"
	"sponsorship-backend/pkg/jwt"

	"github.com/go-chi/chi/v5"
)

func NewRouter(cfg *config.Config, db *sql.DB) http.Handler {
	r := chi.NewRouter()

	// Global middleware - add request logging first
	r.Use(middleware.RequestLoggingMiddleware)
	r.Use(middleware.CORSMiddleware(cfg.CORSAllowedOrigins))

	// Initialize dependencies
	tokenManager := jwt.NewTokenManager(cfg.JWTSecret, cfg.JWTExpiration)
	authMiddleware := middleware.NewAuthMiddleware(tokenManager)

	userRepo := repositories.NewUserRepository(db)
	sponsorshipRepo := repositories.NewSponsorshipRepository(db)

	authHandler := handlers.NewAuthHandler(userRepo, tokenManager)
	sponsorshipHandler := handlers.NewSponsorshipHandler(sponsorshipRepo)
	checkoutHandler := handlers.NewCheckoutHandler()

	// Public routes
	r.Post("/api/auth/login", authHandler.Login)
	r.Post("/api/auth/register", authHandler.Register)

	// Protected routes
	r.Group(func(r chi.Router) {
		r.Use(authMiddleware.Middleware)

		// Sponsorships
		r.Get("/api/sponsorships", sponsorshipHandler.ListSponsorships)
		r.Post("/api/sponsorships", sponsorshipHandler.CreateSponsorship)
		r.Get("/api/sponsorships/{id}", sponsorshipHandler.GetSponsorship)
		r.Put("/api/sponsorships/{id}", sponsorshipHandler.UpdateSponsorship)
		r.Delete("/api/sponsorships/{id}", sponsorshipHandler.DeleteSponsorship)

		// Dashboard
		r.Get("/api/dashboard/stats", sponsorshipHandler.GetDashboardStats)

		// Checkout (requires authentication)
		r.Post("/api/checkout", checkoutHandler.CreateCheckoutSession)
	})

	return r
}
