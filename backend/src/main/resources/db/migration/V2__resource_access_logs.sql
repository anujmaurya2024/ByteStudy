CREATE TABLE resource_access_logs (
    id BIGSERIAL PRIMARY KEY,
    resource_id BIGINT NOT NULL REFERENCES pyq_resources(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    accessed_at TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    watermark VARCHAR(255)
);
CREATE INDEX idx_resource_access_resource_time ON resource_access_logs(resource_id, accessed_at);
