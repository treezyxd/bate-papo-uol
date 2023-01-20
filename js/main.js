let nickname;
let message;

let name = prompt('Qual seu nome? ');

let messageList = [];

function getName() {
  if(!nickname) {
    nickname = {
      name
    };
  } else {
    nickname = {
      name: prompt('Digite um nome diferente: ')
    };
  }
}

function verifyName() {
  const nameVerified = axios.post(
    'https://mock-api.driven.com.br/api/v6/uol/participants',
    nickname
  );

  nameVerified.then(validName);
  nameVerified.catch(invalidName);
}

function validName() {
  setInterval(() => {

    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nickname);

  },5000);
}

function invalidName() {
  alert('o nome já está sendo utilizado!');
  // getName();
  // verifyName();
};

getName();
verifyName();

function loadMessages() {
  const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
  promise.then(renderMessages);
}

loadSeconds();

function loadSeconds() {
  setInterval(loadMessages, 3000);
}

let a = "";
let b = "";
let auxiliar = 0;

function renderMessages(messages) {
  document.querySelector(".all-messages").innerHTML = "";
  messageList = [];

  // Alimenta array lista_msg
  let i = 0;
  while (messageList.length < 100) {
    if (!messages.data[i]) {
      break;
    }
    if (messages.data[i].type === "status") {
      message = `<li class="enter-room" data-test="message">
      <div>
      <span class="hour">(${messages.data[i].time})</span><span class="space">l</span><span class="user">${messages.data[i].from}</span><span class="space">l</span><span>${messages.data[i].text}</span></div></li>`;
      messageList.push(message);
    }
    if (messages.data[i].type === "message") {
      message = `<li class="normal-msg" data-test="message"><div><span class="hour">(${messages.data[i].time})</span><span class="space">l</span><span class="user">${messages.data[i].from}</span><span class="space">l</span>para<span class="space">l</span><span class="user">${messages.data[i].to}</span><span>:</span><span class="space">l</span><span>${messages.data[i].text}</span> </div></li>`;
      messageList.push(message);
    }
    if (messages.data[i].type === "private_message") {
      message = `<li class="private-message" data-test="message"><div><span class="hour">(${messages.data[i].time})</span><span class="space">l</span><span class="user">${messages.data[i].from}</span><span class="space">l</span>reservadamente para<span class="space">l</span><span class="user">${messages.data[i].to}</span><span>:</span><span class="space">l</span><span>${messages.data[i].text}</span> </div></li>`;
      if (messages.data[i].to === nickname.name) {
        messageList.push(message);
      }
    }
    i++;
  }

  for (i = 0; i < messageList.length; i++) {
    document.querySelector(".all-messages").innerHTML += messageList[i];
  }
  document.querySelector(
    ".all-messages"
  ).innerHTML += `<div></div>`;
  scrollLastMsg();
}

function scrollLastMsg() {
  const lastMessage = document.querySelector(".all-messages li:nth-last-child(2)");
  if (auxiliar === 0) {
    a = lastMessage.innerHTML;
    auxiliar++;
  } else if (auxiliar === 1) {
    b = lastMessage.innerHTML;
    auxiliar--;
  }
  if (a !== b) {
    lastMessage.scrollIntoView();
  }
}

function sendMessage() {
  const messageValue = document.querySelector(".input-message").value;

  if (messageValue !== "") {
    const send = {
      from: nickname.name,
      to: "Todos",
      text: messageValue,
      type: "message",
    };

    const promise = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/messages",
      send
    );
    promise.then(loadMessages);
    promise.catch(reloadPage);
    messageValue = "";
  } else {
    alert("Você não pode enviar uma message vazia!");
  }
}

function reloadPage() {
  window.location.reload();
}

document.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    sendMessage();
  }
});