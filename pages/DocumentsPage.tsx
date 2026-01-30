import React from 'react';

export const DocumentsPage: React.FC = () => {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-10 text-center">Documentos Necessários</h1>
        
        <div className="space-y-8">
          {/* Section 1: PF x PF */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-yellow-500">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                Pessoa Física x Pessoa Física
              </h2>
              <div className="prose text-slate-600 max-w-none space-y-4">
                <h3 className="font-bold text-lg text-slate-900">DOCUMENTOS NECESSÁRIOS:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-slate-800">CPF E RG DOS COMPRADORES E VENDEDORES (INCLUINDO OS CÔNJUGES);</strong></li>
                  <li><strong className="text-slate-800">CERTIDÃO DE ESTADO CIVIL DOS COMPRADORES E VENDEDORES (casamento, nascimento, óbito, divórcio);</strong></li>
                  <li><strong className="text-slate-800">ESPELHO DO IPTU DO IMÓVEL;</strong></li>
                  <li><strong className="text-slate-800">CERTIDÃO DE MATRÍCULA DO IMÓVEL;</strong></li>
                </ul>
                <p className="italic bg-yellow-50 p-3 rounded text-sm border border-yellow-100">
                  Caso exista Pacto Antenupcial para regime diferente da comunhão parcial, enviar Registro do Pacto Antenupcial emitida pelo Registro de Imóvel.
                </p>
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                  <p><strong className="text-red-700">ATENÇÃO:</strong> Se a forma de pagamento do imóvel for transferência bancária, será necessário enviar os dados bancários tanto dos pagadores quanto dos recebedores;</p>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p><strong className="text-blue-700">CUSTAS:</strong> Para cálculo das custas é necessário enviar o Espelho do IPTU e o valor a ser declarado na compra e venda;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Construtoras */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-slate-500">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Construtoras
              </h2>
              <div className="prose text-slate-600 max-w-none space-y-4">
                <h3 className="font-bold text-lg text-slate-900">DOCUMENTOS NECESSÁRIOS:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-slate-800">CPF E RG DOS COMPRADORES (INCLUINDO OS CÔNJUGES);</strong></li>
                  <li><strong className="text-slate-800">CERTIDÃO DE ESTADO CIVIL DOS COMPRADORES (casamento, nascimento, óbito ou divórcio);</strong></li>
                  <li><strong className="text-slate-800">ESPELHO DO IPTU DO IMÓVEL (OU CERTIDÃO DE VALOR VENAL, SE FOR O CASO);</strong></li>
                  <li><strong className="text-slate-800">CERTIDÃO NEGATIVA DE IPTU;</strong></li>
                  <li><strong className="text-slate-800">CERTIDÃO NEGATIVA DE CONDOMÍNIO;</strong></li>
                  <li><strong className="text-slate-800">CONTRATO DE COMPRA DO IMÓVEL;</strong></li>
                </ul>
                <p className="italic bg-yellow-50 p-3 rounded text-sm border border-yellow-100">
                  Caso exista Pacto Antenupcial para regime diferente da comunhão parcial, enviar Registro do Pacto Antenupcial emitida pelo Registro de Imóvel.
                </p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p><strong className="text-blue-700">CUSTAS:</strong> Para cálculo das custas é necessário enviar o Espelho do IPTU e o contrato de compra e venda;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};