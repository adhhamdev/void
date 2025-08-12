-- Add onboarding fields to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_skipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_onboarding_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster onboarding queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_onboarding 
ON user_preferences(user_id, onboarding_completed);

-- Update existing users to have onboarding preferences
INSERT INTO user_preferences (user_id, onboarding_completed, onboarding_step)
SELECT p.id, TRUE, 5
FROM profiles p
LEFT JOIN user_preferences up ON p.id = up.user_id
WHERE up.user_id IS NULL;
