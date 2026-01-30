import React, { useState, useRef } from 'react';
import { Folder, FileText, ArrowLeft, Wand2, Upload, File, Sparkles, AlertTriangle, Trash2, Copy, Download } from 'lucide-react';
import { generateDeedDraft } from '../../services/geminiService';
import { extractTextFromDocx, saveAsDocx } from '../../services/docxService';


type ViewState = 'HOME' | 'PF_VARIANTS' | 'PJ_VARIANTS' | 'CUSTOM_AI';

interface UploadedModel {
  id: string;
  name: string;
  url: string;
  type: string;
  base64?: string;
  textContent?: string;
}

export const Models: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [customPrompt, setCustomPrompt] = useState('');
  const [contextText, setContextText] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados e Refs para Upload
  const [uploadedFiles, setUploadedFiles] = useState<UploadedModel[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const Card = ({ title, onClick, color = "bg-white" }: { title: string, onClick: () => void, color?: string }) => (
    <button
      onClick={onClick}
      className={`${color} p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all text-left flex flex-col items-start gap-4 h-48 justify-between group`}
    >
      <div className="bg-slate-100 p-3 rounded-full group-hover:bg-yellow-100 transition-colors">
        <Folder className="text-slate-600 group-hover:text-yellow-600" size={24} />
      </div>
      <span className="font-bold text-lg text-slate-800">{title}</span>
    </button>
  );

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove prefix (e.g., "data:application/pdf;base64,") to get raw base64
          const base64Content = reader.result.split(',')[1];
          resolve(base64Content);
        } else {
          reject('Failed to read file');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCustomGeneration = async () => {
    if (!customPrompt) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedDraft(''); // Clear previous

    // Prepare files for API
    const attachedFiles = uploadedFiles
      .filter(f => f.base64 && !f.textContent) // Only binary files (PDF/Images) that are NOT docx/text
      .map(f => ({
        mimeType: f.type,
        data: f.base64!
      }));

    // If there are DOCX files (text content), append them to the context text
    let finalContext = contextText;
    const textFiles = uploadedFiles.filter(f => f.textContent);

    if (textFiles.length > 0) {
      finalContext += "\n\n--- CONTEÚDO EXTRAÍDO DOS ARQUIVOS (DOCX) ---\n";
      textFiles.forEach(f => {
        finalContext += `\nARQUIVO: ${f.name}\n${f.textContent}\n`;
      });
      finalContext += "\n--- FIM DOS ARQUIVOS ---\n";
    }

    const result = await generateDeedDraft(customPrompt, finalContext, attachedFiles);

    // Simple check if the result looks like an error message returned from the service
    if (result.startsWith("Erro") || result.startsWith("Ocorreu um erro")) {
      setErrorMsg(result);
    } else {
      setGeneratedDraft(result);
    }

    setIsGenerating(false);
  };

  // Funções de Upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64Data = await readFileAsBase64(file);

        const newFile: UploadedModel = {
          id: Date.now().toString(),
          name: file.name,
          url: URL.createObjectURL(file), // Still valid for "Abrir Arquivo" preview link
          type: file.type,
          base64: base64Data
        };

        setUploadedFiles(prev => [...prev, newFile]);
      } catch (err) {
        console.error("Erro ao ler arquivo:", err);
        setErrorMsg("Erro ao processar o arquivo. Tente novamente.");
      }

      // Limpar o input para permitir selecionar o mesmo arquivo novamente se necessário
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Compra e Venda Pessoa Física" onClick={() => setView('PF_VARIANTS')} />
            <Card title="Compra e Venda Pessoa Jurídica" onClick={() => setView('PJ_VARIANTS')} />
            <Card title="Compra e Venda com Cessão" onClick={() => { }} />
            <Card title="Compra e Venda com Condição Resolutiva" onClick={() => { }} />
            <Card title="Doação" onClick={() => { }} />
            <Card title="Doação com Reserva de Usufruto" onClick={() => { }} />
            <Card title="Escritura Personalizada (IA)" onClick={() => setView('CUSTOM_AI')} color="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100" />
          </div>
        );
      case 'PF_VARIANTS':
        return (
          <div className="space-y-6">
            <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4">
              <ArrowLeft size={20} /> Voltar
            </button>
            <h2 className="text-2xl font-bold mb-6">Variantes: Pessoa Física</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="1 Vendedor e 1 Comprador" onClick={() => { }} />
              <Card title="1 Vendedor e 2 Compradores" onClick={() => { }} />
              <Card title="1 Vendedor e 1 Compradora" onClick={() => { }} />
              <Card title="2 Vendedores e 1 Comprador" onClick={() => { }} />
            </div>
          </div>
        );
      case 'PJ_VARIANTS':
        return (
          <div className="space-y-6">
            <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4">
              <ArrowLeft size={20} /> Voltar
            </button>
            <h2 className="text-2xl font-bold mb-6">Empresas Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="JR" onClick={() => { }} />
              <Card title="JR & Garcia" onClick={() => { }} />
              <Card title="Facttum" onClick={() => { }} />
              <Card title="MGQ" onClick={() => { }} />
              <Card title="Kinbor" onClick={() => { }} />
            </div>
          </div>
        );
      case 'CUSTOM_AI':
        return (
          <div className="space-y-6">
            <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4">
              <ArrowLeft size={20} /> Voltar
            </button>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
              <h2 className="text-2xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
                <Wand2 className="text-indigo-500" /> Assistente de Minutas (NotebookLM Simulado)
              </h2>
              <p className="text-gray-500 mb-6">
                Descreva a escritura desejada. A IA usará os arquivos carregados na seção "Meus Modelos" abaixo como fonte de conhecimento.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} /> Contexto / Modelo Base (Texto)
                  </label>
                  <textarea
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm font-mono bg-gray-50"
                    placeholder="Cole aqui o texto de uma escritura antiga, cláusulas específicas ou modelo que a IA deve imitar..."
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Sparkles size={16} /> O que você deseja lavrar?
                  </label>
                  <textarea
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Ex: Quero uma escritura de compra e venda onde a Vendedora é a JR, os compradores são João e Maria, usando o modelo em anexo (PDF)..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCustomGeneration}
                  disabled={isGenerating || !customPrompt}
                  className={`bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                >
                  {isGenerating ? 'Lendo Arquivos e Gerando...' : 'Gerar Minuta'}
                  {!isGenerating && <Wand2 size={18} />}
                </button>
              </div>

              {errorMsg && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
                  <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-bold">Falha na geração</h3>
                    <p className="text-sm">{errorMsg}</p>
                  </div>
                </div>
              )}

              {generatedDraft && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4">Minuta Gerada:</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-white p-4 rounded border overflow-x-auto max-h-[500px] overflow-y-auto">
                    {generatedDraft}
                  </pre>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedDraft)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Copy size={16} /> Copiar Texto
                    </button>

                    <button
                      onClick={() => saveAsDocx(generatedDraft)}
                      className="text-white bg-indigo-600 hover:bg-indigo-700 rounded px-3 py-1.5 flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      <Download size={16} /> Baixar .docx
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Modelos de Escritura</h1>

      {renderContent()}

      {/* Upload Section (Always visible at bottom) */}
      <div className="mt-16 border-t pt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Upload size={24} className="text-indigo-600" /> Meus Modelos (NotebookLM Local)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Arquivos enviados aqui servirão de contexto para a IA gerar suas escrituras (igual ao NotebookLM). Suporta PDF, DOCX (se abrir no navegador) ou TXT.
        </p>

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.txt,.docx,image/*"
          onChange={handleFileChange}
        />

        <div
          onClick={handleUploadClick}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-indigo-400 transition-colors cursor-pointer"
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 font-medium">Clique para adicionar arquivos de contexto</p>
          <p className="text-gray-400 text-sm mt-2">Suporta DOCX, PDF e Imagens</p>
        </div>

        <div className="mt-6 space-y-3">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border group">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" />
                <span className="font-medium text-gray-700">{file.name}</span>
                {file.base64 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Pronto para IA</span>}
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  Abrir Arquivo
                </a>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {uploadedFiles.length === 0 && (
            <p className="text-center text-gray-400 text-sm italic py-4">Nenhum arquivo de contexto carregado.</p>
          )}
        </div>
      </div>
    </div>
  );
};