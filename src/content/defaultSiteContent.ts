import { companyLogos } from '@/content/companyLogos'
import type {
  ProjectLocale,
  SiteContent,
  SiteLocalizedContent,
} from '@/domain/portfolio/entities'
import { getSupportedLocale } from '@/i18n/locales'
import { resources } from '@/i18n/resources'

const buildLocalizedContent = (locale: ProjectLocale): SiteLocalizedContent => {
  const translation = resources[locale].translation
  const home = translation.home

  return {
    seoDescription: home.seoDescription,
    footerTagline: translation.footer.tagline,
    heroDescription: home.heroDescription,
    currentScope: home.currentScope,
    workflowItems: [...home.workflowItems],
    projects: {
      eyebrow: home.projects.eyebrow,
      title: home.projects.title,
      description: home.projects.description,
      unityHeading: home.projects.unityHeading,
      webHeading: home.projects.webHeading,
      showMore: home.projects.showMore,
      showLess: home.projects.showLess,
    },
    companies: {
      eyebrow: home.companies.eyebrow,
      title: home.companies.title,
      description: home.companies.description,
    },
    areas: {
      eyebrow: home.areas.eyebrow,
      title: home.areas.title,
      description: home.areas.description,
      unityTitle: home.areas.unityTitle,
      unityDescription: home.areas.unityDescription,
      unityButton: home.areas.unityButton,
      webTitle: home.areas.webTitle,
      webDescription: home.areas.webDescription,
      webButton: home.areas.webButton,
    },
    areaPages: {
      unityTitle: home.areaPages.unityTitle,
      unityDescription: home.areaPages.unityDescription,
      webTitle: home.areaPages.webTitle,
      webDescription: home.areaPages.webDescription,
      empty: home.areaPages.empty,
    },
    stack: {
      eyebrow: home.stack.eyebrow,
      title: home.stack.title,
      description: home.stack.description,
      cards: home.stack.cards.map((card) => ({ ...card })),
    },
    contact: {
      eyebrow: home.contact.eyebrow,
      title: home.contact.title,
      description: home.contact.description,
    },
  }
}

export const defaultSiteContent: SiteContent = {
  locales: {
    pl: buildLocalizedContent('pl'),
    en: buildLocalizedContent('en'),
  },
  companyLogos: companyLogos.map((logo) => ({ ...logo })),
}

export const getLocalizedSiteContent = (
  content: SiteContent | undefined,
  language: string,
) => {
  const locale = getSupportedLocale(language)
  return (content ?? defaultSiteContent).locales[locale]
}
