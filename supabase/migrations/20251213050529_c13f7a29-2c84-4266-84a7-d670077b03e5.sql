-- Create notification_preferences table
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  hypoglycemia_alerts BOOLEAN DEFAULT true,
  hyperglycemia_alerts BOOLEAN DEFAULT true,
  glucose_alerts BOOLEAN DEFAULT true,
  measurement_reminders BOOLEAN DEFAULT true,
  medication_reminders BOOLEAN DEFAULT false,
  daily_summary BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can manage their own preferences
CREATE POLICY "Users manage own notification preferences" 
ON notification_preferences FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);