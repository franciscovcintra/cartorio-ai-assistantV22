import React, { useState, useRef } from 'react';
import { Upload, FileText, Trash2, ExternalLink, File as FileIcon, Info } from 'lucide-react';

interface UploadedModel {
  id: string;
  name: string;
  url: string;
  type: string;
  date: string;
  isPublicSample: boolean;
}

export const AddModels: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Incluindo alguns modelos de exemplo com URLs públicas estáveis
  const [uploadedFiles, setUploadedFiles] = useState<UploadedModel[]>([
    { 
      id: 'sample-1', 
      name: 'Modelo_Publico_PDF_Exemplo.pdf', 
      // URL pública confiável para teste de visualização
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
      type: 'application/pdf',
      date: '2023-10-25',
      isPublicSample: true
    },
    { 
      id: 'sample-2', 
      name: 'Modelo_Publico_DOCX_Exemplo.docx', 
      // URL pública confiável
      url: 'https://filesamples.com/samples/document/docx/sample1.docx', 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      date: '2023-10-28',
      isPublicSample: true
    }
  ]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: UploadedModel = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file), 
        type: file.type,
        date: new Date().toLocaleDateString('pt-BR'),
        isPublicSample: false 
      };
      setUploadedFiles(prev => [newFile, ...prev]);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const openInGoogleDocs = (file: UploadedModel) => {
    if (file.isPublicSample) {
      // Encode URL para garantir que o Google Viewer processe corretamente
      const encodedUrl = encodeURIComponent(file.url);
      window.open(`https://docs.google.com/gview?url=${encodedUrl}&embedded=false`, '_blank');
    } else {
      // Lógica para arquivos locais
      if (file.type === 'application/pdf') {
        // PDFs locais o navegador consegue abrir nativamente
        window.open(file.url, '_blank');
      } else {
        // DOCX locais não abrem no navegador e nem no Google Docs (pois o Google não acessa localhost)
        // O comportamento padrão é download. Vamos avisar o usuário.
        const confirmDownload = window.confirm(
          "Limitação Técnica: Arquivos locais (.docx) não podem ser enviados diretamente para o visualizador do Google Docs sem um servidor de backend.\n\nDeseja baixar o arquivo para abrir no seu Word local?"
        );
        if (confirmDownload) {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Adicionar e Gerenciar Modelos</h1>
        <span className="text-sm text-gray-500">Gerencie seu acervo particular de minutas</span>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
        <Info className="text-blue-600 shrink-0 mt-1" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Sobre a Visualização</p>
          <p>Modelos marcados com "Online" abrirão no Google Docs Viewer. Arquivos que você fizer upload agora ("Local") serão abertos pelo seu navegador ou baixados, pois o Google Docs não consegue acessar arquivos do seu computador sem que eles estejam publicados na internet.</p>
        </div>
      </div>

      {/* Upload Area */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".docx,.doc,.pdf,.txt"
        onChange={handleFileChange}
      />

      <div 
        onClick={handleUploadClick}
        className="bg-white border-2 border-dashed border-indigo-300 rounded-xl p-12 text-center hover:bg-indigo-50 hover:border-indigo-500 transition-all cursor-pointer shadow-sm group mb-10"
      >
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
          <Upload className="text-indigo-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Fazer Upload de Novo Modelo</h3>
        <p className="text-gray-500 mt-2">Arraste e solte ou clique para selecionar</p>
        <p className="text-xs text-gray-400 mt-4 bg-white inline-block px-3 py-1 rounded-full border">
          Suporta DOCX, PDF e TXT
        </p>
      </div>

      {/* Cards Grid */}
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FileIcon size={24} className="text-slate-600" />
        Meus Arquivos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {uploadedFiles.map((file) => (
          <div 
            key={file.id} 
            onClick={() => openInGoogleDocs(file)}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            {/* Header / Icon */}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${file.name.endsWith('.pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                <FileText size={28} />
              </div>
              <button 
                onClick={(e) => removeFile(e, file.id)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                title="Excluir Modelo"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Content */}
            <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 h-12" title={file.name}>
              {file.name}
            </h3>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-400">{file.date}</span>
              <div className="flex items-center gap-2">
                {file.isPublicSample ? (
                   <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Online</span>
                ) : (
                   <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">Local</span>
                )}
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Visualizar <ExternalLink size={12} />
                </span>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
        
        {uploadedFiles.length === 0 && (
           <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
             <p className="text-gray-400">Nenhum modelo enviado ainda.</p>
           </div>
        )}
      </div>
    </div>
  );
};