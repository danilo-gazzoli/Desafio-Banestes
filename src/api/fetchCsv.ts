// biblioteca para converter dados CSV em objetos javascript
import Papa from "papaparse";
// interfaces definidas em src/types.ts
import { Cliente, Conta, Agencia } from "../types"; 

// função generica que busca a planilha na url e converte os dados para um array 
async function fetchSheet<T>(url: string): Promise<T[]> {
    
    // busca os dados na url
    const response = await fetch(url);

    // converte a resposta em texto
    const csvText = await response.text();

    // converte o conteudo em objetos com papaparse
    const { data } = Papa.parse<T>(csvText, {

        // transforma a primeira linha nos nomes dos objetos
        header: true,

        // converte strings numericas para numeros
        dynamicTyping: true,

        // ignora linhas vazias
        skipEmptyLines: true,

        // processam string para garantir que estao limpas
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => value === "" ? null : value
    });

    return data;
}
