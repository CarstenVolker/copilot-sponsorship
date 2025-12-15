package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"sponsorship-backend/internal/models"
	"sponsorship-backend/pkg/errors"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type SponsorshipRepository struct {
	db *sql.DB
}

func NewSponsorshipRepository(db *sql.DB) *SponsorshipRepository {
	return &SponsorshipRepository{db: db}
}

// CreateSponsorship creates a new sponsorship
func (r *SponsorshipRepository) CreateSponsorship(sponsorship *models.Sponsorship) error {
	sponsorship.ID = uuid.New().String()
	sponsorship.CreatedAt = time.Now()
	sponsorship.UpdatedAt = time.Now()

	query := `
		INSERT INTO sponsorships (
			id, creator_id, brand_name, product_service, deal_amount, priority,
			contact_name, contact_email, contact_phone, description, deliverables,
			target_audience, start_date, end_date, status, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(
		query,
		sponsorship.ID,
		sponsorship.CreatorID,
		sponsorship.BrandName,
		sponsorship.ProductService,
		sponsorship.DealAmount,
		sponsorship.Priority,
		sponsorship.ContactName,
		sponsorship.ContactEmail,
		sponsorship.ContactPhone,
		sponsorship.Description,
		pq.Array(sponsorship.Deliverables),
		sponsorship.TargetAudience,
		sponsorship.StartDate,
		sponsorship.EndDate,
		sponsorship.Status,
		sponsorship.CreatedAt,
		sponsorship.UpdatedAt,
	).Scan(&sponsorship.ID, &sponsorship.CreatedAt, &sponsorship.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create sponsorship: %w", err)
	}

	return nil
}

// GetSponsorshipByID retrieves a sponsorship by ID
func (r *SponsorshipRepository) GetSponsorshipByID(id, creatorID string) (*models.Sponsorship, error) {
	sponsorship := &models.Sponsorship{}
	query := `
		SELECT id, creator_id, brand_name, product_service, deal_amount, priority,
		       contact_name, contact_email, contact_phone, description, deliverables,
		       target_audience, start_date, end_date, status, created_at, updated_at
		FROM sponsorships
		WHERE id = $1 AND creator_id = $2
	`

	err := r.db.QueryRow(query, id, creatorID).Scan(
		&sponsorship.ID, &sponsorship.CreatorID, &sponsorship.BrandName, &sponsorship.ProductService,
		&sponsorship.DealAmount, &sponsorship.Priority, &sponsorship.ContactName, &sponsorship.ContactEmail,
		&sponsorship.ContactPhone, &sponsorship.Description, pq.Array(&sponsorship.Deliverables),
		&sponsorship.TargetAudience, &sponsorship.StartDate, &sponsorship.EndDate,
		&sponsorship.Status, &sponsorship.CreatedAt, &sponsorship.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get sponsorship: %w", err)
	}

	return sponsorship, nil
}

// ListSponsorships retrieves sponsorships with pagination
func (r *SponsorshipRepository) ListSponsorships(creatorID string, offset, limit int) ([]*models.Sponsorship, int, error) {
	// Get total count
	countQuery := `SELECT COUNT(*) FROM sponsorships WHERE creator_id = $1`
	var total int
	err := r.db.QueryRow(countQuery, creatorID).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count sponsorships: %w", err)
	}

	query := `
		SELECT id, creator_id, brand_name, product_service, deal_amount, priority,
		       contact_name, contact_email, contact_phone, description, deliverables,
		       target_audience, start_date, end_date, status, created_at, updated_at
		FROM sponsorships
		WHERE creator_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.Query(query, creatorID, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list sponsorships: %w", err)
	}
	defer rows.Close()

	var sponsorships []*models.Sponsorship
	for rows.Next() {
		sponsorship := &models.Sponsorship{}
		err := rows.Scan(
			&sponsorship.ID, &sponsorship.CreatorID, &sponsorship.BrandName, &sponsorship.ProductService,
			&sponsorship.DealAmount, &sponsorship.Priority, &sponsorship.ContactName, &sponsorship.ContactEmail,
			&sponsorship.ContactPhone, &sponsorship.Description, pq.Array(&sponsorship.Deliverables),
			&sponsorship.TargetAudience, &sponsorship.StartDate, &sponsorship.EndDate,
			&sponsorship.Status, &sponsorship.CreatedAt, &sponsorship.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan sponsorship: %w", err)
		}
		sponsorships = append(sponsorships, sponsorship)
	}

	return sponsorships, total, nil
}

