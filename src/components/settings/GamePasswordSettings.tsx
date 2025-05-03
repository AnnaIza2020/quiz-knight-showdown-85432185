
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { PasswordSettings, safeJsonParse } from '@/types/supabase-custom-types';

const passwordSchema = z.object({
  enabled: z.boolean(),
  password: z.string().min(1, { message: 'Hasło jest wymagane' }),
  attempts: z.number().int().min(1).max(10),
  expiresAfter: z.number().int().min(1).max(24),
});

const defaultPasswordSettings: PasswordSettings = {
  enabled: false,
  password: '1234',
  attempts: 3,
  expiresAfter: 24,
};

const GamePasswordSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<PasswordSettings>({
    resolver: zodResolver(passwordSchema),
    defaultValues: defaultPasswordSettings,
  });

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from('game_settings')
          .select('*')
          .eq('id', 'password_settings')
          .single();

        if (error) {
          console.error('Error loading password settings:', error);
          
          // Fallback to localStorage
          const localSettings = safeJsonParse<PasswordSettings>(
            localStorage.getItem('gamePasswordSettings'),
            defaultPasswordSettings
          );
          
          form.reset(localSettings);
        } else if (data?.value) {
          form.reset(data.value as PasswordSettings);
        }
      } catch (err) {
        console.error('Unexpected error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [form]);

  const onSubmit = async (values: PasswordSettings) => {
    setIsSaving(true);
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('game_settings')
        .upsert(
          { id: 'password_settings', value: values },
          { onConflict: 'id' }
        );

      if (error) {
        console.error('Error saving password settings to Supabase:', error);
        
        // Fallback to localStorage
        localStorage.setItem('gamePasswordSettings', JSON.stringify(values));
      }

      toast.success('Ustawienia hasła zapisane');
    } catch (err) {
      console.error('Unexpected error saving settings:', err);
      toast.error('Błąd podczas zapisywania ustawień hasła');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Hasło dostępu do gry</h2>
      <p className="text-white/60 text-sm mb-6">
        Ustaw hasło dostępu dla graczy, aby zapewnić bezpieczne dołączanie do gry
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4 bg-black/30">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Wymagaj hasła</FormLabel>
                  <FormDescription className="text-sm text-white/60">
                    Gracze będą musieli podać hasło, aby dołączyć do gry
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading || isSaving}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch('enabled') && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasło</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Wpisz hasło dla graczy"
                        disabled={isLoading || isSaving}
                        className="bg-black/40 border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormDescription>
                      Hasło, które gracze będą musieli wpisać, aby dołączyć
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liczba dozwolonych prób ({field.value})</FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
                        disabled={isLoading || isSaving}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription>
                      Ile prób będzie miał gracz na wprowadzenie poprawnego hasła
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAfter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Czas ważności hasła ({field.value} godz.)</FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={24}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
                        disabled={isLoading || isSaving}
                        className="py-4"
                      />
                    </FormControl>
                    <FormDescription>
                      Po ilu godzinach gracz będzie musiał ponownie wprowadzić hasło
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}

          <Button
            type="submit"
            className="bg-neon-green hover:bg-neon-green/80 text-black px-8 py-2"
            disabled={isLoading || isSaving || !form.formState.isDirty}
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GamePasswordSettings;
