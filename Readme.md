Proponowana struktura README.md (Finalna dokumentacja projektu) 

1. Wprowadzenie 
1. Cel i Kluczowe Założenia 
1. Struktura aplikacji Overlay 

Panel Host 

Panel Gracza Panel Ustawień 

4. Przebieg Gry 

Runda 1 – Zróżnicowana Wiedza z Polskiego Internetu Runda 2 – 5 Sekund 

Runda 3 – Koło Fortuny 

5. System Kart Specjalnych Rodzaje kart 

   Zasady przyznawania System decków 

   Ikony kart i interfejsy 

6. System Punktów i Żyć 
7. Animacje, efekty dźwiękowe i wizualne 
7. Tryby i scenariusze awaryjne 
7. Panel ustawień – zarządzanie aplikacją bez kodowania 
7. Plany rozwoju / Pomysły na przyszłość 
7. Autor i licencja 

\> Discord Game Show 

Discord Game Show to innowacyjna aplikacja webowa, zaprojektowana z myślą o przekształceniu interakcji na platformach streamingowych (Twitch, YouTube) w dynamiczny, interaktywny teleturniej. 

Głównym celem jest stworzenie zabawnego, lekko chaotycznego i bardzo angażującego show na żywo, które dostarcza rozrywki zarówno prowadzącemu (hostowi), jak i widzom. Projekt stawia na wizualną atrakcyjność, płynne animacje, element zaskoczenia i strategiczne decyzje, czyniąc hosta centralnym „dyrygentem” widowiska. 

Kluczowe wrażenie: Dynamiczny, neonowy show na żywo, gdzie mieszają się wiedza, strategia (karty), refleks i szczęście (Koło Fortuny). 

Główna „magia”: Interaktywność, efekty wizualne, system kart specjalnych. 

Cel: Maksymalne zaangażowanie poprzez nieprzewidywalną i widowiskową rozgrywkę. 

3\. Struktura aplikacji overlay 

Overlay to nakładka wyświetlana na streamie Twitch, która pełni funkcję interaktywnego panelu pokazującego aktualny stan gry dla widzów. To właśnie tutaj widzowie mogą śledzić przebieg teleturnieju na żywo. 

Główne zadania: 

Wyświetlanie aktualnych pytań i kategorii w zależności od rundy, Pokazywanie wyników graczy i ich stanu (np. życia, punktów), 

Prezentacja aktywnego gracza oraz animacji koła fortuny w rundzie 3, 

Wyświetlanie kamer uczestników i hosta w odpowiednio podzielonych sekcjach ekranu (np. górny i dolny pasek kamer uczestników oraz środkowa część z kamerą hosta i pytaniami), 

Aktualizacja na żywo w oparciu o dane przesyłane z panelu hosta. 

Technologie: 

React.js (lub inna biblioteka frontendowa), 

Komunikacja w czasie rzeczywistym przez WebSocket lub inną technologię push, Stylizacja oparta o CSS (w projekcie używane są motywy neonowe i animacje). 

Struktura plików (przykładowa): 

overlay/index.js – główny komponent nakładki, 

overlay/components/PlayerCamera.js – komponent kamery pojedynczego gracza, overlay/components/QuestionBoard.js – komponent wyświetlający pytania i odpowiedzi, overlay/components/FortuneWheel.js – komponent koła fortuny, overlay/styles/overlay.css – stylowanie overlay. 

Panel Host 

Panel Host to centralne miejsce sterowania przebiegiem teleturnieju dla prowadzącego. Pozwala na zarządzanie grą, kontrolowanie rund, pytań, punktacji oraz interakcji z uczestnikami. 

Główne funkcje: 

Wyświetlanie listy graczy z ich aktualnym statusem (życia, punktów, kolejność odpowiedzi), Kontrola przechodzenia między rundami oraz kolejnych pytań, 

Możliwość wyboru aktywnego gracza, a także obsługa mechaniki lucky loser, 

Obsługa timerów na odpowiedzi, 

Uruchamianie animacji i efektów (np. koło fortuny, confetti), Podgląd i zarządzanie pytaniami (np. pomijanie, powtórki), Wysyłanie poleceń i aktualizacji do overlay (nakładki na stream). 

Technologie: 

React.js do budowy interfejsu użytkownika, 

WebSocket lub inna komunikacja w czasie rzeczywistym między panelem a overlay, Możliwość integracji z backendem lub bazą danych do pobierania i zapisywania stanu gry. 

