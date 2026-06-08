import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { appEnv, hasSupabaseConfig } from '@/config/env'
import type { Database } from '@/infrastructure/supabase/database.types'

export const PROJECT_MEDIA_BUCKET = 'project-media'
export const CV_BUCKET = 'cv'

export const supabaseClient: SupabaseClient<Database> | null =
  hasSupabaseConfig && appEnv.supabaseUrl && appEnv.supabaseAnonKey
    ? createClient<Database>(appEnv.supabaseUrl, appEnv.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null
