import { siteProfile } from '@/config/profile'
import type { Project } from '@/domain/portfolio/entities'

export const createPersonSchema = (
  projects: Project[],
  description: string = siteProfile.description,
) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': new URL('/#person', siteProfile.siteUrl).toString(),
  name: siteProfile.fullName,
  jobTitle: siteProfile.roles,
  description,
  email: `mailto:${siteProfile.email}`,
  url: siteProfile.siteUrl,
  image: new URL('/milosz-small-logo.png', siteProfile.siteUrl).toString(),
  knowsAbout: siteProfile.stack,
  sameAs: siteProfile.links
    .map((link) => link.href)
    .filter((href) => !href.endsWith('github.com/') && !href.endsWith('/in/your-profile')),
  hasPart: projects.map((project) => ({
    '@type': 'Project',
    name: project.title,
    description: project.summary,
    url: new URL(`/projects/${project.slug}`, siteProfile.siteUrl).toString(),
  })),
})

export const createProjectSchema = (project: Project) => ({
  '@context': 'https://schema.org',
  '@type': ['CreativeWork', 'Project'],
  name: project.title,
  description: project.summary,
  url: new URL(`/projects/${project.slug}`, siteProfile.siteUrl).toString(),
  image: project.media
    .filter((media) => media.type === 'image')
    .map((media) => new URL(media.url, siteProfile.siteUrl).toString()),
  creator: {
    '@type': 'Person',
    name: siteProfile.fullName,
    jobTitle: siteProfile.roles,
  },
  keywords: project.technologies,
  dateCreated: project.createdAt,
  dateModified: project.updatedAt,
})
