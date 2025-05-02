
import { supabase } from '@/lib/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export class AuthService {
  // Zaloguj się używając emaila i hasła
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return {
        user: data?.user || null,
        session: data?.session || null,
        error: error || null
      };
    } catch (error) {
      console.error('Błąd logowania:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError || new Error('Nieznany błąd podczas logowania')
      };
    }
  }

  // Rejestracja nowego użytkownika
  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      return {
        user: data?.user || null,
        session: data?.session || null,
        error: error || null
      };
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError || new Error('Nieznany błąd podczas rejestracji')
      };
    }
  }

  // Wylogowanie
  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Błąd wylogowania:', error);
      return {
        error: error as AuthError || new Error('Nieznany błąd podczas wylogowania')
      };
    }
  }

  // Pobranie aktualnie zalogowanego użytkownika
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await supabase.auth.getUser();
      return data?.user || null;
    } catch (error) {
      console.error('Błąd pobierania użytkownika:', error);
      return null;
    }
  }

  // Pobranie aktualnej sesji
  static async getSession(): Promise<Session | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data?.session || null;
    } catch (error) {
      console.error('Błąd pobierania sesji:', error);
      return null;
    }
  }

  // Resetowanie hasła
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Błąd resetowania hasła:', error);
      return {
        error: error as AuthError || new Error('Nieznany błąd podczas resetowania hasła')
      };
    }
  }

  // Aktualizacja hasła
  static async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      return { error };
    } catch (error) {
      console.error('Błąd aktualizacji hasła:', error);
      return {
        error: error as AuthError || new Error('Nieznany błąd podczas aktualizacji hasła')
      };
    }
  }
}
