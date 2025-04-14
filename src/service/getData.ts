import { Cliente, Conta, Agencia } from "../types";
import { fetchSheet } from "../api/fetchCsv";

// recupera as urls do arquivo .env
const URL_CLIENTES = import.meta.env.VITE_URL_CLIENTES;
const URL_CONTAS = import.meta.env.VITE_URL_CONTAS;
const URL_AGENCIAS = import.meta.env.VITE_URL_AGENCIAS;

// busca a lista de clientes usando a url definida no .env
export const getClientes = async (): Promise<Cliente[]> => {
    const data = await fetchSheet<Cliente>(URL_CLIENTES);

    return data.map(cliente => ({
        ...cliente,
        // garante que o conteudo do campo dataNascimento seja do tipo Data
        dataNascimento: new Date(cliente.dataNascimento),
        //garante que o tipo de estadoCivil
        estadoCivil: cliente.estadoCivil as Cliente["estadoCivil"]
    }));
}

// busca a lista de contas usando a url definida no .env
export const getContas = (): Promise<Conta[]> => {
    return fetchSheet<Conta>(URL_CONTAS);
}

// busca a lista de agencias usando a url definida no .env
export const getAgencias = (): Promise<Agencia[]> => {
    return fetchSheet<Agencia>(URL_AGENCIAS);
}
