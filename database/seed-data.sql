-- Sample data for Ship Routing Application

-- Sample ports
INSERT INTO ports (id, name, country, latitude, longitude, max_draft_m, timezone) VALUES
('CN SHA', 'Port of Shanghai', 'CN', 31.2304, 121.4737, 15.0, 'Asia/Shanghai'),
('SG SIN', 'Port of Singapore', 'SG', 1.3521, 103.8198, 16.0, 'Asia/Singapore'),
('NL RTM', 'Port of Rotterdam', 'NL', 51.9244, 4.4777, 17.0, 'Europe/Amsterdam'),
('US LAX', 'Port of Los Angeles', 'US', 33.7405, -118.2760, 15.5, 'America/Los_Angeles'),
('EG SUZ', 'Port of Suez', 'EG', 29.9668, 32.5498, 20.0, 'Africa/Cairo'),
('PA PCN', 'Port of Panama Canal', 'PA', 9.0820, -79.6802, 15.2, 'America/Panama'),
('ZA CPT', 'Port of Cape Town', 'ZA', -33.9180, 18.4233, 14.0, 'Africa/Johannesburg'),
('AU SYD', 'Port of Sydney', 'AU', -33.8688, 151.2093, 15.0, 'Australia/Sydney'),
('JP TYO', 'Port of Tokyo', 'JP', 35.6762, 139.6503, 16.0, 'Asia/Tokyo'),
('BR RIO', 'Port of Rio de Janeiro', 'BR', -22.9068, -43.1729, 14.5, 'America/Sao_Paulo'),
-- Adding Indian ports
('IN MUM', 'Jawaharlal Nehru Port', 'IN', 18.9490, 72.9525, 14.0, 'Asia/Kolkata'),
('IN CHE', 'Chennai Port', 'IN', 13.1082, 80.2917, 13.5, 'Asia/Kolkata'),
-- Adding Middle East ports
('AE DXB', 'Port of Jebel Ali', 'AE', 25.0159, 55.0678, 17.0, 'Asia/Dubai'),
('SA JED', 'Jeddah Islamic Port', 'SA', 21.4858, 39.1848, 16.0, 'Asia/Riyadh'),
-- Adding more European ports
('DE HAM', 'Port of Hamburg', 'DE', 53.5412, 9.9348, 15.5, 'Europe/Berlin'),
('BE ANR', 'Port of Antwerp', 'BE', 51.2994, 4.2796, 16.0, 'Europe/Brussels'),
('GR PIR', 'Port of Piraeus', 'GR', 37.9428, 23.6395, 14.5, 'Europe/Athens'),
('ES BCN', 'Port of Barcelona', 'ES', 41.3549, 2.1549, 15.0, 'Europe/Madrid'),
-- Adding more African ports
('ZA DUR', 'Port of Durban', 'ZA', -29.8650, 31.0449, 14.5, 'Africa/Johannesburg'),
('NG LOS', 'Port of Lagos', 'NG', 6.4552, 3.3841, 13.0, 'Africa/Lagos'),
('DJ JIB', 'Port of Djibouti', 'DJ', 11.6053, 43.1408, 15.0, 'Africa/Djibouti'),
-- Adding more Southeast Asian ports
('VN SGN', 'Port of Ho Chi Minh City', 'VN', 10.7537, 106.6228, 14.0, 'Asia/Ho_Chi_Minh'),
('TH BKK', 'Port of Bangkok', 'TH', 13.6900, 100.5682, 13.0, 'Asia/Bangkok'),
('MY PKG', 'Port Klang', 'MY', 3.0019, 101.3910, 15.0, 'Asia/Kuala_Lumpur'),
-- Adding more North American ports
('US NYC', 'Port of New York', 'US', 40.7143, -74.0060, 15.5, 'America/New_York'),
('CA VAN', 'Port of Vancouver', 'CA', 49.2827, -123.1207, 14.5, 'America/Vancouver'),
('US HOU', 'Port of Houston', 'US', 29.7604, -95.3689, 14.0, 'America/Chicago');

