import React, { useEffect, useState } from 'react';
import { generateHeroImage } from '../services/geminiService';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      // Try to generate image using Gemini
      const img = await generateHeroImage();
      if (img) {
        setHeroImage(img);
      } else {
        // Fallback image if API fails or key is missing
        setHeroImage('https://picsum.photos/1920/1080'); 
      }
      setLoading(false);
    };

    fetchImage();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-slate-900 h-[600px] flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="animate-pulse bg-slate-800 w-full h-full absolute inset-0"></div>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img 
              src={heroImage || ""} 
              alt="Cartório" 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </>
        )}
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Cartório <span className="text-yellow-500">Shoji</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-200 mb-10 max-w-2xl mx-auto font-light tracking-wide">
            Francisco Cassiano
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Acesso do Escrevente <ArrowRight size={20} />
            </Link>
            <a 
              href="https://api.whatsapp.com/send/?phone=551334990090" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Falar com Atendente
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Soluções Inteligentes</h2>
            <p className="mt-4 text-gray-600">Ferramentas essenciais para o dia a dia notarial.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Análise de Matrícula", desc: "IA avançada que lê e interpreta matrículas, extraindo proprietários e gravames em segundos." },
              { title: "Calculadora de Custas", desc: "Cálculos precisos e atualizados integrados diretamente ao fluxo de trabalho." },
              { title: "Minutas Automáticas", desc: "Geração de escrituras personalizadas baseadas em modelos inteligentes." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                <div className="h-12 w-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};