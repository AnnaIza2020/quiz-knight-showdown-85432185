
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Info, Github } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-neon-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-black/50 backdrop-blur-lg border border-white/10">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-white flex justify-center items-center gap-2">
            <Info className="w-6 h-6" />
            O aplikacji
          </CardTitle>
          <CardDescription className="text-center text-white/70 text-lg">
            Discord Game Show Arena
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-white/80">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-neon-pink">Co to jest?</h3>
            <p>
              Discord Game Show Arena to interaktywna aplikacja do prowadzenia teleturniejów dla społeczności 
              Discorda i streamerów. Zaprojektowana specjalnie dla prowadzących, którzy chcą dodać element rywalizacji
              i zabawy do swoich społeczności.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-neon-blue">Funkcje</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>3 rundy gry o różnych zasadach i mechanikach</li>
              <li>System kart specjalnych do urozmaicenia rozgrywki</li>
              <li>Profesjonalny overlay dla OBS i innych programów do streamowania</li>
              <li>Panel gracza dostępny przez przeglądarkę - bez konieczności instalacji</li>
              <li>Intuicyjny panel prowadzącego z pełną kontrolą nad grą</li>
              <li>Możliwość zapisywania i wczytywania stanu gry</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-neon-green">Jak zacząć?</h3>
            <p>
              Zacznij od dodania graczy w zakładce Ustawienia. Następnie przejdź do panelu hosta, aby rozpocząć grę.
              W trakcie rozgrywki możesz używać nakładki OBS aby pokazać widzom aktualny stan gry i przebieg rozgrywki.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2 text-neon-yellow">Wersja</h3>
            <p>
              Discord Game Show Arena 1.0.0
            </p>
            <p className="text-xs mt-2 text-white/50">
              © 2025 All rights reserved
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Strona główna
            </Link>
          </Button>
          <Button variant="outline">
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default About;
