
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash, Edit } from 'lucide-react';
import SettingsLayout from '@/components/SettingsLayout';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  permissions: string[];
  color: string;
  description: string;
}

const SettingsRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Host',
      permissions: ['manage_game', 'manage_players', 'manage_questions', 'manage_cards'],
      color: '#00FFA3',
      description: 'Pełne uprawnienia do zarządzania grą'
    },
    {
      id: '2',
      name: 'Moderator',
      permissions: ['manage_players', 'view_stats'],
      color: '#00E0FF',
      description: 'Zarządzanie graczami i podgląd statystyk'
    },
    {
      id: '3',
      name: 'Gracz',
      permissions: ['participate'],
      color: '#8B5CF6',
      description: 'Uczestnictwo w grze'
    }
  ]);

  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    permissions: [],
    color: '#FF3E9D',
    description: ''
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);

  const availablePermissions = [
    { key: 'manage_game', label: 'Zarządzanie Grą' },
    { key: 'manage_players', label: 'Zarządzanie Graczami' },
    { key: 'manage_questions', label: 'Zarządzanie Pytaniami' },
    { key: 'manage_cards', label: 'Zarządzanie Kartami' },
    { key: 'view_stats', label: 'Podgląd Statystyk' },
    { key: 'participate', label: 'Uczestnictwo' },
    { key: 'moderate_chat', label: 'Moderacja Czatu' }
  ];

  const addRole = () => {
    if (!newRole.name || !newRole.description) {
      toast.error('Wypełnij wszystkie wymagane pola');
      return;
    }

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      permissions: newRole.permissions || [],
      color: newRole.color || '#FF3E9D',
      description: newRole.description
    };

    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', permissions: [], color: '#FF3E9D', description: '' });
    toast.success('Rola została dodana');
  };

  const removeRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
    toast.success('Rola została usunięta');
  };

  const togglePermission = (permission: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions?.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...(prev.permissions || []), permission]
    }));
  };

  return (
    <div className="space-y-6">
      <SettingsLayout 
        title="Zarządzanie Rolami" 
        description="Definiuj role użytkowników i ich uprawnienia w systemie"
      >
        <div className="space-y-6">
          <div className="grid gap-4">
            {roles.map((role) => (
              <div key={role.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" style={{ color: role.color }} />
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: role.color }}>
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-400">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(role.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeRole(role.id)}
                      disabled={role.name === 'Host'} // Nie można usunąć roli Host
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => {
                    const permLabel = availablePermissions.find(p => p.key === permission)?.label || permission;
                    return (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permLabel}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Dodaj Nową Rolę" 
        description="Stwórz nową rolę z określonymi uprawnieniami"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="roleName">Nazwa Roli</Label>
            <Input
              id="roleName"
              value={newRole.name || ''}
              onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
              placeholder="np. Asystent, Operator"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="roleDescription">Opis Roli</Label>
            <Input
              id="roleDescription"
              value={newRole.description || ''}
              onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Krótki opis uprawnień i obowiązków"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="roleColor">Kolor Roli</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input
                type="color"
                value={newRole.color}
                onChange={(e) => setNewRole(prev => ({ ...prev, color: e.target.value }))}
                className="w-16 h-10"
              />
              <Input
                value={newRole.color}
                onChange={(e) => setNewRole(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label>Uprawnienia</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {availablePermissions.map((permission) => (
                <label key={permission.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRole.permissions?.includes(permission.key) || false}
                    onChange={() => togglePermission(permission.key)}
                    className="rounded"
                  />
                  <span className="text-sm">{permission.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <Button onClick={addRole} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Dodaj Rolę
          </Button>
        </div>
      </SettingsLayout>
    </div>
  );
};

export default SettingsRoles;
