
import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SettingsLayout from './SettingsLayout';

const passwordSchema = z.object({
  password: z.string().min(4, {
    message: "Hasło musi mieć co najmniej 4 znaki.",
  })
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const GamePasswordSettings = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const generateRandomPassword = () => {
    // Generate a random 8-character password
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    form.setValue("password", result);
  };
  
  const onSubmit = async (data: PasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // First, check if we're using Supabase
      if (supabase) {
        const { error } = await supabase
          .from('game_settings')
          .upsert({ 
            id: 'password',
            value: data.password
          });
          
        if (error) throw error;
      } else {
        // Fallback to local storage
        localStorage.setItem('game_password', data.password);
      }
      
      toast.success('Hasło zostało zapisane', {
        description: 'Nowe hasło będzie wymagane przy logowaniu do panelu hosta'
      });
    } catch (error) {
      console.error('Error saving password:', error);
      toast.error('Nie udało się zapisać hasła', {
        description: 'Spróbuj ponownie później'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsLayout 
      title="Ustawienia Hasła" 
      description="Ustaw hasło dostępu do panelu hosta i administratora."
    >
      <div className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło do panelu hosta</FormLabel>
                  <div className="flex space-x-2">
                    <div className="relative flex-grow">
                      <FormControl>
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Wprowadź hasło"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={generateRandomPassword}
                    >
                      <RefreshCw size={18} />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Zapisywanie...' : <>
                <Save className="w-4 h-4 mr-2" /> Zapisz hasło
              </>}
            </Button>
          </form>
        </Form>
      </div>
    </SettingsLayout>
  );
};

export default GamePasswordSettings;
