import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientes, getContas, getAgencias } from '../service/getData';
import { Cliente, Conta, Agencia } from '../types';
import { ArrowLeft, Loader, CreditCard, Building2, User, Wallet, Calendar, Mail, MapPin } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';

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
          setError('Cliente não encontrado');
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
        setError('Erro ao carregar detalhes do cliente');
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <Loader className="h-8 w-8 animate-spin text-blue-500" aria-label="Carregando..." />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center text-red-600 p-4" role="alert">
        {error || 'Cliente não encontrado'}
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
      <Breadcrumb />
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          aria-label="Voltar para lista de clientes"
        >
          <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          Voltar para Clientes
        </button>
      </div>

      <div className="grid gap-6">
        {/* Informações do Cliente */}
        <section className="bg-white rounded-lg shadow-lg p-6" aria-labelledby="client-info-title">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
            <h2 id="client-info-title" className="text-2xl font-bold">Informações Pessoais</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <p className="mt-1 text-sm text-gray-900">{client.nome}</p>
                {client.nomeSocial && (
                  <p className="mt-1 text-sm text-gray-500">Nome Social: {client.nomeSocial}</p>
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
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(client.dataNascimento)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Endereço</label>
                  <p className="mt-1 text-sm text-gray-900">{client.endereco}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
                <p className="mt-1 text-sm text-gray-900">{client.estadoCivil}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Informações Financeiras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 text-blue-500 mr-2" aria-hidden="true" />
                  <label className="block text-sm font-medium text-blue-700">Renda Anual</label>
                </div>
                <p className="mt-1 text-lg font-semibold text-blue-900">
                  {formatCurrency(client.rendaAnual)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-green-500 mr-2" aria-hidden="true" />
                  <label className="block text-sm font-medium text-green-700">Patrimônio</label>
                </div>
                <p className="mt-1 text-lg font-semibold text-green-900">
                  {formatCurrency(client.patrimonio)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Informações da Agência */}
        {agency && (
          <section className="bg-white rounded-lg shadow-lg p-6" aria-labelledby="agency-info-title">
            <div className="flex items-center mb-6">
              <Building2 className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
              <h2 id="agency-info-title" className="text-2xl font-bold">Agência Associada</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </section>
        )}

        {/* Informações das Contas */}
        <section className="bg-white rounded-lg shadow-lg p-6" aria-labelledby="accounts-info-title">
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
            <h2 id="accounts-info-title" className="text-2xl font-bold">Contas Associadas</h2>
          </div>
          
          {accounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Conta
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Limite de Crédito
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crédito Disponível
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="capitalize">{account.tipo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={account.saldo >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(account.saldo)}
                        </span>
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
            <p className="text-gray-500 text-center py-4">Nenhuma conta encontrada para este cliente.</p>
          )}
        </section>
      </div>
    </div>
  );
}
