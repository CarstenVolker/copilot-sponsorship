-- 003_create_sponsorships_table.sql
CREATE TABLE IF NOT EXISTS sponsorships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    brand_name VARCHAR(255) NOT NULL,
    product_service VARCHAR(255) NOT NULL,
    deal_amount DECIMAL(10, 2) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    description TEXT NOT NULL,
    target_audience VARCHAR(255),
    deliverables TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pitch-received', 'under-review', 'negotiating', 'approved', 'contracted', 'content-creation', 'awaiting-review', 'published', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_sponsorships_creator_id ON sponsorships(creator_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON sponsorships(status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_created_at ON sponsorships(created_at);
CREATE INDEX IF NOT EXISTS idx_sponsorships_brand_name ON sponsorships USING GIN(to_tsvector('english', brand_name));
