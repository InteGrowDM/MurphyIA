-- Add schedule_type and specific_dates columns
ALTER TABLE public.ai_call_schedules 
ADD COLUMN schedule_type TEXT NOT NULL DEFAULT 'recurring',
ADD COLUMN specific_dates DATE[];

-- Make days_of_week nullable for specific date schedules
ALTER TABLE public.ai_call_schedules 
ALTER COLUMN days_of_week DROP NOT NULL;