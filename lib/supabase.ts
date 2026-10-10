import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Facility = {
  id: number
  name: string
  region: string
  health_system: string
  specialty: string
  recruiting: boolean
  onboarding: boolean
  required_experience: string
  orientation_dates: string
  facility_requirements: string
  dormancy_policy: string
  current_employee_protocol: string
}