Struktura plików (przykładowa): 

host/index.js – główny komponent panelu hosta, host/components/PlayerList.js – lista i statusy graczy, host/components/QuestionControl.js – zarządzanie pytaniami i rundami, host/components/Timer.js – komponent timera, 

host/styles/host.css – stylizacja panelu hosta. 

\--- 

Panel Gracza 

Panel gracza to pomocniczy interfejs dla uczestników teleturnieju, służący do podglądu przebiegu gry i synchronizacji z overlayem widocznym na streamie. Gracze nie udzielają odpowiedzi przez ten panel — odpowiedzi są wypowiadane głosowo na żywo (np. przez Discord lub Twitch). 

Funkcjonalności: 

Podgląd aktualnego pytania (dla orientacji gracza). 

Informacje o stanie gracza: nazwa, liczba punktów, liczba żyć, posiadane karty specjalne. 

Komunikaty informacyjne: poprawna/niepoprawna odpowiedź, czas na odpowiedź, eliminacja itd. 

Synchronizacja z panelem hosta i overlayem w czasie rzeczywistym. 

Responsywny, przejrzysty interfejs działający na komputerze i telefonie. 

Każdy gracz otrzymuje swój indywidualny link do panelu — dzięki temu dane są przypisane do konkretnej osoby. 

\--- 

Technologie 

Panel został zbudowany z użyciem: 

React.js (Next.js) – logika interfejsu 

Socket.IO – przesyłanie danych w czasie rzeczywistym Tailwind CSS – nowoczesna, responsywna stylizacja Vercel – hosting (w razie potrzeby) 

\--- 

Struktura plików 

player/ 

├── index.js                       // Główny komponent panelu gracza ├── components/ 

│   ├── PlayerStatus.js            // Nick, punkty, życia, karty 

│   ├── QuestionPreview.js         // Podgląd aktualnego pytania │   ├── FeedbackDisplay.js         // Komunikaty (np. eliminacja) ├── styles/ 

│   └── player.css                 // Stylizacja 3. Struktura aplikacji → Panel Ustawień 

Panel Ustawień to centrum zarządzania i konfiguracji gry, dostępne dla prowadzącego. Składa się z kilku zakładek, które pozwalają na pełną kontrolę nad rozgrywką, wyglądem oraz integracjami. 

Zakładki panelu ustawień: 

1. Gracze 

Zarządzanie uczestnikami: dodawanie, edycja, usuwanie graczy oraz generowanie linków do ich indywidualnych paneli. 

2. Pytania 

Tworzenie i zarządzanie bazą pytań przypisanych do poszczególnych rund i kategorii. Obsługa importu, eksportu oraz filtrowania. 

3. Wygląd 

Personalizacja wyglądu aplikacji: kolory, czcionki, logo, animacje oraz dźwięki. 

4. Ogólne 

Globalne ustawienia gry, takie jak nazwa, tryb rozgrywki, czas odpowiedzi, zasady „Lucky Losera” i inne parametry wpływające na logikę teleturnieju. 

5. Rundy 

Konfiguracja poszczególnych rund: ich kolejności, parametrów (np. liczba pytań, limit czasowy), zasad i ewentualnych bonusów. 

6. Karty Specjalne 

Zarządzanie kartami specjalnymi dostępnymi podczas gry: dodawanie nowych kart, definiowanie ich efektów, zasad użycia oraz grafik. 

7. Automatyzacje & Integracje 

Ustawienia automatycznych akcji i integracji z serwisami zewnętrznymi, takimi jak Discord, Twitch, czy inne platformy streamingowe i komunikacyjne. 

8. Pasek Informacyjny 

Konfiguracja informacji i alertów wyświetlanych prowadzącemu podczas rozgrywki, które ułatwiają zarządzanie przebiegiem gry. 

9. Backup / Import-Export 

Narzędzia do eksportu i importu konfiguracji gry, pytań, wyników i ustawień, służące do zabezpieczania i przenoszenia danych. 

10. Zaawansowane 

Opcje techniczne i eksperymentalne funkcje przeznaczone dla zaawansowanych użytkowników i deweloperów. 

11. Testy / Diagnostyka 

Narzędzia do testowania aplikacji: sprawdzanie animacji, dźwięków, działania integracji oraz poprawności funkcji. 

