import { Cliente, Conta, Agencia } from "../types";
import { fetchSheet } from "../api/fetchSheet";

// url's das api's
const URL_CLIENTES = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
const URL_CONTAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
const URL_AGENCIAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";

// funcao asssincrona que faz a requisicao e retorna uma lista de objetos do tipo Cliente 
export const getClientes = async (): Promise<Cliente[]> => {
  // faz a  requisicao com a funcao fetchSheet
  const data = await fetchSheet<Cliente>(URL_CLIENTES);

  // retorna dados ??? e garante a tipagem das propriedades de cada objeto do tipo Cliente
  return data.map(cliente => ({
    ...cliente,
    id: String(cliente.id), // define id como string
    cpfCnpj: String(cliente.cpfCnpj), // define cpfCnpj como string 
    // se o rg está presente, então é definido como string ou é definido como undefined 
    rg: cliente.rg ? String(cliente.rg) : undefined,
    dataNascimento: new Date(cliente.dataNascimento), // garante que a propriedade dataNascimento seja do tipo date
    nomeSocial: cliente.nomeSocial ? String(cliente.nomeSocial) : undefined,
    email: String(cliente.email), // define email como string
    endereco: String(cliente.endereco), // define endereco como string
    // define rendaAnual como numero, se o campo na planilha estiver vazio define como zero
    rendaAnual: Number(cliente.rendaAnual) || 0,
    // define patrimonio como numero, se o campo na planilha estiver vazio define como zero
    patrimonio: Number(cliente.patrimonio) || 0,
    estadoCivil: cliente.estadoCivil as Cliente["estadoCivil"], // garante que o campo seja uma das opcoes pre definidas
    codigoAgencia: Number(cliente.codigoAgencia) // define o codigo da agencia como number
  }));
};

// funcao asssincrona que faz a requisicao e retorna uma lista de objetos do tipo Conta
export const getContas = async (): Promise<Conta[]> => {
  // faz a requisicao com a funcao fetchSheet
  const data = await fetchSheet<Conta>(URL_CONTAS);

  // retorna os dados e garante a tipagem das propriedades de cada objeto do tipo Conta
  return data.map(conta => ({
    ...conta,
    id: String(conta.id), // define id como string
    cpfCnpjCliente: String(conta.cpfCnpjCliente), // define cpfCnpj como string
    tipo: conta.tipo as Conta["tipo"], // garante que o campo seja uma das opcoes pre definidas
    saldo: Number(conta.saldo) || 0, // define saldo como numero, se estiver vazio define como zero
    limiteCredito: Number(conta.limiteCredito) || 0, // define limiteCredito como numero, se estiver vazio define como zero
    creditoDisponivel: Number(conta.creditoDisponivel) || 0 // define creditoDisponivel como numero, se estiver vazio define como zero
  }));
};

// funcao asssincrona que faz a requisicao e retorna uma lista de objetos do tipo Agencia
export const getAgencias = async (): Promise<Agencia[]> => {
  // faz a requisicao dos dados com a funcao fetchSheet
  const data = await fetchSheet<Agencia>(URL_AGENCIAS);

  // retorna os dados e garante a tipagem das propriedades de cada objetos do tipo Agencia
  return data.map(agencia => ({
    ...agencia,
    id: String(agencia.id), // define id como string
    codigo: Number(agencia.codigo), // define codigo como numero
    nome: String(agencia.nome), // define nome como string
    endereco: String(agencia.endereco) // define endereco como string
  }));
};
