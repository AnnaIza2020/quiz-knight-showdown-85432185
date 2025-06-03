
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Settings, Users, Monitor, Trophy, Gamepad2 } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { gameTitle, primaryColor, secondaryColor } = useGameContext();

  const navigationCards = [
    {
      title: 'Panel Hosta',
      description: 'Zarządzaj grą, kontroluj rundy i monitoruj graczy',
      icon: Monitor,
      path: '/host',
      color: 'neon-blue',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Overlay Gry',
      description: 'Widok dla streamingu i prezentacji na żywo',
      icon: Play,
      path: '/overlay',
      color: 'neon-green',
      gradient: 'from-green-600 to-blue-600'
    },
    {
      title: 'Panel Gracza',
      description: 'Interfejs dla uczestników gry',
      icon: Gamepad2,
      path: '/players',
      color: 'neon-purple',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Ustawienia',
      description: 'Konfiguruj pytania, rundy i wygląd gry',
      icon: Settings,
      path: '/settings',
      color: 'neon-yellow',
      gradient: 'from-yellow-600 to-orange-600'
    },
    {
      title: 'Zarządzanie Graczami',
      description: 'Dodaj graczy i zarządzaj ich danymi',
      icon: Users,
      path: '/settings?tab=players',
      color: 'neon-pink',
      gradient: 'from-pink-600 to-red-600'
    },
    {
      title: 'Ranking',
      description: 'Zobacz wyniki i statystyki gier',
      icon: Trophy,
      path: '/settings?tab=ranking',
      color: 'neon-cyan',
      gradient: 'from-cyan-600 to-teal-600'
    }
  ];

  const features = [
    {
      title: 'Trzy Dynamiczne Rundy',
      description: 'Runda wiedzy internetowej, 5 sekund, i koło fortuny',
      icon: '🎯'
    },
    {
      title: 'System Punktacji',
      description: 'Zaawansowany system punktów i życia dla każdej rundy',
      icon: '📊'
    },
    {
      title: 'Karty Specjalne',
      description: 'Boostery i karty zapewniające dodatkowe możliwości',
      icon: '🃏'
    },
    {
      title: 'Streaming Ready',
      description: 'Gotowe overlaye dla transmisji na Twitch',
      icon: '📺'
    },
    {
      title: 'Responsywny Design',
      description: 'Działa na wszystkich urządzeniach i rozdzielczościach',
      icon: '📱'
    },
    {
      title: 'Efekty Dźwiękowe',
      description: 'Immersyjne dźwięki i muzyka tła',
      icon: '🔊'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {gameTitle}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Profesjonalny teleturniej na żywo dla streamingu na Twitch. 
            Trzy ekscytujące rundy, system punktacji i karty specjalne!
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/host')}
              className="bg-neon-green hover:bg-neon-green/80 text-black font-bold px-8 py-4 text-lg"
            >
              <Play className="w-6 h-6 mr-2" />
              Rozpocznij Grę
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/settings')}
              className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black font-bold px-8 py-4 text-lg"
            >
              <Settings className="w-6 h-6 mr-2" />
              Ustawienia
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Cards */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2 
          className="text-4xl font-bold text-center text-white mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Panel Nawigacyjny
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
              onClick={() => navigate(card.path)}
            >
              <Card className="bg-black/40 backdrop-blur-md border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-center">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Funkcjonalności
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Gotowy na niezapomnianą rozgrywkę?
          </motion.h2>
          
          <motion.p 
            className="text-white/70 text-lg mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Stwórz epicką grę quiz show dla swojej społeczności Twitch już dziś!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/host')}
              className="bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-pink hover:to-neon-purple text-white font-bold px-12 py-4 text-lg"
            >
              <Play className="w-6 h-6 mr-2" />
              Zacznij Teraz!
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
