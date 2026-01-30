import React from 'react';

export const FeeCalculator: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
       <div className="p-6 pb-2">
         <h1 className="text-3xl font-bold text-slate-800">Calculadora de Custas</h1>
         <p className="text-gray-500 mt-2">Ferramenta integrada de cálculo de emolumentos.</p>
       </div>
       <div className="flex-grow p-6 pt-0">
          <div className="w-full h-[800px] bg-white rounded-xl shadow-lg border overflow-hidden">
             <iframe 
               src="https://franciscovccassiano.pythonanywhere.com/" 
               title="Calculadora de Custas"
               className="w-full h-full border-0"
             />
          </div>
       </div>
    </div>
  );
};