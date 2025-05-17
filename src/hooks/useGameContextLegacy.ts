
import { useGameContext } from '@/context/GameContext';
import { useQuestionsContext } from '@/context/QuestionsContext';
import { useSpecialCardsContext } from '@/context/SpecialCardsContext';
import { GameContextType } from '@/types/game-types';

/**
 * This hook combines all contexts to maintain backward compatibility
 * with the original useGameContext API while we transition to the new
 * architecture with separate contexts.
 * 
 * Use this hook in components that haven't been updated to use the specific contexts yet.
 */
export const useGameContextLegacy = (): GameContextType => {
  const gameContext = useGameContext();
  const questionsContext = useQuestionsContext();
  const specialCardsContext = useSpecialCardsContext();
  
  // Merge all contexts into one
  return {
    ...gameContext,
    // Override with functions from QuestionsContext
    addQuestion: questionsContext.addQuestion,
    removeQuestion: questionsContext.removeQuestion,
    updateQuestion: questionsContext.updateQuestion,
    markQuestionAsUsed: questionsContext.markQuestionAsUsed,
    resetUsedQuestions: questionsContext.resetUsedQuestions,
    isQuestionUsed: questionsContext.isQuestionUsed,
    
    // Override with functions from SpecialCardsContext
    addSpecialCard: specialCardsContext.addSpecialCard,
    updateSpecialCard: specialCardsContext.updateSpecialCard,
    removeSpecialCard: specialCardsContext.removeSpecialCard,
    addSpecialCardRule: specialCardsContext.addSpecialCardRule,
    updateSpecialCardRule: specialCardsContext.updateSpecialCardRule,
    removeSpecialCardRule: specialCardsContext.removeSpecialCardRule,
    giveCardToPlayer: specialCardsContext.giveCardToPlayer,
    usePlayerCard: specialCardsContext.usePlayerCard
  };
};