12. Statystyki / Raporty 

Podsumowania rozgrywek, raporty wyników, analiza skuteczności graczy i statystyki gry. 

13. Dodaj nowe karty 

Dedykowana zakładka umożliwiająca tworzenie nowych kart specjalnych z pełną kontrolą nad logiką, mechaniką działania i zasadami otrzymywania kart. 

1. Runda 1 – Zróżnicowana Wiedza z Polskiego Internetu (Eliminacje) 
* Cel: Wyłonienie 5 graczy z najwyższym procentem życia. Dodatkowo, 1 gracz z 

największą liczbą punktów wśród wyeliminowanych (o ile zdobył minimum 25 punktów, wartość konfigurowalna w Panelu Ustawień) kwalifikuje się jako "Lucky Loser" i również przechodzi do kolejnej rundy. 

* Liczba Graczy: Runda startuje z 10 graczami. 
* Układ Wizualny Overlayu (Stały): Overlay jest podzielony na 3 równe poziome obszary o 

wysokości 360px każdy: 

* Górny Obszar (360px): Wyświetla 5 okienek wideo uczestników (maks. 384px szer. x 

360px wys.), ułożonych poziomo. Każde okienko zawiera: nick uczestnika, avatar, procentowy wskaźnik życia (aktualizowany na żywo) oraz aktualną liczbę punktów gracza (aktualizowaną na żywo). 

* Środkowy Obszar (360px): Lewa strona zawiera okienko wideo prowadzącego (maks. 

384px szer. x 360px wys.). Środek to komponent wyświetlający treść pytania (i warianty odpowiedzi A, B, C, D, jeśli dotyczy). Prawa strona prezentuje tabelę z kategoriami pytań: "Pytania Pułapki", "Memy", "Virale/Easter Eggi", "YouTube", "Gry i Gaming", "Top Roku", "Wiedza Ogólna". 

* Dolny Obszar (360px): Wyświetla pozostałe 5 okienek wideo uczestników (maks. 384px 

szer. x 360px wys.), ułożonych poziomo. Każde okienko zawiera: nick uczestnika, avatar, procentowy wskaźnik życia (aktualizowany na żywo) oraz aktualną liczbę punktów gracza (aktualizowaną na żywo). 

* Życie i Punkty: 
  * Każdy gracz rozpoczyna rundę ze 100% życia i 0 punktów. 
  * Punkty za poprawną odpowiedź: Są przyznawane w zależności od trudności pytania 

wybranej przez gracza: 

* 5 punktów 
* 10 punktów 
* 15 punktów 
* 20 punktów 
* Utrata życia za błędną odpowiedź lub brak odpowiedzi w wyznaczonym czasie: 
  * Pytania za 5 i 10 punktów: -10% życia. 
  * Pytania za 15 i 20 punktów: -20% życia. 
* Mechanika Rozgrywki: 
* Wybór Pytania: Gracze odpowiadają po kolei. Aktualnie odpowiadający gracz słownie 

podaje hostowi wybraną kategorię i poziom trudności (punktację) pytania. 

* Akcja Hosta: Host zaznacza wybraną kategorię i punktację w swoim panelu.  
* Losowanie i Wyświetlenie Pytania: System losuje pytanie z bazy danych, uwzględniając 

podaną kategorię i trudność. Pytania są oznaczane jako użyte. Po wylosowaniu, odpowiednia komórka w tabeli kategorii na overlayu podświetla się. Wylosowane pytanie wyświetla się w panelu hosta i na overlayu (w środkowym obszarze). 

* Logika Wariantów Odpowiedzi: 
  * Pytania za 5 punktów: Nie posiadają wariantów odpowiedzi. 
  * Pytania za 10 punktów: Posiadają 3 warianty odpowiedzi. 
  * Pytania za 15 i 20 punktów: Posiadają 4 warianty odpowiedzi. 
* Timer Odpowiedzi: Host uruchamia 30-sekundowy timer. Czas jest widoczny na overlayu i panelach graczy. 
* Odpowiedź Gracza: Gracz udziela odpowiedzi głosowo. 
* Ocena Hosta: Po upływie czasu lub udzieleniu odpowiedzi, host ocenia odpowiedź w 

  panelu hosta: 

* Poprawna odpowiedź: Host klika "Poprawna odpowiedź", gracz otrzymuje punkty za 

