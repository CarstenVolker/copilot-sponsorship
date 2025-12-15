package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"sponsorship-backend/internal/api"
	"sponsorship-backend/internal/models"
	"sponsorship-backend/internal/repositories"

	apierrors "sponsorship-backend/pkg/errors"
	"sponsorship-backend/pkg/logger"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type SponsorshipHandler struct {
	repo *repositories.SponsorshipRepository
}

type CreateSponsorshipRequest struct {
	BrandName      string    `json:"brandName"`
	ProductService string    `json:"productService"`
	DealAmount     float64   `json:"dealAmount"`
	Priority       string    `json:"priority"`
	ContactName    string    `json:"contactName"`
	ContactEmail   string    `json:"contactEmail"`
	ContactPhone   string    `json:"contactPhone"`
	Description    string    `json:"description"`
	Deliverables   []string  `json:"deliverables"`
	TargetAudience string    `json:"targetAudience"`
	StartDate      time.Time `json:"startDate"`
	EndDate        time.Time `json:"endDate"`
	Status         string    `json:"status"`
}

type DashboardStats struct {
	ActiveDeals       int     `json:"activeDeals"`
	PendingApproval   int     `json:"pendingApproval"`
	CompletedDeals    int     `json:"completedDeals"`
	PipelineValue     float64 `json:"pipelineValue"`
	AverageDealAmount float64 `json:"averageDealAmount"`
}

func NewSponsorshipHandler(repo *repositories.SponsorshipRepository) *SponsorshipHandler {
	return &SponsorshipHandler{repo: repo}
}

