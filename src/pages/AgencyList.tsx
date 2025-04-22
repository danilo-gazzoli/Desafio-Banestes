import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Breadcrumb } from '../components/Breadcrumb';
import { getAgencias } from '../service/getData';
import { Agencia } from '../types';
import { Loader } from 'lucide-react';

export function AgencyList() {
  // armazena a lista requisitada via api
  const [agencies, setAgencies] = React.useState<Agencia[]>([]);
  
  // define o status de carregamento
  const [loading, setLoading] = React.useState(true);

  // controla o estado de possiveis falhas
  const [error, setError] = React.useState<string | null>(null);

  // armazena o termo de busca
  const [searchTerm, setSearchTerm] = React.useState('');

  // armazena a pagina atual da paginacao
  const [currentPage, setCurrentPage] = React.useState(1);

  // instancia o navigate para navegar para a pagina de detalhes
  const navigate = useNavigate();
  
  // numero de itens mostrados em cada paginacao
  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchAgencies = async () => {
      try {
        // faz a requisicao da lista de contas
        const data = await getAgencias();

        // armazena a lista
        setAgencies(data);

        // encerra o carregamento
        setLoading(false);
      } catch (err) {
        // define a mensagem de erro
        setError('Error loading agencies');

        // encerra o carregamento
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  const filteredAgencies = React.useMemo(() => {
    return agencies.filter(agency => 
      // filtra com base no termo de busca (em minusculo)
      agency.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.codigo.toString().includes(searchTerm) ||
      agency.endereco.toLowerCase().includes(searchTerm)
    );
  }, [agencies, searchTerm]);

  const paginatedAgencies = React.useMemo(() => {
    // calcula o indice inicial para a pagina atual
    const start = (currentPage - 1) * itemsPerPage;
    
    // retorna apenas o subconjunto de contas da pagina
    return filteredAgencies.slice(start, start + itemsPerPage);
  }, [filteredAgencies, currentPage]);

  // calcula o total de paginas
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);

  // exibe animacao de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-[#004B8D]" />
      </div>
    );
  }

  // exibe mensagem de erro caso algo de errado
  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  // renderiza a pagina principal
  return (
    <div className="space-y-4">
      <Breadcrumb />
      { /* Breadcrumb no topo da pagina */ }
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Agências</h1>
        <div className="mt-4 sm:mt-0">
          { /* SearchBar para busca rapida */ }
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nome, c├│digo ou endere├ºo..."
          />
        </div>
      </div>

      { /* Tabela de resultados */ }
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">C├│digo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endere├ºo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAgencies.map((agency) => (
                <tr 
                  key={agency.id}
  onClick={() => navigate(`/agencies/${agency.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agency.codigo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agency.nome}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{agency.endereco}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      { /* Paginacao */ }
      {filteredAgencies.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
