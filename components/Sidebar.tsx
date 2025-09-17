import React from 'react';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-400 hover:bg-slate-700 hover:text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const { HOME, CHANNEL_LIST, ABOUT } = { // Destructuring from a new object to avoid direct enum value usage in JSX for older bundlers
      HOME: 'HOME' as Page,
      CHANNEL_LIST: 'CHANNEL_LIST' as Page,
      ABOUT: 'ABOUT' as Page,
  };
    
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside
        className={`absolute top-0 left-0 h-full w-64 bg-slate-800 p-4 flex-col shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center mb-8 shrink-0">
          <div className="p-2 bg-blue-600 rounded-lg">
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
          <h1 className="ml-3 text-2xl font-bold text-white">IPTV Player</h1>
        </div>
        <nav className="flex-1">
          <ul>
            <NavItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
              label="Home"
              isActive={currentPage === HOME}
              onClick={() => setCurrentPage(HOME)}
            />
            <NavItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
              label="Channel List"
              isActive={currentPage === CHANNEL_LIST}
              onClick={() => setCurrentPage(CHANNEL_LIST)}
            />
            <NavItem
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="About"
              isActive={currentPage === ABOUT}
              onClick={() => setCurrentPage(ABOUT)}
            />
          </ul>
        </nav>
        <div className="mt-auto text-center text-xs text-gray-500 shrink-0">
          <p>React IPTV Player v1.0</p>
          <p>&copy; 2024</p>
        </div>
      </aside>
    </>
  );
};