import { Cliente, Conta, Agencia } from "../types";
import { fetchSheet } from "../api/fetchSheet";

// recupera as urls do arquivo .env
const URL_CLIENTES = import.meta.env.VITE_URL_CLIENTES;
const URL_CONTAS = import.meta.env.VITE_URL_CONTAS;
const URL_AGENCIAS = import.meta.env.VITE_URL_AGENCIAS;

// busca a lista de clientes usando a url definida no .env
export const getClientes = async (): Promise<Cliente[]> => {
    const data = await fetchSheet<Cliente>(URL_CLIENTES);

    return data.map(cliente => ({
        // define os tipos dos atributos
        ...cliente,
        id: String(cliente.id),
        cpfCnpj: String(cliente.cpfCnpj),
        // uma condicional para ver se o campo está preenchido ou nao
        rg: cliente.rg ? String(cliente.rg) : undefined,
        dataNascimento: new Date(cliente.dataNascimento),
        // uma condicional para ver se o campo está preenchido ou nao
        nomeSocial: cliente.nomeSocial ? String(cliente.nomeSocial?) : undefined,
        email: String(cliente.email),
        endereco: String(cliente.endereco),
        rendaAnual: Number(cliente.rendaAnual),
        patrimonio: Number(cliente.patrimonio),
        estadoCivil: cliente.estadoCivil as Cliente["estadoCivil"],
        codigoAgencia: Number(cliente.codigoAgencia)
    }));
}

// busca a lista de contas usando a url definida no .env
export const getContas = async (): Promise<Conta[]> => {
    const data = await fetchSheet<Conta>(URL_CONTAS);

    return data.map(conta => ({
        ...conta,
        id: String(conta.id),
        cpfCnpjCliente: String(conta.cpfCnpjCliente),
        tipo: conta.tipo as Conta["tipo"],
        saldo: Number(conta.saldo),
        limiteCredito: Number(conta.limiteCredito),
        creditoDisponivel: Number(conta.creditoDisponivel)
    }));
}

// busca a lista de agencias usando a url definida no .env
export const getAgencias = async (): Promise<Agencia[]> => {
    const data = await fetchSheet<Agencia>(URL_AGENCIAS);

    return data.map(agencia => ({
        ...agencia,
        id: String(agencia.id),
        codigo: Number(agencia.codigo),
        nome: String(agencia.nome),
        endereco: String(agencia.endereco)
    }));
}
