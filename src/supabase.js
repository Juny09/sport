// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zsrfhifywxqlcqbgemiy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzcmZoaWZ5d3hxbGNxYmdlbWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTczODQsImV4cCI6MjA2NjYzMzM4NH0.8MhNblkKp9WpCO1My0xxYzk33hl9aqI3Af8Kv1PTibA'

export const supabase = createClient(supabaseUrl, supabaseKey)
