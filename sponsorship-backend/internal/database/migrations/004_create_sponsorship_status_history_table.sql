-- 004_create_sponsorship_status_history_table.sql
CREATE TABLE IF NOT EXISTS sponsorship_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sponsorship_id UUID NOT NULL REFERENCES sponsorships(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID REFERENCES users(id),
    reason VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS idx_status_history_sponsorship_id ON sponsorship_status_history(sponsorship_id);
CREATE INDEX IF NOT EXISTS idx_status_history_changed_at ON sponsorship_status_history(changed_at);
