const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment');

moment.locale('pt')

// Credenciais de autenticação do WhatsApp Web
const SESSION_FILE_PATH = './session.json';

// Criar uma nova instância do cliente
const client = new Client({
  authStrategy: new LocalAuth()
});

// Evento de geração do código QR
client.on('qr', (qr) => {
  // Exibir o código QR no terminal
  qrcode.generate(qr, { small: true });
});

// Evento de autenticação bem-sucedida
client.on('authenticated', (session) => {
  console.log('Autenticado com sucesso!');
  // Salvar informações da sessão para reutilização futura
  // fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
  //   if (err) {
  //     console.error('Erro ao salvar sessão:', err);
  //   }
  // });
});

// Evento de recebimento de mensagem
client.on('message', (message) => {
  console.log('Nova mensagem recebida:', message.body);
});

// Função para enviar mensagem para um contato específico
const sendMonthlyMessage = async (contactId, message) => {
  try {
    // const chats = await client.getChats()
    // console.log(chats.filter(c => c.isGroup && c.name === 'Test group messages'))
    const chat = await client.getChatById(contactId);
    await chat.sendMessage(message);
    console.log('Mensagem enviada com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
};

// Definir a lista de contatos e mensagens
const contacts = [

];

function buildMessage(date) {
    const message = `💰 Contribuição de ${date} 💰

 Pessoal, estamos começando mais um mês e o melhor momento para pagar as contas 😅
    
 Assim, aproveitamos para lembrar da contribuição da equipe. Pedimos que o valor a ser contribuído seja transferido até o dia 06 (nossa próxima reunião) 
    
 A contribuição, como regra, será um dia de salário do casal por ano, dividido em 10 meses (fevereiro a novembro). Ex: salário mensal do casal de 3.000,00 dividido por 30 dias = 100,00, que dividido em 10 reuniões = 10,00 por reunião.
    
 PIX: 61999714473 (celular)
 Nome: João Felipe Duarte Pessanha
    
 Qualquer coisa estamos a disposição.`;

  return message
}



// Enviar mensagens para os contatos no início do mês
const sendMonthlyMessages = () => {
  const now = moment();
  const startOfMonth = moment().startOf('month');
  //if (now.isSame(startOfMonth, 'day')) {
    contacts.forEach((contact) => {
      sendMonthlyMessage(contact.id, buildMessage(moment().format('MMMM/YY')));
    });
  //}
};

// Inicializar o cliente e enviar as mensagens no início do mês
client.initialize().then(() => {
  sendMonthlyMessages();
});
