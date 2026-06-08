import gameplaySystemsImage from '@/assets/projects/gameplay-systems.jpg'
import portfolioAdminImage from '@/assets/projects/portfolio-admin.jpg'
import vrTrainingImage from '@/assets/projects/vr-training-simulator.jpg'
import type { Project } from '@/domain/portfolio/entities'

const timestamp = '2026-06-08T08:00:00.000Z'

export const seedProjects: Project[] = [
  {
    id: 'vr-training-simulator',
    slug: 'vr-training-simulator',
    title: 'VR Training Simulator',
    subtitle: 'Symulator szkoleniowy VR dla procedur serwisowych',
    summary:
      'Aplikacja Unity VR prowadząca użytkownika przez procedurę serwisową krok po kroku, z walidacją interakcji, raportowaniem błędów i sceną zoptymalizowaną pod stabilną pracę na goglach VR.',
    problem:
      'Szkolenia przy rzeczywistym stanowisku wymagają dostępności sprzętu, instruktora i powtarzalnych warunków. Przy złożonych procedurach trudno też mierzyć, które kroki sprawiają problem, ile trwa wykonanie zadania i w którym momencie użytkownik traci kontekst.',
    solution:
      'Projekt został zaprojektowany jako modułowy symulator VR: osobno działają system procedur, walidacja kroków, interakcje kontrolerów, UI kontekstowe oraz raportowanie. Dzięki temu scenariusze można rozwijać bez przebudowy całej aplikacji, a optymalizacja renderingu i assetów utrzymuje stabilny framerate.',
    technologies: ['Unity', 'C#', 'XR Interaction Toolkit', 'OpenXR', 'URP'],
    scope: [
      'Architektura systemu procedur, kroków i reguł walidacji',
      'Implementacja interakcji VR dla kontrolerów i obiektów w scenie',
      'Optymalizacja materiałów, oświetlenia i budżetu renderingu',
      'Raportowanie wyniku szkolenia oraz błędów użytkownika',
    ],
    role: 'Unity / VR Developer',
    duration: '8 tygodni',
    year: 2026,
    area: 'unity',
    status: 'published',
    featured: true,
    links: [
      {
        label: 'Case study',
        url: '/projects/vr-training-simulator',
        type: 'case-study',
      },
    ],
    media: [
      {
        id: 'vr-training-image',
        type: 'image',
        url: vrTrainingImage,
        alt: 'Zrzut ekranu z symulatora VR w Unity',
        sortOrder: 1,
      },
    ],
    translations: {
      en: {
        title: 'VR Training Simulator',
        subtitle: 'VR training simulator for service procedures',
        summary:
          'A Unity VR application that guides users through a service procedure step by step, with interaction validation, error reporting and a scene optimized for stable performance on VR headsets.',
        problem:
          'Training on a real workstation requires available equipment, an instructor and repeatable conditions. For complex procedures it is also difficult to measure which steps cause issues, how long the task takes and where the user loses context.',
        solution:
          'The project was designed as a modular VR simulator: procedure flow, step validation, controller interactions, contextual UI and reporting are separated. New scenarios can be extended without rebuilding the whole application, while rendering and asset optimization keep the framerate stable.',
        scope: [
          'Architecture of the procedure, step and validation rule system',
          'VR interaction implementation for controllers and scene objects',
          'Optimization of materials, lighting and rendering budget',
          'Training result and user error reporting',
        ],
        role: 'Unity / VR Developer',
        duration: '8 weeks',
      },
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 'gameplay-systems-prototype',
    slug: 'gameplay-systems-prototype',
    title: 'Gameplay Systems Prototype',
    subtitle: 'Modularny prototyp systemów rozgrywki i AI',
    summary:
      'Prototyp narzędzi i systemów gameplayowych w Unity: logika interakcji, trasy AI, debug overlay i struktura kodu przygotowana do szybkich playtestów oraz dalszej produkcji.',
    problem:
      'Zespół potrzebował sposobu na szybkie testowanie mechanik bez przepisywania logiki przy każdej zmianie poziomu. Największym ryzykiem był kod mocno związany ze sceną, trudny do debugowania i kosztowny w dalszym rozwijaniu.',
    solution:
      'Logika została podzielona na małe, testowalne systemy: definicje interakcji, sensory, ruch, zdarzenia i narzędzia debugowania. Konfiguracja przez ScriptableObjects pozwala iterować bez zmian w kodzie, a overlay developerski ułatwia diagnozowanie zachowań w czasie gry.',
    technologies: ['Unity', 'C#', 'ScriptableObjects', 'NavMesh', 'Git'],
    scope: [
      'Projekt modularnej architektury systemów gameplayowych',
      'Narzędzia debugowania tras, stanów i punktów interakcji',
      'Implementacja reguł interakcji oraz obsługi zdarzeń',
      'Przygotowanie projektu pod szybkie playtesty i dalszą produkcję',
    ],
    role: 'Unity Developer',
    duration: '5 tygodni',
    year: 2025,
    area: 'unity',
    status: 'published',
    featured: true,
    links: [
      {
        label: 'Case study',
        url: '/projects/gameplay-systems-prototype',
        type: 'case-study',
      },
    ],
    media: [
      {
        id: 'gameplay-systems-image',
        type: 'image',
        url: gameplaySystemsImage,
        alt: 'Zrzut ekranu z prototypu systemów gameplayowych',
        sortOrder: 1,
      },
    ],
    translations: {
      en: {
        title: 'Gameplay Systems Prototype',
        subtitle: 'Modular prototype for gameplay and AI systems',
        summary:
          'A Unity prototype for gameplay tools and systems: interaction logic, AI paths, debug overlay and a code structure prepared for fast playtests and further production.',
        problem:
          'The team needed a way to test mechanics quickly without rewriting logic after every level change. The main risk was scene-coupled code that was hard to debug and expensive to extend.',
        solution:
          'The logic was split into small, testable systems: interaction definitions, sensors, movement, events and debugging tools. ScriptableObject-based configuration enables iteration without code changes, while the developer overlay makes runtime behavior easier to diagnose.',
        scope: [
          'Design of a modular gameplay systems architecture',
          'Debugging tools for paths, states and interaction points',
          'Implementation of interaction rules and event handling',
          'Project preparation for fast playtests and further production',
        ],
        role: 'Unity Developer',
        duration: '5 weeks',
      },
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  },
  {
    id: 'portfolio-admin-platform',
    slug: 'portfolio-admin-platform',
    title: 'Portfolio Admin Platform',
    subtitle: 'Panel do zarządzania case studies, mediami i CV',
    summary:
      'Aplikacja webowa do publikowania projektów, obsługi formularza kontaktowego, uploadu mediów do Supabase Storage oraz zarządzania CV bez edycji kodu przy każdej aktualizacji portfolio.',
    problem:
      'Portfolio techniczne ma żyć dłużej niż jedna wersja strony. Ręczne dopisywanie projektów w kodzie szybko utrudnia aktualizacje, a osobne przechowywanie zdjęć, filmów i CV zwiększa ryzyko chaosu w treściach.',
    solution:
      'Aplikacja została zbudowana warstwowo: domena opisuje projekty i media, repozytoria izolują Supabase, a panel administratora obsługuje publikację case studies, upload plików i CV. Publiczna część pobiera wyłącznie opublikowane projekty, a formularz kontaktowy korzysta z Edge Function do wysyłki email.',
    technologies: [
      'React',
      'Vite',
      'TypeScript',
      'TailwindCSS',
      'Supabase',
      'PostgreSQL',
    ],
    scope: [
      'Model danych dla projektów, tłumaczeń, mediów i wiadomości kontaktowych',
      'Panel /admin z autoryzacją Supabase Auth',
      'Upload obrazów, filmów i CV do Supabase Storage',
      'SEO, JSON-LD, sitemap, robots i przygotowanie pod wielojęzyczność',
    ],
    role: 'Software Developer',
    duration: 'rozwój iteracyjny',
    year: 2026,
    area: 'web',
    status: 'published',
    featured: true,
    links: [
      {
        label: 'Case study',
        url: '/projects/portfolio-admin-platform',
        type: 'case-study',
      },
    ],
    media: [
      {
        id: 'portfolio-admin-image',
        type: 'image',
        url: portfolioAdminImage,
        alt: 'Zrzut ekranu z panelu administracyjnego portfolio',
        sortOrder: 1,
      },
    ],
    translations: {
      en: {
        title: 'Portfolio Admin Platform',
        subtitle: 'Admin panel for case studies, media and CV management',
        summary:
          'A web application for publishing projects, handling the contact form, uploading media to Supabase Storage and managing a CV without editing code for every portfolio update.',
        problem:
          'A technical portfolio should live longer than one version of the website. Manually adding projects in code quickly slows updates down, while keeping images, videos and CV files separately increases content maintenance overhead.',
        solution:
          'The application was built in layers: the domain describes projects and media, repositories isolate Supabase, and the admin panel handles case study publishing, file uploads and CV management. The public site reads only published projects, while the contact form uses an Edge Function to send email.',
        scope: [
          'Data model for projects, translations, media and contact messages',
          'Admin panel protected by Supabase Auth',
          'Image, video and CV upload to Supabase Storage',
          'SEO, JSON-LD, sitemap, robots and multilingual readiness',
        ],
        role: 'Software Developer',
        duration: 'iterative development',
      },
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  },
]
