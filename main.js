const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('6427471096:AAH3_OuEMSQOLPQ6xCM4TNHManvvPmkjfHM', { polling: true }); //token do bot

const chatId = '-4020413190'; // id do chat ou do grupo, sempre vai ser negativo em grupos
// não mexer

const mensagensEnviadas = [];
const intervaloPosts = (Math.floor(Math.random() * 31) + 15) * 60 * 1000;
const intervaloResumo = 60000 * 60;
const agora = new Date();

const linkAfiliado = 'https://www.exemplo.com';
const textoAfiliado = 'CLIQUE AQUI PARA ABRIR O SITE ';
const linkDuvida = 'https://www.exemplo.com'; 
const textoDuvida = 'DÚVIDAS? CLIQUE AQUI';

const mensagemAfiliado = `➡️[${textoAfiliado}](${linkAfiliado})`;
const mensagemDuvida = `🤷‍♂️ [${textoDuvida}](${linkDuvida})`;

const emojiChecked = "\u2705";
const emojiX = "\u274C";
const emojiWarning = "\u26A0️";
const emojiZzz = "\u1F634";
const emojiExcla = "\u2757";
const emojiAzul = "🔵";
const emojiVermelho = "🔴";

function horarioOff(horaAtual, inicioIntervalo, fimIntervalo) {
  return horaAtual >= inicioIntervalo && horaAtual < fimIntervalo;
}

// Função para escolher aleatoriamente entre "VERMELHA" e "AZUL"
function escolherCarta() {
  return Math.random() < 0.5 ? `VERMELHA ${emojiVermelho}` : `AZUL ${emojiAzul}`;
}


function limparMensagens() {
  mensagensEnviadas.length = 0; // Limpa o array
}


// Função para enviar o resumo das mensagens
function enviarResumoMensagens() {
  const mensagensEspeciais = mensagensEnviadas.filter(mensagem => mensagem.tipo === 'especial');
  const mensagensNormais = mensagensEnviadas.filter(mensagem => mensagem.tipo === 'normal');
  const horariosEspeciais = mensagensEspeciais.map(mensagem => `❌(${mensagem.horario})`).join('\n');
  const horariosNormais = mensagensNormais.map(mensagem => `✅(${mensagem.horario})`).join('\n');

  const resumoMensagens = `ENTRADAS FEITAS:\n${horariosNormais}\n${horariosEspeciais}`;
  bot.sendMessage(chatId, resumoMensagens);

  limparMensagens();
}

if (horarioOff(agora.getHours(), 4, 10)) {
  bot.sendMessage(chatId, `${emojiZzz}*SCOTT ESTÁ OFFLINE*${emojiZzz}`, { parse_mode: 'Markdown' });
  bot.sendMessage(chatId, `${emojiExcla}*RETORNE DENTRO DO HORÁRIO DE FUNCIONAMENTO* (10:00 AM - 4:00 AM)${emojiExcla}`, { parse_mode: 'Markdown' });
} else {
  bot.sendMessage(chatId, `${emojiChecked}*SCOTT ESTÁ ONLINE*${emojiChecked}`, { parse_mode: 'Markdown' });

  let contadorMensagens = 1;

  // Função para enviar uma mensagem constante
  function enviarMensagemInicio() {
    bot.sendMessage(chatId, `${emojiWarning}*BOT SCOTT ENCONTROU UMA OPORTUNIDADE! ${emojiWarning}*`, { parse_mode: 'Markdown' });
  }

  // Função para enviar uma mensagem
  function enviarMensagem(tipo) {
      const mensagem = {
        tipo,
        horario: `${contadorMensagens}º - ${new Date().toLocaleTimeString().substring(0, 5)}`,
      };
      contadorMensagens++;
      enviarMensagemInicio();
      const cartaEscolhida = escolherCarta();
      bot.sendMessage(chatId, `ENTRADA CONFIRMADA: * ${new Date().toLocaleTimeString().substring(0, 5)}*\nENTRAR *${cartaEscolhida}* AS *${new Date(new Date().getTime() + 60000).toLocaleTimeString().substring(0, 5)}*\nAVISO: LEMBREM DE COBRIR O EMPATE COM 25% DO VALOR DA APOSTA\nRECOMENDAÇÃO DA BANCA: 20 REAIS\n ${mensagemAfiliado}\n ${mensagemDuvida}`, { parse_mode: 'Markdown' });
      mensagensEnviadas.push(mensagem);
    
  }

  const tipoPost = Math.random() < 0.2 ? 'especial' : 'normal';

  const intervaloMensagens = setInterval(() => {
    enviarMensagem(tipoPost);
    if (agora.getHours() === 0 && agora.getMinutes() === 0) {
      clearInterval(intervaloMensagens);
      enviarResumoMensagens();
    }
  }, intervaloPosts);

  setInterval(enviarResumoMensagens, intervaloResumo);
}
