export default function toTransacao(transacao) {
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
function toNumber(num) {
    const valor = Number(num.replaceAll(".", "").replace(",", "."));
    return isNaN(valor) ? 0 : valor;
}
function toDate(date) {
    const [data, tempo] = date.split(" ");
    const [day, month, year] = data.split("/").map(Number);
    const [hour, min] = tempo.split(":").map(Number);
    return new Date(year, month - 1, day, hour, min);
}
