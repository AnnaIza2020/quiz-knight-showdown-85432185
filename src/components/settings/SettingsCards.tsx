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
    imageUrl: ''
  });
  
  const [newRule, setNewRule] = useState<SpecialCardAwardRule>({
    id: '',
    condition: 'correct_answer',
    cardId: '',
    probability: 100,
    description: '',
    isEnabled: true
  });
  
  const [selectedCardForAssign, setSelectedCardForAssign] = useState<string>('');
  const [selectedPlayerForAssign, setSelectedPlayerForAssign] = useState<string>('');

  // Add the missing openImageUploadDialog function
  const openImageUploadDialog = (cardId: string) => {
    setCurrentCardForImage(cardId);
    setImagePreview(null);
    setIsImageUploadDialogOpen(true);
  };

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
          condition: 'correct_answer',
          cardId: 'dejavu',
          description: 'Otrzymujesz kartę za 3 poprawne odpowiedzi z rzędu',
          probability: 100,
          isEnabled: true
        },
        {
          id: 'punkty-r1',
          condition: 'round_end',
          cardId: 'turbo',
          roundType: GameRound.ROUND_ONE,
          description: 'Otrzymujesz kartę za zdobycie 50 punktów w Rundzie 1',
          probability: 100,
          isEnabled: true
        },
        {
          id: 'bez-utraty-zycia',
          condition: 'round_end',
          cardId: 'refleks2',
          description: 'Otrzymujesz kartę za ukończenie rundy bez utraty życia',
          probability: 100,
          isEnabled: true
        },
        {
          id: 'najwiecej-pkt-r1',
          condition: 'round_end',
          cardId: 'refleks3',
          roundType: GameRound.ROUND_ONE,
          description: 'Otrzymujesz kartę za zdobycie największej liczby punktów w Rundzie 1',
          probability: 100,
          isEnabled: true
        },
        {
          id: 'ratunek-r1',
          condition: 'round_end',
          cardId: 'reanimacja',
          roundType: GameRound.ROUND_ONE,
          description: 'Karta ratunkowa dla gracza z najmniejszą liczbą punktów po Rundzie 1',
          probability: 100,
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
    updateSpecialCard(currentCardForImage, { imageUrl: imagePreview });

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
      updateSpecialCard(cardToSave.id, cardToSave);
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
      updateSpecialCardRule(ruleToSave.id, ruleToSave);
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
    
    giveCardToPlayer(selectedPlayerForAssign, selectedCardForAssign);
    
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
                    condition: 'correct_answer',
                    cardId: '',
                    description: '',
                    isEnabled: true,
                    probability: 100
                  });
                  setIsRuleDialogOpen(true);
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
                      value={typeof newRule.condition === 'string' ? newRule.condition : 'correct_answer'}
                      onChange={(e) => setNewRule({...newRule, condition: e.target.value as 'correct_answer' | 'incorrect_answer' | 'round_start' | 'round_end' | 'random' | string})}
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
                        {specialCards.map(card => (
                          <SelectItem key={card.id} value={card.id}>
                            <div className="flex items-center gap-2">
                              {card.iconName && iconMap[card.iconName] && React.createElement(iconMap[card.iconName], { size: 16 })}
                              <span>{card.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-round" className="text-right">Runda</Label>
                    <Select
                      value={newRule.roundType?.toString() || ''}
                      onValueChange={(value) => setNewRule({
                        ...newRule, 
                        roundType: value ? Number(value) as GameRound : undefined
                      })}
                    >
                      <SelectTrigger className="col-span-3 bg-black/50 border-gray-700">
                        <SelectValue placeholder="Wszystkie rundy" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0c0e1a] border-gray-800">
                        <SelectItem value="">Wszystkie rundy</SelectItem>
                        <SelectItem value={GameRound.ROUND_ONE.toString()}>Runda 1</SelectItem>
                        <SelectItem value={GameRound.ROUND_TWO.toString()}>Runda 2</SelectItem>
                        <SelectItem value={GameRound.ROUND_THREE.toString()}>Runda 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-description" className="text-right">Opis</Label>
                    <Input
                      id="rule-description"
                      className="col-span-3 bg-black/50 border-gray-700"
                      value={newRule.description || ''}
                      onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rule-enabled" className="text-right">Aktywna</Label>
                    <div className="col-span-3 flex items-center">
                      <Switch 
                        id="rule-enabled" 
                        checked={newRule.isEnabled} 
                        onCheckedChange={(checked) => setNewRule({...newRule, isEnabled: checked})}
                      />
                    </div>
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
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Warunek</TableHead>
                  <TableHead>Karta</TableHead>
                  <TableHead>Runda</TableHead>
                  <TableHead>Opis</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specialCardRules.map((rule) => {
                  const card = specialCards.find(c => c.id === rule.cardId);
                  return (
                    <TableRow key={rule.id}>
                      <TableCell>
                        {rule.isEnabled ? (
                          <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-500">
                            Aktywna
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-900/20 text-gray-500 border-gray-500">
                            Nieaktywna
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{rule.condition}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {card && card.iconName && iconMap[card.iconName] && React.createElement(iconMap[card.iconName], { size: 16 })}
                          <span>{card?.name || 'Nieznana karta'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.roundType !== undefined
                          ? `Runda ${rule.roundType}`
                          : "Wszystkie rundy"}
                      </TableCell>
                      <TableCell>{rule.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-neon-yellow hover:bg-black/50"
                            title="Edytuj zasadę"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-neon-red hover:bg-black/50"
                            title="Usuń zasadę"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
                P
