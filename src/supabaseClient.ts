// src/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = "https://rsbrjxxzywjdtpwgeokh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzYnJqeHh6eXdqZHRwd2dlb2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1Njg2NjMsImV4cCI6MjA2MzE0NDY2M30.xhOIJ8JLexW934H8v811lVMuTJMqDIP8zWQ-uv14FeM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
