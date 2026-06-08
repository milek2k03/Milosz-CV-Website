export const resources = {
  pl: {
    translation: {
      common: {
        admin: 'Admin',
        areas: 'Obszary',
        caseStudy: 'Zobacz case study',
        companies: 'Firmy',
        contact: 'Kontakt',
        cv: 'CV',
        email: 'Email',
        github: 'GitHub',
        language: 'Język',
        linkedin: 'LinkedIn',
        loadingProject: 'Ładowanie projektu...',
        loadingProjects: 'Ładowanie projektów...',
        projects: 'Projekty',
        stack: 'Stack',
        unity: 'Unity / VR',
        web: 'Strony internetowe',
        viewArea: 'Wejdź',
      },
      footer: {
        tagline: 'Unity, VR, Software Development',
      },
      home: {
        seoDescription:
          'Portfolio Miłosza Czecha: projekty Unity, VR i web z opisem zakresu prac, decyzji technicznych oraz efektów wdrożenia.',
        heroDescription:
          'Projektuję i wdrażam aplikacje Unity, rozwiązania VR oraz projekty webowe. Stawiam na stabilność, czytelną architekturę i realną użyteczność produktu.',
        currentScope: 'Na czym pracuję',
        workflowItems: [
          'Unity i C#: systemy gameplayowe, narzędzia edytorowe, architektura oraz optymalizacja pod konkretne platformy',
          'VR: intuicyjne interakcje, komfort użytkownika, stabilny framerate i testowanie scen na docelowym sprzęcie',
          'Web: szybkie strony i aplikacje React/TypeScript z Supabase, PostgreSQL oraz panelem administracyjnym',
        ],
        projects: {
          eyebrow: 'Wybrane realizacje',
          title: 'Projekty z kontekstem technicznym',
          description:
            'Każdy projekt opisuję od strony decyzji i odpowiedzialności: jaki był cel, co trzeba było rozwiązać, za które elementy odpowiadałem i jakie technologie miały znaczenie.',
          unityHeading: 'Unity / VR',
          webHeading: 'Strony internetowe',
          showMore: 'Zobacz więcej',
          showLess: 'Pokaż mniej',
        },
        companies: {
          eyebrow: 'Współpraca',
          title: 'Zespoły i marki, z którymi pracowałem',
          description:
            'Przegląd współprac i środowisk, w których dostarczałem rozwiązania Unity, VR oraz webowe.',
        },
        areas: {
          eyebrow: 'Obszary',
          title: 'Unity / VR i web bez mieszania tematów',
          description:
            'Portfolio jest podzielone na dwa obszary, żeby łatwiej przejrzeć projekty zgodne z konkretną potrzebą: prace silnikowe w Unity oraz realizacje webowe.',
          unityTitle: 'Unity / VR',
          unityDescription:
            'Systemy gameplayowe, aplikacje Unity, prototypy VR, interakcje, profilowanie i optymalizacja pod docelowy sprzęt.',
          unityButton: 'Zobacz projekty Unity',
          webTitle: 'Strony internetowe',
          webDescription:
            'Strony i aplikacje webowe w React/TypeScript, panele administracyjne, integracje Supabase oraz wdrożenia na Vercel.',
          webButton: 'Przejdź do portfolio web',
        },
        areaPages: {
          unityTitle: 'Portfolio Unity / VR',
          unityDescription:
            'Wybrane projekty Unity i VR: od prototypowania mechanik po architekturę systemów, optymalizację i przygotowanie buildów.',
          webTitle: 'Portfolio stron internetowych',
          webDescription:
            'Realizacje webowe skupione na czytelnej architekturze, szybkim działaniu, integracjach z backendem i wygodnym zarządzaniu treścią.',
          empty: 'Brak opublikowanych projektów w tym obszarze.',
        },
        stack: {
          eyebrow: 'Technicznie',
          title: 'Jak podchodzę do realizacji',
          description:
            'Zaczynam od ustalenia celu i ograniczeń, potem dobieram architekturę, która pozwala szybko dowieźć działający produkt i nadal go rozwijać po wdrożeniu.',
          cards: [
            {
              title: 'Unity / VR',
              text: 'Mechaniki, systemy interakcji, OpenXR, profilowanie scen i buildy przygotowane pod docelowe urządzenia.',
            },
            {
              title: 'Software',
              text: 'Front-endy w React i TypeScript, architektura komponentów, integracje API oraz przepływy użytkownika gotowe do codziennej pracy.',
            },
            {
              title: 'Backend / Data',
              text: 'Modele danych, PostgreSQL, Supabase Storage, RLS i warstwy repozytoriów oddzielone od interfejsu.',
            },
            {
              title: 'Delivery',
              text: 'Czytelne repozytorium, kontrola zakresu, szybkie iteracje i kod, który można przekazać dalej bez zgadywania intencji.',
            },
          ],
        },
        contact: {
          eyebrow: 'Kontakt',
          title: 'Porozmawiajmy o projekcie',
          description:
            'Napisz, czego potrzebujesz, jaki jest etap projektu i kiedy chcesz ruszyć. Odpowiem z konkretnymi pytaniami albo propozycją kolejnych kroków.',
        },
      },
      contactForm: {
        company: 'Firma / projekt',
        companyPlaceholder: 'Opcjonalnie',
        email: 'Email',
        message: 'Wiadomość',
        messagePlaceholder:
          'Krótki opis projektu, oczekiwany zakres, termin i linki do materiałów.',
        name: 'Imię i nazwisko',
        send: 'Wyślij wiadomość',
        sending: 'Wysyłanie...',
        subject: 'Temat',
        subjectPlaceholder: 'Unity VR, aplikacja webowa, konsultacja...',
        success:
          'Wiadomość została wysłana. Odpowiem możliwie szybko.',
        fallback:
          'Brak konfiguracji Supabase. Otwieram przygotowaną wiadomość email.',
        validation: {
          email: 'Podaj poprawny adres email.',
          message: 'Wiadomość powinna mieć co najmniej 20 znaków.',
          name: 'Podaj imię i nazwisko.',
          subject: 'Podaj temat wiadomości.',
        },
      },
      project: {
        mediaPending: 'Media zostaną dodane w panelu administracyjnym.',
        problem: 'Problem',
        solution: 'Rozwiązanie',
        scope: 'Zakres prac',
        technologies: 'Technologie',
      },
      notFound: {
        title: 'Nie znaleziono strony',
        description: 'Adres jest niepoprawny albo strona została przeniesiona.',
        projectTitle: 'Nie znaleziono projektu',
        projectDescription:
          'Ten projekt nie istnieje albo nie jest opublikowany.',
        backHome: 'Wróć na stronę główną',
        backProjects: 'Projekty',
      },
    },
  },
  en: {
    translation: {
      common: {
        admin: 'Admin',
        areas: 'Areas',
        caseStudy: 'View case study',
        companies: 'Companies',
        contact: 'Contact',
        cv: 'CV',
        email: 'Email',
        github: 'GitHub',
        language: 'Language',
        linkedin: 'LinkedIn',
        loadingProject: 'Loading project...',
        loadingProjects: 'Loading projects...',
        projects: 'Projects',
        stack: 'Stack',
        unity: 'Unity / VR',
        web: 'Websites',
        viewArea: 'Open',
      },
      footer: {
        tagline: 'Unity, VR, Software Development',
      },
      home: {
        seoDescription:
          'Miłosz Czech portfolio: Unity, VR and web projects with scope, technical decisions and delivery context.',
        heroDescription:
          'I design and build Unity applications, VR solutions and web projects with a focus on stability, readable architecture and practical product value.',
        currentScope: 'Current work',
        workflowItems: [
          'Unity and C#: gameplay systems, editor tooling, architecture and platform-focused optimization',
          'VR: intuitive interactions, user comfort, stable framerate and testing on target hardware',
          'Web: fast React/TypeScript applications with Supabase, PostgreSQL and admin workflows',
        ],
        projects: {
          eyebrow: 'Selected work',
          title: 'Projects with technical context',
          description:
            'Each project is presented through decisions and responsibility: the goal, the problem to solve, my part of the work and the technologies that mattered.',
          unityHeading: 'Unity / VR',
          webHeading: 'Websites',
          showMore: 'Show more',
          showLess: 'Show less',
        },
        companies: {
          eyebrow: 'Collaboration',
          title: 'Teams and brands I have worked with',
          description:
            'A short overview of teams and environments where I delivered Unity, VR and web solutions.',
        },
        areas: {
          eyebrow: 'Areas',
          title: 'Unity / VR and web kept separate',
          description:
            'The portfolio is split into two areas so you can review the work that matches your need: engine-based Unity projects and web delivery.',
          unityTitle: 'Unity / VR',
          unityDescription:
            'Gameplay systems, Unity applications, VR prototypes, interactions, profiling and optimization for target hardware.',
          unityButton: 'View Unity projects',
          webTitle: 'Websites',
          webDescription:
            'React/TypeScript websites and applications, admin panels, Supabase integrations and Vercel deployments.',
          webButton: 'Open web portfolio',
        },
        areaPages: {
          unityTitle: 'Unity / VR Portfolio',
          unityDescription:
            'Selected Unity and VR projects: from gameplay prototyping to system architecture, optimization and production builds.',
          webTitle: 'Website Portfolio',
          webDescription:
            'Web projects focused on readable architecture, fast loading, backend integrations and comfortable content management.',
          empty: 'There are no published projects in this area yet.',
        },
        stack: {
          eyebrow: 'Technical approach',
          title: 'How I deliver projects',
          description:
            'I start with goals and constraints, then choose an architecture that helps ship a working product quickly and keep it maintainable after release.',
          cards: [
            {
              title: 'Unity / VR',
              text: 'Gameplay mechanics, interaction systems, OpenXR, scene profiling and builds prepared for target devices.',
            },
            {
              title: 'Software',
              text: 'React and TypeScript front ends, component architecture, API integrations and user flows ready for daily use.',
            },
            {
              title: 'Backend / Data',
              text: 'Data models, PostgreSQL, Supabase Storage, RLS and repository layers separated from the interface.',
            },
            {
              title: 'Delivery',
              text: 'Readable repositories, controlled scope, fast iterations and code that can be handed over without guessing intent.',
            },
          ],
        },
        contact: {
          eyebrow: 'Contact',
          title: 'Let’s talk about the project',
          description:
            'Tell me what you need, where the project stands and when you want to start. I will reply with concrete questions or a suggested next step.',
        },
      },
      contactForm: {
        company: 'Company / project',
        companyPlaceholder: 'Optional',
        email: 'Email',
        message: 'Message',
        messagePlaceholder:
          'Short project description, expected scope, timeline and links to materials.',
        name: 'Full name',
        send: 'Send message',
        sending: 'Sending...',
        subject: 'Subject',
        subjectPlaceholder: 'Unity VR, web application, consultation...',
        success: 'The message has been sent. I will reply as soon as possible.',
        fallback:
          'Supabase is not configured. Opening a prepared email message.',
        validation: {
          email: 'Enter a valid email address.',
          message: 'The message should be at least 20 characters long.',
          name: 'Enter your full name.',
          subject: 'Enter a message subject.',
        },
      },
      project: {
        mediaPending: 'Media will be added in the admin panel.',
        problem: 'Problem',
        solution: 'Solution',
        scope: 'Scope of work',
        technologies: 'Technologies',
      },
      notFound: {
        title: 'Page not found',
        description: 'The address is incorrect or the page has been moved.',
        projectTitle: 'Project not found',
        projectDescription:
          'This project does not exist or is not published.',
        backHome: 'Back to home',
        backProjects: 'Projects',
      },
    },
  },
} as const
