import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ziaijcwxtaiqocdcklyh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppYWlqY3d4dGFpcW9jZGNrbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNjk0MDgsImV4cCI6MjA4Mjc0NTQwOH0.4qRVuHHMiATfBUP4KKgr_VhlxQhWlVj1BqjBfp9utps'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'tcf' }
})
