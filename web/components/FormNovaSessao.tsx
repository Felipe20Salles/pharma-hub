'use client';

import { useState } from 'react';
import { DadosIniciais } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface Props {
  onCriar: (dados: DadosIniciais) => Promise<void>;
  onCancelar: () => void;
}

const CAMPOS: { key: keyof DadosIniciais; label: string; placeholder: string; obrigatorio?: boolean }[] = [
  { key: 'nomeProjeto',        label: 'Nome do Projeto / Produto',          placeholder: 'Ex: ImunoPro, NeuroCalm...', obrigatorio: true },
  { key: 'indicacaoClinica',   label: 'Indicação Clínica',                  placeholder: 'Ex: Imunidade, ansiedade, emagrecimento...', obrigatorio: true },
  { key: 'publicoAlvo',        label: 'Público-alvo',                       placeholder: 'Ex: Adultos 30-60 anos, atletas...', obrigatorio: true },
  { key: 'formaFarmaceutica',  label: 'Forma Farmacêutica',                 placeholder: 'Ex: Cápsula, sachê, creme...', obrigatorio: true },
  { key: 'viaAdministracao',   label: 'Via de Administração',               placeholder: 'Ex: Oral, tópica, sublingual...', obrigatorio: true },
  { key: 'ativosConsiderados', label: 'Ativos Considerados',                placeholder: 'Ex: Vitamina C, Zinco, Quercetina...' },
  { key: 'restricoes',         label: 'Restrições / Contraindicações',      placeholder: 'Ex: Sem glúten, sem estimulantes...' },
  { key: 'medicoSolicitante',  label: 'Médico Solicitante (se houver)',     placeholder: 'Nome do médico...' },
  { key: 'contextoAdicional',  label: 'Contexto Adicional',                 placeholder: 'Informações relevantes adicionais...' },
];

export function FormNovaSessao({ onCriar, onCancelar }: Props) {
  const [dados, setDados] = useState<DadosIniciais>({
    nomeProjeto: '', indicacaoClinica: '', publicoAlvo: '',
    formaFarmaceutica: '', viaAdministracao: '', ativosConsiderados: '',
    restricoes: '', medicoSolicitante: '', contextoAdicional: '',
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const obrigatorios: (keyof DadosIniciais)[] = ['nomeProjeto', 'indicacaoClinica', 'publicoAlvo', 'formaFarmaceutica', 'viaAdministracao'];
    const faltando = obrigatorios.find(k => !dados[k].trim());
    if (faltando) { setErro('Preencha todos os campos obrigatórios.'); return; }
    setSalvando(true);
    setErro('');
    try { await onCriar(dados); } catch { setErro('Erro ao criar sessão.'); setSalvando(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Nova Sessão</h2>
          <p className="text-sm text-gray-400 mt-0.5">Preencha os dados do projeto magistral</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {CAMPOS.map(({ key, label, placeholder, obrigatorio }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {label} {obrigatorio && <span className="text-red-400">*</span>}
              </label>
              <input
                type="text"
                value={dados[key]}
                onChange={e => setDados(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700 placeholder-gray-300"
              />
            </div>
          ))}

          {erro && <p className="text-sm text-red-500">{erro}</p>}
        </form>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={salvando}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {salvando && <Loader2 size={14} className="animate-spin" />}
            Criar Sessão
          </button>
        </div>
      </div>
    </div>
  );
}
