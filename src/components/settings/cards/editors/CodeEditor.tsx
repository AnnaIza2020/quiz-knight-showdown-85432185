
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onSave: () => void;
  isValid: boolean;
  errorMessage?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onCodeChange, 
  onSave, 
  isValid, 
  errorMessage 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="effectHook">
        Kod efektu (JavaScript)
      </Label>
      <div className="relative">
        <Textarea 
          id="effectHook" 
          className="font-mono h-80 bg-black/50"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
        />
        {!isValid && (
          <div className="mt-2 text-destructive flex items-start">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={onSave}
        >
          Zapisz kod
        </Button>
      </div>
    </div>
  );
};

export default CodeEditor;