-- Sample shipping lanes (edges)
INSERT INTO edges (start_port_id, end_port_id, distance_nm, min_depth_m, risk_factor, is_canal_suez, is_canal_panama, forbidden_for_hazard) VALUES
-- Asia routes
('CN SHA', 'SG SIN', 2150.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('CN SHA', 'JP TYO', 1100.00, 15.0, 0.05, FALSE, FALSE, FALSE),
('JP TYO', 'SG SIN', 3100.00, 16.0, 0.1, FALSE, FALSE, FALSE),
-- Singapore to Middle East (Suez)
('SG SIN', 'EG SUZ', 4800.00, 15.0, 0.25, FALSE, FALSE, FALSE),
-- Suez to Europe
('EG SUZ', 'NL RTM', 3200.00, 16.0, 0.2, TRUE, FALSE, FALSE),
-- Americas routes
('US LAX', 'PA PCN', 3200.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('PA PCN', 'US LAX', 3200.00, 14.0, 0.1, FALSE, FALSE, TRUE), -- Hazardous restriction westbound
('PA PCN', 'BR RIO', 4100.00, 15.0, 0.15, FALSE, TRUE, FALSE),
-- Cape routes
('SG SIN', 'ZA CPT', 5800.00, 20.0, 0.3, FALSE, FALSE, FALSE),
('ZA CPT', 'NL RTM', 6200.00, 18.0, 0.2, FALSE, FALSE, FALSE),
-- Australia routes
('SG SIN', 'AU SYD', 4200.00, 15.0, 0.1, FALSE, FALSE, FALSE),
('AU SYD', 'JP TYO', 4600.00, 16.0, 0.15, FALSE, FALSE, FALSE),
('AU SYD', 'US LAX', 6500.00, 15.0, 0.2, FALSE, FALSE, FALSE),

-- New routes for Indian ports
('IN MUM', 'SG SIN', 2400.00, 14.0, 0.15, FALSE, FALSE, FALSE),
('IN MUM', 'AE DXB', 1250.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('IN MUM', 'IN CHE', 800.00, 13.0, 0.05, FALSE, FALSE, FALSE),
('IN CHE', 'SG SIN', 1600.00, 13.0, 0.1, FALSE, FALSE, FALSE),
('IN CHE', 'MY PKG', 1450.00, 13.0, 0.15, FALSE, FALSE, FALSE),

-- Middle East routes
('AE DXB', 'EG SUZ', 1300.00, 16.0, 0.2, FALSE, FALSE, FALSE),
('AE DXB', 'SA JED', 950.00, 16.0, 0.15, FALSE, FALSE, FALSE),
('SA JED', 'EG SUZ', 600.00, 15.0, 0.15, FALSE, FALSE, FALSE),
('EG SUZ', 'GR PIR', 1200.00, 15.0, 0.1, TRUE, FALSE, FALSE),
('SA JED', 'DJ JIB', 750.00, 15.0, 0.25, FALSE, FALSE, FALSE),

-- European routes
('NL RTM', 'DE HAM', 450.00, 15.0, 0.05, FALSE, FALSE, FALSE),
('NL RTM', 'BE ANR', 150.00, 16.0, 0.05, FALSE, FALSE, FALSE),
('BE ANR', 'DE HAM', 500.00, 15.0, 0.05, FALSE, FALSE, FALSE),
('GR PIR', 'ES BCN', 1300.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('ES BCN', 'NL RTM', 2100.00, 14.0, 0.1, FALSE, FALSE, FALSE),

-- Africa routes
('ZA CPT', 'ZA DUR', 800.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('ZA DUR', 'DJ JIB', 3900.00, 14.0, 0.25, FALSE, FALSE, FALSE),
('DJ JIB', 'EG SUZ', 1200.00, 14.0, 0.2, FALSE, FALSE, FALSE),
('NG LOS', 'ZA CPT', 3200.00, 13.0, 0.3, FALSE, FALSE, FALSE),
('NG LOS', 'ES BCN', 2800.00, 13.0, 0.2, FALSE, FALSE, FALSE),

-- Southeast Asia routes
('VN SGN', 'SG SIN', 650.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('TH BKK', 'SG SIN', 850.00, 13.0, 0.15, FALSE, FALSE, FALSE),
('MY PKG', 'SG SIN', 200.00, 15.0, 0.05, FALSE, FALSE, FALSE),
('VN SGN', 'TH BKK', 450.00, 13.0, 0.1, FALSE, FALSE, FALSE),
('TH BKK', 'MY PKG', 750.00, 13.0, 0.1, FALSE, FALSE, FALSE),
('VN SGN', 'CN SHA', 1800.00, 14.0, 0.15, FALSE, FALSE, FALSE),

-- North America routes
('US NYC', 'NL RTM', 3500.00, 15.0, 0.2, FALSE, FALSE, FALSE),
('US NYC', 'US LAX', 4900.00, 14.0, 0.15, FALSE, FALSE, FALSE),
('US NYC', 'US HOU', 1700.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('CA VAN', 'US LAX', 1200.00, 14.0, 0.1, FALSE, FALSE, FALSE),
('CA VAN', 'JP TYO', 4300.00, 14.0, 0.2, FALSE, FALSE, FALSE),
('US HOU', 'PA PCN', 1600.00, 13.5, 0.15, FALSE, FALSE, FALSE);

-- Sample ship types
INSERT INTO ship_types (id, name, max_speed_knots, max_draft_m, fuel_consumption_tpd) VALUES
('PANAMAX', 'Panamax Container Ship', 24, 12.0, 100.0),
('AFRAMAX', 'Aframax Tanker', 15, 14.5, 80.0),
('VLCC', 'Very Large Crude Carrier', 16, 20.0, 120.0),
('BULKER', 'Bulk Carrier', 14, 12.0, 60.0),
('FEEDER', 'Feeder Container Ship', 18, 8.5, 40.0);

-- Sample cargo types
INSERT INTO cargo_types (id, name, forbidden_edges, notes) VALUES
('GENERAL', 'General Cargo', '{}', 'Standard cargo with no special restrictions'),
('HAZ_LQD', 'Liquid Hazardous', '{7}', 'Hazardous liquids with restrictions through Panama Canal'),
('HAZ_EXP', 'Explosives', '{4,7}', 'Explosives with special routing requirements'),
('PERISHABLE', 'Perishable Goods', '{}', 'Requires expedited routing');
