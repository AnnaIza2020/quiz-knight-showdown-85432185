
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useGameContext } from '@/context/GameContext';
import { useSpecialCardsContext } from '@/context/SpecialCardsContext';
import { SpecialCard, SpecialCardAwardRule, GameRound, Player } from '@/types/game-types';
import { Plus, Edit, Trash2, Save, Filter, Search, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';
import CardDisplay from '../cards/CardDisplay';
import CardDecksManager, { CardDeck } from './cards/CardDecksManager';
import AdvancedCardEditor from './cards/AdvancedCardEditor';

const defaultCard: SpecialCard = {
  id: '',
  name: '',
  description: '',
  imageUrl: '',
  soundEffect: 'card-reveal',
  iconName: '',
  animationStyle: 'glow'
};

const defaultRule: SpecialCardAwardRule = {
  id: '',
  cardId: '',
  condition: 'correct_answer',
  probability: 100,
  roundApplicable: [GameRound.ROUND_ONE, GameRound.ROUND_TWO, GameRound.ROUND_THREE],
  roundType: GameRound.ROUND_ONE,
  description: '',
  isEnabled: true
};

const SettingsCards = () => {
  const { 
    specialCards, 
    specialCardRules, 
    addSpecialCard, 
    updateSpecialCard, 
    removeSpecialCard,
    addSpecialCardRule, 
    updateSpecialCardRule, 
    removeSpecialCardRule,
    giveCardToPlayer,
    usePlayerCard,
    players 
  } = useGameContext();

  const [activeTab, setActiveTab] = useState('cards');
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [isAdvancedEditorOpen, setIsAdvancedEditorOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<SpecialCard>(defaultCard);
  const [currentRule, setCurrentRule] = useState<SpecialCardAwardRule>(defaultRule);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'card' | 'rule', id: string}>({ type: 'card', id: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [cardDecks, setCardDecks] = useState<CardDeck[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  
  // Card form handlers
  const handleAddCard = () => {
    setCurrentCard(defaultCard);
    setIsEditing(false);
    setIsCardDialogOpen(true);
  };

  const handleEditCard = (card: SpecialCard) => {
    setCurrentCard({...card});
    setIsEditing(true);
    setIsCardDialogOpen(true);
  };

  const handleOpenAdvancedEditor = (card: SpecialCard) => {
    setCurrentCard({...card});
    setIsAdvancedEditorOpen(true);
  };

  const handleSaveCard = () => {
    try {
      const cardToSave = {...currentCard};
      
      if (!cardToSave.name.trim()) {
        toast.error('Nazwa karty jest wymagana');
        return;
      }
      
      if (isEditing) {
        updateSpecialCard(cardToSave.id, cardToSave);
        toast.success(`Karta "${cardToSave.name}" została zaktualizowana`);
      } else {
        cardToSave.id = crypto.randomUUID();
        addSpecialCard(cardToSave);
        toast.success(`Karta "${cardToSave.name}" została dodana`);
      }
      
      setIsCardDialogOpen(false);
    } catch (error) {
      toast.error('Wystąpił błąd podczas zapisywania karty');
      console.error('Error saving card:', error);
    }
  };

  // Rule form handlers
  const handleAddRule = () => {
    setCurrentRule({...defaultRule});
    setIsEditing(false);
    setIsRuleDialogOpen(true);
  };

  const handleEditRule = (rule: SpecialCardAwardRule) => {
    setCurrentRule({...rule});
    setIsEditing(true);
    setIsRuleDialogOpen(true);
  };

  const handleSaveRule = () => {
    try {
      const ruleToSave = {...currentRule};
      
      if (!ruleToSave.cardId) {
        toast.error('Wybierz kartę, której dotyczy reguła');
        return;
      }
      
      if (!ruleToSave.condition) {
        toast.error('Wybierz warunek przyznawania karty');
        return;
      }
      
      if (isEditing) {
        updateSpecialCardRule(ruleToSave.id, ruleToSave);
        toast.success(`Reguła dla karty została zaktualizowana`);
      } else {
        ruleToSave.id = crypto.randomUUID();
        addSpecialCardRule(ruleToSave);
        toast.success(`Nowa reguła dla karty została dodana`);
      }
      
      setIsRuleDialogOpen(false);
    } catch (error) {
      toast.error('Wystąpił błąd podczas zapisywania reguły');
      console.error('Error saving rule:', error);
    }
  };

  // Delete confirmation handlers
  const handleConfirmDelete = () => {
    try {
      if (itemToDelete.type === 'card') {
        removeSpecialCard(itemToDelete.id);
        toast.success('Karta została usunięta');
      } else {
        removeSpecialCardRule(itemToDelete.id);
        toast.success('Reguła została usunięta');
      }
      setDeleteConfirmDialog(false);
    } catch (error) {
      toast.error('Wystąpił błąd podczas usuwania');
      console.error('Error deleting item:', error);
    }
  };

  const promptDelete = (type: 'card' | 'rule', id: string) => {
    setItemToDelete({ type, id });
    setDeleteConfirmDialog(true);
  };

  // Deck management handlers
  const handleSaveDeck = (deck: CardDeck) => {
    setCardDecks(prev => {
      const exists = prev.find(d => d.id === deck.id);
      if (exists) {
        return prev.map(d => d.id === deck.id ? deck : d);
      } else {
        return [...prev, deck];
      }
    });
    
    // Here you would save the deck to your storage/context
  };

  const handleDeleteDeck = (deckId: string) => {
    setCardDecks(prev => prev.filter(d => d.id !== deckId));
    // Here you would delete the deck from your storage/context
  };

  const handleActivateDeck = (deckId: string) => {
    setCardDecks(prev => prev.map(d => ({
      ...d,
      isActive: d.id === deckId
    })));
    // Here you would activate the deck in your game context
  };

  // Card testing
  const handleTestCardEffect = (card: SpecialCard, testParams?: any) => {
    // Log the card and parameters for testing
    console.log('Testing card effect:', card, testParams);
    
    // You would implement the actual effect testing logic here
    toast.success(`Testowanie efektu karty "${card.name}"`);
    
    // Mock effect for demonstration
    setTimeout(() => {
      toast.info(`Efekt: ${card.effectType || 'custom'} wykonany pomyślnie`);
    }, 1500);
  };

  // Manual assignment handlers
  const handleGiveCardToPlayer = () => {
    if (!selectedPlayer || !currentCard.id) {
      toast.error('Wybierz gracza i kartę');
      return;
    }
    
    giveCardToPlayer(selectedPlayer, currentCard.id);
    toast.success('Karta została przydzielona graczowi');
  };

  // Filtering and searching
  const filteredCards = specialCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Helpers
  const getCardNameById = (cardId: string) => {
    const card = specialCards.find(c => c.id === cardId);
    return card ? card.name : 'Nieznana karta';
  };

  const translateCondition = (condition: string) => {
    const conditions: Record<string, string> = {
      'correct_answer': 'Poprawna odpowiedź',
      'incorrect_answer': 'Błędna odpowiedź',
      'round_start': 'Start rundy',
      'round_end': 'Koniec rundy',
      'random': 'Losowo',
      'points_milestone': 'Próg punktowy',
      'card_used': 'Użycie karty',
      'question_count': 'Liczba pytań'
    };
    
    return conditions[condition] || condition;
  };

  const translateRound = (round: GameRound) => {
    switch(round) {
      case GameRound.SETUP: return 'Przygotowanie';
      case GameRound.ROUND_ONE: return 'Runda 1';
      case GameRound.ROUND_TWO: return 'Runda 2';
      case GameRound.ROUND_THREE: return 'Runda 3';
      case GameRound.FINISHED: return 'Koniec gry';
      default: return `Runda ${round}`;
    }
  };

  const countActiveInstances = (cardId: string): number => {
    // Count how many players have this card
    return players.reduce((count, player) => {
      const hasCard = player.specialCards?.includes(cardId) || false;
      return count + (hasCard ? 1 : 0);
    }, 0);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Karty Specjalne (Boostery)</CardTitle>
          <CardDescription>
            Zarządzaj kartami specjalnymi, regułami przyznawania i taliami kart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="cards">Karty</TabsTrigger>
              <TabsTrigger value="rules">Reguły przyznawania</TabsTrigger>
              <TabsTrigger value="decks">Talie</TabsTrigger>
              <TabsTrigger value="assign">Przydzielanie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cards">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                <div className="flex flex-col md:flex-row w-full gap-2">
                  <div className="relative md:w-1/2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Szukaj kart..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}
                  >
                    <SelectTrigger className="md:w-1/4">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtruj" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie karty</SelectItem>
                      <SelectItem value="active">Aktywne karty</SelectItem>
                      <SelectItem value="inactive">Nieaktywne karty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddCard} className="md:w-auto">
                  <Plus size={16} className="mr-2" /> Dodaj kartę
                </Button>
              </div>
              
              {specialCards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCards.map((card) => {
                    const activeInstances = countActiveInstances(card.id);
                    
                    return (
                      <Card key={card.id} className="overflow-hidden">
                        <CardContent className="pt-4 flex flex-col items-center">
                          <CardDisplay card={card} size="medium" showDescription={true} />
                          
                          <div className="w-full mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-2">
                              <span>Typ: {card.effectType || 'Standardowy'}</span>
                              <span>Aktywne: {activeInstances}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2 w-full flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditCard(card)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenAdvancedEditor(card)}
                            >
                              <FileText size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => promptDelete('card', card.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nie ma jeszcze zdefiniowanych kart specjalnych.</p>
                  <p className="text-sm mt-2">Kliknij "Dodaj kartę" aby stworzyć pierwszą.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rules">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Reguły przyznawania kart</h3>
                <Button onClick={handleAddRule} className="gap-1">
                  <Plus size={16} /> Dodaj regułę
                </Button>
              </div>
              
              {specialCardRules.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Karta</TableHead>
                      <TableHead>Warunek</TableHead>
                      <TableHead>Rundy</TableHead>
                      <TableHead>Szansa</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specialCardRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{getCardNameById(rule.cardId)}</TableCell>
                        <TableCell>{translateCondition(rule.condition)}</TableCell>
                        <TableCell>{rule.roundApplicable?.map(r => translateRound(r)).join(', ')}</TableCell>
                        <TableCell>{rule.probability}%</TableCell>
                        <TableCell>
                          {rule.isEnabled ? (
                            <span className="text-green-500">Aktywna</span>
                          ) : (
                            <span className="text-gray-400">Nieaktywna</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditRule(rule)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => promptDelete('rule', rule.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nie ma jeszcze zdefiniowanych reguł przyznawania kart.</p>
                  <p className="text-sm mt-2">Kliknij "Dodaj regułę" aby stworzyć pierwszą.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="decks">
              <CardDecksManager 
                availableCards={specialCards}
                onSaveDeck={handleSaveDeck}
                onDeleteDeck={handleDeleteDeck}
                onActivateDeck={handleActivateDeck}
                initialDecks={cardDecks}
              />
            </TabsContent>
            
            <TabsContent value="assign">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Przydziel kartę graczowi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="player">Wybierz gracza</Label>
                        <Select 
                          value={selectedPlayer} 
                          onValueChange={setSelectedPlayer}
                        >
                          <SelectTrigger id="player">
                            <SelectValue placeholder="Wybierz gracza" />
                          </SelectTrigger>
                          <SelectContent>
                            {players.map(player => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="card">Wybierz kartę</Label>
                        <Select 
                          value={currentCard.id} 
                          onValueChange={(value) => {
                            const card = specialCards.find(c => c.id === value);
                            if (card) setCurrentCard(card);
                          }}
                        >
                          <SelectTrigger id="card">
                            <SelectValue placeholder="Wybierz kartę" />
                          </SelectTrigger>
                          <SelectContent>
                            {specialCards.map(card => (
                              <SelectItem key={card.id} value={card.id}>
                                {card.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {currentCard.id && (
                        <div className="flex justify-center my-4">
                          <CardDisplay card={currentCard} size="medium" />
                        </div>
                      )}
                      
                      <Button 
                        className="w-full"
                        onClick={handleGiveCardToPlayer}
                        disabled={!selectedPlayer || !currentCard.id}
                      >
                        Przydziel kartę
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Karty graczy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPlayer ? (
                      <>
                        <div className="mb-4">
                          <h3 className="text-lg font-medium">
                            {players.find(p => p.id === selectedPlayer)?.name}
                          </h3>
                        </div>
                        
                        {players.find(p => p.id === selectedPlayer)?.specialCards?.length ? (
                          <div className="grid grid-cols-2 gap-4">
                            {players.find(p => p.id === selectedPlayer)?.specialCards?.map(cardId => {
                              const card = specialCards.find(c => c.id === cardId);
                              return card ? (
                                <div key={cardId} className="border rounded p-3 flex flex-col items-center">
                                  <CardDisplay card={card} size="small" />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2 w-full"
                                    onClick={() => {
                                      usePlayerCard(selectedPlayer, cardId);
                                      toast.success('Karta została użyta');
                                    }}
                                  >
                                    Usuń
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p>Gracz nie posiada żadnych kart</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>Wybierz gracza, aby zobaczyć jego karty</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Card Form Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edytuj kartę' : 'Dodaj nową kartę'}</DialogTitle>
            <DialogDescription>
              Wypełnij poniższy formularz, aby {isEditing ? 'edytować' : 'dodać'} kartę specjalną.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nazwa karty</Label>
              <Input 
                id="name" 
                value={currentCard.name} 
                onChange={(e) => setCurrentCard({...currentCard, name: e.target.value})}
                placeholder="np. Dejavu"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea 
                id="description" 
                value={currentCard.description} 
                onChange={(e) => setCurrentCard({...currentCard, description: e.target.value})}
                placeholder="Krótki opis działania karty..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="iconName">Ikona</Label>
              <Select 
                value={currentCard.iconName || ''} 
                onValueChange={(value) => setCurrentCard({...currentCard, iconName: value})}
              >
                <SelectTrigger id="iconName">
                  <SelectValue placeholder="Wybierz ikonę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dejavu">Dejavu</SelectItem>
                  <SelectItem value="kontra">Kontra</SelectItem>
                  <SelectItem value="reanimacja">Reanimacja</SelectItem>
                  <SelectItem value="skip">Skip</SelectItem>
                  <SelectItem value="turbo">Turbo</SelectItem>
                  <SelectItem value="refleks">Refleks</SelectItem>
                  <SelectItem value="lustro">Lustro</SelectItem>
                  <SelectItem value="oświecenie">Oświecenie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="soundEffect">Dźwięk</Label>
              <Select 
                value={currentCard.soundEffect || 'card-reveal'} 
                onValueChange={(value) => setCurrentCard({...currentCard, soundEffect: value})}
              >
                <SelectTrigger id="soundEffect">
                  <SelectValue placeholder="Wybierz dźwięk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card-reveal">Domyślny</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                  <SelectItem value="wheel-tick">Tick</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="animationStyle">Styl animacji</Label>
              <Select 
                value={currentCard.animationStyle || 'glow'} 
                onValueChange={(value) => setCurrentCard({...currentCard, animationStyle: value})}
              >
                <SelectTrigger id="animationStyle">
                  <SelectValue placeholder="Wybierz styl animacji" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glow">Domyślny (Glow)</SelectItem>
                  <SelectItem value="neon-blue">Neon niebieski</SelectItem>
                  <SelectItem value="neon-green">Neon zielony</SelectItem>
                  <SelectItem value="neon-red">Neon czerwony</SelectItem>
                  <SelectItem value="neon-purple">Neon fioletowy</SelectItem>
                  <SelectItem value="rainbow">Tęczowy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="effectType">Typ efektu</Label>
              <Select 
                value={currentCard.effectType || 'points'} 
                onValueChange={(value) => setCurrentCard({...currentCard, effectType: value})}
              >
                <SelectTrigger id="effectType">
                  <SelectValue placeholder="Wybierz typ efektu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Punkty</SelectItem>
                  <SelectItem value="health">Życie</SelectItem>
                  <SelectItem value="block">Blokada</SelectItem>
                  <SelectItem value="skip">Pomiń</SelectItem>
                  <SelectItem value="steal">Kradzież</SelectItem>
                  <SelectItem value="redirect">Przekierowanie</SelectItem>
                  <SelectItem value="custom">Niestandardowy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSaveCard}>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Zapisz zmiany' : 'Dodaj kartę'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Advanced Editor Dialog */}
      <Dialog open={isAdvancedEditorOpen} onOpenChange={setIsAdvancedEditorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Zaawansowana edycja karty: {currentCard.name}</DialogTitle>
            <DialogDescription>
              Zdefiniuj dokładne działanie efektu karty przy użyciu kodu JavaScript
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <AdvancedCardEditor
              card={currentCard}
              onChange={(updates) => {
                setCurrentCard({...currentCard, ...updates});
                updateSpecialCard(currentCard.id, {...currentCard, ...updates});
              }}
              onTestEffect={handleTestCardEffect}
            />
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsAdvancedEditorOpen(false)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rule Form Dialog */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edytuj regułę' : 'Dodaj nową regułę'}</DialogTitle>
            <DialogDescription>
              Określ warunki przyznawania karty specjalnej.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardId">Karta</Label>
              <Select 
                value={currentRule.cardId} 
                onValueChange={(value) => setCurrentRule({...currentRule, cardId: value})}
              >
                <SelectTrigger id="cardId">
                  <SelectValue placeholder="Wybierz kartę" />
                </SelectTrigger>
                <SelectContent>
                  {specialCards.map(card => (
                    <SelectItem key={card.id} value={card.id}>{card.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="condition">Warunek</Label>
              <Select 
                value={currentRule.condition} 
                onValueChange={(value) => setCurrentRule({...currentRule, condition: value})}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Wybierz warunek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correct_answer">Poprawna odpowiedź</SelectItem>
                  <SelectItem value="incorrect_answer">Błędna odpowiedź</SelectItem>
                  <SelectItem value="round_start">Start rundy</SelectItem>
                  <SelectItem value="round_end">Koniec rundy</SelectItem>
                  <SelectItem value="random">Losowo</SelectItem>
                  <SelectItem value="points_milestone">Osiągnięcie punktów</SelectItem>
                  <SelectItem value="question_count">Co X pytań</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {currentRule.condition === 'points_milestone' && (
              <div className="grid gap-2">
                <Label htmlFor="pointsThreshold">Próg punktowy</Label>
                <Input 
                  id="pointsThreshold" 
                  type="number" 
                  min="100"
                  step="100"
                  value={currentRule.params?.pointsThreshold || 500} 
                  onChange={(e) => setCurrentRule({
                    ...currentRule, 
                    params: {
                      ...currentRule.params,
                      pointsThreshold: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            )}
            
            {currentRule.condition === 'question_count' && (
              <div className="grid gap-2">
                <Label htmlFor="questionInterval">Co ile pytań</Label>
                <Input 
                  id="questionInterval" 
                  type="number" 
                  min="1"
                  value={currentRule.params?.questionInterval || 3} 
                  onChange={(e) => setCurrentRule({
                    ...currentRule, 
                    params: {
                      ...currentRule.params,
                      questionInterval: parseInt(e.target.value)
                    }
                  })}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="probability">Szansa (%):</Label>
              <Input 
                id="probability" 
                type="number"
                min="1"
                max="100"
                value={currentRule.probability || 100} 
                onChange={(e) => setCurrentRule({
                  ...currentRule, 
                  probability: Math.max(1, Math.min(100, parseInt(e.target.value) || 100))
                })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="roundType">Runda</Label>
              <Select 
                value={String(currentRule.roundType || GameRound.ROUND_ONE)} 
                onValueChange={(value) => setCurrentRule({...currentRule, roundType: parseInt(value) as GameRound})}
              >
                <SelectTrigger id="roundType">
                  <SelectValue placeholder="Wybierz rundę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(GameRound.ROUND_ONE)}>Runda 1</SelectItem>
                  <SelectItem value={String(GameRound.ROUND_TWO)}>Runda 2</SelectItem>
                  <SelectItem value={String(GameRound.ROUND_THREE)}>Runda 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                id="isEnabled"
                checked={currentRule.isEnabled !== false} 
                onCheckedChange={(checked) => setCurrentRule({...currentRule, isEnabled: checked})}
              />
              <Label htmlFor="isEnabled">Aktywna</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSaveRule}>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Zapisz zmiany' : 'Dodaj regułę'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć {itemToDelete.type === 'card' ? 'kartę' : 'regułę'}? 
              Ta operacja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmDialog(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsCards;
