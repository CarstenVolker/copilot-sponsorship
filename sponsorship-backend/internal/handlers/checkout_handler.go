package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/checkout/session"

	"sponsorship-backend/internal/api"
	apierrors "sponsorship-backend/pkg/errors"
	"sponsorship-backend/pkg/logger"
)

type CheckoutHandler struct{}

type CheckoutRequest struct {
	ProductName string `json:"productName"`
	Price       string `json:"price"`
}

type CheckoutResponse struct {
	CheckoutURL string `json:"checkoutUrl"`
}

func NewCheckoutHandler() *CheckoutHandler {
	return &CheckoutHandler{}
}

// CreateCheckoutSession creates a Stripe checkout session and returns the URL
func (h *CheckoutHandler) CreateCheckoutSession(w http.ResponseWriter, r *http.Request) {
	var req CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode checkout request: %v", err)
		api.WriteError(w, apierrors.ErrInvalidRequest)
		return
	}

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		logger.Warn("Checkout failed: missing user ID")
		api.WriteError(w, apierrors.ErrUnauthorized)
		return
	}

	logger.Debug("Creating checkout session for user %s, product: %s", userID, req.ProductName)

	// Initialize Stripe API key
	stripeSecretKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeSecretKey == "" {
		logger.Error("STRIPE_SECRET_KEY not configured")
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}
	stripe.Key = stripeSecretKey

	// Parse price from string (e.g., "$29" -> 2900 cents)
	priceAmount := parsePriceToStripeAmount(req.Price)

	// Create checkout session parameters
	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("usd"),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String(req.ProductName),
					},
					UnitAmount: stripe.Int64(priceAmount),
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode:              stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL:        stripe.String(os.Getenv("FRONTEND_URL") + "/dashboard?payment=success"),
		CancelURL:         stripe.String(os.Getenv("FRONTEND_URL") + "/products?payment=cancelled"),
		ClientReferenceID: stripe.String(userID),
	}

	// Create the session
	sess, err := session.New(params)
	if err != nil {
		logger.Error("Failed to create Stripe checkout session: %v", err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	response := CheckoutResponse{
		CheckoutURL: sess.URL,
	}

	logger.Info("Checkout session created: ProductName=%s, User=%s, SessionID=%s",
		req.ProductName, userID, sess.ID)
	api.WriteSuccess(w, http.StatusOK, response)
}

// parsePriceToStripeAmount converts price string like "$29" to Stripe amount in cents (2900)
func parsePriceToStripeAmount(price string) int64 {
	// Remove $ and spaces
	cleanPrice := strings.TrimSpace(strings.TrimPrefix(price, "$"))

	// Parse as float
	amount, err := strconv.ParseFloat(cleanPrice, 64)
	if err != nil {
		logger.Warn("Failed to parse price: %s, defaulting to 0", price)
		return 0
	}

	// Convert to cents
	return int64(amount * 100)
}
