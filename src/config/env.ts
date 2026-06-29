const env = import.meta.env as unknown as Record<string, string | undefined>

const readEnv = (key: string) => {
  const value = env[key]
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

export const appEnv = {
  siteUrl: readEnv('VITE_SITE_URL') ?? 'https://milosz.dev',
  contactEmail: readEnv('VITE_CONTACT_EMAIL'),
  githubUrl: readEnv('VITE_GITHUB_URL'),
  linkedinUrl: readEnv('VITE_LINKEDIN_URL'),
  cvUrl: readEnv('VITE_CV_URL'),
  contactEndpoint: readEnv('VITE_CONTACT_ENDPOINT'),
  contactFunctionName:
    readEnv('VITE_CONTACT_FUNCTION_NAME') ?? 'send-contact-email',
  supabaseUrl: readEnv('VITE_SUPABASE_URL'),
  supabaseAnonKey: readEnv('VITE_SUPABASE_ANON_KEY'),
}

export const hasSupabaseConfig = Boolean(
  appEnv.supabaseUrl && appEnv.supabaseAnonKey,
)
