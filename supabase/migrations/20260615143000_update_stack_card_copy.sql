with stack_copy as (
  select
    '[
      {
        "title": "Unity / VR",
        "text": "Mechaniki rozgrywki, interakcje XR, OpenXR, optymalizacja wydajności oraz testy na docelowych urządzeniach VR."
      },
      {
        "title": "Software",
        "text": "Aplikacje webowe w React i TypeScript, komponenty, integracje API oraz interfejsy projektowane z myślą o rzeczywistym użytkowaniu."
      },
      {
        "title": "Backend / Data",
        "text": "PostgreSQL, Supabase, autoryzacja, przechowywanie danych i architektura oddzielająca logikę aplikacji od warstwy prezentacji."
      },
      {
        "title": "Delivery",
        "text": "Krótki cykl wdrożeń, czytelny kod, przejrzyste commity i rozwiązania, które można łatwo rozwijać oraz przekazać innym programistom."
      }
    ]'::jsonb as pl_cards,
    '[
      {
        "title": "Unity / VR",
        "text": "Gameplay systems, XR interactions, OpenXR, performance optimization, and testing on target VR devices."
      },
      {
        "title": "Software",
        "text": "Web applications built with React and TypeScript, API integrations, and user interfaces designed for real-world use."
      },
      {
        "title": "Backend / Data",
        "text": "PostgreSQL, Supabase, authentication, data storage, and architecture that keeps business logic separate from the presentation layer."
      },
      {
        "title": "Delivery",
        "text": "Short delivery cycles, clean code, clear commit history, and solutions that are easy to maintain and hand over to other developers."
      }
    ]'::jsonb as en_cards
)
update public.site_content
set content = jsonb_set(
  jsonb_set(
    coalesce(content, '{}'::jsonb),
    '{locales,pl,stack,cards}',
    stack_copy.pl_cards,
    true
  ),
  '{locales,en,stack,cards}',
  stack_copy.en_cards,
  true
)
from stack_copy
where id = true;
