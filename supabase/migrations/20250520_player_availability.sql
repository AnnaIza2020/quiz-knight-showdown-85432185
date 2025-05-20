
-- Create player_availability table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.player_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playerId UUID NOT NULL REFERENCES public.players(id),
  date TEXT NOT NULL, -- Format: "YYYY-MM-DD"
  timeSlots JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(playerId, date)
);

-- Add Row Level Security
ALTER TABLE public.player_availability ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (typically you'd restrict this with more granular policies)
CREATE POLICY "Public player_availability access" ON public.player_availability FOR ALL USING (true);
