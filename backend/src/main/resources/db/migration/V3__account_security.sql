ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE users SET email_verified = TRUE;
ALTER TABLE pyq_resources ADD COLUMN ocr_text TEXT;
CREATE TABLE refresh_tokens (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), token_hash VARCHAR(128) NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, revoked BOOLEAN NOT NULL DEFAULT FALSE);
CREATE INDEX idx_refresh_hash ON refresh_tokens(token_hash);
CREATE TABLE account_tokens (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), token_hash VARCHAR(128) NOT NULL UNIQUE, purpose VARCHAR(32) NOT NULL, expires_at TIMESTAMPTZ NOT NULL, used BOOLEAN NOT NULL DEFAULT FALSE);
CREATE INDEX idx_account_token_hash ON account_tokens(token_hash);
CREATE TABLE api_rate_limits (rate_key VARCHAR(300) NOT NULL, bucket BIGINT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY(rate_key, bucket));
