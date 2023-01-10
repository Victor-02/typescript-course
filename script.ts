import toTransacao, { Transacao, TransacaoAPI } from "./Transacao.js";

async function getData() {
  const res = await fetch("https://api.origamid.dev/json/transacoes.json");
  const data = await res.json();
  preencherTabela(data.map(toTransacao));
  preencherEstatisticas(data);
}

getData();

function preencherEstatisticas(data: TransacaoAPI[]) {
  const total = document.querySelector("#total span");
  const credito = document.querySelector("#credito span");
  const boleto = document.querySelector("#boleto span");
  const paga = document.querySelector("#paga span");
  const recusada = document.querySelector("#recusada span");
  const estornada = document.querySelector("#estornada span");
  const aguardando = document.querySelector("#aguardando span");

  total ? (total.innerHTML = `R$ ${getTotal(data)}`) : null;
  credito
    ? (credito.innerHTML = `${getTotalBoletoCredito(data).totalCrédito}`)
    : null;
  boleto
    ? (boleto.innerHTML = `${getTotalBoletoCredito(data).totalBoleto}`)
    : null;
  paga ? (paga.innerHTML = `${getStatus(data).totalPaga}`) : null;
  recusada ? (recusada.innerHTML = `${getStatus(data).totalRecusada}`) : null;
  estornada
    ? (estornada.innerHTML = `${getStatus(data).totalEstornada}`)
    : null;
  aguardando
    ? (aguardando.innerHTML = `${getStatus(data).totalAguardando}`)
    : null;
}

function getTotal(data: TransacaoAPI[]) {
  const aux = data.map(toTransacao);
  let total = 0;
  aux.forEach((i) => (total += i.valor));
  return total;
}

function getTotalBoletoCredito(data: TransacaoAPI[]) {
  let totalCrédito = 0;
  let totalBoleto = 0;
  data.forEach((i: TransacaoAPI) =>
    i["Forma de Pagamento"] === "Cartão de Crédito"
      ? totalCrédito++
      : totalBoleto++
  );
  return { totalCrédito, totalBoleto };
}

function getStatus(data: TransacaoAPI[]) {
  let totalPaga = 0;
  let totalRecusada = 0;
  let totalAguardando = 0;
  let totalEstornada = 0;

  data.forEach((i) => {
    switch (i.Status) {
      case "Paga":
        totalPaga++;
        break;
      case "Recusada pela operadora de cartão":
        totalRecusada++;
        break;
      case "Aguardando pagamento":
        totalAguardando++;
        break;
      case "Estornada":
        totalEstornada++;
        break;
      default:
        break;
    }
  });
  return { totalPaga, totalRecusada, totalAguardando, totalEstornada };
}

function preencherTabela(data: Transacao[]) {
  const table = document.querySelector("#table tbody");
  table
    ? data.forEach((i) => {
        table.innerHTML += `
      <tr>
        <td>${i.nome}</td>
        <td>${i.email}</td>
        <td>${i.data}</td>
        <td>R$ ${i.valor}</td>
        <td>${i.pagamento}</td>
        <td>${i.status}</td>
      </tr>
    `;
      })
    : null;
}
