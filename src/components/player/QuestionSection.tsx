
import React from 'react';

interface QuestionSectionProps {
  question?: {
    text: string;
    category?: string;
  };
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ question }) => {
  if (!question) return null;
  
  return (
    <div className="mb-6 p-4 bg-black/40 border border-white/20 rounded-lg">
      {question.category && (
        <div className="mb-2 text-sm text-white/70 uppercase tracking-wider">
          {question.category}
        </div>
      )}
      <div className="text-xl font-medium text-white">
        {question.text}
      </div>
    </div>
  );
};

export default QuestionSection;
