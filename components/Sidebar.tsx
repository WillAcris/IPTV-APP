import React from 'react';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}> = ({ icon, label, isActive, onClick, isCollapsed }) => {
  return (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className={`ml-4 font-medium ${isCollapsed ? 'hidden' : 'block'}`}>{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isCollapsed, onToggle }) => {
  const { HOME, CHANNEL_LIST, SETTINGS } = { 
      HOME: 'HOME' as Page,
      CHANNEL_LIST: 'CHANNEL_LIST' as Page,
      SETTINGS: 'SETTINGS' as Page,
  };
    
  return (
    <aside className={`bg-white dark:bg-slate-800 p-4 flex-col shadow-2xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} hidden md:flex`}>
      <div className="flex items-center mb-8">
        <div className="p-2 bg-blue-600 rounded-lg cursor-pointer" onClick={onToggle} title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        {!isCollapsed && <h1 className="ml-3 text-2xl font-bold text-slate-800 dark:text-white">IPTV Player</h1>}
      </div>
      <nav>
        <ul>
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
            label="Início"
            isActive={currentPage === HOME}
            onClick={() => setCurrentPage(HOME)}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
            label="Lista de Canais"
            isActive={currentPage === CHANNEL_LIST}
            onClick={() => setCurrentPage(CHANNEL_LIST)}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Configurações"
            isActive={currentPage === SETTINGS}
            onClick={() => setCurrentPage(SETTINGS)}
            isCollapsed={isCollapsed}
          />
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="mt-auto text-center text-xs text-gray-400 dark:text-gray-500">
          <p>React IPTV Player v1.0</p>
          <p>&copy; 2024</p>
        </div>
      )}
    </aside>
  );
};