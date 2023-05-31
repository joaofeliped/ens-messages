const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment');
const fs = require('fs').promises;

moment.locale('pt')

const CONTACTS = './contacts.json';

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('Autenticado com sucesso!');
});

client.on('message', (message) => {
  console.log('Nova mensagem recebida:', message.body);
});

const sendMonthlyMessage = async ({ id, name }, message) => {
  try {
    // const chats = await client.getChats()
    // console.log(chats.filter(c => c.isGroup && c.name === 'Test group messages'))
    const chat = await client.getChatById(id);
    await chat.sendMessage(message);
    console.log(`Mensagem enviada com sucesso para ${name}!`);
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${name}:`, error);
  }
};

function buildMessage(date) {
    const message = `💰 Contribuição de ${date} 💰

 Pessoal, estamos começando mais um mês e o melhor momento para pagar as contas 😅
    
 Assim, aproveitamos para lembrar da contribuição da equipe. Pedimos que o valor a ser contribuído seja transferido até o dia 06 (nossa próxima reunião) 
    
 A contribuição, como regra, será um dia de salário do casal por ano, dividido em 10 meses (fevereiro a novembro). Ex: salário mensal do casal de 3.000,00 dividido por 30 dias = 100,00, que dividido em 10 reuniões = 10,00 por reunião.
    
 PIX: 61999714473 (celular)
 Nome: João Felipe Duarte Pessanha
    
 Qualquer dificuldade, estamos à disposição.`;

  return message
}

async function getContacts() {
  try {
    const data = await fs.readFile(CONTACTS, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
    throw error;
  }
}

const sendMonthlyMessages = async () => {
  const now = moment();
  const startOfMonth = moment().startOf('month');

  const contacts = await getContacts()
  //if (now.isSame(startOfMonth, 'day')) {
    contacts.forEach((contact) => {
      sendMonthlyMessage({ 
        id: contact.id, name: contact.name
      }, 
        buildMessage(moment().format('MMMM/YY')));
    });
  //}
};

client.initialize().then(() => {
  sendMonthlyMessages();
});
