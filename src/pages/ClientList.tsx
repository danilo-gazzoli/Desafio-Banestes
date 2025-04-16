import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { getClientes } from '../services/getData';
import { Cliente } from '../types';
import { Filter, Loader } from 'lucide-react';

export function ClientList() {
  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Cliente['estadoCivil'] | ''>('');
  
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

  const filteredClients = React.useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = (
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cpfCnpj.includes(searchTerm)
      );
      const matchesStatus = !selectedStatus || client.estadoCivil === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, selectedStatus]);

  const paginatedClients = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
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
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
        <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nome ou CPF/CNPJ..."
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
          <h3 className="text-sm font-medium text-gray-700 mb-2">Estado Civil</h3>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as Cliente['estadoCivil'] | '')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Todos</option>
            <option value="Solteiro">Solteiro</option>
            <option value="Casado">Casado</option>
            <option value="Viúvo">Viúvo</option>
            <option value="Divorciado">Divorciado</option>
          </select>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {paginatedClients.map((client) => (
            <li key={client.id}>
              <div
                onClick={() => navigate(`/clients/${client.id}`)}
                className="block hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-blue-600 truncate">
                      {client.nome}
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {client.estadoCivil}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        CPF/CNPJ: {client.cpfCnpj}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
