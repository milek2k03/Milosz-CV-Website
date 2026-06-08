import type {
  Project,
  ProjectLocale,
} from '@/domain/portfolio/entities'
import { getSupportedLocale } from '@/i18n/locales'

export const localizeProject = (
  project: Project,
  language: string,
): Project => {
  const locale = getSupportedLocale(language) as ProjectLocale
  const translation = project.translations?.[locale]

  if (!translation) {
    return project
  }

  return {
    ...project,
    title: translation.title,
    subtitle: translation.subtitle,
    summary: translation.summary,
    problem: translation.problem,
    solution: translation.solution,
    scope: translation.scope,
    role: translation.role ?? project.role,
    duration: translation.duration ?? project.duration,
  }
}
