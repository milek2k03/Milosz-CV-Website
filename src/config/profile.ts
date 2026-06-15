import { appEnv } from '@/config/env'

export const siteProfile = {
  fullName: 'Miłosz Czech',
  roles: ['Unity Developer', 'VR Developer', 'Software Developer'],
  location: 'Polska',
  description:
    'Tworzę gry i aplikacje w Unity, rozwiązania VR oraz strony webowe. Stawiam na stabilne buildy, czytelny kod i projekty, które da się dalej rozwijać.',
  email: appEnv.contactEmail ?? 'milosz.czech1803@gmail.com',
  siteUrl: appEnv.siteUrl,
  cvUrl: appEnv.cvUrl,
  links: [
    {
      label: 'GitHub',
      href: appEnv.githubUrl ?? 'https://github.com/',
    },
    {
      label: 'LinkedIn',
      href: appEnv.linkedinUrl ?? 'https://www.linkedin.com/',
    },
  ],
  stack: [
    'Unity',
    'C#',
    'VR',
    'React',
    'TypeScript',
    'Supabase',
    'PostgreSQL',
  ],
} as const
