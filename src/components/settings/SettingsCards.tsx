import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, SkipForward, Zap, Clock, ArrowDown, Repeat, Target, Copy, Shield, RotateCcw, Plus, Pencil, Trash2, Check, X, Upload, ImageIcon } from 'lucide-react';
import { SpecialCard, SpecialCardAwardRule, GameRound } from '@/types/game-types';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  SkipForward,
  Zap,
  Clock,
  ArrowDown,
  Repeat,
  Target,
  Copy,
  Shield,
  RotateCcw
};

const SettingsCards = () => {
  const { 
    specialCards, 
    addSpecialCard, 
    updateSpecialCard, 
    removeSpecialCard,
    specialCardRules,
    addSpecialCardRule,
    updateSpecialCardRule,
    removeSpecialCardRule,
    players,
    giveCardToPlayer,
    playSound
  } = useGameContext();
  
  const [activeTab, setActiveTab] = useState("karty");
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = useState(false);
  const [currentCardForImage, setCurrentCardForImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [editingCard, setEditingCard] = useState<SpecialCard | null>(null);
  const [editingRule, setEditingRule] = useState<SpecialCardAwardRule | null>(null);
  
  const [newCard, setNewCard] = useState<SpecialCard>({
    id: '',
    name: '',
    description: '',
    iconName: 'SkipForward',
    imageUrl: '' // Dodane pole na adres URL obrazu karty
  });
  
  const [newRule, setNewRule] = useState<SpecialCardAwardRule>({
    id: '',
    condition: '',
    cardId: '',
    description: '',
    isEnabled: true
  });
  
  const [selectedCardForAssign, setSelectedCardForAssign] = useState<string>('');
  const [selectedPlayerForAssign, setSelectedPlayerForAssign] = useState<string>('');

  // Init with predefined cards if none exist
  useEffect(() => {
    if (specialCards.length === 0) {
      const defaultCards: SpecialCard[] = [
        {
          id: 'dejavu',
          name: 'Dejavu',
          description: 'Użyj tej karty, aby otrzymać drugą szansę na odpowiedź na to samo pytanie.',
          iconName: 'Repeat'
        },
        {
          id: 'kontra',
          name: 'Kontra',
          description: 'Po usłyszeniu pytania, użyj tej karty, aby wskazać innego uczestnika, który musi odpowiedzieć.',
          iconName: 'Target'
        },
        {
          id: 'reanimacja',
          name: 'Reanimacja',
          description: 'Ta karta daje Ci dodatkowe życie! Jeśli odpowiesz błędnie, nie odpadasz.',
          iconName: 'Shield'
        },
        {
          id: 'skip',
          name: 'Skip',
          description: 'Zaskoczyło Cię pytanie? Użyj Skip, aby pominąć pytanie bez konsekwencji.',
          iconName: 'SkipForward'
        },
        {
          id: 'turbo',
          name: 'Turbo',
          description: 'Aktywuj Turbo przed odpowiedzią. Jeśli odpowiedź jest poprawna, otrzymasz podwójną liczbę punktów!',
          iconName: 'Zap'
        },
        {
          id: 'refleks2',
          name: 'Refleks x2',
          description: 'Użyj Refleks x2, aby podwoić czas na odpowiedź.',
          iconName: 'Clock'
        },
        {
          id: 'refleks3',
          name: 'Refleks x3',
          description: 'Użyj Refleks x3, aby potroić czas na odpowiedź.',
          iconName: 'Clock'
        },
        {
          id: 'lustro',
          name: 'Lustro',
          description: 'Aktywuj Lustro, aby usunąć jedną błędną opcję odpowiedzi.',
          iconName: 'Copy'
        },
        {
          id: 'oswiecenie',
          name: 'Oświecenie',
          description: 'Skorzystaj z Oświecenia, aby otrzymać krótką podpowiedź do pytania.',
          iconName: 'Lightbulb'
        }
      ];
      
      defaultCards.forEach(card => addSpecialCard(card));
    }
    
    if (specialCardRules.length === 0) {
      const defaultRules: SpecialCardAwardRule[] = [
        {
          id: 'seria-poprawne',
          condition: '3 poprawne odpowiedzi z rzędu',
          cardId: 'dejavu',
          description: 'Otrzymujesz kartę za 3 poprawne odpowiedzi z rzędu',
          isEnabled: true
        },
        {
          id: 'punkty-r1',
          condition: '50+ punktów w Rundzie 1',
          cardId: 'turbo',
          roundType: GameRound.ROUND_ONE,
          description: 'Otrzymujesz kartę za zdobycie 50 punktów w Rundzie 1',
          isEnabled: true
        },
        {
          id: 'bez-utraty-zycia',
          condition: 'Runda bez utraty życia',
          cardId: 'refleks2',
          description: 'Otrzymujesz kartę za ukończenie rundy bez utraty życia',
          isEnabled: true
        },
        {
          id: 'najwiecej-pkt-r1',
          condition: 'Najwięcej punktów w Rundzie 1',
          cardId: 'refleks3',
          roundType: GameRound.ROUND_ONE,
          description: 'Otrzymujesz kartę za zdobycie największej liczby punktów w Rundzie 1',
          isEnabled: true
        },
        {
          id: 'ratunek-r1',
          condition: 'Po R1 - gracz z najmniejszą liczbą punktów',
          cardId: 'reanimacja',
          roundType: GameRound.ROUND_ONE,
          description: 'Karta ratunkowa dla gracza z najmniejszą liczbą punktów po Rundzie 1',
          isEnabled: true
        }
      ];
      
      defaultRules.forEach(rule => addSpecialCardRule(rule));
    }
  }, [specialCards.length, specialCardRules.length, addSpecialCard, addSpecialCardRule]);

  // Obsługa przesyłania obrazu karty
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Sprawdź typ pliku (tylko PNG)
    if (file.type !== 'image/png') {
      toast.error('Dozwolone są tylko pliki PNG');
      return;
    }

    // Stwórz podgląd obrazu
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Zapisz obraz do karty
  const handleSaveCardImage = () => {
    if (!imagePreview || !currentCardForImage) return;

    // Znajdź kartę do aktualizacji
    const cardToUpdate = specialCards.find(card => card.id === currentCardForImage);
    if (!cardToUpdate) return;

    // Aktualizuj kartę z nowym obrazem
    updateSpecialCard({
      ...cardToUpdate,
      imageUrl: imagePreview
    });

    toast.success(`Obraz dla karty "${cardToUpdate.name}" został dodany`);
    setIsImageUploadDialogOpen(false);
    setImagePreview(null);
    setCurrentCardForImage('');
    playSound('card-reveal');
  };

  // Handle adding/editing a card
  const handleCardSubmit = () => {
    if (!newCard.name || !newCard.description) {
      toast.error('Wypełnij wszystkie wymagane pola!');
      return;
    }
    
    const cardToSave = {
      ...newCard,
      id: newCard.id || `card-${Date.now()}`
    };
    
    if (editingCard) {
      updateSpecialCard(cardToSave);
      toast.success(`Karta "${cardToSave.name}" została zaktualizowana`);
    } else {
      addSpecialCard(cardToSave);
      toast.success(`Karta "${cardToSave.name}" została dodana`);
    }
    
    setIsCardDialogOpen(false);
    setNewCard({
      id: '',
      name: '',
      description: '',
      iconName: 'SkipForward',
      imageUrl: ''
    });
    setEditingCard(null);
    playSound('bonus');
  };

  // Handle adding/editing a rule
  const handleRuleSubmit = () => {
    if (!newRule.condition || !newRule.cardId) {
      toast.error('Wypełnij wszystkie wymagane pola!');
      return;
    }
    
    const ruleToSave = {
      ...newRule,
      id: newRule.id || `rule-${Date.now()}`
    };
    
    if (editingRule) {
      updateSpecialCardRule(ruleToSave);
      toast.success(`Zasada "${ruleToSave.condition}" została zaktualizowana`);
    } else {
      addSpecialCardRule(ruleToSave);
      toast.success(`Zasada "${ruleToSave.condition}" została dodana`);
    }
    
    setIsRuleDialogOpen(false);
    setNewRule({
      id: '',
      condition: '',
      cardId: '',
      description: '',
      isEnabled: true
    });
    setEditingRule(null);
    playSound('success');
  };

  // Handle assigning a card to player
  const handleAssignCard = () => {
    if (!selectedCardForAssign || !selectedPlayerForAssign) {
      toast.error('Wybierz kartę i gracza!');
      return;
    }
    
    giveCardToPlayer(selectedCardForAssign, selectedPlayerForAssign);
    
    const player = players.find(p => p.id === selectedPlayerForAssign);
    const card = specialCards.find(c => c.id === selectedCardForAssign);
    
    if (player && card) {
      toast.success(`Karta "${card.name}" przyznana graczowi ${player.name}`);
      playSound('card-reveal');
    }
    
    setIsAssignDialogOpen(false);
    setSelectedCardForAssign('');
    setSelectedPlayerForAssign('');
  };

  // Set up editing card
  const handleEditCard = (card: SpecialCard) => {
    setEditingCard(card);
    setNewCard({ ...card });
    setIsCardDialogOpen(true);
  };

  // Set up editing rule
  const handleEditRule = (rule: SpecialCardAwardRule) => {
    setEditingRule(rule);
    setNewRule({ ...rule });
    setIsRuleDialogOpen(true);
  };
  
  // Test card animation
  const handleTestCardAnimation = (cardId: string) => {
    const card = specialCards.find(c => c.id === cardId);
    if (card) {
      toast.info(`Animacja karty: ${card.name}`, {
        description: card.description,
        icon: card.iconName in iconMap ? React.createElement(iconMap[card.iconName]) : null
      });
      playSound('card-reveal');
    }
  };

  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Karty Specjalne</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="bg-black/30 w-full justify-start overflow-x-auto border-b border-gray-800">
          <TabsTrigger value="karty" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Karty specjalne
          </TabsTrigger>
          <TabsTrigger value="zasady" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Zasady przyznawania
          </TabsTrigger>
          <TabsTrigger value="przydziel" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Przydziel kartę
          </TabsTrigger>
          <TabsTrigger value="test" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Test animacji
          </TabsTrigger>
          <TabsTrigger value="obrazy" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green data-[state=active]:shadow-none">
            Obrazy kart
          </TabsTrigger>
        </TabsList>
        
        {/* Karty specjalne */}
        <TabsContent value="karty" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Lista kart specjalnych</h3>
            <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neon-green hover:bg-neon-green/80 gap-2" onClick={() => {
                  setEditingCard(null);
                  setNewCard({
                    id: '',
                    name: '',
                    description: '',
                    iconName: 'SkipForward',
                    imageUrl: ''
                  });
                }}>
                  <Plus size={16} /> Nowa karta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0e1a] border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingCard ? 'Edytuj kartę' : 'Dodaj nową kartę'}</DialogTitle>
                  <DialogDescription>
                    {editingCard ? 'Zmodyfikuj istniejącą kartę specjalną' : 'Utwórz nową kartę specjalną dla graczy'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-name" className="text-right">Nazwa</Label>
                    <Input
                      id="card-name"
                      className="col-span-3 bg-black/50 border-gray-700"
                      value={newCard.name}
                      onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-description" className="text-right">Opis</Label>
                    <Input
                      id="card-description"
                      className="col-span-3 bg-black/50 border-gray-700"
                      value={newCard.description}
                      onChange={(e) => setNewCard({...newCard, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-icon" className="text-right">Ikona</Label>
                    <Select
                      value={newCard.iconName}
                      onValueChange={(value) => setNewCard({...newCard, iconName: value})}
                    >
                      <SelectTrigger className="col-span-3 bg-black/50 border-gray-700">
                        <SelectValue placeholder="Wybierz ikonę" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0c0e1a] border-gray-800">
                        {Object.keys(iconMap).map((icon) => {
                          const IconComponent = iconMap[icon];
                          return (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                <IconComponent size={16} />
                                <span>{icon}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>Anuluj</Button>
                  <Button className="bg-neon-green hover:bg-neon-green/80" onClick={handleCardSubmit}>
                    {editingCard ? 'Zapisz zmiany' : 'Dodaj kartę'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialCards.map((card) => {
              const IconComponent = iconMap[card.iconName] || SkipForward;
              return (
                <Card key={card.id} className="bg-black/30 border-gray-800">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center gap-2 text-neon-green">
                        <IconComponent size={18} />
                        {card.name}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-black/50"
                          onClick={() => handleEditCard(card)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-black/50"
                          onClick={() => openImageUploadDialog(card.id)}
                          title="Dodaj obraz karty"
                        >
                          <ImageIcon size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-black/50"
                          onClick={() => {
                            if (window.confirm(`Czy na pewno chcesz usunąć kartę "${card.name}"?`)) {
                              removeSpecialCard(card.id);
                              toast.success(`Karta "${card.name}" została usunięta`);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  {card.imageUrl && (
                    <CardContent className="pt-0">
                      <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden border border-gray-700">
                        <img 
                          src={card.imageUrl} 
                          alt={`Karta ${card.name}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
          
          {specialCards.length === 0 && (
            <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
              <p className="text-white/60">Brak zdefiniowanych kart specjalnych. Dodaj pierwszą kartę!</p>
            </div>
          )}
        </TabsContent>
        
        {/* Zasady przyznawania kart */}
        <TabsContent value="zasady" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Automatyczne przyznawanie kart</h3>
            <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neon-green hover:bg-neon-green/80 gap-2" onClick={() => {
                  setEditingRule(null);
                  setNewRule({
                    id: '',
                    condition: '',
                    cardId: '',
                    description: '',
                    isEnabled: true
                  });
                }}>
                  <Plus size={16} /> Nowa zasada
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0e1a] border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">{editingRule ? 'Edytuj zasadę' : 'Dodaj nową zasadę'}</DialogTitle>
                  <DialogDescription>
                    {editingRule 
                      ? 'Zmodyfikuj zasadę przyznawania karty specjalnej' 
                      : 'Utwórz nową zasadę przyznawania karty specjalnej'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-condition" className="text-right">Warunek</Label>
                    <Input
                      id="rule-condition"
                      className="col-span-3 bg-black/50 border-gray-700"
                      value={newRule.condition}
                      onChange={(e) => setNewRule({...newRule, condition: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-card" className="text-right">Karta</Label>
                    <Select
                      value={newRule.cardId}
                      onValueChange={(value) => setNewRule({...newRule, cardId: value})}
                    >
                      <SelectTrigger className="col-span-3 bg-black/50 border-gray-700">
                        <SelectValue placeholder="Wybierz kartę" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0c0e1a] border-gray-800">
                        {specialCards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-round" className="text-right">Runda (opcjonalnie)</Label>
                    <Select
                      value={newRule.roundType || ''}
                      onValueChange={(value) => setNewRule({...newRule, roundType: value ? value as GameRound : undefined})}
                    >
                      <SelectTrigger className="col-span-3 bg-black/50 border-gray-700">
                        <SelectValue placeholder="Dowolna runda" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0c0e1a] border-gray-800">
                        <SelectItem value="">Dowolna runda</SelectItem>
                        <SelectItem value={GameRound.ROUND_ONE}>Runda 1</SelectItem>
                        <SelectItem value={GameRound.ROUND_TWO}>Runda 2</SelectItem>
                        <SelectItem value={GameRound.ROUND_THREE}>Runda 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-description" className="text-right">Opis</Label>
                    <Input
                      id="rule-description"
                      className="col-span-3 bg-black/50 border-gray-700"
                      value={newRule.description}
                      onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-enabled" className="text-right">Aktywna</Label>
                    <Switch
                      id="rule-enabled"
                      checked={newRule.isEnabled}
                      onCheckedChange={(checked) => setNewRule({...newRule, isEnabled: checked})}
                    />
                  </div>
                </div>
                
                <DialogFooter className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>Anuluj</Button>
                  <Button className="bg-neon-green hover:bg-neon-green/80" onClick={handleRuleSubmit}>
                    {editingRule ? 'Zapisz zmiany' : 'Dodaj zasadę'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4 mb-8">
            {specialCardRules.map((rule) => {
              const card = specialCards.find(c => c.id === rule.cardId);
              return (
                <div 
                  key={rule.id}
                  className={`bg-black/30 border ${rule.isEnabled ? 'border-gray-800' : 'border-gray-800/50'} p-4 rounded-lg flex justify-between items-center ${rule.isEnabled ? '' : 'opacity-50'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{rule.condition}</span>
                      {rule.roundType && (
                        <Badge variant="outline" className="bg-black/50 border-gray-700 text-gray-400">
                          {rule.roundType === GameRound.ROUND_ONE ? 'Runda 1' : 
                          rule.roundType === GameRound.ROUND_TWO ? 'Runda 2' :
                          'Runda 3'}
                        </Badge>
                      )}
                      {!rule.isEnabled && (
                        <Badge variant="outline" className="bg-black/50 border-gray-700 text-gray-400">
                          Nieaktywna
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-neon-green mt-1 flex items-center gap-1">
                      Karta: {card?.name || 'Nieznana karta'}
                      {card && iconMap[card.iconName] ? React.createElement(iconMap[card.iconName], { size: 16 }) : null}
                    </p>
                    {rule.description && (
                      <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-white"
                      onClick={() => handleEditRule(rule)}
                    >
                      <Pencil size={14} className="mr-1" /> Edytuj
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-red-400 hover:text-red-300"
                      onClick={() => {
                        if (window.confirm(`Czy na pewno chcesz usunąć zasadę "${rule.condition}"?`)) {
                          removeSpecialCardRule(rule.id);
                          toast.success(`Zasada "${rule.condition}" została usunięta`);
                        }
                      }}
                    >
                      <Trash2 size={14} className="mr-1" /> Usuń
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {specialCardRules.length === 0 && (
            <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
              <p className="text-white/60">Brak zdefiniowanych zasad przyznawania kart. Dodaj pierwszą zasadę!</p>
            </div>
          )}
        </TabsContent>
        
        {/* Przydzielanie kart graczom */}
        <TabsContent value="przydziel" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Przydziel kartę graczowi</h3>
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
                  <Plus size={16} /> Przydziel kartę
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0e1a] border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Przydziel kartę graczowi</DialogTitle>
                  <DialogDescription>
                    Wybierz kartę i gracza, któremu chcesz ją przydzielić
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="player-select" className="text-right">Gracz</Label>
                    <Select
                      value={selectedPlayerForAssign}
                      onValueChange={setSelectedPlayerForAssign}
                    >
                      <SelectTrigger className="col-span-3 bg-black/50 border-gray-700">
                        <SelectValue placeholder="Wybierz gracza" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0c0e1a] border-gray-800">
                        {players.filter(p => !p.isEliminated).map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="card-select" className="text-right">Karta</Label>
                    <Select
                      value={selectedCardForAssign}
                      onValueChange={setSelectedCardForAssign}
                    >
                      <SelectTrigger className="col-span-3 bg-black/50 border-gray-700">
                        <SelectValue placeholder="Wybierz kartę" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0c0e1a] border-gray-800">
                        {specialCards.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            <div className="flex items-center gap-2">
                              {card.iconName in iconMap ? React.createElement(iconMap[card.iconName], { size: 16 }) : null}
                              <span>{card.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Anuluj</Button>
                  <Button className="bg-neon-blue hover:bg-neon-blue/80" onClick={handleAssignCard}>
                    Przydziel kartę
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-black/30 border-gray-800">
            <CardHeader>
              <CardTitle>Lista graczy i ich karty</CardTitle>
              <CardDescription>
                Poniżej znajduje się lista graczy i przypisane im karty specjalne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-black/40 border-gray-800">
                    <TableHead>Gracz</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Karty specjalne</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => {
                    const playerCards = player.specialCards 
                      ? player.specialCards.map(id => specialCards.find(c => c.id === id)).filter(Boolean)
                      : [];
                      
                    return (
                      <TableRow key={player.id} className="hover:bg-black/40 border-gray-800">
                        <TableCell>
                          <div className="font-semibold">{player.name}</div>
                        </TableCell>
                        <TableCell>
                          {player.isEliminated ? (
                            <Badge variant="outline" className="bg-red-950/30 text-red-400 border-red-900">
                              Wyeliminowany
                            </Badge>
                          ) : player.isActive ? (
                            <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900">
                              Aktywny
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-900">
                              Oczekuje
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {playerCards.map((card) => card && (
                              <Badge 
                                key={card.id} 
                                className="bg-black/50 hover:bg-black/70 cursor-pointer border-gray-700 flex items-center gap-1"
                                title={card.description}
                              >
                                {card.iconName in iconMap ? React.createElement(iconMap[card.iconName], { size: 14 }) : null}
                                {card.name}
                              </Badge>
                            ))}
                            {playerCards.length === 0 && (
                              <span className="text-gray-500 text-sm italic">Brak kart</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Test animacji kart */}
        <TabsContent value="test" className="mt-6">
          <Card className="bg-black/30 border-gray-800">
            <CardHeader>
              <CardTitle>Test animacji kart</CardTitle>
              <CardDescription>
                Wybierz kartę, aby przetestować jej animację i efekty dźwiękowe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {specialCards.map((card) => {
                  const IconComponent = iconMap[card.iconName] || SkipForward;
                  return (
                    <Button
                      key={card.id}
                      variant="outline"
                      className="flex items-center justify-center gap-2 h-16 border-gray-700 hover:border-neon-green hover:bg-black/50"
                      onClick={() => handleTestCardAnimation(card.id)}
                    >
                      <IconComponent size={20} className="text-neon-green" />
                      <span>{card.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nowa zakładka: Obrazy kart */}
        <TabsContent value="obrazy" className="mt-6">
          <Card className="bg-black/30 border-gray-800">
            <CardHeader>
              <CardTitle>Zarządzanie obrazami kart</CardTitle>
              <CardDescription>
                Dodaj lub edytuj obrazy dla kart specjalnych (format PNG)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {specialCards.map((card) => (
                  <div
                    key={card.id}
                    className="border border-gray-700 rounded-lg p-4 flex flex-col items-center"
                  >
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      {iconMap[card.iconName] && React.createElement(iconMap[card.iconName], { size: 18 })}
                      {card.name}
                    </h3>
                    
                    <div className="bg-black/50 w-full aspect-[3/4] rounded-lg flex items-center justify-center mb-3 overflow-hidden border border-gray-700">
                      {card.imageUrl ? (
                        <img 
                          src={card.imageUrl} 
                          alt={card.name} 
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <ImageIcon size={48} />
                          <span className="text-xs mt-2">Brak obrazu</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-700 text-white gap-2 w-full"
                      onClick={() => openImageUploadDialog(card.id)}
                    >
                      <Upload size={14} />
                      {card.imageUrl ? "Zmień obraz" : "Dodaj obraz"}
                    </Button>
                  </div>
                ))}
              </div>
              
              {specialCards.length === 0 && (
                <div className="flex justify-center items-center p-12 border border-dashed border-gray-700 rounded-lg">
                  <p className="text-white/60">Brak zdefiniowanych kart specjalnych. Najpierw dodaj karty.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog dla przesyłania obrazów */}
      <Dialog open={isImageUploadDialogOpen} onOpenChange={setIsImageUploadDialogOpen}>
        <DialogContent className="bg-[#0c0e1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {specialCards.find(c => c.id === currentCardForImage)?.name} - Dodaj obraz karty
            </DialogTitle>
            <DialogDescription>
              Prześlij obraz w formacie PNG dla tej karty specjalnej
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="border border-gray-700 rounded-lg w-40 h-56 flex items-center justify-center bg-black/50 overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Podgląd karty" 
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon size={36} />
                    <span className="text-xs mt-2">Podgląd</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="card-image" className="text-right">Obraz PNG</Label>
              <div className="col-span-3">
                <Input
                  id="card-image"
                  type="file"
                  accept="image/png"
                  onChange={handleImageUpload}
                  className="bg-black/50 border-gray-700"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Zalecany rozmiar: 300x420 pikseli (stosunek 3:4)
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsImageUploadDialogOpen(false)}>Anuluj</Button>
            <Button 
              className="bg-neon-green hover:bg-neon-green/80" 
              onClick={handleSaveCardImage}
              disabled={!imagePreview}
            >
              Zapisz obraz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog dla przypisywania kart */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-[#0c0e1a] border-gray-800">
          {/* ... keep existing code (assign cards dialog content) */}
        </DialogContent>
      </Dialog>
      
      {/* Dialog dla reguł */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="bg-[#0c0e1a] border-gray-800">
          {/* ... keep existing code (rules dialog content) */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsCards;
