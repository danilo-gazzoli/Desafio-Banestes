import * as Papa from "papaparse";

export async function fetchSheet<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const csvText = await response.text();
  
  const { data } = Papa.parse<T>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
    transform: (value: string) => value === "" ? null : value
  });

  return data;
}