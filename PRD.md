# PRD – WoodCalc (robocza nazwa)

## 1. Wstęp

- **Cel dokumentu**: Opisuje wizję, wymagania i kryteria akceptacji aplikacji do obliczania objętości i kosztu elementów drewnianych, przeznaczonej dla stolarza-hobbysty (50 lat).
- **Zespół**: 1 × Product Owner (Ty), 1 × Developer (Ty lub kontraktor), 1 × Designer (opcjonalnie).
- **Zakres wersji**: **MVP v1.0** (Progressive Web App w Next.js).

## 2. Problem do rozwiązania

Stolarze amatorzy i drobni wykonawcy często liczą objętość oraz koszt drewna "na piechotę". Pochłania to czas i sprzyja błędom, zwłaszcza przy kilku pozycjach w projekcie.

## 3. Persona główna

|                             |                                                                                                     |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| **Imię**                    | Andrzej                                                                                             |
| **Wiek**                    | 50 lat                                                                                              |
| **Biegłość technologiczna** | niska – obsługa smartfona, WhatsApp, Facebook                                                       |
| **Bóle**                    | skomplikowane kalkulatory/arkusze; małe przyciski; brak miejsca na zapisy                           |
| **Cel**                     | szybko policzyć, ile desek kupić, ile to będzie kosztować i udostępnić wynik klientowi lub rodzinie |

## 4. Główne przypadki użycia (User Stories)

1. **US-1** • Jako stolarz chcę wprowadzić wymiary i cenę m³, aby zobaczyć objętość i koszt konkretnego elementu.
2. **US-2** • Jako stolarz chcę dodać wiele elementów, aby znać łączny koszt projektu.
3. **US-3** • Jako stolarz chcę zapisać projekt lokalnie, aby wrócić do niego później (bez logowania).
4. **US-4** • Jako stolarz chcę zapisać podsumowanie jako obraz i udostępnić je w WhatsAppie.

## 5. Wymagania funkcjonalne

**F1. Formularz "Nowy element"**

- Pola: długość (cm), szerokość (cm), grubość (cm), ilość (szt.), cena (PLN/m³).
- Walidacja liczbowa, jednostki podpowiadane w polu.

**F2. Lista elementów (oddzielne karty)**

- Dla każdej karty: obliczona objętość (m³), koszt (PLN), przycisk "Usuń".

**F3. Podsumowanie**

- Suma objętości, suma kosztów.

**F4. Zapis/odczyt projektu**

- Lokalny magazyn (IndexedDB lub `localStorage`).
- Lista zapisanych projektów (nazwa, data); przycisk "Załaduj" / "Usuń".

**F5. Eksport jako obraz**

- Generowanie zrzutu ekranu podsumowania (html-to-image / dom-to-png).
- Systemowy panel udostępniania (Web Share API).

**F6. Responsywność i tryb offline (PWA)**

- Manifest, Service Worker: pełna funkcjonalność bez sieci po instalacji.

## 6. Wymagania niefunkcjonalne

- Łatwość użycia: maks. 3 kroki do obliczenia pierwszego elementu.
- Dostępność: kontrast min. 4.5:1, czcionka min. 16 px.
- Czas reakcji UI: < 100 ms przy dodaniu elementu.
- Brak rejestracji ani kont – dane wyłącznie lokalnie.
- Kompatybilność: Chrome/Edge/Firefox (aktualne), Android (Chrome) – docelowo iOS Safari.
- Ochrona danych: wszystkie dane pozostają w urządzeniu użytkownika.

## 7. UI / UX

- Jedna kolumna, duże przyciski (min. 48 × 48 px), wyraźne etykiety.
- Slider lub przyciski +/- do zmiany ilości, aby ograniczyć użycie klawiatury.
- Konsekwentny zielony akcent (kojarzony z drewnem przyjaznym środowisku).
- Ikony (Heroicons / Phosphor) + tekst.
- Widok "Moje projekty" dostępny z docka na dole.
- Animacje minimalne (fade-in) – aby nie spowalniać.

> **Załącznik**: Makiety niskiej wierności (wireframes) – do przygotowania w Figma lub Excalidraw.

## 8. Architektura i technologia

- **Frontend**: Next.js 14 App Router (SSR + CSR + PWA).
- **Typowanie**: TypeScript.
- **Stylowanie**: Tailwind CSS (z pluginami dla formularzy) + CSS variables.
- **Stan**: React Context + zustand (lub `useState` w MVP).
- **Persistencja**: `localStorage` (uproszczona), fallback na IndexedDB przy większych danych.
- **Eksport obrazu**: `html-to-image` (npm), a następnie `navigator.share` (jeśli dostępne).

## 9. Zakres MVP (v1.0)

| ✅ / ⬜ | Funkcjonalność                                                 |
| ------- | -------------------------------------------------------------- |
| ✅      | Dodawanie elementów, kalkulacja, podsumowanie                  |
| ✅      | Zapis lokalny jednego projektu                                 |
| ✅      | Eksport jako PNG i ręczne udostępnienie (zapisywane w galerii) |
| ⬜      | Lista wielu projektów (roadmap v1.1)                           |
| ⬜      | Web Share API (roadmap v1.1)                                   |
| ⬜      | Dark mode (roadmap v1.2)                                       |

## 10. Roadmap / Milestones

| Sprint | Czas    | Zakres                                              |
| ------ | ------- | --------------------------------------------------- |
| 0      | 1 dzień | Setup repo, Tailwind, ESLint/Prettier, manifest PWA |
| 1      | 3 dni   | Formularz elementu + kalkulacja jednostkowa         |
| 2      | 3 dni   | Lista elementów, podsumowanie                       |
| 3      | 2 dni   | Zapis do `localStorage`, załadowanie przy starcie   |
| 4      | 2 dni   | Eksport PNG + testy na telefonie                    |
| 5      | 1 dzień | UX polish, dostępność, finalne testy                |
| —      | —       | **Release v1.0**                                    |

## 11. Kryteria akceptacji

1. **CA-1**: Wprowadzenie przykładu z opisu (belka 150 × 20 × 10 cm, 10 szt., cena 500 zł/m³) zwraca 0,3 m³ i 150 zł kosztu.
2. **CA-2**: Dodanie drugiego elementu aktualizuje sumę bez przeładowania strony.
3. **CA-3**: Po odświeżeniu przeglądarki projekt wczytuje się automatycznie.
4. **CA-4**: Obraz eksportu zawiera nagłówek "WoodCalc" oraz datę i sumę projektu.
5. **CA-5**: Aplikację można "zainstalować" jako PWA na Androidzie i otworzyć offline.

## 12. Mierniki sukcesu (KPI)

- Task Success Rate (testy z 3 stolarzami) ≥ 90 %.
- Czas wykonania pierwszego obliczenia ≤ 60 s.
- MAU ≥ 50 po 3 miesiącach.
- Średnia ocena użyteczności (SUS) ≥ 80 / 100.

## 13. Załączniki

- Wireframes (URL Figma)
- Lista komponentów UI z Tailwind
- Specyfikacja formuł obliczeniowych (poniżej)

---

### Formuła obliczeniowa (referencyjna)

```
objętość [m³] = (długość [cm] × szerokość [cm] × grubość [cm]) / 1 000 000 × ilość_sztuk
koszt [PLN]    = objętość [m³] × cena [PLN/m³]
```

---

Dzięki temu PRD możesz:

- skierować projekt do developera/designer'a,
- ocenić wysiłek vs. budżet,
- iterować i śledzić postępy.
