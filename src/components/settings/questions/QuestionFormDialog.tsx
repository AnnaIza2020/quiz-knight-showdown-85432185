
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Question, Category } from '@/types/game-types';
import QuestionForm from './QuestionForm';

interface QuestionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  categories: Category[];
  editingQuestion?: Question | null;
}

const QuestionFormDialog: React.FC<QuestionFormDialogProps> = ({
  open,
  onClose,
  onSave,
  categories,
  editingQuestion
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0c0e1a] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? 'Edytuj pytanie' : 'Dodaj nowe pytanie'}
          </DialogTitle>
        </DialogHeader>
        
        <QuestionForm
          onSubmit={onSave}
          initialData={editingQuestion || {}}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuestionFormDialog;
