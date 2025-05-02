
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface UserRole {
  id: string;
  email: string;
  role: 'Admin' | 'Moderator' | 'Prowadzący' | 'Obserwator';
}

interface LogEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
}

const SettingsRoles = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Prowadzący' | 'Moderator' | 'Admin'>('Prowadzący');
  const [copyEmails, setCopyEmails] = useState(false);
  const [allowObservers, setAllowObservers] = useState(true);
  const [trackUserActions, setTrackUserActions] = useState(true);
  
  // Mock users
  const users: UserRole[] = [
    { id: '1', email: 'admin@example.com', role: 'Admin' },
    { id: '2', email: 'mod@example.com', role: 'Moderator' },
    { id: '3', email: 'host@example.com', role: 'Prowadzący' },
  ];
  
  // Mock logs
  const logs: LogEntry[] = [
    { 
      id: '1', 
      user: 'Admin', 
      role: 'Admin', 
      action: 'Dodano nową rundę: Koło Chaosu',
      timestamp: '2023-10-15 14:32' 
    },
    { 
      id: '2', 
      user: 'Moderator', 
      role: 'Moderator', 
      action: 'Dodano 5 nowych pytań',
      timestamp: '2023-10-15 14:45' 
    },
    { 
      id: '3', 
      user: 'Admin', 
      role: 'Admin', 
      action: 'Zmieniono ustawienia kart',
      timestamp: '2023-10-15 15:10' 
    },
    { 
      id: '4', 
      user: 'Prowadzący', 
      role: 'Prowadzący', 
      action: 'Rozpoczęto rundę: Standardowa',
      timestamp: '2023-10-15 16:00' 
    },
    { 
      id: '5', 
      user: 'System', 
      role: 'System', 
      action: 'Automatyczne zapisanie stanu gry',
      timestamp: '2023-10-15 16:30' 
    },
  ];
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Role i dostępy</h2>
      <p className="text-white/60 text-sm mb-6">
        Zarządzanie uprawnieniami i dostępem do systemu.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Invite & role descriptions */}
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Zaproś użytkownika</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="np. user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Rola</Label>
                <select 
                  id="role"
                  className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-white"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                >
                  <option value="Prowadzący">Prowadzący</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <Button className="w-full bg-neon-blue hover:bg-neon-blue/80">
                Wyślij zaproszenie
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Link dla obserwatora</h3>
            <p className="text-sm text-white/70 mb-3">
              Wygeneruj link tylko do podglądu (bez możliwości ingerencji).
            </p>
            
            <Button className="w-full border-gray-700 text-white" variant="outline">
              Wygeneruj link obserwatora
            </Button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Opisy ról</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Admin</h4>
                <p className="text-sm text-white/70">
                  Pełna kontrola nad systemem, ustawieniami i użytkownikami.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Moderator</h4>
                <p className="text-sm text-white/70">
                  Zarządzanie pytaniami, kategoriami i ustawieniami gry.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Prowadzący</h4>
                <p className="text-sm text-white/70">
                  Prowadzenie rozgrywki, wybór pytań i zarządzanie rundami.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Obserwator</h4>
                <p className="text-sm text-white/70">
                  Tylko podgląd rozgrywki bez możliwości interakcji.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - User management & logs */}
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Użytkownicy</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {users.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-black/30 border border-gray-800 rounded"
                >
                  <div>
                    <p className="font-medium text-white">{user.role}</p>
                    <p className="text-sm text-white/60">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      className="bg-black/50 border border-gray-700 text-white px-2 py-1 rounded text-sm"
                      value={user.role}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Prowadzący">Prowadzący</option>
                    </select>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 h-8">
                      Usuń
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Logi zmian</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {logs.map(log => (
                <div 
                  key={log.id}
                  className="p-2 border-b border-gray-800 last:border-b-0"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{log.user}</span>
                    <span className="text-xs text-white/60">{log.timestamp}</span>
                  </div>
                  <p className="text-sm">{log.action}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Ustawienia prywatności</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="track-actions" 
                  checked={trackUserActions} 
                  onCheckedChange={(checked) => setTrackUserActions(!!checked)} 
                />
                <Label htmlFor="track-actions" className="text-white cursor-pointer">
                  Rejestruj wszystkie działania użytkowników
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-emails" 
                  checked={copyEmails} 
                  onCheckedChange={(checked) => setCopyEmails(!!checked)} 
                />
                <Label htmlFor="show-emails" className="text-white cursor-pointer">
                  Pokaż adresy e-mail graczy innym prowadzącym
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="allow-observers" 
                  checked={allowObservers} 
                  onCheckedChange={(checked) => setAllowObservers(!!checked)} 
                />
                <Label htmlFor="allow-observers" className="text-white cursor-pointer">
                  Zezwalaj na dołączanie obserwatorów
                </Label>
              </div>
              
              <Button className="w-full mt-2 bg-neon-blue hover:bg-neon-blue/80">
                Zapisz ustawienia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsRoles;
