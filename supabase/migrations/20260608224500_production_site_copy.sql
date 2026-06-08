insert into public.site_content (id, content)
values (true, '{}'::jsonb)
on conflict (id) do nothing;

with production_copy as (
  select '{
    "locales": {
      "pl": {
        "seoDescription": "Portfolio Miłosza Czecha: projekty Unity, VR i web z opisem zakresu prac, decyzji technicznych oraz efektów wdrożenia.",
        "footerTagline": "Unity, VR, Software Development",
        "heroDescription": "Projektuję i wdrażam aplikacje Unity, rozwiązania VR oraz projekty webowe. Stawiam na stabilność, czytelną architekturę i realną użyteczność produktu.",
        "currentScope": "Na czym pracuję",
        "workflowItems": [
          "Unity i C#: systemy gameplayowe, narzędzia edytorowe, architektura oraz optymalizacja pod konkretne platformy",
          "VR: intuicyjne interakcje, komfort użytkownika, stabilny framerate i testowanie scen na docelowym sprzęcie",
          "Web: szybkie strony i aplikacje React/TypeScript z Supabase, PostgreSQL oraz panelem administracyjnym"
        ],
        "projects": {
          "eyebrow": "Wybrane realizacje",
          "title": "Projekty z kontekstem technicznym",
          "description": "Każdy projekt opisuję od strony decyzji i odpowiedzialności: jaki był cel, co trzeba było rozwiązać, za które elementy odpowiadałem i jakie technologie miały znaczenie.",
          "unityHeading": "Unity / VR",
          "webHeading": "Strony internetowe",
          "showMore": "Zobacz więcej",
          "showLess": "Pokaż mniej"
        },
        "companies": {
          "eyebrow": "Współpraca",
          "title": "Zespoły i marki, z którymi pracowałem",
          "description": "Przegląd współprac i środowisk, w których dostarczałem rozwiązania Unity, VR oraz webowe."
        },
        "areas": {
          "eyebrow": "Obszary",
          "title": "Unity / VR i web bez mieszania tematów",
          "description": "Portfolio jest podzielone na dwa obszary, żeby łatwiej przejrzeć projekty zgodne z konkretną potrzebą: prace silnikowe w Unity oraz realizacje webowe.",
          "unityTitle": "Unity / VR",
          "unityDescription": "Systemy gameplayowe, aplikacje Unity, prototypy VR, interakcje, profilowanie i optymalizacja pod docelowy sprzęt.",
          "unityButton": "Zobacz projekty Unity",
          "webTitle": "Strony internetowe",
          "webDescription": "Strony i aplikacje webowe w React/TypeScript, panele administracyjne, integracje Supabase oraz wdrożenia na Vercel.",
          "webButton": "Przejdź do portfolio web"
        },
        "areaPages": {
          "unityTitle": "Portfolio Unity / VR",
          "unityDescription": "Wybrane projekty Unity i VR: od prototypowania mechanik po architekturę systemów, optymalizację i przygotowanie buildów.",
          "webTitle": "Portfolio stron internetowych",
          "webDescription": "Realizacje webowe skupione na czytelnej architekturze, szybkim działaniu, integracjach z backendem i wygodnym zarządzaniu treścią.",
          "empty": "Brak opublikowanych projektów w tym obszarze."
        },
        "stack": {
          "eyebrow": "Technicznie",
          "title": "Jak podchodzę do realizacji",
          "description": "Zaczynam od ustalenia celu i ograniczeń, potem dobieram architekturę, która pozwala szybko dowieźć działający produkt i nadal go rozwijać po wdrożeniu.",
          "cards": [
            {
              "title": "Unity / VR",
              "text": "Mechaniki, systemy interakcji, OpenXR, profilowanie scen i buildy przygotowane pod docelowe urządzenia."
            },
            {
              "title": "Software",
              "text": "Front-endy w React i TypeScript, architektura komponentów, integracje API oraz przepływy użytkownika gotowe do codziennej pracy."
            },
            {
              "title": "Backend / Data",
              "text": "Modele danych, PostgreSQL, Supabase Storage, RLS i warstwy repozytoriów oddzielone od interfejsu."
            },
            {
              "title": "Delivery",
              "text": "Czytelne repozytorium, kontrola zakresu, szybkie iteracje i kod, który można przekazać dalej bez zgadywania intencji."
            }
          ]
        },
        "contact": {
          "eyebrow": "Kontakt",
          "title": "Porozmawiajmy o projekcie",
          "description": "Napisz, czego potrzebujesz, jaki jest etap projektu i kiedy chcesz ruszyć. Odpowiem z konkretnymi pytaniami albo propozycją kolejnych kroków."
        }
      },
      "en": {
        "seoDescription": "Miłosz Czech portfolio: Unity, VR and web projects with scope, technical decisions and delivery context.",
        "footerTagline": "Unity, VR, Software Development",
        "heroDescription": "I design and build Unity applications, VR solutions and web projects with a focus on stability, readable architecture and practical product value.",
        "currentScope": "Current work",
        "workflowItems": [
          "Unity and C#: gameplay systems, editor tooling, architecture and platform-focused optimization",
          "VR: intuitive interactions, user comfort, stable framerate and testing on target hardware",
          "Web: fast React/TypeScript applications with Supabase, PostgreSQL and admin workflows"
        ],
        "projects": {
          "eyebrow": "Selected work",
          "title": "Projects with technical context",
          "description": "Each project is presented through decisions and responsibility: the goal, the problem to solve, my part of the work and the technologies that mattered.",
          "unityHeading": "Unity / VR",
          "webHeading": "Websites",
          "showMore": "Show more",
          "showLess": "Show less"
        },
        "companies": {
          "eyebrow": "Collaboration",
          "title": "Teams and brands I have worked with",
          "description": "A short overview of teams and environments where I delivered Unity, VR and web solutions."
        },
        "areas": {
          "eyebrow": "Areas",
          "title": "Unity / VR and web kept separate",
          "description": "The portfolio is split into two areas so you can review the work that matches your need: engine-based Unity projects and web delivery.",
          "unityTitle": "Unity / VR",
          "unityDescription": "Gameplay systems, Unity applications, VR prototypes, interactions, profiling and optimization for target hardware.",
          "unityButton": "View Unity projects",
          "webTitle": "Websites",
          "webDescription": "React/TypeScript websites and applications, admin panels, Supabase integrations and Vercel deployments.",
          "webButton": "Open web portfolio"
        },
        "areaPages": {
          "unityTitle": "Unity / VR Portfolio",
          "unityDescription": "Selected Unity and VR projects: from gameplay prototyping to system architecture, optimization and production builds.",
          "webTitle": "Website Portfolio",
          "webDescription": "Web projects focused on readable architecture, fast loading, backend integrations and comfortable content management.",
          "empty": "There are no published projects in this area yet."
        },
        "stack": {
          "eyebrow": "Technical approach",
          "title": "How I deliver projects",
          "description": "I start with goals and constraints, then choose an architecture that helps ship a working product quickly and keep it maintainable after release.",
          "cards": [
            {
              "title": "Unity / VR",
              "text": "Gameplay mechanics, interaction systems, OpenXR, scene profiling and builds prepared for target devices."
            },
            {
              "title": "Software",
              "text": "React and TypeScript front ends, component architecture, API integrations and user flows ready for daily use."
            },
            {
              "title": "Backend / Data",
              "text": "Data models, PostgreSQL, Supabase Storage, RLS and repository layers separated from the interface."
            },
            {
              "title": "Delivery",
              "text": "Readable repositories, controlled scope, fast iterations and code that can be handed over without guessing intent."
            }
          ]
        },
        "contact": {
          "eyebrow": "Contact",
          "title": "Let’s talk about the project",
          "description": "Tell me what you need, where the project stands and when you want to start. I will reply with concrete questions or a suggested next step."
        }
      }
    }
  }'::jsonb as content
)
update public.site_content
set content =
  coalesce(public.site_content.content, '{}'::jsonb)
  || jsonb_build_object(
    'locales',
    coalesce(public.site_content.content -> 'locales', '{}'::jsonb)
    || jsonb_build_object(
      'pl',
      coalesce(public.site_content.content #> '{locales,pl}', '{}'::jsonb)
      || (production_copy.content #> '{locales,pl}'),
      'en',
      coalesce(public.site_content.content #> '{locales,en}', '{}'::jsonb)
      || (production_copy.content #> '{locales,en}')
    )
  )
from production_copy
where public.site_content.id = true;
