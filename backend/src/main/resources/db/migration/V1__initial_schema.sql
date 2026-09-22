CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    login_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(32) NOT NULL,
    is_google_auth BOOLEAN NOT NULL DEFAULT FALSE,
    oauth_provider VARCHAR(64),
    is_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    target_cgpa DOUBLE PRECISION DEFAULT 8.50,
    monthly_budget DOUBLE PRECISION DEFAULT 3000.0,
    has_end_sem_subscription BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ
);

CREATE TABLE deadlines (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), title VARCHAR(255) NOT NULL, due_date DATE, category VARCHAR(64) NOT NULL, priority VARCHAR(32) NOT NULL, status VARCHAR(32) NOT NULL);
CREATE TABLE expenses (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), amount DOUBLE PRECISION NOT NULL, category VARCHAR(64) NOT NULL, description VARCHAR(255), date DATE NOT NULL);
CREATE TABLE focus_sessions (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), subject VARCHAR(255), duration_minutes INTEGER NOT NULL, date DATE NOT NULL, start_time TIME, end_time TIME, notes VARCHAR(255));
CREATE TABLE semester_records (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), semester_number INTEGER NOT NULL, sgpa DOUBLE PRECISION, CONSTRAINT uq_semester_user UNIQUE(user_id, semester_number));
CREATE TABLE simulated_grades (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), course_code VARCHAR(255) NOT NULL, grade VARCHAR(32) NOT NULL, CONSTRAINT uq_sim_grade_user_course UNIQUE(user_id, course_code));
CREATE TABLE attendance_logs (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), course_code VARCHAR(255) NOT NULL, course_name VARCHAR(255), date DATE NOT NULL, status VARCHAR(32) NOT NULL);
CREATE TABLE advisor_chat_messages (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), sender VARCHAR(32) NOT NULL, text VARCHAR(3000) NOT NULL, sent_at TIMESTAMPTZ NOT NULL);
CREATE TABLE pyq_resources (id BIGSERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, url VARCHAR(1000), object_key VARCHAR(512), original_filename VARCHAR(255), mime_type VARCHAR(255), size_bytes BIGINT, status VARCHAR(32) NOT NULL, access_level VARCHAR(32) NOT NULL, created_by_id BIGINT REFERENCES users(id), semester_number INTEGER NOT NULL, course_code VARCHAR(255), type VARCHAR(32) NOT NULL, uploaded_at TIMESTAMPTZ);
CREATE TABLE subscriptions (id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id), plan VARCHAR(255) NOT NULL, status VARCHAR(32) NOT NULL, provider VARCHAR(64), provider_payment_id VARCHAR(255), starts_at TIMESTAMPTZ, expires_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL);
CREATE INDEX idx_subscription_user_status ON subscriptions(user_id, status);

