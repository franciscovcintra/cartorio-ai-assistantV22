import React, { useState, useRef } from 'react';
import { Upload, Search, FileImage, Loader2 } from 'lucide-react';
import { analyzeMatricula } from '../../services/geminiService';

export const Analysis: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAnalysis(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !preview) return;

    setLoading(true);
    // Extract base64 without the prefix
    const base64Data = preview.split(',')[1];
    const mimeType = file.type;

    const result = await analyzeMatricula(base64Data, mimeType);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Análise de Matrícula com IA</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Column */}
        <div>
          <div 
            className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors h-64 flex flex-col items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="relative w-full h-full">
                 <img src={preview} alt="Preview" className="w-full h-full object-contain rounded" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded">
                   <span className="text-white font-semibold">Trocar Imagem</span>
                 </div>
              </div>
            ) : (
              <>
                <FileImage className="text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 font-medium">Clique para selecionar a matrícula (Imagem ou PDF)</p>
                <p className="text-xs text-gray-400 mt-2">Formatos suportados: PNG, JPEG, WEBP</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Analisando Documento...
              </>
            ) : (
              <>
                <Search size={20} /> Analisar Matrícula
              </>
            )}
          </button>
        </div>

        {/* Results Column */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 min-h-[400px]">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Relatório da IA</h2>
          
          {analysis ? (
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
              {analysis}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>O resultado da análise aparecerá aqui.</p>
              <p className="text-sm mt-2">Aguardando envio do documento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};