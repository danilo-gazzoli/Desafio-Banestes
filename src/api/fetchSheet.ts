// biblioteca para converter dados CSV em objetos javascript
import * as Papa from "papaparse";

// função generica que busca a planilha na url e converte os dados para um array 
export async function fetchSheet<T>(url: string): Promise<T[]> {
    
    // busca os dados na url
    const response = await fetch(url);

    // converte a resposta em texto
    const csvText = await response.text();

    // converte o conteudo em objetos com papaparse
    const { data } = Papa.parse<T>(csvText, {

        // transforma a primeira linha nos nomes dos objetos
        header: true,

        // ignora linhas vazias
        skipEmptyLines: true,

        // processam string para garantir que estao limpas
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => value === "" ? null : value
    });

    return data;
}
