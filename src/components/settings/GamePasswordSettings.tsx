
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

  // Load settings from Supabase
  useEffect(() => {
    const loadPasswordSettings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('game_settings')
          .select('*')
          .eq('id', 'password_settings')
          .single();

        if (error) {
          console.error('Error loading password settings:', error);
          return;
        }

        if (data?.value) {
          // Safely parse JSON data with fallback to defaults
          const settings = safeJsonParse<PasswordSettings>(data.value, defaultPasswordSettings);
          form.reset(settings);
        }
      } catch (err) {
        console.error('Unexpected error loading password settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPasswordSettings();
  }, [form]);

  const onSubmit = async (data: PasswordSettings) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('game_settings')
        .upsert({
          id: 'password_settings',
          value: data as any, // Type assertion needed due to Json type constraints
        });

      if (error) {
        console.error('Error saving password settings:', error);
        toast.error('Błąd podczas zapisywania ustawień hasła');
        return;
      }

      toast.success('Ustawienia hasła zapisane');
    } catch (err) {
      console.error('Unexpected error saving password settings:', err);
      toast.error('Nieoczekiwany błąd');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10">
      <h2 className="text-xl font-bold mb-4">Hasło dostępu</h2>
      <p className="text-white/70 mb-6">
        Ustaw hasło dostępu dla graczy, którzy chcą dołączyć do gry.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Włącz hasło dostępu</FormLabel>
                  <FormDescription>
                    Wymagaj hasła od graczy dołączających do gry
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                      <Input placeholder="Wpisz hasło" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liczba prób: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Ilość prób przed zablokowaniem dostępu graczowi
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAfter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wygasa po: {field.value} godzinach</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={24}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Czas ważności dostępu po zalogowaniu
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" disabled={isSaving || isLoading} className="w-full">
            {isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GamePasswordSettings;
