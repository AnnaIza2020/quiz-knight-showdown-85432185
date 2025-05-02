
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Rules = () => {
  return (
    <div className="min-h-screen bg-neon-background p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-neon-blue hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Powrót do strony głównej</span>
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-[#4DF73B]">Discord </span>
          <span className="text-[#4BDFED]">Game </span>
          <span className="text-[#F25D94]">Show</span>
          <span className="text-white"> - Zasady Gry</span>
        </h1>
        
        <div className="space-y-10">
          <RoundSection 
            title="Runda 1: Zróżnicowana wiedza z polskiego internetu"
            description="W tej rundzie gracze odpowiadają na pytania z różnych kategorii związanych z polskim internetem, streamingiem i grami."
            rules={[
              "Na koniec rundy 5 graczy z najwyższą liczbą punktów przechodzi do kolejnej rundy.",
              "Zostaje także wyłoniony jeden „lucky loser" – gracz z najwyższymi punktami spośród tych, którzy stracili życie.",
              "Do Rundy 2 przechodzi łącznie 6 graczy: 5 najlepszych plus 1 lucky loser.",
              "Za poprawną odpowiedź gracz otrzymuje punkty odpowiadające poziomowi trudności pytania.",
              "Za błędną odpowiedź gracz traci życie.",
            ]}
          />
          
          <RoundSection 
            title="Runda 2: Wyzwania i wiedza"
            description="W drugiej rundzie tempo gry przyspiesza. Pytania są trudniejsze, a czas na odpowiedź krótszy."
            rules={[
              "Punkty i życia są przywracane na początku rundy.",
              "Za błędną odpowiedź gracz traci życie.",
              "Gracz, który straci wszystkie życia, zostaje wyeliminowany z gry.",
              "Do Rundy 3 przechodzą gracze, którzy zachowali przynajmniej jedno życie.",
            ]}
          />
          
          <RoundSection 
            title="Runda 3: Koło Chaosu (finał)"
            description="W rundzie finałowej gracze odpowiadają na pytania losowane przez Koło Chaosu."
            rules={[
              "Koło fortuny losuje kategorie pytań, takie jak: Zwykłe pytanie, Pytanie-pułapka, Youtuber po emoji, Youtuber po zdjęciu z dzieciństwa.",
              "Runda kończy się, gdy wszyscy gracze stracą życie.",
              "Gracz z największą liczbą punktów na koniec zostaje zwycięzcą.",
            ]}
          />
        </div>
      </div>
    </div>
  );
};

interface RoundSectionProps {
  title: string;
  description: string;
  rules: string[];
}

const RoundSection = ({ title, description, rules }: RoundSectionProps) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      <p className="text-gray-300 mb-4">{description}</p>
      <h3 className="text-lg font-semibold mb-2">Zasady:</h3>
      <ul className="list-disc pl-5 space-y-2">
        {rules.map((rule, index) => (
          <li key={index} className="text-gray-200">{rule}</li>
        ))}
      </ul>
    </div>
  );
};

export default Rules;
