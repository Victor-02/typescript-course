type FormaDePagamento = "Cartão de Crédito" | "Boleto";
type Status =
  | "Paga"
  | "Aguardando pagamento"
  | "Recusada pela operadora de cartão"
  | "Estornada";

export interface TransacaoAPI {
  ID: number;
  Nome: string;
  Status: Status;
  Email: string;
  Data: string;
  ["Cliente Novo"]: number;
  ["Valor (R$)"]: string;
  ["Forma de Pagamento"]: FormaDePagamento;
}

export interface Transacao {
  id: number;
  nome: string;
  status: Status;
  email: string;
  data: Date;
  clienteNovo: Boolean;
  valor: number;
  pagamento: FormaDePagamento;
}

export default function toTransacao(transacao: TransacaoAPI) {
  return {
    id: transacao.ID,
    nome: transacao.Nome,
    status: transacao.Status,
    email: transacao.Email,
    data: toDate(transacao.Data),
    clienteNovo: Boolean(transacao["Cliente Novo"]),
    valor: toNumber(transacao["Valor (R$)"]),
    pagamento: transacao["Forma de Pagamento"],
  };
}

function toNumber(num: string) {
  const valor = Number(num.replaceAll(".", "").replace(",", "."));
  return isNaN(valor) ? 0 : valor;
}

function toDate(date: string) {
  const [data, tempo] = date.split(" ");
  const [day, month, year] = data.split("/").map(Number);
  const [hour, min] = tempo.split(":").map(Number);
  return new Date(year, month - 1, day, hour, min);
}
