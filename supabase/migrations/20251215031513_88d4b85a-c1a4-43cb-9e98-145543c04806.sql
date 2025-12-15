ALTER TABLE ai_call_schedules 
ADD COLUMN notification_channel TEXT NOT NULL DEFAULT 'call' 
CHECK (notification_channel IN ('call', 'whatsapp'));