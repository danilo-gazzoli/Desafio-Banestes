import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Breadcrumb } from '../components/Breadcrumb';
import { getContas } from '../service/getData';
import { Conta } from '../types';
import { Filter, Loader } from 'lucide-react';

export function AccountList() {
  const [accounts, setAccounts] = React.useState<Conta[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    tipo: '',
    saldoMin: '',
    saldoMax: '',
    limiteCreditoMin: '',
    limiteCreditoMax: ''
  });

  const itemsPerPage = 10;

  React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getContas();
        setAccounts(data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar as contas');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredAccounts = React.useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = (
        account.cpfCnpjCliente.includes(searchTerm) ||
        account.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesTipo = !filters.tipo || account.tipo === filters.tipo;
      
      const matchesSaldo = (
        (!filters.saldoMin || account.saldo >= Number(filters.saldoMin)) &&
        (!filters.saldoMax || account.saldo <= Number(filters.saldoMax))
      );

      const matchesLimiteCredito = (
        (!filters.limiteCreditoMin || account.limiteCredito >= Number(filters.limiteCreditoMin)) &&
        (!filters.limiteCreditoMax || account.limiteCredito <= Number(filters.limiteCreditoMax))
      );

      return matchesSearch && matchesTipo && matchesSaldo && matchesLimiteCredito;
    });
  }, [accounts, searchTerm, filters]);

  const paginatedAccounts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

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
        <h1 className="text-2xl font-semibold text-gray-900">Contas</h1>
        <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:space-x-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por CPF/CNPJ ou tipo de conta..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
              <select
                value={filters.tipo}
                onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm rounded-md"
              >
                <option value="">Todos</option>
                <option value="corrente">Corrente</option>
                <option value="poupanca">Poupança</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saldo</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.saldoMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, saldoMin: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.saldoMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, saldoMax: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Crédito</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.limiteCreditoMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, limiteCreditoMin: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#004B8D] focus:border-[#004B8D] sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={filters.limiteCreditoMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, limiteCreditoMax: e.target.value }))}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF/CNPJ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite de Crédito</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crédito Disponível</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.cpfCnpjCliente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {account.tipo === 'corrente' ? 'Corrente' : 'Poupança'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${account.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(account.saldo)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(account.limiteCredito)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(account.creditoDisponivel)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAccounts.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
