import { Cliente, Conta, Agencia } from "../types";
import { fetchSheet } from "../api/fetchSheet";

const URL_CLIENTES = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes";
const URL_CONTAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas";
const URL_AGENCIAS = "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias";

export const getClientes = async (): Promise<Cliente[]> => {
  const data = await fetchSheet<Cliente>(URL_CLIENTES);
  return data.map(cliente => ({
    ...cliente,
    id: String(cliente.id),
    cpfCnpj: String(cliente.cpfCnpj),
    rg: cliente.rg ? String(cliente.rg) : undefined,
    dataNascimento: new Date(cliente.dataNascimento),
    nomeSocial: cliente.nomeSocial ? String(cliente.nomeSocial) : undefined,
    email: String(cliente.email),
    endereco: String(cliente.endereco),
    rendaAnual: Number(cliente.rendaAnual) || 0,
    patrimonio: Number(cliente.patrimonio) || 0,
    estadoCivil: cliente.estadoCivil as Cliente["estadoCivil"],
    codigoAgencia: Number(cliente.codigoAgencia)
  }));
};

export const getContas = async (): Promise<Conta[]> => {
  const data = await fetchSheet<Conta>(URL_CONTAS);
  return data.map(conta => ({
    ...conta,
    id: String(conta.id),
    cpfCnpjCliente: String(conta.cpfCnpjCliente),
    tipo: conta.tipo as Conta["tipo"],
    saldo: Number(conta.saldo) || 0,
    limiteCredito: Number(conta.limiteCredito) || 0,
    creditoDisponivel: Number(conta.creditoDisponivel) || 0
  }));
};

export const getAgencias = async (): Promise<Agencia[]> => {
  const data = await fetchSheet<Agencia>(URL_AGENCIAS);
  return data.map(agencia => ({
    ...agencia,
    id: String(agencia.id),
    codigo: Number(agencia.codigo),
    nome: String(agencia.nome),
    endereco: String(agencia.endereco)
  }));
};