import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, FileStack, PlusCircle, Search, Calculator, LogOut, Calendar } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
    ${isActive(path) 
      ? 'bg-yellow-500 text-slate-900 font-semibold shadow-md' 
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
  `;

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 h-full overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-yellow-500">Cartório</span>Panel
        </h2>
        <p className="text-xs text-slate-400 mt-1">Área do Escrevente</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard/assinaturas" className={linkClass('/dashboard/assinaturas')}>
          <PenTool size={20} /> Assinaturas
        </Link>
        <Link to="/dashboard/agenda" className={linkClass('/dashboard/agenda')}>
          <Calendar size={20} /> Agenda
        </Link>
        <Link to="/dashboard/modelos" className={linkClass('/dashboard/modelos')}>
          <FileStack size={20} /> Modelos AI
        </Link>
        <Link to="/dashboard/add-modelos" className={linkClass('/dashboard/add-modelos')}>
          <PlusCircle size={20} /> Adicionar Modelos
        </Link>
        <Link to="/dashboard/analise" className={linkClass('/dashboard/analise')}>
          <Search size={20} /> Análise de Matrícula
        </Link>
        <Link to="/dashboard/calculadora" className={linkClass('/dashboard/calculadora')}>
          <Calculator size={20} /> Calculadora de Custas
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} /> Sair
        </Link>
      </div>
    </div>
  );
};