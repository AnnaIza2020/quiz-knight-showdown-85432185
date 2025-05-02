
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Rules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neon-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-4 border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft size={16} />
          </Button>
          <h1 className="text-4xl font-bold text-white">Zasady Gry</h1>
        </div>
        
        <div className="space-y-12">
          {/* Game Overview */}
          <Section title="Przegląd Teleturnieju">
            <p>
              Quiz Knight Showdown to interaktywny teleturniej składający się z 3 rund, podczas których 
              uczestnicy odpowiadają na pytania o różnym poziomie trudności i tematyce. Gra łączy wiedzę, refleks 
              i szczęście, oferując dynamiczne i angażujące doświadczenie.
            </p>
          </Section>
          
          {/* Round 1 */}
          <Section title="Runda 1: Zróżnicowana Wiedza z Polskiego Internetu" colorClass="text-neon-pink">
            <ul className="list-disc pl-6 space-y-2">
              <li>W rundzie bierze udział 10 graczy.</li>
              <li>Każdy gracz ma 100 HP (punktów życia) oraz możliwość zdobywania punktów.</li>
              <li>Pytania podzielone są na kategorie i poziomy trudności (5, 10, 15, 20 punktów).</li>
              <li>Za poprawną odpowiedź gracz otrzymuje punkty odpowiadające trudności pytania.</li>
              <li>Za błędną odpowiedź gracz traci 20 HP.</li>
              <li>Do rundy 2 przechodzi 5 graczy z najwyższą liczbą HP oraz 1 "lucky loser" (gracz z największą liczbą punktów spośród tych, którzy stracili wszystkie HP).</li>
            </ul>
          </Section>
          
          {/* Round 2 */}
          <Section title="Runda 2: 5 Sekund" colorClass="text-neon-blue">
            <ul className="list-disc pl-6 space-y-2">
              <li>W rundzie bierze udział 6 graczy.</li>
              <li>Każdy gracz otrzymuje 3 życia.</li>
              <li>Gracze kolejno otrzymują pytania i mają 5 sekund na odpowiedź.</li>
              <li>Za poprawną odpowiedź gracz otrzymuje punkty (zwykle 10).</li>
              <li>Za błędną odpowiedź lub brak odpowiedzi w czasie, gracz traci jedno życie.</li>
              <li>Utrata wszystkich żyć oznacza eliminację.</li>
              <li>Do rundy 3 przechodzi 3 graczy z największą liczbą żyć (w przypadku remisu decyduje liczba punktów).</li>
            </ul>
          </Section>
          
          {/* Round 3 */}
          <Section title="Runda 3: Koło Fortuny" colorClass="text-neon-purple">
            <ul className="list-disc pl-6 space-y-2">
              <li>W rundzie bierze udział 3 graczy.</li>
              <li>Gracze zachowują swoje pozostałe życia.</li>
              <li>Każdy gracz w swojej turze kręci Kołem Fortuny, które wyznacza kategorię pytania.</li>
              <li>Za poprawną odpowiedź gracz otrzymuje punkty (zwykle 15).</li>
              <li>Za błędną odpowiedź gracz traci jedno życie.</li>
              <li>Gra toczy się do momentu, gdy wszyscy gracze stracą wszystkie życia lub do wyznaczonej liczby rund.</li>
              <li>Zwycięzca to gracz z największą liczbą punktów na koniec rundy.</li>
            </ul>
          </Section>
          
          {/* Special Cards */}
          <Section title="Karty Specjalne" colorClass="text-neon-yellow">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Druga Szansa:</strong> Pozwala graczowi na ponowną próbę odpowiedzi w przypadku błędu.</li>
              <li><strong>Odbicie Pytania:</strong> Gracz może przekierować pytanie do innego uczestnika.</li>
              <li><strong>Podwójne Punkty:</strong> Zwiększa wartość punktową kolejnej poprawnej odpowiedzi gracza.</li>
              <li><strong>Ochrona:</strong> Chroni gracza przed utratą życia/HP przy jednej błędnej odpowiedzi.</li>
            </ul>
            <p className="mt-4 italic">
              Prowadzący może przydzielać karty specjalne według własnego uznania lub jako nagrody za określone osiągnięcia.
            </p>
          </Section>
          
          {/* Host Panel */}
          <Section title="Panel Prowadzącego">
            <p className="mb-4">
              Panel Prowadzącego pozwala na pełne zarządzanie przebiegiem gry, w tym:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wybór pytań i kategorii</li>
              <li>Przyznawanie i odejmowanie punktów</li>
              <li>Zarządzanie życiem graczy</li>
              <li>Przełączanie między rundami</li>
              <li>Przydzielanie kart specjalnych</li>
              <li>Wyświetlanie informacji o wynikach</li>
              <li>Sterowanie timerem</li>
            </ul>
          </Section>
          
          {/* OBS Integration */}
          <Section title="Integracja z OBS">
            <p>
              Nakładka OBS umożliwia integrację teleturnieju z transmisją na żywo. Wystarczy otworzyć stronę
              /overlay w przeglądarce i dodać ją jako źródło przeglądarki w OBS. Nakładka dynamicznie wyświetla
              wszystkie elementy gry, w tym kamery uczestników, pytania, timer oraz efekty specjalne.
            </p>
          </Section>
        </div>
        
        <div className="mt-12 pb-8 text-center">
          <Button onClick={() => navigate('/')} className="bg-neon-blue hover:bg-neon-blue/80">
            Wróć do strony głównej
          </Button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ 
  title, 
  colorClass = "text-neon-blue", 
  children 
}: { 
  title: string; 
  colorClass?: string; 
  children: React.ReactNode;
}) => (
  <section>
    <h2 className={`text-2xl font-bold mb-4 ${colorClass}`}>{title}</h2>
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-white/80">
      {children}
    </div>
  </section>
);

export default Rules;