pytanie, a jego kamera na overlayu podświetla się na zielono. 

* Błędna odpowiedź: Host klika "Błędna odpowiedź", gracz traci odpowiedni procent 

życia, a jego kamera na overlayu podświetla się na czerwono. Brak odpowiedzi w czasie również skutkuje uznaniem odpowiedzi za błędną. 

* Eliminacja: Gracz, którego procent życia spadnie do 0%, zostaje wyeliminowany z gry, a 

jego okienko wideo na overlayu staje się wyszarzone. 

* Koniec Rundy 1: Runda kończy się, gdy 5 graczy zostanie wyeliminowanych (osiągnie 0% 

życia). 

* Kwalifikacja do Rundy 2: Do Rundy 2 przechodzi 5 graczy z najwyższym procentem życia 

oraz 1 "Lucky Loser" (gracz z największą liczbą punktów spośród wyeliminowanych, który zdobył co najmniej 25 punktów). 

2. Runda 2 – Szybka Odpowiedź 
* Cel: Test refleksu i wiedzy w szybkim tempie. Celem rundy jest wyłonienie 3 finalistów, 

którzy przejdą do Rundy 3. 

* Liczba Graczy: Runda rozpoczyna się z 6 graczami (5 wykwalifikowanych z Rundy 1 + 1 

Lucky Loser). Na overlayu wyświetla się 3 graczy w górnej części i 3 w dolnej. 

* Układ Wizualny Overlayu (Adaptacja z Rundy 1, ale tylko 6 graczy i brak tabeli kategorii): 

Overlay adaptuje układ z Rundy 1, ale z widocznymi tylko 6 okienkami graczy i bez tabeli kategorii pytań (środkowy obszar zawiera tylko okienko hosta pole pytania i timer- zamiast tabeli pytań). 

* Życie i Punkty: 
  * Każdy gracz rozpoczyna rundę ze 100% życia (stan życia jest resetowany na początku 

rundy). Punkty zdobyte w Rundzie 1 są zachowane i sumowane. 

* Punkty za poprawną odpowiedź: +15 punktów (wartość konfigurowalna w Panelu 

Ustawień). 

* Utrata życia za błędną odpowiedź lub brak odpowiedzi w wyznaczonym czasie: -20% 

życia. 

* Mechanika Rozgrywki: 
* Wyświetlenie Pytania: System losuje pytanie (Runda 2 wykorzystuje pytania bez 

wariantów odpowiedzi) i host klika przycisk "Nowe Pytanie" w panelu hosta. Pytanie jest wyświetlane jednocześnie na overlayu 

* Timer Odpowiedzi: Host uruchamia timer. Gracze mają 5 sekund na udzielenie 

odpowiedzi (głosowo). Timer jest widoczny na overlayu i panelach graczy. 

* Szybka Ocena Hosta: Po upływie czasu lub udzieleniu odpowiedzi host szybko ocenia 

odpowiedź gracza w panelu hosta: 

* Poprawna odpowiedź: Host klika "Poprawna odpowiedź", gracz otrzymuje 15 punktów, 

a jego kamera na overlayu podświetla się na zielono. 

* Błędna odpowiedź: Host klika "Błędna odpowiedź", gracz traci 20% życia, a jego 

kamera na overlayu podświetla się na czerwono. Brak odpowiedzi w czasie również skutkuje uznaniem odpowiedzi za błędną. 

* Eliminacja: Gracz, którego procent życia spadnie do 0%, zostaje wyeliminowany z gry, a 

jego okienko wideo na overlayu staje się wyszarzone. 

* Koniec Rundy 2: Runda kończy się, gdy w grze pozostaje 3 graczy z życiem większym niż 

0%. Ci gracze kwalifikują się do Finałowej Rundy 3. 

3. Runda 3 – Koło Fortuny 
* Cel: Połączenie szczęścia z wiedzą w celu wyłonienia ostatecznego zwycięzcy 

teleturnieju. W rundzie zostaje tylko jeden gracz. 

* Liczba Graczy: Runda rozpoczyna się z 3 finalistami (kwalifikacja z Rundy 2). Ich okienka 

wideo są wyświetlane w górnej części overlayu. 

* Układ Wizualny Overlayu (Koło Fortuny): Overlay skupia się na prezentacji "Koła Fortuny" 

w centralnej części ekranu, obok okienka wideo hosta i pola pytania. Okienka graczy pozostają widoczne w górnej części. 

