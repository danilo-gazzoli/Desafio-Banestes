import { getClientes, getContas, getAgencias } from "../service/getData";
import { Cliente, Conta, Agencia } from "../types";

// Mock da função fetchSheet
jest.mock("../api/fetchSheet", () => ({
  fetchSheet: jest.fn()
}));

// dados mock
const mockCsvClientes = `id,cpfCnpj,rg,dataNascimento,nome,nomeSocial,email,endereco,rendaAnual,patrimonio,estadoCivil,codigoAgencia
1,12345678900,123456,1990-01-01,João,,joao@example.com,Rua A,50000,100000,Solteiro,101`;

const mockCsvContas = `id,cpfCnpjCliente,tipo,saldo,limiteCredito,creditoDisponivel
10,12345678900,corrente,1000,500,1500`;

const mockCsvAgencias = `id,codigo,nome,endereco
20,101,Agência Central,Rua Central`;

describe("Funções de getData", () => {
  beforeEach(() => {
    // Simula o retorno da função fetchSheet para clientes, contas e agências
    require("../api/fetchSheet").fetchSheet.mockImplementation((url: string) => {
      if (url.includes("clientes")) {
        return Promise.resolve([
          {
            id: "1",
            cpfCnpj: "12345678900",
            rg: "123456",
            dataNascimento: "1990-01-01",
            nome: "João",
            nomeSocial: null,
            email: "joao@example.com",
            endereco: "Rua A",
            rendaAnual: 50000,
            patrimonio: 100000,
            estadoCivil: "Solteiro",
            codigoAgencia: 101,
          },
        ]);
      } else if (url.includes("contas")) {
        return Promise.resolve([
          {
            id: "10",
            cpfCnpjCliente: "12345678900",
            tipo: "corrente",
            saldo: 1000,
            limiteCredito: 500,
            creditoDisponivel: 1500,
          },
        ]);
      } else if (url.includes("agencias")) {
        return Promise.resolve([
          {
            id: "20",
            codigo: 101,
            nome: "Agência Central",
            endereco: "Rua Central",
          },
        ]);
      }
      return Promise.reject("URL não encontrada");
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getClientes deve retornar os dados corretamente convertidos", async () => {
    const clientes: Cliente[] = await getClientes();
    expect(clientes).toEqual([
      {
        id: "1",
        cpfCnpj: "12345678900",
        rg: "123456",
        dataNascimento: expect.any(Date),
        nome: "João",
        nomeSocial: undefined,
        email: "joao@example.com",
        endereco: "Rua A",
        rendaAnual: 50000,
        patrimonio: 100000,
        estadoCivil: "Solteiro",
        codigoAgencia: 101,
      },
    ]);
  });

  it("getContas deve retornar os dados corretamente convertidos", async () => {
    const contas: Conta[] = await getContas();
    expect(contas).toEqual([
      {
        id: "10",
        cpfCnpjCliente: "12345678900",
        tipo: "corrente",
        saldo: 1000,
        limiteCredito: 500,
        creditoDisponivel: 1500,
      },
    ]);
  });

  it("getAgencias deve retornar os dados corretamente convertidos", async () => {
    const agencias: Agencia[] = await getAgencias();
    expect(agencias).toEqual([
      {
        id: "20",
        codigo: 101,
        nome: "Agência Central",
        endereco: "Rua Central",
      },
    ]);
  });
});
