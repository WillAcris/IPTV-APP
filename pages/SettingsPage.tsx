import React from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-300">Configurações</h1>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700 pb-2">Aparência</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tema</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecione o tema claro ou escuro. Atualmente: <span className="font-semibold">{theme === 'light' ? 'Claro' : 'Escuro'}</span>
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

      </div>
    </div>
  );
};