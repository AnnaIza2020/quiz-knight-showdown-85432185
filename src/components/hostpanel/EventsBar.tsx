
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface EventsBarProps {
  lastEvents: string[];
}

const EventsBar: React.FC<EventsBarProps> = ({ lastEvents }) => {
  return (
    <Card className="bg-black/40 border border-white/10 mt-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Ostatnie zdarzenia
          <Badge variant="outline" className="ml-2 text-neon-blue border-neon-blue">
            {lastEvents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-24">
          <div className="space-y-2">
            {lastEvents.length === 0 ? (
              <div className="text-gray-400 text-sm italic">
                Brak zdarzeń
              </div>
            ) : (
              lastEvents.map((event, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-neon-green rounded-full" />
                  <span className="text-gray-300">{event}</span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EventsBar;
