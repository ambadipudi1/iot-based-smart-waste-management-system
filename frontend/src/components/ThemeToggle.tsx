import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-sidebar-accent"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4.5 h-4.5 text-sidebar-foreground opacity-70 hover:opacity-100" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-sidebar-foreground opacity-70 hover:opacity-100" />
      )}
    </button>
  );
}
