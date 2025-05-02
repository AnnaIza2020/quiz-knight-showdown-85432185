
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { Player, Question, Category } from '@/context/GameContext';
import NeonLogo from '@/components/NeonLogo';

const Settings = () => {
  const { 
    players, 
    categories, 
    addPlayer, 
    updatePlayer,
    removePlayer,
    addCategory,
    removeCategory,
    setGameLogo,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl,
    gameLogo,
    primaryColor,
    secondaryColor,
    hostCameraUrl
  } = useGameContext();
  
  // State for form inputs
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    cameraUrl: '',
    points: 0,
    health: 100,
    lives: 3,
    isActive: false,
    isEliminated: false
  });
  
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    questions: []
  });
  
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    category: '',
    difficulty: 5,
    question: '',
    answer: '',
    options: ['', '', '', ''],
    imageUrl: ''
  });
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  // Function to generate a random ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
  };
  
  // Add new player
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPlayer.name) return;
    
    const player: Player = {
      id: generateId(),
      name: newPlayer.name || '',
      cameraUrl: newPlayer.cameraUrl || '',
      points: 0,
      health: 100,
      lives: 3,
      isActive: false,
      isEliminated: false
    };
    
    addPlayer(player);
    setNewPlayer({
      name: '',
      cameraUrl: '',
      points: 0,
      health: 100,
      lives: 3,
      isActive: false,
      isEliminated: false
    });
  };
  
  // Add new category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name) return;
    
    const category: Category = {
      id: generateId(),
      name: newCategory.name || '',
      questions: []
    };
    
    addCategory(category);
    setNewCategory({
      name: '',
      questions: []
    });
  };
  
  // Add new question to category
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategoryId || !newQuestion.question || !newQuestion.answer) return;
    
    const question: Question = {
      id: generateId(),
      category: categories.find(c => c.id === selectedCategoryId)?.name || '',
      difficulty: newQuestion.difficulty || 5,
      question: newQuestion.question || '',
      answer: newQuestion.answer || '',
      options: newQuestion.options?.filter(o => o.trim() !== '') || [],
      imageUrl: newQuestion.imageUrl || undefined
    };
    
    // Find the category and add the question
    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategoryId) {
        return {
          ...category,
          questions: [...category.questions, question]
        };
      }
      return category;
    });
    
    // Update categories
    addCategory(updatedCategories.find(c => c.id === selectedCategoryId)!);
    
    // Clear form
    setNewQuestion({
      category: '',
      difficulty: 5,
      question: '',
      answer: '',
      options: ['', '', '', ''],
      imageUrl: ''
    });
  };
  
  return (
    <div className="min-h-screen bg-neon-background p-4">
      <div className="flex justify-between items-center mb-6">
        <NeonLogo />
        
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-neon-blue">
            Strona główna
          </Link>
          <Link to="/overlay" className="text-white hover:text-neon-blue">
            Nakładka OBS
          </Link>
          <Link to="/host" className="text-white hover:text-neon-blue">
            Panel Hosta
          </Link>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 text-white">Panel Ustawień</h1>
      
      {/* Settings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Players section */}
        <div className="neon-card">
          <h2 className="text-xl font-bold mb-4 text-neon-pink">Gracze</h2>
          
          <form onSubmit={handleAddPlayer} className="mb-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-white mb-1">Nazwa gracza</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-black/50 border border-neon-pink/50 rounded text-white"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                  placeholder="Nazwa gracza"
                />
              </div>
              
              <div>
                <label className="block text-white mb-1">URL Kamery (VDO.Ninja)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-black/50 border border-neon-pink/50 rounded text-white"
                  value={newPlayer.cameraUrl}
                  onChange={(e) => setNewPlayer({...newPlayer, cameraUrl: e.target.value})}
                  placeholder="https://vdo.ninja/..."
                />
              </div>
              
              <button
                type="submit"
                className="neon-button"
              >
                Dodaj Gracza
              </button>
            </div>
          </form>
          
          <div className="max-h-64 overflow-y-auto pr-2">
            {players.length === 0 ? (
              <p className="text-white/60 text-center">Brak graczy. Dodaj graczy, aby rozpocząć.</p>
            ) : (
              <div className="space-y-2">
                {players.map(player => (
                  <div 
                    key={player.id}
                    className="flex justify-between items-center p-2 bg-black/30 rounded border border-neon-pink/30"
                  >
                    <div>
                      <div className="font-bold text-white">{player.name}</div>
                      <div className="text-xs text-white/60 truncate max-w-xs">
                        {player.cameraUrl || 'Brak kamery'}
                      </div>
                    </div>
                    
                    <button
                      className="text-neon-red hover:text-neon-pink"
                      onClick={() => removePlayer(player.id)}
                    >
                      Usuń
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Categories and questions section */}
        <div className="neon-card">
          <h2 className="text-xl font-bold mb-4 text-neon-blue">Kategorie i pytania</h2>
          
          <form onSubmit={handleAddCategory} className="mb-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-white mb-1">Nazwa kategorii</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-black/50 border border-neon-blue/50 rounded text-white"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Nazwa kategorii"
                />
              </div>
              
              <button
                type="submit"
                className="neon-button bg-gradient-to-r from-neon-blue to-neon-purple"
              >
                Dodaj Kategorię
              </button>
            </div>
          </form>
          
          <div className="max-h-64 overflow-y-auto mb-6 pr-2">
            {categories.length === 0 ? (
              <p className="text-white/60 text-center">Brak kategorii. Dodaj kategorie, aby móc dodawać pytania.</p>
            ) : (
              <div className="space-y-3">
                {categories.map(category => (
                  <div 
                    key={category.id}
                    className="p-2 bg-black/30 rounded border border-neon-blue/30"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-bold text-neon-blue">{category.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">
                          {category.questions.length} pytań
                        </span>
                        <button
                          className="text-neon-red hover:text-neon-pink"
                          onClick={() => removeCategory(category.id)}
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                    
                    {category.questions.length > 0 && (
                      <div className="pl-2 border-l-2 border-neon-blue/30 mt-2">
                        {category.questions.map(question => (
                          <div 
                            key={question.id}
                            className="text-sm py-1 border-b border-white/10 last:border-b-0"
                          >
                            <div className="flex justify-between">
                              <span className="text-white truncate max-w-xs">{question.question}</span>
                              <span className="text-neon-yellow ml-2">{question.difficulty} pkt</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Add question form */}
          {categories.length > 0 && (
            <>
              <h3 className="text-lg font-bold mb-2 text-neon-purple">Dodaj pytanie</h3>
              <form onSubmit={handleAddQuestion}>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-white mb-1">Kategoria</label>
                    <select
                      className="w-full px-3 py-2 bg-black/50 border border-neon-purple/50 rounded text-white"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Wybierz kategorię</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-1">Trudność (punkty)</label>
                    <select
                      className="w-full px-3 py-2 bg-black/50 border border-neon-purple/50 rounded text-white"
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({...newQuestion, difficulty: Number(e.target.value)})}
                      required
                    >
                      <option value={5}>5 punktów</option>
                      <option value={10}>10 punktów</option>
                      <option value={15}>15 punktów</option>
                      <option value={20}>20 punktów</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-1">Pytanie</label>
                    <textarea
                      className="w-full px-3 py-2 bg-black/50 border border-neon-purple/50 rounded text-white"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                      placeholder="Treść pytania"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-1">Odpowiedź</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-neon-purple/50 rounded text-white"
                      value={newQuestion.answer}
                      onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
                      placeholder="Poprawna odpowiedź"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-1">Opcje odpowiedzi (opcjonalnie)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(newQuestion.options || []).map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          className="px-3 py-2 bg-black/50 border border-neon-purple/30 rounded text-white"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(newQuestion.options || [])];
                            newOptions[index] = e.target.value;
                            setNewQuestion({...newQuestion, options: newOptions});
                          }}
                          placeholder={`Opcja ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-1">URL obrazu (opcjonalnie)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/50 border border-neon-purple/50 rounded text-white"
                      value={newQuestion.imageUrl}
                      onChange={(e) => setNewQuestion({...newQuestion, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="neon-button bg-gradient-to-r from-neon-purple to-neon-pink"
                  >
                    Dodaj pytanie
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        
        {/* General settings section */}
        <div className="neon-card md:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-neon-green">Ustawienia ogólne</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2 text-white">Branding i kolory</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-white mb-1">Logo URL (opcjonalnie)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-black/50 border border-neon-green/50 rounded text-white"
                    value={gameLogo || ''}
                    onChange={(e) => setGameLogo(e.target.value || null)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-1">Kolor podstawowy</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      className="h-10 w-10 rounded cursor-pointer"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full ml-2 px-3 py-2 bg-black/50 border border-neon-green/50 rounded text-white"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white mb-1">Kolor dodatkowy</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      className="h-10 w-10 rounded cursor-pointer"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full ml-2 px-3 py-2 bg-black/50 border border-neon-green/50 rounded text-white"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2 text-white">Ustawienia streamu</h3>
              
              <div>
                <label className="block text-white mb-1">URL kamery hosta (VDO.Ninja)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-black/50 border border-neon-green/50 rounded text-white"
                  value={hostCameraUrl}
                  onChange={(e) => setHostCameraUrl(e.target.value)}
                  placeholder="https://vdo.ninja/..."
                />
                <p className="text-xs text-white/60 mt-1">
                  Użyj VDO.Ninja aby podłączyć kamerę hosta i graczy.
                </p>
              </div>
              
              <div className="mt-6">
                <label className="block text-white mb-1">Instrukcje OBS</label>
                <div className="bg-black/30 p-3 rounded text-white/70 text-sm">
                  <p className="mb-2">
                    1. Dodaj źródło przeglądarki (Browser source) w OBS.
                  </p>
                  <p className="mb-2">
                    2. Jako URL wpisz adres nakładki: <code className="bg-black/50 px-1 rounded">[twój-url]/overlay</code>
                  </p>
                  <p>
                    3. Ustaw szerokość: 1920px, wysokość: 1080px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
