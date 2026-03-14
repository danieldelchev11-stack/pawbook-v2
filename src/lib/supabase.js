import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://iwbaknduucqubxholjlj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3YmFrbmR1dWNxdWJ4aG9samxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTE5MTQsImV4cCI6MjA4OTA2NzkxNH0.sFOs-Vn2I3l9CyL1VRThpBdHFHdVOyFIgESHT6e6uhc"
);
