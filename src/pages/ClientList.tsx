import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Breadcrumb } from '../components/Breadcrumb';
import { getClientes } from '../service/getData';
import { Cliente } from '../types';
import { Filter, Loader } from 'lucide-react';

export function ClientList() {
  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    estadoCivil: '',
    rendaMin: '',
    rendaMax: '',
    patrimonioMin: '',
    patrimonioMax: ''
  });
  
  const navigate = useNavigate();
  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClientes();
        setClients(data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os clientes');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredClients = React.useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = (
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cpfCnpj.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesEstadoCivil = !filters.estadoCivil || client.estadoCivil === filters.estadoCivil;
      
      const matchesRenda = (
        (!filters.rendaMin || client.rendaAnual >= Number(filters.rendaMin)) &&
        (!filters.rendaMax || client.rendaAnual <= Number(filters.rendaMax))
      );

      const matchesPatrimonio = (
        (!filters.patrimonioMin || client.patrimonio >= Number(filters.patrimonioMin)) &&
        (!filters.patrimonioMax || client.patrimonio <= Number(filters.patrimonioMax))
      );

      return matchesSearch && matchesEstadoCivil && matchesRenda && matchesPatrimonio;
    });
  }, [clients, searchTerm, filters]);

  const paginatedClients = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-[#004B8D]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumb />
      
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nome, CPF/CNPJ ou email..."
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-2 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
              <select
                value={filters.estadoCivil}
                onChange={(e) => setFilters(prev => ({ ...prev, estadoCivil: e.target.value }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm rounded-md"
              >
                <option value="">Todos</option>
                <option value="Solteiro">Solteiro</option>
                <option value="Casado">Casado</option>
                <option value="Viúvo">Viúvo</option>
                <option value="Divorciado">Divorciado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Renda Anual</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.rendaMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, rendaMin: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.rendaMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, rendaMax: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patrimônio</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.patrimonioMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, patrimonioMin: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.patrimonioMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, patrimonioMax: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF/CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Civil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renda Anual</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patrimônio</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedClients.map((client) => (
                <tr 
                  key={client.id}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.nome}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.cpfCnpj}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {client.estadoCivil}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(client.rendaAnual)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(client.patrimonio)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredClients.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
