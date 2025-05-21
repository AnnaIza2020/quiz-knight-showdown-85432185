
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuestionsContext } from '@/context/QuestionsContext';
import { Question, Category } from '@/types/game-types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionDifficultyBadge } from './QuestionDifficultyBadge';
import { toast } from 'sonner';
import { createQuestionWithDefaults } from '@/utils/createQuestionWithDefaults';

interface QuestionFormProps {
  onSubmit: (data: Question) => void;
  initialData?: Partial<Question>;
  categories: Category[];
  currentCategoryId?: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  categories,
  currentCategoryId
}) => {
  const [options, setOptions] = useState<string[]>(initialData.options || ['', '', '', '']);
  const [difficulty, setDifficulty] = useState<number>(initialData.difficulty || 1);
  const [formState, setFormState] = useState<Partial<Question>>({
    ...initialData,
    imageUrl: initialData.imageUrl || initialData.image_url || '' // Handle both property names
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData.categoryId || currentCategoryId || ''
  );

  // Handle form submission
  const handleSubmitForm = (question: Question) => {
    // Ensure compatibility with both naming conventions
    if (question.imageUrl) {
      question.image_url = question.imageUrl;
    }

    if (options.length > 0 && options.filter(Boolean).length > 0) {
      question.options = options.filter(Boolean);
    }
    
    question.difficulty = difficulty;
    question.categoryId = selectedCategory;

    // Create a complete question with defaults
    const fullQuestion = createQuestionWithDefaults(question);
    
    onSubmit(fullQuestion);
  };

  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setDifficulty(Number(value));
  };

  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Handle adding a new option
  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  // Handle removing an option
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error('Przynajmniej dwie opcje są wymagane');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  // Form schema
  const formSchema = z.object({
    text: z.string().min(1, 'Treść pytania jest wymagana'),
    correctAnswer: z.string().min(1, 'Poprawna odpowiedź jest wymagana'),
    categoryId: z.string().min(1, 'Kategoria jest wymagana'),
    imageUrl: z.string().optional(),
  });

  // Create form
  const form = useForm<Question>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: initialData.text || initialData.question || '',
      correctAnswer: initialData.correctAnswer || initialData.answer || '',
      categoryId: initialData.categoryId || currentCategoryId || '',
      imageUrl: initialData.imageUrl || initialData.image_url || '',
    },
  });

  // Apply selected category to form
  useEffect(() => {
    if (selectedCategory) {
      form.setValue('categoryId', selectedCategory);
    }
  }, [selectedCategory, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCategory(value);
                }}
                defaultValue={field.value}
                value={selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treść pytania</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Wpisz treść pytania" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poprawna odpowiedź</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz poprawną odpowiedź" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Trudność</FormLabel>
          <div className="flex items-center gap-2 mt-2">
            {[5, 10, 15, 20].map((value) => (
              <Button
                key={value}
                type="button"
                variant={difficulty === value ? "default" : "outline"}
                onClick={() => handleDifficultyChange(value.toString())}
                className="flex-1"
              >
                <QuestionDifficultyBadge difficulty={value} />
              </Button>
            ))}
          </div>
        </div>

        <div>
          <FormLabel>Opcje odpowiedzi</FormLabel>
          <div className="space-y-2 mt-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Opcja ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    -
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddOption}
              className="w-full"
            >
              Dodaj opcję
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL obrazka (opcjonalnie)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit">
            {initialData.id ? 'Aktualizuj pytanie' : 'Dodaj pytanie'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
