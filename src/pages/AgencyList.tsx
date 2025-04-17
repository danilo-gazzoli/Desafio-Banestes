import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Breadcrumb } from '../components/Breadcrumb';
import { getAgencias } from '../services/getData';
import { Agencia } from '../types';
import { Loader } from 'lucide-react';

export function AgencyList() {
  const [agencies, setAgencies] = React.useState<Agencia[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const data = await getAgencias();
        setAgencies(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading agencies');
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  const filteredAgencies = React.useMemo(() => {
    return agencies.filter(agency => 
      agency.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.codigo.toString().includes(searchTerm) ||
      agency.endereco.toLowerCase().includes(searchTerm)
    );
  }, [agencies, searchTerm]);

  const paginatedAgencies = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAgencies.slice(start, start + itemsPerPage);
  }, [filteredAgencies, currentPage]);

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);

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
        <h1 className="text-2xl font-semibold text-gray-900">Agências</h1>
        <div className="mt-4 sm:mt-0">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nome, código ou endereço..."
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
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
