
-- Function to get a game setting by ID
CREATE OR REPLACE FUNCTION get_game_setting(setting_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  setting_value JSONB;
BEGIN
  -- Try to get the setting
  SELECT value INTO setting_value FROM game_settings WHERE id = setting_id;
  
  -- Return the value
  RETURN setting_value;
END;
$$;

-- Function to update a game setting
CREATE OR REPLACE FUNCTION update_game_setting(setting_id TEXT, setting_value JSONB)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if setting exists
  IF EXISTS (SELECT 1 FROM game_settings WHERE id = setting_id) THEN
    -- Update existing setting
    UPDATE game_settings 
    SET value = setting_value, updated_at = now()
    WHERE id = setting_id;
  ELSE
    -- Insert new setting
    INSERT INTO game_settings (id, value, created_at, updated_at)
    VALUES (setting_id, setting_value, now(), now());
  END IF;
END;
$$;

-- Function to delete a game setting
CREATE OR REPLACE FUNCTION delete_game_setting(setting_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM game_settings WHERE id = setting_id;
END;
$$;

-- Function to get all backup settings
CREATE OR REPLACE FUNCTION get_all_backups()
RETURNS JSONB[]
LANGUAGE plpgsql
AS $$
DECLARE
  backup_values JSONB[];
BEGIN
  SELECT array_agg(value) INTO backup_values 
  FROM game_settings 
  WHERE id LIKE 'backup_%';
  
  -- Return empty array if no backups found
  IF backup_values IS NULL THEN
    RETURN '[]'::jsonb[];
  END IF;
  
  RETURN backup_values;
END;
$$;
