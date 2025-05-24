
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import Round1Questions from './questions/Round1Questions';
import Round2Questions from './questions/Round2Questions';
import Round3Questions from './questions/Round3Questions';
import { Download, Upload, Plus, Filter } from 'lucide-react';
import { useQuestions } from '@/hooks/useQuestions';
import QuestionFilters from './questions/QuestionFilters';
import QuestionTable from './questions/QuestionTable';
import QuestionFormDialog from './questions/QuestionFormDialog';
import ImportExportButtons from './questions/ImportExportButtons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Question } from '@/types/game-types';

const SettingsQuestions = () => {
  const [activeTab, setActiveTab] = useState('runda1');
  const [isQuestionsManagerTab, setIsQuestionsManagerTab] = useState(false);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<any | null>(null);

  const { categories, saveGameData, removeQuestion, updateQuestion, markQuestionAsUsed } = useGameContext();
  
  const { 
    questions,
    filteredQuestions,
    filters,
    setFilters,
    importQuestions,
    exportQuestions,
    resetUsedQuestions,
    isQuestionUsed
  } = useQuestions();
  
  // Handle tab change to detect if we're on the questions manager tab
  useEffect(() => {
    setIsQuestionsManagerTab(activeTab === 'manager');
  }, [activeTab]);
  
  const handleExportQuestions = () => {
    try {
      // Przygotowanie pełnych danych do eksportu
      const exportData = {
        categories,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Konwersja na JSON i utworzenie URL do pobrania
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Utworzenie linku do pobrania i symulacja kliknięcia
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `pytania_gameshow_${new Date().toLocaleDateString('pl-PL').replace(/\./g, '-')}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Pytania zostały wyeksportowane');
    } catch (error) {
      console.error('Błąd podczas eksportu pytań:', error);
      toast.error('Błąd podczas eksportu pytań');
    }
  };

  const handleImportQuestions = () => {
    // Utworzenie ukrytego input file i symulacja kliknięcia
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);
          
          // Implement import logic here
          const success = importQuestions(importData);
          if (success) {
            toast.success('Pytania zostały zaimportowane');
            saveGameData();
          }
          
        } catch (error) {
          console.error('Błąd podczas importu pytań:', error);
          toast.error('Nieprawidłowy format pliku');
        }
      };
      reader.readAsText(file);
    };
    
    fileInput.click();
  };
  
  // Handler for adding/editing a question
  const handleSaveQuestion = (question: Question) => {
    try {
      // Find category
      const category = categories.find(cat => cat.id === question.categoryId);
      if (!category) {
        toast.error('Nie znaleziono wybranej kategorii');
        return;
      }
      
      // For editing, we need to update the question in the category
      if (editingQuestion) {
        updateQuestion(question.categoryId, question);
        toast.success('Pytanie zostało zaktualizowane');
      } else {
        // For adding, we add the question to the category
        updateQuestion(question.categoryId, question);
        toast.success('Nowe pytanie zostało dodane');
      }
      
      saveGameData();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Wystąpił błąd podczas zapisywania pytania');
    }
  };
  
  // Open edit form for a question
  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setIsQuestionFormOpen(true);
  };
  
  // Confirm question deletion
  const handleDeleteConfirm = () => {
    if (!questionToDelete) return;
    
    try {
      removeQuestion(questionToDelete.categoryId, questionToDelete.id);
      toast.success('Pytanie zostało usunięte');
      saveGameData();
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Wystąpił błąd podczas usuwania pytania');
    }
  };
  
  // Open delete confirmation dialog
  const handleDeleteQuestion = (question: any) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };
  
  // Toggle question used state
  const handleToggleUsed = (question: any) => {
    if (!question) return;
    
    try {
      const isCurrentlyUsed = isQuestionUsed ? isQuestionUsed(question.id) : question.used;
      
      if (isCurrentlyUsed) {
        // If question is used, reset it
        resetUsedQuestions && resetUsedQuestions();
        toast.success('Status pytania zmieniono na "Nieużyte"');
      } else {
        // If question is not used, mark it as used
        markQuestionAsUsed && markQuestionAsUsed(question.id);
        toast.success('Status pytania zmieniono na "Użyte"');
      }
      
      saveGameData();
    } catch (error) {
      console.error('Error toggling question used state:', error);
      toast.error('Wystąpił błąd podczas zmiany statusu pytania');
    }
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2 text-white">Zarządzanie Pytaniami</h2>
          <p className="text-white/60 text-sm">
            Tutaj możesz dodawać, edytować i zarządzać pytaniami dla wszystkich trzech rund teleturnieju.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleExportQuestions}
          >
            <Download size={16} /> Eksportuj pytania
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
            onClick={handleImportQuestions}
          >
            <Upload size={16} /> Importuj pytania
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/30 w-full border-b border-gray-800 mb-6">
          <TabsTrigger 
            value="runda1" 
            className="data-[state=active]:text-neon-pink data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-pink rounded-none py-3"
          >
            Runda 1: Wiedza z Internetu
          </TabsTrigger>
          <TabsTrigger 
            value="runda2" 
            className="data-[state=active]:text-neon-blue data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue rounded-none py-3"
          >
            Runda 2: 5 Sekund
          </TabsTrigger>
          <TabsTrigger 
            value="runda3" 
            className="data-[state=active]:text-neon-purple data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-purple rounded-none py-3"
          >
            Runda 3: Koło Fortuny
          </TabsTrigger>
          <TabsTrigger 
            value="manager" 
            className="data-[state=active]:text-neon-green data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-green rounded-none py-3"
          >
            Menedżer pytań
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="runda1">
          <Round1Questions />
        </TabsContent>
        
        <TabsContent value="runda2">
          <Round2Questions />
        </TabsContent>
        
        <TabsContent value="runda3">
          <Round3Questions />
        </TabsContent>
        
        <TabsContent value="manager">
          <div className="space-y-6">
            {/* Header with add button and import/export */}
            <div className="flex justify-between items-center">
              <Button 
                onClick={() => {
                  setEditingQuestion(null);
                  setIsQuestionFormOpen(true);
                }}
                className="bg-neon-green hover:bg-neon-green/80 text-black gap-2"
              >
                <Plus size={16} /> Dodaj nowe pytanie
              </Button>
              
              <ImportExportButtons 
                onImport={importQuestions}
                onExport={exportQuestions}
                filteredCount={filteredQuestions.length}
                totalCount={questions.length}
              />
            </div>
            
            {/* Filters */}
            <QuestionFilters 
              filters={filters}
              onFilterChange={setFilters}
              categories={categories}
              totalQuestions={questions.length}
              filteredCount={filteredQuestions.length}
            />
            
            {/* Questions table */}
            <QuestionTable 
              questions={filteredQuestions}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onToggleUsed={handleToggleUsed}
            />
          </div>
          
          {/* Question form dialog - updated to use new component */}
          <QuestionFormDialog
            open={isQuestionFormOpen}
            onClose={() => {
              setIsQuestionFormOpen(false);
              setEditingQuestion(null);
            }}
            onSave={handleSaveQuestion}
            categories={categories}
            editingQuestion={editingQuestion}
          />
          
          {/* Delete confirmation dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-[#0c0e1a] border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Potwierdź usunięcie</DialogTitle>
                <DialogDescription>
                  Czy na pewno chcesz usunąć to pytanie? Ta operacja jest nieodwracalna.
                </DialogDescription>
              </DialogHeader>
              
              {questionToDelete && (
                <div className="py-4">
                  <p className="font-semibold text-white">{questionToDelete.text}</p>
                  <p className="text-sm text-gray-400 mt-2">Kategoria: {questionToDelete.categoryName || 'Nieznana'}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                  Usuń pytanie
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsQuestions;
