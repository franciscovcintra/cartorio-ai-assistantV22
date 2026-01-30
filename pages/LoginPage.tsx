import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      navigate('/dashboard/assinaturas');
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Login do Escrevente</h2>
          <p className="text-slate-400 text-sm mt-1">Acesso Restrito ao Sistema</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 text-sm text-center border-b border-red-100 mb-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Autorizado</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                placeholder="seu.email@cartorio.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <button type="button" className="text-yellow-600 hover:text-yellow-700 font-medium">
              Esqueci minha senha
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 transition-colors font-semibold shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-center mt-4">
            <button type="button" className="text-gray-500 hover:text-gray-700 text-sm">
              Criar Conta (Requer Autorização)
            </button>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Protegido por criptografia de ponta a ponta.
        </div>
      </div>
    </div>
  );
};