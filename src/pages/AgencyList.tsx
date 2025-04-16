import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
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
      agency.codigo.toString().includes(searchTerm)
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
        <h1 className="text-2xl font-semibold text-gray-900">Agencies</h1>
        <div className="mt-4 sm:mt-0">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or code..."
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agency.codigo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agency.nome}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{agency.endereco}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => navigate(`/agencies/${agency.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
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
