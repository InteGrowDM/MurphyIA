-- Add restrictive policies for INSERT, UPDATE, DELETE on user_roles
-- Only service_role (backend/triggers) can modify roles - no direct user access

-- Policy: Block all direct INSERT attempts from authenticated users
CREATE POLICY "No direct role inserts" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Policy: Block all direct UPDATE attempts from authenticated users  
CREATE POLICY "No direct role updates"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

-- Policy: Block all direct DELETE attempts from authenticated users
CREATE POLICY "No direct role deletes"
ON public.user_roles
FOR DELETE
TO authenticated
USING (false);