
-- Create fasting_sessions table
CREATE TABLE public.fasting_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  start_time timestamp with time zone NOT NULL DEFAULT now(),
  end_time timestamp with time zone,
  duration integer NOT NULL,
  type text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  paused_time integer,
  total_paused_duration integer DEFAULT 0,
  mood text,
  energy integer,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.fasting_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for fasting_sessions
CREATE POLICY "Users can view their own fasting sessions" 
  ON public.fasting_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fasting sessions" 
  ON public.fasting_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fasting sessions" 
  ON public.fasting_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fasting sessions" 
  ON public.fasting_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at column
CREATE TRIGGER update_fasting_sessions_updated_at
  BEFORE UPDATE ON public.fasting_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
