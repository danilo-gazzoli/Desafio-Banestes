import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientes, getContas, getAgencias } from '../services/getData';
import { Cliente, Conta, Agencia } from '../types';
import { ArrowLeft, Loader, CreditCard, Building2, User } from 'lucide-react';

export function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = React.useState<Cliente | null>(null);
  const [accounts, setAccounts] = React.useState<Conta[]>([]);
  const [agency, setAgency] = React.useState<Agencia | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const [clientsData, accountsData, agenciesData] = await Promise.all([
          getClientes(),
          getContas(),
          getAgencias()
        ]);

        const foundClient = clientsData.find(c => c.id === id);
        
        if (!foundClient) {
          setError('Client not found');
          setLoading(false);
          return;
        }

        const clientAccounts = accountsData.filter(
          account => account.cpfCnpjCliente === foundClient.cpfCnpj
        );
        
        const clientAgency = agenciesData.find(
          agency => agency.codigo === foundClient.codigoAgencia
        );

        setClient(foundClient);
        setAccounts(clientAccounts);
        setAgency(clientAgency || null);
        setLoading(false);
      } catch (err) {
        setError('Error loading client details');
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Client not found'}
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Clients
        </button>
      </div>

      <div className="grid gap-6">
        {/* Client Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold">Personal Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{client.nome}</p>
                {client.nomeSocial && (
                  <p className="mt-1 text-sm text-gray-500">Social Name: {client.nomeSocial}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
                <p className="mt-1 text-sm text-gray-900">{client.cpfCnpj}</p>
              </div>
              {client.rg && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">RG</label>
                  <p className="mt-1 text-sm text-gray-900">{client.rg}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(client.dataNascimento)}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{client.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{client.endereco}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Civil Status</label>
                <p className="mt-1 text-sm text-gray-900">{client.estadoCivil}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-blue-700">Annual Income</label>
                <p className="mt-1 text-lg font-semibold text-blue-900">
                  {formatCurrency(client.rendaAnual)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-green-700">Total Assets</label>
                <p className="mt-1 text-lg font-semibold text-green-900">
                  {formatCurrency(client.patrimonio)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agency Information */}
        {agency && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Building2 className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold">Associated Agency</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Agency Code</label>
                <p className="mt-1 text-sm text-gray-900">{agency.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{agency.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{agency.endereco}</p>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold">Associated Accounts</h2>
          </div>
          
          {accounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Limit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Credit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize">{account.tipo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(account.saldo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(account.limiteCredito)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(account.creditoDisponivel)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No accounts found for this client.</p>
          )}
        </div>
      </div>
    </div>
  );
}
