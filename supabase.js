import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "PASTE_YOUR_PROJECT_URL"
const supabaseKey = "PASTE_YOUR_PUBLISHABLE_KEY"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