* Życie i Punkty: 
  * Każdy gracz rozpoczyna rundę ze 100% życia (stan życia jest resetowany na początku 

rundy). Punkty zdobyte w poprzednich rundach są zachowane i sumowane. 

* Prawidłowa odpowiedź: +25 punktów (wartość konfigurowalna w Panelu Ustawień). 
* Błędna odpowiedź lub brak odpowiedzi w wyznaczonym czasie: -25% życia. 
* Kategorie Koła Fortuny: 
  * Koło fortuny zawiera od minimum 6 do maksymalnie 10 kategorii (konfigurowalne w 

Panelu Ustawień). 

* Pytania dla Rundy 3 są przypisane do tych kategorii. 
* Mechanika Rozgrywki: 
  * Zakręcenie Kołem: Host klika przycisk "Zakręć Kołem" w panelu hosta, co uruchamia 

animację Koła Fortuny na overlayu. 

* Losowanie Kategorii: System losuje jedną z kategorii z Koła Fortuny. Wylosowana 

kategoria jest wyświetlana na overlayu. 

* Losowanie/Wybór Pytania: System losuje pytanie z bazy danych, należące do 

wylosowanej kategorii.  

* Wyświetlenie Pytania: Host klika "Wyświetl pytanie" w panelu hosta. Pytanie jest 

wyświetlane na overlayu i panelach graczy. 

* Timer Odpowiedzi: Host uruchamia 30-sekundowy timer. Czas jest widoczny na overlayu 

i panelach graczy. 

* Odpowiedź Gracza: Aktualnie odpowiadający gracz udziela odpowiedzi głosowo. 
* Ocena Hosta: Po upływie czasu lub udzieleniu odpowiedzi, host ocenia odpowiedź 

gracza w panelu hosta: 

* Poprawna odpowiedź: Host klika "Poprawna odpowiedź", gracz otrzymuje 25 punktów, 

a jego kamera na overlayu podświetla się na zielono. 

* Błędna odpowiedź: Host klika "Błędna odpowiedź", gracz traci 25% życia, a jego 

kamera na overlayu podświetla się na czerwono. Brak odpowiedzi w czasie również skutkuje uznaniem odpowiedzi za błędną. 

* Eliminacja: Gracz, którego procent życia spadnie do 0%, zostaje wyeliminowany z gry, a 

jego okienko wideo na overlayu staje się wyszarzone. 

* Koniec Rundy 3: Gra trwa, aż zostanie tylko 1 gracz z życiem większym niż 0%. Ten gracz 

zostaje zwycięzcą Discord Game Show. 

5. System Kart Specjalnych 

System Kart Specjalnych wprowadza do gry element strategii i nieprzewidywalności, umożliwiając graczom wpływanie na przebieg rozgrywki. Karty są zawsze losowe i mogą być używane do obrony, ataku, manipulacji wynikami lub zdobywania przewagi, czyniąc każdą rundę bardziej dynamiczną i strategiczną. 

1. Rodzaje Kart 

Każda karta jest jednorazowego użytku (zużywana po aktywacji), ale gracz może posiadać kilka egzemplarzy tej samej karty, jeśli zostaną mu przyznane wielokrotnie (maksymalnie 3 karty jednocześnie). 

Wszystkie rodzaje kart mogą być używane w każdej rundzie. 

Kontra: „Po usłyszeniu pytania, użyj tej karty, aby 'skontrować' i wskazać innego uczestnika, który musi odpowiedzieć. Jeśli on się pomyli, Ty dostajesz punkty.” Host zatwierdza wybór gracza, którego karta dotyczy. 

Przykładowe karty (z efektami wizualnymi i dźwiękowymi) są takie jak w Twoim opisie: Dejavu, Kontra, Reanimacja, Skip, Turbo, Refleks 2, Refleks 3, Lustro, Oświecenie. 

2. Zasady Przyznawania Kart 

Karty przyznawane są automatycznie, od razu po spełnieniu warunków. Sposoby zdobywania kart: 

3 poprawne odpowiedzi z rzędu (w dowolnej rundzie). 

Zdobycie 50, 100, 200 punktów w rundzie. 

Ukończenie rundy bez utraty życia. 

Najwięcej punktów w Rundzie 1 i Rundzie 2 (oddzielnie). 

