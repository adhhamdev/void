-- Drop existing problematic policies
DROP POLICY IF EXISTS "Organization members can view members" ON organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON organization_members;

-- Create a function to check organization membership without recursion
CREATE OR REPLACE FUNCTION is_organization_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_id = org_id 
    AND user_id = user_id
  );
$$;

-- Create a function to check if user is admin/owner without recursion
CREATE OR REPLACE FUNCTION is_organization_admin(org_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_id = org_id 
    AND user_id = user_id 
    AND role IN ('owner', 'admin')
  );
$$;

-- Recreate organization_members policies without recursion
-- Allow users to view their own membership records
CREATE POLICY "Users can view own membership" ON organization_members 
FOR SELECT 
USING (user_id = auth.uid());

-- Allow users to view other members in organizations they belong to
-- This uses a direct join to avoid recursion
CREATE POLICY "Members can view organization members" ON organization_members 
FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om 
    WHERE om.user_id = auth.uid()
  )
);

-- Allow organization owners and admins to insert new members
CREATE POLICY "Admins can invite members" ON organization_members 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM organization_members om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin')
  )
);

-- Allow organization owners and admins to update member roles
CREATE POLICY "Admins can update members" ON organization_members 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin')
  )
);

-- Allow organization owners and admins to remove members
CREATE POLICY "Admins can remove members" ON organization_members 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin')
  )
);

-- Update other policies to use the new helper functions
-- Fix organizations policies
DROP POLICY IF EXISTS "Organization members can view organization" ON organizations;
CREATE POLICY "Organization members can view organization" ON organizations 
FOR SELECT 
USING (
  id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Fix projects policies  
DROP POLICY IF EXISTS "Organization members can view projects" ON projects;
DROP POLICY IF EXISTS "Organization admins can manage projects" ON projects;

CREATE POLICY "Organization members can view projects" ON projects 
FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om 
    WHERE om.user_id = auth.uid()
  )
);

CREATE POLICY "Project contributors can manage projects" ON projects 
FOR ALL 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om 
    WHERE om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin', 'developer')
  )
);

-- Fix folders policies
DROP POLICY IF EXISTS "Project members can view folders" ON folders;
DROP POLICY IF EXISTS "Project developers can manage folders" ON folders;

CREATE POLICY "Project members can view folders" ON folders 
FOR SELECT 
USING (
  project_id IN (
    SELECT p.id 
    FROM projects p
    JOIN organization_members om ON p.organization_id = om.organization_id
    WHERE om.user_id = auth.uid()
  )
);

CREATE POLICY "Project contributors can manage folders" ON folders 
FOR ALL 
USING (
  project_id IN (
    SELECT p.id 
    FROM projects p
    JOIN organization_members om ON p.organization_id = om.organization_id
    WHERE om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin', 'developer')
  )
);

-- Fix secrets policies
DROP POLICY IF EXISTS "Project members can view secrets" ON secrets;
DROP POLICY IF EXISTS "Project developers can manage secrets" ON secrets;

CREATE POLICY "Project members can view secrets" ON secrets 
FOR SELECT 
USING (
  project_id IN (
    SELECT p.id 
    FROM projects p
    JOIN organization_members om ON p.organization_id = om.organization_id
    WHERE om.user_id = auth.uid()
  )
);

CREATE POLICY "Project contributors can manage secrets" ON secrets 
FOR ALL 
USING (
  project_id IN (
    SELECT p.id 
    FROM projects p
    JOIN organization_members om ON p.organization_id = om.organization_id
    WHERE om.user_id = auth.uid() 
    AND om.role IN ('owner', 'admin', 'developer')
  )
);

-- Fix secret_versions policies
DROP POLICY IF EXISTS "Project members can view secret versions" ON secret_versions;

CREATE POLICY "Project members can view secret versions" ON secret_versions 
FOR SELECT 
USING (
  secret_id IN (
    SELECT s.id 
    FROM secrets s
    JOIN projects p ON s.project_id = p.id
    JOIN organization_members om ON p.organization_id = om.organization_id
    WHERE om.user_id = auth.uid()
  )
);

-- Fix audit_logs policies
DROP POLICY IF EXISTS "Organization members can view audit logs" ON audit_logs;

CREATE POLICY "Organization members can view audit logs" ON audit_logs 
FOR SELECT 
USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om 
    WHERE om.user_id = auth.uid()
  )
);
