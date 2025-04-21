import React from 'react';
import { getClientes, getContas, getAgencias } from '../service/getData';
import { Cliente, Conta, Agencia } from '../types';
import { Loader, Users, CreditCard, Wallet, Building2, TrendingUp, Download } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function Dashboard() {
  // referencia ao container inteiro
  const dashboardRef = React.useRef<HTMLDivElement>(null);

  // armazena a lista de clientes
  const [clients, setClients] = React.useState<Cliente[]>([]);

  // armazena lista de contas
  const [accounts, setAccounts] = React.useState<Conta[]>([]);

  // armazena lista de agencias
  const [agencies, setAgencies] = React.useState<Agencia[]>([]);

  // faz o gerenciamento de loading
  const [loading, setLoading] = React.useState(true);

  // define os erros
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // faz as requisicoes dos clientes, contas e agencias paralelamete
        const [clientsData, accountsData, agenciesData] = await Promise.all([
          getClientes(),
          getContas(),
          getAgencias()
        ]);

        // armazena as respostas das requisicoes
        setClients(clientsData);
        setAccounts(accountsData);
        setAgencies(agenciesData);

        // encerra o carregamento
        setLoading(false);
      } catch (err) {
        // retorna mensagem de erro
        setError('Erro ao carregar dados do dashboard');

        // encerra o carregamento
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // converte os numeros para brl
  const formatCurrency = (value: number) => {
    // recebe um numero e retorna uma string formatada em real brasileiro
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // converte numeros para porcentagem
  const formatPercentage = (value: number) => {
    // recebe um numero re retorna uma porcentagem formatada em pt-br
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  // exporta o dashboard para pdf
  const exportToPDF = async () => {
    // retorna se o container do dashboard estiver vazio
    if (!dashboardRef.current) return;

    try {
      // captura o conteudo do container com html2canvas
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      // converte em imagem png
      const imgData = canvas.toDataURL('image/png');

      // cria um pdf vazio
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // define dimensoes do pdf
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // adiciona a imagem com o conteudo do dashboard
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // faz o Download do pdf
      pdf.save('dashboard-report.pdf');
    } catch (error) {
      // retorna um erro se nao conseguir gerar o pdf
      console.error('Error generating PDF:', error);
    }
  };

  // calculos totais gerais
  const totalClients = clients.length;
  const totalAccounts = accounts.length;
  const totalEquity = clients.reduce((sum, client) => sum + client.patrimonio, 0);
  const totalBalance = accounts.reduce((sum, account) => sum + account.saldo, 0);

  // distribuicoes dos tipos de contas
  const accountTypeDistribution = {
    corrente: accounts.filter(a => a.tipo === 'corrente').length,
    poupanca: accounts.filter(a => a.tipo === 'poupanca').length
  };

  // distribuicao por status civil
  const maritalStatusDistribution = clients.reduce((acc, client) => {
    acc[client.estadoCivil] = (acc[client.estadoCivil] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // calculo de performace por agencia
  const agencyPerformance = agencies.map(agency => {
    // filtra clientes por agencia
    const agencyClients = clients.filter(c => c.codigoAgencia === agency.codigo);

    // mapeia os clientes por cpfCnpj
    const clientCpfCnpjs = agencyClients.map(c => c.cpfCnpj);

    // filtra as contas pelos cpfCnpj dos clientes
    const agencyAccounts = accounts.filter(a => clientCpfCnpjs.includes(a.cpfCnpjCliente));
    
    // soma de depositos
    const totalDeposits = agencyAccounts.reduce((sum, account) => sum + account.saldo, 0);

    // soma de patromonios
    const totalEquity = agencyClients.reduce((sum, client) => sum + client.patrimonio, 0);

    // ordena pelo maior numero de clientes
    const averageEquity = agencyClients.length > 0 ? totalEquity / agencyClients.length : 0;

    return {
      ...agency,
      clientCount: agencyClients.length,
      totalDeposits,
      averageEquity,
      accountOpeningRate: agencyAccounts.length / (agencyClients.length || 1)
    };
  }).sort((a, b) => b.clientCount - a.clientCount);

  // indicadores de risco
  // total de contas negativas
  const negativeBalanceAccounts = accounts.filter(a => a.saldo < 0);

  // total de prejuizo
  const totalNegativeBalance = negativeBalanceAccounts.reduce((sum, account) => sum + account.saldo, 0);

  // total de credito disponivel
  const totalAvailableCredit = accounts.reduce((sum, account) => sum + account.creditoDisponivel, 0);

  // credito utilizado
  const averageCreditUtilization = accounts.reduce((sum, account) => {
    const utilization = account.limiteCredito > 0 
      ? (account.limiteCredito - account.creditoDisponivel) / account.limiteCredito 
      : 0;
    return sum + utilization;
  }, 0) / accounts.length;

  // configuracoes de graficos
  const accountTypeChartData: ChartData<'doughnut'> = {
    labels: ['Contas Correntes', 'Contas Poupança'],
    datasets: [{
      data: [accountTypeDistribution.corrente, accountTypeDistribution.poupanca],
      backgroundColor: ['#004B8D', '#F7941E'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 2
    }]
  };

  const maritalStatusChartData: ChartData<'pie'> = {
    labels: Object.keys(maritalStatusDistribution),
    datasets: [{
      data: Object.values(maritalStatusDistribution),
      backgroundColor: ['#004B8D', '#F7941E', '#00A3E0', '#FFB81C'],
      borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
      borderWidth: 2
    }]
  };

  const top5AgenciesChartData: ChartData<'bar'> = {
    labels: agencyPerformance.slice(0, 5).map(agency => agency.nome),
    datasets: [
      {
        label: 'Número de Clientes',
        data: agencyPerformance.slice(0, 5).map(agency => agency.clientCount),
        backgroundColor: '#004B8D',
      },
      {
        label: 'Volume de Depósitos (R$ mil)',
        data: agencyPerformance.slice(0, 5).map(agency => agency.totalDeposits / 1000),
        backgroundColor: '#F7941E',
      }
    ]
  };

  const creditUtilizationChartData: ChartData<'line'> = {
    labels: ['Limite Total', 'Crédito Utilizado', 'Crédito Disponível'],
    datasets: [{
      label: 'Utilização de Crédito',
      data: [
        accounts.reduce((sum, account) => sum + account.limiteCredito, 0),
        accounts.reduce((sum, account) => sum + (account.limiteCredito - account.creditoDisponivel), 0),
        totalAvailableCredit
      ],
      borderColor: '#004B8D',
      backgroundColor: 'rgba(0, 75, 141, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc: number, current: number) => acc + current, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // exibe animacao de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-[#004B8D]" />
      </div>
    );
  }

  // exibe mensagem de erro
  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  // carrega a pagina principal
  return (
    <div className="space-y-6 max-w-[2000px] mx-auto px-4">
      <div className="flex justify-between items-center">
        { /* Breadcrumb no topo da pagina */ }
        <Breadcrumb />
        { /* Botao para baixar pdf */ }
        <button
          onClick={exportToPDF}
          className="inline-flex items-center px-4 py-2 bg-[#004B8D] text-white rounded-lg hover:bg-[#003865] transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </button>
      </div>
      
      <div ref={dashboardRef}>
        <h1 className="text-2xl font-bold text-gray-900 py-3">Dashboard</h1>

        {/* Secoes de analise geral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-[#004B8D]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-semibold text-gray-900">{totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-[#004B8D]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Contas</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAccounts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-[#004B8D]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patrimônio Total</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalEquity)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#004B8D]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalBalance)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribuicao de graficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-3">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Distribuição por Tipo de Conta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 relative">
                <Doughnut data={accountTypeChartData} options={chartOptions} />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#004B8D] rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Contas Correntes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{accountTypeDistribution.corrente}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({formatPercentage(accountTypeDistribution.corrente / totalAccounts)})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#F7941E] rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Contas Poupança</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{accountTypeDistribution.poupanca}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({formatPercentage(accountTypeDistribution.poupanca / totalAccounts)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Distribuição por Estado Civil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 relative">
                <Pie data={maritalStatusChartData} options={chartOptions} />
              
              </div>
              <div className="flex flex-col justify-center space-y-4">
                {Object.entries(maritalStatusDistribution).map(([status, count], index) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: ['#004B8D', '#F7941E', '#00A3E0', '#FFB81C'][index] }}
                      ></div>
                      <span className="text-sm font-medium">{status}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{count}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({formatPercentage(count / totalClients)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance de agencias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-3">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Top 5 Agências</h2>
            <div className="h-80">
              <Bar data={top5AgenciesChartData} options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return value.toLocaleString('pt-BR');
                      }
                    }
                  }
                }
              }} />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2">Agência</th>
                    <th className="text-right py-2">Clientes</th>
                    <th className="text-right py-2">Depósitos</th>
                  </tr>
                </thead>
                <tbody>
                  {agencyPerformance.slice(0, 5).map((agency) => (
                    <tr key={agency.id}>
                      <td className="py-2">{agency.nome}</td>
                      <td className="text-right">{agency.clientCount}</td>
                      <td className="text-right">{formatCurrency(agency.totalDeposits)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Utilização de Crédito</h2>
            <div className="h-80">
              <Line data={creditUtilizationChartData} options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatCurrency(value as number);
                      }
                    }
                  }
                }
              }} />
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Limite Total</p>
                <p className="text-sm font-bold">{formatCurrency(accounts.reduce((sum, account) => sum + account.limiteCredito, 0))}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Crédito Utilizado</p>
                <p className="text-sm font-bold">{formatCurrency(accounts.reduce((sum, account) => sum + (account.limiteCredito - account.creditoDisponivel), 0))}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Crédito Disponível</p>
                <p className="text-sm font-bold">{formatCurrency(totalAvailableCredit)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores de risco */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Indicadores de Risco</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Utilização Média de Crédito</p>
              <p className="text-2xl font-semibold text-[#004B8D]">{formatPercentage(averageCreditUtilization)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Total utilizado: {formatCurrency(accounts.reduce((sum, account) => sum + (account.limiteCredito - account.creditoDisponivel), 0))}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Contas com Saldo Negativo</p>
              <p className="text-2xl font-semibold text-red-600">{negativeBalanceAccounts.length}</p>
              <p className="text-sm text-red-600">{formatCurrency(Math.abs(totalNegativeBalance))}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatPercentage(negativeBalanceAccounts.length / totalAccounts)} do total de contas
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Crédito Total Disponível</p>
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalAvailableCredit)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatPercentage(totalAvailableCredit / accounts.reduce((sum, account) => sum + account.limiteCredito, 0))} do limite total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