// UpdateSponsorship updates an existing sponsorship
func (r *SponsorshipRepository) UpdateSponsorship(sponsorship *models.Sponsorship) error {
	sponsorship.UpdatedAt = time.Now()

	query := `
		UPDATE sponsorships
		SET brand_name = $1, product_service = $2, deal_amount = $3, priority = $4,
		    contact_name = $5, contact_email = $6, contact_phone = $7, description = $8,
		    deliverables = $9, target_audience = $10, start_date = $11, end_date = $12,
		    status = $13, updated_at = $14
		WHERE id = $15 AND creator_id = $16
	`

	result, err := r.db.Exec(
		query,
		sponsorship.BrandName, sponsorship.ProductService, sponsorship.DealAmount,
		sponsorship.Priority, sponsorship.ContactName, sponsorship.ContactEmail,
		sponsorship.ContactPhone, sponsorship.Description, pq.Array(sponsorship.Deliverables),
		sponsorship.TargetAudience, sponsorship.StartDate, sponsorship.EndDate,
		sponsorship.Status, sponsorship.UpdatedAt,
		sponsorship.ID, sponsorship.CreatorID,
	)

	if err != nil {
		return fmt.Errorf("failed to update sponsorship: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return errors.ErrNotFound
	}

	return nil
}

// DeleteSponsorship soft deletes a sponsorship
func (r *SponsorshipRepository) DeleteSponsorship(id, creatorID string) error {
	query := `
		UPDATE sponsorships
		SET deleted_at = NOW(), updated_at = NOW()
		WHERE id = $1 AND creator_id = $2 AND deleted_at IS NULL
	`

	result, err := r.db.Exec(query, id, creatorID)
	if err != nil {
		return fmt.Errorf("failed to delete sponsorship: %w", err)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rows == 0 {
		return errors.ErrNotFound
	}

	return nil
}

// GetSponsorshipsByStatus retrieves sponsorships by status
func (r *SponsorshipRepository) GetSponsorshipsByStatus(creatorID, status string) ([]*models.Sponsorship, error) {
	query := `
		SELECT id, creator_id, brand_name, product_service, deal_amount, priority,
		       contact_name, contact_email, contact_phone, description, deliverables,
		       target_audience, start_date, end_date, status, notes, created_at, updated_at
		FROM sponsorships
		WHERE creator_id = $1 AND status = $2 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query, creatorID, status)
	if err != nil {
		return nil, fmt.Errorf("failed to get sponsorships by status: %w", err)
	}
	defer rows.Close()

	var sponsorships []*models.Sponsorship
	for rows.Next() {
		sponsorship := &models.Sponsorship{}
		err := rows.Scan(
			&sponsorship.ID, &sponsorship.CreatorID, &sponsorship.BrandName, &sponsorship.ProductService,
			&sponsorship.DealAmount, &sponsorship.Priority, &sponsorship.ContactName, &sponsorship.ContactEmail,
			&sponsorship.ContactPhone, &sponsorship.Description, &sponsorship.Deliverables,
			&sponsorship.TargetAudience, &sponsorship.StartDate, &sponsorship.EndDate,
			&sponsorship.Status, &sponsorship.Notes, &sponsorship.CreatedAt, &sponsorship.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan sponsorship: %w", err)
		}
		sponsorships = append(sponsorships, sponsorship)
	}

	return sponsorships, nil
}
