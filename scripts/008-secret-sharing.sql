-- Create secret_permissions table for granular access control
CREATE TABLE IF NOT EXISTS secret_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  secret_id UUID REFERENCES secrets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('read', 'write', 'admin')),
  granted_by UUID REFERENCES auth.users(id) NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(secret_id, user_id)
);

-- Add RLS policies for secret_permissions
ALTER TABLE secret_permissions ENABLE ROW LEVEL SECURITY;

-- Users can view permissions for secrets they have access to
CREATE POLICY "Users can view secret permissions" ON secret_permissions
  FOR SELECT USING (
    secret_id IN (
      SELECT s.id FROM secrets s
      JOIN projects p ON s.project_id = p.id
      JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid()
    )
  );

-- Users can grant permissions if they have admin access to the secret
CREATE POLICY "Admins can grant permissions" ON secret_permissions
  FOR INSERT WITH CHECK (
    secret_id IN (
      SELECT s.id FROM secrets s
      JOIN projects p ON s.project_id = p.id
      JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    ) OR
    secret_id IN (
      SELECT secret_id FROM secret_permissions
      WHERE user_id = auth.uid() AND permission_level = 'admin'
    )
  );

-- Users can update permissions they granted or if they have admin access
CREATE POLICY "Users can update permissions" ON secret_permissions
  FOR UPDATE USING (
    granted_by = auth.uid() OR
    secret_id IN (
      SELECT s.id FROM secrets s
      JOIN projects p ON s.project_id = p.id
      JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    ) OR
    secret_id IN (
      SELECT secret_id FROM secret_permissions
      WHERE user_id = auth.uid() AND permission_level = 'admin'
    )
  );

-- Users can delete permissions they granted or if they have admin access
CREATE POLICY "Users can delete permissions" ON secret_permissions
  FOR DELETE USING (
    granted_by = auth.uid() OR
    secret_id IN (
      SELECT s.id FROM secrets s
      JOIN projects p ON s.project_id = p.id
      JOIN organization_members om ON p.organization_id = om.organization_id
      WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
    ) OR
    secret_id IN (
      SELECT secret_id FROM secret_permissions
      WHERE user_id = auth.uid() AND permission_level = 'admin'
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_secret_permissions_secret_id ON secret_permissions(secret_id);
CREATE INDEX IF NOT EXISTS idx_secret_permissions_user_id ON secret_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_secret_permissions_granted_by ON secret_permissions(granted_by);

-- Add trigger for audit logging when permissions change
CREATE OR REPLACE FUNCTION log_secret_permission_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      secret_id,
      action,
      resource_type,
      resource_id,
      metadata
    )
    SELECT 
      p.organization_id,
      NEW.granted_by,
      NEW.secret_id,
      'shared'::audit_action,
      'secret_permission',
      NEW.id,
      jsonb_build_object(
        'user_id', NEW.user_id,
        'permission_level', NEW.permission_level,
        'expires_at', NEW.expires_at
      )
    FROM secrets s
    JOIN projects p ON s.project_id = p.id
    WHERE s.id = NEW.secret_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      secret_id,
      action,
      resource_type,
      resource_id,
      metadata
    )
    SELECT 
      p.organization_id,
      NEW.granted_by,
      NEW.secret_id,
      'updated'::audit_action,
      'secret_permission',
      NEW.id,
      jsonb_build_object(
        'user_id', NEW.user_id,
        'old_permission_level', OLD.permission_level,
        'new_permission_level', NEW.permission_level,
        'expires_at', NEW.expires_at
      )
    FROM secrets s
    JOIN projects p ON s.project_id = p.id
    WHERE s.id = NEW.secret_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      organization_id,
      user_id,
      secret_id,
      action,
      resource_type,
      resource_id,
      metadata
    )
    SELECT 
      p.organization_id,
      OLD.granted_by,
      OLD.secret_id,
      'deleted'::audit_action,
      'secret_permission',
      OLD.id,
      jsonb_build_object(
        'user_id', OLD.user_id,
        'permission_level', OLD.permission_level
      )
    FROM secrets s
    JOIN projects p ON s.project_id = p.id
    WHERE s.id = OLD.secret_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER secret_permission_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON secret_permissions
  FOR EACH ROW EXECUTE FUNCTION log_secret_permission_changes();
