import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fvhxptpzskvwpdtycklj.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_CCngbc2lcuU8h1po3DzqYg_25JYjF7Q'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
