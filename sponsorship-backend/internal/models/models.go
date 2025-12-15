package models

import (
	"time"
)

// User represents a system user
type User struct {
	ID        string    `json:"id" db:"id"`
	Username  string    `json:"username" db:"username"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"-" db:"password_hash"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
}

// Creator represents a content creator
type Creator struct {
	ID              string    `json:"id" db:"id"`
	UserID          string    `json:"userId" db:"user_id"`
	Name            string    `json:"name" db:"name"`
	AvatarURL       string    `json:"avatarUrl" db:"avatar_url"`
	SubscriberCount int       `json:"subscriberCount" db:"subscriber_count"`
	ChannelURL      string    `json:"channelUrl" db:"channel_url"`
	Bio             string    `json:"bio" db:"bio"`
	CreatedAt       time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt       time.Time `json:"updatedAt" db:"updated_at"`
}

// Sponsorship represents a sponsorship deal
type Sponsorship struct {
	ID             string     `json:"id" db:"id"`
	CreatorID      string     `json:"creatorId" db:"creator_id"`
	BrandName      string     `json:"brandName" db:"brand_name"`
	ProductService string     `json:"productService" db:"product_service"`
	DealAmount     float64    `json:"dealAmount" db:"deal_amount"`
	Priority       string     `json:"priority" db:"priority"` // high, medium, low
	ContactName    string     `json:"contactName" db:"contact_name"`
	ContactEmail   string     `json:"contactEmail" db:"contact_email"`
	ContactPhone   string     `json:"contactPhone" db:"contact_phone"`
	Description    string     `json:"description" db:"description"`
	Deliverables   []string   `json:"deliverables" db:"deliverables"`
	TargetAudience string     `json:"targetAudience" db:"target_audience"`
	StartDate      time.Time  `json:"startDate" db:"start_date"`
	EndDate        time.Time  `json:"endDate" db:"end_date"`
	Status         string     `json:"status" db:"status"`
	Notes          string     `json:"notes" db:"notes"`
	CreatedAt      time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt      time.Time  `json:"updatedAt" db:"updated_at"`
	DeletedAt      *time.Time `json:"deletedAt" db:"deleted_at"`
}

// SponsorshipStatusHistory tracks status changes
type SponsorshipStatusHistory struct {
	ID            string    `json:"id" db:"id"`
	SponsorshipID string    `json:"sponsorshipId" db:"sponsorship_id"`
	OldStatus     string    `json:"oldStatus" db:"old_status"`
	NewStatus     string    `json:"newStatus" db:"new_status"`
	ChangedAt     time.Time `json:"changedAt" db:"changed_at"`
	ChangedBy     string    `json:"changedBy" db:"changed_by"`
	Reason        string    `json:"reason" db:"reason"`
}

// Valid statuses for sponsorships
var ValidStatuses = []string{
	"pitch-received",
	"under-review",
	"negotiating",
	"approved",
	"contracted",
	"content-creation",
	"awaiting-review",
	"published",
	"completed",
}

// Valid priorities
var ValidPriorities = []string{
	"high",
	"medium",
	"low",
}
