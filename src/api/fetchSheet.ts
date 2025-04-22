// biblioteca para parsear os dados
import * as Papa from "papaparse";

// funcao assincrona de tipo qualquer que recebe uma url e retorna uma lista de objetos do tipo T
export async function fetchSheet<T>(url: string): Promise<T[]> {
  // faz a requisicao
  const response = await fetch(url);

  // armazena o texto da requisicao
  const csvText = await response.text();
  
  // realiza o tratamento dos dados
  const { data } = Papa.parse<T>(csvText, {
    header: true, // define o header
    skipEmptyLines: true, // ignora linhas vazias
    transformHeader: (header: string) => header.trim(), // remove espacos extras dos nomes dos campos
    transform: (value: string) => value === "" ? null : value // converte campos vazios para null
  });

  // retorna os dados tratados
  return data;
}
