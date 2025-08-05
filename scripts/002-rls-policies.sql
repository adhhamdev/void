-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Organization members can view organization" ON organizations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organization_members 
        WHERE organization_id = organizations.id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Organization owners can update organization" ON organizations FOR UPDATE 
USING (owner_id = auth.uid());

-- Organization members policies
CREATE POLICY "Organization members can view members" ON organization_members FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organization_members om 
        WHERE om.organization_id = organization_members.organization_id 
        AND om.user_id = auth.uid()
    )
);

CREATE POLICY "Organization admins can manage members" ON organization_members FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM organization_members om 
        WHERE om.organization_id = organization_members.organization_id 
        AND om.user_id = auth.uid() 
        AND om.role IN ('owner', 'admin')
    )
);

-- Projects policies
CREATE POLICY "Organization members can view projects" ON projects FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organization_members 
        WHERE organization_id = projects.organization_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Organization admins can manage projects" ON projects FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM organization_members 
        WHERE organization_id = projects.organization_id 
        AND user_id = auth.uid() 
        AND role IN ('owner', 'admin', 'developer')
    )
);

-- Folders policies
CREATE POLICY "Project members can view folders" ON folders FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        JOIN projects p ON p.organization_id = om.organization_id
        WHERE p.id = folders.project_id 
        AND om.user_id = auth.uid()
    )
);

CREATE POLICY "Project developers can manage folders" ON folders FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        JOIN projects p ON p.organization_id = om.organization_id
        WHERE p.id = folders.project_id 
        AND om.user_id = auth.uid() 
        AND om.role IN ('owner', 'admin', 'developer')
    )
);

-- Secrets policies
CREATE POLICY "Project members can view secrets" ON secrets FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        JOIN projects p ON p.organization_id = om.organization_id
        WHERE p.id = secrets.project_id 
        AND om.user_id = auth.uid()
    )
);

CREATE POLICY "Project developers can manage secrets" ON secrets FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        JOIN projects p ON p.organization_id = om.organization_id
        WHERE p.id = secrets.project_id 
        AND om.user_id = auth.uid() 
        AND om.role IN ('owner', 'admin', 'developer')
    )
);

-- Secret versions policies
CREATE POLICY "Project members can view secret versions" ON secret_versions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organization_members om
        JOIN projects p ON p.organization_id = om.organization_id
        JOIN secrets s ON s.project_id = p.id
        WHERE s.id = secret_versions.secret_id 
        AND om.user_id = auth.uid()
    )
);

-- Audit logs policies
CREATE POLICY "Organization members can view audit logs" ON audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM organization_members 
        WHERE organization_id = audit_logs.organization_id 
        AND user_id = auth.uid()
    )
);

-- API keys policies
CREATE POLICY "Users can view own API keys" ON api_keys FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own API keys" ON api_keys FOR ALL 
USING (user_id = auth.uid());
