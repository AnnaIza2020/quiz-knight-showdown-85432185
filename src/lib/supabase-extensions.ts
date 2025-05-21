
import { supabase } from './supabase';

/**
 * Gets the list of used question IDs
 * @returns Promise with the list of used question IDs
 */
export const getUsedQuestions = async () => {
  try {
    const { data, error } = await supabase
      .from('used_questions')
      .select('question_id');
    
    if (error) throw error;
    
    return { 
      success: true, 
      data: data.map(item => item.question_id)
    };
  } catch (error) {
    console.error('Error fetching used questions:', error);
    return { 
      success: false, 
      data: [] 
    };
  }
};

/**
 * Restores a question by removing it from used questions
 * @param questionId The ID of the question to restore
 * @returns Promise with success status
 */
export const restoreQuestion = async (questionId: string) => {
  try {
    const { error } = await supabase
      .from('used_questions')
      .delete()
      .eq('question_id', questionId);
    
    if (error) throw error;
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Error restoring question:', error);
    return { 
      success: false 
    };
  }
};
