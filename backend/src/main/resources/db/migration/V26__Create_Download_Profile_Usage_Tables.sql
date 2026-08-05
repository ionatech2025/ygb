-- Epic 9: download profiles, sessions, events, and public visit beacons
CREATE TABLE download_profiles (
    id UUID PRIMARY KEY,
    email VARCHAR(320) NOT NULL,
    optional_name VARCHAR(200),
    country_code VARCHAR(2) NOT NULL,
    gender VARCHAR(16) NOT NULL
        CHECK (gender IN ('MALE', 'FEMALE')),
    age_group VARCHAR(32) NOT NULL
        CHECK (age_group IN (
            'AGE_BELOW_18', 'AGE_18_24', 'AGE_25_29', 'AGE_30_35', 'AGE_ABOVE_35'
        )),
    field_of_operation VARCHAR(48) NOT NULL
        CHECK (field_of_operation IN (
            'ACADEMIA_RESEARCH',
            'GOVERNMENT',
            'NGO_CSO',
            'DONOR_DEVELOPMENT_PARTNER',
            'MEDIA',
            'PRIVATE_SECTOR',
            'STUDENT',
            'OTHER'
        )),
    field_of_operation_specify VARCHAR(255),
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_download_profiles_gender ON download_profiles (gender);
CREATE INDEX idx_download_profiles_age_group ON download_profiles (age_group);
CREATE INDEX idx_download_profiles_created_at ON download_profiles (created_at);

CREATE TABLE download_sessions (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES download_profiles (id),
    token VARCHAR(128) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX uniq_download_sessions_token ON download_sessions (token);
CREATE INDEX idx_download_sessions_profile_id ON download_sessions (profile_id);
CREATE INDEX idx_download_sessions_expires_at ON download_sessions (expires_at);

CREATE TABLE download_events (
    id UUID PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES download_profiles (id),
    session_id UUID NOT NULL REFERENCES download_sessions (id),
    dataset VARCHAR(48) NOT NULL
        CHECK (dataset IN ('PDM', 'BUDGET_PRIORITIES', 'LGO_BUDGET_ALLOCATION')),
    format VARCHAR(8) NOT NULL
        CHECK (format IN ('CSV', 'XLSX')),
    downloaded_at TIMESTAMPTZ NOT NULL,
    filter_fingerprint VARCHAR(512)
);

CREATE INDEX idx_download_events_profile_id ON download_events (profile_id);
CREATE INDEX idx_download_events_downloaded_at ON download_events (downloaded_at);
CREATE INDEX idx_download_events_dataset ON download_events (dataset);

CREATE TABLE public_visit_events (
    id UUID PRIMARY KEY,
    anonymous_session_id VARCHAR(128) NOT NULL,
    route_group VARCHAR(64) NOT NULL,
    visited_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_public_visit_events_visited_at ON public_visit_events (visited_at);
CREATE INDEX idx_public_visit_events_anonymous_session ON public_visit_events (anonymous_session_id);
