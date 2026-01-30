import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Check, X } from 'lucide-react';
import { Signature } from '../../types';
import { supabase } from '../../services/supabaseClient';

export const Signatures: React.FC = () => {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);

  const [newSig, setNewSig] = useState<Partial<Signature>>({});
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('signatures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignatures(data || []);
    } catch (error) {
      console.error('Error fetching signatures:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('signatures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSignatures(prev => prev.filter(s => s.id !== id));
      setDeleteConfirmationId(null);
    } catch (error: any) {
      console.error('Error deleting signature:', error);
      alert(`Erro ao excluir assinatura: ${error.message}`);
    }
  };

  const handleAdd = async () => {
    if (newSig.book && newSig.name) {
      try {
        const newSignature = {
          book: newSig.book,
          page: newSig.page || '',
          name: newSig.name,
          date: newSig.date || new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase
          .from('signatures')
          .insert([newSignature])
          .select()
          .single();

        if (error) throw error;

        setSignatures(prev => [data, ...prev]);
        setNewSig({});
      } catch (error: any) {
        console.error('Error adding signature:', error);
        alert(`Erro ao salvar assinatura via banco de dados: ${error.message || JSON.stringify(error)}`);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Controle de Assinaturas</h1>
        <button
          onClick={fetchSignatures}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          Atualizar Lista ({signatures.length})
        </button>
      </div>

      {/* Add New Signature Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Livro</label>
          <input
            type="text"
            className="border p-2 rounded w-24"
            value={newSig.book || ''}
            onChange={e => setNewSig({ ...newSig, book: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Página</label>
          <input
            type="text"
            className="border p-2 rounded w-24"
            value={newSig.page || ''}
            onChange={e => setNewSig({ ...newSig, page: e.target.value })}
          />
        </div>
        <div className="flex-grow">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Assinatura (Nome)</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={newSig.name || ''}
            onChange={e => setNewSig({ ...newSig, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Data</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={newSig.date || ''}
            onChange={e => setNewSig({ ...newSig, date: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex items-center gap-1"
        >
          <Plus size={20} /> Adicionar
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Livro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Página</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assinatura Pendente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Data</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Ação</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : signatures.length > 0 ? (
              signatures.map((sig) => (
                <tr key={sig.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sig.book}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sig.page}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sig.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sig.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirmationId === sig.id ? (
                      <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                          onClick={() => confirmDelete(sig.id)}
                          className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors"
                          title="Confirmar Exclusão"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(null)}
                          className="bg-gray-200 text-gray-700 p-1.5 rounded hover:bg-gray-300 transition-colors"
                          title="Cancelar"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmationId(sig.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                        title="Assinatura colhida / Remover"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 italic">
                  Nenhuma assinatura pendente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};