
-- Funkcja do sprawdzania czy tabela istnieje
CREATE OR REPLACE FUNCTION public.table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Utwórz pustą tabelę game_winners jeśli nie istnieje
CREATE TABLE IF NOT EXISTS public.game_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  game_edition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Dodaj komentarz do tabeli
COMMENT ON TABLE public.game_winners IS 'Tabela przechowująca zwycięzców gier';

-- Upewnij się że mamy bazowe indeksy
CREATE INDEX IF NOT EXISTS idx_game_winners_player_id ON public.game_winners(player_id);
CREATE INDEX IF NOT EXISTS idx_game_winners_created_at ON public.game_winners(created_at);
