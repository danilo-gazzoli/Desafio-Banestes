import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAgencias, getClientes, getContas } from '../services/getData';
import { Agencia, Cliente, Conta } from '../types';
import { ArrowLeft, Loader, Building2, Users, CreditCard } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

export function AgencyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agency, setAgency] = React.useState<Agencia | null>(null);
  const [clients, setClients] = React.useState<Cliente[]>([]);
  const [accounts, setAccounts] = React.useState<Conta[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAgencyDetails = async () => {
      try {
        const [agenciesData, clientsData, accountsData] = await Promise.all([
          getAgencias(),
          getClientes(),
          getContas()
        ]);

        const foundAgency = agenciesData.find(a => a.id === id);
        
        if (foundAgency) {
          setAgency(foundAgency);
          // Filter clients by agency code
          const agencyClients = clientsData.filter(
            client => client.codigoAgencia === foundAgency.codigo
          );
          setClients(agencyClients);

          // Filter accounts by client CPF/CNPJ
          const clientCpfCnpjs = agencyClients.map(client => client.cpfCnpj);
          const agencyAccounts = accountsData.filter(
            account => clientCpfCnpjs.includes(account.cpfCnpjCliente)
          );
          setAccounts(agencyAccounts);
        } else {
          setError('Agência não encontrada');
        }
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar detalhes da agência');
        setLoading(false);
      }
    };

    fetchAgencyDetails();
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-[#004B8D]" />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Agência não encontrada'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/agencies')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para Agências
        </button>
      </div>

      <div className="grid gap-6">
        {/* Agency Information */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Building2 className="h-6 w-6 text-[#004B8D] mr-2" />
            <h1 className="text-2xl font-bold">Detalhes da Agência</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Código da Agência</label>
                  <p className="mt-1 text-sm text-gray-900">{agency.codigo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="mt-1 text-sm text-gray-900">{agency.nome}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço</label>
                  <p className="mt-1 text-sm text-gray-900">{agency.endereco}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Resumo</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-[#004B8D] mr-2" />
                    <span className="text-sm font-medium text-[#004B8D]">Clientes</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#004B8D]">{clients.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-[#004B8D] mr-2" />
                    <span className="text-sm font-medium text-[#004B8D]">Contas</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#004B8D]">{accounts.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-[#004B8D] mr-2" />
              <h2 className="text-xl font-bold">Clientes da Agência</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF/CNPJ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{client.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.cpfCnpj}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/clients/${client.id}`}
                        className="text-[#004B8D] hover:text-[#003865]"
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Accounts Section */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-[#004B8D] mr-2" />
              <h2 className="text-xl font-bold">Contas da Agência</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => {
                  const client = clients.find(c => c.cpfCnpj === account.cpfCnpjCliente);
                  return (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{client?.nome}</div>
                        <div className="text-xs text-gray-500">{account.cpfCnpjCliente}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {account.tipo}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
