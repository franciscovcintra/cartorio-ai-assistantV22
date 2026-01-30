import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-800 text-white py-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} Cartório AI Assistant - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};