Po przejściu Rundy 1 i Rundy 2 — każdemu po jednej karcie. 

„Na Ratunek” — po Rundzie 1 losowa karta dla gracza z najmniejszą liczbą punktów spośród tych, którzy przeszli do Rundy 2. 

„Ratunek” — po Rundzie 2 losowa karta dla gracza z najmniejszą liczbą punktów spośród tych, którzy przeszli do Rundy 3. 

Karty można zdobywać w każdej rundzie. 

3. System Decków (Posiadania Kart) 

Każdy gracz posiada swój indywidualny zestaw kart („deck”), widoczny tylko dla niego oraz dla hosta w panelu zarządzania graczami. 

Maksymalna liczba kart w ręce to 3. Jeśli gracz ma już 3 karty, nowe nie są dodawane, dopóki gracz nie użyje lub nie odrzuci którejś z posiadanych kart. 

Karty można użyć tylko w swojej kolejce. Po użyciu karta jest usuwana z decku. 

Karty nie są widoczne na overlayu dla innych uczestników ani widzów — chroni to strategię gracza. 

4. Ikony Kart i Interfejsy 

Każdy rodzaj karty ma unikalną ikonę, widoczną w panelu gracza oraz w panelu hosta przy jego okienku. 

W panelu gracza ikony są w specjalnych slotach (max 3), po najechaniu kursorem pokazuje się krótki opis działania karty. 

Przycisk „Użyj Karty” aktywuje efekt, który jest automatycznie egzekwowany przez system. 

Jeśli użycie karty wymaga reakcji hosta (np. Kontra), system wyświetla hostowi monit z możliwością zatwierdzenia lub odrzucenia. 

Host może też cofnąć użycie karty w razie pomyłki (funkcja „Cofnij Użycie Karty”). 

Po użyciu karty na overlayu pojawia się animacja karty z efektem wizualnym i dźwiękowym, a na pasku informacyjnym komunikat: 

„Gracz (nick) użył karty (nazwa karty)” 

