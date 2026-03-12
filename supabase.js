import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "zjvlpbmfnbbgtdzlwzfg"
const supabaseKey = "sb_publishable_...."

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
