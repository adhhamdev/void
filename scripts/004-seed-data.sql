-- Insert sample data for development
-- Note: This would be replaced with proper data in production

-- Sample profiles (these would be created via Supabase Auth)
INSERT INTO profiles (id, email, full_name) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'alex@company.com', 'Alex Chen'),
    ('550e8400-e29b-41d4-a716-446655440001', 'sarah@company.com', 'Sarah Johnson'),
    ('550e8400-e29b-41d4-a716-446655440002', 'mike@company.com', 'Mike Rodriguez')
ON CONFLICT (id) DO NOTHING;

-- Sample organization
INSERT INTO organizations (id, name, slug, owner_id, encryption_key_hash) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Acme Corp', 'acme-corp', '550e8400-e29b-41d4-a716-446655440000', 'hashed_master_key_here')
ON CONFLICT (slug) DO NOTHING;

-- Sample organization members
INSERT INTO organization_members (organization_id, user_id, role, joined_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'owner', NOW()),
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'admin', NOW()),
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'developer', NOW())
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- Sample projects
INSERT INTO projects (id, organization_id, name, description, slug, created_by) VALUES
    ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'Web Application', 'Main web application secrets', 'web-app', '550e8400-e29b-41d4-a716-446655440000'),
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'Mobile App', 'Mobile application secrets', 'mobile-app', '550e8400-e29b-41d4-a716-446655440000'),
    ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'API Service', 'Backend API secrets', 'api-service', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (organization_id, slug) DO NOTHING;

-- Sample folders
INSERT INTO folders (id, project_id, name, description, created_by) VALUES
    ('880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', 'Authentication', 'Auth related secrets', '550e8400-e29b-41d4-a716-446655440000'),
    ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440000', 'Database', 'Database connection secrets', '550e8400-e29b-41d4-a716-446655440000'),
    ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440000', 'External APIs', 'Third party API keys', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (project_id, name) DO NOTHING;
