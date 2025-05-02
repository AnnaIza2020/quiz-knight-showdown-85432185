
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
          <Section title="Zasady Discord Game Show">
            <p className="mb-6">
              Discord Game Show to interaktywny teleturniej łączący wiedzę o polskim internecie, 
              refleks i szczęście w dynamicznym i angażującym doświadczeniu.
            </p>
          </Section>
          
          {/* Round 1 */}
          <Section title="Runda 1 – Zróżnicowana Wiedza z Polskiego Internetu" colorClass="text-neon-pink">
            <p className="mb-4">
              Gracze mają na start 100% życia (HP). Odpowiadają na pytania z 6 kategorii:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pytania pułapki</li>
              <li>Memy, Virale i Easter Eggi</li>
              <li>Top roku</li>
              <li>Internet i YouTube</li>
              <li>Gry i gaming</li>
              <li>Wiedza ogólna</li>
            </ul>
            <p className="mt-4">
              Za błędną odpowiedź tracą % życia. Do rundy 2 przechodzi 5 graczy z najwyższym procentem życia oraz 1 lucky loser.
            </p>
          </Section>
          
          {/* Round 2 */}
          <Section title="Runda 2 – Runda 5 sekund" colorClass="text-neon-blue">
            <p>
              Gracze mają 5 sekund na podanie 3 poprawnych przykładów w zadanej kategorii.
              Nieudane próby kosztują życie.
              Do finału przechodzi 3 najlepszych graczy.
            </p>
          </Section>
          
          {/* Round 3 */}
          <Section title="Runda 3 – Koło Fortuny" colorClass="text-neon-purple">
            <p className="mb-4">
              Koło losuje kategorię i typ pytania (quiz, zagadka, kalambury wizualne itp.). Kategorie to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Język polskiego internetu</li>
              <li>Polska scena Twitcha</li>
              <li>Zagadki</li>
              <li>Czy jesteś mądrzejszy od 8-klasisty</li>
              <li>Gry, które podbiły Polskę</li>
              <li>Technologie i internet w Polsce</li>
            </ul>
            <p className="mt-4">
              Walka o punkty i zwycięstwo opiera się na wiedzy i odrobinie szczęścia.
            </p>
          </Section>
          
          {/* Special Cards */}
          <Section title="Karty specjalne" colorClass="text-neon-yellow">
            <p className="mb-4">
              Gracze mogą zdobywać specjalne karty, np.:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Druga szansa</li>
              <li>Odbicie pytania</li>
              <li>Zamiana pytania</li>
            </ul>
            <p className="mt-4 italic">
              i inne, które mogą odmienić losy gry.
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
