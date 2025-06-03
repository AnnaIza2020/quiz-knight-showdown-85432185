
import React, { useState, useCallback } from 'react';
import { useQuestionsContext } from '@/context/QuestionsContext';
import { Question, Category } from '@/types/interfaces';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import QuestionTable from './QuestionTable';
import QuestionForm from './QuestionForm';
import CategoryManager from './CategoryManager';
import { createQuestionWithDefaults } from '@/utils/createQuestionWithDefaults';

const Round3Questions: React.FC = () => {
  const { 
    categories, 
    addQuestion, 
    removeQuestion, 
    updateQuestion,
    findCategoryByQuestionId,
    isQuestionUsed
  } = useQuestionsContext();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  // Filter categories for Round 3
  const round3Categories = categories.filter(cat => cat.round === 3);
  
  // Get questions for selected category
  const questions = selectedCategory 
    ? round3Categories.find(cat => cat.id === selectedCategory)?.questions || []
    : [];
  
  // Add question handler
  const handleAddQuestion = (question: Question) => {
    if (selectedCategory) {
      const fullQuestion = createQuestionWithDefaults(question);
      addQuestion(selectedCategory, fullQuestion);
      setIsFormOpen(false);
    } else {
      toast.error('Wybierz kategorię, aby dodać pytanie');
    }
  };
  
  // Remove question handler
  const handleRemoveQuestion = (questionId: string) => {
    const category = findCategoryByQuestionId(questionId);
    if (category) {
      removeQuestion(category.id, questionId);
    } else {
      toast.error('Nie można znaleźć kategorii dla tego pytania');
    }
  };
  
  // Update question handler
  const handleUpdateQuestion = (question: Question) => {
    const category = findCategoryByQuestionId(question.id);
    if (category) {
      const fullQuestion = createQuestionWithDefaults(question);
      updateQuestion(category.id, fullQuestion);
      setEditingQuestion(null);
    } else {
      toast.error('Nie można znaleźć kategorii dla tego pytania');
    }
  };
  
  // Open form for adding a question
  const handleOpenForm = () => {
    setIsFormOpen(true);
    setEditingQuestion(null);
  };
  
  // Open form for editing a question
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };
  
  // Close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingQuestion(null);
  };

  // Toggle question used status (for QuestionTable)
  const handleToggleUsed = useCallback((questionId: string) => {
    console.log("Toggle used status for question:", questionId);
  }, []);

  // Convert categories to the expected type with proper round type
  const convertedCategories = round3Categories.map(cat => ({
    ...cat,
    description: cat.description || '',
    round: 3 as const, // Ensure round is treated as the literal value 3
    questions: cat.questions || []
  }));
  
  return (
    <div className="space-y-6">
      {/* Category Management */}
      <CategoryManager />
      
      {/* Category Selection */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Pytania na Runda 3</h3>
        <div className="flex items-center space-x-4">
          <label htmlFor="category" className="text-white block text-sm font-medium text-gray-700">
            Wybierz kategorię:
          </label>
          <select
            id="category"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Wszystkie kategorie</option>
            {round3Categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Add Question Button */}
      <Button onClick={handleOpenForm}>Dodaj pytanie</Button>
      
      {/* Question Form */}
      {isFormOpen && (
        <div className="border rounded-md p-4">
          <h4 className="text-lg font-semibold mb-4">
            {editingQuestion ? 'Edytuj pytanie' : 'Dodaj nowe pytanie'}
          </h4>
          <QuestionForm
            onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
            initialData={editingQuestion}
            categories={convertedCategories}
            currentCategoryId={selectedCategory || undefined}
          />
          <Button variant="secondary" onClick={handleCloseForm} className="mt-4">
            Anuluj
          </Button>
        </div>
      )}
      
      {/* Question Table */}
      {selectedCategory && (
        <QuestionTable
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleRemoveQuestion}
          onToggleUsed={handleToggleUsed}
        />
      )}
    </div>
  );
};

export default Round3Questions;