Ikony kart mają neonowy glow (#FF3E9D) po najechaniu, podkreślający interaktywność i estetykę gry. 

6. System Punktów i Żyć 

System punktów i życia jest podstawą do śledzenia postępów graczy, oceny ich wyników oraz mechaniki eliminacji w Discord Game Show. Oba wskaźniki są dynamicznie aktualizowane w czasie rzeczywistym i widoczne dla hosta, graczy oraz na overlayu streamu. 

1. Życie Graczy (Procentowy Wskaźnik Życia) 

Początkowa wartość: Każdy gracz rozpoczyna każdą rundę z 100% życia. Wartość życia jest resetowana na początku każdej rundy. 

Wizualizacja: Życie jest prezentowane jako procentowy wskaźnik oraz pasek postępu obok avatara gracza na overlayu, w panelu hosta oraz w panelach graczy. Wartość życia przechowywana jest jako liczba całkowita od 0 do 100. 

Utrata życia za błędną odpowiedź lub brak odpowiedzi: Runda 1: 

Pytania warte 5 lub 10 punktów — utrata 10% życia. Pytania warte 15 lub 20 punktów — utrata 20% życia. 

Runda 2: utrata 20% życia. Runda 3: utrata 25% życia. 

Eliminacja: Gracz zostaje wyeliminowany z gry, gdy jego życie spadnie do 0%. Jego okienko wideo na overlayu zostaje wyszarzone. 

Manualna korekta: Panel hosta umożliwia ręczne dodawanie lub odejmowanie procentów życia graczom w przypadku awarii systemu lub potrzeby interwencji prowadzącego. 

2. Punkty Graczy 

Początkowa wartość: Każdy gracz rozpoczyna Rundę 1 z 0 punktów. 

Sumowanie punktów: Punkty zdobyte przez graczy sumują się przez wszystkie trzy rundy. Zdobywanie punktów za poprawną odpowiedź: 

Runda 1: punkty przyznawane są w zależności od trudności pytania wybranej przez gracza: 5, 10, 15 lub 20 punktów. 

Runda 2: +15 punktów (wartość konfigurowalna w panelu ustawień). Runda 3: +25 punktów (wartość konfigurowalna w panelu ustawień). 

Wizualizacja: Punkty gracza wyświetlane są w czasie rzeczywistym obok jego avatara na overlayu, w panelu hosta oraz w panelach graczy. 

Manualna korekta: Panel hosta pozwala na ręczne dodawanie punktów graczom w razie potrzeby. 

Rola w Lucky Loserze: W Rundzie 1 punkty mają kluczowe znaczenie przy wyłonieniu „Lucky Losera” spośród wyeliminowanych graczy, wymagając minimalnej liczby punktów (np. 25 — wartość konfigurowalna). 

3. Powiadomienia Systemowe 

Za każdym razem, gdy gracz traci życie lub zdobywa punkty, na pasku informacyjnym overlaya pojawia się komunikat informujący o zdarzeniu. Przykładowe komunikaty: 

„Gracz (nick) stracił 20% życia.” „Gracz (nick) zdobył 15 punktów.” „Gracz (nick) został wyeliminowany.” „Gracz (nick) użył karty (nazwa karty).” 

Powiadomienia te służą do informowania wszystkich uczestników i widzów o aktualnej sytuacji w grze oraz zapewniają przejrzystość przebiegu rozgrywki. 

7. Animacje, efekty dźwiękowe i wizualne 
1. Animacje 

Na overlayu podczas użycia kart specjalnych wyświetlane są animacje kart, które podkreślają akcję gracza. 

Animacje towarzyszą także ważnym momentom gry, takim jak eliminacja gracza (wyszarzenie okienka wideo), zdobycie punktów czy wyłonienie Lucky Losera. 

Koło Fortuny w Rundzie 3 posiada płynne animacje obracania i zatrzymywania się na danej kategorii. 

2. Efekty dźwiękowe 

Każda runda ma dedykowany podkład dźwiękowy, który podkreśla dynamikę rozgrywki. 

Specjalne dźwięki pojawiają się przy poprawnych odpowiedziach, błędach, użyciu kart, eliminacjach oraz ogłoszeniu zwycięzcy. 

Host i gracze otrzymują wyraźne sygnały dźwiękowe, które pomagają śledzić przebieg gry bez konieczności ciągłego patrzenia na ekran. 

3. Efekty wizualne i powiadomienia systemowe 

Na pasku informacyjnym overlaya wyświetlane są tekstowe komunikaty, takie jak: „Gracz [nick] użył karty [nazwa karty]” 

„Gracz [nick] został wyeliminowany” 

„Lucky Loser [nick] wraca do gry” 

Efekty wizualne, takie jak podświetlenia i konfetti, pojawiają się przy ważnych momentach, np. przy zdobyciu punktów lub ogłoszeniu zwycięzcy. 

Wszystkie efekty są zsynchronizowane i automatycznie sterowane przez system, co minimalizuje potrzebę manualnej interwencji hosta. 

8. Tryby i scenariusze awaryjne 
1. Automatyczna eliminacja i wyłanianie Lucky Losera 

System automatycznie eliminuje graczy, których poziom życia spadnie do 0%. 

W Rundzie 1 spośród wyeliminowanych graczy system wybiera Lucky Losera na podstawie najwyższej liczby punktów powyżej ustawionego progu konfigurowalnego przez hosta. 

Jeśli żaden z wyeliminowanych graczy nie spełnia kryteriów Lucky Losera, system umożliwia hostowi ręczny wybór Lucky Losera. 

2. Obsługa przerw w łączności i powrotów graczy 

W przypadku utraty połączenia status gracza zmienia się na „nieaktywny”, a jego okienko wideo na overlayu jest wyszarzone. 

Gracz może powrócić do gry, wchodząc ponownie na ten sam link. 

Host ma możliwość manualnego przywrócenia gracza do rozgrywki lub trwałego wyeliminowania go poprzez panel hosta. 

3. Manualna korekta punktów i życia 

Host ma dostęp do funkcji ręcznego dodawania lub odejmowania punktów oraz procentowego życia graczom, co umożliwia szybkie reagowanie na awarie systemu lub błędy. 

Funkcjonalność ta pozwala na elastyczne zarządzanie przebiegiem gry i interwencję prowadzącego w razie potrzeby. 

4. Przerywanie i wznawianie gry 

Host może w każdej chwili zatrzymać rozgrywkę w celu przerwy technicznej lub organizacyjnej. 

Po wznowieniu gra kontynuuje się z zachowaniem aktualnych punktów, poziomu życia i statusów wszystkich graczy. 

5. Tryb awaryjny panelu hosta 

W przypadku problemów z panelem hosta możliwe jest przełączenie do uproszczonego trybu zarządzania, który pozwala na podstawowe operacje: korektę punktów, eliminacje oraz przywracanie graczy. 

Ten tryb zapewnia kontynuację rozgrywki do czasu przywrócenia pełnej funkcjonalności panelu. 

9. Panel ustawień – zarządzanie aplikacją bez kodowania 
1. Dostęp i cel panelu ustawień 

Panel ustawień jest dostępny dla hosta i umożliwia konfigurację kluczowych parametrów gry bez konieczności modyfikowania kodu źródłowego. 

Pozwala na szybkie dostosowanie rozgrywki do potrzeb i charakteru eventu. 

2. Kluczowe opcje konfiguracyjne 

Parametry rund: ustawienie punktów przyznawanych w rundach 2 i 3, czasów odpowiedzi, liczby życia itp. 

Próg punktowy Lucky Losera: definiowanie minimalnej liczby punktów, które musi osiągnąć wyeliminowany gracz, aby móc zostać Lucky Loserem. 

Zarządzanie kartami specjalnymi: konfiguracja częstotliwości przyznawania kart, limitu kart na ręce, włączanie lub wyłączanie określonych typów kart. 

Wygląd i branding: możliwość zmiany kolorystyki interfejsu, dodania własnego logo, ustawienia tła oraz innych elementów graficznych overlayu. 

Dźwięki i animacje: włączanie lub wyłączanie efektów dźwiękowych i wizualnych oraz ich poziomu głośności. 

3. Panel hosta – zarządzanie graczami i grą 

Monitorowanie aktualnych punktów i poziomu życia wszystkich graczy w czasie rzeczywistym. 

Ręczne korekty punktów i życia oraz możliwość eliminacji lub przywrócenia gracza do gry. Podgląd i kontrola kart specjalnych posiadanych przez każdego gracza. 

Możliwość wywołania animacji kart oraz innych efektów bezpośrednio z panelu. 

4. Interfejs przyjazny użytkownikowi 

Panel zaprojektowany jest w sposób intuicyjny, z klarownym układem i opisami opcji. Wszystkie zmiany są natychmiast widoczne na overlayu i w panelach graczy oraz hosta. 

5. Bezpieczeństwo i stabilność 

Zmiany ustawień mogą być cofane lub resetowane do domyślnych. 

System automatycznie zapisuje konfigurację, co pozwala na szybkie wznowienie gry po przerwach. 

10. Plany rozwoju / Pomysły na przyszłość 
1. Rozszerzenie funkcjonalności kart specjalnych 

Dodanie nowych unikalnych kart z różnorodnymi efektami, np. wymiana kart między graczami, dodatkowe życie czy zmiana kolejności pytań. 

Implementacja systemu handlu lub wymiany kart między uczestnikami. 

2. Personalizacja overlayu i interfejsu 

Możliwość tworzenia własnych motywów kolorystycznych i układów kamer. Dodanie wsparcia dla personalizacji nazw, avatarów oraz animacji. 

3. Rozbudowa trybów gry 

Wprowadzenie nowych rund i formatów quizu, np. rund drużynowych, rund szybkich odpowiedzi, rund z podpowiedziami. 

Dodanie trybu turniejowego z eliminacjami i rankingiem. 

4. Integracja z platformami streamingowymi 

Ulepszenie synchronizacji z Twitch, YouTube oraz Discord, aby automatycznie zarządzać uczestnikami i czatem. 

Powiadomienia o wynikach i postępach w czacie na żywo. 

5. System statystyk i analityki 

Szczegółowe raporty po każdej rozgrywce: czas odpowiedzi, skuteczność graczy, najczęściej pojawiające się pytania. 

Możliwość eksportu statystyk do plików CSV lub integracji z narzędziami analitycznymi. 

6. Usprawnienia techniczne i stabilność 

Optymalizacja wydajności aplikacji dla lepszego działania na różnych urządzeniach i łączach internetowych. 

Automatyczne zapisywanie stanu gry, by umożliwić wznowienie po awarii. 

11. Autor i licencja 
1. Autor 

Projekt Discord Game Show został stworzony i jest rozwijany przez mala\_xd 

2. Licencja 

Projekt jest własnością autorską autora i nie jest udostępniany do użytku komercyjnego ani modyfikacji bez wyraźnej zgody autora. 

Wszelkie prawa zastrzeżone. 
