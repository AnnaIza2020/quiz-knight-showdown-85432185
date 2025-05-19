
-- Create player_availability table for storing player calendar slots
CREATE TABLE IF NOT EXISTS public.player_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  time_slots JSONB NOT NULL DEFAULT '{}'::jsonb, -- Key-value pairs of time slots and availability status
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(player_id, date)
);

-- Add RLS policies
ALTER TABLE public.player_availability ENABLE ROW LEVEL SECURITY;

-- Allow admin access
CREATE POLICY "Admin has full access to player_availability"
  ON public.player_availability
  USING (true);
