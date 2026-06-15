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
      'Aplikacja Unity VR do przechodzenia procedury serwisowej w goglach. Użytkownik wykonuje kolejne kroki, a system sprawdza interakcje, zapisuje błędy i utrzymuje płynną scenę.',
    problem:
      'Szkolenie na prawdziwym stanowisku wymaga sprzętu, instruktora i powtarzalnych warunków. Przy dłuższej procedurze trudno też sprawdzić, który krok sprawia problem i ile trwa wykonanie zadania.',
    solution:
      'Modułowy system procedur i walidacji kroków. Oddzielne interakcje kontrolerów, UI kontekstowe i raportowanie błędów. Optymalizacja sceny pod stabilny framerate w VR.',
    technologies: ['Unity', 'C#', 'XR Interaction Toolkit', 'OpenXR', 'URP'],
    scope: [
      'Architektura systemu procedur, kroków i reguł walidacji',
      'Implementacja interakcji VR dla kontrolerów i obiektów w scenie',
      'Optymalizacja materiałów, oświetlenia i budżetu renderingu',
      'Raportowanie wyniku szkolenia oraz błędów użytkownika',
    ],
    role: 'Unity / VR Developer',
    duration: '8 tygodni',
    year: '2026',
    area: 'unity',
    status: 'published',
    featured: true,
    sortOrder: 10,
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
          'A Unity VR application for running a service procedure in a headset. The user follows the steps while the system validates interactions, records errors and keeps the scene smooth.',
        problem:
          'Training on a real workstation requires equipment, an instructor and repeatable conditions. With a longer procedure it is also hard to see which step caused trouble and how long the task took.',
        solution:
          'A modular procedure and step validation system. Separate controller interactions, contextual UI and error reporting. Scene optimization aimed at stable VR framerate.',
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
      'Prototyp systemów gameplayowych w Unity: logika interakcji, trasy AI, debug overlay i struktura kodu przygotowana pod szybkie playtesty.',
    problem:
      'Zespół potrzebował sposobu na szybkie testowanie mechanik bez przepisywania logiki przy każdej zmianie poziomu. Największym ryzykiem był kod mocno związany ze sceną, trudny do debugowania i kosztowny w dalszym rozwijaniu.',
    solution:
      'Logika podzielona na małe systemy: definicje interakcji, sensory, ruch, zdarzenia i narzędzia debugowania. ScriptableObjects pozwalają zmieniać konfigurację bez ruszania kodu.',
    technologies: ['Unity', 'C#', 'ScriptableObjects', 'NavMesh', 'Git'],
    scope: [
      'Projekt modularnej architektury systemów gameplayowych',
      'Narzędzia debugowania tras, stanów i punktów interakcji',
      'Implementacja reguł interakcji oraz obsługi zdarzeń',
      'Przygotowanie projektu pod szybkie playtesty i dalszą produkcję',
    ],
    role: 'Unity Developer',
    duration: '5 tygodni',
    year: '2025',
    area: 'unity',
    status: 'published',
    featured: true,
    sortOrder: 20,
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
          'A Unity prototype for gameplay systems: interaction logic, AI paths, debug overlay and code structure prepared for fast playtests.',
        problem:
          'The team needed a way to test mechanics quickly without rewriting logic after every level change. The main risk was scene-coupled code that was hard to debug and expensive to extend.',
        solution:
          'The logic was split into small systems: interaction definitions, sensors, movement, events and debugging tools. ScriptableObjects make configuration changes possible without touching code.',
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
      'Panel webowy do publikowania projektów, obsługi formularza kontaktowego, uploadu mediów do Supabase Storage i zarządzania CV bez edycji kodu.',
    problem:
      'Portfolio techniczne ma żyć dłużej niż jedna wersja strony. Ręczne dopisywanie projektów w kodzie szybko utrudnia aktualizacje, a osobne przechowywanie zdjęć, filmów i CV zwiększa ryzyko chaosu w treściach.',
    solution:
      'Domena opisuje projekty i media, repozytoria izolują Supabase, a panel administratora obsługuje publikację, upload plików i CV. Publiczna strona pobiera tylko opublikowane projekty.',
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
    year: '2026',
    area: 'web',
    status: 'published',
    featured: true,
    sortOrder: 10,
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
          'A web panel for publishing projects, handling the contact form, uploading media to Supabase Storage and managing CV files without editing code.',
        problem:
          'A technical portfolio should live longer than one version of the website. Manually adding projects in code quickly slows updates down, while keeping images, videos and CV files separately increases content maintenance overhead.',
        solution:
          'The domain describes projects and media, repositories isolate Supabase, and the admin panel handles publishing, file uploads and CV files. The public site reads only published projects.',
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
