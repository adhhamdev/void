-- Function to create organization with owner
CREATE OR REPLACE FUNCTION create_organization(
    org_name TEXT,
    org_slug TEXT,
    encryption_key_hash TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    org_id UUID;
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Create organization
    INSERT INTO organizations (name, slug, owner_id, encryption_key_hash)
    VALUES (org_name, org_slug, user_id, encryption_key_hash)
    RETURNING id INTO org_id;
    
    -- Add owner as member
    INSERT INTO organization_members (organization_id, user_id, role, joined_at)
    VALUES (org_id, user_id, 'owner', NOW());
    
    RETURN org_id;
END;
$$;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    org_id UUID,
    action_type audit_action,
    resource_type_param TEXT,
    resource_id_param UUID DEFAULT NULL,
    metadata_param JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    audit_id UUID;
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    INSERT INTO audit_logs (
        organization_id,
        user_id,
        action,
        resource_type,
        resource_id,
        metadata,
        ip_address,
        created_at
    )
    VALUES (
        org_id,
        user_id,
        action_type,
        resource_type_param,
        resource_id_param,
        metadata_param,
        inet_client_addr(),
        NOW()
    )
    RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$;

-- Function to get user's organization role
CREATE OR REPLACE FUNCTION get_user_org_role(org_id UUID)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role_result user_role;
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RETURN NULL;
    END IF;
    
    SELECT role INTO user_role_result
    FROM organization_members
    WHERE organization_id = org_id AND user_id = auth.uid();
    
    RETURN user_role_result;
END;
$$;

-- Function to check if user can access secret
CREATE OR REPLACE FUNCTION can_access_secret(secret_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
    has_access BOOLEAN := FALSE;
BEGIN
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    SELECT EXISTS(
        SELECT 1 
        FROM secrets s
        JOIN projects p ON p.id = s.project_id
        JOIN organization_members om ON om.organization_id = p.organization_id
        WHERE s.id = secret_id_param 
        AND om.user_id = user_id
    ) INTO has_access;
    
    RETURN has_access;
END;
$$;