// ListSponsorships lists all sponsorships for the creator
func (h *SponsorshipHandler) ListSponsorships(w http.ResponseWriter, r *http.Request) {
	creatorID := r.Header.Get("X-Creator-ID")
	page := r.URL.Query().Get("page")
	pageNum := 1
	if p, err := strconv.Atoi(page); err == nil && p > 0 {
		pageNum = p
	}

	limit := 20
	offset := (pageNum - 1) * limit

	logger.Debug("Fetching sponsorships for creator %s (page %d, limit %d)", creatorID, pageNum, limit)

	sponsorships, total, err := h.repo.ListSponsorships(creatorID, offset, limit)
	if err != nil {
		logger.Error("Failed to list sponsorships for creator %s: %v", creatorID, err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	if sponsorships == nil {
		sponsorships = []*models.Sponsorship{}
	}

	pagination := api.PaginationMeta{
		Total:   total,
		Page:    pageNum,
		Size:    limit,
		HasMore: offset+limit < total,
	}

	logger.Debug("Successfully retrieved %d sponsorships out of %d total for creator %s", len(sponsorships), total, creatorID)
	api.WritePaginatedSuccess(w, http.StatusOK, sponsorships, pagination)
}

// CreateSponsorship creates a new sponsorship
func (h *SponsorshipHandler) CreateSponsorship(w http.ResponseWriter, r *http.Request) {
	var req CreateSponsorshipRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode create sponsorship request: %v", err)
		api.WriteError(w, apierrors.ErrInvalidRequest)
		return
	}

	// Validate required fields
	if req.BrandName == "" || req.DealAmount <= 0 {
		logger.Warn("Create sponsorship validation failed: invalid brand name or deal amount")
		api.WriteError(w, apierrors.ErrValidationError.WithDetails(map[string]string{
			"brandName":  "Brand name is required",
			"dealAmount": "Deal amount must be greater than 0",
		}))
		return
	}

	creatorID := r.Header.Get("X-Creator-ID")
	if creatorID == "" {
		logger.Warn("Create sponsorship failed: missing creator ID")
		api.WriteError(w, apierrors.ErrUnauthorized)
		return
	}

	sponsorship := &models.Sponsorship{
		ID:             uuid.New().String(),
		CreatorID:      creatorID,
		BrandName:      req.BrandName,
		ProductService: req.ProductService,
		DealAmount:     req.DealAmount,
		Priority:       req.Priority,
		ContactName:    req.ContactName,
		ContactEmail:   req.ContactEmail,
		ContactPhone:   req.ContactPhone,
		Description:    req.Description,
		Deliverables:   req.Deliverables,
		TargetAudience: req.TargetAudience,
		StartDate:      req.StartDate,
		EndDate:        req.EndDate,
		Status:         "pitch-received",
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	logger.Debug("Creating sponsorship: ID=%s, Brand=%s, Amount=%.2f, Creator=%s",
		sponsorship.ID, sponsorship.BrandName, sponsorship.DealAmount, creatorID)

	if err := h.repo.CreateSponsorship(sponsorship); err != nil {
		logger.Error("Failed to create sponsorship %s: %v", sponsorship.ID, err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	logger.Info("Sponsorship created successfully: ID=%s, Brand=%s, Creator=%s",
		sponsorship.ID, sponsorship.BrandName, creatorID)
	api.WriteSuccess(w, http.StatusCreated, sponsorship)
}

// GetSponsorship retrieves a specific sponsorship
func (h *SponsorshipHandler) GetSponsorship(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	creatorID := r.Header.Get("X-Creator-ID")

	logger.Debug("Fetching sponsorship: ID=%s, Creator=%s", id, creatorID)

	sponsorship, err := h.repo.GetSponsorshipByID(id, creatorID)
	if err != nil {
		logger.Warn("Sponsorship not found: ID=%s, Creator=%s", id, creatorID)
		api.WriteError(w, apierrors.ErrNotFound)
		return
	}

	api.WriteSuccess(w, http.StatusOK, sponsorship)
}

// UpdateSponsorship updates a sponsorship
func (h *SponsorshipHandler) UpdateSponsorship(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	creatorID := r.Header.Get("X-Creator-ID")

	var req CreateSponsorshipRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Failed to decode update sponsorship request: %v", err)
		api.WriteError(w, apierrors.ErrInvalidRequest)
		return
	}

	logger.Debug("Updating sponsorship: ID=%s, Creator=%s", id, creatorID)

	// Get existing sponsorship
	sponsorship, err := h.repo.GetSponsorshipByID(id, creatorID)
	if err != nil {
		logger.Warn("Sponsorship not found for update: ID=%s, Creator=%s", id, creatorID)
		api.WriteError(w, apierrors.ErrNotFound)
		return
	}

	// Update fields - only update non-empty fields for partial updates (e.g., status-only changes)
	if req.BrandName != "" {
		sponsorship.BrandName = req.BrandName
	}
	if req.ProductService != "" {
		sponsorship.ProductService = req.ProductService
	}
	if req.DealAmount > 0 {
		sponsorship.DealAmount = req.DealAmount
	}
	if req.Priority != "" {
		sponsorship.Priority = req.Priority
	}
	if req.ContactName != "" {
		sponsorship.ContactName = req.ContactName
	}
	if req.ContactEmail != "" {
		sponsorship.ContactEmail = req.ContactEmail
	}
	if req.ContactPhone != "" {
		sponsorship.ContactPhone = req.ContactPhone
	}
	if req.Description != "" {
		sponsorship.Description = req.Description
	}
	if len(req.Deliverables) > 0 {
		sponsorship.Deliverables = req.Deliverables
	}
	if req.TargetAudience != "" {
		sponsorship.TargetAudience = req.TargetAudience
	}
	if !req.StartDate.IsZero() {
		sponsorship.StartDate = req.StartDate
	}
	if !req.EndDate.IsZero() {
		sponsorship.EndDate = req.EndDate
	}
	if req.Status != "" {
		sponsorship.Status = req.Status
	}

	if err := h.repo.UpdateSponsorship(sponsorship); err != nil {
		logger.Error("Failed to update sponsorship %s: %v", id, err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	logger.Info("Sponsorship updated successfully: ID=%s, Brand=%s, Status=%s, Creator=%s",
		id, sponsorship.BrandName, sponsorship.Status, creatorID)
	api.WriteSuccess(w, http.StatusOK, sponsorship)
}

// DeleteSponsorship deletes a sponsorship
func (h *SponsorshipHandler) DeleteSponsorship(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	creatorID := r.Header.Get("X-Creator-ID")

	logger.Debug("Deleting sponsorship: ID=%s, Creator=%s", id, creatorID)

	if err := h.repo.DeleteSponsorship(id, creatorID); err != nil {
		logger.Warn("Failed to delete sponsorship: ID=%s, Creator=%s, Error: %v", id, creatorID, err)
		api.WriteError(w, apierrors.ErrNotFound)
		return
	}

	logger.Info("Sponsorship deleted successfully: ID=%s, Creator=%s", id, creatorID)
	api.WriteSuccess(w, http.StatusOK, map[string]bool{"deleted": true})
}

// GetDashboardStats returns dashboard statistics
func (h *SponsorshipHandler) GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	creatorID := r.Header.Get("X-Creator-ID")

	logger.Debug("Fetching dashboard stats for creator: %s", creatorID)

	sponsorships, _, err := h.repo.ListSponsorships(creatorID, 0, 10000)
	if err != nil {
		logger.Error("Failed to fetch dashboard stats for creator %s: %v", creatorID, err)
		api.WriteError(w, apierrors.ErrInternalError)
		return
	}

	stats := &DashboardStats{}
	for _, s := range sponsorships {
		if s.Status != "completed" {
			stats.ActiveDeals++
			stats.PipelineValue += s.DealAmount
		}
		if s.Status == "completed" {
			stats.CompletedDeals++
		}
		if s.Status == "negotiating" || s.Status == "approved" {
			stats.PendingApproval++
		}
	}

	if len(sponsorships) > 0 {
		stats.AverageDealAmount = stats.PipelineValue / float64(len(sponsorships))
	}

	api.WriteSuccess(w, http.StatusOK, stats)
}
