import { fetchSheet } from "../api/fetchSheet";

interface TestData {
  id: string;
  nome: string;
  dataNascimento: string;
  estadoCivil: string;
}

// Simular uma resposta CSV:
const mockCsv = `id,nome,dataNascimento,estadoCivil
1,Jo├úo,1990-01-01,Solteiro
2,Maria,1985-05-20,Casado`;

describe("fetchSheet", () => {
  beforeEach(() => {
    // Criamos um mock global da fun├º├úo fetch.
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockCsv),
    } as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("deve converter CSV em um array de objetos", async () => {
    const data = await fetchSheet<TestData>("http://fakeurl.com");
    expect(data).toEqual([
      { id: "1", nome: "Jo├úo", dataNascimento: "1990-01-01", estadoCivil: "Solteiro" },
      { id: "2", nome: "Maria", dataNascimento: "1985-05-20", estadoCivil: "Casado" },
    ]);
    expect(global.fetch).toHaveBeenCalledWith("http://fakeurl.com");
  });
});
