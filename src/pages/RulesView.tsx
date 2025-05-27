
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NeonButton from '@/components/common/NeonButton';

const RulesView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C0C13] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Powrót do menu
          </button>
          <h1 className="text-4xl font-bold text-[#00FFA3]">Zasady Gry</h1>
        </div>

        {/* Rules content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Przegląd Gry</h2>
            <p className="text-gray-300 leading-relaxed">
              Discord Game Show to interaktywny teleturniej składający się z trzech rund eliminacyjnych. 
              Gracze rywalizują odpowiadając na pytania z różnych kategorii, używając specjalnych kart 
              i zarządzając swoim życiem oraz punktami.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Runda 1 - Eliminacje</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Gracze:</strong> 10 uczestników</li>
                <li>• <strong>Życie:</strong> Każdy zaczyna ze 100% życia</li>
                <li>• <strong>Punkty:</strong> 5, 10, 15, 20 punktów za poprawne odpowiedzi</li>
                <li>• <strong>Kary:</strong> -10% życia (łatwe/średnie), -20% życia (trudne/eksperckie)</li>
                <li>• <strong>Kwalifikacja:</strong> 5 graczy z najwyższym życiem + 1 Lucky Loser</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Runda 2 - Szybka Odpowiedź</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Gracze:</strong> 6 uczestników</li>
                <li>• <strong>Czas:</strong> 5 sekund na odpowiedź</li>
                <li>• <strong>Punkty:</strong> 15 punktów za poprawną odpowiedź</li>
                <li>• <strong>Kara:</strong> -20% życia za błędną odpowiedź</li>
                <li>• <strong>Kwalifikacja:</strong> 3 ostatnich graczy</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Runda 3 - Koło Fortuny</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Gracze:</strong> 3 finalistów</li>
                <li>• <strong>Mechanika:</strong> Koło losuje kategorię pytania</li>
                <li>• <strong>Punkty:</strong> 25 punktów za poprawną odpowiedź</li>
                <li>• <strong>Kara:</strong> -25% życia za błędną odpowiedź</li>
                <li>• <strong>Zwycięzca:</strong> Ostatni gracz z życiem > 0%</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00E0FF] mb-4">Karty Specjalne</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[#FF3E9D] font-bold mb-2">Déjà Vu</h4>
                  <p className="text-sm text-gray-300">Powtarza ostatnie pytanie</p>
                </div>
                <div>
                  <h4 className="text-[#FF3E9D] font-bold mb-2">Kontra</h4>
                  <p className="text-sm text-gray-300">Przekazuje pytanie innemu graczowi</p>
                </div>
                <div>
                  <h4 className="text-[#FF3E9D] font-bold mb-2">Reanimacja</h4>
                  <p className="text-sm text-gray-300">Przywraca 25% życia</p>
                </div>
                <div>
                  <h4 className="text-[#FF3E9D] font-bold mb-2">Skip</h4>
                  <p className="text-sm text-gray-300">Pomija pytanie bez kary</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <NeonButton onClick={() => navigate('/host')}>
            Rozpocznij Grę
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default RulesView;
