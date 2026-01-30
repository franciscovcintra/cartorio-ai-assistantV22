import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, FileText, MessageCircle, LogIn, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  // Don't show public navbar on dashboard routes
  if (location.pathname.startsWith('/dashboard')) return null;

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Home className="h-6 w-6 text-yellow-500" />
            <Link to="/" className="font-bold text-xl tracking-tight">Cartório<span className="text-yellow-500">AI</span></Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a 
              href="https://franciscovccassiano.pythonanywhere.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
            >
              <Calculator size={18} /> Calculadora de Custas
            </a>
            <Link to="/documentos" className="hover:text-yellow-400 flex items-center gap-1 transition-colors">
              <FileText size={18} /> Documentos Necessários
            </Link>
            <a 
              href="https://api.whatsapp.com/send/?phone=551334990090&text&type=phone_number&app_absent=0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-400 flex items-center gap-1 transition-colors"
            >
              <MessageCircle size={18} /> Fale com um Escrevente
            </a>
            <Link 
              to="/login" 
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2 rounded-md font-medium flex items-center gap-1 transition-colors"
            >
              <LogIn size={18} /> Login do Escrevente
            </Link>
          </div>
          
          {/* Mobile menu button simplified */}
          <div className="md:hidden">
             <Link to="/login" className="text-yellow-500">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};