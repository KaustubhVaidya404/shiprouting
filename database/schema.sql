-- Ship Routing Application Database Schema

-- Ports table
CREATE TABLE ports (
    id VARCHAR(10) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    country CHAR(2) NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    max_draft_m DECIMAL(4,2) NOT NULL,
    timezone VARCHAR(50) NOT NULL
);

-- Create spatial index on lat/long for faster geospatial queries
CREATE INDEX idx_ports_location ON ports(latitude, longitude);

-- Edges (shipping lanes) table
CREATE TABLE edges (
    id SERIAL PRIMARY KEY,
    start_port_id VARCHAR(10) NOT NULL REFERENCES ports(id),
    end_port_id VARCHAR(10) NOT NULL REFERENCES ports(id),
    distance_nm DECIMAL(7,2) NOT NULL,
    min_depth_m DECIMAL(4,2) NOT NULL,
    risk_factor DECIMAL(3,2) NOT NULL,
    is_canal_suez BOOLEAN DEFAULT FALSE,
    is_canal_panama BOOLEAN DEFAULT FALSE,
    forbidden_for_hazard BOOLEAN DEFAULT FALSE,
    UNIQUE(start_port_id, end_port_id)
);

-- Ship types table
CREATE TABLE ship_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    max_speed_knots INTEGER NOT NULL,
    max_draft_m DECIMAL(4,2) NOT NULL,
    fuel_consumption_tpd DECIMAL(6,2) NOT NULL
);

-- Cargo types table
CREATE TABLE cargo_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    forbidden_edges TEXT[] DEFAULT '{}',
    notes TEXT
);
